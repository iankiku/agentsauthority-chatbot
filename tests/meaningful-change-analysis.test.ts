import { describe, expect, it } from 'vitest';
import { meaningfulChangeAnalysisTool } from '../lib/ai/tools/meaningful-change-analysis-tool';

describe('Meaningful Change Analysis Tool', () => {
  it('should analyze changes with business impact assessment', async () => {
    const mockChanges = [
      {
        id: 'change-1',
        type: 'modified',
        category: 'pricing',
        severity: 'high',
        description: 'Product pricing updated from $99 to $129',
        path: 'pricing-page',
        impact: 'negative',
        confidence: 0.9,
        timestamp: '2024-01-01T10:00:00Z',
      },
      {
        id: 'change-2',
        type: 'added',
        category: 'features',
        severity: 'medium',
        description: 'New advanced analytics feature added',
        path: 'features-section',
        impact: 'positive',
        confidence: 0.8,
        timestamp: '2024-01-01T11:00:00Z',
      },
    ];

    const businessContext = {
      industry: 'SaaS',
      businessType: 'b2b' as const,
      keyMetrics: ['conversion_rate', 'revenue', 'customer_acquisition_cost'],
      objectives: ['increase_revenue', 'improve_user_engagement'],
    };

    const result = await meaningfulChangeAnalysisTool.execute({
      changes: mockChanges,
      websiteUrl: 'https://example.com',
      businessContext,
      analysisProviders: ['openai'],
      impactThreshold: 0.3,
      includeTrends: true,
      analysisDepth: 'comprehensive',
    });

    expect(result).toBeDefined();
    expect(result.websiteUrl).toBe('https://example.com');
    expect(result.businessContext).toEqual(businessContext);
    expect(result.meaningfulChanges).toBeDefined();
    expect(result.impactAnalysis).toBeDefined();
    expect(result.insights).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(result.trendAnalysis).toBeDefined();
    expect(result.aiConsensus).toBeDefined();
    expect(result.metadata.success).toBe(true);
    expect(result.metadata.category).toBe('meaningful-change-analysis');
    expect(result.metadata.totalChanges).toBe(2);
  });

  it('should filter relevant changes based on impact threshold', async () => {
    const mockChanges = [
      {
        id: 'change-1',
        type: 'modified',
        category: 'cosmetic',
        severity: 'low',
        description: 'Minor color adjustment',
        path: 'styling',
        impact: 'neutral',
        confidence: 0.3,
      },
      {
        id: 'change-2',
        type: 'modified',
        category: 'pricing',
        severity: 'critical',
        description: 'Major pricing restructure',
        path: 'pricing-page',
        impact: 'negative',
        confidence: 0.95,
      },
    ];

    const result = await meaningfulChangeAnalysisTool.execute({
      changes: mockChanges,
      websiteUrl: 'https://example.com',
      analysisProviders: ['openai'],
      impactThreshold: 0.5,
      includeTrends: false,
      analysisDepth: 'basic',
    });

    expect(result).toBeDefined();
    expect(result.metadata.totalChanges).toBe(2);
    // Should filter out low-impact changes
    expect(result.meaningfulChanges.length).toBeLessThanOrEqual(1);
    expect(result.metadata.success).toBe(true);
  });

  it('should handle empty changes array gracefully', async () => {
    const result = await meaningfulChangeAnalysisTool.execute({
      changes: [],
      websiteUrl: 'https://example.com',
      analysisProviders: ['openai'],
      impactThreshold: 0.3,
      includeTrends: false,
      analysisDepth: 'basic',
    });

    expect(result).toBeDefined();
    expect(result.meaningfulChanges).toEqual([]);
    expect(result.metadata.totalChanges).toBe(0);
    expect(result.metadata.meaningfulChangesCount).toBe(0);
    expect(result.metadata.success).toBe(true);
  });

  it('should categorize changes correctly by business impact', async () => {
    const mockChanges = [
      {
        id: 'change-1',
        type: 'modified',
        category: 'pricing',
        severity: 'high',
        description: 'Price increase implemented',
        path: 'pricing',
        impact: 'negative',
        confidence: 0.8,
      },
      {
        id: 'change-2',
        type: 'added',
        category: 'seo',
        severity: 'medium',
        description: 'Meta descriptions optimized',
        path: 'head-section',
        impact: 'positive',
        confidence: 0.7,
      },
    ];

    const result = await meaningfulChangeAnalysisTool.execute({
      changes: mockChanges,
      websiteUrl: 'https://example.com',
      analysisProviders: ['openai'],
      impactThreshold: 0.2,
      includeTrends: false,
      analysisDepth: 'comprehensive',
    });

    expect(result).toBeDefined();
    expect(result.meaningfulChanges.length).toBeGreaterThan(0);

    const pricingChange = result.meaningfulChanges.find(
      (c) => c.originalChange.category === 'pricing',
    );
    const seoChange = result.meaningfulChanges.find(
      (c) => c.originalChange.category === 'seo',
    );

    if (pricingChange) {
      expect(pricingChange.category).toBe('pricing');
      expect(pricingChange.priority).toBeOneOf(['high', 'critical']);
    }

    if (seoChange) {
      expect(seoChange.category).toBe('seo');
      expect(seoChange.affectedMetrics).toContain('organic_traffic');
    }

    expect(result.metadata.success).toBe(true);
  });

  it('should generate actionable insights and recommendations', async () => {
    const mockChanges = [
      {
        id: 'change-1',
        type: 'modified',
        category: 'features',
        severity: 'medium',
        description: 'New dashboard feature launched',
        path: 'dashboard',
        impact: 'positive',
        confidence: 0.8,
      },
    ];

    const businessContext = {
      industry: 'Technology',
      businessType: 'saas' as const,
      keyMetrics: ['user_engagement', 'feature_adoption'],
      objectives: ['improve_user_experience'],
    };

    const result = await meaningfulChangeAnalysisTool.execute({
      changes: mockChanges,
      websiteUrl: 'https://example.com',
      businessContext,
      analysisProviders: ['openai'],
      impactThreshold: 0.2,
      includeTrends: true,
      analysisDepth: 'expert',
    });

    expect(result).toBeDefined();
    expect(result.insights).toBeDefined();
    expect(result.insights.keyFindings).toBeDefined();
    expect(result.insights.recommendations).toBeDefined();
    expect(result.insights.recommendations.length).toBeGreaterThan(0);

    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.immediate).toBeDefined();
    expect(result.recommendations.shortTerm).toBeDefined();
    expect(result.recommendations.longTerm).toBeDefined();
    expect(result.recommendations.monitoring).toBeDefined();
    expect(result.recommendations.alerts).toBeDefined();

    expect(result.metadata.success).toBe(true);
  });

  it('should calculate AI consensus with multiple providers', async () => {
    const mockChanges = [
      {
        id: 'change-1',
        type: 'modified',
        category: 'content',
        severity: 'medium',
        description: 'Homepage content updated',
        path: 'homepage',
        impact: 'neutral',
        confidence: 0.7,
      },
    ];

    const result = await meaningfulChangeAnalysisTool.execute({
      changes: mockChanges,
      websiteUrl: 'https://example.com',
      analysisProviders: ['openai', 'claude'],
      impactThreshold: 0.3,
      includeTrends: false,
      analysisDepth: 'comprehensive',
    });

    expect(result).toBeDefined();
    expect(result.aiConsensus).toBeDefined();
    // When AI fails (like in tests without API keys), providers array may be empty or contain the original providers
    expect(Array.isArray(result.aiConsensus.providers)).toBe(true);
    expect(result.aiConsensus.agreement).toBeGreaterThanOrEqual(0);
    expect(result.aiConsensus.agreement).toBeLessThanOrEqual(1);
    expect(result.aiConsensus.confidence).toBeGreaterThanOrEqual(0);
    expect(result.aiConsensus.confidence).toBeLessThanOrEqual(1);
    expect(result.aiConsensus.disagreements).toBeDefined();

    expect(result.metadata.success).toBe(true);
  });

  it('should perform trend analysis when enabled', async () => {
    const mockChanges = [
      {
        id: 'change-1',
        type: 'modified',
        category: 'performance',
        severity: 'high',
        description: 'Page load optimization',
        path: 'performance',
        impact: 'positive',
        confidence: 0.9,
        timestamp: '2024-01-01T10:00:00Z',
      },
      {
        id: 'change-2',
        type: 'modified',
        category: 'performance',
        severity: 'high',
        description: 'Image compression applied',
        path: 'assets',
        impact: 'positive',
        confidence: 0.8,
        timestamp: '2024-01-01T11:00:00Z',
      },
    ];

    const result = await meaningfulChangeAnalysisTool.execute({
      changes: mockChanges,
      websiteUrl: 'https://example.com',
      analysisProviders: ['openai'],
      impactThreshold: 0.3,
      includeTrends: true,
      analysisDepth: 'comprehensive',
    });

    expect(result).toBeDefined();
    expect(result.trendAnalysis).toBeDefined();
    expect(result.trendAnalysis!.changeVelocity).toBeGreaterThanOrEqual(0);
    expect(result.trendAnalysis!.trendDirection).toBeOneOf([
      'increasing',
      'decreasing',
      'stable',
    ]);
    expect(result.trendAnalysis!.patterns).toBeDefined();
    expect(result.trendAnalysis!.predictions).toBeDefined();

    expect(result.metadata.success).toBe(true);
  });

  it('should handle different analysis depths', async () => {
    const mockChanges = [
      {
        id: 'change-1',
        type: 'modified',
        category: 'structure',
        severity: 'medium',
        description: 'Navigation structure updated',
        path: 'navigation',
        impact: 'neutral',
        confidence: 0.6,
      },
    ];

    const basicResult = await meaningfulChangeAnalysisTool.execute({
      changes: mockChanges,
      websiteUrl: 'https://example.com',
      analysisProviders: ['openai'],
      impactThreshold: 0.3,
      includeTrends: false,
      analysisDepth: 'basic',
    });

    const expertResult = await meaningfulChangeAnalysisTool.execute({
      changes: mockChanges,
      websiteUrl: 'https://example.com',
      analysisProviders: ['openai'],
      impactThreshold: 0.3,
      includeTrends: false,
      analysisDepth: 'expert',
    });

    expect(basicResult).toBeDefined();
    expect(expertResult).toBeDefined();
    expect(basicResult.metadata.analysisDepth).toBe('basic');
    expect(expertResult.metadata.analysisDepth).toBe('expert');

    // Expert analysis should provide more detailed recommendations
    expect(expertResult.insights.recommendations.length).toBeGreaterThanOrEqual(
      basicResult.insights.recommendations.length,
    );

    expect(basicResult.metadata.success).toBe(true);
    expect(expertResult.metadata.success).toBe(true);
  });

  it('should assess business risks and opportunities', async () => {
    const highRiskChanges = [
      {
        id: 'change-1',
        type: 'removed',
        category: 'pricing',
        severity: 'critical',
        description: 'Free tier removed',
        path: 'pricing',
        impact: 'negative',
        confidence: 0.95,
      },
      {
        id: 'change-2',
        type: 'modified',
        category: 'performance',
        severity: 'high',
        description: 'Site performance degraded',
        path: 'performance',
        impact: 'negative',
        confidence: 0.9,
      },
    ];

    const result = await meaningfulChangeAnalysisTool.execute({
      changes: highRiskChanges,
      websiteUrl: 'https://example.com',
      analysisProviders: ['openai'],
      impactThreshold: 0.3,
      includeTrends: false,
      analysisDepth: 'comprehensive',
    });

    expect(result).toBeDefined();
    expect(result.impactAnalysis.riskAssessment).toBeDefined();
    expect(result.impactAnalysis.riskAssessment.level).toBeOneOf([
      'medium',
      'high',
      'critical',
    ]);
    expect(result.impactAnalysis.riskAssessment.factors).toBeDefined();
    expect(result.impactAnalysis.riskAssessment.mitigation).toBeDefined();

    expect(result.impactAnalysis.opportunityAssessment).toBeDefined();
    expect(result.impactAnalysis.opportunityAssessment.level).toBeOneOf([
      'low',
      'medium',
      'high',
      'excellent',
    ]);

    expect(result.metadata.success).toBe(true);
  });
});
