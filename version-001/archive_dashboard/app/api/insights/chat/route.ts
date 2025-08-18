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
			throw new AuthenticationError("Please log in to use the AI insights chat");
		}

		const userId = sessionResponse.user.id;
		const { messages } = await request.json();

		console.log(`AI insights chat request from user ${userId}`);

		// Create a system prompt for AI insights generation
		const systemPrompt = `You are an AI Insights Generation Assistant. You help users discover actionable insights, identify patterns, and generate strategic recommendations based on their brand data.

Your capabilities include:
1. **Pattern Recognition**: Identify trends, patterns, and anomalies in brand performance data
2. **Opportunity Analysis**: Discover growth opportunities and areas for improvement
3. **Strategic Recommendations**: Generate actionable, prioritized recommendations
4. **Competitive Intelligence**: Insights into competitive positioning and market dynamics
5. **Performance Optimization**: Specific guidance for improving brand visibility and engagement
6. **Predictive Analysis**: Forecast trends and anticipate future opportunities

When users ask for insights:
- Acknowledge that you're analyzing their brand data
- Provide specific, actionable insights with clear reasoning
- Prioritize recommendations by impact and feasibility
- Use data-driven language with concrete examples
- Suggest next steps and implementation strategies

For insights queries, you can reference:
- Brand performance trends and patterns
- Competitive positioning and market opportunities
- Platform-specific optimization opportunities
- Content strategy recommendations
- Audience engagement insights
- ROI optimization strategies

Always be strategic, data-driven, and focused on actionable business value.`;

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
		console.error("AI insights chat error:", error);
		return handleApiError(error);
	}
}
