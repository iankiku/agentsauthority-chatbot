import { handleApiError } from "@/lib/api-errors";
import { NextRequest, NextResponse } from "next/server";

// POST /api/visibility-explorer/filter - Apply filters to visibility data
export async function POST(request: NextRequest) {
	try {
		// const sessionResponse = await auth.api.getSession({
		// 	headers: request.headers,
		// });
		// if (!sessionResponse?.user) {
		// 	throw new AuthenticationError("Please log in to filter visibility data");
		// }

		const { providers, dateRange, companyName, companyUrl } =
			await request.json();

		const userId = "mock-user-id"; // Use a mock user ID for now

		// Validate required parameters
		if (!companyName || !companyUrl) {
			return NextResponse.json(
				{ error: "Company name and URL are required" },
				{ status: 400 }
			);
		}

		// Create company object from request parameters
		const company = {
			id: "dynamic-id",
			name: companyName,
			url: companyUrl,
			industry: "Technology", // Default industry
		};

		// Determine timeframe from dateRange
		let timeframe = "all";
		if (dateRange?.from && dateRange?.to) {
			const fromDate = new Date(dateRange.from);
			const toDate = new Date(dateRange.to);
			const daysDiff = Math.ceil(
				(toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
			);
			timeframe = `${daysDiff}d`;
		}

		// Simplified mock response instead of calling agent TODO: remove this and all other mockData 
		const mockFilteredData = {
			visibilityScore: 75,
			shareOfVoice: 25,
			mentions: [
				{
					source: "web",
					url: "https://example.com/news/1",
					snippet: "Example Corp launches new AI platform",
					sentiment: 0.8,
					isAiGenerated: false,
					confidence: 0.9,
				},
				{
					source: "social",
					url: "https://twitter.com/example/status/123",
					snippet: "Great news from Example Corp!",
					sentiment: 0.6,
					isAiGenerated: false,
					confidence: 0.7,
				},
			],
			competitors: [
				{ name: "Competitor A", visibilityScore: 85, shareOfVoice: 30 },
				{ name: "Competitor B", visibilityScore: 65, shareOfVoice: 20 },
				{ name: "Competitor C", visibilityScore: 45, shareOfVoice: 15 },
			],
			providers: {
				OpenAI: { mentions: 15, sentiment: 0.7 },
				Anthropic: { mentions: 8, sentiment: 0.6 },
				Google: { mentions: 12, sentiment: 0.8 },
			},
			trends: {
				visibilityChange: "+5%",
				mentionGrowth: "+12%",
				sentimentImprovement: "+0.1",
			},
		};

		return NextResponse.json({
			success: true,
			data: mockFilteredData,
			filters: {
				providers,
				dateRange,
				company,
				timeframe,
			},
		});
	} catch (error) {
		return handleApiError(error);
	}
}
