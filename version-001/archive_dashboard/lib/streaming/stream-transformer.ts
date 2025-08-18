/**
 * Stream transformer for Mastra agent responses
 *
 * Transforms raw Mastra agent streams into AI SDK compatible format,
 * with support for artifact detection and agent delegation.
 */

import { processStreamForAISDK } from "./artifact-processor";

/**
 * Transform a stream chunk into AI SDK format
 */
function transformChunkToAISDK(chunk: Uint8Array): Uint8Array {
	const decoder = new TextDecoder();
	const text = decoder.decode(chunk);
	const encoder = new TextEncoder();

	try {
		// Process the chunk to detect artifacts and agent delegations
		const processed = processStreamForAISDK(text);

		// Format as AI SDK compatible SSE data
		let output = "";

		// Add text content if present
		if (processed.text) {
			output += `data: ${JSON.stringify({ type: "text", value: processed.text })}\n\n`;
		}

		// Add tool invocations if present
		if (processed.toolInvocations) {
			for (const tool of processed.toolInvocations) {
				output += `data: ${JSON.stringify({ type: "tool", value: tool })}\n\n`;
			}
		}

		// If no output was generated, return the original text
		if (!output) {
			output = `data: ${JSON.stringify({ type: "text", value: text })}\n\n`;
		}

		return encoder.encode(output);
	} catch (error) {
		// On error, return the original text as-is
		console.error("Error transforming stream chunk:", error);
		return encoder.encode(
			`data: ${JSON.stringify({ type: "text", value: text })}\n\n`
		);
	}
}

/**
 * Creates a TransformStream that converts Mastra agent streams to AI SDK format
 */
export function createAISDKTransformer() {
	// Create a text collection for saving to database
	let completeContent = "";
	let artifacts: any[] = [];

	return new TransformStream<Uint8Array, Uint8Array>({
		transform(chunk, controller) {
			// Transform the chunk into AI SDK format
			const transformedChunk = transformChunkToAISDK(chunk);

			// Forward the transformed chunk to the client
			controller.enqueue(transformedChunk);

			// Collect the original text for database saving
			const decoder = new TextDecoder();
			const text = decoder.decode(chunk);
			completeContent += text;

			// Extract artifacts for later storage if needed
			try {
				const processed = processStreamForAISDK(text);
				if (processed.toolInvocations) {
					artifacts.push(...processed.toolInvocations);
				}
			} catch (error) {
				// Ignore errors in artifact extraction
				console.error("Error extracting artifacts:", error);
			}
		},
		flush() {
			// Nothing to do on flush - the caller will handle database updates
		},
	});
}

/**
 * Creates a TransformStream that collects the complete content from a stream
 */
export function createContentCollectorTransformer() {
	// Create a text collection for saving to database
	let completeContent = "";

	return {
		transform: new TransformStream<Uint8Array, Uint8Array>({
			transform(chunk, controller) {
				// Forward the chunk unchanged
				controller.enqueue(chunk);

				// Collect content for later use
				const decoder = new TextDecoder();
				const text = decoder.decode(chunk);
				completeContent += text;
			},
		}),
		getCompleteContent: () => completeContent,
	};
}
