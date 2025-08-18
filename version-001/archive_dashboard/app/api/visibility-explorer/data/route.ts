import { AuthenticationError, handleApiError } from "@/lib/api-errors";
import { auth } from "@/lib/auth-utils"; // Import auth
import {
	getRecentVisibilityScan,
	saveVisibilityScanResult,
} from "@/lib/db/queries"; // Import new DB functions
import { callAgentApi } from "@/lib/mastra-client"; // Import new agent utility
import { NextRequest, NextResponse } from "next/server";

// GET /api/visibility-explorer/data - Get aggregated visibility data
export async function GET(request: NextRequest) {
	try {
		const sessionResponse = await auth.api.getSession({
			headers: request.headers,
		});

		if (!sessionResponse?.user) {
			throw new AuthenticationError("Please log in to view visibility data");
		}
		const userId = sessionResponse.user.id; // Use real user ID
		console.log("request data endpoint");

		const companyName = request.nextUrl.searchParams.get("companyName");
		const companyUrl = request.nextUrl.searchParams.get("companyUrl");
		const timeframe = request.nextUrl.searchParams.get("timeframe") || "30d";

		if (!companyName || !companyUrl) {
			return NextResponse.json(
				{ error: "Company name and URL are required" },
				{ status: 400 }
			);
		}

		// Check for recent scan
		const recentScan = await getRecentVisibilityScan(
			userId,
			companyName,
			companyUrl,
			timeframe
		);

		if (recentScan) {
			console.log(
				`Returning cached visibility analysis for ${companyName} (${timeframe})`
			);
			return NextResponse.json({
				success: true,
				data: recentScan.scanData,
				company: { id: "dynamic-id", name: companyName, url: companyUrl }, // Re-add company object for consistency
				timeframe: timeframe,
			});
		}

		// If no recent scan, perform a live scan (mocked for now)
		console.log(`Performing live visibility analysis for ${companyName}`);
		const prompt = `Analyze the visibility data for company "${companyName}" (${companyUrl}) for the timeframe ${timeframe}. Provide aggregated scores, competitor analysis, key mentions, provider breakdown, and trends.`;
		const liveScanResult = await callAgentApi({
			agentName: "visibilityAnalysisAgent",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			method: "generate", // Explicitly pass generate method
		});

		// Save live scan result to the database
		await saveVisibilityScanResult(
			userId,
			companyName,
			companyUrl,
			timeframe,
			liveScanResult
		);

		return NextResponse.json({
			success: true,
			data: liveScanResult,
			company: { id: "dynamic-id", name: companyName, url: companyUrl }, // Re-add company object for consistency
			timeframe: timeframe,
		});
	} catch (error) {
		return handleApiError(error);
	}
}
