import type { ModelResult } from '../../data-sources/types';

export interface VisibilityAnalysisResult {
  brandName: string;
  timestamp: string;
  timeframe: string;
  modelResults: ModelResult[];
  overallVisibility: number;
  insights: string[];
  recommendations: string[];
  metadata: {
    executionTime: number;
    modelsQueried: string[];
    queriesUsed: string[];
    category: 'visibility-analysis';
  };
}

export interface VisibilityToolParameters {
  brandName: string;
  queries?: string[];
  timeframe?: 'day' | 'week' | 'month';
  includeRecommendations?: boolean;
}

export interface QueryGenerationResult {
  queries: string[];
  source: 'default' | 'custom';
}

export interface InsightGenerationResult {
  insights: string[];
  recommendations: string[];
}
