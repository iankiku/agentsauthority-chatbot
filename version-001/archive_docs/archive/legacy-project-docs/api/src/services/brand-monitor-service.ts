import { Autumn } from "autumn-js";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { auth } from "../auth/auth";
import { db } from "../db";
import { brandAnalyses } from "../db/schema";
import { performAnalysis } from "../lib/analyze-common";
import { AuthenticationError, ValidationError } from "../lib/api-errors";
import { scrapeCompanyInfo } from "../lib/scrape-utils";

// Initialize Autumn client only if secret key is available
const autumnClient = process.env.AUTUMN_SECRET_KEY
	? new Autumn({ secretKey: process.env.AUTUMN_SECRET_KEY })
	: null;

const ERROR_MESSAGES = {
	COMPANY_INFO_REQUIRED: "Company information is required to start analysis",
	INVALID_URL: "Please provide a valid URL",
	ANALYSIS_FAILED: "Analysis failed. Please try again.",
};

const getSessionWithBypass = async (req: any) => {
	if (process.env.DISABLE_AUTH === "true") {
		console.log(
			`[AUTH] DISABLE_AUTH active in brand-monitor-service.ts. Using dummy session for ${req.method} ${req.originalUrl}`
		);
		return {
			user: {
				id: "test-user-id",
				email: "test@example.com",
				name: "Test User",
			},
		};
	}
	console.log(
		`[AUTH] Fetching real session in brand-monitor-service.ts for ${req.method} ${req.originalUrl}`
	);
	return await auth.api.getSession({ headers: req.headers as any });
};

export async function handleScrape(req: Request, res: Response) {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError("Please log in to use this feature");
		}

		const { url, maxAge } = req.body;

		if (!url) {
			throw new ValidationError("URL is required");
		}

		const company = await scrapeCompanyInfo(url, maxAge);

		if (!company.name) {
			throw new ValidationError("Company name is required");
		}

		res.json(company);
	} catch (error) {
		console.error("[Brand Monitor] Scrape error:", error);
		res.status(500).json({ error: ERROR_MESSAGES.ANALYSIS_FAILED });
	}
}

export async function handleAnalyze(req: Request, res: Response) {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError("Please log in to use this feature");
		}

		const { url, customPrompts, userSelectedCompetitors, useWebSearch } =
			req.body;

		if (!url) {
			throw new ValidationError("URL is required");
		}

		// Set up SSE headers
		res.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Cache-Control",
		});

		const sendEvent = async (event: any) => {
			const eventData = `data: ${JSON.stringify(event)}\n\n`;
			res.write(eventData);
		};

		// Send initial credits event
		await sendEvent({
			type: "analysis_start",
			stage: "initializing",
			progress: 0,
			message: "Starting analysis...",
		});

		try {
			// Scrape company info
			const scrapedCompany = await scrapeCompanyInfo(url);

			// Ensure company has required id field and all required properties
			const company = {
				id: crypto.randomUUID(),
				url: scrapedCompany.url,
				name: scrapedCompany.name,
				description: scrapedCompany.description,
				industry: scrapedCompany.industry,
				scraped: scrapedCompany.scraped,
				scrapedData: {
					title: scrapedCompany.scrapedData?.title || scrapedCompany.name,
					description:
						scrapedCompany.scrapedData?.description ||
						scrapedCompany.description,
					keywords: [],
					mainContent: scrapedCompany.scrapedData?.mainContent || "",
					mainProducts: [],
					competitors: [],
					ogImage: scrapedCompany.scrapedData?.ogImage,
					favicon: scrapedCompany.scrapedData?.favicon,
				},
			};

			// Perform analysis
			const result = await performAnalysis({
				company,
				customPrompts,
				userSelectedCompetitors,
				useWebSearch,
				sendEvent,
			});

			// Save analysis to database
			const [analysis] = await db
				.insert(brandAnalyses)
				.values({
					userId: session.user.id,
					url,
					companyName: company.name,
					industry: company.industry,
					analysisData: result,
					competitors: result.competitors,
					creditsUsed: 10, // Default credits for analysis
				})
				.returning();

			// Send completion event
			await sendEvent({
				type: "analysis_complete",
				stage: "complete",
				progress: 100,
				message: "Analysis completed successfully",
				analysisId: analysis.id,
			});

			res.end();
		} catch (error) {
			await sendEvent({
				type: "analysis_error",
				stage: "error",
				progress: 0,
				message: error instanceof Error ? error.message : "Analysis failed",
			});
			res.end();
		}
	} catch (error) {
		console.error("[Brand Monitor] Analyze error:", error);
		res.status(500).json({ error: ERROR_MESSAGES.ANALYSIS_FAILED });
	}
}

export async function handleGetAnalyses(req: Request, res: Response) {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError("Please log in to view your analyses");
		}

		const analyses = await db.query.brandAnalyses.findMany({
			where: eq(brandAnalyses.userId, session.user.id),
		});

		res.json(analyses);
	} catch (error) {
		console.error("[Brand Monitor] Get analyses error:", error);
		res.status(500).json({ error: "Failed to fetch analyses" });
	}
}

export async function handleGetAnalysis(req: Request, res: Response) {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError("Please log in to view this analysis");
		}

		const { id } = req.params;

		const analysis = await db.query.brandAnalyses.findFirst({
			where: and(
				eq(brandAnalyses.id, id),
				eq(brandAnalyses.userId, session.user.id)
			),
		});

		if (!analysis) {
			throw new ValidationError("Analysis not found");
		}

		res.json(analysis);
	} catch (error) {
		console.error("[Brand Monitor] Get analysis error:", error);
		res.status(500).json({ error: "Failed to fetch analysis" });
	}
}

export async function handleDeleteAnalysis(req: Request, res: Response) {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError("Please log in to delete this analysis");
		}

		const { id } = req.params;

		const result = await db
			.delete(brandAnalyses)
			.where(
				and(eq(brandAnalyses.id, id), eq(brandAnalyses.userId, session.user.id))
			)
			.returning();

		if (result.length === 0) {
			throw new ValidationError("Analysis not found");
		}

		res.json({ success: true });
	} catch (error) {
		console.error("[Brand Monitor] Delete analysis error:", error);
		res.status(500).json({ error: "Failed to delete analysis" });
	}
}
