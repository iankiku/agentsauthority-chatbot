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

export type WebSource = 'reddit' | 'hackernews' | 'twitter' | 'news' | 'blogs';

export interface CrawlOptions {
  timeframe?: 'day' | 'week' | 'month';
  limit?: number;
  maxResults?: number;
  includeComments?: boolean;
  minEngagement?: number;
  includeEngagement?: boolean;
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
  brandName: string;
  timeframe: 'day' | 'week' | 'month';
  maxResults: number;
  includeEngagement: boolean;
  subreddits?: string[];
  sortBy?: string;
  timeRange?: string;
  includeRetweets?: boolean;
  language?: string;
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
    topSources: string[];
    trendingTopics: string[];
    executionTime: number;
  };
  metadata: {
    sourcesQueried: WebSource[];
    timeframe: string;
    timestamp: string;
  };
}
