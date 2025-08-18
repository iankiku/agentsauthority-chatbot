import { handleApiError } from "@/lib/api-errors";
import { NextRequest, NextResponse } from "next/server";

// GET /api/brand-monitor/analyses/[analysisId]/trends - Get trend data for analysis
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ analysisId: string }> }
) {
	try {
		// const sessionResponse = await auth.api.getSession({
		// 	headers: request.headers,
		// });
		// if (!sessionResponse?.user) {
		// 	throw new AuthenticationError("Please log in to view analysis trends");
		// }

		const { analysisId } = await params;
		const { searchParams } = new URL(request.url);
		const timeframe = searchParams.get("timeframe") || "all";

		const userId = "mock-user-id"; // Use a mock user ID for now

		// Simplified mock data instead of database query
		const mockSnapshots = [
			{
				id: "snapshot-1",
				userId: userId,
				analysisId: analysisId,
				brandUrl: "https://example.com",
				createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
				visibilityScore: "75",
				shareOfVoice: "25",
			},
			{
				id: "snapshot-2",
				userId: userId,
				analysisId: analysisId,
				brandUrl: "https://example.com",
				createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
				visibilityScore: "72",
				shareOfVoice: "23",
			},
			{
				id: "snapshot-3",
				userId: userId,
				analysisId: analysisId,
				brandUrl: "https://example.com",
				createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
				visibilityScore: "70",
				shareOfVoice: "21",
			},
			{
				id: "snapshot-4",
				userId: userId,
				analysisId: analysisId,
				brandUrl: "https://example.com",
				createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
				visibilityScore: "68",
				shareOfVoice: "20",
			},
		];

		// Filter by timeframe if specified
		let filteredSnapshots = mockSnapshots;
		if (timeframe !== "all") {
			const days = parseInt(timeframe.replace("d", ""));
			if (!isNaN(days)) {
				const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
				filteredSnapshots = mockSnapshots.filter(
					(snapshot) => snapshot.createdAt >= dateThreshold
				);
			}
		}

		const visibilityTrend = filteredSnapshots.map((s) => ({
			date: s.createdAt.toISOString(),
			score: parseFloat(s.visibilityScore),
		}));

		const shareOfVoiceTrend = filteredSnapshots.map((s) => ({
			date: s.createdAt.toISOString(),
			percentage: parseFloat(s.shareOfVoice),
		}));

		return NextResponse.json({
			success: true,
			data: { visibilityTrend, shareOfVoiceTrend },
			timeframe,
			total: filteredSnapshots.length,
		});
	} catch (error) {
		return handleApiError(error);
	}
}
