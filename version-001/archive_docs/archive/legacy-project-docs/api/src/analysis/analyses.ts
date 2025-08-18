import { and, desc, eq } from "drizzle-orm";
import { Request, Response, Router } from "express";
import { auth } from "../auth/auth";
import { db } from "../db";
import { brandAnalyses } from "../db/schema";
import {
	AuthenticationError,
	NotFoundError,
	ValidationError,
	handleApiError,
} from "../lib/api-errors";

const getSessionWithBypass = async (req: Request) => {
	if (process.env.DISABLE_AUTH === "true") {
		console.log(
			`[AUTH] DISABLE_AUTH active in analyses.ts. Using dummy session for ${req.method} ${req.originalUrl}`
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
		`[AUTH] Fetching real session in analyses.ts for ${req.method} ${req.originalUrl}`
	);
	return await auth.api.getSession({ headers: req.headers as any });
};

const router = Router();

// GET /api/analysis/analyses - Get user's brand analyses
router.get("/", async (req: Request, res: Response) => {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError("Please log in to view your analyses");
		}
		console.log(
			`[ANALYSIS] Starting analysis for user: ${session?.user?.id || "unknown"} on ${req.method} ${req.originalUrl}`
		);

		const analyses = await db.query.brandAnalyses.findMany({
			where: eq(brandAnalyses.userId, session.user.id),
			orderBy: desc(brandAnalyses.createdAt),
		});

		res.json(analyses);
	} catch (error) {
		const handledError = handleApiError(error);
		res.status(handledError.status).json(handledError.body);
	}
});

// GET /api/analysis/analyses/:id - Get a specific analysis
router.get("/:id", async (req: Request, res: Response) => {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError("Please log in to view this analysis");
		}
		console.log(
			`[ANALYSIS] Starting analysis for user: ${session?.user?.id || "unknown"} on ${req.method} ${req.originalUrl}`
		);

		const { id } = req.params;

		const analysis = await db.query.brandAnalyses.findFirst({
			where: and(
				eq(brandAnalyses.id, id),
				eq(brandAnalyses.userId, session.user.id)
			),
		});

		if (!analysis) {
			throw new NotFoundError("Analysis");
		}

		res.json(analysis);
	} catch (error) {
		const handledError = handleApiError(error);
		res.status(handledError.status).json(handledError.body);
	}
});

// POST /api/analysis/analyses - Save a new brand analysis
router.post("/", async (req: Request, res: Response) => {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError("Please log in to save analyses");
		}
		console.log(
			`[ANALYSIS] Starting analysis for user: ${session?.user?.id || "unknown"} on ${req.method} ${req.originalUrl}`
		);

		const body = req.body;

		if (!body.url) {
			throw new ValidationError("URL is required");
		}
		if (!body.analysisData) {
			throw new ValidationError("Analysis data is required");
		}

		const [analysis] = await db
			.insert(brandAnalyses)
			.values({
				userId: session.user.id,
				url: body.url,
				companyName: body.companyName,
				industry: body.industry,
				analysisData: body.analysisData,
				competitors: body.competitors,
				creditsUsed: body.creditsUsed || 10, // Default credits used
			})
			.returning();

		res.json(analysis);
	} catch (error) {
		const handledError = handleApiError(error);
		res.status(handledError.status).json(handledError.body);
	}
});

// DELETE /api/analysis/analyses/:id - Delete an analysis
router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError("Please log in to delete this analysis");
		}
		console.log(
			`[ANALYSIS] Starting analysis for user: ${session?.user?.id || "unknown"} on ${req.method} ${req.originalUrl}`
		);

		const { id } = req.params;

		const result = await db
			.delete(brandAnalyses)
			.where(
				and(eq(brandAnalyses.id, id), eq(brandAnalyses.userId, session.user.id))
			)
			.returning();

		if (result.length === 0) {
			throw new NotFoundError("Analysis");
		}

		res.json({ success: true });
	} catch (error) {
		const handledError = handleApiError(error);
		res.status(handledError.status).json(handledError.body);
	}
});

export const analysesRouter = router;
