import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import type {
  BrandAnalysisRequest,
  BrandAnalysisResponse,
  ModelConfig,
  ModelResult,
} from './types';
import {
  analyzeSentiment,
  calculateAverageSentiment,
  calculateVisibilityScore,
  countBrandMentions,
  extractContext,
} from './utils';

export class ModelQueryError extends Error {
  constructor(
    public model: string,
    public cause: string,
  ) {
    super(`Failed to query ${model}: ${cause}`);
    this.name = 'ModelQueryError';
  }
}

export class MultiModelClient {
  private models: Map<string, ModelConfig> = new Map();
  private providers: Map<string, any> = new Map();

  constructor() {
    this.initializeModels();
  }

  private hasValidApiKey(provider: string): boolean {
    switch (provider) {
      case 'openai':
        return !!process.env.OPENAI_API_KEY;
      case 'anthropic':
        return !!process.env.ANTHROPIC_API_KEY;
      case 'google':
        return !!process.env.GOOGLE_API_KEY;
      default:
        return false;
    }
  }

  private initializeModels(): void {
    // Only initialize models that have valid API keys
    const availableModels: Array<{ key: string; config: ModelConfig }> = [];

    // Check OpenAI
    if (this.hasValidApiKey('openai')) {
      availableModels.push({
        key: 'gpt-4',
        config: {
          name: 'OpenAI GPT-4',
          provider: 'openai',
          modelId: 'gpt-4o',
          maxTokens: 2000,
          temperature: 0.7,
        },
      });
      this.providers.set('openai', openai);
    } else {
      console.warn('OpenAI API key not configured - skipping GPT-4');
    }

    // Check Anthropic
    if (this.hasValidApiKey('anthropic')) {
      availableModels.push({
        key: 'claude',
        config: {
          name: 'Anthropic Claude',
          provider: 'anthropic',
          modelId: 'claude-3-5-sonnet-20241022',
          maxTokens: 2000,
          temperature: 0.7,
        },
      });
      this.providers.set('anthropic', anthropic);
    } else {
      console.warn('Anthropic API key not configured - skipping Claude');
    }

    // Check Google
    if (this.hasValidApiKey('google')) {
      availableModels.push({
        key: 'gemini',
        config: {
          name: 'Google Gemini',
          provider: 'google',
          modelId: 'gemini-1.5-flash',
          maxTokens: 2000,
          temperature: 0.7,
        },
      });
      this.providers.set('google', google);
    } else {
      console.warn('Google API key not configured - skipping Gemini');
    }

    // Add available models to the map
    availableModels.forEach(({ key, config }) => {
      this.models.set(key, config);
    });

    // Ensure we have at least one model available
    if (this.models.size === 0) {
      console.error('No AI providers configured with valid API keys!');
      console.error(
        'Please configure at least one of: OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY',
      );
    } else {
      console.log(
        `Initialized ${this.models.size} AI model(s): ${Array.from(this.models.keys()).join(', ')}`,
      );
    }
  }

  /**
   * Query all models in parallel for brand analysis
   */
  async queryAllModels(
    brandName: string,
    queries: string[],
  ): Promise<ModelResult[]> {
    const startTime = Date.now();
    const results: ModelResult[] = [];

    // If no models are available, return empty results
    if (this.models.size === 0) {
      console.warn('No AI models available for querying');
      return results;
    }

    // Create promises for all available model queries
    const queryPromises = Array.from(this.models.entries()).map(
      async ([modelKey, modelConfig]) => {
        const modelStartTime = Date.now();

        try {
          const response = await this.queryModel(
            modelConfig,
            queries.join('\n\n'),
          );
          const executionTime = Date.now() - modelStartTime;

          const result: ModelResult = {
            model: modelConfig.name,
            response,
            mentions: countBrandMentions(response, brandName),
            context: extractContext(response, brandName),
            sentiment: analyzeSentiment(response, brandName),
            visibility_score: calculateVisibilityScore(response, brandName),
            execution_time: executionTime,
            success: true,
          };

          return result;
        } catch (error) {
          const executionTime = Date.now() - modelStartTime;

          const result: ModelResult = {
            model: modelConfig.name,
            response: '',
            mentions: 0,
            context: [],
            sentiment: 'neutral',
            visibility_score: 0,
            execution_time: executionTime,
            success: false,
          };

          console.error(`Error querying ${modelConfig.name}:`, error);
          return result;
        }
      },
    );

    // Execute all queries in parallel
    const modelResults = await Promise.all(queryPromises);
    results.push(...modelResults);

    const totalTime = Date.now() - startTime;
    console.log(`Multi-model query completed in ${totalTime}ms`);

    return results;
  }

  /**
   * Query a single model using real API calls
   */
  private async queryModel(
    modelConfig: ModelConfig,
    query: string,
  ): Promise<string> {
    const provider = this.providers.get(modelConfig.provider);
    if (!provider) {
      throw new ModelQueryError(
        modelConfig.name,
        `Provider ${modelConfig.provider} not found`,
      );
    }

    try {
      // Use real AI SDK generateText for actual API calls
      const { text } = await generateText({
        model: provider(modelConfig.modelId),
        prompt: query,
        maxTokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
      });

      return text;
    } catch (error) {
      throw new ModelQueryError(
        modelConfig.name,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  /**
   * Perform complete brand analysis across all models
   */
  async analyzeBrand(
    request: BrandAnalysisRequest,
  ): Promise<BrandAnalysisResponse> {
    const startTime = Date.now();

    const results = await this.queryAllModels(
      request.brandName,
      request.queries,
    );

    // Calculate aggregated metrics
    const totalMentions = results.reduce(
      (sum, result) => sum + result.mentions,
      0,
    );
    const averageVisibilityScore =
      results.length > 0
        ? results.reduce((sum, result) => sum + result.visibility_score, 0) /
          results.length
        : 0;
    const averageSentiment = calculateAverageSentiment(results);

    const executionTime = Date.now() - startTime;

    return {
      brandName: request.brandName,
      timestamp: new Date().toISOString(),
      modelResults: results,
      aggregatedMetrics: {
        totalMentions,
        averageVisibilityScore,
        averageSentiment,
        modelsQueried: results.length,
      },
      executionTime,
    };
  }
}
