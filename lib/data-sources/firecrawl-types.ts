export interface BrandMentionResult {
  source: WebSource;
  url: string;
  title: string;
  content: string;
  mentions: BrandMention[];
  sentiment: SentimentResult;
  publishedAt: string;
  author?: string;
  engagement?: {
    upvotes?: number;
    comments?: number;
    shares?: number;
  };
  credibilityScore: number;
}

export interface BrandMention {
  text: string;
  position: number;
  type: 'exact' | 'fuzzy';
  confidence: number;
  context?: string;
}

export interface SentimentResult {
  overall: 'positive' | 'neutral' | 'negative';
  confidence: number;
  positiveKeywords: string[];
  negativeKeywords: string[];
  neutralContext: string[];
}

export type WebSource = 'reddit' | 'hackernews' | 'twitter' | 'news';

export interface CrawlOptions {
  timeframe?: 'day' | 'week' | 'month';
  limit?: number;
  includeComments?: boolean;
  minEngagement?: number;
}

export interface RawCrawlResult {
  url: string;
  title: string;
  content: string;
  publishedAt?: string;
  author?: string;
  engagement?: {
    upvotes?: number;
    comments?: number;
    shares?: number;
  };
}

export interface SourceConfig {
  url: string;
  limit: number;
  searchParams: Record<string, string>;
  selectors?: {
    title?: string;
    content?: string;
    author?: string;
    publishedAt?: string;
  };
}

export interface CrawlResponse {
  success: boolean;
  data?: RawCrawlResult[];
  error?: string;
  metadata?: {
    totalResults: number;
    executionTime: number;
    rateLimitRemaining?: number;
  };
}

export interface BrandMonitoringRequest {
  brandName: string;
  sources: WebSource[];
  options: CrawlOptions;
}

export interface BrandMonitoringResponse {
  brandName: string;
  results: BrandMentionResult[];
  summary: {
    totalMentions: number;
    averageSentiment: 'positive' | 'neutral' | 'negative';
    topSources: WebSource[];
    trendingTopics: string[];
    executionTime: number;
  };
  metadata: {
    sourcesQueried: WebSource[];
    timeframe: string;
    timestamp: string;
  };
}
