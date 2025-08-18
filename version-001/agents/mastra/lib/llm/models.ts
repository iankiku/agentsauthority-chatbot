// todo rename this file to models.ts and move it to the lib folder and correct the imports

import { createAnthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { ollama } from "ollama-ai-provider";

// Removed createProviderRegistry and customProvider imports

// Define core model IDs
const OPENROUTER_QWEN_MODEL_ID = "qwen/qwen3-30b-a3b";
const OPENAI_GPT4O_MODEL_ID = "gpt-5-nano-2025-08-07";
const ANTHROPIC_CLAUDE_MODEL_ID = "anthropic/claude-3-5-sonnet-20241022";
const GOOGLE_GEMINI_MODEL_ID = "gemini-2.0-flash-001";
const OLLAMA_LOCAL_GPT = "gpt-oss:latest";

// Create instances of providers
const openaiProvider = createOpenAI({ apiKey: process.env.OPENAI_API_KEY,});
const anthropicProvider = createAnthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
});
const openrouterProvider = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
});

// Exported Model Constants - Simplification
export const qwenModel = openrouterProvider(OPENROUTER_QWEN_MODEL_ID);
export const openaiModel = openaiProvider(OPENAI_GPT4O_MODEL_ID);
export const claudeModel = anthropicProvider(ANTHROPIC_CLAUDE_MODEL_ID);
export const googleModel = google(GOOGLE_GEMINI_MODEL_ID);
export const ollamaModel = ollama(OLLAMA_LOCAL_GPT);

// Default and Fallback models
export const defaultModel = openaiModel;
export const reasoningModel = openaiModel;
export const writingModel = claudeModel;
export const codingModel = claudeModel;
export const fallbackModel = googleModel;

// Removed registry and getModelById
