import {
  calculateOverallVisibility,
  extractMetadata,
  generateInsights,
  generateQueries,
} from '../ai/tools/utils';
import { visibilityAcrossModelsTool } from '../ai/tools/visibility-across-models-tool';
import type { ModelResult } from '../data-sources/types';

// Mock the MultiModelClient
jest.mock('../data-sources/multi-model-client', () => ({
  MultiModelClient: jest.fn().mockImplementation(() => ({
    queryAllModels: jest.fn().mockResolvedValue([
      {
        model: 'OpenAI GPT-4',
        response: 'Tesla is an innovative electric vehicle company.',
        mentions: 1,
        context: ['Tesla is an innovative electric vehicle company.'],
        sentiment: 'positive' as const,
        visibility_score: 75,
        execution_time: 1000,
        success: true,
      },
      {
        model: 'Anthropic Claude',
        response: 'Tesla is known for electric cars and sustainable energy.',
        mentions: 1,
        context: ['Tesla is known for electric cars and sustainable energy.'],
        sentiment: 'positive' as const,
        visibility_score: 80,
        execution_time: 1200,
        success: true,
      },
    ]),
  })),
}));

describe('visibilityAcrossModelsTool', () => {
  test('should accept valid parameters', async () => {
    const result = await visibilityAcrossModelsTool.execute({
      brandName: 'Tesla',
      queries: ['Tell me about Tesla'],
      timeframe: 'week',
      includeRecommendations: true,
    });

    expect(result.brandName).toBe('Tesla');
    expect(result.timeframe).toBe('week');
    expect(result.modelResults).toHaveLength(2);
    expect(result.overallVisibility).toBeGreaterThan(0);
    expect(result.insights).toHaveLength(4); // 4 insights generated
    expect(result.recommendations).toHaveLength(2); // 2 recommendations
  });

  test('should validate brand name requirements', async () => {
    const result = await visibilityAcrossModelsTool.execute({
      brandName: 'T', // Very short name
      timeframe: 'week',
    });

    expect(result.brandName).toBe('T');
    expect(result.modelResults).toHaveLength(2);
  });

  test('should use default queries when none provided', async () => {
    const result = await visibilityAcrossModelsTool.execute({
      brandName: 'Apple',
      timeframe: 'month',
    });

    expect(result.brandName).toBe('Apple');
    expect(result.metadata.queriesUsed).toHaveLength(4); // Default queries
  });

  test('should generate appropriate insights', async () => {
    const result = await visibilityAcrossModelsTool.execute({
      brandName: 'Tesla',
      timeframe: 'week',
    });

    expect(result.insights).toContain('Strong visibility across AI platforms');
    expect(result.insights).toContain('Positive sentiment dominant');
    expect(result.insights).toContain('Strongest performance on');
    expect(result.insights).toContain('total brand mentions detected');
  });

  test('should handle multi-model client errors gracefully', async () => {
    // Mock the MultiModelClient to throw an error
    const { MultiModelClient } = require('../data-sources/multi-model-client');
    MultiModelClient.mockImplementationOnce(() => ({
      queryAllModels: jest.fn().mockRejectedValue(new Error('API Error')),
    }));

    const result = await visibilityAcrossModelsTool.execute({
      brandName: 'TestBrand',
      timeframe: 'week',
    });

    expect(result.modelResults).toHaveLength(0);
    expect(result.overallVisibility).toBe(0);
    expect(result.insights[0]).toContain('Analysis failed: API Error');
    expect(result.recommendations).toContain(
      'Please check your brand name and try again',
    );
  });

  test('should return properly structured response', async () => {
    const result = await visibilityAcrossModelsTool.execute({
      brandName: 'Nike',
      timeframe: 'day',
      includeRecommendations: false,
    });

    expect(result).toHaveProperty('brandName');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('timeframe');
    expect(result).toHaveProperty('modelResults');
    expect(result).toHaveProperty('overallVisibility');
    expect(result).toHaveProperty('insights');
    expect(result).toHaveProperty('recommendations');
    expect(result).toHaveProperty('metadata');
    expect(result.recommendations).toHaveLength(0); // Recommendations disabled
  });
});

describe('Utility Functions', () => {
  describe('generateQueries', () => {
    test('should generate default queries when none provided', () => {
      const result = generateQueries('Tesla');
      expect(result.queries).toHaveLength(4);
      expect(result.source).toBe('default');
      expect(result.queries[0]).toContain('Tesla');
    });

    test('should use custom queries when provided', () => {
      const customQueries = ['Custom query about Tesla'];
      const result = generateQueries('Tesla', customQueries);
      expect(result.queries).toEqual(customQueries);
      expect(result.source).toBe('custom');
    });
  });

  describe('generateInsights', () => {
    const mockResults: ModelResult[] = [
      {
        model: 'GPT-4',
        response: 'Tesla is great',
        mentions: 1,
        context: ['Tesla is great'],
        sentiment: 'positive',
        visibility_score: 80,
        execution_time: 1000,
        success: true,
      },
      {
        model: 'Claude',
        response: 'Tesla is excellent',
        mentions: 1,
        context: ['Tesla is excellent'],
        sentiment: 'positive',
        visibility_score: 85,
        execution_time: 1200,
        success: true,
      },
    ];

    test('should generate insights for positive results', () => {
      const { insights, recommendations } = generateInsights(
        mockResults,
        'Tesla',
      );
      expect(insights).toContain('Strong visibility across AI platforms');
      expect(insights).toContain('Positive sentiment dominant');
      expect(recommendations).toHaveLength(2); // General recommendations
    });

    test('should generate insights for negative results', () => {
      const negativeResults = mockResults.map((r) => ({
        ...r,
        sentiment: 'negative' as const,
        visibility_score: 20,
      }));
      const { insights, recommendations } = generateInsights(
        negativeResults,
        'Tesla',
      );
      expect(insights).toContain('Limited visibility across AI platforms');
      expect(insights).toContain('Negative sentiment detected');
      expect(recommendations).toContain('Address negative sentiment patterns');
    });
  });

  describe('calculateOverallVisibility', () => {
    test('should calculate average visibility score', () => {
      const results: ModelResult[] = [
        { visibility_score: 80 } as ModelResult,
        { visibility_score: 60 } as ModelResult,
      ];
      const score = calculateOverallVisibility(results);
      expect(score).toBe(70);
    });

    test('should return 0 for empty results', () => {
      const score = calculateOverallVisibility([]);
      expect(score).toBe(0);
    });
  });

  describe('extractMetadata', () => {
    test('should extract correct metadata', () => {
      const results: ModelResult[] = [
        { model: 'GPT-4' } as ModelResult,
        { model: 'Claude' } as ModelResult,
      ];
      const queries = ['Query 1', 'Query 2'];
      const executionTime = 5000;

      const metadata = extractMetadata(results, queries, executionTime);
      expect(metadata.executionTime).toBe(5000);
      expect(metadata.modelsQueried).toEqual(['GPT-4', 'Claude']);
      expect(metadata.queriesUsed).toEqual(queries);
      expect(metadata.category).toBe('visibility-analysis');
    });
  });
});
