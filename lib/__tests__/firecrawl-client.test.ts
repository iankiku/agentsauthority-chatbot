import { FirecrawlClient } from '../data-sources/firecrawl-client';
import { MentionDetector } from '../data-sources/mention-detector';
import { SentimentAnalyzer } from '../data-sources/sentiment-analyzer';

describe('FirecrawlClient', () => {
  let client: FirecrawlClient;

  beforeEach(() => {
    client = new FirecrawlClient();
  });

  describe('crawlBrandMentions', () => {
    test('should crawl multiple sources successfully', async () => {
      const results = await client.crawlBrandMentions('Tesla', ['reddit', 'hackernews']);

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBeGreaterThan(0);
      
      results.forEach((result) => {
        expect(result.source).toMatch(/reddit|hackernews/);
        expect(result.mentions.length).toBeGreaterThan(0);
        expect(result.sentiment.overall).toMatch(/positive|neutral|negative/);
        expect(result.credibilityScore).toBeGreaterThan(0);
        expect(result.credibilityScore).toBeLessThanOrEqual(1);
      });
    });

    test('should handle single source crawling', async () => {
      const results = await client.crawlBrandMentions('Apple', ['reddit']);

      expect(results).toBeInstanceOf(Array);
      expect(results.every((r) => r.source === 'reddit')).toBe(true);
    });

    test('should respect crawl options', async () => {
      const options = { limit: 5, timeframe: 'day' as const };
      const results = await client.crawlBrandMentions('Microsoft', ['news'], options);

      expect(results).toBeInstanceOf(Array);
      // Mock data should respect the limit
      expect(results.length).toBeLessThanOrEqual(5);
    });

    test('should handle unknown brands gracefully', async () => {
      const results = await client.crawlBrandMentions('UnknownBrandXYZ', ['reddit']);

      expect(results).toBeInstanceOf(Array);
      // Should still return some results (even if empty)
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('monitorBrand', () => {
    test('should provide comprehensive brand monitoring', async () => {
      const request = {
        brandName: 'Tesla',
        sources: ['reddit', 'hackernews', 'twitter'] as const,
        options: { timeframe: 'week' as const, limit: 10 },
      };

      const response = await client.monitorBrand(request);

      expect(response.brandName).toBe('Tesla');
      expect(response.results).toBeInstanceOf(Array);
      expect(response.summary.totalMentions).toBeGreaterThan(0);
      expect(response.summary.averageSentiment).toMatch(/positive|neutral|negative/);
      expect(response.summary.topSources).toBeInstanceOf(Array);
      expect(response.summary.trendingTopics).toBeInstanceOf(Array);
      expect(response.summary.executionTime).toBeGreaterThan(0);
      expect(response.metadata.sourcesQueried).toEqual(['reddit', 'hackernews', 'twitter']);
      expect(response.metadata.timeframe).toBe('week');
      expect(response.metadata.timestamp).toBeDefined();
    });

    test('should handle empty results gracefully', async () => {
      const request = {
        brandName: 'VeryObscureBrand123',
        sources: ['reddit'] as const,
        options: { timeframe: 'day' as const },
      };

      const response = await client.monitorBrand(request);

      expect(response.brandName).toBe('VeryObscureBrand123');
      expect(response.results).toBeInstanceOf(Array);
      expect(response.summary.totalMentions).toBeGreaterThanOrEqual(0);
      expect(response.summary.averageSentiment).toBe('neutral');
    });
  });

  describe('source configuration', () => {
    test('should generate correct Reddit configuration', async () => {
      const results = await client.crawlBrandMentions('Tesla', ['reddit']);
      
      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(result.source).toBe('reddit');
        expect(result.url).toContain('reddit.com');
      });
    });

    test('should generate correct HackerNews configuration', async () => {
      const results = await client.crawlBrandMentions('Apple', ['hackernews']);
      
      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(result.source).toBe('hackernews');
        expect(result.url).toContain('ycombinator.com');
      });
    });

    test('should generate correct Twitter configuration', async () => {
      const results = await client.crawlBrandMentions('Microsoft', ['twitter']);
      
      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(result.source).toBe('twitter');
        expect(result.url).toContain('twitter.com');
      });
    });
  });
});

describe('MentionDetector', () => {
  let detector: MentionDetector;

  beforeEach(() => {
    detector = new MentionDetector();
  });

  describe('detectMentions', () => {
    test('should find exact brand name matches', () => {
      const content = 'Tesla is an amazing company. I love Tesla cars.';
      const mentions = detector.detectMentions(content, 'Tesla');

      expect(mentions.length).toBe(2);
      mentions.forEach((mention) => {
        expect(mention.text).toBe('Tesla');
        expect(mention.type).toBe('exact');
        expect(mention.confidence).toBe(1.0);
        expect(mention.context).toBeDefined();
      });
    });

    test('should find fuzzy brand variations', () => {
      const content = 'TESLA is great, tesla cars are amazing, and Tesla Motors is innovative.';
      const mentions = detector.detectMentions(content, 'Tesla');

      expect(mentions.length).toBeGreaterThan(0);
      mentions.forEach((mention) => {
        expect(mention.text.toLowerCase()).toContain('tesla');
        expect(mention.confidence).toBeGreaterThan(0.5);
      });
    });

    test('should handle multi-word brand names', () => {
      const content = 'Apple Inc is doing well. Apple products are great.';
      const mentions = detector.detectMentions(content, 'Apple Inc');

      expect(mentions.length).toBeGreaterThan(0);
    });

    test('should extract context around mentions', () => {
      const content = 'This is a long sentence about Tesla being an innovative company that is changing the world.';
      const mentions = detector.detectMentions(content, 'Tesla');

      expect(mentions.length).toBe(1);
      expect(mentions[0].context).toBeDefined();
      expect(mentions[0].context?.length).toBeGreaterThan(0);
      expect(mentions[0].context).toContain('Tesla');
    });

    test('should deduplicate similar mentions', () => {
      const content = 'Tesla Tesla Tesla Tesla Tesla';
      const mentions = detector.detectMentions(content, 'Tesla');

      expect(mentions.length).toBe(1);
      expect(mentions[0].text).toBe('Tesla');
    });

    test('should handle case insensitive matching', () => {
      const content = 'TESLA, tesla, Tesla, tEsLa';
      const mentions = detector.detectMentions(content, 'Tesla');

      expect(mentions.length).toBeGreaterThan(0);
      mentions.forEach((mention) => {
        expect(mention.text.toLowerCase()).toBe('tesla');
      });
    });
  });
});

describe('SentimentAnalyzer', () => {
  let analyzer: SentimentAnalyzer;

  beforeEach(() => {
    analyzer = new SentimentAnalyzer();
  });

  describe('analyzeSentiment', () => {
    test('should identify positive sentiment', () => {
      const content = 'Tesla is excellent and innovative. Their cars are amazing and the best in the market.';
      const sentiment = analyzer.analyzeSentiment(content, 'Tesla');

      expect(sentiment.overall).toBe('positive');
      expect(sentiment.confidence).toBeGreaterThan(0.5);
      expect(sentiment.positiveKeywords.length).toBeGreaterThan(0);
      expect(sentiment.negativeKeywords.length).toBe(0);
    });

    test('should identify negative sentiment', () => {
      const content = 'Tesla is terrible and failing. Their products are awful and broken.';
      const sentiment = analyzer.analyzeSentiment(content, 'Tesla');

      expect(sentiment.overall).toBe('negative');
      expect(sentiment.confidence).toBeGreaterThan(0.5);
      expect(sentiment.negativeKeywords.length).toBeGreaterThan(0);
      expect(sentiment.positiveKeywords.length).toBe(0);
    });

    test('should identify neutral sentiment', () => {
      const content = 'Tesla is a company. They make cars.';
      const sentiment = analyzer.analyzeSentiment(content, 'Tesla');

      expect(sentiment.overall).toBe('neutral');
      expect(sentiment.confidence).toBe(0.5);
      expect(sentiment.positiveKeywords.length).toBe(0);
      expect(sentiment.negativeKeywords.length).toBe(0);
    });

    test('should extract brand-specific sentences', () => {
      const content = 'This is about Tesla. Tesla is great. This is not about Tesla. Tesla is amazing.';
      const sentiment = analyzer.analyzeSentiment(content, 'Tesla');

      expect(sentiment.neutralContext.length).toBeGreaterThan(0);
      sentiment.neutralContext.forEach((sentence) => {
        expect(sentence.toLowerCase()).toContain('tesla');
      });
    });

    test('should handle mixed sentiment', () => {
      const content = 'Tesla is excellent but also expensive. Their quality is great but the price is terrible.';
      const sentiment = analyzer.analyzeSentiment(content, 'Tesla');

      expect(sentiment.overall).toMatch(/positive|negative|neutral/);
      expect(sentiment.positiveKeywords.length).toBeGreaterThan(0);
      expect(sentiment.negativeKeywords.length).toBeGreaterThan(0);
    });

    test('should provide confidence scores', () => {
      const content = 'Tesla is absolutely excellent and fantastic and amazing and incredible and wonderful.';
      const sentiment = analyzer.analyzeSentiment(content, 'Tesla');

      expect(sentiment.overall).toBe('positive');
      expect(sentiment.confidence).toBeGreaterThan(0.5);
      expect(sentiment.confidence).toBeLessThanOrEqual(0.9);
    });
  });
});

describe('Integration Tests', () => {
  let client: FirecrawlClient;

  beforeEach(() => {
    client = new FirecrawlClient();
  });

  test('should process real-world brand monitoring scenario', async () => {
    const request = {
      brandName: 'Tesla',
      sources: ['reddit', 'hackernews'] as const,
      options: { timeframe: 'week' as const, limit: 5 },
    };

    const response = await client.monitorBrand(request);

    // Verify response structure
    expect(response.brandName).toBe('Tesla');
    expect(response.results).toBeInstanceOf(Array);
    expect(response.summary).toBeDefined();
    expect(response.metadata).toBeDefined();

    // Verify results contain expected data
    response.results.forEach((result) => {
      expect(result.source).toMatch(/reddit|hackernews/);
      expect(result.mentions.length).toBeGreaterThan(0);
      expect(result.sentiment.overall).toMatch(/positive|neutral|negative/);
      expect(result.credibilityScore).toBeGreaterThan(0);
      expect(result.credibilityScore).toBeLessThanOrEqual(1);
      expect(result.url).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.content).toBeDefined();
    });

    // Verify summary statistics
    expect(response.summary.totalMentions).toBeGreaterThan(0);
    expect(response.summary.averageSentiment).toMatch(/positive|neutral|negative/);
    expect(response.summary.topSources).toBeInstanceOf(Array);
    expect(response.summary.trendingTopics).toBeInstanceOf(Array);
    expect(response.summary.executionTime).toBeGreaterThan(0);

    // Verify metadata
    expect(response.metadata.sourcesQueried).toEqual(['reddit', 'hackernews']);
    expect(response.metadata.timeframe).toBe('week');
    expect(response.metadata.timestamp).toBeDefined();
  });

  test('should handle concurrent brand monitoring', async () => {
    const brands = ['Tesla', 'Apple', 'Microsoft'];
    const promises = brands.map((brand) =>
      client.monitorBrand({
        brandName: brand,
        sources: ['reddit'] as const,
        options: { timeframe: 'day' as const },
      }),
    );

    const results = await Promise.all(promises);

    expect(results.length).toBe(3);
    results.forEach((result, index) => {
      expect(result.brandName).toBe(brands[index]);
      expect(result.results).toBeInstanceOf(Array);
      expect(result.summary).toBeDefined();
    });
  });
});
