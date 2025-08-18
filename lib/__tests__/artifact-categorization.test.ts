import type { Artifact } from '../artifacts/artifact-processor';
import {
  ArtifactCategorizer,
  type CategorizedArtifact,
} from '../artifacts/categorization/artifact-categorizer';
import { CategoryMapper } from '../artifacts/categorization/category-mapper';
import { RelationshipDetector } from '../artifacts/categorization/relationship-detector';
import { TagExtractor } from '../artifacts/categorization/tag-extractor';

describe('ArtifactCategorizer', () => {
  let categorizer: ArtifactCategorizer;

  beforeEach(() => {
    categorizer = new ArtifactCategorizer();
  });

  test('should categorize visibility artifacts correctly', async () => {
    const artifact: Artifact = {
      id: 'test-1',
      type: 'visibility-matrix',
      title: 'Brand Visibility Analysis - Tesla',
      content: {
        brandName: 'Tesla',
        overallScore: 85,
        platformResults: [
          { model: 'chatgpt', score: 90 },
          { model: 'claude', score: 85 },
          { model: 'gemini', score: 80 },
        ],
      },
      metadata: {
        brandName: 'Tesla',
        timestamp: new Date().toISOString(),
        category: 'visibility-analysis',
        tags: ['brand-visibility', 'multi-model-analysis', 'geo'],
        generatedBy: 'visibilityAcrossModels',
        userId: 'user-1',
        conversationId: 'conv-1',
      },
    };

    const categorized = await categorizer.categorizeArtifact(artifact);

    expect(categorized.category).toBe('brand-visibility');
    expect(categorized.tags).toContain('tesla');
    expect(categorized.tags).toContain('chatgpt');
    expect(categorized.tags).toContain('claude');
    expect(categorized.tags).toContain('gemini');
    expect(categorized.priority).toBe(1);
    expect(categorized.categorizationConfidence).toBeGreaterThan(0.8);
    expect(categorized.relatedArtifacts).toBeInstanceOf(Array);
  });

  test('should categorize competitive intelligence artifacts correctly', async () => {
    const artifact: Artifact = {
      id: 'test-2',
      type: 'competitive-intelligence',
      title: 'Competitive Analysis - Apple vs Samsung, Google',
      content: {
        primaryBrand: 'Apple',
        competitors: ['Samsung', 'Google'],
        marketPosition: { position: 'leader', score: 85 },
        shareOfVoice: { apple: 45, samsung: 30, google: 25 },
      },
      metadata: {
        brandName: 'Apple',
        timestamp: new Date().toISOString(),
        category: 'competitive-analysis',
        tags: ['competitive-intelligence', 'market-analysis', 'geo'],
        generatedBy: 'competitiveIntelligence',
        userId: 'user-1',
        conversationId: 'conv-1',
      },
    };

    const categorized = await categorizer.categorizeArtifact(artifact);

    expect(categorized.category).toBe('competitive-intelligence');
    expect(categorized.tags).toContain('apple');
    expect(categorized.tags).toContain('samsung');
    expect(categorized.tags).toContain('google');
    expect(categorized.priority).toBe(1);
    expect(categorized.categorizationConfidence).toBeGreaterThan(0.8);
  });

  test('should categorize content optimization artifacts correctly', async () => {
    const artifact: Artifact = {
      id: 'test-3',
      type: 'content-optimization',
      title: 'Content Optimization Analysis - Blog',
      content: {
        targetKeywords: ['artificial intelligence', 'machine learning'],
        contentType: 'blog',
        industry: 'technology',
        platformAnalysis: {
          chatgpt: {
            score: 75,
            strengths: [],
            weaknesses: [],
            recommendations: [],
          },
          claude: {
            score: 80,
            strengths: [],
            weaknesses: [],
            recommendations: [],
          },
          gemini: {
            score: 70,
            strengths: [],
            weaknesses: [],
            recommendations: [],
          },
        },
        overallOptimization: {
          averageScore: 75,
          priorityImprovements: [],
          contentStructure: {
            suggestedFormat: 'Blog Post',
            recommendedSections: [],
            lengthRecommendation: '800-1200 words',
          },
          keywordIntegration: {
            currentDensity: 1.2,
            recommendedDensity: 1.5,
            placementSuggestions: [],
          },
        },
      },
      metadata: {
        timestamp: new Date().toISOString(),
        category: 'content-optimization',
        tags: ['content-optimization', 'seo', 'ai-platforms', 'geo'],
        generatedBy: 'contentOptimization',
        userId: 'user-1',
        conversationId: 'conv-1',
      },
    };

    const categorized = await categorizer.categorizeArtifact(artifact);

    expect(categorized.category).toBe('content-strategy');
    expect(categorized.tags).toContain('artificial-intelligence');
    expect(categorized.tags).toContain('machine-learning');
    expect(categorized.tags).toContain('blog');
    expect(categorized.tags).toContain('technology');
    expect(categorized.priority).toBe(2);
    expect(categorized.categorizationConfidence).toBeGreaterThan(0.7);
  });

  test('should handle edge cases gracefully', async () => {
    const artifact: Artifact = {
      id: 'test-4',
      type: 'unknown-type',
      title: 'Unknown Artifact',
      content: {},
      metadata: {
        timestamp: new Date().toISOString(),
        category: 'unknown',
        tags: [],
        generatedBy: 'unknown',
        userId: 'user-1',
        conversationId: 'conv-1',
      },
    };

    const categorized = await categorizer.categorizeArtifact(artifact);

    expect(categorized.category).toBe('general');
    expect(categorized.tags).toBeInstanceOf(Array);
    expect(categorized.priority).toBe(3);
    expect(categorized.categorizationConfidence).toBeLessThan(0.8);
  });

  test('should categorize multiple artifacts efficiently', async () => {
    const artifacts: Artifact[] = [
      {
        id: 'test-5',
        type: 'visibility-matrix',
        title: 'Visibility Analysis - Microsoft',
        content: { brandName: 'Microsoft', overallScore: 90 },
        metadata: {
          brandName: 'Microsoft',
          timestamp: new Date().toISOString(),
          category: 'visibility-analysis',
          tags: ['brand-visibility', 'geo'],
          generatedBy: 'visibilityAcrossModels',
          userId: 'user-1',
          conversationId: 'conv-1',
        },
      },
      {
        id: 'test-6',
        type: 'brand-monitor',
        title: 'Brand Monitor - Amazon',
        content: {
          brandName: 'Amazon',
          mentionCount: 150,
          credibilityScore: 85,
        },
        metadata: {
          brandName: 'Amazon',
          timestamp: new Date().toISOString(),
          category: 'brand-monitoring',
          tags: ['brand-monitoring', 'geo'],
          generatedBy: 'brandMonitor',
          userId: 'user-1',
          conversationId: 'conv-1',
        },
      },
    ];

    const categorized =
      await categorizer.categorizeMultipleArtifacts(artifacts);

    expect(categorized).toHaveLength(2);
    expect(categorized[0].category).toBe('brand-visibility');
    expect(categorized[1].category).toBe('brand-monitoring');
    expect(categorized[0].tags).toContain('microsoft');
    expect(categorized[1].tags).toContain('amazon');
  });

  test('should provide categorization statistics', async () => {
    const artifacts: CategorizedArtifact[] = [
      {
        id: 'test-7',
        type: 'visibility-matrix',
        title: 'Test 1',
        content: {},
        metadata: {
          timestamp: new Date().toISOString(),
          category: 'visibility-analysis',
          tags: [],
          generatedBy: 'test',
          userId: 'user-1',
          conversationId: 'conv-1',
        },
        category: 'brand-visibility',
        tags: ['test'],
        priority: 1,
        relatedArtifacts: [],
        categorizationConfidence: 0.9,
      },
      {
        id: 'test-8',
        type: 'competitive-intelligence',
        title: 'Test 2',
        content: {},
        metadata: {
          timestamp: new Date().toISOString(),
          category: 'competitive-analysis',
          tags: [],
          generatedBy: 'test',
          userId: 'user-1',
          conversationId: 'conv-1',
        },
        category: 'competitive-intelligence',
        tags: ['test'],
        priority: 1,
        relatedArtifacts: [],
        categorizationConfidence: 0.85,
      },
    ];

    const stats = categorizer.getCategorizationStats(artifacts);

    expect(stats.totalArtifacts).toBe(2);
    expect(stats.categoryDistribution['brand-visibility']).toBe(1);
    expect(stats.categoryDistribution['competitive-intelligence']).toBe(1);
    expect(stats.averageConfidence).toBeCloseTo(0.875);
    expect(stats.priorityDistribution[1]).toBe(2);
  });
});

describe('CategoryMapper', () => {
  let mapper: CategoryMapper;

  beforeEach(() => {
    mapper = new CategoryMapper();
  });

  test('should map artifact types to categories correctly', () => {
    const testCases = [
      { type: 'visibility-matrix', expected: 'brand-visibility' },
      {
        type: 'competitive-intelligence',
        expected: 'competitive-intelligence',
      },
      { type: 'content-optimization', expected: 'content-strategy' },
      { type: 'brand-monitor-report', expected: 'brand-monitoring' },
      { type: 'unknown-type', expected: 'general' },
    ];

    testCases.forEach(({ type, expected }) => {
      const artifact: Artifact = {
        id: 'test',
        type,
        title: 'Test',
        content: {},
        metadata: {
          timestamp: new Date().toISOString(),
          category: 'test',
          tags: [],
          generatedBy: 'test',
          userId: 'user-1',
          conversationId: 'conv-1',
        },
      };

      expect(mapper.determineCategory(artifact)).toBe(expected);
    });
  });

  test('should provide category descriptions', () => {
    expect(mapper.getCategoryDescription('brand-visibility')).toBe(
      'Brand visibility analysis across AI platforms',
    );
    expect(mapper.getCategoryDescription('competitive-intelligence')).toBe(
      'Competitive analysis and market positioning',
    );
    expect(mapper.getCategoryDescription('unknown')).toBe('Unknown category');
  });

  test('should provide category colors and icons', () => {
    expect(mapper.getCategoryColor('brand-visibility')).toBe('blue');
    expect(mapper.getCategoryIcon('competitive-intelligence')).toBe('🎯');
  });

  test('should validate known categories', () => {
    expect(mapper.isKnownCategory('brand-visibility')).toBe(true);
    expect(mapper.isKnownCategory('unknown-category')).toBe(false);
  });
});

describe('TagExtractor', () => {
  let extractor: TagExtractor;

  beforeEach(() => {
    extractor = new TagExtractor();
  });

  test('should extract tags from artifact content', async () => {
    const artifact: Artifact = {
      id: 'test',
      type: 'visibility-matrix',
      title: 'Brand Visibility Analysis - Tesla',
      content: {
        brandName: 'Tesla',
        targetKeywords: ['electric vehicles', 'sustainability'],
        industry: 'automotive',
        platformResults: [
          { model: 'chatgpt', score: 90 },
          { model: 'claude', score: 85 },
        ],
      },
      metadata: {
        brandName: 'Tesla',
        timestamp: new Date().toISOString(),
        category: 'visibility-analysis',
        tags: ['brand-visibility', 'geo'],
        generatedBy: 'visibilityAcrossModels',
        userId: 'user-1',
        conversationId: 'conv-1',
      },
    };

    const tags = await extractor.extractTags(artifact);

    expect(tags).toContain('tesla');
    expect(tags).toContain('electric-vehicles');
    expect(tags).toContain('sustainability');
    expect(tags).toContain('automotive');
    expect(tags).toContain('chatgpt');
    expect(tags).toContain('claude');
    expect(tags).toContain('brand-visibility');
    expect(tags).toContain('geo');
  });

  test('should normalize tags correctly', async () => {
    const text =
      'This is a test with #hashtags and @mentions and AI/ML content from 2024';
    const tags = await extractor.extractTagsFromText(text);

    expect(tags).toContain('hashtags');
    expect(tags).toContain('mentions');
    expect(tags).toContain('ai');
    expect(tags).toContain('ml');
    expect(tags).toContain('2024');
  });

  test('should get popular tags from artifacts', () => {
    const artifacts: Artifact[] = [
      {
        id: 'test-1',
        type: 'visibility-matrix',
        title: 'Test 1',
        content: {},
        metadata: {
          timestamp: new Date().toISOString(),
          category: 'test',
          tags: ['tesla', 'ai', 'geo'],
          generatedBy: 'test',
          userId: 'user-1',
          conversationId: 'conv-1',
        },
      },
      {
        id: 'test-2',
        type: 'competitive-intelligence',
        title: 'Test 2',
        content: {},
        metadata: {
          timestamp: new Date().toISOString(),
          category: 'test',
          tags: ['tesla', 'competitive', 'market'],
          generatedBy: 'test',
          userId: 'user-1',
          conversationId: 'conv-1',
        },
      },
    ];

    const popularTags = extractor.getPopularTags(artifacts);

    expect(popularTags).toHaveLength(5); // tesla, ai, geo, competitive, market
    expect(popularTags[0].tag).toBe('tesla');
    expect(popularTags[0].count).toBe(2);
  });
});

describe('RelationshipDetector', () => {
  let detector: RelationshipDetector;

  beforeEach(() => {
    detector = new RelationshipDetector();
  });

  test('should find related artifacts', async () => {
    const artifact: Artifact = {
      id: 'test',
      type: 'visibility-matrix',
      title: 'Brand Visibility Analysis - Tesla',
      content: {
        brandName: 'Tesla',
        targetKeywords: ['electric vehicles'],
      },
      metadata: {
        brandName: 'Tesla',
        timestamp: new Date().toISOString(),
        category: 'visibility-analysis',
        tags: ['brand-visibility', 'geo'],
        generatedBy: 'visibilityAcrossModels',
        userId: 'user-1',
        conversationId: 'conv-1',
      },
    };

    const relatedArtifacts = await detector.findRelatedArtifacts(
      artifact,
      'brand-visibility',
    );

    expect(relatedArtifacts).toBeInstanceOf(Array);
    // In mock implementation, this will be empty, but the method should not throw
  });

  test('should calculate similarity between artifacts', async () => {
    const artifact1: Artifact = {
      id: 'test-1',
      type: 'visibility-matrix',
      title: 'Tesla Visibility Analysis',
      content: { brandName: 'Tesla', targetKeywords: ['electric vehicles'] },
      metadata: {
        brandName: 'Tesla',
        timestamp: new Date().toISOString(),
        category: 'visibility-analysis',
        tags: ['tesla', 'electric-vehicles'],
        generatedBy: 'test',
        userId: 'user-1',
        conversationId: 'conv-1',
      },
    };

    const artifact2: Artifact = {
      id: 'test-2',
      type: 'visibility-matrix',
      title: 'Tesla Brand Analysis',
      content: { brandName: 'Tesla', targetKeywords: ['automotive'] },
      metadata: {
        brandName: 'Tesla',
        timestamp: new Date().toISOString(),
        category: 'visibility-analysis',
        tags: ['tesla', 'automotive'],
        generatedBy: 'test',
        userId: 'user-1',
        conversationId: 'conv-1',
      },
    };

    // This would test the private method through the public interface
    const relatedArtifacts1 = await detector.findRelatedArtifacts(
      artifact1,
      'brand-visibility',
    );
    const relatedArtifacts2 = await detector.findRelatedArtifacts(
      artifact2,
      'brand-visibility',
    );

    expect(relatedArtifacts1).toBeInstanceOf(Array);
    expect(relatedArtifacts2).toBeInstanceOf(Array);
  });

  test('should create relationship graph', async () => {
    const artifacts: Artifact[] = [
      {
        id: 'test-1',
        type: 'visibility-matrix',
        title: 'Tesla Analysis',
        content: { brandName: 'Tesla' },
        metadata: {
          brandName: 'Tesla',
          timestamp: new Date().toISOString(),
          category: 'visibility-analysis',
          tags: ['tesla'],
          generatedBy: 'test',
          userId: 'user-1',
          conversationId: 'conv-1',
        },
      },
      {
        id: 'test-2',
        type: 'competitive-intelligence',
        title: 'Tesla Competitive Analysis',
        content: { primaryBrand: 'Tesla' },
        metadata: {
          brandName: 'Tesla',
          timestamp: new Date().toISOString(),
          category: 'competitive-analysis',
          tags: ['tesla', 'competitive'],
          generatedBy: 'test',
          userId: 'user-1',
          conversationId: 'conv-1',
        },
      },
    ];

    const graph = await detector.getRelationshipGraph(artifacts);

    expect(graph.nodes).toHaveLength(2);
    expect(graph.edges).toBeInstanceOf(Array);
    expect(graph.nodes[0].id).toBe('test-1');
    expect(graph.nodes[1].id).toBe('test-2');
  });
});
