// Import database schema for chat operations
import { db, conversations, messages, type Conversation, type Message } from "@workspace/database";
import { and, eq, desc } from "drizzle-orm";

// Re-export centralized services for backward compatibility
// TODO: Re-enable when services are added to schema
// export {
// 	ChatService,
// 	CompanyService,
// 	LegacyAnalysisService,
// } from "@workspace/database";

// Legacy function wrappers for backward compatibility
// import { ChatService, LegacyAnalysisService } from "@workspace/database";

export async function saveBrandAnalysisResult(
	userId: string,
	companyName: string,
	industry: string,
	url: string,
	analysisData: any
) {
	return await LegacyAnalysisService.saveBrandAnalysisResult(
		userId,
		companyName,
		industry,
		url,
		analysisData
	);
}

export async function getRecentBrandAnalysis(
	userId: string,
	companyName: string,
	industry: string
) {
	return await LegacyAnalysisService.getRecentBrandAnalysis(
		userId,
		companyName,
		industry
	);
}

export async function saveVisibilityScanResult(
	userId: string,
	companyName: string,
	companyUrl: string,
	timeframe: string,
	scanData: any
) {
	return await LegacyAnalysisService.saveVisibilityScanResult(
		userId,
		companyName,
		companyUrl,
		timeframe,
		scanData
	);
}

export async function getRecentVisibilityScan(
	userId: string,
	companyName: string,
	companyUrl: string,
	timeframe: string
) {
	return await LegacyAnalysisService.getRecentVisibilityScan(
		userId,
		companyName,
		companyUrl,
		timeframe
	);
}

export async function saveCompetitorAnalysisResult(
	userId: string,
	companyName: string,
	companyUrl: string,
	competitorName: string,
	timeframe: string,
	analysisData: any
) {
	return await LegacyAnalysisService.saveCompetitorAnalysisResult(
		userId,
		companyName,
		companyUrl,
		competitorName,
		timeframe,
		analysisData
	);
}

export async function getRecentCompetitorAnalysis(
	userId: string,
	companyName: string,
	companyUrl: string,
	competitorName: string,
	timeframe: string
) {
	return await LegacyAnalysisService.getRecentCompetitorAnalysis(
		userId,
		companyName,
		companyUrl,
		competitorName,
		timeframe
	);
}

export async function saveConversation(
	userId: string,
	title: string,
	conversationId?: string
): Promise<Conversation> {
	try {
		console.log('saveConversation called with:', { userId, title, conversationId });

		if (conversationId) {
			// First, try to find existing conversation
			const existingConversation = await db.query.conversations.findFirst({
				where: and(eq(conversations.id, conversationId), eq(conversations.userId, userId))
			});

			if (existingConversation) {
				console.log('Found existing conversation, updating...');
				// Update existing conversation
				const [updatedConversation] = await db
					.update(conversations)
					.set({ title, updatedAt: new Date() })
					.where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)))
					.returning();
				
				if (!updatedConversation) {
					throw new Error('Failed to update conversation - no rows returned');
				}
				
				console.log('Successfully updated conversation:', updatedConversation.id);
				return updatedConversation;
			} else {
				console.log('Creating new conversation with provided ID...');
				// Create new conversation with provided ID
				const [newConversation] = await db
					.insert(conversations)
					.values({
						id: conversationId,
						userId,
						title,
					})
					.returning();
				
				if (!newConversation) {
					throw new Error('Failed to create conversation - no rows returned');
				}
				
				console.log('Successfully created conversation:', newConversation.id);
				return newConversation;
			}
		} else {
			console.log('Creating new conversation with auto-generated ID...');
			// Create new conversation with auto-generated ID
			const [newConversation] = await db
				.insert(conversations)
				.values({
					userId,
					title,
				})
				.returning();
			
			if (!newConversation) {
				throw new Error('Failed to create conversation - no rows returned');
			}
			
			console.log('Successfully created conversation:', newConversation.id);
			return newConversation;
		}
	} catch (error) {
		console.error('Error in saveConversation:', error);
		console.error('Database connection status:', { 
			hasDb: !!db,
			conversationsTable: !!conversations 
		});
		throw error;
	}
}

export async function saveMessage(
	conversationId: string,
	userId: string,
	role: "user" | "assistant",
	content: string,
	tokenCount?: number
): Promise<Message> {
	const [newMessage] = await db
		.insert(messages)
		.values({
			conversationId,
			userId,
			role,
			content,
		})
		.returning();
	return newMessage;
}

export async function getConversationMessages(
	conversationId: string,
	userId: string
): Promise<Message[]> {
	return await db
		.select()
		.from(messages)
		.where(and(eq(messages.conversationId, conversationId), eq(messages.userId, userId)))
		.orderBy(messages.createdAt);
}

export async function getUserConversations(userId: string): Promise<Conversation[]> {
	return await db
		.select()
		.from(conversations)
		.where(eq(conversations.userId, userId))
		.orderBy(desc(conversations.updatedAt));
}
