import { ROLE_ASSISTANT, ROLE_USER, UI_LIMITS } from "@/config/constants";
import {
	AuthenticationError,
	ValidationError,
	handleApiError,
} from "@/lib/api-errors";
import { auth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import {
	getConversationMessages,
	getUserConversations,
	saveConversation,
	saveMessage,
} from "@/lib/db/queries"; // Import new DB functions
import { callAgentApi } from "@/lib/mastra-client";
import {
	callDelegatedAgent,
	extractAgentDelegation,
} from "@/lib/streaming/agent-orchestrator";
import { createAISDKTransformer } from "@/lib/streaming/stream-transformer";
// Import database schemas
import { Message, conversations, messages } from "@workspace/database";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// const autumn = new Autumn({ secretKey: process.env.AUTUMN_SECRET_KEY! });

export async function POST(request: NextRequest) {
	let currentConversation: any = null;
	let userId: string = '';
	
	try {
		let sessionResponse: any = {};
		let remainingCredits = 0;

		// Get real session
		sessionResponse = await auth.api.getSession({
			headers: request.headers,
		});
		if (!sessionResponse?.user) {
			console.error("No session found in chat API");
			throw new AuthenticationError("Please log in to use the chat");
		}
		userId = sessionResponse.user.id;

		// TODO: Uncomment and re-enable credit check logic once Autumn is fully integrated and tested.
		// Check if user has access to use the chat
		// try {
		// 	console.log("Checking access for:", {
		// 		userId: sessionResponse.user.id,
		// 		featureId: "messages",
		// 	});

		// 	const access = await autumn.check({
		// 		customer_id: sessionResponse.user.id,
		// 		feature_id: FEATURE_ID_MESSAGES,
		// 	});

		// 	console.log("Access check result:", access);

		// 	if (!access.data?.allowed) {
		// 		console.log("Access denied - no credits remaining");
		// 		throw new InsufficientCreditsError(
		// 			ERROR_MESSAGES.NO_CREDITS_REMAINING,
		// 			CREDITS_PER_MESSAGE,
		// 			access.data?.balance || 0
		// 		);
		// 	}
		// 	remainingCredits = access.data?.balance || 0; // Update remaining credits after check
		// } catch (err) {
		// 	if (err instanceof InsufficientCreditsError) {
		// 		throw err; // Re-throw our custom errors
		// 	}
		// 	throw new ExternalServiceError(
		// 		"Unable to verify credits. Please try again",
		// 		"autumn"
		// 	);
		// }

		// Track API usage with Autumn - only if not skipping auth
		// try {
		// 	await autumn.track({
		// 		customer_id: sessionResponse.user.id,
		// 		feature_id: FEATURE_ID_MESSAGES,
		// 		value: CREDITS_PER_MESSAGE,
		// 	});
		// } catch (err) {
		// 	console.error("Failed to track usage:", err);
		// 	throw new ExternalServiceError(
		// 		"Unable to process credit usage. Please try again",
		// 		"autumn"
		// 	);
		// }
		// }

		const { message, conversationId: existingConversationId } =
			await request.json();

		if (!message || typeof message !== "string") {
			throw new ValidationError("Invalid message format", {
				message: "Message must be a non-empty string",
			});
		}

		// Save user message to DB and get/create conversation
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

			await saveMessage(currentConversation.id, userId, ROLE_USER, message);
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

		// Get previous messages for context
		const previousMessages: Message[] = await getConversationMessages(
			currentConversation.id,
			userId
		);

		// Prepare messages for agent (exclude the current user message, Mastra will add it)
		const messagesForAgent = previousMessages.map((msg: Message) => ({
			role: msg.role === ROLE_USER ? ROLE_USER : ROLE_ASSISTANT, // Explicitly cast role
			content: msg.content,
		}));

		// Use real AI agent integration
		try {
			// Use streaming mode for real-time responses
			console.log('\n\n calling callAgentApi')
			const streamResponse = await callAgentApi({
				agentName: "chatAgent",
				messages: [...messagesForAgent, { role: "user", content: message }],
				method: "stream", // Change from "generate" to "stream"
				resourceId: `user-${userId}`,
				threadId: currentConversation.id,
			});
			console.log('\n\n called callAgentApi', streamResponse)

			// For streaming, we'll save the message after completion using an empty placeholder
			// We'll update it with complete content at the end of stream
			const savedMessage = await saveMessage(
				currentConversation.id,
				userId,
				ROLE_ASSISTANT,
				"" // Empty placeholder, will be updated with complete content
			);
			const savedMessageId = savedMessage.id;

			// Process Mastra stream and convert to AI SDK compatible format
			// The streamResponse is already a Response object from Mastra client
			if (!(streamResponse instanceof Response)) {
				// Fallback to generate method if stream response is not a proper Response object
				console.warn(
					"Stream response not as expected, falling back to generate method"
				);

				// Check for agent delegation in the non-stream response first
				if (
					typeof streamResponse === "string" &&
					streamResponse.includes("<delegate to=")
				) {
					const delegation = extractAgentDelegation(streamResponse);
					if (delegation) {
						console.log(
							`Delegation detected in fallback path: ${delegation.fromAgent} -> ${delegation.toAgent}`
						);

						try {
							// Call the delegated agent with generate method
							const delegatedResult = await callAgentApi({
								agentName: delegation.toAgent,
								messages: [
									...messagesForAgent,
									{
										role: "user",
										content: JSON.stringify(delegation.delegationData),
									},
								],
								method: "generate",
								resourceId: `user-${userId}`,
								threadId: `${currentConversation.id}-${delegation.toAgent}`,
							});

							// Wrap the delegated result with context
							const wrappedResult = `*The AI has routed this request to a specialized agent (${delegation.toAgent}) for better results:*\n\n${
								typeof delegatedResult === "string"
									? delegatedResult
									: delegatedResult.text ||
										delegatedResult.content ||
										"No response"
							}`;

							// Use the wrapped result as the fallback
							const fallbackResult = wrappedResult;

							// Update the placeholder message with the delegated content
							await db
								.update(messages)
								.set({ content: fallbackResult })
								.where(eq(messages.id, savedMessageId))
								.execute();

							// Return as a simple stream
							const encoder = new TextEncoder();
							const stream = new ReadableStream({
								start(controller) {
									controller.enqueue(encoder.encode(fallbackResult));
									controller.close();
								},
							});

							return new Response(stream);
						} catch (delegationError) {
							console.error("Error in fallback delegation:", delegationError);
							// Continue with standard fallback
						}
					}
				}

				const fallbackResult = await callAgentApi({
					agentName: "chatAgent",
					messages: [...messagesForAgent, { role: "user", content: message }],
					method: "generate", // Fallback to generate method
					resourceId: `user-${userId}`,
					threadId: currentConversation.id,
				});

				// Update the placeholder message with the generated content
				const content =
					typeof fallbackResult === "string"
						? fallbackResult
						: fallbackResult.text ||
							fallbackResult.content ||
							"No response generated";

				await db
					.update(messages)
					.set({ content })
					.where(eq(messages.id, savedMessageId))
					.execute();

				// Return as a simple stream
				const encoder = new TextEncoder();
				const stream = new ReadableStream({
					start(controller) {
						controller.enqueue(encoder.encode(content));
						controller.close();
					},
				});

				return new Response(stream);
			}

			// Process the stream for artifacts and agent delegations
			let completeContent = "";
			let artifactFound = false;
			let delegationFound = false;
			let delegationInfo: any = null;

			// Create a transform stream that processes artifacts and delegations
			const processStream = new TransformStream({
				async transform(chunk, controller) {
					try {
						// Decode the chunk
						const decoder = new TextDecoder();
						const text = decoder.decode(chunk);
						completeContent += text;

					// Check for agent delegation
					if (!delegationFound) {
						const delegation = extractAgentDelegation(text);
						if (delegation) {
							delegationFound = true;
							delegationInfo = delegation;

							// Log delegation for debugging
							console.log(
								`Agent delegation detected: ${delegation.fromAgent} -> ${delegation.toAgent}`
							);

							// Don't forward this chunk - it contains delegation markup
							// Instead, we'll handle the delegation separately
							return;
						}
					}

					// Forward regular chunks
					controller.enqueue(chunk);
					} catch (error) {
						console.error("Error processing stream response:", error);
						// Forward the chunk anyway to not break the stream
						controller.enqueue(chunk);
					}
				},
				async flush(controller) {
					// If we found a delegation, handle it
					if (delegationFound && delegationInfo) {
						try {
							// Call the delegated agent
							console.log(`Calling delegated agent: ${delegationInfo.toAgent}`);
							const delegatedResponse = await callDelegatedAgent({
								fromAgent: delegationInfo.fromAgent,
								toAgent: delegationInfo.toAgent,
								delegationData: delegationInfo.delegationData,
								resourceId: `user-${userId}`,
								threadId: currentConversation.id,
								originalMessages: [
									...messagesForAgent,
									{ role: "user", content: message },
								],
							});

							// If we got a valid response, pipe it through
							if (
								delegatedResponse instanceof Response &&
								delegatedResponse.body
							) {
								// Add a header indicating the agent being used
								const encoder = new TextEncoder();
								controller.enqueue(
									encoder.encode(
										`\n\n_Response from ${delegationInfo.toAgent}:_\n\n`
									)
								);

								// Create a reader for the delegated agent's response
								const reader = delegatedResponse.body.getReader();

								// Forward chunks from the delegated agent
								while (true) {
									const { done, value } = await reader.read();
									if (done) break;
									controller.enqueue(value);
								}
							} else {
								// Fallback if delegation failed
								const encoder = new TextEncoder();
								controller.enqueue(
									encoder.encode(
										`\n\nI apologize, but I was unable to process that request with the specialized agent. Let me help you directly instead.\n\n`
									)
								);
							}
						} catch (error) {
							console.error("Error in agent delegation:", error);
							const encoder = new TextEncoder();
							controller.enqueue(
								encoder.encode(
									`\n\nI encountered an issue while processing your request with a specialized agent. Let me try to assist you directly.\n\n`
								)
							);
						}
					}

					// Update the saved message with complete content
					try {
						await db
							.update(messages)
							.set({ content: completeContent })
							.where(eq(messages.id, savedMessageId))
							.execute();
					} catch (dbError) {
						console.error("Failed to update complete message:", dbError);
					}
				},
			});

			// Create the AI SDK transformer to handle artifacts for UI display
			const aisdkTransformer = createAISDKTransformer();

			// Return the processed and transformed stream
			return streamResponse.body
				? new Response(
						streamResponse.body
							.pipeThrough(processStream) // First process for delegations
							.pipeThrough(aisdkTransformer)
					) // Then transform for AI SDK
				: new Response("Stream not available", { status: 500 });
		} catch (agentError) {
			console.error("Agent API error:", agentError);

			// Fallback response
			const fallbackResponse = `I'm here to help you analyze your brand's visibility across AI platforms like ChatGPT, Claude, Gemini, and Perplexity. You can ask me about:

- Brand analysis and monitoring
- Competitor research
- Visibility optimization strategies
- Platform-specific insights

How can I assist you today?`;

			await saveMessage(
				currentConversation.id,
				userId,
				ROLE_ASSISTANT,
				fallbackResponse
			);

			const encoder = new TextEncoder();
			const stream = new ReadableStream({
				start(controller) {
					controller.enqueue(encoder.encode(fallbackResponse));
					controller.close();
				},
			});

			return new Response(stream);
		}
	} catch (error: any) {
		console.error("Chat API error:", error);
		console.error("Error stack:", error.stack);
		console.error("Error details:", {
			name: error.name,
			message: error.message,
			cause: error.cause
		});
		
		// Try to save an error message to the conversation
		try {
			if (currentConversation?.id && userId) {
				await saveMessage(
					currentConversation.id,
					userId,
					ROLE_ASSISTANT,
					`Error: ${error.message || "An error occurred while processing your request."}`
				);
			}
		} catch (saveError) {
			console.error("Failed to save error message:", saveError);
		}
		
		// Return the error as a stream so frontend can display it
		const errorMessage = error.message || "An error occurred while processing your request.";
		const encoder = new TextEncoder();
		const errorStream = new ReadableStream({
			start(controller) {
				controller.enqueue(encoder.encode(errorMessage));
				controller.close();
			},
		});

		return new Response(errorStream, {
			status: 200, // Return 200 so frontend processes the error message
			headers: { "Content-Type": "text/plain" },
		});
	}
}

// GET endpoint to fetch conversation history or list conversations
export async function GET(request: NextRequest) {
	try {
		// Authenticate session
		const sessionResponse = await auth.api.getSession({
			headers: request.headers,
		});

		if (!sessionResponse?.user) {
			throw new AuthenticationError("Please log in to view chat history");
		}
		const userId = sessionResponse.user.id; // Use real user ID

		const { searchParams } = new URL(request.url);
		const conversationId = searchParams.get("conversationId");

		if (conversationId) {
			// Fetch messages for a specific conversation
			const messagesResult = await getConversationMessages(
				conversationId,
				userId
			);
			// You might want to fetch conversation details here too, if not already available
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

			// Optionally, fetch the last message for each conversation to display in a list
			const conversationsWithLastMessage = await Promise.all(
				conversationsResult.map(async (conv) => ({
					...conv,
					lastMessage: (await getConversationMessages(conv.id, userId)).pop(), // Get the last message
				}))
			);

			return NextResponse.json(conversationsWithLastMessage);
		}
	} catch (error: any) {
		console.error("Chat GET error:", error);
		return handleApiError(error);
	}
}
