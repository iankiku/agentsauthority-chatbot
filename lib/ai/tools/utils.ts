import type { ModelResult } from '../../data-sources/types';
import type { InsightGenerationResult, QueryGenerationResult } from './types';

/**
 * Generate queries for brand analysis
 */
export function generateQueries(
  brandName: string,
  customQueries?: string[],
): QueryGenerationResult {
  const defaultQueries = [
    `Tell me about ${brandName}`,
    `What is ${brandName} known for?`,
    `How would you describe ${brandName}?`,
    `What are the key features of ${brandName}?`,
  ];

  if (customQueries && customQueries.length > 0) {
    return {
      queries: customQueries,
      source: 'custom',
    };
  }

  return {
    queries: defaultQueries,
    source: 'default',
  };
}

/**
 * Generate insights based on model results
 */
export function generateInsights(
  results: ModelResult[],
  brandName: string,
): InsightGenerationResult {
  const insights: string[] = [];
  const recommendations: string[] = [];

  // Calculate average visibility score
  const avgScore =
    results.reduce((sum, r) => sum + r.visibility_score, 0) / results.length;

  // Visibility insights
  if (avgScore > 70) {
    insights.push(
      `Strong visibility across AI platforms (${avgScore.toFixed(1)}/100)`,
    );
  } else if (avgScore > 40) {
    insights.push(
      `Moderate visibility across AI platforms (${avgScore.toFixed(1)}/100)`,
    );
  } else {
    insights.push(
      `Limited visibility across AI platforms (${avgScore.toFixed(1)}/100)`,
    );
  }

  // Sentiment insights
  const sentiments = results.map((r) => r.sentiment);
  const positiveCount = sentiments.filter((s) => s === 'positive').length;
  const negativeCount = sentiments.filter((s) => s === 'negative').length;

  if (positiveCount > results.length / 2) {
    insights.push(
      `Positive sentiment dominant across ${positiveCount}/${results.length} models`,
    );
  } else if (negativeCount > results.length / 2) {
    insights.push(
      `Negative sentiment detected across ${negativeCount}/${results.length} models`,
    );
  } else {
    insights.push('Mixed sentiment across AI platforms');
  }

  // Model-specific insights
  const bestModel = results.reduce((best, current) =>
    current.visibility_score > best.visibility_score ? current : best,
  );
  insights.push(
    `Strongest performance on ${bestModel.model} (${bestModel.visibility_score}/100)`,
  );

  // Total mentions insight
  const totalMentions = results.reduce((sum, r) => sum + r.mentions, 0);
  if (totalMentions > 0) {
    insights.push(`${totalMentions} total brand mentions detected`);
  } else {
    insights.push('No brand mentions detected in AI responses');
  }

  // Generate recommendations
  if (avgScore < 50) {
    recommendations.push(
      'Consider improving brand visibility through content optimization',
    );
    recommendations.push(
      'Focus on creating more comprehensive brand descriptions',
    );
  }

  if (negativeCount > positiveCount) {
    recommendations.push(
      'Address negative sentiment patterns in brand messaging',
    );
    recommendations.push(
      'Develop content strategy to improve brand perception',
    );
  }

  if (totalMentions === 0) {
    recommendations.push(
      'Enhance brand presence by creating more detailed brand information',
    );
    recommendations.push(
      'Consider updating brand descriptions across platforms',
    );
  }

  // Platform-specific recommendations
  const lowPerformingModels = results.filter((r) => r.visibility_score < 40);
  if (lowPerformingModels.length > 0) {
    const modelNames = lowPerformingModels.map((r) => r.model).join(', ');
    recommendations.push(`Focus on improving visibility on ${modelNames}`);
  }

  // General recommendations
  recommendations.push(
    'Monitor competitor visibility for market positioning insights',
  );
  recommendations.push(
    'Regularly update brand information to maintain relevance',
  );

  return { insights, recommendations };
}

/**
 * Calculate overall visibility score from model results
 */
export function calculateOverallVisibility(results: ModelResult[]): number {
  if (results.length === 0) return 0;

  const totalScore = results.reduce((sum, r) => sum + r.visibility_score, 0);
  return Math.round(totalScore / results.length);
}

/**
 * Extract metadata from analysis results
 */
export function extractMetadata(
  results: ModelResult[],
  queries: string[],
  executionTime: number,
): {
  executionTime: number;
  modelsQueried: string[];
  queriesUsed: string[];
  category: 'visibility-analysis';
} {
  return {
    executionTime,
    modelsQueried: results.map((r) => r.model),
    queriesUsed: queries,
    category: 'visibility-analysis',
  };
}
