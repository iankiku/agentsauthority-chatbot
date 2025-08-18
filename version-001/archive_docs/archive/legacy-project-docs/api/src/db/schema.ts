import {
	boolean,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["user", "assistant"]);
export const themeEnum = pgEnum("theme", ["light", "dark"]);

// User Profile table - extends Better Auth user with additional fields
export const userProfile = pgTable("user_profile", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().unique(),
	displayName: text("display_name"),
	avatarUrl: text("avatar_url"),
	bio: text("bio"),
	phone: text("phone"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

// Conversations table - stores chat threads
export const conversations = pgTable("conversations", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull(),
	title: text("title"),
	lastMessageAt: timestamp("last_message_at"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

// Messages table - stores individual chat messages
export const messages = pgTable("messages", {
	id: uuid("id").primaryKey().defaultRandom(),
	conversationId: uuid("conversation_id")
		.notNull()
		.references(() => conversations.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull(),
	role: roleEnum("role").notNull(),
	content: text("content").notNull(),
	tokenCount: integer("token_count"),
	createdAt: timestamp("created_at").defaultNow(),
});

// Message Feedback table - for rating AI responses
export const messageFeedback = pgTable("message_feedback", {
	id: uuid("id").primaryKey().defaultRandom(),
	messageId: uuid("message_id")
		.notNull()
		.references(() => messages.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull(),
	rating: integer("rating"), // 1-5
	feedback: text("feedback"),
	createdAt: timestamp("created_at").defaultNow(),
});

// User Settings table - app-specific preferences
export const userSettings = pgTable("user_settings", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().unique(),
	theme: themeEnum("theme").default("light"),
	emailNotifications: boolean("email_notifications").default(true),
	marketingEmails: boolean("marketing_emails").default(false),
	defaultModel: text("default_model").default("gpt-3.5-turbo"),
	metadata: jsonb("metadata"), // For any additional settings
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

// Define relations without user table reference
export const userProfileRelations = relations(userProfile, ({ many }) => ({
	conversations: many(conversations),
	brandAnalyses: many(brandAnalyses),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
	userProfile: one(userProfile, {
		fields: [conversations.userId],
		references: [userProfile.userId],
	}),
	messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id],
	}),
	feedback: many(messageFeedback),
}));

export const messageFeedbackRelations = relations(messageFeedback, ({ one }) => ({
	message: one(messages, {
		fields: [messageFeedback.messageId],
		references: [messages.id],
	}),
}));

// Brand Monitor Analyses
export const brandAnalyses = pgTable("brand_analyses", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull(),
	url: text("url").notNull(),
	companyName: text("company_name"),
	industry: text("industry"),
	analysisData: jsonb("analysis_data"), // Stores the full analysis results
	competitors: jsonb("competitors"), // Stores competitor data
	prompts: jsonb("prompts"), // Stores the prompts used
	creditsUsed: integer("credits_used").default(10),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

// Topics for prompts
export const topics = pgTable("topics", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow(),
});

// Prompts table
export const prompts = pgTable("prompts", {
	id: uuid("id").primaryKey().defaultRandom(),
	text: text("text").notNull(),
	topicId: uuid("topic_id").references(() => topics.id),
	createdAt: timestamp("created_at").defaultNow(),
});

// Join table for brand analyses and prompts
export const brandAnalysesToPrompts = pgTable(
	"brand_analyses_to_prompts",
	{
		brandAnalysisId: uuid("brand_analysis_id")
			.notNull()
			.references(() => brandAnalyses.id),
		promptId: uuid("prompt_id")
			.notNull()
			.references(() => prompts.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.brandAnalysisId, t.promptId] }),
	}),
);

// Relations
export const brandAnalysesRelations = relations(brandAnalyses, ({ one, many }) => ({
	userProfile: one(userProfile, {
		fields: [brandAnalyses.userId],
		references: [userProfile.userId],
	}),
	prompts: many(brandAnalysesToPrompts),
}));

export const promptsRelations = relations(prompts, ({ one, many }) => ({
	topic: one(topics, {
		fields: [prompts.topicId],
		references: [topics.id],
	}),
	brandAnalyses: many(brandAnalysesToPrompts),
}));

export const brandAnalysesToPromptsRelations = relations(
	brandAnalysesToPrompts,
	({ one }) => ({
		brandAnalysis: one(brandAnalyses, {
			fields: [brandAnalysesToPrompts.brandAnalysisId],
			references: [brandAnalyses.id],
		}),
		prompt: one(prompts, {
			fields: [brandAnalysesToPrompts.promptId],
			references: [prompts.id],
		}),
	}),
);

// Type exports for use in application
export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type MessageFeedback = typeof messageFeedback.$inferSelect;
export type NewMessageFeedback = typeof messageFeedback.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
export type BrandAnalysis = typeof brandAnalyses.$inferSelect;
export type NewBrandAnalysis = typeof brandAnalyses.$inferInsert;
export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;
export type Prompt = typeof prompts.$inferSelect;
export type NewPrompt = typeof prompts.$inferInsert;

