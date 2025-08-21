import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';

export interface MeaningfulChangeAnalysisResult {
  websiteUrl: string;
  businessContext: {
    industry?: string;
    businessType?: 'b2b' | 'b2c' | 'ecommerce' | 'saas' | 'other';
    keyMetrics?: string[];
    objectives?: string[];
  };
  meaningfulChanges: MeaningfulChange[];
  impactAnalysis: BusinessImpactAnalysis;
  insights: ActionableInsights;
  recommendations: Recommendations;
  trendAnalysis?: TrendAnalysis;
  aiConsensus: AIConsensus;
  metadata: {
    executionTime: number;
    category: 'meaningful-change-analysis';
    totalChanges: number;
    meaningfulChangesCount: number;
    impactThreshold: number;
    analysisDepth: string;
    success: boolean;
  };
}

export interface MeaningfulChange {
  changeId: string;
  originalChange: any;
  businessImpact: 'positive' | 'negative' | 'neutral' | 'mixed';
  impactScore: number;
  confidence: number;
  category:
    | 'pricing'
    | 'features'
    | 'content'
    | 'structure'
    | 'performance'
    | 'seo'
    | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  aiAnalysis: {
    summary: string;
    reasoning: string;
    providers: string[];
    consensus: number;
  };
  affectedMetrics: string[];
  recommendations: string[];
  trend: 'improving' | 'declining' | 'stable';
}

export interface BusinessImpactAnalysis {
  overallImpact: 'positive' | 'negative' | 'neutral' | 'mixed';
  impactScore: number;
  mostSignificantChanges: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    mitigation: string[];
  };
  opportunityAssessment: {
    level: 'low' | 'medium' | 'high' | 'excellent';
    opportunities: string[];
    actions: string[];
  };
}

export interface ActionableInsights {
  keyFindings: string[];
  patterns: string[];
  anomalies: string[];
  trends: string[];
  recommendations: Array<{
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    description: string;
    impact: number;
    effort: number;
    timeframe: string;
  }>;
}

export interface Recommendations {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  monitoring: string[];
  alerts: string[];
}

export interface TrendAnalysis {
  changeVelocity: number;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  patterns: string[];
  predictions: Array<{
    metric: string;
    prediction: string;
    confidence: number;
    timeframe: string;
  }>;
}

export interface AIConsensus {
  providers: string[];
  agreement: number;
  confidence: number;
  disagreements: string[];
}

export interface AIAnalysisResult {
  provider: string;
  result?: any;
  error?: string;
  success: boolean;
  analysis?: {
    businessImpact: string;
    impactScore: number;
    confidence: number;
    reasoning: string;
    category: string;
    priority: string;
    recommendations: string[];
  };
}

export const meaningfulChangeAnalysisTool = tool({
  description:
    'AI-powered meaningful change analysis with business impact assessment',
  inputSchema: z.object({
    changes: z.array(z.any()),
    websiteUrl: z.string().url(),
    businessContext: z
      .object({
        industry: z.string().optional(),
        businessType: z
          .enum(['b2b', 'b2c', 'ecommerce', 'saas', 'other'])
          .optional(),
        keyMetrics: z.array(z.string()).optional(),
        objectives: z.array(z.string()).optional(),
      })
      .optional(),
    analysisProviders: z
      .array(z.enum(['openai', 'claude', 'gemini', 'perplexity']))
      .optional(),
    impactThreshold: z.number().min(0).max(1).default(0.3),
    includeTrends: z.boolean().default(true),
    analysisDepth: z
      .enum(['basic', 'comprehensive', 'expert'])
      .default('comprehensive'),
  }),
  execute: async (args: any) => {
    const {
      changes,
      websiteUrl,
      businessContext,
      analysisProviders,
      impactThreshold,
      includeTrends,
      analysisDepth,
    } = args;

    const startTime = Date.now();

    try {
      console.log('Meaningful change analysis started with:', {
        changesCount: changes.length,
        websiteUrl,
        businessContext: !!businessContext,
        providers: analysisProviders || ['openai', 'claude', 'gemini'],
        impactThreshold,
        analysisDepth,
      });

      // Step 1: Filter and preprocess changes
      const filteredChanges = await filterRelevantChanges(
        changes,
        impactThreshold,
      );

      // Step 2: Analyze changes with multiple AI providers
      const aiAnalysisResults = await analyzeChangesWithAI(
        filteredChanges,
        websiteUrl,
        businessContext,
        analysisProviders || ['openai', 'claude', 'gemini'],
      );

      // Step 3: Determine business impact
      const impactAnalysis = await determineBusinessImpact(
        filteredChanges,
        aiAnalysisResults,
        businessContext,
      );

      // Step 4: Generate actionable insights
      const insights = await generateActionableInsights(
        impactAnalysis,
        businessContext,
        analysisDepth,
      );

      // Step 5: Categorize and prioritize changes
      const categorizedChanges = await categorizeChanges(
        filteredChanges,
        aiAnalysisResults,
        businessContext,
      );

      // Step 6: Analyze trends (if enabled)
      const trendAnalysis = includeTrends
        ? await analyzeChangeTrends(filteredChanges, websiteUrl)
        : undefined;

      // Step 7: Generate recommendations
      const recommendations = await generateRecommendations(
        insights,
        categorizedChanges,
        businessContext,
      );

      // Step 8: Calculate AI consensus
      const aiConsensus = calculateAIConsensus(aiAnalysisResults);

      const executionTime = Date.now() - startTime;

      return {
        websiteUrl,
        businessContext: businessContext || {},
        meaningfulChanges: categorizedChanges,
        impactAnalysis,
        insights,
        recommendations,
        trendAnalysis,
        aiConsensus,
        metadata: {
          executionTime,
          category: 'meaningful-change-analysis' as const,
          totalChanges: changes.length,
          meaningfulChangesCount: categorizedChanges.length,
          impactThreshold,
          analysisDepth,
          success: true,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      console.error('Meaningful change analysis error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        changesCount: changes.length,
        websiteUrl,
      });

      throw new Error(
        `Meaningful change analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  },
});

async function filterRelevantChanges(
  changes: any[],
  impactThreshold: number,
): Promise<any[]> {
  if (!changes || changes.length === 0) {
    return [];
  }

  // Filter changes based on impact threshold
  const filteredChanges = changes.filter((change) => {
    if (!change) return false;

    // Basic filtering criteria
    const hasValidSeverity =
      change.severity &&
      ['medium', 'high', 'critical'].includes(change.severity);

    const hasValidCategory =
      change.category && !['minor', 'cosmetic'].includes(change.category);

    const hasSignificantContent =
      change.description && change.description.length > 10;

    // Calculate basic impact score
    let impactScore = 0;

    // Severity contribution
    switch (change.severity) {
      case 'critical':
        impactScore += 0.4;
        break;
      case 'high':
        impactScore += 0.3;
        break;
      case 'medium':
        impactScore += 0.2;
        break;
      case 'low':
        impactScore += 0.1;
        break;
      default:
        impactScore += 0.05;
        break;
    }

    // Category contribution
    switch (change.category) {
      case 'pricing':
      case 'features':
        impactScore += 0.3;
        break;
      case 'structure':
      case 'seo':
        impactScore += 0.2;
        break;
      case 'content':
        impactScore += 0.15;
        break;
      case 'performance':
        impactScore += 0.1;
        break;
      default:
        impactScore += 0.05;
        break;
    }

    // Confidence contribution
    if (change.confidence) {
      impactScore *= change.confidence;
    }

    return (
      (hasValidSeverity || hasValidCategory || hasSignificantContent) &&
      impactScore >= impactThreshold
    );
  });

  console.log(
    `Filtered ${filteredChanges.length} relevant changes from ${changes.length} total changes`,
  );
  return filteredChanges;
}

async function analyzeChangesWithAI(
  changes: any[],
  websiteUrl: string,
  businessContext: any,
  providers: string[],
): Promise<AIAnalysisResult[]> {
  if (!changes || changes.length === 0) {
    return [];
  }

  const analysisPromises = providers.map(async (provider) => {
    try {
      const prompt = generateAnalysisPrompt(
        changes,
        websiteUrl,
        businessContext,
      );
      const result = await queryAIProvider(provider, prompt);

      return {
        provider,
        result,
        success: true,
        analysis: parseAIResponse(result, provider),
      };
    } catch (error) {
      console.warn(`AI analysis failed for provider ${provider}:`, error);
      return {
        provider,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      };
    }
  });

  const results = await Promise.all(analysisPromises);
  console.log(
    `AI analysis completed. Successful: ${results.filter((r) => r.success).length}/${results.length}`,
  );

  return results;
}

function generateAnalysisPrompt(
  changes: any[],
  websiteUrl: string,
  businessContext: any,
): string {
  const contextInfo = businessContext
    ? `
Business Context:
- Industry: ${businessContext.industry || 'Not specified'}
- Business Type: ${businessContext.businessType || 'Not specified'}
- Key Metrics: ${businessContext.keyMetrics?.join(', ') || 'Not specified'}
- Objectives: ${businessContext.objectives?.join(', ') || 'Not specified'}
`
    : '';

  const changesInfo = changes
    .map(
      (change, index) => `
Change ${index + 1}:
- Type: ${change.type || 'Unknown'}
- Category: ${change.category || 'Unknown'}
- Severity: ${change.severity || 'Unknown'}
- Description: ${change.description || 'No description'}
- Path: ${change.path || 'Unknown'}
- Impact: ${change.impact || 'Unknown'}
`,
    )
    .join('\n');

  return `Analyze the following website changes for business impact:

Website: ${websiteUrl}
${contextInfo}

Changes to analyze:
${changesInfo}

Please provide a comprehensive business impact analysis including:
1. Overall business impact (positive/negative/neutral/mixed)
2. Impact score (0-1, where 1 is highest impact)
3. Confidence level (0-1)
4. Detailed reasoning for the assessment
5. Change category (pricing/features/content/structure/performance/seo/other)
6. Priority level (low/medium/high/critical)
7. Specific recommendations for each change
8. Potential risks and opportunities
9. Affected business metrics
10. Recommended monitoring and alerts

Format your response as a structured analysis that can be parsed programmatically.`;
}

async function queryAIProvider(provider: string, prompt: string): Promise<any> {
  const maxRetries = 2;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      let model: any;

      switch (provider) {
        case 'openai':
          model = openai('gpt-4o');
          break;
        case 'claude':
          model = anthropic('claude-3-5-sonnet-20241022');
          break;
        case 'gemini':
          model = google('gemini-1.5-pro');
          break;
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }

      const result = await generateText({
        model,
        prompt,
        maxTokens: 4000,
        temperature: 0.3,
      });

      return result.text;
    } catch (error) {
      attempt++;
      console.warn(`AI provider ${provider} attempt ${attempt} failed:`, error);

      if (attempt >= maxRetries) {
        throw error;
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

function parseAIResponse(response: string, provider: string): any {
  try {
    // Try to extract structured information from the response
    const analysis = {
      businessImpact: extractBusinessImpact(response),
      impactScore: extractImpactScore(response),
      confidence: extractConfidence(response),
      reasoning: extractReasoning(response),
      category: extractCategory(response),
      priority: extractPriority(response),
      recommendations: extractRecommendations(response),
    };

    return analysis;
  } catch (error) {
    console.warn(`Failed to parse AI response from ${provider}:`, error);
    return {
      businessImpact: 'neutral',
      impactScore: 0.5,
      confidence: 0.3,
      reasoning: `${response.substring(0, 500)}...`,
      category: 'other',
      priority: 'medium',
      recommendations: ['Review changes manually'],
    };
  }
}

function extractBusinessImpact(response: string): string {
  const impactMatch = response
    .toLowerCase()
    .match(/impact[:\s]*(?:is\s+)?(positive|negative|neutral|mixed)/);
  return impactMatch?.[1] || 'neutral';
}

function extractImpactScore(response: string): number {
  const scoreMatch = response.match(/(?:impact\s+)?score[:\s]*(\d*\.?\d+)/i);
  if (scoreMatch) {
    const score = Number.parseFloat(scoreMatch[1]);
    return Math.max(0, Math.min(1, score));
  }
  return 0.5;
}

function extractConfidence(response: string): number {
  const confidenceMatch = response.match(/confidence[:\s]*(\d*\.?\d+)/i);
  if (confidenceMatch) {
    const confidence = Number.parseFloat(confidenceMatch[1]);
    return Math.max(0, Math.min(1, confidence));
  }
  return 0.7;
}

function extractReasoning(response: string): string {
  const reasoningMatch = response.match(
    /reasoning[:\s]*([^.\n]*(?:\.[^.\n]*)*)/i,
  );
  return reasoningMatch?.[1]?.trim() || `${response.substring(0, 200)}...`;
}

function extractCategory(response: string): string {
  const categoryMatch = response
    .toLowerCase()
    .match(
      /category[:\s]*(?:is\s+)?(pricing|features|content|structure|performance|seo|other)/,
    );
  return categoryMatch?.[1] || 'other';
}

function extractPriority(response: string): string {
  const priorityMatch = response
    .toLowerCase()
    .match(/priority[:\s]*(?:is\s+)?(low|medium|high|critical)/);
  return priorityMatch?.[1] || 'medium';
}

function extractRecommendations(response: string): string[] {
  const recommendationsSection = response.match(
    /recommendations?[:\s]*([^#]*?)(?:#|$)/is,
  );
  if (recommendationsSection) {
    const recommendations = recommendationsSection[1]
      .split(/[-•\n]/)
      .map((r) => r.trim())
      .filter((r) => r.length > 10);
    return recommendations.slice(0, 5);
  }
  return ['Monitor changes closely', 'Review impact on key metrics'];
}

async function determineBusinessImpact(
  changes: any[],
  aiResults: AIAnalysisResult[],
  businessContext: any,
): Promise<BusinessImpactAnalysis> {
  const successfulResults = aiResults.filter((r) => r.success && r.analysis);

  if (successfulResults.length === 0) {
    return {
      overallImpact: 'neutral',
      impactScore: 0.5,
      mostSignificantChanges: changes.map((c) => c.id || 'unknown').slice(0, 3),
      riskAssessment: {
        level: 'medium',
        factors: ['Limited AI analysis available'],
        mitigation: ['Manual review recommended'],
      },
      opportunityAssessment: {
        level: 'medium',
        opportunities: ['Potential for improvement'],
        actions: ['Conduct detailed analysis'],
      },
    };
  }

  // Aggregate AI analysis results
  const impactScores = successfulResults.map(
    (r) => r.analysis?.impactScore || 0.5,
  );
  const avgImpactScore =
    impactScores.reduce((sum, score) => sum + score, 0) / impactScores.length;

  const impactDirections = successfulResults.map(
    (r) => r.analysis?.businessImpact || 'neutral',
  );
  const overallImpact = determineOverallImpact(impactDirections);

  const mostSignificantChanges = identifyMostSignificantChanges(
    changes,
    successfulResults,
  );

  const riskAssessment = assessRisks(
    changes,
    successfulResults,
    businessContext,
  );
  const opportunityAssessment = assessOpportunities(
    changes,
    successfulResults,
    businessContext,
  );

  return {
    overallImpact,
    impactScore: avgImpactScore,
    mostSignificantChanges,
    riskAssessment,
    opportunityAssessment,
  };
}

function determineOverallImpact(
  impactDirections: string[],
): 'positive' | 'negative' | 'neutral' | 'mixed' {
  const positive = impactDirections.filter((i) => i === 'positive').length;
  const negative = impactDirections.filter((i) => i === 'negative').length;
  const neutral = impactDirections.filter((i) => i === 'neutral').length;

  if (positive > negative && positive > neutral) return 'positive';
  if (negative > positive && negative > neutral) return 'negative';
  if (positive > 0 && negative > 0) return 'mixed';
  return 'neutral';
}

function identifyMostSignificantChanges(
  changes: any[],
  aiResults: AIAnalysisResult[],
): string[] {
  const changeScores = changes.map((change, index) => {
    const relevantAnalysis = aiResults.filter((r) => r.success && r.analysis);
    const avgScore =
      relevantAnalysis.length > 0
        ? relevantAnalysis.reduce(
            (sum, r) => sum + (r.analysis?.impactScore || 0),
            0,
          ) / relevantAnalysis.length
        : 0.5;

    return { id: change.id || `change-${index}`, score: avgScore };
  });

  return changeScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((c) => c.id);
}

function assessRisks(
  changes: any[],
  aiResults: AIAnalysisResult[],
  businessContext: any,
): { level: string; factors: string[]; mitigation: string[] } {
  const negativeChanges = changes.filter(
    (c) =>
      c.severity === 'critical' ||
      c.severity === 'high' ||
      aiResults.some((r) => r.analysis?.businessImpact === 'negative'),
  );

  const riskLevel =
    negativeChanges.length > 3
      ? 'critical'
      : negativeChanges.length > 1
        ? 'high'
        : negativeChanges.length > 0
          ? 'medium'
          : 'low';

  const factors = [
    ...(negativeChanges.length > 0
      ? ['High-impact negative changes detected']
      : []),
    ...(changes.some((c) => c.category === 'pricing')
      ? ['Pricing changes may affect revenue']
      : []),
    ...(changes.some((c) => c.category === 'performance')
      ? ['Performance changes may affect user experience']
      : []),
  ];

  const mitigation = [
    'Monitor key business metrics closely',
    'Implement gradual rollback if needed',
    'Set up alerts for critical thresholds',
    'Conduct A/B testing for major changes',
  ];

  return { level: riskLevel, factors, mitigation };
}

function assessOpportunities(
  changes: any[],
  aiResults: AIAnalysisResult[],
  businessContext: any,
): any {
  const positiveChanges = changes.filter((c) =>
    aiResults.some((r) => r.analysis?.businessImpact === 'positive'),
  );

  const opportunityLevel =
    positiveChanges.length > 2
      ? 'excellent'
      : positiveChanges.length > 1
        ? 'high'
        : positiveChanges.length > 0
          ? 'medium'
          : 'low';

  const opportunities = [
    ...(positiveChanges.some((c) => c.category === 'features')
      ? ['New features may improve user engagement']
      : []),
    ...(positiveChanges.some((c) => c.category === 'seo')
      ? ['SEO improvements may increase organic traffic']
      : []),
    ...(positiveChanges.some((c) => c.category === 'performance')
      ? ['Performance improvements may boost conversions']
      : []),
  ];

  const actions = [
    'Track conversion rate improvements',
    'Monitor user engagement metrics',
    'Measure SEO ranking changes',
    'Analyze customer feedback',
  ];

  return { level: opportunityLevel, opportunities, actions };
}

async function generateActionableInsights(
  impactAnalysis: BusinessImpactAnalysis,
  businessContext: any,
  analysisDepth: string,
): Promise<ActionableInsights> {
  const insights: ActionableInsights = {
    keyFindings: [],
    patterns: [],
    anomalies: [],
    trends: [],
    recommendations: [],
  };

  // Generate key findings
  insights.keyFindings = [
    `Overall business impact: ${impactAnalysis.overallImpact} (score: ${impactAnalysis.impactScore.toFixed(2)})`,
    `Risk level: ${impactAnalysis.riskAssessment.level}`,
    `Opportunity level: ${impactAnalysis.opportunityAssessment.level}`,
    `Most significant changes: ${impactAnalysis.mostSignificantChanges.slice(0, 3).join(', ')}`,
  ];

  // Identify patterns
  insights.patterns = [
    ...(impactAnalysis.riskAssessment.level === 'high'
      ? ['Multiple high-risk changes detected']
      : []),
    ...(impactAnalysis.opportunityAssessment.level === 'high'
      ? ['Multiple opportunities for improvement']
      : []),
  ];

  // Detect anomalies
  insights.anomalies = [
    ...(impactAnalysis.impactScore > 0.8
      ? ['Unusually high impact changes detected']
      : []),
    ...(impactAnalysis.impactScore < 0.2
      ? ['Minimal impact changes - may indicate maintenance updates']
      : []),
  ];

  // Analyze trends
  insights.trends = [
    impactAnalysis.overallImpact === 'positive'
      ? 'Positive trend in website improvements'
      : impactAnalysis.overallImpact === 'negative'
        ? 'Concerning trend in website changes'
        : 'Stable website evolution pattern',
  ];

  // Generate recommendations based on analysis depth
  const baseRecommendations = [
    {
      priority: 'high' as const,
      category: 'Monitoring',
      description: 'Set up alerts for key business metrics',
      impact: 0.8,
      effort: 0.3,
      timeframe: 'Immediate',
    },
    {
      priority: 'medium' as const,
      category: 'Analysis',
      description: 'Review changes in detail with stakeholders',
      impact: 0.6,
      effort: 0.5,
      timeframe: '1-2 days',
    },
  ];

  if (analysisDepth === 'expert') {
    baseRecommendations.push({
      priority: 'medium' as const,
      category: 'Testing',
      description: 'Implement A/B testing for significant changes',
      impact: 0.7,
      effort: 0.7,
      timeframe: '1 week',
    });
  }

  insights.recommendations = baseRecommendations;

  return insights;
}

async function categorizeChanges(
  filteredChanges: any[],
  aiResults: AIAnalysisResult[],
  businessContext: any,
): Promise<MeaningfulChange[]> {
  return filteredChanges.map((change, index) => {
    const relevantAnalysis = aiResults.filter((r) => r.success && r.analysis);

    const avgImpactScore =
      relevantAnalysis.length > 0
        ? relevantAnalysis.reduce(
            (sum, r) => sum + (r.analysis?.impactScore || 0.5),
            0,
          ) / relevantAnalysis.length
        : 0.5;

    const avgConfidence =
      relevantAnalysis.length > 0
        ? relevantAnalysis.reduce(
            (sum, r) => sum + (r.analysis?.confidence || 0.7),
            0,
          ) / relevantAnalysis.length
        : 0.7;

    const businessImpact =
      relevantAnalysis.length > 0
        ? determineOverallImpact(
            relevantAnalysis.map(
              (r) => r.analysis?.businessImpact || 'neutral',
            ),
          )
        : ('neutral' as const);

    const category =
      relevantAnalysis.length > 0
        ? (relevantAnalysis[0].analysis?.category as any) || 'other'
        : categorizeChangeByContent(change);

    const priority =
      relevantAnalysis.length > 0
        ? (relevantAnalysis[0].analysis?.priority as any) || 'medium'
        : determinePriorityFromSeverity(change.severity);

    const aiAnalysis = {
      summary: generateChangeSummary(change, relevantAnalysis),
      reasoning:
        relevantAnalysis[0]?.analysis?.reasoning ||
        'Limited analysis available',
      providers: relevantAnalysis.map((r) => r.provider),
      consensus: calculateConsensus(relevantAnalysis),
    };

    const affectedMetrics = identifyAffectedMetrics(change, businessContext);
    const recommendations = generateChangeRecommendations(
      change,
      relevantAnalysis,
      businessContext,
    );
    const trend = determineTrend(change, avgImpactScore);

    return {
      changeId: change.id || `change-${index}`,
      originalChange: change,
      businessImpact,
      impactScore: avgImpactScore,
      confidence: avgConfidence,
      category,
      priority,
      aiAnalysis,
      affectedMetrics,
      recommendations,
      trend,
    };
  });
}

function categorizeChangeByContent(change: any): string {
  const description = (change.description || '').toLowerCase();
  const path = (change.path || '').toLowerCase();

  if (
    description.includes('price') ||
    description.includes('cost') ||
    path.includes('pricing')
  ) {
    return 'pricing';
  }
  if (
    description.includes('feature') ||
    description.includes('function') ||
    path.includes('features')
  ) {
    return 'features';
  }
  if (
    description.includes('seo') ||
    description.includes('meta') ||
    path.includes('title')
  ) {
    return 'seo';
  }
  if (description.includes('performance') || description.includes('speed')) {
    return 'performance';
  }
  if (description.includes('structure') || description.includes('layout')) {
    return 'structure';
  }
  if (description.includes('content') || description.includes('text')) {
    return 'content';
  }

  return 'other';
}

function determinePriorityFromSeverity(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    case 'low':
      return 'low';
    default:
      return 'medium';
  }
}

function generateChangeSummary(
  change: any,
  aiResults: AIAnalysisResult[],
): string {
  if (aiResults.length > 0 && aiResults[0].analysis?.reasoning) {
    return `${aiResults[0].analysis.reasoning.substring(0, 150)}...`;
  }

  return `${`${change.type || 'Change'} detected in ${change.category || 'unknown'} area: ${change.description || 'No description'}`.substring(0, 147)}...`;
}

function calculateConsensus(aiResults: AIAnalysisResult[]): number {
  if (aiResults.length < 2) return 1.0;

  const impacts = aiResults.map((r) => r.analysis?.businessImpact || 'neutral');
  const priorities = aiResults.map((r) => r.analysis?.priority || 'medium');

  const impactAgreement =
    impacts.filter((i) => i === impacts[0]).length / impacts.length;
  const priorityAgreement =
    priorities.filter((p) => p === priorities[0]).length / priorities.length;

  return (impactAgreement + priorityAgreement) / 2;
}

function identifyAffectedMetrics(change: any, businessContext: any): string[] {
  const metrics: string[] = [];

  // Default metrics based on change category
  switch (change.category) {
    case 'pricing':
      metrics.push('revenue', 'conversion_rate', 'customer_acquisition_cost');
      break;
    case 'features':
      metrics.push('user_engagement', 'feature_adoption', 'user_satisfaction');
      break;
    case 'performance':
      metrics.push('page_load_time', 'bounce_rate', 'conversion_rate');
      break;
    case 'seo':
      metrics.push('organic_traffic', 'search_rankings', 'click_through_rate');
      break;
    case 'content':
      metrics.push('time_on_page', 'engagement_rate', 'content_views');
      break;
    default:
      metrics.push('user_experience', 'page_views');
  }

  // Add business context metrics
  if (businessContext?.keyMetrics) {
    metrics.push(
      ...businessContext.keyMetrics.filter((m: string) => !metrics.includes(m)),
    );
  }

  return metrics.slice(0, 5);
}

function generateChangeRecommendations(
  change: any,
  aiResults: AIAnalysisResult[],
  businessContext: any,
): string[] {
  const recommendations: string[] = [];

  // AI-generated recommendations
  if (aiResults.length > 0 && aiResults[0].analysis?.recommendations) {
    recommendations.push(...aiResults[0].analysis.recommendations);
  }

  // Category-specific recommendations
  switch (change.category) {
    case 'pricing':
      recommendations.push(
        'Monitor conversion rates closely',
        'Track customer feedback',
      );
      break;
    case 'features':
      recommendations.push(
        'Measure feature adoption rates',
        'Collect user feedback',
      );
      break;
    case 'performance':
      recommendations.push('Monitor page load times', 'Track bounce rates');
      break;
    case 'seo':
      recommendations.push('Monitor search rankings', 'Track organic traffic');
      break;
  }

  // Severity-based recommendations
  if (change.severity === 'critical' || change.severity === 'high') {
    recommendations.push(
      'Implement immediate monitoring',
      'Prepare rollback plan',
    );
  }

  return recommendations
    .filter((r, i, arr) => arr.indexOf(r) === i)
    .slice(0, 5);
}

function determineTrend(
  change: any,
  impactScore: number,
): 'improving' | 'declining' | 'stable' {
  if (impactScore > 0.7) return 'improving';
  if (impactScore < 0.3) return 'declining';
  return 'stable';
}

async function analyzeChangeTrends(
  changes: any[],
  websiteUrl: string,
): Promise<TrendAnalysis> {
  const totalChanges = changes.length;
  const timeSpan = calculateTimeSpan(changes);
  const changeVelocity = timeSpan > 0 ? totalChanges / timeSpan : 0;

  const severityTrend = analyzeSeverityTrend(changes);
  const categoryTrend = analyzeCategoryTrend(changes);

  const trendDirection = determineOverallTrendDirection(changes);

  const patterns = [
    ...(severityTrend ? [severityTrend] : []),
    ...(categoryTrend ? [categoryTrend] : []),
  ];

  const predictions = generatePredictions(changes, changeVelocity);

  return {
    changeVelocity,
    trendDirection,
    patterns,
    predictions,
  };
}

function calculateTimeSpan(changes: any[]): number {
  const timestamps = changes
    .map((c) => (c.timestamp ? new Date(c.timestamp).getTime() : Date.now()))
    .filter((t) => !Number.isNaN(t));

  if (timestamps.length < 2) return 1;

  const maxTime = Math.max(...timestamps);
  const minTime = Math.min(...timestamps);

  return (maxTime - minTime) / (1000 * 60 * 60); // hours
}

function analyzeSeverityTrend(changes: any[]): string | null {
  const criticalCount = changes.filter((c) => c.severity === 'critical').length;
  const highCount = changes.filter((c) => c.severity === 'high').length;

  if (criticalCount > changes.length * 0.3) {
    return 'High frequency of critical changes detected';
  }
  if (highCount > changes.length * 0.5) {
    return 'Increasing severity in website changes';
  }

  return null;
}

function analyzeCategoryTrend(changes: any[]): string | null {
  const categories = changes.map((c) => c.category).filter(Boolean);
  const categoryCount = categories.reduce(
    (acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const dominantCategory = Object.entries(categoryCount).sort(
    ([, a], [, b]) => b - a,
  )[0];

  if (dominantCategory && dominantCategory[1] > changes.length * 0.4) {
    return `Frequent ${dominantCategory[0]} changes observed`;
  }

  return null;
}

function determineOverallTrendDirection(
  changes: any[],
): 'increasing' | 'decreasing' | 'stable' {
  const recentChanges = changes.slice(-Math.ceil(changes.length / 2));
  const earlierChanges = changes.slice(0, Math.floor(changes.length / 2));

  const recentSeverityScore = calculateAverageSeverityScore(recentChanges);
  const earlierSeverityScore = calculateAverageSeverityScore(earlierChanges);

  if (recentSeverityScore > earlierSeverityScore * 1.2) return 'increasing';
  if (recentSeverityScore < earlierSeverityScore * 0.8) return 'decreasing';
  return 'stable';
}

function calculateAverageSeverityScore(changes: any[]): number {
  if (changes.length === 0) return 0;

  const scores = changes.map((c) => {
    switch (c.severity) {
      case 'critical':
        return 4;
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
      default:
        return 0;
    }
  });

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function generatePredictions(
  changes: any[],
  changeVelocity: number,
): Array<{
  metric: string;
  prediction: string;
  confidence: number;
  timeframe: string;
}> {
  const predictions = [];

  if (changeVelocity > 5) {
    predictions.push({
      metric: 'change_frequency',
      prediction: 'High change frequency may continue',
      confidence: 0.7,
      timeframe: '1 week',
    });
  }

  const criticalChanges = changes.filter((c) => c.severity === 'critical');
  if (criticalChanges.length > 0) {
    predictions.push({
      metric: 'system_stability',
      prediction: 'Monitor for system stability issues',
      confidence: 0.8,
      timeframe: '48 hours',
    });
  }

  return predictions;
}

async function generateRecommendations(
  insights: ActionableInsights,
  categorizedChanges: MeaningfulChange[],
  businessContext: any,
): Promise<Recommendations> {
  const immediate: string[] = [];
  const shortTerm: string[] = [];
  const longTerm: string[] = [];
  const monitoring: string[] = [];
  const alerts: string[] = [];

  // Immediate actions based on critical/high priority changes
  const criticalChanges = categorizedChanges.filter(
    (c) => c.priority === 'critical',
  );
  const highPriorityChanges = categorizedChanges.filter(
    (c) => c.priority === 'high',
  );

  if (criticalChanges.length > 0) {
    immediate.push('Review critical changes immediately');
    immediate.push('Implement emergency monitoring');
    alerts.push('Set up critical change alerts');
  }

  if (highPriorityChanges.length > 0) {
    immediate.push('Analyze high-priority changes within 24 hours');
    monitoring.push('Monitor key business metrics hourly');
  }

  // Short-term actions
  shortTerm.push('Conduct comprehensive impact review');
  shortTerm.push('Update monitoring dashboards');

  // Long-term actions
  longTerm.push('Implement automated change detection');
  longTerm.push('Develop change management process');

  // Monitoring recommendations
  monitoring.push('Track conversion rates daily');
  monitoring.push('Monitor user engagement metrics');

  // Alert recommendations
  alerts.push('Set thresholds for key metrics');
  alerts.push('Configure notification channels');

  return {
    immediate: immediate.slice(0, 5),
    shortTerm: shortTerm.slice(0, 5),
    longTerm: longTerm.slice(0, 5),
    monitoring: monitoring.slice(0, 5),
    alerts: alerts.slice(0, 5),
  };
}

function calculateAIConsensus(aiResults: AIAnalysisResult[]): AIConsensus {
  const successfulResults = aiResults.filter((r) => r.success && r.analysis);

  if (successfulResults.length === 0) {
    return {
      providers: aiResults.map((r) => r.provider),
      agreement: 0,
      confidence: 0,
      disagreements: ['No successful AI analysis available'],
    };
  }

  const providers = successfulResults.map((r) => r.provider);

  // Calculate agreement on business impact
  const impacts = successfulResults.map(
    (r) => r.analysis?.businessImpact || 'neutral',
  );
  const impactAgreement =
    impacts.filter((i) => i === impacts[0]).length / impacts.length;

  // Calculate agreement on priority
  const priorities = successfulResults.map(
    (r) => r.analysis?.priority || 'medium',
  );
  const priorityAgreement =
    priorities.filter((p) => p === priorities[0]).length / priorities.length;

  const overallAgreement = (impactAgreement + priorityAgreement) / 2;

  // Calculate average confidence
  const confidences = successfulResults.map(
    (r) => r.analysis?.confidence || 0.5,
  );
  const avgConfidence =
    confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;

  // Identify disagreements
  const disagreements: string[] = [];
  if (impactAgreement < 0.8) {
    disagreements.push(
      `Business impact assessment varies: ${[...new Set(impacts)].join(', ')}`,
    );
  }
  if (priorityAgreement < 0.8) {
    disagreements.push(
      `Priority levels differ: ${[...new Set(priorities)].join(', ')}`,
    );
  }

  return {
    providers,
    agreement: overallAgreement,
    confidence: avgConfidence,
    disagreements,
  };
}
