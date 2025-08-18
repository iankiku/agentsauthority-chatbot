import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { getProviderModel, isProviderConfigured } from './provider-config';
import { AuthenticationError, ExternalServiceError } from './api-errors';

export async function googleWebSearch(query: string): Promise<any> {
  // Ensure Google provider is configured
  if (!isProviderConfigured('google')) {
    throw new ExternalServiceError('Google AI provider is not configured', 'Google');
  }

  try {
    const model = getProviderModel('google', 'gemini-1.5-pro', { useSearchGrounding: true });

    if (!model) {
      throw new ExternalServiceError('Google Gemini model not available', 'Google');
    }

    const result = await generateText({
      model: model,
      prompt: `Perform a web search for: ${query}. Summarize the key findings and provide relevant URLs.`, 
      maxTokens: 1000,
    });

    return {
      summary: result.text,
      // Note: AI SDK does not directly expose search results/URLs from search grounding.
      // A more advanced implementation would involve parsing the text for URLs or using a dedicated search API.
      // For now, we return the summary.
    };
  } catch (error) {
    console.error('Error performing Google web search:', error);
    throw new ExternalServiceError(`Failed to perform web search: ${(error as Error).message}`, 'Google');
  }
}
