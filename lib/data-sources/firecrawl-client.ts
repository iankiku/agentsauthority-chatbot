import FirecrawlApp from '@mendable/firecrawl-js';
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
  private rateLimitDelay = 1000; // 1 second between requests
  private app: FirecrawlApp;

  constructor() {
    this.mentionDetector = new MentionDetector();
    this.sentimentAnalyzer = new SentimentAnalyzer();

    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      console.warn(
        'FirecrawlClient: No API key configured, will return empty results',
      );
    }

    this.app = new FirecrawlApp({ apiKey: apiKey || '' });
  }

  async crawlBrandMentions(
    brandName: string,
    sources: WebSource[] = ['reddit', 'hackernews', 'twitter'],
    options: CrawlOptions = {},
  ): Promise<BrandMentionResult[]> {
    console.log(
      `🔍 FirecrawlClient - Starting brand mention crawl for: ${brandName}`,
    );
    console.log(`📊 FirecrawlClient - Sources: ${sources.join(', ')}`);

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
    console.log(
      `🎯 FirecrawlClient - Starting brand monitoring for: ${request.brandName}`,
    );

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

    console.log(
      `✅ FirecrawlClient - Brand monitoring completed in ${executionTime}ms`,
    );

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
      console.log(
        `🌐 FirecrawlClient - Crawling ${source} with config:`,
        sourceConfig,
      );

      // Rate limiting
      await this.delay(this.rateLimitDelay);

      // Use Firecrawl SDK search endpoint
      return await this.searchWithFirecrawlSDK(source, brandName, options);
    } catch (error) {
      console.error(`❌ FirecrawlClient - Error crawling ${source}:`, error);
      return [];
    }
  }

  private async searchWithFirecrawlSDK(
    source: WebSource,
    brandName: string,
    options: CrawlOptions,
  ): Promise<RawCrawlResult[]> {
    try {
      // Build search query based on source
      const searchQuery = this.buildSearchQuery(source, brandName, options);
      console.log(`🔍 FirecrawlClient - Search query: ${searchQuery}`);

      // Use Firecrawl SDK search endpoint
      const searchResponse = await this.app.search(searchQuery, {
        limit: options.maxResults || 10,
        scrapeOptions: {
          formats: ['markdown', 'html'],
          onlyMainContent: true,
          timeout: 30000,
        },
        timeout: 60000,
      });

      if (!searchResponse.success) {
        console.error(
          '❌ FirecrawlClient - Search failed:',
          searchResponse.error,
        );
        return [];
      }

      console.log(
        `✅ FirecrawlClient - Search successful, found ${searchResponse.data.length} results`,
      );

      // Transform Firecrawl response to our format
      return this.transformFirecrawlResponse(
        searchResponse.data,
        source,
        brandName,
      );
    } catch (error) {
      console.error('❌ FirecrawlClient - Search with SDK failed:', error);
      return [];
    }
  }

  private buildSearchQuery(
    source: WebSource,
    brandName: string,
    options: CrawlOptions,
  ): string {
    const baseQuery = `"${brandName}"`;

    switch (source) {
      case 'reddit':
        return `${baseQuery} site:reddit.com`;
      case 'hackernews':
        return `${baseQuery} site:news.ycombinator.com`;
      case 'twitter':
        return `${baseQuery} site:twitter.com OR site:x.com`;
      case 'news':
        return `${baseQuery} news`;
      case 'blogs':
        return `${baseQuery} blog`;
      default:
        return baseQuery;
    }
  }

  private transformFirecrawlResponse(
    data: any[],
    source: WebSource,
    brandName: string,
  ): RawCrawlResult[] {
    if (!Array.isArray(data)) {
      console.warn('⚠️ FirecrawlClient - Invalid response data format');
      return [];
    }

    return data.map((result: any) => ({
      url: result.url || '',
      title: result.title || result.metadata?.title || '',
      content: result.markdown || result.html || result.description || '',
      publishedAt:
        this.extractPublishedDate(result) || new Date().toISOString(),
      author: this.extractAuthor(result, source) || 'unknown',
      engagement: this.extractEngagement(result, source),
    }));
  }

  private extractPublishedDate(result: any): string | null {
    // Try to extract date from various sources
    if (result.metadata?.publishedAt) return result.metadata.publishedAt;
    if (result.metadata?.date) return result.metadata.date;

    // For Reddit, try to extract from URL
    if (result.url?.includes('reddit.com')) {
      const match = result.url.match(/\/(\d{4})\/(\d{2})\/(\d{2})/);
      if (match) {
        return new Date(`${match[1]}-${match[2]}-${match[3]}`).toISOString();
      }
    }

    return null;
  }

  private extractAuthor(result: any, source: WebSource): string | null {
    if (result.metadata?.author) return result.metadata.author;

    // Extract from URL for Reddit
    if (source === 'reddit' && result.url) {
      const match = result.url.match(/\/u\/([^\/]+)/);
      if (match) return match[1];
    }

    return null;
  }

  private extractEngagement(
    result: any,
    source: WebSource,
  ): {
    upvotes: number;
    comments: number;
    shares: number;
  } {
    // Default engagement metrics
    const engagement = {
      upvotes: 0,
      comments: 0,
      shares: 0,
    };

    // Try to extract from metadata if available
    if (result.metadata?.engagement) {
      engagement.upvotes = result.metadata.engagement.upvotes || 0;
      engagement.comments = result.metadata.engagement.comments || 0;
      engagement.shares = result.metadata.engagement.shares || 0;
    }

    return engagement;
  }

  private getSourceConfig(
    source: WebSource,
    brandName: string,
    options: CrawlOptions,
  ): SourceConfig {
    const baseConfig = {
      brandName,
      timeframe: options.timeframe || 'week',
      maxResults: options.maxResults || 10,
      includeEngagement: options.includeEngagement !== false,
    };

    switch (source) {
      case 'reddit':
        return {
          ...baseConfig,
          subreddits: ['technology', 'business', 'investing'],
          sortBy: 'relevance',
        };
      case 'hackernews':
        return {
          ...baseConfig,
          sortBy: 'points',
          timeRange: 'week',
        };
      case 'twitter':
        return {
          ...baseConfig,
          includeRetweets: false,
          language: 'en',
        };
      default:
        return baseConfig;
    }
  }

  private processCrawlResults(
    results: PromiseSettledResult<RawCrawlResult[]>[],
    brandName: string,
  ): BrandMentionResult[] {
    return results
      .filter(
        (result): result is PromiseFulfilledResult<RawCrawlResult[]> =>
          result.status === 'fulfilled',
      )
      .map((result) => this.processSourceResults(result.value, brandName))
      .filter((result) => result.mentions.length > 0);
  }

  private processSourceResults(
    results: RawCrawlResult[],
    brandName: string,
  ): BrandMentionResult {
    // Combine all content for analysis
    const combinedContent = results
      .map((r) => `${r.title} ${r.content}`)
      .join(' ');

    const mentions = this.mentionDetector.detectMentions(
      combinedContent,
      brandName,
    );
    const sentiment = this.sentimentAnalyzer.analyzeSentiment(
      combinedContent,
      brandName,
    );

    return {
      source: 'reddit' as WebSource, // Default source, will be overridden by caller
      url: results[0]?.url || '',
      title: results[0]?.title || '',
      content: results[0]?.content || '',
      mentions,
      sentiment,
      publishedAt: results[0]?.publishedAt || new Date().toISOString(),
      author: results[0]?.author || 'unknown',
      engagement: results[0]?.engagement || {
        upvotes: 0,
        comments: 0,
        shares: 0,
      },
      credibilityScore: this.calculateCredibilityScore(results[0]),
    };
  }

  private calculateCredibilityScore(result: RawCrawlResult): number {
    // Simple credibility scoring based on engagement and source
    let score = 0.5; // Base score

    if (result.engagement) {
      score += Math.min((result.engagement.upvotes || 0) / 100, 0.3);
      score += Math.min((result.engagement.comments || 0) / 50, 0.2);
    }

    // Boost score for known sources
    if (result.url.includes('reddit.com/r/technology')) score += 0.1;
    if (result.url.includes('news.ycombinator.com')) score += 0.1;

    return Math.min(score, 1.0);
  }

  private calculateAverageSentiment(
    sentiments: ('positive' | 'neutral' | 'negative')[],
  ): 'positive' | 'neutral' | 'negative' {
    if (sentiments.length === 0) return 'neutral';

    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    sentiments.forEach((sentiment) => {
      sentimentCounts[sentiment]++;
    });

    // Return the most common sentiment
    if (
      sentimentCounts.positive > sentimentCounts.negative &&
      sentimentCounts.positive > sentimentCounts.neutral
    ) {
      return 'positive';
    } else if (
      sentimentCounts.negative > sentimentCounts.positive &&
      sentimentCounts.negative > sentimentCounts.neutral
    ) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  private getTopSources(results: BrandMentionResult[]): string[] {
    const sourceCounts = results.reduce(
      (acc, result) => {
        acc[result.source] = (acc[result.source] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(sourceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([source]) => source);
  }

  private extractTrendingTopics(results: BrandMentionResult[]): string[] {
    // Simple topic extraction from titles and content
    const allText = results
      .map((r) => `${r.title} ${r.content}`)
      .join(' ')
      .toLowerCase();

    const topics = [
      'ai',
      'technology',
      'innovation',
      'business',
      'product',
      'launch',
      'update',
      'feature',
    ];

    return topics.filter((topic) => allText.includes(topic)).slice(0, 5);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
