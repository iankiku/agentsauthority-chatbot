// apps/dashboard/lib/ai/providers.ts
import { createProvider } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export const aiProvider = createProvider({
  languageModels: {
    'chat-model': openai('gpt-4-turbo'),
    'reasoning-model': anthropic('claude-3-opus-20240229'),
  }
});
