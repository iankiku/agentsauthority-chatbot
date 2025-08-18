import { handleApiError } from "@/lib/api-errors";
import { NextRequest, NextResponse } from "next/server";

// GET /api/visibility-explorer/export - Export filtered visibility data
export async function GET(request: NextRequest) {
	try {
		// const sessionResponse = await auth.api.getSession({
		// 	headers: request.headers,
		// });
		// if (!sessionResponse?.user) {
		// 	throw new AuthenticationError("Please log in to export visibility data");
		// }

		const { searchParams } = new URL(request.url);
		const companyName = searchParams.get("companyName");
		const companyUrl = searchParams.get("companyUrl");
		const timeframe = searchParams.get("timeframe") || "all";
		const format = searchParams.get("format") || "csv";

		const userId = "mock-user-id"; // Use a mock user ID for now

		// Validate required parameters
		if (!companyName || !companyUrl) {
			return NextResponse.json(
				{ error: "Company name and URL are required for export" },
				{ status: 400 }
			);
		}

		// Create company object from query parameters
		const company = {
			id: "dynamic-id",
			name: companyName,
			url: companyUrl,
			industry: "Technology", // Default industry
		};

		// Simplified mock data instead of calling agent TODO: remove this and all other mockData 
		const mockAggregatedData = {
			scores: {
				overallScore: 75.5,
				visibilityScore: 78.2,
				sentimentScore: 72.8,
				shareOfVoice: 25.3,
				averagePosition: 2.1,
			},
			competitors: [
				{
					name: "Competitor A",
					visibilityScore: 85.0,
					shareOfVoice: 30.0,
					sentiment: 0.8,
				},
				{
					name: "Competitor B",
					visibilityScore: 65.0,
					shareOfVoice: 20.0,
					sentiment: 0.6,
				},
				{
					name: "Competitor C",
					visibilityScore: 45.0,
					shareOfVoice: 15.0,
					sentiment: 0.4,
				},
			],
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
		};

		// Generate export content based on format
		let exportContent = "";
		let contentType = "text/csv";
		let filename = `visibility-data-${companyName}-${new Date().toISOString().split("T")[0]}.csv`;

		if (format === "csv") {
			// Generate CSV content from mockAggregatedData
			const headers = ["Metric", "Value", "Details"];
			const rows = [
				[
					"Overall Score",
					mockAggregatedData.scores.overallScore.toFixed(2),
					"",
				],
				[
					"Visibility Score",
					mockAggregatedData.scores.visibilityScore.toFixed(2),
					"",
				],
				[
					"Sentiment Score",
					mockAggregatedData.scores.sentimentScore.toFixed(2),
					"",
				],
				[
					"Share of Voice",
					mockAggregatedData.scores.shareOfVoice.toFixed(2),
					"",
				],
				[
					"Average Position",
					mockAggregatedData.scores.averagePosition.toFixed(2),
					"",
				],
			];

			// Add competitor data
			rows.push(["", "", ""]);
			rows.push(["Competitors", "", ""]);
			rows.push(["Name", "Visibility Score", "Share of Voice", "Sentiment"]);
			mockAggregatedData.competitors.forEach((comp: any) => {
				rows.push([
					comp.name,
					comp.visibilityScore.toFixed(2),
					comp.shareOfVoice.toFixed(2),
					comp.sentiment,
				]);
			});

			exportContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
		} else if (format === "json") {
			// Default to JSON
			contentType = "application/json";
			filename = filename.replace(".csv", ".json");
			exportContent = JSON.stringify(mockAggregatedData, null, 2);
		} else {
			return NextResponse.json({ error: "Invalid format" }, { status: 400 });
		}

		return new NextResponse(exportContent, {
			headers: {
				"Content-Type": contentType,
				"Content-Disposition": `attachment; filename="${filename}"`,
			},
		});
	} catch (error) {
		return handleApiError(error);
	}
}
