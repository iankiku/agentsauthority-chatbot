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
			throw new AuthenticationError("Please log in to use the dashboard chat");
		}

		const userId = sessionResponse.user.id;
		const { messages } = await request.json();

		console.log(`Dashboard chat request from user ${userId}`);

		// Create a system prompt for dashboard-specific queries
		const systemPrompt = `You are a Brand Visibility Dashboard Assistant. You help users understand their brand's AI presence, GEO scores, and performance metrics.

Your capabilities include:
1. **GEO Score Analysis**: Explain GEO (Generative Engine Optimization) scores and breakdowns
2. **Performance Metrics**: Analyze brand visibility, sentiment, and mention trends
3. **Competitive Intelligence**: Compare brand performance against competitors
4. **Platform Analysis**: Break down performance across different AI platforms (ChatGPT, Claude, Gemini, etc.)
5. **Actionable Insights**: Provide specific recommendations for improvement

When users ask about their data:
- Acknowledge that you're accessing their dashboard data
- Provide specific, actionable insights
- Use clear metrics and percentages when possible
- Suggest next steps for improvement

For dashboard queries, you can reference:
- Current GEO scores and historical trends
- Brand mention frequency and sentiment
- Competitive positioning and market share
- Platform-specific performance data
- Improvement recommendations

Always be helpful, specific, and focused on actionable business insights.`;

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
		console.error("Dashboard chat error:", error);
		return handleApiError(error);
	}
}
