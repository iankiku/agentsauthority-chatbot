import type { Artifact } from '../artifact-processor';

export interface ArtifactRelationship {
  artifactId: string;
  relationshipType: 'brand' | 'category' | 'keyword' | 'time' | 'similarity';
  strength: number; // 0-1 scale
  metadata?: Record<string, any>;
}

export class RelationshipDetector {
  async findRelatedArtifacts(
    artifact: Artifact,
    category: string,
  ): Promise<string[]> {
    const relationships: ArtifactRelationship[] = [];

    try {
      // Find brand-based relationships
      const brandRelationships = await this.findBrandRelationships(artifact);
      relationships.push(...brandRelationships);

      // Find category-based relationships
      const categoryRelationships = await this.findCategoryRelationships(
        artifact,
        category,
      );
      relationships.push(...categoryRelationships);

      // Find keyword-based relationships
      const keywordRelationships =
        await this.findKeywordRelationships(artifact);
      relationships.push(...keywordRelationships);

      // Find time-based relationships
      const timeRelationships = await this.findTimeRelationships(artifact);
      relationships.push(...timeRelationships);

      // Find similarity-based relationships
      const similarityRelationships =
        await this.findSimilarityRelationships(artifact);
      relationships.push(...similarityRelationships);

      // Sort by relationship strength and return unique artifact IDs
      const sortedRelationships = relationships.sort(
        (a, b) => b.strength - a.strength,
      );
      const uniqueArtifactIds = [
        ...new Set(sortedRelationships.map((r) => r.artifactId)),
      ];

      return uniqueArtifactIds.slice(0, 10); // Limit to top 10 related artifacts
    } catch (error) {
      console.error('Error finding related artifacts:', error);
      return [];
    }
  }

  private async findBrandRelationships(
    artifact: Artifact,
  ): Promise<ArtifactRelationship[]> {
    const relationships: ArtifactRelationship[] = [];

    try {
      const brandName =
        artifact.content?.brandName || artifact.content?.primaryBrand;
      if (!brandName) return relationships;

      // Mock: In a real implementation, this would query the database
      // For now, we'll simulate finding related artifacts
      const mockRelatedArtifacts =
        await this.getMockArtifactsByBrand(brandName);

      mockRelatedArtifacts.forEach((relatedArtifact) => {
        relationships.push({
          artifactId: relatedArtifact.id,
          relationshipType: 'brand',
          strength: 0.9, // High strength for brand relationships
          metadata: {
            brandName,
            relationshipReason: 'Same brand analysis',
          },
        });
      });
    } catch (error) {
      console.error('Error finding brand relationships:', error);
    }

    return relationships;
  }

  private async findCategoryRelationships(
    artifact: Artifact,
    category: string,
  ): Promise<ArtifactRelationship[]> {
    const relationships: ArtifactRelationship[] = [];

    try {
      // Mock: In a real implementation, this would query the database
      const mockRelatedArtifacts =
        await this.getMockArtifactsByCategory(category);

      mockRelatedArtifacts.forEach((relatedArtifact) => {
        if (relatedArtifact.id !== artifact.id) {
          relationships.push({
            artifactId: relatedArtifact.id,
            relationshipType: 'category',
            strength: 0.7, // Medium strength for category relationships
            metadata: {
              category,
              relationshipReason: 'Same category analysis',
            },
          });
        }
      });
    } catch (error) {
      console.error('Error finding category relationships:', error);
    }

    return relationships;
  }

  private async findKeywordRelationships(
    artifact: Artifact,
  ): Promise<ArtifactRelationship[]> {
    const relationships: ArtifactRelationship[] = [];

    try {
      const keywords = this.extractKeywords(artifact);
      if (keywords.length === 0) return relationships;

      // Mock: In a real implementation, this would query the database
      const mockRelatedArtifacts =
        await this.getMockArtifactsByKeywords(keywords);

      mockRelatedArtifacts.forEach((relatedArtifact) => {
        if (relatedArtifact.id !== artifact.id) {
          const keywordOverlap = this.calculateKeywordOverlap(
            keywords,
            relatedArtifact,
          );
          relationships.push({
            artifactId: relatedArtifact.id,
            relationshipType: 'keyword',
            strength: keywordOverlap * 0.6, // Medium strength for keyword relationships
            metadata: {
              keywords: keywords.filter((k) =>
                this.hasKeyword(relatedArtifact, k),
              ),
              relationshipReason: 'Keyword overlap',
            },
          });
        }
      });
    } catch (error) {
      console.error('Error finding keyword relationships:', error);
    }

    return relationships;
  }

  private async findTimeRelationships(
    artifact: Artifact,
  ): Promise<ArtifactRelationship[]> {
    const relationships: ArtifactRelationship[] = [];

    try {
      const artifactTimestamp = artifact.metadata?.timestamp;
      if (!artifactTimestamp) return relationships;

      // Mock: In a real implementation, this would query the database
      const mockRelatedArtifacts =
        await this.getMockArtifactsByTime(artifactTimestamp);

      mockRelatedArtifacts.forEach((relatedArtifact) => {
        if (relatedArtifact.id !== artifact.id) {
          const timeDifference = this.calculateTimeDifference(
            artifactTimestamp,
            relatedArtifact.metadata?.timestamp,
          );
          const strength = this.calculateTimeStrength(timeDifference);
          relationships.push({
            artifactId: relatedArtifact.id,
            relationshipType: 'time',
            strength,
            metadata: {
              timeDifference,
              relationshipReason: 'Temporal proximity',
            },
          });
        }
      });
    } catch (error) {
      console.error('Error finding time relationships:', error);
    }

    return relationships;
  }

  private async findSimilarityRelationships(
    artifact: Artifact,
  ): Promise<ArtifactRelationship[]> {
    const relationships: ArtifactRelationship[] = [];

    try {
      // Mock: In a real implementation, this would use more sophisticated similarity algorithms
      const mockRelatedArtifacts =
        await this.getMockArtifactsBySimilarity(artifact);

      mockRelatedArtifacts.forEach((relatedArtifact) => {
        if (relatedArtifact.id !== artifact.id) {
          const similarity = this.calculateSimilarity(
            artifact,
            relatedArtifact,
          );
          if (similarity > 0.3) {
            relationships.push({
              artifactId: relatedArtifact.id,
              relationshipType: 'similarity',
              strength: similarity * 0.5, // Lower strength for similarity relationships
              metadata: {
                similarity,
                relationshipReason: 'Content similarity',
              },
            });
          }
        }
      });
    } catch (error) {
      console.error('Error finding similarity relationships:', error);
    }

    return relationships;
  }

  private extractKeywords(artifact: Artifact): string[] {
    const keywords: string[] = [];

    // Extract from target keywords
    if (
      artifact.content?.targetKeywords &&
      Array.isArray(artifact.content.targetKeywords)
    ) {
      keywords.push(...artifact.content.targetKeywords);
    }

    // Extract from metadata tags
    if (artifact.metadata?.tags && Array.isArray(artifact.metadata.tags)) {
      keywords.push(...artifact.metadata.tags);
    }

    // Extract from title
    if (artifact.title) {
      const titleKeywords = artifact.title.toLowerCase().split(/\s+/);
      keywords.push(...titleKeywords.filter((word) => word.length > 3));
    }

    return [...new Set(keywords)].map((k) => k.toLowerCase().trim());
  }

  private hasKeyword(artifact: Artifact, keyword: string): boolean {
    const artifactKeywords = this.extractKeywords(artifact);
    return artifactKeywords.some(
      (k) => k.includes(keyword) || keyword.includes(k),
    );
  }

  private calculateKeywordOverlap(
    keywords1: string[],
    artifact2: Artifact,
  ): number {
    const keywords2 = this.extractKeywords(artifact2);
    const intersection = keywords1.filter((k1) =>
      keywords2.some((k2) => k1.includes(k2) || k2.includes(k1)),
    );
    const union = [...new Set([...keywords1, ...keywords2])];
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  private calculateTimeDifference(
    timestamp1: string,
    timestamp2?: string,
  ): number {
    if (!timestamp2) return Number.POSITIVE_INFINITY;
    try {
      const date1 = new Date(timestamp1);
      const date2 = new Date(timestamp2);
      return Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60); // Hours
    } catch (error) {
      return Number.POSITIVE_INFINITY;
    }
  }

  private calculateTimeStrength(timeDifference: number): number {
    if (timeDifference < 1) return 0.8; // Same hour
    if (timeDifference < 24) return 0.6; // Same day
    if (timeDifference < 168) return 0.4; // Same week
    if (timeDifference < 720) return 0.2; // Same month
    return 0.1; // Older
  }

  private calculateSimilarity(
    artifact1: Artifact,
    artifact2: Artifact,
  ): number {
    let similarity = 0;
    let factors = 0;

    // Type similarity
    if (artifact1.type === artifact2.type) {
      similarity += 0.3;
    }
    factors += 1;

    // Category similarity
    if (artifact1.metadata?.category === artifact2.metadata?.category) {
      similarity += 0.2;
    }
    factors += 1;

    // Keyword similarity
    const keywords1 = this.extractKeywords(artifact1);
    const keywords2 = this.extractKeywords(artifact2);
    const keywordSimilarity = this.calculateKeywordOverlap(
      keywords1,
      artifact2,
    );
    similarity += keywordSimilarity * 0.3;
    factors += 1;

    // Brand similarity
    const brand1 =
      artifact1.content?.brandName || artifact1.content?.primaryBrand;
    const brand2 =
      artifact2.content?.brandName || artifact2.content?.primaryBrand;
    if (brand1 && brand2 && brand1.toLowerCase() === brand2.toLowerCase()) {
      similarity += 0.2;
    }
    factors += 1;

    return factors > 0 ? similarity / factors : 0;
  }

  // Mock methods for demonstration - in real implementation, these would query the database
  private async getMockArtifactsByBrand(
    brandName: string,
  ): Promise<Artifact[]> {
    // Mock implementation
    return [];
  }

  private async getMockArtifactsByCategory(
    category: string,
  ): Promise<Artifact[]> {
    // Mock implementation
    return [];
  }

  private async getMockArtifactsByKeywords(
    keywords: string[],
  ): Promise<Artifact[]> {
    // Mock implementation
    return [];
  }

  private async getMockArtifactsByTime(timestamp: string): Promise<Artifact[]> {
    // Mock implementation
    return [];
  }

  private async getMockArtifactsBySimilarity(
    artifact: Artifact,
  ): Promise<Artifact[]> {
    // Mock implementation
    return [];
  }

  async getRelationshipGraph(artifacts: Artifact[]): Promise<{
    nodes: Array<{ id: string; label: string; category: string }>;
    edges: Array<{
      source: string;
      target: string;
      strength: number;
      type: string;
    }>;
  }> {
    const nodes: Array<{ id: string; label: string; category: string }> = [];
    const edges: Array<{
      source: string;
      target: string;
      strength: number;
      type: string;
    }> = [];

    try {
      // Create nodes
      artifacts.forEach((artifact) => {
        nodes.push({
          id: artifact.id,
          label: artifact.title,
          category: artifact.type,
        });
      });

      // Create edges for related artifacts
      for (const artifact of artifacts) {
        const relatedArtifacts = await this.findRelatedArtifacts(
          artifact,
          artifact.type,
        );

        relatedArtifacts.forEach((relatedId) => {
          if (artifacts.some((a) => a.id === relatedId)) {
            edges.push({
              source: artifact.id,
              target: relatedId,
              strength: 0.5, // Default strength
              type: 'related',
            });
          }
        });
      }
    } catch (error) {
      console.error('Error creating relationship graph:', error);
    }

    return { nodes, edges };
  }
}
