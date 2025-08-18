import { Autumn } from "autumn-js";
import { and, desc, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { auth } from "../auth/auth";
import { db } from "../db";
import { conversations, messages } from "../db/schema";
import { AuthenticationError, ValidationError } from "../lib/api-errors";

// Initialize Autumn client only if secret key is available
const autumnClient = process.env.AUTUMN_SECRET_KEY
	? new Autumn({ secretKey: process.env.AUTUMN_SECRET_KEY })
	: null;

const CREDITS_PER_MESSAGE = 1;

export async function handleSendMessage(req: Request, res: Response) {
	try {
		const session = await auth.api.getSession({ headers: req.headers as any });

		if (!session?.user) {
			throw new AuthenticationError("Please log in to send messages");
		}

		const { message, conversationId } = req.body;

		if (
			!message ||
			typeof message !== "string" ||
			message.trim().length === 0
		) {
			throw new ValidationError("Message must be a non-empty string");
		}

		// Check credits only if Autumn is configured
		if (autumnClient) {
			const access = await autumnClient.check({
				customer_id: session.user.id,
				feature_id: "messages",
			});

			if ((access.data?.balance ?? 0) < CREDITS_PER_MESSAGE) {
				return res.status(402).json({
					error: "Insufficient credits",
					creditsRequired: CREDITS_PER_MESSAGE,
					creditsAvailable: access.data?.balance || 0,
				});
			}

			// Deduct credits
			await autumnClient.track({
				customer_id: session.user.id,
				feature_id: "messages",
				value: CREDITS_PER_MESSAGE,
			});
		} else {
			console.warn(
				"[Chat Service] Autumn not configured, skipping credit check"
			);
		}

		// Create or get conversation
		let conversation;
		if (conversationId) {
			conversation = await db.query.conversations.findFirst({
				where: and(
					eq(conversations.id, conversationId),
					eq(conversations.userId, session.user.id)
				),
			});
		}

		if (!conversation) {
			const [newConversation] = await db
				.insert(conversations)
				.values({
					userId: session.user.id,
					title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
				})
				.returning();
			conversation = newConversation;
		}

		// Save user message
		const [userMessage] = await db
			.insert(messages)
			.values({
				conversationId: conversation.id,
				userId: session.user.id,
				role: "user",
				content: message,
			})
			.returning();

		// TODO: Generate AI response here
		const aiResponse =
			"This is a placeholder AI response. Implement AI integration here.";

		// Save AI response
		const [aiMessage] = await db
			.insert(messages)
			.values({
				conversationId: conversation.id,
				userId: session.user.id,
				role: "assistant",
				content: aiResponse,
			})
			.returning();

		// Update conversation last message time
		await db
			.update(conversations)
			.set({ lastMessageAt: new Date() })
			.where(eq(conversations.id, conversation.id));

		res.json({
			conversationId: conversation.id,
			userMessage,
			aiMessage,
			remainingCredits: autumnClient ? 999 : 0, // Placeholder if no Autumn
			creditsUsed: CREDITS_PER_MESSAGE,
		});
	} catch (error) {
		console.error("[Chat Service] Send message error:", error);
		res.status(500).json({ error: "Failed to send message" });
	}
}

export async function handleGetConversations(req: Request, res: Response) {
	try {
		const session = await auth.api.getSession({ headers: req.headers as any });

		if (!session?.user) {
			throw new AuthenticationError("Please log in to view your conversations");
		}

		const userConversations = await db.query.conversations.findMany({
			where: eq(conversations.userId, session.user.id),
			orderBy: desc(conversations.lastMessageAt),
		});

		res.json(userConversations);
	} catch (error) {
		console.error("[Chat Service] Get conversations error:", error);
		res.status(500).json({ error: "Failed to fetch conversations" });
	}
}
