import { visibilityAcrossModelsTool } from '../ai/tools/visibility-across-models-tool';
import { ArtifactProcessor } from '../artifacts/artifact-processor';

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

describe('Chat Integration with Visibility Tool', () => {
  test('tool responds to brand visibility queries', async () => {
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
    expect(result.insights).toHaveLength(4);
    expect(result.recommendations).toHaveLength(2);
  });

  test('artifact is generated and processed correctly', async () => {
    const artifactProcessor = new ArtifactProcessor();

    const mockToolResult = {
      brandName: 'Apple',
      timestamp: '2024-01-15T10:30:00Z',
      timeframe: 'week',
      modelResults: [
        {
          model: 'OpenAI GPT-4',
          response: 'Apple is a technology company.',
          mentions: 1,
          context: ['Apple is a technology company.'],
          sentiment: 'positive' as const,
          visibility_score: 85,
          execution_time: 1000,
          success: true,
        },
      ],
      overallVisibility: 85,
      insights: ['Strong visibility across AI platforms'],
      recommendations: ['Monitor competitor visibility'],
      metadata: {
        executionTime: 1000,
        modelsQueried: ['OpenAI GPT-4'],
        queriesUsed: ['Tell me about Apple'],
        category: 'visibility-analysis' as const,
      },
    };

    const artifact = await artifactProcessor.processToolResult(
      'visibilityAcrossModels',
      mockToolResult,
      {
        userId: 'test-user-id',
        conversationId: 'test-conversation-id',
        timestamp: '2024-01-15T10:30:00Z',
      },
    );

    expect(artifact.type).toBe('visibility-matrix');
    expect(artifact.title).toBe('Brand Visibility Analysis - Apple');
    expect(artifact.metadata.brandName).toBe('Apple');
    expect(artifact.metadata.category).toBe('visibility-analysis');
    expect(artifact.metadata.tags).toContain('brand-visibility');
    expect(artifact.metadata.generatedBy).toBe('visibilityAcrossModels');
  });

  test('handles tool errors gracefully', async () => {
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

  test('natural language queries trigger tool correctly', async () => {
    // Test that the tool can handle various natural language queries
    const queries = [
      'Show my Tesla brand visibility across AI models',
      'How does Apple appear in ChatGPT, Claude, and Gemini?',
      'Check Nike brand visibility on AI platforms',
      'Analyze Microsoft presence across AI models',
    ];

    for (const query of queries) {
      // In a real implementation, this would test the natural language processing
      // For now, we'll just verify the tool can handle the brand names
      const brandNames = ['Tesla', 'Apple', 'Nike', 'Microsoft'];
      const foundBrand = brandNames.find((brand) => query.includes(brand));

      if (foundBrand) {
        const result = await visibilityAcrossModelsTool.execute({
          brandName: foundBrand,
          timeframe: 'week',
        });

        expect(result.brandName).toBe(foundBrand);
        expect(result.timeframe).toBe('week');
      }
    }
  });
});
