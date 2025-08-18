/**
 * Helper: call an LLM in JSON‑mode and validate against a Zod schema.
 */
import { NoObjectGeneratedError, generateObject } from "ai";
import { ZodSchema, z } from "zod";
import { defaultModel, fallbackModel } from "./llm/models";

export async function llmJSONCall<T extends ZodSchema>(
	schema: T,
	prompt: string
): Promise<z.infer<T>> {
	console.log(`[llmJSONCall] --- START ---`);
	console.log(`[llmJSONCall] Schema:`, schema.description || schema.toString());
	console.log(`[llmJSONCall] Prompt:`, prompt);

	try {
		// Try with default model first
		const { object } = await generateObject({
			model: defaultModel,
			schema: schema,
			prompt: prompt,
		});

		console.log(
			`[llmJSONCall] Success with default model:`,
			JSON.stringify(object, null, 2)
		);
		return object;
	} catch (error) {
		console.error(`[llmJSONCall] Default model failed:`, error);

		if (error instanceof NoObjectGeneratedError) {
			console.warn(
				`[llmJSONCall] NoObjectGeneratedError detected, trying fallback model...`
			);
			try {
				const { object } = await generateObject({
					model: fallbackModel,
					schema: schema,
					prompt: prompt,
				});

				console.log(
					`[llmJSONCall] Success with fallback model:`,
					JSON.stringify(object, null, 2)
				);
				return object;
			} catch (fallbackError) {
				console.error(
					`[llmJSONCall] Fallback model also failed:`,
					fallbackError
				);
				const fallbackMessage =
					fallbackError instanceof Error
						? fallbackError.message
						: String(fallbackError);
				throw new Error(
					`Both models failed to generate valid JSON. Default error: ${error.message}, Fallback error: ${fallbackMessage}`
				);
			}
		} else {
			// Not a NoObjectGeneratedError, rethrow the original error
			throw error;
		}
	}
}
