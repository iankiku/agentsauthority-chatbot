import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Create provider instances
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Model configurations
export const models = {
  // OpenAI models
  'gpt-4o': openai('gpt-4o'),
  'gpt-4o-mini': openai('gpt-4o-mini'),
  'gpt-4-turbo': openai('gpt-4-turbo'),
  
  // Anthropic models
  'claude-3-5-sonnet-20241022': anthropic('claude-3-5-sonnet-20241022'),
  'claude-3-5-haiku-20241022': anthropic('claude-3-5-haiku-20241022'),
  'claude-3-opus-20240229': anthropic('claude-3-opus-20240229'),
  
  // Google models
  'gemini-1.5-pro': google('gemini-1.5-pro'),
  'gemini-1.5-flash': google('gemini-1.5-flash'),
} as const;

// Default model
export const defaultModel = models['gpt-4o-mini'];

// Model type
export type ModelKey = keyof typeof models;