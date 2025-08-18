import { tool } from 'ai';
import { z } from 'zod';
import { MultiModelClient } from '../../data-sources/multi-model-client';

export interface CompetitiveAnalysisResult {
  primaryBrand: string;
  competitors: string[];
  industry: string;
  timeframe: string;
  marketPosition: {
    overallRank: number;
    totalCompetitors: number;
    marketShare: number;
    competitiveScore: number;
  };
  shareOfVoice: {
    primaryBrand: number;
    competitors: Array<{
      name: string;
      share: number;
      rank: number;
      change: string;
    }>;
  };
  competitiveGaps: Array<{
    category: string;
    opportunity: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
  }>;
  strategicRecommendations: string[];
  metadata: {
    executionTime: number;
    modelsQueried: string[];
    category: 'competitive-analysis';
  };
}

export const competitiveIntelligenceTool = tool({
  description: 'Analyze competitive positioning and market share across AI platforms with multi-brand comparison',
  inputSchema: z.object({
    primaryBrand: z.string().min(1).max(100).describe('The primary brand to analyze'),
    competitors: z.array(z.string()).min(1).max(10).describe('Array of competitor brand names'),
    industry: z.string().optional().describe('Industry context for analysis'),
    timeframe: z.enum(['week', 'month', 'quarter']).default('week').describe('Timeframe for analysis'),
    includeRecommendations: z.boolean().default(true).describe('Include strategic recommendations'),
  }),
  execute: async ({
    primaryBrand,
    competitors,
    industry = 'general',
    timeframe = 'week',
    includeRecommendations = true,
  }) => {
    const startTime = Date.now();

    try {
      // Initialize the multi-model client
      const multiModelClient = new MultiModelClient();

      // Generate analysis queries
      const analysisQueries = generateCompetitiveQueries(primaryBrand, competitors, industry);

      // Analyze primary brand
      const primaryResults = await multiModelClient.queryAllModels(primaryBrand, analysisQueries);

      // Analyze competitors in parallel
      const competitorPromises = competitors.map(async (competitor) => {
        const results = await multiModelClient.queryAllModels(competitor, analysisQueries);
        return { brand: competitor, results };
      });

      const competitorResults = await Promise.all(competitorPromises);
      const competitorResultsMap = Object.fromEntries(
        competitorResults.map(({ brand, results }) => [brand, results]),
      );

      // Perform competitive analysis
      const analysis = analyzeCompetitivePosition(primaryBrand, primaryResults, competitorResultsMap);

      // Generate strategic recommendations
      const strategicRecommendations = includeRecommendations
        ? generateStrategicRecommendations(analysis, primaryBrand)
        : [];

      // Calculate execution time
      const executionTime = Date.now() - startTime;

      // Build the response
      const result: CompetitiveAnalysisResult = {
        primaryBrand,
        competitors,
        industry,
        timeframe,
        marketPosition: analysis.marketPosition,
        shareOfVoice: analysis.shareOfVoice,
        competitiveGaps: analysis.competitiveGaps,
        strategicRecommendations,
        metadata: {
          executionTime,
          modelsQueried: multiModelClient.getAvailableModels(),
          category: 'competitive-analysis',
        },
      };

      return result;
    } catch (error) {
      // Handle errors gracefully
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Return a partial result with error information
      const errorResult: CompetitiveAnalysisResult = {
        primaryBrand,
        competitors,
        industry,
        timeframe,
        marketPosition: {
          overallRank: 0,
          totalCompetitors: competitors.length + 1,
          marketShare: 0,
          competitiveScore: 0,
        },
        shareOfVoice: {
          primaryBrand: 0,
          competitors: competitors.map((competitor, index) => ({
            name: competitor,
            share: 0,
            rank: index + 1,
            change: 'unknown',
          })),
        },
        competitiveGaps: [],
        strategicRecommendations: includeRecommendations
          ? [`Competitive analysis failed: ${errorMessage}`]
          : [],
        metadata: {
          executionTime,
          modelsQueried: [],
          category: 'competitive-analysis',
        },
      };

      return errorResult;
    }
  },
});

/**
 * Generate competitive analysis queries
 */
function generateCompetitiveQueries(primaryBrand: string, competitors: string[], industry: string): string[] {
  const competitorList = competitors.join(', ');
  
  return [
    `Compare ${primaryBrand} with ${competitorList} in the ${industry} industry. What are the key differences?`,
    `What are the main strengths and weaknesses of ${primaryBrand} compared to ${competitorList}?`,
    `How does ${primaryBrand} position itself against ${competitorList} in the market?`,
    `What competitive advantages does ${primaryBrand} have over ${competitorList}?`,
    `What are the market opportunities for ${primaryBrand} relative to ${competitorList}?`,
  ];
}

/**
 * Analyze competitive positioning
 */
function analyzeCompetitivePosition(
  primaryBrand: string,
  primaryResults: any[],
  competitorResults: Record<string, any[]>,
): {
  marketPosition: CompetitiveAnalysisResult['marketPosition'];
  shareOfVoice: CompetitiveAnalysisResult['shareOfVoice'];
  competitiveGaps: CompetitiveAnalysisResult['competitiveGaps'];
} {
  // Calculate overall scores for each brand
  const brandScores = {
    [primaryBrand]: calculateOverallScore(primaryResults),
    ...Object.fromEntries(
      Object.entries(competitorResults).map(([brand, results]) => [
        brand,
        calculateOverallScore(results),
      ]),
    ),
  };

  // Determine market positioning
  const sortedBrands = Object.entries(brandScores)
    .sort(([, a], [, b]) => b - a)
    .map(([brand]) => brand);

  const primaryRank = sortedBrands.indexOf(primaryBrand) + 1;
  const marketShare = calculateMarketShare(brandScores, primaryBrand);

  // Calculate share of voice
  const shareOfVoice = calculateShareOfVoice(brandScores, primaryBrand);

  // Identify competitive gaps
  const gaps = identifyCompetitiveGaps(primaryResults, competitorResults, primaryBrand);

  return {
    marketPosition: {
      overallRank: primaryRank,
      totalCompetitors: sortedBrands.length,
      marketShare,
      competitiveScore: brandScores[primaryBrand],
    },
    shareOfVoice,
    competitiveGaps: gaps,
  };
}

/**
 * Calculate overall score for a brand based on model results
 */
function calculateOverallScore(results: any[]): number {
  if (results.length === 0) return 0;

  const scores = results.map((result) => {
    // Base score from visibility
    let score = result.visibility_score || 0;

    // Sentiment bonus
    if (result.sentiment === 'positive') score += 20;
    else if (result.sentiment === 'neutral') score += 10;

    // Mention bonus
    score += Math.min(result.mentions * 5, 30);

    // Success bonus
    if (result.success) score += 10;

    return score;
  });

  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(averageScore);
}

/**
 * Calculate market share percentage
 */
function calculateMarketShare(brandScores: Record<string, number>, primaryBrand: string): number {
  const totalScore = Object.values(brandScores).reduce((sum, score) => sum + score, 0);
  if (totalScore === 0) return 0;

  const primaryScore = brandScores[primaryBrand] || 0;
  return Math.round((primaryScore / totalScore) * 100);
}

/**
 * Calculate share of voice for all brands
 */
function calculateShareOfVoice(
  brandScores: Record<string, number>,
  primaryBrand: string,
): CompetitiveAnalysisResult['shareOfVoice'] {
  const totalScore = Object.values(brandScores).reduce((sum, score) => sum + score, 0);
  
  if (totalScore === 0) {
    return {
      primaryBrand: 0,
      competitors: Object.keys(brandScores)
        .filter((brand) => brand !== primaryBrand)
        .map((competitor, index) => ({
          name: competitor,
          share: 0,
          rank: index + 1,
          change: 'unknown',
        })),
    };
  }

  const competitors = Object.entries(brandScores)
    .filter(([brand]) => brand !== primaryBrand)
    .map(([brand, score]) => ({
      name: brand,
      share: Math.round((score / totalScore) * 100),
      rank: 0, // Will be calculated below
      change: 'stable', // Mock data - would be calculated from historical data
    }))
    .sort((a, b) => b.share - a.share);

  // Assign ranks
  competitors.forEach((competitor, index) => {
    competitor.rank = index + 2; // +2 because primary brand is rank 1
  });

  return {
    primaryBrand: Math.round((brandScores[primaryBrand] / totalScore) * 100),
    competitors,
  };
}

/**
 * Identify competitive gaps and opportunities
 */
function identifyCompetitiveGaps(
  primaryResults: any[],
  competitorResults: Record<string, any[]>,
  primaryBrand: string,
): CompetitiveAnalysisResult['competitiveGaps'] {
  const gaps: CompetitiveAnalysisResult['competitiveGaps'] = [];

  // Analyze visibility gaps
  const primaryVisibility = primaryResults.reduce((sum, r) => sum + (r.visibility_score || 0), 0) / primaryResults.length;
  const competitorVisibilities = Object.entries(competitorResults).map(([brand, results]) => ({
    brand,
    visibility: results.reduce((sum, r) => sum + (r.visibility_score || 0), 0) / results.length,
  }));

  const maxVisibility = Math.max(primaryVisibility, ...competitorVisibilities.map((c) => c.visibility));
  if (primaryVisibility < maxVisibility * 0.8) {
    gaps.push({
      category: 'Visibility',
      opportunity: 'Improve brand visibility across AI platforms',
      impact: 'high',
      effort: 'medium',
    });
  }

  // Analyze sentiment gaps
  const primarySentiments = primaryResults.map((r) => r.sentiment);
  const positiveSentimentRatio = primarySentiments.filter((s) => s === 'positive').length / primarySentiments.length;

  if (positiveSentimentRatio < 0.6) {
    gaps.push({
      category: 'Sentiment',
      opportunity: 'Improve brand sentiment and perception',
      impact: 'high',
      effort: 'high',
    });
  }

  // Analyze mention frequency gaps
  const primaryMentions = primaryResults.reduce((sum, r) => sum + (r.mentions || 0), 0);
  const competitorMentions = Object.values(competitorResults).map((results) =>
    results.reduce((sum, r) => sum + (r.mentions || 0), 0),
  );
  const avgCompetitorMentions = competitorMentions.reduce((sum, mentions) => sum + mentions, 0) / competitorMentions.length;

  if (primaryMentions < avgCompetitorMentions * 0.7) {
    gaps.push({
      category: 'Mentions',
      opportunity: 'Increase brand mention frequency',
      impact: 'medium',
      effort: 'medium',
    });
  }

  // Identify innovation opportunities
  gaps.push({
    category: 'Innovation',
    opportunity: 'Leverage AI platform presence for competitive advantage',
    impact: 'high',
    effort: 'low',
  });

  // Identify differentiation opportunities
  gaps.push({
    category: 'Differentiation',
    opportunity: 'Develop unique positioning against competitors',
    impact: 'medium',
    effort: 'high',
  });

  return gaps;
}

/**
 * Generate strategic recommendations
 */
function generateStrategicRecommendations(
  analysis: {
    marketPosition: CompetitiveAnalysisResult['marketPosition'];
    shareOfVoice: CompetitiveAnalysisResult['shareOfVoice'];
    competitiveGaps: CompetitiveAnalysisResult['competitiveGaps'];
  },
  primaryBrand: string,
): string[] {
  const recommendations: string[] = [];

  // Market position recommendations
  if (analysis.marketPosition.overallRank > 2) {
    recommendations.push('Focus on improving competitive positioning through targeted content strategy');
    recommendations.push('Develop unique value propositions to differentiate from top competitors');
  } else if (analysis.marketPosition.overallRank === 1) {
    recommendations.push('Maintain market leadership by continuing to innovate and engage');
    recommendations.push('Monitor competitor activities to defend market position');
  }

  // Share of voice recommendations
  if (analysis.shareOfVoice.primaryBrand < 30) {
    recommendations.push('Increase share of voice through aggressive content marketing');
    recommendations.push('Develop thought leadership content to improve brand authority');
  }

  // Gap-based recommendations
  const highImpactGaps = analysis.competitiveGaps.filter((gap) => gap.impact === 'high');
  highImpactGaps.forEach((gap) => {
    recommendations.push(`Prioritize ${gap.category.toLowerCase()} improvements: ${gap.opportunity}`);
  });

  // General strategic recommendations
  recommendations.push('Implement continuous competitive monitoring and analysis');
  recommendations.push('Develop AI platform-specific content strategies');
  recommendations.push('Create competitive response playbooks for different scenarios');

  return recommendations.slice(0, 5); // Limit to top 5 recommendations
}
