import { ROLE_ASSISTANT, ROLE_USER, UI_LIMITS } from "@/config/constants";
import {
	AuthenticationError,
	ValidationError,
	handleApiError,
} from "@/lib/api-errors";
import { auth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { getChatMessages, saveChatMessages } from "@/lib/db/ai-queries";
import { saveConversation, getUserConversations } from "@/lib/db/queries";
import { defaultModel } from "@/lib/ai/models";
import { allMastraTools } from "@/lib/ai/tools";
import { conversations, messages } from "@workspace/database";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { streamText, convertToCoreMessages, createUIMessageStream, convertToModelMessages } from "ai";
import { aiProvider } from "@/lib/ai/providers";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';

// Request validation schema
const requestSchema = z.object({
	message: z.string().min(1, "Message cannot be empty"),
	conversationId: z.string().optional(),
	modelKey: z.enum(['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022']).optional().default('gpt-4o-mini'),
	useTools: z.boolean().optional().default(true)
});

export async function POST(request: NextRequest) {
	let currentConversation: any = null;
	let userId: string = '';
	
	try {
		// Authenticate user
		const sessionResponse = await auth.api.getSession({
			headers: request.headers,
		});
		
		if (!sessionResponse?.user) {
			console.error("No session found in chat-v2 API");
			throw new AuthenticationError("Please log in to use the chat");
		}
		
		userId = sessionResponse.user.id;

		// Parse and validate request body
		const body = await request.json();
		const { message, conversationId: existingConversationId, modelKey, useTools } = requestSchema.parse(body);

		// Save user message and get/create conversation
		try {
			currentConversation = await saveConversation(
				userId,
				message.substring(0, UI_LIMITS.TITLE_MAX_LENGTH) +
					(message.length > UI_LIMITS.TITLE_MAX_LENGTH ? "..." : ""),
				existingConversationId
			);

			if (!currentConversation) {
				throw new Error('Failed to create or retrieve conversation');
			}

			await saveChatMessages([{ 
  id: uuidv4(), 
  role: ROLE_USER as 'user', 
  content: message, 
  createdAt: new Date() 
}], currentConversation.id, userId);
		} catch (dbError) {
			console.error('Database error saving conversation/message:', dbError);
			return new Response(
				JSON.stringify({ error: "Unable to save your message. Please try again." }), 
				{ 
					status: 500, 
					headers: { "Content-Type": "application/json" } 
				}
			);
		}

		// Get conversation history
		const previousMessages = await getChatMessages(
			currentConversation.id,
			userId
		);

		// Prepare messages for AI SDK
		const aiMessages = [
			...previousMessages,
			{
				id: uuidv4(),
				role: 'user' as const,
				parts: [{ type: 'text' as const, text: message }],
				createdAt: new Date(),
			}
		];

		// System prompt for brand analysis context
		const systemPrompt = `You are AgentsAuthority's AI assistant, specialized in brand analysis, visibility optimization, and competitive intelligence across AI platforms.

Your expertise includes:
- Brand visibility analysis across ChatGPT, Claude, Gemini, and Perplexity
- Competitive intelligence and market positioning
- GEO (Generative Engine Optimization) strategies
- Sentiment analysis and brand monitoring
- Keyword clustering and content optimization
- Historical trend analysis and performance tracking

When users ask about brand analysis or visibility, use the available tools to provide comprehensive, data-driven insights. Always structure your responses clearly and provide actionable recommendations.

Available specialized tools:
- brandAnalysis: For comprehensive brand visibility and competitive analysis
- visibilityAnalysis: For detailed visibility scoring and platform performance
- keywordCluster: For keyword analysis and content strategy insights

Use these tools when appropriate to provide the most accurate and helpful analysis.`;

		// Prepare tools based on user preference
		const tools = useTools ? allMastraTools : {};

		

		// Create AI SDK stream
		const stream = createUIMessageStream({
			execute: ({ writer }) => {
				// Create AI SDK stream
		const stream = createUIMessageStream({
			execute: ({ writer }) => {
						// Create AI SDK stream
		const stream = createUIMessageStream({
			execute: ({ writer }) => {
				const result = streamText({
					model: aiProvider.languageModels['chat-model'],
					system: systemPrompt, // Add system prompt here
					messages: convertToModelMessages(aiMessages),
					tools, // Add tools here
					temperature: 0.7, // Add temperature here
				});
				
				writer.merge(result.toUIMessageStream());
			},
			onFinish: async ({ messages }) => {
				// Save AI response
				await saveChatMessages(messages, currentConversation.id, userId);
			}
		});
				
				writer.merge(result.toUIMessageStream());
			},
			onFinish: async ({ messages }) => {
				// Save AI response
				await saveChatMessages(messages, currentConversation.id, userId);
			}
		});
				
				writer.merge(result.toUIMessageStream());
			},
			onFinish: async ({ messages }) => {
				// Save AI response
				await saveChatMessages(messages, currentConversation.id, userId);
			}
		});

		// Placeholder for JsonToSseTransformStream
		class JsonToSseTransformStream extends TransformStream {
			constructor() {
				super({
					transform(chunk, controller) {
						controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`);
					}
				});
			}
		}

								return new Response(stream.pipeThrough(new JsonToSseTransformStream()));

	} catch (error: any) {
		console.error("Chat-v2 API error:", error);
		
		// Try to save an error message to the conversation
		try {
			if (currentConversation?.id && userId) {
				await saveChatMessages([{ 
					id: uuidv4(), 
					role: ROLE_ASSISTANT as 'assistant', 
					parts: [{ type: 'text' as const, text: `Error: ${error.message || "An error occurred while processing your request."}` }], 
					createdAt: new Date(), 
				}], 
					currentConversation.id, 
					userId 
				);
			}
		} catch (saveError) {
			console.error("Failed to save error message:", saveError);
		}
		
		// Return error response
		if (error instanceof ValidationError || error instanceof AuthenticationError) {
			return handleApiError(error);
		}
		
		// Generic error fallback
		const errorMessage = error.message || "An error occurred while processing your request.";
		const encoder = new TextEncoder();
		const errorStream = new ReadableStream({
			start(controller) {
				controller.enqueue(encoder.encode(`0:{"type":"text-delta","textDelta":"${errorMessage}"}`));
				controller.close();
			},
		});

				return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
	}
}

// GET endpoint remains the same as the original
export async function GET(request: NextRequest) {
	try {
		// Authenticate session
		const sessionResponse = await auth.api.getSession({
			headers: request.headers,
		});

		if (!sessionResponse?.user) {
			throw new AuthenticationError("Please log in to view chat history");
		}
		const userId = sessionResponse.user.id;

		const { searchParams } = new URL(request.url);
		const conversationId = searchParams.get("conversationId");

		if (conversationId) {
			// Fetch messages for a specific conversation
			const messagesResult = await getChatMessages(
				conversationId,
				userId
			);
			const conversation = await db.query.conversations.findFirst({
				where: and(
					eq(conversations.id, conversationId),
					eq(conversations.userId, userId)
				),
			});
			if (!conversation) {
				return NextResponse.json(
					{ error: "Conversation not found" },
					{ status: 404 }
				);
			}

			return NextResponse.json({
				...conversation,
				messages: messagesResult,
			});
		} else {
			// Fetch all conversations for the user
			const conversationsResult = await getUserConversations(userId);

			if (conversationsResult.length === 0) {
				return NextResponse.json(
					{ error: "No conversations found for this user" },
					{ status: 404 }
				);
			}

			const conversationsWithLastMessage = await Promise.all(
				conversationsResult.map(async (conv) => ({
					...conv,
					lastMessage: (await getChatMessages(conv.id, userId)).pop(),
				}))
			);

			return NextResponse.json(conversationsWithLastMessage);
		}
	} catch (error: any) {
		console.error("Chat-v2 GET error:", error);
		return handleApiError(error);
	}
}