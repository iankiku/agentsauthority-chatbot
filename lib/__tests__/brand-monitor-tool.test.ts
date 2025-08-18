import { brandMonitorTool } from '../ai/tools/brand-monitor-tool';

// Mock the FirecrawlClient
jest.mock('../data-sources/firecrawl-client', () => ({
  FirecrawlClient: jest.fn().mockImplementation(() => ({
    monitorBrand: jest.fn().mockResolvedValue({
      brandName: 'Tesla',
      results: [
        {
          source: 'reddit',
          url: 'https://reddit.com/r/technology/comments/123/tesla-discussion',
          title: 'Tesla is revolutionizing the industry',
          content: 'Tesla is doing amazing things. Their latest product is incredible.',
          mentions: [
            { text: 'Tesla', position: 0, type: 'exact', confidence: 1.0 },
          ],
          sentiment: { overall: 'positive', confidence: 0.8, positiveKeywords: ['amazing'], negativeKeywords: [], neutralContext: [] },
          publishedAt: '2024-01-15T10:30:00Z',
          author: 'tech_enthusiast',
          engagement: { upvotes: 150, comments: 23, shares: 5 },
          credibilityScore: 0.8,
        },
        {
          source: 'hackernews',
          url: 'https://news.ycombinator.com/item?id=123456',
          title: 'Tesla launches new AI feature',
          content: 'Tesla just announced their latest AI integration. This could be a game-changer.',
          mentions: [
            { text: 'Tesla', position: 0, type: 'exact', confidence: 1.0 },
          ],
          sentiment: { overall: 'positive', confidence: 0.7, positiveKeywords: ['game-changer'], negativeKeywords: [], neutralContext: [] },
          publishedAt: '2024-01-15T08:00:00Z',
          author: 'hn_user',
          engagement: { upvotes: 234, comments: 45, shares: 12 },
          credibilityScore: 0.9,
        },
      ],
      summary: {
        totalMentions: 2,
        averageSentiment: 'positive',
        topSources: ['reddit', 'hackernews'],
        trendingTopics: ['AI', 'technology'],
        executionTime: 2500,
      },
      metadata: {
        sourcesQueried: ['reddit', 'hackernews'],
        timeframe: 'week',
        timestamp: '2024-01-15T10:30:00Z',
      },
    }),
  })),
}));

describe('brandMonitorTool', () => {
  test('should monitor brand across multiple sources', async () => {
    const result = await brandMonitorTool.execute({
      brandName: 'Tesla',
      sources: ['reddit', 'hackernews'],
      timeframe: 'week',
      includeInsights: true,
      includeRecommendations: true,
    });

    expect(result.brandName).toBe('Tesla');
    expect(result.monitoringPeriod).toBe('week');
    expect(result.summary.totalMentions).toBe(2);
    expect(result.summary.averageSentiment).toBe('positive');
    expect(result.summary.topSources).toEqual(['reddit', 'hackernews']);
    expect(result.summary.trendingTopics).toEqual(['AI', 'technology']);
    expect(result.summary.credibilityScore).toBeGreaterThan(0);
    expect(result.detailedResults).toHaveLength(2);
    expect(result.insights).toHaveLength(5); // 5 insights generated
    expect(result.recommendations).toHaveLength(3); // 3 recommendations
    expect(result.metadata.sourcesQueried).toEqual(['reddit', 'hackernews']);
    expect(result.metadata.timeframe).toBe('week');
    expect(result.metadata.category).toBe('brand-monitoring');
  });

  test('should handle single source monitoring', async () => {
    const result = await brandMonitorTool.execute({
      brandName: 'Apple',
      sources: ['reddit'],
      timeframe: 'day',
    });

    expect(result.brandName).toBe('Apple');
    expect(result.monitoringPeriod).toBe('day');
    expect(result.detailedResults).toHaveLength(2); // Mock data returns 2 results
    expect(result.metadata.sourcesQueried).toEqual(['reddit']);
  });

  test('should generate insights for high visibility brands', async () => {
    // Mock high visibility scenario
    const { FirecrawlClient } = require('../data-sources/firecrawl-client');
    FirecrawlClient.mockImplementationOnce(() => ({
      monitorBrand: jest.fn().mockResolvedValue({
        brandName: 'Tesla',
        results: Array(60).fill(null).map(() => ({
          source: 'reddit',
          url: 'https://reddit.com/test',
          title: 'Test post',
          content: 'Tesla is great',
          mentions: [{ text: 'Tesla', position: 0, type: 'exact', confidence: 1.0 }],
          sentiment: { overall: 'positive', confidence: 0.8, positiveKeywords: ['great'], negativeKeywords: [], neutralContext: [] },
          publishedAt: '2024-01-15T10:30:00Z',
          credibilityScore: 0.8,
        })),
        summary: {
          totalMentions: 60,
          averageSentiment: 'positive',
          topSources: ['reddit'],
          trendingTopics: ['technology'],
          executionTime: 3000,
        },
        metadata: {
          sourcesQueried: ['reddit'],
          timeframe: 'week',
          timestamp: '2024-01-15T10:30:00Z',
        },
      }),
    }));

    const result = await brandMonitorTool.execute({
      brandName: 'Tesla',
      sources: ['reddit'],
      timeframe: 'week',
      includeInsights: true,
    });

    expect(result.insights).toContain('High brand visibility with 60 mentions');
    expect(result.insights).toContain('Positive sentiment dominant');
  });

  test('should generate recommendations for negative sentiment', async () => {
    // Mock negative sentiment scenario
    const { FirecrawlClient } = require('../data-sources/firecrawl-client');
    FirecrawlClient.mockImplementationOnce(() => ({
      monitorBrand: jest.fn().mockResolvedValue({
        brandName: 'Tesla',
        results: [
          {
            source: 'reddit',
            url: 'https://reddit.com/test',
            title: 'Test post',
            content: 'Tesla is terrible and failing',
            mentions: [{ text: 'Tesla', position: 0, type: 'exact', confidence: 1.0 }],
            sentiment: { overall: 'negative', confidence: 0.8, positiveKeywords: [], negativeKeywords: ['terrible', 'failing'], neutralContext: [] },
            publishedAt: '2024-01-15T10:30:00Z',
            credibilityScore: 0.6,
          },
        ],
        summary: {
          totalMentions: 1,
          averageSentiment: 'negative',
          topSources: ['reddit'],
          trendingTopics: [],
          executionTime: 1000,
        },
        metadata: {
          sourcesQueried: ['reddit'],
          timeframe: 'week',
          timestamp: '2024-01-15T10:30:00Z',
        },
      }),
    }));

    const result = await brandMonitorTool.execute({
      brandName: 'Tesla',
      sources: ['reddit'],
      timeframe: 'week',
      includeRecommendations: true,
    });

    expect(result.recommendations).toContain('Address negative sentiment through customer service improvements');
    expect(result.recommendations).toContain('Develop a crisis communication strategy');
  });

  test('should handle low visibility brands', async () => {
    // Mock low visibility scenario
    const { FirecrawlClient } = require('../data-sources/firecrawl-client');
    FirecrawlClient.mockImplementationOnce(() => ({
      monitorBrand: jest.fn().mockResolvedValue({
        brandName: 'ObscureBrand',
        results: [],
        summary: {
          totalMentions: 0,
          averageSentiment: 'neutral',
          topSources: [],
          trendingTopics: [],
          executionTime: 500,
        },
        metadata: {
          sourcesQueried: ['reddit'],
          timeframe: 'week',
          timestamp: '2024-01-15T10:30:00Z',
        },
      }),
    }));

    const result = await brandMonitorTool.execute({
      brandName: 'ObscureBrand',
      sources: ['reddit'],
      timeframe: 'week',
      includeInsights: true,
      includeRecommendations: true,
    });

    expect(result.insights).toContain('No brand mentions detected');
    expect(result.recommendations).toContain('Increase brand visibility through content marketing');
  });

  test('should handle API errors gracefully', async () => {
    // Mock API error scenario
    const { FirecrawlClient } = require('../data-sources/firecrawl-client');
    FirecrawlClient.mockImplementationOnce(() => ({
      monitorBrand: jest.fn().mockRejectedValue(new Error('API Error')),
    }));

    const result = await brandMonitorTool.execute({
      brandName: 'Tesla',
      sources: ['reddit'],
      timeframe: 'week',
    });

    expect(result.brandName).toBe('Tesla');
    expect(result.summary.totalMentions).toBe(0);
    expect(result.summary.averageSentiment).toBe('neutral');
    expect(result.insights[0]).toContain('Brand monitoring failed: API Error');
    expect(result.recommendations).toContain('Please check your brand name and try again');
  });

  test('should respect includeInsights and includeRecommendations flags', async () => {
    const result = await brandMonitorTool.execute({
      brandName: 'Tesla',
      sources: ['reddit'],
      timeframe: 'week',
      includeInsights: false,
      includeRecommendations: false,
    });

    expect(result.insights).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });

  test('should calculate credibility scores correctly', async () => {
    const result = await brandMonitorTool.execute({
      brandName: 'Tesla',
      sources: ['reddit', 'hackernews'],
      timeframe: 'week',
    });

    expect(result.summary.credibilityScore).toBeGreaterThan(0);
    expect(result.summary.credibilityScore).toBeLessThanOrEqual(1);
    
    result.detailedResults.forEach((detail) => {
      expect(detail.credibilityScore).toBeGreaterThan(0);
      expect(detail.credibilityScore).toBeLessThanOrEqual(1);
    });
  });

  test('should provide detailed results with all required fields', async () => {
    const result = await brandMonitorTool.execute({
      brandName: 'Tesla',
      sources: ['reddit'],
      timeframe: 'week',
    });

    expect(result.detailedResults).toHaveLength(2);
    result.detailedResults.forEach((detail) => {
      expect(detail.source).toBeDefined();
      expect(detail.url).toBeDefined();
      expect(detail.title).toBeDefined();
      expect(detail.mentions).toBeGreaterThanOrEqual(0);
      expect(detail.sentiment).toMatch(/positive|neutral|negative/);
      expect(detail.credibilityScore).toBeGreaterThan(0);
      expect(detail.publishedAt).toBeDefined();
    });
  });

  test('should handle different timeframes correctly', async () => {
    const timeframes = ['day', 'week', 'month'] as const;
    
    for (const timeframe of timeframes) {
      const result = await brandMonitorTool.execute({
        brandName: 'Tesla',
        sources: ['reddit'],
        timeframe,
      });

      expect(result.monitoringPeriod).toBe(timeframe);
      expect(result.metadata.timeframe).toBe(timeframe);
    }
  });
});
