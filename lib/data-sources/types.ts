export interface ModelResult {
  model: string;
  response: string;
  mentions: number;
  context: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  visibility_score: number;
  execution_time: number;
  success: boolean;
}

export interface BrandAnalysisRequest {
  brandName: string;
  queries: string[];
}

export interface BrandAnalysisResponse {
  results: ModelResult[];
  total_mentions: number;
  average_sentiment: 'positive' | 'neutral' | 'negative';
  average_visibility_score: number;
  total_execution_time: number;
  success_rate: number;
}

export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface ModelConfig {
  name: string;
  provider: string;
  modelId: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AnalysisContext {
  brandName: string;
  query: string;
  timestamp: Date;
}
