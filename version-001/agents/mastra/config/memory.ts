import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { PgVector, PostgresStore } from "@mastra/pg";

// Use centralized database URL - no fallback to avoid inconsistency
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error(
		"DATABASE_URL environment variable is required for Mastra agents"
	);
}

export const storageKlass = new PostgresStore({
	connectionString: databaseUrl,
});

export const vectorKlass = new PgVector({
	connectionString: databaseUrl,
});

const lastMessages = parseInt(process.env.LAST_MESSAGES || "20");
const workingMemory = process.env.AGENTS_WORKING_MEMORY === "true";

export const memoryKlass = new Memory({
	storage: storageKlass, // Use the storage property of the instantiated PostgresStore
	// vector: vectorKlass, // Pass the instantiated PgVector
	// embedder: openai.embedding("text-embedding-3-small"), // Correctly place the embedder
	// options: {
	// 	lastMessages: lastMessages,
	// 	semanticRecall: {
	// 		topK: 3,
	// 		messageRange: 2,
	// 		scope: "resource",
	// 	},
	// 	workingMemory: {
	// 		enabled: workingMemory,
	// 	},
	// 	threads: {
	// 		generateTitle: true,
	// 	},
	// },
});
