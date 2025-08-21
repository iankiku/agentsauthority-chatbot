import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { visibilityScoringTool } from '../lib/ai/tools/visibility-scoring-tool';
import { cleanupTask } from '../lib/sse/progress-tracker';

describe('Visibility Scoring Tool', () => {
  const testTaskId = 'visibility-test-123';
  const mockAnalysisResults = [
    {
      response:
        'Tesla is leading the electric vehicle market with innovative technology',
      sentiment: 'positive',
      mentions: 5,
      context: ['electric vehicles', 'technology', 'innovation'],
    },
    {
      response: 'Ford and GM are competing with Tesla in the EV space',
      sentiment: 'neutral',
      mentions: 3,
      context: ['electric vehicles', 'competition', 'automotive'],
    },
    {
      response: 'Volkswagen is expanding its electric vehicle lineup',
      sentiment: 'positive',
      mentions: 2,
      context: ['electric vehicles', 'expansion', 'automotive'],
    },
  ];

  const mockBrandDetectionResults = [
    { brandName: 'Tesla', confidence: 0.95 },
    { brandName: 'Ford', confidence: 0.88 },
    { brandName: 'GM', confidence: 0.92 },
    { brandName: 'Volkswagen', confidence: 0.87 },
  ];

  beforeEach(() => {
    // Clean up any existing test tasks
    cleanupTask(testTaskId);
  });

  afterEach(() => {
    // Clean up after each test
    cleanupTask(testTaskId);
  });

  describe('Basic Functionality', () => {
    test('should calculate visibility scores for all brands', async () => {
      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        brandDetectionResults: mockBrandDetectionResults,
        taskId: testTaskId,
      });

      expect(result.brandScores).toBeDefined();
      expect(result.brandScores).toHaveLength(4); // Tesla + 3 competitors
      expect(result.brandScores[0].brandName).toBe('Tesla');
      expect(result.brandScores[0].visibilityScore).toBeGreaterThan(0);
      expect(result.brandScores[0].visibilityScore).toBeLessThanOrEqual(100);
    });

    test('should provide competitive positioning analysis', async () => {
      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        brandDetectionResults: mockBrandDetectionResults,
        taskId: testTaskId,
      });

      expect(result.competitivePositioning).toBeDefined();
      expect(result.competitivePositioning.targetBrandRank).toBeGreaterThan(0);
      expect(result.competitivePositioning.marketPosition).toBeDefined();
      expect(result.competitivePositioning.marketShare).toBeGreaterThan(0);
      expect(result.competitivePositioning.competitiveAdvantage).toBeInstanceOf(
        Array,
      );
      expect(
        result.competitivePositioning.competitiveDisadvantage,
      ).toBeInstanceOf(Array);
    });

    test('should calculate share of voice metrics', async () => {
      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        brandDetectionResults: mockBrandDetectionResults,
        taskId: testTaskId,
      });

      expect(result.shareOfVoice).toBeDefined();
      expect(result.shareOfVoice.total).toBeGreaterThan(0);
      expect(result.shareOfVoice.breakdown).toBeDefined();
      expect(result.shareOfVoice.channelDistribution).toBeDefined();
      expect(result.shareOfVoice.trend).toBeDefined();
    });

    test('should generate competitive rankings', async () => {
      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        brandDetectionResults: mockBrandDetectionResults,
        taskId: testTaskId,
      });

      expect(result.competitiveRankings).toBeDefined();
      expect(result.competitiveRankings).toHaveLength(4);
      expect(result.competitiveRankings[0].rank).toBe(1);
      expect(result.competitiveRankings[0].confidence).toBeGreaterThan(0);
    });

    test('should generate insights and recommendations', async () => {
      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        brandDetectionResults: mockBrandDetectionResults,
        taskId: testTaskId,
      });

      expect(result.insights).toBeDefined();
      expect(result.insights.keyFindings).toBeInstanceOf(Array);
      expect(result.insights.opportunities).toBeInstanceOf(Array);
      expect(result.insights.threats).toBeInstanceOf(Array);
      expect(result.insights.recommendations).toBeInstanceOf(Array);
    });
  });

  describe('Custom Scoring Weights', () => {
    test('should handle custom scoring weights', async () => {
      const customWeights = {
        mentions: 0.5,
        sentiment: 0.3,
        context: 0.1,
        reach: 0.1,
      };

      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        brandDetectionResults: mockBrandDetectionResults,
        scoringWeights: customWeights,
        taskId: testTaskId,
      });

      expect(result.metadata.scoringWeights).toEqual(customWeights);
    });

    test('should use default weights when not provided', async () => {
      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        brandDetectionResults: mockBrandDetectionResults,
        taskId: testTaskId,
      });

      expect(result.metadata.scoringWeights).toEqual({
        mentions: 0.3,
        sentiment: 0.2,
        context: 0.2,
        reach: 0.3,
      });
    });
  });

  describe('Trend Analysis', () => {
    test('should include trend analysis when historical data is provided', async () => {
      const historicalData = [
        {
          date: '2024-01-01',
          scores: { Tesla: 75, Ford: 60, GM: 55, Volkswagen: 50 },
        },
        {
          date: '2024-02-01',
          scores: { Tesla: 80, Ford: 65, GM: 60, Volkswagen: 55 },
        },
      ];

      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        brandDetectionResults: mockBrandDetectionResults,
        historicalData,
        includeTrends: true,
        taskId: testTaskId,
      });

      expect(result.trendAnalysis).toBeDefined();
      expect(result.trendAnalysis.period).toBeDefined();
      expect(result.trendAnalysis.trends).toBeInstanceOf(Array);
      expect(result.trendAnalysis.predictions).toBeInstanceOf(Array);
    });

    test('should not include trend analysis when historical data is not provided', async () => {
      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        brandDetectionResults: mockBrandDetectionResults,
        includeTrends: false,
        taskId: testTaskId,
      });

      expect(result.trendAnalysis).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('should handle empty analysis results gracefully', async () => {
      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: [],
        taskId: testTaskId,
      });

      expect(result.brandScores).toBeDefined();
      expect(result.brandScores).toHaveLength(4);
      // Should still calculate scores even with empty results
      expect(result.brandScores[0].visibilityScore).toBeGreaterThanOrEqual(0);
    });

    test('should handle missing brand detection results', async () => {
      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        taskId: testTaskId,
      });

      expect(result.brandScores).toBeDefined();
      expect(result.brandScores).toHaveLength(4);
    });
  });

  describe('Data Structure Validation', () => {
    test('should return properly structured response', async () => {
      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        brandDetectionResults: mockBrandDetectionResults,
        taskId: testTaskId,
      });

      // Validate required fields
      expect(result.brandName).toBe('Tesla');
      expect(result.competitors).toEqual(['Ford', 'GM', 'Volkswagen']);
      expect(result.brandScores).toBeInstanceOf(Array);
      expect(result.competitivePositioning).toBeDefined();
      expect(result.shareOfVoice).toBeDefined();
      expect(result.competitiveRankings).toBeInstanceOf(Array);
      expect(result.insights).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.metadata.category).toBe('visibility-scoring');
      expect(result.metadata.totalBrands).toBe(4);
      expect(result.metadata.analysisTime).toBeGreaterThan(0);
    });

    test('should validate brand score structure', async () => {
      const result = await visibilityScoringTool.handler({} as any, {
        brandName: 'Tesla',
        competitors: ['Ford', 'GM', 'Volkswagen'],
        analysisResults: mockAnalysisResults,
        brandDetectionResults: mockBrandDetectionResults,
        taskId: testTaskId,
      });

      const teslaScore = result.brandScores.find(
        (score) => score.brandName === 'Tesla',
      );
      expect(teslaScore).toBeDefined();
      expect(teslaScore?.visibilityScore).toBeGreaterThan(0);
      expect(teslaScore?.mentionCount).toBeGreaterThanOrEqual(0);
      expect(teslaScore?.sentimentScore).toBeGreaterThanOrEqual(0);
      expect(teslaScore?.contextRelevance).toBeGreaterThanOrEqual(0);
      expect(teslaScore?.reachScore).toBeGreaterThanOrEqual(0);
      expect(teslaScore?.confidence).toBeGreaterThan(0);
      expect(teslaScore?.confidence).toBeLessThanOrEqual(1);
      expect(teslaScore?.breakdown).toBeDefined();
      expect(teslaScore?.breakdown.mentions).toBeDefined();
      expect(teslaScore?.breakdown.sentiment).toBeDefined();
      expect(teslaScore?.breakdown.context).toBeDefined();
      expect(teslaScore?.breakdown.reach).toBeDefined();
    });
  });
});

