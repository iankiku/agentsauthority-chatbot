import { tool } from 'ai';
import { z } from 'zod';
import { FirecrawlClient } from '../../data-sources/firecrawl-client';
import type { BrandMonitoringResponse } from '../../data-sources/firecrawl-types';

export interface BrandMonitorResult {
  brandName: string;
  timestamp: string;
  monitoringPeriod: string;
  summary: {
    totalMentions: number;
    averageSentiment: 'positive' | 'neutral' | 'negative';
    topSources: string[];
    trendingTopics: string[];
    executionTime: number;
    credibilityScore: number;
  };
  detailedResults: Array<{
    source: string;
    url: string;
    title: string;
    mentions: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    credibilityScore: number;
    publishedAt: string;
  }>;
  insights: string[];
  recommendations: string[];
  metadata: {
    sourcesQueried: string[];
    timeframe: string;
    category: 'brand-monitoring';
  };
}

export const brandMonitorTool = tool({
  description:
    'Monitor brand mentions and sentiment across Reddit, HackerNews, Twitter, and news sources',
  inputSchema: z.object({
    brandName: z.string().describe('The brand name to monitor'),
    sources: z
      .array(z.enum(['reddit', 'hackernews', 'twitter', 'news']))
      .optional()
      .describe('Sources to monitor (default: all)'),
    timeframe: z
      .enum(['day', 'week', 'month'])
      .default('week')
      .describe('Timeframe for monitoring'),
    includeInsights: z
      .boolean()
      .default(true)
      .describe('Include AI-generated insights'),
    includeRecommendations: z
      .boolean()
      .default(true)
      .describe('Include actionable recommendations'),
  }),
  execute: async ({
    brandName,
    sources = ['reddit', 'hackernews', 'twitter', 'news'],
    timeframe = 'week',
    includeInsights = true,
    includeRecommendations = true,
  }) => {
    const startTime = Date.now();

    try {
      // Initialize the Firecrawl client
      const firecrawlClient = new FirecrawlClient();

      // Perform brand monitoring
      const monitoringResponse = await firecrawlClient.monitorBrand({
        brandName,
        sources,
        options: { timeframe, limit: 20 },
      });

      // Calculate additional metrics
      const credibilityScore = calculateOverallCredibility(
        monitoringResponse.results,
      );
      const insights = includeInsights
        ? generateInsights(monitoringResponse, brandName)
        : [];
      const recommendations = includeRecommendations
        ? generateRecommendations(monitoringResponse, brandName)
        : [];

      // Build detailed results
      const detailedResults = monitoringResponse.results.map((result) => ({
        source: result.source,
        url: result.url,
        title: result.title,
        mentions: result.mentions.length,
        sentiment: result.sentiment.overall,
        credibilityScore: result.credibilityScore,
        publishedAt: result.publishedAt,
      }));

      // Calculate execution time
      const executionTime = Date.now() - startTime;

      // Build the response
      const result: BrandMonitorResult = {
        brandName,
        timestamp: new Date().toISOString(),
        monitoringPeriod: timeframe,
        summary: {
          totalMentions: monitoringResponse.summary.totalMentions,
          averageSentiment: monitoringResponse.summary.averageSentiment,
          topSources: monitoringResponse.summary.topSources,
          trendingTopics: monitoringResponse.summary.trendingTopics,
          executionTime: monitoringResponse.summary.executionTime,
          credibilityScore,
        },
        detailedResults,
        insights,
        recommendations,
        metadata: {
          sourcesQueried: monitoringResponse.metadata.sourcesQueried,
          timeframe: monitoringResponse.metadata.timeframe,
          category: 'brand-monitoring',
        },
      };

      return result;
    } catch (error) {
      // Handle errors gracefully
      const executionTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      // Return a partial result with error information
      const errorResult: BrandMonitorResult = {
        brandName,
        timestamp: new Date().toISOString(),
        monitoringPeriod: timeframe,
        summary: {
          totalMentions: 0,
          averageSentiment: 'neutral',
          topSources: [],
          trendingTopics: [],
          executionTime,
          credibilityScore: 0,
        },
        detailedResults: [],
        insights: [`Brand monitoring failed: ${errorMessage}`],
        recommendations: includeRecommendations
          ? ['Please check your brand name and try again']
          : [],
        metadata: {
          sourcesQueried: sources,
          timeframe,
          category: 'brand-monitoring',
        },
      };

      return errorResult;
    }
  },
});

/**
 * Calculate overall credibility score from monitoring results
 */
function calculateOverallCredibility(results: any[]): number {
  if (results.length === 0) return 0;

  const totalCredibility = results.reduce(
    (sum, result) => sum + result.credibilityScore,
    0,
  );
  return Math.round((totalCredibility / results.length) * 100) / 100;
}

/**
 * Generate insights based on monitoring results
 */
function generateInsights(
  monitoringResponse: BrandMonitoringResponse,
  brandName: string,
): string[] {
  const insights: string[] = [];

  // Mention volume insights
  if (monitoringResponse.summary.totalMentions > 50) {
    insights.push(
      `High brand visibility with ${monitoringResponse.summary.totalMentions} mentions across ${monitoringResponse.summary.topSources.length} sources`,
    );
  } else if (monitoringResponse.summary.totalMentions > 10) {
    insights.push(
      `Moderate brand visibility with ${monitoringResponse.summary.totalMentions} mentions detected`,
    );
  } else if (monitoringResponse.summary.totalMentions > 0) {
    insights.push(
      `Low brand visibility with only ${monitoringResponse.summary.totalMentions} mentions found`,
    );
  } else {
    insights.push(`No brand mentions detected in the specified timeframe`);
  }

  // Sentiment insights
  if (monitoringResponse.summary.averageSentiment === 'positive') {
    insights.push(`Positive sentiment dominant across monitored sources`);
  } else if (monitoringResponse.summary.averageSentiment === 'negative') {
    insights.push(`Negative sentiment detected - attention required`);
  } else {
    insights.push(`Neutral sentiment across monitored sources`);
  }

  // Source insights
  if (monitoringResponse.summary.topSources.length > 0) {
    const topSource = monitoringResponse.summary.topSources[0];
    insights.push(`Strongest presence on ${topSource} platform`);
  }

  // Trending topics insights
  if (monitoringResponse.summary.trendingTopics.length > 0) {
    insights.push(
      `Trending topics: ${monitoringResponse.summary.trendingTopics.join(', ')}`,
    );
  }

  // Performance insights
  const avgCredibility =
    monitoringResponse.results.reduce((sum, r) => sum + r.credibilityScore, 0) /
    monitoringResponse.results.length;
  if (avgCredibility > 0.8) {
    insights.push(
      `High credibility sources (${Math.round(avgCredibility * 100)}% average score)`,
    );
  } else if (avgCredibility > 0.6) {
    insights.push(
      `Moderate credibility sources (${Math.round(avgCredibility * 100)}% average score)`,
    );
  } else {
    insights.push(
      `Low credibility sources (${Math.round(avgCredibility * 100)}% average score)`,
    );
  }

  return insights;
}

/**
 * Generate recommendations based on monitoring results
 */
function generateRecommendations(
  monitoringResponse: BrandMonitoringResponse,
  brandName: string,
): string[] {
  const recommendations: string[] = [];

  // Volume-based recommendations
  if (monitoringResponse.summary.totalMentions < 5) {
    recommendations.push(
      'Increase brand visibility through content marketing and social media engagement',
    );
    recommendations.push(
      'Consider launching a PR campaign to generate more brand mentions',
    );
  }

  // Sentiment-based recommendations
  if (monitoringResponse.summary.averageSentiment === 'negative') {
    recommendations.push(
      'Address negative sentiment through customer service improvements',
    );
    recommendations.push('Develop a crisis communication strategy');
    recommendations.push(
      'Monitor and respond to negative mentions proactively',
    );
  } else if (monitoringResponse.summary.averageSentiment === 'positive') {
    recommendations.push(
      'Leverage positive sentiment by amplifying positive mentions',
    );
    recommendations.push('Consider user-generated content campaigns');
  }

  // Source-based recommendations
  const sourceCounts = new Map<string, number>();
  monitoringResponse.results.forEach((result) => {
    const count = sourceCounts.get(result.source) || 0;
    sourceCounts.set(result.source, count + result.mentions.length);
  });

  const lowPerformingSources = Array.from(sourceCounts.entries())
    .filter(([, count]) => count < 2)
    .map(([source]) => source);

  if (lowPerformingSources.length > 0) {
    recommendations.push(
      `Focus on improving presence on ${lowPerformingSources.join(', ')} platforms`,
    );
  }

  // Credibility-based recommendations
  const avgCredibility =
    monitoringResponse.results.reduce((sum, r) => sum + r.credibilityScore, 0) /
    monitoringResponse.results.length;
  if (avgCredibility < 0.7) {
    recommendations.push(
      'Focus on high-authority sources to improve credibility scores',
    );
    recommendations.push(
      'Develop relationships with industry influencers and thought leaders',
    );
  }

  // General recommendations
  recommendations.push('Set up automated monitoring alerts for brand mentions');
  recommendations.push('Regularly review and update brand monitoring strategy');
  recommendations.push('Track competitor mentions for comparative analysis');

  return recommendations;
}
