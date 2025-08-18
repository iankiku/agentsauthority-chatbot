import { FirecrawlClient } from '../data-sources/firecrawl-client';
import { MultiModelClient } from '../data-sources/multi-model-client';

describe('Real API Integration Tests', () => {
  let multiModelClient: MultiModelClient;
  let firecrawlClient: FirecrawlClient;

  beforeEach(() => {
    multiModelClient = new MultiModelClient();
    firecrawlClient = new FirecrawlClient();
  });

  describe('MultiModelClient', () => {
    test('should query OpenAI and Anthropic models successfully', async () => {
      const results = await multiModelClient.queryAllModels('Tesla', [
        'What do you think about Tesla as a company?',
      ]);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      // Check that we have at least one successful result
      const successfulResults = results.filter((r) => r.success);
      expect(successfulResults.length).toBeGreaterThan(0);

      // Verify result structure
      successfulResults.forEach((result) => {
        expect(result.model).toBeDefined();
        expect(result.response).toBeDefined();
        expect(result.mentions).toBeGreaterThanOrEqual(0);
        expect(result.sentiment).toMatch(/^(positive|neutral|negative)$/);
        expect(result.visibility_score).toBeGreaterThanOrEqual(0);
        expect(result.visibility_score).toBeLessThanOrEqual(100);
        expect(result.execution_time).toBeGreaterThan(0);
        expect(result.success).toBe(true);
      });

      console.log('MultiModelClient Results:', {
        total: results.length,
        successful: successfulResults.length,
        models: successfulResults.map((r) => r.model),
        averageScore:
          successfulResults.reduce((sum, r) => sum + r.visibility_score, 0) /
          successfulResults.length,
      });
    }, 30000); // 30 second timeout for API calls

    test('should handle brand analysis with multiple queries', async () => {
      const analysis = await multiModelClient.analyzeBrand({
        brandName: 'Apple',
        queries: [
          'What is Apple known for?',
          'How is Apple performing in the market?',
        ],
      });

      expect(analysis).toBeDefined();
      expect(analysis.results).toBeDefined();
      expect(analysis.total_mentions).toBeGreaterThanOrEqual(0);
      expect(analysis.average_visibility_score).toBeGreaterThanOrEqual(0);
      expect(analysis.average_visibility_score).toBeLessThanOrEqual(100);
      expect(analysis.success_rate).toBeGreaterThanOrEqual(0);
      expect(analysis.success_rate).toBeLessThanOrEqual(100);

      console.log('Brand Analysis Results:', {
        totalMentions: analysis.total_mentions,
        averageScore: analysis.average_visibility_score,
        successRate: analysis.success_rate,
        executionTime: analysis.total_execution_time,
      });
    }, 30000);
  });

  describe('FirecrawlClient', () => {
    test('should monitor brand mentions with real API', async () => {
      const results = await firecrawlClient.monitorBrand({
        brandName: 'Tesla',
        sources: ['reddit', 'hackernews'],
        options: { timeframe: 'week' },
      });

      expect(results).toBeDefined();
      expect(results.brandName).toBe('Tesla');
      expect(results.results).toBeDefined();
      expect(Array.isArray(results.results)).toBe(true);
      expect(results.summary).toBeDefined();
      expect(results.summary.totalMentions).toBeGreaterThanOrEqual(0);
      expect(results.summary.executionTime).toBeGreaterThan(0);

      console.log('FirecrawlClient Results:', {
        totalMentions: results.summary.totalMentions,
        averageSentiment: results.summary.averageSentiment,
        executionTime: results.summary.executionTime,
        sourcesQueried: results.metadata.sourcesQueried,
      });
    }, 30000);

    test('should crawl brand mentions from multiple sources', async () => {
      const results = await firecrawlClient.crawlBrandMentions(
        'Tesla',
        ['reddit', 'hackernews'],
        { timeframe: 'week' },
      );

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      // Each result should have proper structure
      results.forEach((result) => {
        expect(result.source).toBeDefined();
        expect(result.url).toBeDefined();
        expect(result.title).toBeDefined();
        expect(result.content).toBeDefined();
        expect(result.mentions).toBeDefined();
        expect(Array.isArray(result.mentions)).toBe(true);
        expect(result.sentiment).toBeDefined();
        expect(result.publishedAt).toBeDefined();
        expect(result.credibilityScore).toBeGreaterThanOrEqual(0);
        expect(result.credibilityScore).toBeLessThanOrEqual(1);
      });

      console.log('Crawl Results:', {
        totalResults: results.length,
        sources: results.map((r) => r.source),
        averageCredibility:
          results.reduce((sum, r) => sum + r.credibilityScore, 0) /
          results.length,
      });
    }, 30000);
  });
});
