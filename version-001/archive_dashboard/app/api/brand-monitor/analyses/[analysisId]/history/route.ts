import { handleApiError } from "@/lib/api-errors";
import { NextRequest, NextResponse } from "next/server";

// GET /api/brand-monitor/analyses/[analysisId]/history - Get historical snapshots
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ analysisId: string }> }
) {
	try {
		// const sessionResponse = await auth.api.getSession({
		// 	headers: request.headers,
		// });
		// if (!sessionResponse?.user) {
		// 	throw new AuthenticationError("Please log in to view analysis history");
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
				createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
				visibilityScore: 75,
				shareOfVoice: 25,
				competitorData: {
					competitors: [
						{ name: "Competitor A", visibilityScore: 85, shareOfVoice: 30 },
						{ name: "Competitor B", visibilityScore: 65, shareOfVoice: 20 },
					],
				},
				providerBreakdown: {
					OpenAI: { mentions: 15, sentiment: 0.7 },
					Anthropic: { mentions: 8, sentiment: 0.6 },
					Google: { mentions: 12, sentiment: 0.8 },
				},
				analysisMetadata: {
					sources: ["web", "social", "news"],
					timeframe: "7d",
				},
				isLatest: false,
			},
			{
				id: "snapshot-2",
				userId: userId,
				analysisId: analysisId,
				brandUrl: "https://example.com",
				createdAt: new Date(
					Date.now() - 14 * 24 * 60 * 60 * 1000
				).toISOString(), // 14 days ago
				visibilityScore: 72,
				shareOfVoice: 23,
				competitorData: {
					competitors: [
						{ name: "Competitor A", visibilityScore: 82, shareOfVoice: 28 },
						{ name: "Competitor B", visibilityScore: 68, shareOfVoice: 22 },
					],
				},
				providerBreakdown: {
					OpenAI: { mentions: 12, sentiment: 0.6 },
					Anthropic: { mentions: 6, sentiment: 0.5 },
					Google: { mentions: 10, sentiment: 0.7 },
				},
				analysisMetadata: {
					sources: ["web", "social", "news"],
					timeframe: "14d",
				},
				isLatest: false,
			},
			{
				id: "snapshot-3",
				userId: userId,
				analysisId: analysisId,
				brandUrl: "https://example.com",
				createdAt: new Date(
					Date.now() - 30 * 24 * 60 * 60 * 1000
				).toISOString(), // 30 days ago
				visibilityScore: 68,
				shareOfVoice: 20,
				competitorData: {
					competitors: [
						{ name: "Competitor A", visibilityScore: 78, shareOfVoice: 25 },
						{ name: "Competitor B", visibilityScore: 70, shareOfVoice: 18 },
					],
				},
				providerBreakdown: {
					OpenAI: { mentions: 10, sentiment: 0.5 },
					Anthropic: { mentions: 5, sentiment: 0.4 },
					Google: { mentions: 8, sentiment: 0.6 },
				},
				analysisMetadata: {
					sources: ["web", "social", "news"],
					timeframe: "30d",
				},
				isLatest: false,
			},
		];

		// Filter by timeframe if specified
		let filteredSnapshots = mockSnapshots;
		if (timeframe !== "all") {
			const days = parseInt(timeframe.replace("d", ""));
			if (!isNaN(days)) {
				const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
				filteredSnapshots = mockSnapshots.filter(
					(snapshot) => new Date(snapshot.createdAt) >= dateThreshold
				);
			}
		}

		return NextResponse.json({
			success: true,
			data: filteredSnapshots,
			timeframe,
			total: filteredSnapshots.length,
		});
	} catch (error) {
		return handleApiError(error);
	}
}
