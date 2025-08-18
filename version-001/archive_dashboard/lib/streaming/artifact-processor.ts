/**
 * Artifact processing utilities for streaming responses
 *
 * This module provides functions to detect and process artifacts in streaming responses from Mastra agents.
 * It can identify several types of special content in the stream:
 *
 * 1. Artifacts: JSON objects representing data visualizations (charts, tables, etc.)
 * 2. Agent delegations: When one agent delegates to another specialized agent
 * 3. Other structured data in the response
 */

import { z } from "zod";

/**
 * Pattern to detect artifact markers in the stream
 * Format: <artifact type="data-table">{"headers":["Name","Value"],"rows":[["A",1],["B",2]]}</artifact>
 */
const ARTIFACT_PATTERN = /<artifact\s+type="([^"]+)">([\s\S]*?)<\/artifact>/g;

/**
 * Pattern to detect agent delegation markers in the stream
 * Format: <delegate to="Brand Analysis Agent">{"query":"analyze brand visibility"}</delegate>
 */
const DELEGATION_PATTERN = /<delegate\s+to="([^"]+)">([\s\S]*?)<\/delegate>/g;

/**
 * Basic validation schema for artifact data
 */
export const ArtifactSchema = z.object({
	type: z.string(),
	data: z.record(z.any()),
	metadata: z.record(z.any()).optional(),
});

export type ParsedStreamChunk = {
	type: "text" | "artifact" | "agent_delegation" | "error";
	content?: string;
	artifactType?: string;
	artifactData?: any;
	fromAgent?: string;
	toAgent?: string;
	delegationData?: any;
	error?: string;
};

/**
 * Process a chunk of streaming response to detect artifacts and agent delegations
 */
export function parseStreamChunk(chunk: string): ParsedStreamChunk[] {
	const results: ParsedStreamChunk[] = [];
	let remainingText = chunk;
	let matchFound = false;

	// Check for artifact markers
	const artifactMatches = [...chunk.matchAll(ARTIFACT_PATTERN)];
	if (artifactMatches.length > 0) {
		matchFound = true;

		for (const match of artifactMatches) {
			const [fullMatch, artifactType, artifactJsonStr] = match;

			try {
				// Parse the artifact JSON
				const artifactData = JSON.parse(artifactJsonStr);

				// Try to validate against our schema
				const validationResult = ArtifactSchema.safeParse({
					type: artifactType,
					data: artifactData,
				});

				if (validationResult.success) {
					results.push({
						type: "artifact",
						artifactType,
						artifactData,
					});
				} else {
					results.push({
						type: "error",
						error: `Invalid artifact data: ${validationResult.error.message}`,
					});
				}

				// Remove the artifact from the text
				remainingText = remainingText.replace(fullMatch, "");
			} catch (error) {
				results.push({
					type: "error",
					error: `Failed to parse artifact JSON: ${error instanceof Error ? error.message : String(error)}`,
				});
			}
		}
	}

	// Check for agent delegation markers
	const delegationMatches = [...remainingText.matchAll(DELEGATION_PATTERN)];
	if (delegationMatches.length > 0) {
		matchFound = true;

		for (const match of delegationMatches) {
			const [fullMatch, targetAgent, delegationJsonStr] = match;

			try {
				// Parse the delegation JSON
				const delegationData = JSON.parse(delegationJsonStr);

				results.push({
					type: "agent_delegation",
					fromAgent: "chatAgent", // Default, will be overridden if known
					toAgent: targetAgent,
					delegationData,
				});

				// Remove the delegation from the text
				remainingText = remainingText.replace(fullMatch, "");
			} catch (error) {
				results.push({
					type: "error",
					error: `Failed to parse delegation JSON: ${error instanceof Error ? error.message : String(error)}`,
				});
			}
		}
	}

	// Add remaining text if there is any
	if (remainingText.trim()) {
		results.push({
			type: "text",
			content: remainingText,
		});
	}

	// If no special content was detected, return the original chunk as text
	if (!matchFound) {
		results.push({
			type: "text",
			content: chunk,
		});
	}

	return results;
}

/**
 * Convert artifact data to AI SDK tool invocation format
 * This makes artifacts compatible with existing UI components
 */
export function convertToToolInvocation(
	artifactType: string,
	artifactData: any
) {
	return {
		id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		type: "artifact",
		result: {
			type: artifactType.replace("-", "_"), // Convert dash format to underscore format
			data: artifactData,
		},
	};
}

/**
 * Format agent delegation for display in the UI
 */
export function formatAgentDelegation(fromAgent: string, toAgent: string) {
	return `\n\n_Routing request to ${toAgent}..._\n\n`;
}

/**
 * Process stream data into AI SDK compatible format
 */
export function processStreamForAISDK(chunk: string) {
	const parsedChunks = parseStreamChunk(chunk);
	let resultText = "";
	const toolInvocations: any[] = [];

	for (const parsed of parsedChunks) {
		if (parsed.type === "text") {
			resultText += parsed.content || "";
		} else if (
			parsed.type === "artifact" &&
			parsed.artifactType &&
			parsed.artifactData
		) {
			// Convert artifact to tool invocation
			toolInvocations.push(
				convertToToolInvocation(parsed.artifactType, parsed.artifactData)
			);
		} else if (parsed.type === "agent_delegation" && parsed.toAgent) {
			// Add delegation notice to text
			resultText += formatAgentDelegation(
				parsed.fromAgent || "chatAgent",
				parsed.toAgent
			);
		}
		// Errors are ignored in the output
	}

	return {
		text: resultText,
		toolInvocations: toolInvocations.length > 0 ? toolInvocations : undefined,
	};
}
