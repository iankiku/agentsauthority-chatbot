import { competitiveIntelligenceTool } from '../ai/tools/competitive-intelligence-tool';

// Mock the MultiModelClient
jest.mock('../data-sources/multi-model-client', () => ({
  MultiModelClient: jest.fn().mockImplementation(() => ({
    queryAllModels: jest.fn().mockResolvedValue([
      {
        model: 'OpenAI GPT-4',
        response: 'Tesla is an innovative electric vehicle company with strong market presence.',
        mentions: 2,
        context: ['Tesla is an innovative electric vehicle company'],
        sentiment: 'positive',
        visibility_score: 85,
        execution_time: 1000,
        success: true,
      },
      {
        model: 'Anthropic Claude',
        response: 'Tesla leads the electric vehicle market with cutting-edge technology.',
        mentions: 1,
        context: ['Tesla leads the electric vehicle market'],
        sentiment: 'positive',
        visibility_score: 90,
        execution_time: 1200,
        success: true,
      },
    ]),
    getAvailableModels: jest.fn().mockReturnValue(['OpenAI GPT-4', 'Anthropic Claude', 'Google Gemini']),
  })),
}));

describe('competitiveIntelligenceTool', () => {
  test('should analyze competitive positioning correctly', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford', 'GM', 'Toyota'],
      industry: 'automotive',
      timeframe: 'week',
      includeRecommendations: true,
    });

    expect(result.primaryBrand).toBe('Tesla');
    expect(result.competitors).toEqual(['Ford', 'GM', 'Toyota']);
    expect(result.industry).toBe('automotive');
    expect(result.timeframe).toBe('week');
    expect(result.marketPosition.overallRank).toBeGreaterThan(0);
    expect(result.marketPosition.totalCompetitors).toBe(4); // Tesla + 3 competitors
    expect(result.marketPosition.marketShare).toBeGreaterThan(0);
    expect(result.marketPosition.competitiveScore).toBeGreaterThan(0);
    expect(result.shareOfVoice.primaryBrand).toBeGreaterThan(0);
    expect(result.shareOfVoice.competitors).toHaveLength(3);
    expect(result.competitiveGaps.length).toBeGreaterThan(0);
    expect(result.strategicRecommendations.length).toBeGreaterThan(0);
    expect(result.metadata.modelsQueried).toEqual(['OpenAI GPT-4', 'Anthropic Claude', 'Google Gemini']);
    expect(result.metadata.category).toBe('competitive-analysis');
  });

  test('should handle single competitor analysis', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Apple',
      competitors: ['Samsung'],
      industry: 'technology',
      timeframe: 'month',
    });

    expect(result.primaryBrand).toBe('Apple');
    expect(result.competitors).toEqual(['Samsung']);
    expect(result.marketPosition.totalCompetitors).toBe(2);
    expect(result.shareOfVoice.competitors).toHaveLength(1);
  });

  test('should handle multiple competitors analysis', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Microsoft',
      competitors: ['Google', 'Apple', 'Amazon', 'Meta'],
      industry: 'technology',
      timeframe: 'quarter',
    });

    expect(result.primaryBrand).toBe('Microsoft');
    expect(result.competitors).toHaveLength(4);
    expect(result.marketPosition.totalCompetitors).toBe(5);
    expect(result.shareOfVoice.competitors).toHaveLength(4);
  });

  test('should calculate market share correctly', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford', 'GM'],
      industry: 'automotive',
      timeframe: 'week',
    });

    expect(result.marketPosition.marketShare).toBeGreaterThan(0);
    expect(result.marketPosition.marketShare).toBeLessThanOrEqual(100);
    
    // Market share should sum to 100% across all brands
    const totalShare = result.shareOfVoice.primaryBrand + 
                      result.shareOfVoice.competitors.reduce((sum, comp) => sum + comp.share, 0);
    expect(totalShare).toBe(100);
  });

  test('should identify competitive gaps', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford', 'GM'],
      industry: 'automotive',
      timeframe: 'week',
    });

    expect(result.competitiveGaps.length).toBeGreaterThan(0);
    result.competitiveGaps.forEach((gap) => {
      expect(gap.category).toBeDefined();
      expect(gap.opportunity).toBeDefined();
      expect(['high', 'medium', 'low']).toContain(gap.impact);
      expect(['high', 'medium', 'low']).toContain(gap.effort);
    });
  });

  test('should generate strategic recommendations', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford', 'GM'],
      industry: 'automotive',
      timeframe: 'week',
      includeRecommendations: true,
    });

    expect(result.strategicRecommendations.length).toBeGreaterThan(0);
    expect(result.strategicRecommendations.length).toBeLessThanOrEqual(5);
    result.strategicRecommendations.forEach((recommendation) => {
      expect(typeof recommendation).toBe('string');
      expect(recommendation.length).toBeGreaterThan(0);
    });
  });

  test('should respect includeRecommendations flag', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford'],
      industry: 'automotive',
      timeframe: 'week',
      includeRecommendations: false,
    });

    expect(result.strategicRecommendations).toHaveLength(0);
  });

  test('should handle API errors gracefully', async () => {
    // Mock the MultiModelClient to throw an error
    const { MultiModelClient } = require('../data-sources/multi-model-client');
    MultiModelClient.mockImplementationOnce(() => ({
      queryAllModels: jest.fn().mockRejectedValue(new Error('API Error')),
      getAvailableModels: jest.fn().mockReturnValue([]),
    }));

    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford'],
      industry: 'automotive',
      timeframe: 'week',
    });

    expect(result.primaryBrand).toBe('Tesla');
    expect(result.marketPosition.overallRank).toBe(0);
    expect(result.marketPosition.marketShare).toBe(0);
    expect(result.marketPosition.competitiveScore).toBe(0);
    expect(result.shareOfVoice.primaryBrand).toBe(0);
    expect(result.competitiveGaps).toHaveLength(0);
    expect(result.strategicRecommendations[0]).toContain('Competitive analysis failed: API Error');
  });

  test('should validate input parameters', async () => {
    // Test with empty primary brand
    await expect(
      competitiveIntelligenceTool.execute({
        primaryBrand: '',
        competitors: ['Ford'],
        industry: 'automotive',
        timeframe: 'week',
      }),
    ).rejects.toThrow();

    // Test with empty competitors array
    await expect(
      competitiveIntelligenceTool.execute({
        primaryBrand: 'Tesla',
        competitors: [],
        industry: 'automotive',
        timeframe: 'week',
      }),
    ).rejects.toThrow();

    // Test with too many competitors
    await expect(
      competitiveIntelligenceTool.execute({
        primaryBrand: 'Tesla',
        competitors: Array(11).fill('Competitor'),
        industry: 'automotive',
        timeframe: 'week',
      }),
    ).rejects.toThrow();
  });

  test('should handle different timeframes correctly', async () => {
    const timeframes = ['week', 'month', 'quarter'] as const;
    
    for (const timeframe of timeframes) {
      const result = await competitiveIntelligenceTool.execute({
        primaryBrand: 'Tesla',
        competitors: ['Ford'],
        industry: 'automotive',
        timeframe,
      });

      expect(result.timeframe).toBe(timeframe);
    }
  });

  test('should provide detailed share of voice analysis', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford', 'GM'],
      industry: 'automotive',
      timeframe: 'week',
    });

    expect(result.shareOfVoice.primaryBrand).toBeGreaterThan(0);
    expect(result.shareOfVoice.competitors).toHaveLength(2);
    
    result.shareOfVoice.competitors.forEach((competitor) => {
      expect(competitor.name).toBeDefined();
      expect(competitor.share).toBeGreaterThanOrEqual(0);
      expect(competitor.rank).toBeGreaterThan(0);
      expect(competitor.change).toBeDefined();
    });
  });

  test('should calculate competitive scores correctly', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford', 'GM'],
      industry: 'automotive',
      timeframe: 'week',
    });

    expect(result.marketPosition.competitiveScore).toBeGreaterThan(0);
    expect(result.marketPosition.overallRank).toBeGreaterThan(0);
    expect(result.marketPosition.overallRank).toBeLessThanOrEqual(result.marketPosition.totalCompetitors);
  });

  test('should handle industry context', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford'],
      industry: 'electric vehicles',
      timeframe: 'week',
    });

    expect(result.industry).toBe('electric vehicles');
  });

  test('should provide execution time metadata', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford'],
      industry: 'automotive',
      timeframe: 'week',
    });

    expect(result.metadata.executionTime).toBeGreaterThan(0);
    expect(result.metadata.modelsQueried).toBeDefined();
    expect(result.metadata.category).toBe('competitive-analysis');
  });
});

describe('Competitive Analysis Logic', () => {
  test('should rank brands correctly by competitive score', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford', 'GM'],
      industry: 'automotive',
      timeframe: 'week',
    });

    // The primary brand should have a rank
    expect(result.marketPosition.overallRank).toBeGreaterThan(0);
    expect(result.marketPosition.overallRank).toBeLessThanOrEqual(result.marketPosition.totalCompetitors);
  });

  test('should identify high-impact competitive gaps', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford', 'GM'],
      industry: 'automotive',
      timeframe: 'week',
    });

    const highImpactGaps = result.competitiveGaps.filter((gap) => gap.impact === 'high');
    expect(highImpactGaps.length).toBeGreaterThan(0);
  });

  test('should provide actionable strategic recommendations', async () => {
    const result = await competitiveIntelligenceTool.execute({
      primaryBrand: 'Tesla',
      competitors: ['Ford', 'GM'],
      industry: 'automotive',
      timeframe: 'week',
      includeRecommendations: true,
    });

    expect(result.strategicRecommendations.length).toBeGreaterThan(0);
    result.strategicRecommendations.forEach((recommendation) => {
      expect(recommendation).toContain('Focus on') || 
      expect(recommendation).toContain('Develop') || 
      expect(recommendation).toContain('Implement') ||
      expect(recommendation).toContain('Increase') ||
      expect(recommendation).toContain('Monitor');
    });
  });
});
