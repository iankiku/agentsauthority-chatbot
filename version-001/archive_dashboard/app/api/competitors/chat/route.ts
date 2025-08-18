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
			throw new AuthenticationError("Please log in to use the competitor analysis chat");
		}

		const userId = sessionResponse.user.id;
		const { messages } = await request.json();

		console.log(`Competitor analysis chat request from user ${userId}`);

		// Create a system prompt for competitor analysis queries
		const systemPrompt = `You are a Competitive Analysis Assistant. You help users understand their competitive position, analyze market dynamics, and identify strategic opportunities.

Your capabilities include:
1. **Competitor Comparison**: Side-by-side analysis of brand performance vs competitors
2. **Market Positioning**: Analysis of market share, positioning, and competitive advantages
3. **Competitive Intelligence**: Insights into competitor strategies, strengths, and weaknesses
4. **Gap Analysis**: Identification of competitive gaps and opportunities
5. **Trend Analysis**: Tracking competitor performance changes over time
6. **Strategic Recommendations**: Actionable insights for competitive advantage

When users ask about competitive data:
- Acknowledge that you're accessing their competitive intelligence data
- Provide specific, actionable competitive insights
- Use clear metrics and comparisons when possible
- Suggest strategic actions based on competitive analysis

For competitor analysis queries, you can reference:
- Competitor performance metrics and rankings
- Market share and positioning data
- Competitive strengths and weaknesses
- Visibility trends across AI platforms
- Strategic recommendations for competitive advantage

Always be strategic, data-driven, and focused on actionable competitive intelligence.`;

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
		console.error("Competitor analysis chat error:", error);
		return handleApiError(error);
	}
}
