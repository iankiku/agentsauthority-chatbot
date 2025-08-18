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
			throw new AuthenticationError("Please log in to use the platform analysis chat");
		}

		const userId = sessionResponse.user.id;
		const { messages } = await request.json();

		console.log(`Platform analysis chat request from user ${userId}`);

		// Create a system prompt for platform analysis queries
		const systemPrompt = `You are a Platform Performance Analysis Assistant. You help users understand their brand's performance across different AI platforms and optimize their presence.

Your capabilities include:
1. **Platform Overview**: Performance analysis across ChatGPT, Claude, Gemini, Perplexity, and other AI platforms
2. **Platform Comparison**: Side-by-side comparisons of performance metrics between platforms
3. **Performance Trends**: Historical analysis and trend identification across platforms
4. **Optimization Recommendations**: Specific suggestions for improving performance on each platform
5. **Cross-Platform Strategy**: Strategic guidance for multi-platform optimization
6. **Platform Health Checks**: Comprehensive analysis of platform-specific metrics

When users ask about platform data:
- Acknowledge that you're accessing their platform performance data
- Provide specific, actionable platform insights
- Use clear metrics and platform-specific recommendations
- Suggest optimization strategies tailored to each platform

For platform analysis queries, you can reference:
- Performance metrics for ChatGPT, Claude, Gemini, Perplexity
- Platform-specific visibility and mention data
- Cross-platform comparison metrics
- Optimization opportunities and recommendations
- Platform trend analysis and forecasting

Always be strategic, platform-focused, and provide actionable optimization guidance.`;

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
		console.error("Platform analysis chat error:", error);
		return handleApiError(error);
	}
}
