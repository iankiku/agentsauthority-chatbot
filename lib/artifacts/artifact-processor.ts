import type { BrandMonitorResult } from '../ai/tools/brand-monitor-tool';
import type { CompetitiveAnalysisResult } from '../ai/tools/competitive-intelligence-tool';
import type { ContentOptimizationResult } from '../ai/tools/content-optimization-tool';
import type { VisibilityAnalysisResult } from '../ai/tools/types';
import {
  ArtifactCategorizer,
  type CategorizedArtifact,
} from './categorization/artifact-categorizer';

export interface ConversationContext {
  userId: string;
  conversationId: string;
  timestamp: string;
}

export interface Artifact {
  id: string;
  type: string;
  title: string;
  content: any;
  metadata: {
    brandName?: string;
    timestamp: string;
    category: string;
    tags: string[];
    generatedBy: string;
    userId: string;
    conversationId: string;
  };
}

export class ArtifactProcessor {
  private categorizer: ArtifactCategorizer;

  constructor() {
    this.categorizer = new ArtifactCategorizer();
  }

  async processToolResult(
    toolName: string,
    result: any,
    context: ConversationContext,
  ): Promise<CategorizedArtifact> {
    // Create base artifact
    const baseArtifact = await this.createBaseArtifact(
      toolName,
      result,
      context,
    );

    // Categorize artifact
    const categorizedArtifact =
      await this.categorizer.categorizeArtifact(baseArtifact);

    // Save categorized artifact
    await this.saveCategorizedArtifact(categorizedArtifact);

    return categorizedArtifact;
  }

  private async createBaseArtifact(
    toolName: string,
    result: any,
    context: ConversationContext,
  ): Promise<Artifact> {
    switch (toolName) {
      case 'visibilityAcrossModels':
        return this.createVisibilityArtifact(result, context);

      case 'brandMonitor':
        return this.createBrandMonitorArtifact(result, context);

      case 'competitiveIntelligence':
        return this.createCompetitiveIntelligenceArtifact(result, context);

      case 'contentOptimization':
        return this.createContentOptimizationArtifact(result, context);

      default:
        return this.createGenericArtifact(result, context);
    }
  }

  private async createVisibilityArtifact(
    result: VisibilityAnalysisResult,
    context: ConversationContext,
  ): Promise<Artifact> {
    const artifact: Artifact = {
      id: this.generateId(),
      type: 'visibility-matrix',
      title: `Brand Visibility Analysis - ${result.brandName}`,
      content: result,
      metadata: {
        brandName: result.brandName,
        timestamp: result.timestamp,
        category: 'visibility-analysis',
        tags: ['brand-visibility', 'multi-model-analysis', 'geo'],
        generatedBy: 'visibilityAcrossModels',
        userId: context.userId,
        conversationId: context.conversationId,
      },
    };

    // In a real implementation, this would persist to database
    await this.saveArtifact(artifact);
    return artifact;
  }

  private async createBrandMonitorArtifact(
    result: BrandMonitorResult,
    context: ConversationContext,
  ): Promise<Artifact> {
    const artifact: Artifact = {
      id: this.generateId(),
      type: 'brand-monitor',
      title: `Brand Monitoring Report - ${result.brandName}`,
      content: result,
      metadata: {
        brandName: result.brandName,
        timestamp: result.timestamp,
        category: 'brand-monitoring',
        tags: ['brand-monitoring', 'web-scraping', 'sentiment-analysis', 'geo'],
        generatedBy: 'brandMonitor',
        userId: context.userId,
        conversationId: context.conversationId,
      },
    };

    await this.saveArtifact(artifact);
    return artifact;
  }

  private async createCompetitiveIntelligenceArtifact(
    result: CompetitiveAnalysisResult,
    context: ConversationContext,
  ): Promise<Artifact> {
    const artifact: Artifact = {
      id: this.generateId(),
      type: 'competitive-intelligence',
      title: `Competitive Analysis - ${result.primaryBrand} vs ${result.competitors.join(', ')}`,
      content: result,
      metadata: {
        brandName: result.primaryBrand,
        timestamp: new Date().toISOString(),
        category: 'competitive-analysis',
        tags: [
          'competitive-intelligence',
          'market-analysis',
          'competitive-positioning',
          'geo',
        ],
        generatedBy: 'competitiveIntelligence',
        userId: context.userId,
        conversationId: context.conversationId,
      },
    };

    await this.saveArtifact(artifact);
    return artifact;
  }

  private async createContentOptimizationArtifact(
    result: ContentOptimizationResult,
    context: ConversationContext,
  ): Promise<Artifact> {
    const artifact: Artifact = {
      id: this.generateId(),
      type: 'content-optimization',
      title: `Content Optimization Analysis - ${result.contentType || 'Content'}`,
      content: result,
      metadata: {
        brandName: undefined, // Content optimization doesn't have a specific brand
        timestamp: new Date().toISOString(),
        category: 'content-optimization',
        tags: ['content-optimization', 'seo', 'ai-platforms', 'geo'],
        generatedBy: 'contentOptimization',
        userId: context.userId,
        conversationId: context.conversationId,
      },
    };

    await this.saveArtifact(artifact);
    return artifact;
  }

  private async createGenericArtifact(
    result: any,
    context: ConversationContext,
  ): Promise<Artifact> {
    const artifact: Artifact = {
      id: this.generateId(),
      type: 'generic',
      title: 'Tool Result',
      content: result,
      metadata: {
        timestamp: new Date().toISOString(),
        category: 'tool-result',
        tags: ['tool-output'],
        generatedBy: 'unknown',
        userId: context.userId,
        conversationId: context.conversationId,
      },
    };

    await this.saveArtifact(artifact);
    return artifact;
  }

  private generateId(): string {
    return `artifact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async saveArtifact(artifact: Artifact): Promise<void> {
    // In a real implementation, this would save to database
    console.log('Saving artifact:', artifact.id, artifact.type);

    // For now, just log the artifact creation
    // TODO: Implement database persistence
  }

  private async saveCategorizedArtifact(
    artifact: CategorizedArtifact,
  ): Promise<void> {
    console.log(
      'Saving categorized artifact:',
      artifact.id,
      artifact.type,
      artifact.category,
    );
    console.log('Tags:', artifact.tags);
    console.log('Priority:', artifact.priority);
    console.log('Confidence:', artifact.categorizationConfidence);
    console.log('Related artifacts:', artifact.relatedArtifacts.length);

    // In a real implementation, this would save to database with categorization data
    // TODO: Implement database persistence with categorization fields
  }
}
