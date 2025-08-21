import { tool } from 'ai';
import { z } from 'zod';
import {
  completeTask,
  createTask,
  failTask,
  updateTask,
} from '../../sse/progress-tracker';

export interface BrandMonitorResult {
  brandName: string;
  websiteUrl: string;
  competitors: Array<{
    name: string;
    description: string;
    confidence: number;
    businessModel: string;
  }>;
  analysisResults: Array<{
    provider: string;
    response: string;
    mentions: number;
    context: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    visibility_score: number;
    execution_time: number;
    success: boolean;
  }>;
  brandDetectionResults: Array<{
    text: string;
    brandName: string;
    confidence: number;
    context: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>;
  visibilityScores: {
    brandScore: number;
    competitorScores: Record<string, number>;
    shareOfVoice: number;
    competitivePosition: string;
    recommendations: string[];
  };
  metadata: {
    executionTime: number;
    category: 'brand-monitoring';
    totalCompetitors: number;
    analysisProviders: string[];
  };
}

export const brandMonitorAgent = tool({
  description: 'Comprehensive brand monitoring with multi-provider AI analysis',
  inputSchema: z.object({
    brandName: z.string().min(1).max(100),
    websiteUrl: z.string().url(),
    customPrompts: z.array(z.string()).optional(),
    competitors: z.array(z.string()).optional(),
  }),
  execute: async (args) => {
    const { brandName, websiteUrl, customPrompts, competitors } = args;

    // Generate a unique task ID for this monitoring session
    const taskId = `brand-monitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Initialize the task
    createTask(taskId);

    try {
      // Step 1: Competitor Identification
      updateTask(taskId, {
        status: 'running',
        stage: 'Identifying competitors',
        progress: 10,
        message:
          'Analyzing company context and identifying relevant competitors...',
      });

      const identifiedCompetitors = await identifyCompetitors(
        brandName,
        websiteUrl,
        competitors,
      );

      // Step 2: Multi-Provider Analysis
      updateTask(taskId, {
        stage: 'Analyzing brand visibility',
        progress: 30,
        message: 'Performing multi-provider AI analysis...',
      });

      const analysisResults = await performMultiProviderAnalysis(
        brandName,
        identifiedCompetitors,
        customPrompts,
      );

      // Step 3: Brand Detection
      updateTask(taskId, {
        stage: 'Detecting brand mentions',
        progress: 60,
        message: 'Analyzing brand mentions and sentiment...',
      });

      const brandDetectionResults = await detectBrandMentions(
        analysisResults,
        brandName,
      );

      // Step 4: Visibility Scoring
      updateTask(taskId, {
        stage: 'Calculating visibility scores',
        progress: 80,
        message: 'Computing comprehensive visibility metrics...',
      });

      const visibilityScores = await calculateVisibilityScores(
        brandName,
        identifiedCompetitors,
        brandDetectionResults,
      );

      // Step 5: Final Results
      updateTask(taskId, {
        stage: 'Generating final report',
        progress: 100,
        message: 'Compiling comprehensive brand monitoring report...',
      });

      const finalResult: BrandMonitorResult = {
        brandName,
        websiteUrl,
        competitors: identifiedCompetitors,
        analysisResults,
        brandDetectionResults,
        visibilityScores,
        metadata: {
          executionTime: Date.now(),
          category: 'brand-monitoring',
          totalCompetitors: identifiedCompetitors.length,
          analysisProviders: ['openai', 'claude', 'gemini', 'perplexity'],
        },
      };

      // Complete the task
      completeTask(taskId, finalResult);

      return finalResult;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      // Fail the task
      failTask(taskId, errorMessage);

      throw new Error(`Brand monitoring failed: ${errorMessage}`);
    }
  },
});

async function identifyCompetitors(
  brandName: string,
  websiteUrl: string,
  providedCompetitors?: string[],
): Promise<
  Array<{
    name: string;
    description: string;
    confidence: number;
    businessModel: string;
  }>
> {
  try {
    // If competitors are provided, use them directly
    if (providedCompetitors && providedCompetitors.length > 0) {
      return providedCompetitors.map((competitor) => ({
        name: competitor,
        description: `Competitor: ${competitor}`,
        confidence: 0.9,
        businessModel: 'Unknown',
      }));
    }

    // Otherwise, use the competitor identification tool
    const companyDescription = `Company: ${brandName}, Website: ${websiteUrl}`;

    // Mock competitor identification - replace with actual tool call
    const mockCompetitors = [
      {
        name: 'Competitor A',
        description: 'Leading competitor in the same industry',
        confidence: 0.85,
        businessModel: 'SaaS',
      },
      {
        name: 'Competitor B',
        description: 'Innovative startup disrupting the market',
        confidence: 0.78,
        businessModel: 'Platform',
      },
      {
        name: 'Competitor C',
        description: 'Established enterprise solution provider',
        confidence: 0.82,
        businessModel: 'Enterprise',
      },
    ];

    return mockCompetitors;
  } catch (error) {
    console.error('Competitor identification failed:', error);
    return [];
  }
}

async function performMultiProviderAnalysis(
  brandName: string,
  competitors: Array<{
    name: string;
    description: string;
    confidence: number;
    businessModel: string;
  }>,
  customPrompts?: string[],
): Promise<
  Array<{
    provider: string;
    response: string;
    mentions: number;
    context: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    visibility_score: number;
    execution_time: number;
    success: boolean;
  }>
> {
  try {
    const competitorNames = competitors.map((c) => c.name);
    const prompts = customPrompts || [
      `Analyze the brand visibility and market positioning of ${brandName}`,
      `Compare ${brandName} with competitors on key differentiators`,
      `Evaluate the sentiment and public perception of ${brandName}`,
    ];

    // Mock multi-provider analysis - replace with actual tool call
    const mockResults = [
      {
        provider: 'openai',
        response: `${brandName} shows strong market presence with positive sentiment across multiple channels.`,
        mentions: 5,
        context: ['Strong brand recognition', 'Positive customer feedback'],
        sentiment: 'positive' as const,
        visibility_score: 85,
        execution_time: 2500,
        success: true,
      },
      {
        provider: 'claude',
        response: `${brandName} demonstrates competitive positioning with clear market differentiation.`,
        mentions: 3,
        context: ['Market differentiation', 'Competitive advantage'],
        sentiment: 'positive' as const,
        visibility_score: 78,
        execution_time: 2200,
        success: true,
      },
      {
        provider: 'gemini',
        response: `${brandName} has moderate visibility with room for improvement in certain areas.`,
        mentions: 2,
        context: ['Moderate visibility', 'Growth opportunities'],
        sentiment: 'neutral' as const,
        visibility_score: 65,
        execution_time: 1800,
        success: true,
      },
    ];

    return mockResults;
  } catch (error) {
    console.error('Multi-provider analysis failed:', error);
    return [];
  }
}

async function detectBrandMentions(
  analysisResults: Array<{
    provider: string;
    response: string;
    mentions: number;
    context: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    visibility_score: number;
    execution_time: number;
    success: boolean;
  }>,
  brandName: string,
): Promise<
  Array<{
    text: string;
    brandName: string;
    confidence: number;
    context: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>
> {
  try {
    const allText = analysisResults.map((result) => result.response).join(' ');

    // Mock brand detection - replace with actual tool call
    const mockDetections = [
      {
        text: brandName,
        brandName,
        confidence: 0.95,
        context: 'Strong brand recognition in market analysis',
        sentiment: 'positive' as const,
      },
      {
        text: brandName,
        brandName,
        confidence: 0.88,
        context: 'Competitive positioning analysis',
        sentiment: 'positive' as const,
      },
    ];

    return mockDetections;
  } catch (error) {
    console.error('Brand detection failed:', error);
    return [];
  }
}

async function calculateVisibilityScores(
  brandName: string,
  competitors: Array<{
    name: string;
    description: string;
    confidence: number;
    businessModel: string;
  }>,
  brandDetectionResults: Array<{
    text: string;
    brandName: string;
    confidence: number;
    context: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>,
): Promise<{
  brandScore: number;
  competitorScores: Record<string, number>;
  shareOfVoice: number;
  competitivePosition: string;
  recommendations: string[];
}> {
  try {
    // Calculate brand score based on detection results
    const brandScore =
      brandDetectionResults.length > 0
        ? Math.round(
            (brandDetectionResults.reduce(
              (sum, result) => sum + result.confidence,
              0,
            ) /
              brandDetectionResults.length) *
              100,
          )
        : 50;

    // Mock competitor scores
    const competitorScores: Record<string, number> = {};
    competitors.forEach((competitor) => {
      competitorScores[competitor.name] = Math.floor(Math.random() * 40) + 60; // 60-100 range
    });

    // Calculate share of voice
    const totalMentions = brandDetectionResults.length;
    const totalCompetitorMentions = Object.values(competitorScores).reduce(
      (sum, score) => sum + score,
      0,
    );
    const shareOfVoice =
      totalMentions > 0
        ? Math.round(
            (totalMentions / (totalMentions + totalCompetitorMentions)) * 100,
          )
        : 0;

    // Determine competitive position
    let competitivePosition = 'Unknown';
    if (brandScore >= 80) competitivePosition = 'Market Leader';
    else if (brandScore >= 60) competitivePosition = 'Strong Competitor';
    else if (brandScore >= 40) competitivePosition = 'Emerging Player';
    else competitivePosition = 'Niche Player';

    // Generate recommendations
    const recommendations: string[] = [];
    if (brandScore < 70) {
      recommendations.push(
        'Increase brand visibility through content marketing',
      );
      recommendations.push('Focus on improving brand recognition');
    }
    if (shareOfVoice < 30) {
      recommendations.push('Develop strategies to increase share of voice');
      recommendations.push('Enhance competitive positioning');
    }
    if (recommendations.length === 0) {
      recommendations.push('Maintain current brand positioning');
      recommendations.push('Continue monitoring competitive landscape');
    }

    return {
      brandScore,
      competitorScores,
      shareOfVoice,
      competitivePosition,
      recommendations,
    };
  } catch (error) {
    console.error('Visibility scoring failed:', error);
    return {
      brandScore: 0,
      competitorScores: {},
      shareOfVoice: 0,
      competitivePosition: 'Unknown',
      recommendations: ['Analysis failed - please try again'],
    };
  }
}
