import { tool } from 'ai';
import { z } from 'zod';
import { MultiModelClient } from '../../data-sources/multi-model-client';
import {
  calculateOverallVisibility,
  extractMetadata,
  generateInsights,
  generateQueries,
} from './utils';

export const visibilityAcrossModelsTool = tool({
  description:
    'Scan brand visibility across ChatGPT, Claude, Gemini, and Perplexity with real-time analysis',
  inputSchema: z.object({
    brandName: z.string().describe('The brand name to analyze'),
    queries: z
      .array(z.string())
      .optional()
      .describe('Custom queries to use for analysis'),
    timeframe: z
      .enum(['day', 'week', 'month'])
      .default('week')
      .describe('Timeframe for analysis'),
    includeRecommendations: z
      .boolean()
      .default(true)
      .describe('Include actionable recommendations'),
  }),
  execute: async ({
    brandName,
    queries = [],
    timeframe = 'week',
    includeRecommendations = true,
  }) => {
    const startTime = Date.now();

    try {
      // Initialize the multi-model client
      const multiModelClient = new MultiModelClient();

      // Generate queries for analysis
      const queryResult = generateQueries(brandName, queries);
      const analysisQueries = queryResult.queries;

      // Perform brand analysis across all models
      const modelResults = await multiModelClient.queryAllModels(
        brandName,
        analysisQueries,
      );

      // Check if any models were available
      if (modelResults.length === 0) {
        return {
          brandName,
          timestamp: new Date().toISOString(),
          timeframe,
          modelResults: [],
          overallVisibility: 0,
          insights: [
            'No AI models are currently available for analysis.',
            'Please ensure you have configured at least one of the following API keys:',
            '- OPENAI_API_KEY (for ChatGPT/GPT-4)',
            '- ANTHROPIC_API_KEY (for Claude)',
            '- GOOGLE_API_KEY (for Gemini)',
          ],
          recommendations: includeRecommendations
            ? [
                'Configure your OpenAI API key to enable brand visibility analysis',
                'You can get an OpenAI API key from https://platform.openai.com/api-keys',
              ]
            : [],
          metadata: {
            executionTime: Date.now() - startTime,
            modelsQueried: [],
            queriesUsed: queries,
            category: 'visibility-analysis',
            error: 'No AI models available',
          },
        };
      }

      // Calculate overall visibility score
      const overallVisibility = calculateOverallVisibility(modelResults);

      // Generate insights and recommendations
      const { insights, recommendations } = generateInsights(
        modelResults,
        brandName,
      );

      // Calculate execution time
      const executionTime = Date.now() - startTime;

      // Extract metadata
      const metadata = extractMetadata(
        modelResults,
        analysisQueries,
        executionTime,
      );

      // Build the response
      return {
        brandName,
        timestamp: new Date().toISOString(),
        timeframe,
        modelResults,
        overallVisibility,
        insights,
        recommendations: includeRecommendations ? recommendations : [],
        metadata,
      };
    } catch (error) {
      // Handle errors gracefully
      const executionTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      // Return a partial result with error information
      return {
        brandName,
        timestamp: new Date().toISOString(),
        timeframe,
        modelResults: [],
        overallVisibility: 0,
        insights: [`Analysis failed: ${errorMessage}`],
        recommendations: includeRecommendations
          ? ['Please check your brand name and try again']
          : [],
        metadata: {
          executionTime,
          modelsQueried: [],
          queriesUsed: queries,
          category: 'visibility-analysis',
        },
      };
    }
  },
});
