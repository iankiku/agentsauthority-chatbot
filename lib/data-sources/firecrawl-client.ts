import type {
  BrandMentionResult,
  BrandMonitoringRequest,
  BrandMonitoringResponse,
  CrawlOptions,
  RawCrawlResult,
  SourceConfig,
  WebSource,
} from './firecrawl-types';
import { MentionDetector } from './mention-detector';
import { SentimentAnalyzer } from './sentiment-analyzer';

export class FirecrawlClient {
  private mentionDetector: MentionDetector;
  private sentimentAnalyzer: SentimentAnalyzer;
  private rateLimitDelay: number = 1000; // 1 second between requests

  constructor() {
    this.mentionDetector = new MentionDetector();
    this.sentimentAnalyzer = new SentimentAnalyzer();
  }

  async crawlBrandMentions(
    brandName: string,
    sources: WebSource[] = ['reddit', 'hackernews', 'twitter'],
    options: CrawlOptions = {},
  ): Promise<BrandMentionResult[]> {
    console.log(`Starting brand mention crawl for: ${brandName}`);
    console.log(`Sources: ${sources.join(', ')}`);

    const crawlPromises = sources.map((source) =>
      this.crawlSource(source, brandName, options),
    );

    const results = await Promise.allSettled(crawlPromises);
    return this.processCrawlResults(results, brandName);
  }

  async monitorBrand(
    request: BrandMonitoringRequest,
  ): Promise<BrandMonitoringResponse> {
    const startTime = Date.now();

    const results = await this.crawlBrandMentions(
      request.brandName,
      request.sources,
      request.options,
    );

    const executionTime = Date.now() - startTime;

    // Calculate summary statistics
    const totalMentions = results.reduce(
      (sum, result) => sum + result.mentions.length,
      0,
    );
    const sentiments = results.map((r) => r.sentiment.overall);
    const averageSentiment = this.calculateAverageSentiment(sentiments);
    const topSources = this.getTopSources(results);
    const trendingTopics = this.extractTrendingTopics(results);

    return {
      brandName: request.brandName,
      results,
      summary: {
        totalMentions,
        averageSentiment,
        topSources,
        trendingTopics,
        executionTime,
      },
      metadata: {
        sourcesQueried: request.sources,
        timeframe: request.options.timeframe || 'week',
        timestamp: new Date().toISOString(),
      },
    };
  }

  private async crawlSource(
    source: WebSource,
    brandName: string,
    options: CrawlOptions,
  ): Promise<RawCrawlResult[]> {
    try {
      const sourceConfig = this.getSourceConfig(source, brandName, options);
      console.log(`Crawling ${source} with config:`, sourceConfig);

      // Simulate API call with delay for rate limiting
      await this.delay(this.rateLimitDelay);

      // For now, return mock data since we don't have actual Firecrawl API
      const mockResults = this.generateMockResults(source, brandName, options);

      return mockResults;
    } catch (error) {
      console.error(`Error crawling ${source}:`, error);
      return [];
    }
  }

  private getSourceConfig(
    source: WebSource,
    brandName: string,
    options: CrawlOptions,
  ): SourceConfig {
    const baseConfigs = {
      reddit: {
        baseUrl: 'https://www.reddit.com/search',
        searchParam: 'q',
        timeParam: 't',
        limitParam: 'limit',
      },
      hackernews: {
        baseUrl: 'https://hn.algolia.com/api/v1/search',
        searchParam: 'query',
        timeParam: 'numericFilters',
        limitParam: 'hitsPerPage',
      },
      twitter: {
        baseUrl: 'https://twitter.com/search',
        searchParam: 'q',
        timeParam: 'since',
        limitParam: 'count',
      },
      news: {
        baseUrl: 'https://news.google.com/search',
        searchParam: 'q',
        timeParam: 'hl',
        limitParam: 'num',
      },
    };

    const config = baseConfigs[source];
    const limit = options.limit || 20;
    const timeframe = options.timeframe || 'week';

    return {
      url: config.baseUrl,
      limit,
      searchParams: {
        [config.searchParam]: brandName,
        [config.timeParam]: timeframe,
        [config.limitParam]: limit.toString(),
      },
    };
  }

  private generateMockResults(
    source: WebSource,
    brandName: string,
    options: CrawlOptions,
  ): RawCrawlResult[] {
    const mockData = {
      reddit: [
        {
          url: `https://reddit.com/r/technology/comments/123/${brandName.toLowerCase()}-discussion`,
          title: `${brandName} is revolutionizing the industry`,
          content: `I think ${brandName} is doing amazing things. Their latest product is incredible.`,
          publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          author: 'tech_enthusiast',
          engagement: { upvotes: 150, comments: 23, shares: 5 },
        },
        {
          url: `https://reddit.com/r/business/comments/456/${brandName.toLowerCase()}-analysis`,
          title: `${brandName} quarterly results discussion`,
          content: `${brandName} reported strong earnings this quarter. The market seems positive.`,
          publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          author: 'business_analyst',
          engagement: { upvotes: 89, comments: 15, shares: 2 },
        },
      ],
      hackernews: [
        {
          url: `https://news.ycombinator.com/item?id=123456`,
          title: `${brandName} launches new AI feature`,
          content: `${brandName} just announced their latest AI integration. This could be a game-changer.`,
          publishedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          author: 'hn_user',
          engagement: { upvotes: 234, comments: 45, shares: 12 },
        },
      ],
      twitter: [
        {
          url: `https://twitter.com/user/status/123456789`,
          title: `${brandName} customer experience`,
          content: `Just tried ${brandName}'s new service. Absolutely love it! #${brandName.toLowerCase()}`,
          publishedAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
          author: 'happy_customer',
          engagement: { upvotes: 67, comments: 8, shares: 15 },
        },
      ],
      news: [
        {
          url: `https://techcrunch.com/2024/01/15/${brandName.toLowerCase()}-announcement`,
          title: `${brandName} announces major partnership`,
          content: `${brandName} has partnered with a leading tech company to expand their market presence.`,
          publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          author: 'tech_reporter',
          engagement: { upvotes: 0, comments: 0, shares: 0 },
        },
      ],
    };

    return mockData[source] || [];
  }

  private async processCrawlResults(
    results: PromiseSettledResult<RawCrawlResult[]>[],
    brandName: string,
  ): Promise<BrandMentionResult[]> {
    const processedResults: BrandMentionResult[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const source = ['reddit', 'hackernews', 'twitter', 'news'][
          index
        ] as WebSource;

        result.value.forEach((rawResult) => {
          const mentions = this.mentionDetector.detectMentions(
            rawResult.content,
            brandName,
          );

          if (mentions.length > 0) {
            const sentiment = this.sentimentAnalyzer.analyzeSentiment(
              rawResult.content,
              brandName,
            );

            const processedResult: BrandMentionResult = {
              source,
              url: rawResult.url,
              title: rawResult.title,
              content: rawResult.content,
              mentions,
              sentiment,
              publishedAt: rawResult.publishedAt || new Date().toISOString(),
              author: rawResult.author,
              engagement: rawResult.engagement,
              credibilityScore: this.calculateCredibilityScore(
                rawResult,
                source,
              ),
            };

            processedResults.push(processedResult);
          }
        });
      } else {
        console.error(`Crawl result failed:`, result.reason);
      }
    });

    return processedResults;
  }

  private calculateCredibilityScore(
    rawResult: RawCrawlResult,
    source: WebSource,
  ): number {
    let score = 0.5; // Base score

    // Source credibility
    const sourceScores = {
      reddit: 0.7,
      hackernews: 0.8,
      twitter: 0.6,
      news: 0.9,
    };
    score += sourceScores[source] * 0.3;

    // Engagement credibility
    if (rawResult.engagement) {
      const totalEngagement =
        (rawResult.engagement.upvotes || 0) +
        (rawResult.engagement.comments || 0) +
        (rawResult.engagement.shares || 0);

      if (totalEngagement > 100) score += 0.2;
      else if (totalEngagement > 50) score += 0.1;
      else if (totalEngagement > 10) score += 0.05;
    }

    // Content length credibility
    if (rawResult.content.length > 200) score += 0.1;
    else if (rawResult.content.length > 100) score += 0.05;

    return Math.min(score, 1.0);
  }

  private calculateAverageSentiment(
    sentiments: ('positive' | 'neutral' | 'negative')[],
  ): 'positive' | 'neutral' | 'negative' {
    if (sentiments.length === 0) return 'neutral';

    const counts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    sentiments.forEach((sentiment) => {
      counts[sentiment]++;
    });

    if (counts.positive > counts.negative && counts.positive > counts.neutral) {
      return 'positive';
    } else if (
      counts.negative > counts.positive &&
      counts.negative > counts.neutral
    ) {
      return 'negative';
    }

    return 'neutral';
  }

  private getTopSources(results: BrandMentionResult[]): WebSource[] {
    const sourceCounts = new Map<WebSource, number>();

    results.forEach((result) => {
      const count = sourceCounts.get(result.source) || 0;
      sourceCounts.set(result.source, count + result.mentions.length);
    });

    return Array.from(sourceCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([source]) => source);
  }

  private extractTrendingTopics(results: BrandMentionResult[]): string[] {
    const topics = new Set<string>();

    // Simple topic extraction based on common words
    const commonTopics = [
      'AI',
      'technology',
      'innovation',
      'product',
      'service',
      'launch',
      'announcement',
      'partnership',
      'earnings',
      'growth',
    ];

    results.forEach((result) => {
      const content = result.content.toLowerCase();
      commonTopics.forEach((topic) => {
        if (content.includes(topic.toLowerCase())) {
          topics.add(topic);
        }
      });
    });

    return Array.from(topics).slice(0, 5);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
