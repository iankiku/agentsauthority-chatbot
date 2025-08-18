import { auth } from "@/lib/auth-utils";
import { AuthenticationError, handleApiError } from "@/lib/api-errors";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const sessionResponse = await auth.api.getSession({
			headers: request.headers,
		});

		if (!sessionResponse?.user) {
			throw new AuthenticationError("Please log in to use the reports chat");
		}

		const userId = sessionResponse.user.id;
		const { messages } = await request.json();

		console.log(`Reports chat request from user ${userId}`);

		// Create a system prompt for reports generation
		const systemPrompt = `You are a Custom Reports Generation Assistant. You help users create comprehensive reports, export data, and generate stakeholder presentations based on their brand performance data.

Your capabilities include:
1. **Performance Reports**: Generate detailed performance analysis reports with metrics and insights
2. **Growth Analysis**: Create month-over-month, quarter-over-quarter growth reports
3. **Competitive Reports**: Generate competitor benchmarking and market analysis reports
4. **Executive Summaries**: Create stakeholder-ready executive summaries and presentations
5. **Data Export**: Help users export data in various formats (PDF, Excel, CSV, PowerPoint)
6. **Scheduled Reports**: Set up automated reporting schedules and templates
7. **Custom Analysis**: Create tailored reports based on specific business needs

When users request reports:
- Acknowledge that you're accessing their performance data
- Provide structured, professional report content
- Include key metrics, insights, and recommendations
- Suggest appropriate formats and export options
- Offer follow-up analysis and deeper dives

For report generation queries, you can reference:
- Brand performance metrics and KPIs
- Competitive analysis and benchmarking data
- Platform-specific performance breakdowns
- Growth trends and forecasting
- ROI analysis and optimization recommendations
- Executive-level insights and strategic guidance

Always be professional, data-driven, and focused on creating actionable business intelligence.`;

		// Stream the response
		const result = await streamText({
			model: openai("gpt-4o-mini"),
			system: systemPrompt,
			messages,
			temperature: 0.7,
			maxTokens: 1000,
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error("Reports chat error:", error);
		return handleApiError(error);
	}
}
