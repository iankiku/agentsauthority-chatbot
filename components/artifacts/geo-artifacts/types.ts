import type { VisibilityAnalysisResult } from '../../../lib/ai/tools/types';

export interface VisibilityMatrixProps {
  data: VisibilityAnalysisResult;
  className?: string;
  showExportOptions?: boolean;
  onModelClick?: (model: string) => void;
}

export interface OverallScoreGaugeProps {
  score: number;
  maxScore?: number;
  className?: string;
}

export interface ModelScoreCardProps {
  model: string;
  score: number;
  mentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  executionTime: number;
  success: boolean;
  onClick?: () => void;
  className?: string;
}

export interface InsightsSectionProps {
  insights: string[];
  className?: string;
}

export interface RecommendationsSectionProps {
  recommendations: string[];
  className?: string;
}

export interface VisibilityMatrixHeaderProps {
  brandName: string;
  timestamp: string;
  timeframe: string;
  className?: string;
}
