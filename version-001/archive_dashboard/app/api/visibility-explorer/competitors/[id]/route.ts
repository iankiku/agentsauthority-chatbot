import { AuthenticationError, handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth-utils"; // Import auth
import {
	getRecentCompetitorAnalysis,
	saveCompetitorAnalysisResult,
} from "@/lib/db/queries"; // Import new DB functions
import { callAgentApi } from "@/lib/mastra-client"; // Import new agent utility
import { NextRequest, NextResponse } from "next/server";

// GET /api/visibility-explorer/competitors/[id] - Get detailed data for a specific competitor
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const sessionResponse = await auth.api.getSession({
			headers: request.headers,
		});

		if (!sessionResponse?.user) {
			throw new AuthenticationError("Please log in to view competitor data");
		}

		const { id: competitorName } = await params; // Await params and rename id to competitorName for clarity
		const { searchParams } = new URL(request.url);
		const companyName = searchParams.get("companyName");
		const companyUrl = searchParams.get("companyUrl");
		const timeframe = searchParams.get("timeframe") || "all";

		const userId = sessionResponse.user.id; // Use real user ID

		// Validate input for company info
		if (!companyName || !companyUrl) {
			return NextResponse.json(
				{
					error: "Company name and URL are required to get competitor details.",
				},
				{ status: 400 }
			);
		}

		// Check for recent scan
		const recentAnalysis = await getRecentCompetitorAnalysis(
			userId,
			companyName,
			companyUrl,
			competitorName,
			timeframe
		);

		if (recentAnalysis) {
			console.log(
				`Returning cached competitor analysis for ${competitorName} (${timeframe})`
			);
			return NextResponse.json({
				success: true,
				data: recentAnalysis.analysisData,
				competitor: competitorName,
				company: { id: "dynamic-id", name: companyName, url: companyUrl }, // Dynamically create company object
				timeframe: timeframe,
			});
		}

		const prompt = `Perform a detailed competitor analysis for "${competitorName}" against "${companyName}" (${companyUrl}) for the timeframe ${timeframe}. Provide insights on visibility score, share of voice, rank, mentions, trends, strengths, and weaknesses.`;
		const liveAnalysisResult = await callAgentApi({
			agentName: "competitorAnalysisAgent",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			method: "generate", // Explicitly pass generate method
		});

		// Save live analysis result to the database
		await saveCompetitorAnalysisResult(
			userId,
			companyName,
			companyUrl,
			competitorName,
			timeframe,
			liveAnalysisResult
		);

		return NextResponse.json({
			success: true,
			data: liveAnalysisResult,
			competitor: competitorName,
			company: { id: "dynamic-id", name: companyName, url: companyUrl }, // Dynamically create company object
			timeframe: timeframe,
		});
	} catch (error) {
		return handleApiError(error);
	}
}
