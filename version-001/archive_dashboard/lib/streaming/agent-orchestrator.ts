/**
 * Agent orchestration utilities for multi-agent workflows
 *
 * This module provides functions to facilitate communication between different agents,
 * track delegations, and manage the flow of information between agents.
 */

import { callAgentApi } from "../mastra-client";

/**
 * Agent types available in the system
 */
export type AgentType =
	| "chatAgent"
	| "plannerAgent"
	| "brandAnalysisAgent"
	| "visibilityAnalysisAgent"
	| "keywordClusterAgent"
	| "brandMonitorAgent"
	| "promptSimulatorAgent"
	| "aiCopywriterAgent"
	| "roastMyWebsiteAgent";

/**
 * Maps friendly agent names to their API names
 */
export const AGENT_NAME_MAP: Record<string, AgentType> = {
	"Chat Assistant": "chatAgent",
	"Master Planner": "plannerAgent",
	"Brand Analysis Agent": "brandAnalysisAgent",
	"Visibility Analysis Agent": "visibilityAnalysisAgent",
	"Keyword Cluster Agent": "keywordClusterAgent",
	"Brand Monitor Agent": "brandMonitorAgent",
	"Prompt Simulator Agent": "promptSimulatorAgent",
	"AI Copywriter Agent": "aiCopywriterAgent",
	"Roast My Website Agent": "roastMyWebsiteAgent",
};

/**
 * Agent delegation information
 */
export interface AgentDelegation {
	fromAgent: AgentType;
	toAgent: AgentType;
	delegationData: any;
}

/**
 * Call an agent based on delegation information
 */
export async function callDelegatedAgent({
	fromAgent,
	toAgent,
	delegationData,
	resourceId,
	threadId,
	originalMessages,
}: {
	fromAgent: AgentType;
	toAgent: AgentType;
	delegationData: any;
	resourceId?: string;
	threadId?: string;
	originalMessages?: Array<{ role: "user" | "assistant"; content: string }>;
}) {
	// Convert delegation data to a message for the target agent
	const delegationMessage =
		typeof delegationData === "string"
			? delegationData
			: JSON.stringify(delegationData);

	// Prepare context for the specialized agent
	let agentContext = "";

	// Add appropriate context based on the agent type
	switch (toAgent) {
		case "brandAnalysisAgent":
			agentContext =
				"Perform a thorough brand analysis based on the following request. Include visualizations and metrics when appropriate.";
			break;
		case "visibilityAnalysisAgent":
			agentContext =
				"Analyze the visibility across AI platforms based on the following request. Generate relevant charts and metrics.";
			break;
		case "plannerAgent":
			agentContext =
				"Create a plan based on the following user goal. Break it down into actionable steps.";
			break;
		default:
			agentContext =
				"Address the following user request with your specialized capabilities.";
	}

	// Create the message array for the target agent
	const messages = [
		{
			role: "system" as const,
			content: `You are the ${toAgent}. ${agentContext} The request was originally handled by ${fromAgent}.`,
		},
		{
			role: "user" as const,
			content: delegationMessage,
		},
	];

	// Add original messages as context if provided
	if (originalMessages && originalMessages.length > 0) {
		// Limit to last 5 messages for context
		const contextMessages = originalMessages.slice(-5);
		messages.unshift(...contextMessages);
	}

	// Call the target agent with streaming
	return await callAgentApi({
		agentName: toAgent,
		messages,
		method: "stream",
		resourceId,
		threadId: threadId ? `${threadId}-${toAgent}` : undefined, // Avoid thread collision
	});
}

/**
 * Extract agent delegation information from text
 * Pattern: <delegate to="Agent Name">{"key":"value"}</delegate>
 */
export function extractAgentDelegation(text: string): AgentDelegation | null {
	const delegationRegex = /<delegate\s+to="([^"]+)">([\s\S]*?)<\/delegate>/;
	const match = text.match(delegationRegex);

	if (!match) return null;

	const [_, targetAgentName, delegationDataStr] = match;

	// Get agent type from name
	const toAgent =
		AGENT_NAME_MAP[targetAgentName] || (targetAgentName as AgentType);

	try {
		// Parse delegation data
		const delegationData = JSON.parse(delegationDataStr);

		return {
			fromAgent: "chatAgent", // Default source agent
			toAgent,
			delegationData,
		};
	} catch (error) {
		console.error(
			`Failed to parse delegation data: ${error instanceof Error ? error.message : String(error)}`
		);
		return null;
	}
}
