import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
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

  private initializeModels(): void {
    // Configure models
    this.models.set('gpt-4', {
      name: 'OpenAI GPT-4',
      provider: 'openai',
      modelId: 'gpt-4o',
      maxTokens: 2000,
      temperature: 0.7,
    });

    this.models.set('claude', {
      name: 'Anthropic Claude',
      provider: 'anthropic',
      modelId: 'claude-3-5-sonnet-20241022',
      maxTokens: 2000,
      temperature: 0.7,
    });

    this.models.set('gemini', {
      name: 'Google Gemini',
      provider: 'google',
      modelId: 'gemini-1.5-flash',
      maxTokens: 2000,
      temperature: 0.7,
    });

    // Initialize providers
    this.providers.set('openai', openai);
    this.providers.set('anthropic', anthropic);
    this.providers.set('google', google);
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

    // Create promises for all model queries
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
   * Query a single model
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
      const response = await provider(modelConfig.modelId).generateText({
        prompt: query,
        maxTokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
      });

      return response.text;
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
    const successRate =
      results.length > 0
        ? (results.filter((r) => r.success).length / results.length) * 100
        : 0;
    const sentiments = results.map((r) => r.sentiment);
    const averageSentiment = calculateAverageSentiment(sentiments);
    const totalExecutionTime = Date.now() - startTime;

    return {
      results,
      total_mentions: totalMentions,
      average_sentiment: averageSentiment,
      average_visibility_score: Math.round(averageVisibilityScore),
      total_execution_time: totalExecutionTime,
      success_rate: Math.round(successRate),
    };
  }

  /**
   * Get available models
   */
  getAvailableModels(): string[] {
    return Array.from(this.models.keys());
  }

  /**
   * Check if a model is available
   */
  isModelAvailable(modelKey: string): boolean {
    return this.models.has(modelKey);
  }
}
