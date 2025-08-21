import { tool } from 'ai';
import { z } from 'zod';
import {
  completeTask,
  createTask,
  failTask,
  updateTask,
} from '../../sse/progress-tracker';

// Types for visibility scoring
interface BrandScore {
  brandName: string;
  visibilityScore: number;
  mentionCount: number;
  sentimentScore: number;
  contextRelevance: number;
  reachScore: number;
  confidence: number;
  breakdown: {
    mentions: number;
    sentiment: number;
    context: number;
    reach: number;
  };
}

interface CompetitivePositioning {
  targetBrandRank: number;
  marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
  competitiveAdvantage: string[];
  competitiveDisadvantage: string[];
  marketShare: number;
  growthPotential: number;
}

interface ShareOfVoice {
  total: number;
  breakdown: Record<string, number>;
  channelDistribution: Record<string, number>;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface CompetitiveRanking {
  rank: number;
  brandName: string;
  visibilityScore: number;
  change: number;
  confidence: number;
}

interface TrendAnalysis {
  period: string;
  trends: Array<{
    brandName: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
    velocity: number;
  }>;
  predictions: Array<{
    brandName: string;
    predictedScore: number;
    confidence: number;
    timeframe: string;
  }>;
}

interface Insight {
  keyFindings: string[];
  opportunities: string[];
  threats: string[];
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    impact: number;
    effort: number;
  }>;
}

export const visibilityScoringTool = tool({
  description: 'Competitive visibility scoring and positioning analysis',
  inputSchema: z.object({
    brandName: z.string().min(1).max(100),
    competitors: z.array(z.string()).min(1).max(20),
    analysisResults: z.array(z.any()),
    brandDetectionResults: z.array(z.any()).optional(),
    historicalData: z.array(z.any()).optional(),
    scoringWeights: z
      .object({
        mentions: z.number().min(0).max(1).default(0.3),
        sentiment: z.number().min(0).max(1).default(0.2),
        context: z.number().min(0).max(1).default(0.2),
        reach: z.number().min(0).max(1).default(0.3),
      })
      .optional(),
    includeTrends: z.boolean().default(true),
    taskId: z.string().optional(), // For SSE integration
  }),
  handler: async (ctx, args) => {
    const {
      brandName,
      competitors,
      analysisResults,
      brandDetectionResults,
      historicalData,
      scoringWeights,
      includeTrends,
      taskId,
    } = args;

    // Initialize SSE progress tracking
    const progressTaskId = taskId || `visibility-scoring-${Date.now()}`;
    createTask(progressTaskId, 'Initializing visibility scoring analysis');

    try {
      updateTask(progressTaskId, {
        status: 'running',
        progress: 10,
        stage: 'Calculating brand scores',
        message: 'Analyzing brand visibility metrics...',
      });

      // Step 1: Calculate individual brand scores
      const brandScores = await calculateBrandScores(
        brandName,
        competitors,
        analysisResults,
        brandDetectionResults,
        scoringWeights || {
          mentions: 0.3,
          sentiment: 0.2,
          context: 0.2,
          reach: 0.3,
        },
      );

      updateTask(progressTaskId, {
        progress: 30,
        stage: 'Analyzing competitive positioning',
        message: 'Determining market position and competitive landscape...',
      });

      // Step 2: Calculate competitive positioning
      const competitivePositioning =
        await calculateCompetitivePositioning(brandScores);

      updateTask(progressTaskId, {
        progress: 50,
        stage: 'Calculating share of voice',
        message: 'Computing market share and voice distribution...',
      });

      // Step 3: Calculate share of voice metrics
      const shareOfVoice = await calculateShareOfVoice(brandScores);

      updateTask(progressTaskId, {
        progress: 70,
        stage: 'Generating competitive rankings',
        message: 'Creating competitive rankings and analysis...',
      });

      // Step 4: Generate competitive rankings
      const competitiveRankings =
        await generateCompetitiveRankings(brandScores);

      updateTask(progressTaskId, {
        progress: 85,
        stage: 'Analyzing trends and generating insights',
        message: 'Processing trends and creating actionable insights...',
      });

      // Step 5: Analyze trends (if historical data available)
      const trendAnalysis =
        includeTrends && historicalData
          ? await analyzeTrends(brandScores, historicalData)
          : null;

      // Step 6: Generate insights and recommendations
      const insights = await generateInsights(
        brandScores,
        competitivePositioning,
        shareOfVoice,
      );

      updateTask(progressTaskId, {
        progress: 100,
        stage: 'Completed',
        message: 'Visibility scoring analysis completed successfully',
      });

      const result = {
        brandName,
        competitors,
        brandScores,
        competitivePositioning,
        shareOfVoice,
        competitiveRankings,
        trendAnalysis,
        insights,
        metadata: {
          scoringWeights: scoringWeights || {
            mentions: 0.3,
            sentiment: 0.2,
            context: 0.2,
            reach: 0.3,
          },
          totalBrands: competitors.length + 1,
          analysisTime: Date.now(),
          category: 'visibility-scoring',
        },
      };

      // Complete the task with results
      completeTask(progressTaskId, result);

      return result;
    } catch (error) {
      const errorMessage = `Visibility scoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      failTask(progressTaskId, errorMessage);
      throw new Error(errorMessage);
    }
  },
});

// Scoring calculation functions
async function calculateBrandScores(
  brandName: string,
  competitors: string[],
  analysisResults: any[],
  brandDetectionResults: any[],
  weights: Record<string, number>,
): Promise<BrandScore[]> {
  const allBrands = [brandName, ...competitors];
  const scores: BrandScore[] = [];

  for (const brand of allBrands) {
    // Calculate mention count
    const mentionCount = countBrandMentions(
      analysisResults,
      brandDetectionResults,
      brand,
    );

    // Calculate sentiment score
    const sentimentScore = calculateSentimentScore(analysisResults, brand);

    // Calculate context relevance
    const contextRelevance = calculateContextRelevance(analysisResults, brand);

    // Calculate reach score
    const reachScore = calculateReachScore(analysisResults, brand);

    // Calculate weighted visibility score
    const visibilityScore =
      mentionCount * weights.mentions +
      sentimentScore * weights.sentiment +
      contextRelevance * weights.context +
      reachScore * weights.reach;

    scores.push({
      brandName: brand,
      visibilityScore: Math.min(visibilityScore, 100),
      mentionCount,
      sentimentScore,
      contextRelevance,
      reachScore,
      confidence: calculateConfidence(
        mentionCount,
        sentimentScore,
        contextRelevance,
        reachScore,
      ),
      breakdown: {
        mentions: mentionCount,
        sentiment: sentimentScore,
        context: contextRelevance,
        reach: reachScore,
      },
    });
  }

  return scores;
}

function countBrandMentions(
  analysisResults: any[],
  brandDetectionResults: any[],
  brandName: string,
): number {
  let count = 0;

  // Count from analysis results
  analysisResults.forEach((result) => {
    if (result.mentions && typeof result.mentions === 'number') {
      count += result.mentions;
    }
  });

  // Count from brand detection results
  if (brandDetectionResults) {
    brandDetectionResults.forEach((detection) => {
      if (detection.brandName === brandName) {
        count += 1;
      }
    });
  }

  return count;
}

function calculateSentimentScore(
  analysisResults: any[],
  brandName: string,
): number {
  let totalSentiment = 0;
  let sentimentCount = 0;

  analysisResults.forEach((result) => {
    if (result.sentiment) {
      const sentiment = result.sentiment.toLowerCase();
      let score = 0;
      if (sentiment === 'positive') score = 1;
      else if (sentiment === 'neutral') score = 0.5;
      else if (sentiment === 'negative') score = 0;
      totalSentiment += score;
      sentimentCount += 1;
    }
  });

  return sentimentCount > 0 ? (totalSentiment / sentimentCount) * 100 : 50;
}

function calculateContextRelevance(
  analysisResults: any[],
  brandName: string,
): number {
  let relevanceScore = 0;
  let contextCount = 0;

  analysisResults.forEach((result) => {
    if (result.context && Array.isArray(result.context)) {
      const relevantContexts = result.context.filter((ctx: string) =>
        ctx.toLowerCase().includes(brandName.toLowerCase()),
      );
      if (relevantContexts.length > 0) {
        relevanceScore += relevantContexts.length / result.context.length;
        contextCount += 1;
      }
    }
  });

  return contextCount > 0 ? (relevanceScore / contextCount) * 100 : 50;
}

function calculateReachScore(
  analysisResults: any[],
  brandName: string,
): number {
  // Simple reach calculation based on analysis results
  const totalResults = analysisResults.length;
  const brandResults = analysisResults.filter((result) =>
    result.response?.toLowerCase().includes(brandName.toLowerCase()),
  );

  return totalResults > 0 ? (brandResults.length / totalResults) * 100 : 0;
}

function calculateConfidence(
  mentionCount: number,
  sentimentScore: number,
  contextRelevance: number,
  reachScore: number,
): number {
  // Calculate confidence based on data quality and consistency
  const dataQuality = Math.min(mentionCount / 10, 1); // More mentions = higher quality
  const consistency = 1 - Math.abs(sentimentScore - 50) / 50; // Closer to neutral = more consistent
  const relevance = contextRelevance / 100;

  return Math.min((dataQuality + consistency + relevance) / 3, 1);
}

async function calculateCompetitivePositioning(
  brandScores: BrandScore[],
): Promise<CompetitivePositioning> {
  const targetBrand = brandScores[0]; // Assuming first is target brand
  const sortedScores = [...brandScores].sort(
    (a, b) => b.visibilityScore - a.visibilityScore,
  );
  const targetRank =
    sortedScores.findIndex(
      (score) => score.brandName === targetBrand.brandName,
    ) + 1;

  // Determine market position
  let marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
  if (targetRank === 1) marketPosition = 'leader';
  else if (targetRank <= 3) marketPosition = 'challenger';
  else if (targetRank <= 6) marketPosition = 'follower';
  else marketPosition = 'niche';

  // Calculate market share
  const totalScore = brandScores.reduce(
    (sum, score) => sum + score.visibilityScore,
    0,
  );
  const marketShare = (targetBrand.visibilityScore / totalScore) * 100;

  // Calculate growth potential
  const growthPotential = calculateGrowthPotential(targetBrand, brandScores);

  return {
    targetBrandRank: targetRank,
    marketPosition,
    competitiveAdvantage: identifyCompetitiveAdvantages(
      targetBrand,
      brandScores,
    ),
    competitiveDisadvantage: identifyCompetitiveDisadvantages(
      targetBrand,
      brandScores,
    ),
    marketShare,
    growthPotential,
  };
}

function calculateGrowthPotential(
  targetBrand: BrandScore,
  brandScores: BrandScore[],
): number {
  // Simple growth potential calculation
  const avgScore =
    brandScores.reduce((sum, score) => sum + score.visibilityScore, 0) /
    brandScores.length;
  const potential = Math.max(
    0,
    ((avgScore - targetBrand.visibilityScore) / avgScore) * 100,
  );
  return Math.min(potential, 100);
}

function identifyCompetitiveAdvantages(
  targetBrand: BrandScore,
  brandScores: BrandScore[],
): string[] {
  const advantages: string[] = [];
  const competitors = brandScores.filter(
    (score) => score.brandName !== targetBrand.brandName,
  );

  if (targetBrand.sentimentScore > 70) {
    advantages.push('Strong positive sentiment');
  }
  if (
    targetBrand.mentionCount >
    competitors.reduce((sum, c) => sum + c.mentionCount, 0) / competitors.length
  ) {
    advantages.push('Higher mention frequency');
  }
  if (targetBrand.contextRelevance > 80) {
    advantages.push('High contextual relevance');
  }

  return advantages.length > 0
    ? advantages
    : ['Competitive positioning analysis needed'];
}

function identifyCompetitiveDisadvantages(
  targetBrand: BrandScore,
  brandScores: BrandScore[],
): string[] {
  const disadvantages: string[] = [];
  const competitors = brandScores.filter(
    (score) => score.brandName !== targetBrand.brandName,
  );

  if (targetBrand.sentimentScore < 30) {
    disadvantages.push('Negative sentiment concerns');
  }
  if (
    targetBrand.mentionCount <
    competitors.reduce((sum, c) => sum + c.mentionCount, 0) / competitors.length
  ) {
    disadvantages.push('Lower mention frequency');
  }
  if (targetBrand.contextRelevance < 50) {
    disadvantages.push('Low contextual relevance');
  }

  return disadvantages.length > 0
    ? disadvantages
    : ['No significant disadvantages identified'];
}

async function calculateShareOfVoice(
  brandScores: BrandScore[],
): Promise<ShareOfVoice> {
  const totalMentions = brandScores.reduce(
    (sum, score) => sum + score.mentionCount,
    0,
  );
  const targetBrand = brandScores[0];

  const breakdown: Record<string, number> = {};
  brandScores.forEach((score) => {
    breakdown[score.brandName] = (score.mentionCount / totalMentions) * 100;
  });

  return {
    total: breakdown[targetBrand.brandName] || 0,
    breakdown,
    channelDistribution: calculateChannelDistribution(brandScores),
    trend: determineTrend(brandScores),
  };
}

function calculateChannelDistribution(
  brandScores: BrandScore[],
): Record<string, number> {
  // Simplified channel distribution
  return {
    online: 60,
    social: 25,
    news: 15,
  };
}

function determineTrend(
  brandScores: BrandScore[],
): 'increasing' | 'decreasing' | 'stable' {
  const targetBrand = brandScores[0];
  if (targetBrand.visibilityScore > 70) return 'increasing';
  if (targetBrand.visibilityScore < 30) return 'decreasing';
  return 'stable';
}

async function generateCompetitiveRankings(
  brandScores: BrandScore[],
): Promise<CompetitiveRanking[]> {
  const sortedScores = [...brandScores].sort(
    (a, b) => b.visibilityScore - a.visibilityScore,
  );

  return sortedScores.map((score, index) => ({
    rank: index + 1,
    brandName: score.brandName,
    visibilityScore: score.visibilityScore,
    change: 0, // Would be calculated with historical data
    confidence: score.confidence,
  }));
}

async function analyzeTrends(
  brandScores: BrandScore[],
  historicalData: any[],
): Promise<TrendAnalysis> {
  // Simplified trend analysis
  const trends = brandScores.map((score) => ({
    brandName: score.brandName,
    trend: 'stable' as const,
    change: 0,
    velocity: 0,
  }));

  const predictions = brandScores.map((score) => ({
    brandName: score.brandName,
    predictedScore: score.visibilityScore,
    confidence: score.confidence,
    timeframe: '3 months',
  }));

  return {
    period: 'Last 30 days',
    trends,
    predictions,
  };
}

async function generateInsights(
  brandScores: BrandScore[],
  competitivePositioning: CompetitivePositioning,
  shareOfVoice: ShareOfVoice,
): Promise<Insight> {
  const targetBrand = brandScores[0];
  const keyFindings: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];
  const recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    impact: number;
    effort: number;
  }> = [];

  // Generate key findings
  keyFindings.push(
    `${targetBrand.brandName} has a visibility score of ${targetBrand.visibilityScore.toFixed(1)}/100`,
  );
  keyFindings.push(
    `Market position: ${competitivePositioning.marketPosition} (rank #${competitivePositioning.targetBrandRank})`,
  );
  keyFindings.push(
    `Share of voice: ${shareOfVoice.total.toFixed(1)}% of total market mentions`,
  );

  // Generate opportunities
  if (targetBrand.sentimentScore < 70) {
    opportunities.push('Improve brand sentiment through positive engagement');
    recommendations.push({
      priority: 'high',
      category: 'Sentiment',
      description: 'Implement sentiment improvement strategies',
      impact: 8,
      effort: 6,
    });
  }

  if (targetBrand.mentionCount < 10) {
    opportunities.push('Increase brand mention frequency');
    recommendations.push({
      priority: 'medium',
      category: 'Visibility',
      description: 'Develop content strategy to increase mentions',
      impact: 7,
      effort: 5,
    });
  }

  // Generate threats
  if (competitivePositioning.marketShare < 20) {
    threats.push('Low market share indicates competitive pressure');
  }

  if (targetBrand.visibilityScore < 50) {
    threats.push('Below-average visibility may impact brand recognition');
  }

  return {
    keyFindings,
    opportunities,
    threats,
    recommendations,
  };
}
