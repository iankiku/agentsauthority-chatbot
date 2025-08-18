import { auth } from "@/lib/auth-utils";
import { scrapeCompanyInfo } from "@/lib/scrape-utils";
import { BrandAnalysisService } from "@/lib/services/brand-analysis-service";
import { CompanyService } from "@/lib/services/company-service";
import { uuidv4 } from "@workspace/utils";
import { NextRequest } from "next/server";
import { jobStore } from "../../agent-status/[jobId]/route";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { companyName, industry, timeframe, companyUrl } = body; // Add companyUrl

		const sessionResponse = await auth.api.getSession({
			headers: request.headers,
		});

		if (!sessionResponse?.user) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = sessionResponse.user.id;

		// Check if company already exists
		let company = await CompanyService.findCompanyByUrl(userId, companyUrl);

		if (company) {
			// Check for recent analysis
			const recentAnalysis = await CompanyService.getLatestAnalysis(
				userId,
				company.id
			);

			if (recentAnalysis && recentAnalysis.createdAt) {
				const hoursSinceAnalysis =
					(Date.now() - new Date(recentAnalysis.createdAt).getTime()) /
					(1000 * 60 * 60);

				// Return cached analysis if less than 24 hours old
				if (hoursSinceAnalysis < 24) {
					console.log(`Returning cached analysis for ${companyName}`);
					return Response.json({
						jobId: uuidv4(),
						status: "completed",
						result: recentAnalysis,
						statusUrl: `/api/agent-status/${uuidv4()}`,
					});
				}
			}
		}

		// Generate a unique job ID
		const jobId = uuidv4();

		// Initialize job status
		jobStore.set(jobId, {
			status: "pending",
			progress: 0,
			result: undefined,
			error: undefined,
			createdAt: new Date(),
		});

		// Start asynchronous processing
		processAnalysisAsync(
			jobId,
			userId,
			companyName,
			industry,
			timeframe,
			companyUrl
		); // Pass userId and companyUrl

		// Return job ID immediately
		return Response.json({
			jobId,
			status: "pending",
			statusUrl: `/api/agent-status/${jobId}`,
		});
	} catch (error) {
		console.error("Error starting analysis:", error);
		return Response.json(
			{ error: "Failed to start analysis" },
			{ status: 500 }
		);
	}
}

async function processAnalysisAsync(
	jobId: string,
	userId: string,
	companyName: string,
	industry: string,
	timeframe: string,
	companyUrl: string
) {
	try {
		const job = jobStore.get(jobId);
		if (!job) return;

		const updateProgress = (progress: number, stage: string) => {
			const job = jobStore.get(jobId);
			if (job) {
				job.progress = progress;
				job.status = "processing";
				(job as any).stage = stage;
				jobStore.set(jobId, job);
			}
		};

		// Step 1: Brand Discovery
		updateProgress(15, "Brand Discovery");
		let company = await CompanyService.findCompanyByUrl(userId, companyUrl);

		if (!company) {
			// Scrape company info
			const scrapedCompany = await scrapeCompanyInfo(companyUrl);

			// Create company
			company = await CompanyService.createCompany(userId, {
				name: companyName,
				url: companyUrl,
				industry: industry,
				description: scrapedCompany.description,
				logo: scrapedCompany.logo,
				favicon: scrapedCompany.favicon,
				scrapedData: scrapedCompany.scrapedData,
			});
		}

		// Step 2: Competitor Research
		updateProgress(30, "Competitor Research");
		await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate competitor research

		// Step 3: Visibility Scanning
		updateProgress(50, "Visibility Scanning");
		const analysisResult = await BrandAnalysisService.runCompleteAnalysis(
			userId,
			company,
			(progress) => {
				const currentProgress = 50 + progress.progress * 0.3; // Scale to 50-80%
				updateProgress(currentProgress, "Visibility Scanning");
			}
		);

		// Step 4: Trend Analysis
		updateProgress(80, "Trend Analysis");
		await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate trend analysis

		// Step 5: Audience Insights
		updateProgress(90, "Audience Insights");
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate audience analysis

		// Step 6: Report Generation
		updateProgress(95, "Report Generation");

		// Save analysis to database
		await CompanyService.createBrandAnalysis(
			userId,
			company.id,
			analysisResult
		);

		// Final completion
		updateProgress(100, "Analysis Complete");
		const finalJob = jobStore.get(jobId);
		if (finalJob) {
			finalJob.status = "completed";
			finalJob.result = {
				...analysisResult,
				company,
				completedAt: new Date(),
			};
			jobStore.set(jobId, finalJob);
		}

		console.log(`Analysis completed for job ${jobId}`);
	} catch (error) {
		console.error(`Error processing analysis for job ${jobId}:`, error);

		const job = jobStore.get(jobId);
		if (job) {
			job.status = "failed";
			if (error instanceof Error) {
				if (error.message.includes("Payment Required")) {
					job.error =
						"Analysis failed: Insufficient AI credits. Please top up your account or try a different model.";
				} else if (error.message.includes("Agent API Error")) {
					job.error = `Analysis failed: ${error.message.replace("Agent API Error: ", "")}`;
				} else {
					job.error = `Analysis failed: ${error.message}`;
				}
			} else {
				job.error = "Analysis failed: An unknown error occurred.";
			}
			jobStore.set(jobId, job);
		}
	}
}
