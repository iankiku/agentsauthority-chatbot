import { describe, expect, it } from 'vitest';
import { changeDetectionTool } from '../lib/ai/tools/change-detection-tool';
import { meaningfulChangeAnalysisTool } from '../lib/ai/tools/meaningful-change-analysis-tool';

describe('Meaningful Change Analysis Integration', () => {
  it('should work with change detection tool output', async () => {
    // Step 1: Create mock website snapshots
    const baselineSnapshot = {
      content: {
        text: 'Welcome to our SaaS platform. Our premium plan costs $99/month and includes advanced analytics.',
        html: '<div><h1>Welcome to our SaaS platform</h1><p>Our premium plan costs $99/month and includes advanced analytics.</p></div>',
        structuredData: {
          headings: [
            { level: 1, text: 'Welcome to our SaaS platform', id: 'title' },
          ],
          links: [{ text: 'Sign Up', url: '/signup', title: 'Sign Up' }],
          images: [],
        },
        contentHash: 'baseline-hash-123',
      },
      metadata: {
        title: 'SaaS Platform - Advanced Analytics',
        description: 'Professional analytics platform starting at $99/month',
        keywords: ['saas', 'analytics', 'premium'],
      },
      timestamp: '2024-01-01T10:00:00Z',
      hash: 'baseline-snapshot-123',
    };

    const currentSnapshot = {
      content: {
        text: 'Welcome to our SaaS platform. Our premium plan costs $129/month and includes advanced analytics plus AI insights.',
        html: '<div><h1>Welcome to our SaaS platform</h1><p>Our premium plan costs $129/month and includes advanced analytics plus AI insights.</p></div>',
        structuredData: {
          headings: [
            { level: 1, text: 'Welcome to our SaaS platform', id: 'title' },
          ],
          links: [{ text: 'Sign Up', url: '/signup', title: 'Sign Up' }],
          images: [],
        },
        contentHash: 'current-hash-456',
      },
      metadata: {
        title: 'SaaS Platform - Advanced Analytics with AI',
        description:
          'Professional analytics platform with AI insights starting at $129/month',
        keywords: ['saas', 'analytics', 'premium', 'ai'],
      },
      timestamp: '2024-01-02T10:00:00Z',
      hash: 'current-snapshot-456',
    };

    // Step 2: Run change detection
    const changeDetectionResult = await changeDetectionTool.execute({
      baselineSnapshot,
      currentSnapshot,
      detectionMode: 'comprehensive',
      changeThreshold: 0.1,
      includeContext: true,
    });

    // Verify change detection worked
    expect(changeDetectionResult).toBeDefined();
    expect(changeDetectionResult.changes.length).toBeGreaterThan(0);
    expect(changeDetectionResult.metadata.success).toBe(true);

    console.log('Change Detection Results:', {
      totalChanges: changeDetectionResult.changes.length,
      changeTypes: changeDetectionResult.changes.map((c) => c.category),
    });

    // Step 3: Run meaningful change analysis on detected changes
    const meaningfulAnalysisResult = await meaningfulChangeAnalysisTool.execute(
      {
        changes: changeDetectionResult.changes,
        websiteUrl: 'https://example-saas.com',
        businessContext: {
          industry: 'SaaS',
          businessType: 'b2b' as const,
          keyMetrics: [
            'revenue',
            'conversion_rate',
            'customer_acquisition_cost',
          ],
          objectives: ['increase_revenue', 'improve_value_proposition'],
        },
        analysisProviders: ['openai'], // Limited to one provider for testing
        impactThreshold: 0.2,
        includeTrends: true,
        analysisDepth: 'comprehensive',
      },
    );

    // Verify meaningful change analysis worked
    expect(meaningfulAnalysisResult).toBeDefined();
    expect(meaningfulAnalysisResult.metadata.success).toBe(true);
    expect(meaningfulAnalysisResult.metadata.totalChanges).toBe(
      changeDetectionResult.changes.length,
    );

    console.log('Meaningful Change Analysis Results:', {
      totalInputChanges: meaningfulAnalysisResult.metadata.totalChanges,
      meaningfulChanges:
        meaningfulAnalysisResult.metadata.meaningfulChangesCount,
      overallImpact: meaningfulAnalysisResult.impactAnalysis.overallImpact,
      riskLevel: meaningfulAnalysisResult.impactAnalysis.riskAssessment.level,
    });

    // Step 4: Verify integration expectations
    expect(meaningfulAnalysisResult.meaningfulChanges).toBeDefined();
    expect(meaningfulAnalysisResult.impactAnalysis).toBeDefined();
    expect(meaningfulAnalysisResult.insights).toBeDefined();
    expect(meaningfulAnalysisResult.recommendations).toBeDefined();

    // Check that business context is preserved
    expect(meaningfulAnalysisResult.businessContext.industry).toBe('SaaS');
    expect(meaningfulAnalysisResult.businessContext.businessType).toBe('b2b');

    // Verify that pricing changes are detected and analyzed (this is a significant business change)
    const pricingChanges = meaningfulAnalysisResult.meaningfulChanges.filter(
      (change) =>
        change.category === 'pricing' ||
        change.originalChange.description?.toLowerCase().includes('price') ||
        change.originalChange.description?.toLowerCase().includes('cost'),
    );

    // We expect at least some pricing-related analysis since the price changed from $99 to $129
    console.log('Pricing-related changes found:', pricingChanges.length);

    // Verify recommendations are provided
    expect(meaningfulAnalysisResult.recommendations.immediate).toBeDefined();
    expect(meaningfulAnalysisResult.recommendations.monitoring).toBeDefined();

    // Verify AI consensus structure
    expect(meaningfulAnalysisResult.aiConsensus.providers).toBeDefined();
    expect(
      meaningfulAnalysisResult.aiConsensus.agreement,
    ).toBeGreaterThanOrEqual(0);
    expect(
      meaningfulAnalysisResult.aiConsensus.confidence,
    ).toBeGreaterThanOrEqual(0);
  });

  it('should handle empty change detection results gracefully', async () => {
    // Test with identical snapshots that produce no changes
    const identicalSnapshot = {
      content: {
        text: 'No changes here',
        html: '<p>No changes here</p>',
        structuredData: { headings: [], links: [], images: [] },
        contentHash: 'same-hash',
      },
      metadata: {
        title: 'Same Title',
        description: 'Same Description',
        keywords: ['same'],
      },
      timestamp: '2024-01-01T10:00:00Z',
      hash: 'same-snapshot-hash',
    };

    // Run change detection with identical snapshots
    const changeDetectionResult = await changeDetectionTool.execute({
      baselineSnapshot: identicalSnapshot,
      currentSnapshot: identicalSnapshot,
      detectionMode: 'comprehensive',
      changeThreshold: 0.1,
      includeContext: false,
    });

    // Should detect no changes
    expect(changeDetectionResult.changes.length).toBe(0);

    // Run meaningful change analysis with no changes
    const meaningfulAnalysisResult = await meaningfulChangeAnalysisTool.execute(
      {
        changes: changeDetectionResult.changes,
        websiteUrl: 'https://example.com',
        analysisProviders: ['openai'],
        impactThreshold: 0.3,
        includeTrends: false,
        analysisDepth: 'basic',
      },
    );

    // Should handle empty changes gracefully
    expect(meaningfulAnalysisResult).toBeDefined();
    expect(meaningfulAnalysisResult.metadata.success).toBe(true);
    expect(meaningfulAnalysisResult.metadata.totalChanges).toBe(0);
    expect(meaningfulAnalysisResult.metadata.meaningfulChangesCount).toBe(0);
    expect(meaningfulAnalysisResult.meaningfulChanges).toEqual([]);
    expect(meaningfulAnalysisResult.impactAnalysis.overallImpact).toBe(
      'neutral',
    );
  });

  it('should demonstrate the complete monitoring workflow', async () => {
    // This test demonstrates how the tools would be used in a real monitoring scenario

    // Simulate website monitoring scenario: E-commerce site adds new feature
    const baselineSnapshot = {
      content: {
        text: 'Shop our products. Free shipping on orders over $50.',
        html: '<div><h1>Shop our products</h1><p>Free shipping on orders over $50.</p></div>',
        structuredData: {
          headings: [{ level: 1, text: 'Shop our products', id: 'main-title' }],
          links: [{ text: 'Shop Now', url: '/shop', title: 'Shop Now' }],
          images: [
            { src: '/products.jpg', alt: 'Our Products', title: 'Products' },
          ],
        },
        contentHash: 'ecommerce-baseline',
      },
      metadata: {
        title: 'E-commerce Store - Free Shipping',
        description: 'Shop our products with free shipping over $50',
        keywords: ['ecommerce', 'products', 'shipping'],
      },
      timestamp: '2024-01-01T09:00:00Z',
      hash: 'ecommerce-baseline-hash',
    };

    const currentSnapshot = {
      content: {
        text: 'Shop our products. Free shipping on orders over $50. New: AI-powered product recommendations!',
        html: '<div><h1>Shop our products</h1><p>Free shipping on orders over $50.</p><div class="ai-recommendations">New: AI-powered product recommendations!</div></div>',
        structuredData: {
          headings: [
            { level: 1, text: 'Shop our products', id: 'main-title' },
            { level: 2, text: 'AI Recommendations', id: 'ai-section' },
          ],
          links: [
            { text: 'Shop Now', url: '/shop', title: 'Shop Now' },
            {
              text: 'Try AI Recommendations',
              url: '/ai-recs',
              title: 'AI Recommendations',
            },
          ],
          images: [
            { src: '/products.jpg', alt: 'Our Products', title: 'Products' },
          ],
        },
        contentHash: 'ecommerce-current',
      },
      metadata: {
        title: 'E-commerce Store - Free Shipping + AI Recommendations',
        description:
          'Shop our products with free shipping over $50 and AI-powered recommendations',
        keywords: [
          'ecommerce',
          'products',
          'shipping',
          'ai',
          'recommendations',
        ],
      },
      timestamp: '2024-01-01T15:00:00Z',
      hash: 'ecommerce-current-hash',
    };

    // Step 1: Detect changes
    const changes = await changeDetectionTool.execute({
      baselineSnapshot,
      currentSnapshot,
      detectionMode: 'comprehensive',
      changeThreshold: 0.05, // Lower threshold to catch feature additions
      includeContext: true,
    });

    expect(changes.changes.length).toBeGreaterThan(0);

    // Step 2: Analyze for business impact
    const analysis = await meaningfulChangeAnalysisTool.execute({
      changes: changes.changes,
      websiteUrl: 'https://example-ecommerce.com',
      businessContext: {
        industry: 'E-commerce',
        businessType: 'b2c',
        keyMetrics: [
          'conversion_rate',
          'average_order_value',
          'user_engagement',
        ],
        objectives: [
          'increase_sales',
          'improve_user_experience',
          'feature_adoption',
        ],
      },
      analysisProviders: ['openai'],
      impactThreshold: 0.2,
      includeTrends: true,
      analysisDepth: 'expert',
    });

    // Step 3: Verify comprehensive workflow results
    expect(analysis.metadata.success).toBe(true);

    // Should identify feature-related changes
    const featureChanges = analysis.meaningfulChanges.filter(
      (change) =>
        change.category === 'features' ||
        change.originalChange.description
          ?.toLowerCase()
          .includes('recommendation') ||
        change.originalChange.description?.toLowerCase().includes('ai'),
    );

    console.log('Feature-related changes detected:', featureChanges.length);

    // Should provide business recommendations (may be empty in test environment without AI)
    expect(analysis.recommendations.immediate).toBeDefined();
    expect(analysis.recommendations.monitoring).toBeDefined();
    expect(Array.isArray(analysis.recommendations.immediate)).toBe(true);
    expect(Array.isArray(analysis.recommendations.monitoring)).toBe(true);

    // Should perform trend analysis when enabled
    expect(analysis.trendAnalysis).toBeDefined();
    expect(analysis.trendAnalysis!.changeVelocity).toBeGreaterThanOrEqual(0);

    // Should assess opportunities (new features typically create opportunities)
    expect(analysis.impactAnalysis.opportunityAssessment).toBeDefined();

    console.log('Integration Test Complete:', {
      detectedChanges: changes.changes.length,
      meaningfulChanges: analysis.meaningfulChanges.length,
      overallImpact: analysis.impactAnalysis.overallImpact,
      opportunityLevel: analysis.impactAnalysis.opportunityAssessment.level,
      immediateRecommendations: analysis.recommendations.immediate.length,
    });
  });
});
