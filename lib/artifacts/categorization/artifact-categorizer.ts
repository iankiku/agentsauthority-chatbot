import type { Artifact } from '../artifact-processor';
import { CategoryMapper } from './category-mapper';
import { RelationshipDetector } from './relationship-detector';
import { TagExtractor } from './tag-extractor';

export interface CategorizedArtifact extends Artifact {
  category: string;
  tags: string[];
  priority: number;
  relatedArtifacts: string[];
  categorizationConfidence: number;
}

export interface CategorizationResult {
  category: string;
  tags: string[];
  priority: number;
  relatedArtifacts: string[];
  confidence: number;
}

export class ArtifactCategorizer {
  private categoryMapper: CategoryMapper;
  private tagExtractor: TagExtractor;
  private relationshipDetector: RelationshipDetector;

  constructor() {
    this.categoryMapper = new CategoryMapper();
    this.tagExtractor = new TagExtractor();
    this.relationshipDetector = new RelationshipDetector();
  }

  async categorizeArtifact(artifact: Artifact): Promise<CategorizedArtifact> {
    const startTime = Date.now();

    try {
      // Determine category
      const category = this.categoryMapper.determineCategory(artifact);

      // Extract tags
      const tags = await this.tagExtractor.extractTags(artifact);

      // Calculate priority
      const priority = this.calculatePriority(artifact);

      // Find related artifacts
      const relatedArtifacts =
        await this.relationshipDetector.findRelatedArtifacts(
          artifact,
          category,
        );

      // Calculate confidence
      const confidence = this.calculateConfidence(artifact, category);

      const categorizationTime = Date.now() - startTime;

      // Log performance metrics
      if (categorizationTime > 500) {
        console.warn(
          `Artifact categorization took ${categorizationTime}ms (exceeds 500ms limit)`,
        );
      }

      return {
        ...artifact,
        category,
        tags,
        priority,
        relatedArtifacts,
        categorizationConfidence: confidence,
      };
    } catch (error) {
      console.error('Error categorizing artifact:', error);

      // Return fallback categorization
      return {
        ...artifact,
        category: 'general',
        tags: [],
        priority: 3,
        relatedArtifacts: [],
        categorizationConfidence: 0.5,
      };
    }
  }

  private calculatePriority(artifact: Artifact): number {
    let priority = 3; // Default medium priority

    // High priority for competitive analysis
    if (artifact.type === 'competitive-intelligence') priority = 1;

    // High priority for visibility reports
    if (artifact.type === 'visibility-matrix') priority = 1;

    // Medium priority for content optimization
    if (artifact.type === 'content-optimization') priority = 2;

    // Medium priority for brand monitoring
    if (artifact.type === 'brand-monitor-report') priority = 2;

    // Adjust based on content importance
    if (artifact.content?.overallScore && artifact.content.overallScore > 80) {
      priority = Math.max(1, priority - 1);
    }
    if (artifact.content?.overallScore && artifact.content.overallScore < 40) {
      priority = Math.min(5, priority + 1);
    }

    // Adjust based on brand importance (if available)
    if (artifact.content?.brandName) {
      const importantBrands = [
        'apple',
        'google',
        'microsoft',
        'amazon',
        'tesla',
      ];
      if (importantBrands.includes(artifact.content.brandName.toLowerCase())) {
        priority = Math.max(1, priority - 1);
      }
    }

    return priority;
  }

  private calculateConfidence(artifact: Artifact, category: string): number {
    let confidence = 0.8; // Base confidence

    // Higher confidence for well-structured data
    if (
      artifact.content?.brandName &&
      artifact.content?.overallScore !== undefined
    ) {
      confidence += 0.1;
    }

    // Higher confidence for known categories
    const knownCategories = [
      'brand-visibility',
      'competitive-intelligence',
      'content-strategy',
      'brand-monitoring',
      'keyword-research',
    ];
    if (knownCategories.includes(category)) {
      confidence += 0.05;
    }

    // Lower confidence for unknown categories
    if (category === 'general') {
      confidence -= 0.2;
    }

    // Lower confidence for artifacts with missing key data
    if (!artifact.content?.brandName && !artifact.content?.targetKeywords) {
      confidence -= 0.15;
    }

    // Ensure confidence is within bounds
    return Math.min(1.0, Math.max(0.0, confidence));
  }

  async categorizeMultipleArtifacts(
    artifacts: Artifact[],
  ): Promise<CategorizedArtifact[]> {
    const results: CategorizedArtifact[] = [];

    // Process artifacts in parallel for better performance
    const categorizationPromises = artifacts.map((artifact) =>
      this.categorizeArtifact(artifact),
    );

    try {
      const categorizedArtifacts = await Promise.all(categorizationPromises);
      results.push(...categorizedArtifacts);
    } catch (error) {
      console.error('Error categorizing multiple artifacts:', error);

      // Fallback: categorize artifacts sequentially
      for (const artifact of artifacts) {
        try {
          const categorized = await this.categorizeArtifact(artifact);
          results.push(categorized);
        } catch (individualError) {
          console.error(
            'Error categorizing individual artifact:',
            individualError,
          );
          // Add fallback categorization
          results.push({
            ...artifact,
            category: 'general',
            tags: [],
            priority: 3,
            relatedArtifacts: [],
            categorizationConfidence: 0.5,
          });
        }
      }
    }

    return results;
  }

  getCategorizationStats(artifacts: CategorizedArtifact[]): {
    categoryDistribution: Record<string, number>;
    averageConfidence: number;
    priorityDistribution: Record<number, number>;
    totalArtifacts: number;
  } {
    const categoryDistribution: Record<string, number> = {};
    const priorityDistribution: Record<number, number> = {};
    let totalConfidence = 0;

    artifacts.forEach((artifact) => {
      // Category distribution
      categoryDistribution[artifact.category] =
        (categoryDistribution[artifact.category] || 0) + 1;

      // Priority distribution
      priorityDistribution[artifact.priority] =
        (priorityDistribution[artifact.priority] || 0) + 1;

      // Total confidence
      totalConfidence += artifact.categorizationConfidence;
    });

    return {
      categoryDistribution,
      averageConfidence:
        artifacts.length > 0 ? totalConfidence / artifacts.length : 0,
      priorityDistribution,
      totalArtifacts: artifacts.length,
    };
  }
}
