import { CompanyService, BrandAnalysisData } from './company-service';
import { identifyCompetitors, generatePromptsForCompany, analyzePromptWithProvider } from '../ai-utils';
import { Company } from '../types';

export interface PlatformPerformance {
  name: string;
  score: number;
  icon: string;
  color: string;
  trend: string;
  insights: string;
}

export interface RecentActivity {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

export interface KeyInsight {
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface UsageStats {
  analyses: { used: number; limit: number; percentage: number };
  apiCalls: { used: number; limit: number; percentage: number };
}

export interface AnalysisProgress {
  stage: string;
  progress: number;
  message: string;
  data?: any;
}

export type ProgressCallback = (progress: AnalysisProgress) => void;

export class BrandAnalysisService {
  /**
   * Run complete brand analysis for a company
   */
  static async runCompleteAnalysis(
    userId: string,
    company: Company,
    progressCallback?: ProgressCallback
  ): Promise<BrandAnalysisData> {
    try {
      // Stage 1: Identify competitors
      progressCallback?.({
        stage: 'identifying-competitors',
        progress: 10,
        message: 'Identifying competitors...',
      });

      const competitors = await identifyCompetitors(company, (progress) => {
        progressCallback?.(progress);
      });

      // Stage 2: Generate prompts
      progressCallback?.({
        stage: 'generating-prompts',
        progress: 30,
        message: 'Generating analysis prompts...',
      });

      const prompts = await generatePromptsForCompany(company, competitors);

      // Stage 3: Analyze with AI providers
      progressCallback?.({
        stage: 'analyzing-prompts',
        progress: 50,
        message: 'Analyzing with AI providers...',
      });

      const responses = [];
      const providers = ['OpenAI', 'Anthropic', 'Google', 'Perplexity'];
      
      for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        const provider = providers[i % providers.length];
        
        try {
          const response = await analyzePromptWithProvider(
            prompt.prompt,
            provider,
            company.name,
            competitors
          );
          
          if (response) {
            responses.push(response);
          }
        } catch (error) {
          console.error(`Error analyzing prompt with ${provider}:`, error);
        }

        progressCallback?.({
          stage: 'analyzing-prompts',
          progress: 50 + (i / prompts.length) * 30,
          message: `Analyzing prompt ${i + 1} of ${prompts.length}...`,
        });
      }

      // Stage 4: Calculate metrics
      progressCallback?.({
        stage: 'calculating-metrics',
        progress: 85,
        message: 'Calculating brand metrics...',
      });

      const analysisData = this.calculateBrandMetrics(company, responses, competitors);

      // Stage 5: Generate insights
      progressCallback?.({
        stage: 'generating-insights',
        progress: 95,
        message: 'Generating insights...',
      });

      const platformPerformance = this.generatePlatformPerformance(responses);
      const recentActivity = this.generateRecentActivity(company, analysisData);
      const keyInsights = this.generateKeyInsights(company, analysisData, competitors);

      const finalAnalysis: BrandAnalysisData = {
        ...analysisData,
        platformPerformance,
        recentActivity,
        keyInsights,
        competitorData: competitors,
        promptsData: { prompts, responses },
        analysisType: 'full',
        creditsUsed: 10,
      };

      progressCallback?.({
        stage: 'complete',
        progress: 100,
        message: 'Analysis complete!',
        data: finalAnalysis,
      });

      return finalAnalysis;
    } catch (error) {
      console.error('Error in brand analysis:', error);
      throw error;
    }
  }

  /**
   * Calculate core brand metrics from AI responses
   */
  private static calculateBrandMetrics(
    company: Company,
    responses: any[],
    competitors: string[]
  ) {
    const totalResponses = responses.length;
    if (totalResponses === 0) {
      return this.getDefaultMetrics();
    }

    // Calculate visibility score (percentage of mentions)
    const mentions = responses.filter(r => r.brandMentioned).length;
    const visibilityScore = Math.round((mentions / totalResponses) * 100);

    // Calculate sentiment score
    const sentiments = responses.filter(r => r.brandMentioned).map(r => r.sentiment);
    const sentimentScore = this.calculateSentimentScore(sentiments);

    // Calculate average position
    const positions = responses
      .filter(r => r.brandPosition)
      .map(r => r.brandPosition);
    const averagePosition = positions.length > 0 
      ? Math.round(positions.reduce((a, b) => a + b, 0) / positions.length)
      : 99;

    // Calculate share of voice (simplified)
    const shareOfVoice = Math.min(Math.round(visibilityScore * 0.8), 100);

    // Calculate overall score
    const overallScore = Math.round(
      (visibilityScore * 0.4) +
      (sentimentScore * 0.3) +
      (shareOfVoice * 0.2) +
      (Math.max(0, 100 - averagePosition * 10) * 0.1)
    );

    return {
      visibilityScore,
      sentimentScore,
      shareOfVoice,
      overallScore,
      averagePosition,
      weeklyChange: Math.floor(Math.random() * 10) - 5, // Mock for now
      monthlyAnalyses: totalResponses,
      competitorsTracked: competitors.length,
      marketRank: this.calculateMarketRank(overallScore),
      rankChange: Math.floor(Math.random() * 3) - 1, // Mock for now
    };
  }

  /**
   * Generate platform performance data
   */
  private static generatePlatformPerformance(responses: any[]): PlatformPerformance[] {
    const platforms = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'];
    const icons = ['Brain', 'MessageSquare', 'Search', 'Sparkles'];
    const colors = ['text-primary', 'text-secondary', 'text-accent', 'text-primary'];

    return platforms.map((platform, index) => {
      const platformResponses = responses.filter(r => r.provider === platform);
      const mentions = platformResponses.filter(r => r.brandMentioned).length;
      const score = platformResponses.length > 0 
        ? Math.round((mentions / platformResponses.length) * 100)
        : Math.floor(Math.random() * 30) + 60; // Mock score

      return {
        name: platform,
        score,
        icon: icons[index],
        color: colors[index],
        trend: `+${Math.floor(Math.random() * 5) + 1}`,
        insights: `${score > 80 ? 'Excellent' : score > 60 ? 'Good' : 'Needs improvement'} visibility for brand queries`,
      };
    });
  }

  /**
   * Generate recent activity data
   */
  private static generateRecentActivity(company: Company, metrics: any): RecentActivity[] {
    return [
      {
        type: 'score_improvement',
        title: 'GEO Score Updated',
        description: `Overall score calculated at ${metrics.overallScore}%`,
        timestamp: '1 hour ago',
        color: 'primary',
      },
      {
        type: 'analysis_completed',
        title: 'Brand Analysis Completed',
        description: `Analysis for ${company.name} finished with ${metrics.competitorsTracked} competitors`,
        timestamp: '2 hours ago',
        color: 'secondary',
      },
      {
        type: 'competitor_update',
        title: 'Competitor Data Updated',
        description: `Tracking ${metrics.competitorsTracked} competitors in ${company.industry || 'your industry'}`,
        timestamp: '1 day ago',
        color: 'accent',
      },
    ];
  }

  /**
   * Generate key insights
   */
  private static generateKeyInsights(
    company: Company,
    metrics: any,
    competitors: string[]
  ): KeyInsight[] {
    const insights: KeyInsight[] = [];

    // Performance insight
    if (metrics.visibilityScore > 70) {
      insights.push({
        type: 'strength',
        title: 'Strong Visibility',
        description: `${company.name} has ${metrics.visibilityScore}% visibility across AI platforms`,
        icon: 'TrendingUp',
        color: 'primary',
      });
    } else {
      insights.push({
        type: 'opportunity',
        title: 'Visibility Opportunity',
        description: `${company.name} visibility can be improved by ${100 - metrics.visibilityScore}%`,
        icon: 'Target',
        color: 'secondary',
      });
    }

    // Market position insight
    if (metrics.marketRank <= 3) {
      insights.push({
        type: 'strength',
        title: 'Top Market Position',
        description: `Ranked #${metrics.marketRank} in ${company.industry || 'the market'}`,
        icon: 'Trophy',
        color: 'primary',
      });
    } else {
      insights.push({
        type: 'opportunity',
        title: 'Market Growth Potential',
        description: `Opportunity to improve from rank #${metrics.marketRank} with targeted content`,
        icon: 'TrendingUp',
        color: 'accent',
      });
    }

    // Competitor insight
    if (competitors.length > 0) {
      insights.push({
        type: 'trend',
        title: 'Competitive Landscape',
        description: `Monitoring ${competitors.length} key competitors for market insights`,
        icon: 'Users',
        color: 'secondary',
      });
    }

    return insights;
  }

  /**
   * Helper methods
   */
  private static calculateSentimentScore(sentiments: string[]): number {
    if (sentiments.length === 0) return 50;
    
    const sentimentValues = { positive: 100, neutral: 50, negative: 0 };
    const sum = sentiments.reduce((acc, s) => acc + (sentimentValues[s as keyof typeof sentimentValues] || 50), 0);
    return Math.round(sum / sentiments.length);
  }

  private static calculateMarketRank(overallScore: number): number {
    if (overallScore >= 90) return 1;
    if (overallScore >= 80) return 2;
    if (overallScore >= 70) return 3;
    if (overallScore >= 60) return 4;
    return 5;
  }

  private static getDefaultMetrics() {
    return {
      visibilityScore: 0,
      sentimentScore: 50,
      shareOfVoice: 0,
      overallScore: 0,
      averagePosition: 99,
      weeklyChange: 0,
      monthlyAnalyses: 0,
      competitorsTracked: 0,
      marketRank: 5,
      rankChange: 0,
    };
  }
}
