/**
 * Defines shared interfaces for agent pipeline context and input.
 */

// Define the structure for the initial business input
export interface BusinessInput {
	name: string;
	industry: string;
	website: string;
}

// Define the context that is passed between agents
export interface Fact {
	type: string; // e.g., "web_content", "llm_mentions", "geo_score", "recommendation"
	data: any; // The actual data payload of the fact
	source: string; // The agent that generated this fact
	timestamp?: string; // Optional: when the fact was generated
}

export interface AgentContext {
	facts: Fact[];
	memory: Map<string, any>; // For sharing transient data between agents
	businessData: BusinessInput;
}

// Define the Agent interface (simplified, as actual Agent class is from @mastra/core)
// This is primarily for type-checking the custom agents in our pipeline
export interface PipelineAgent {
	name: string;
	// execute method receives and returns AgentContext, allowing agents to modify facts and memory
	execute(context: AgentContext): Promise<AgentContext>;
}
