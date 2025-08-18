import type { Artifact } from '../artifact-processor';

export class TagExtractor {
  async extractTags(artifact: Artifact): Promise<string[]> {
    const tags = new Set<string>();

    try {
      // Extract from metadata tags
      if (artifact.metadata?.tags) {
        artifact.metadata.tags.forEach((tag) => {
          tags.add(tag.toLowerCase().trim());
        });
      }

      // Extract brand names
      if (artifact.content?.brandName) {
        tags.add(artifact.content.brandName.toLowerCase().trim());
      }

      if (artifact.content?.primaryBrand) {
        tags.add(artifact.content.primaryBrand.toLowerCase().trim());
      }

      // Extract competitors
      if (
        artifact.content?.competitors &&
        Array.isArray(artifact.content.competitors)
      ) {
        artifact.content.competitors.forEach((competitor) => {
          tags.add(competitor.toLowerCase().trim());
        });
      }

      // Extract platforms
      if (
        artifact.content?.platformResults &&
        Array.isArray(artifact.content.platformResults)
      ) {
        artifact.content.platformResults.forEach((result) => {
          if (result.model) {
            tags.add(result.model.toLowerCase().trim());
          }
        });
      }

      // Extract target keywords
      if (
        artifact.content?.targetKeywords &&
        Array.isArray(artifact.content.targetKeywords)
      ) {
        artifact.content.targetKeywords.forEach((keyword) => {
          tags.add(keyword.toLowerCase().trim());
        });
      }

      // Extract industry
      if (artifact.content?.industry) {
        tags.add(artifact.content.industry.toLowerCase().trim());
      }

      // Extract content type
      if (artifact.content?.contentType) {
        tags.add(artifact.content.contentType.toLowerCase().trim());
      }

      // Extract from platform analysis
      if (artifact.content?.platformAnalysis) {
        const platforms = Object.keys(artifact.content.platformAnalysis);
        platforms.forEach((platform) => {
          tags.add(platform.toLowerCase().trim());
        });
      }

      // Extract from sentiment analysis
      if (artifact.content?.sentimentAnalysis) {
        if (artifact.content.sentimentAnalysis.overallSentiment) {
          tags.add(
            artifact.content.sentimentAnalysis.overallSentiment
              .toLowerCase()
              .trim(),
          );
        }
      }

      // Extract from market position
      if (artifact.content?.marketPosition) {
        if (artifact.content.marketPosition.position) {
          tags.add(
            artifact.content.marketPosition.position.toLowerCase().trim(),
          );
        }
      }

      // Extract from credibility analysis
      if (artifact.content?.credibilityScore !== undefined) {
        const credibility = this.getCredibilityLevel(
          artifact.content.credibilityScore,
        );
        tags.add(credibility);
      }

      // Extract from overall score
      if (artifact.content?.overallScore !== undefined) {
        const performance = this.getPerformanceLevel(
          artifact.content.overallScore,
        );
        tags.add(performance);
      }

      // Extract from visibility score
      if (artifact.content?.visibilityScore !== undefined) {
        const visibility = this.getVisibilityLevel(
          artifact.content.visibilityScore,
        );
        tags.add(visibility);
      }

      // Add artifact type as tag
      tags.add(artifact.type.toLowerCase().trim());

      // Add category-based tags
      const categoryTags = this.getCategoryTags(artifact.type);
      categoryTags.forEach((tag) => tags.add(tag));

      // Add time-based tags
      const timeTags = this.getTimeBasedTags(artifact.metadata?.timestamp);
      timeTags.forEach((tag) => tags.add(tag));

      // Filter out empty tags and normalize
      const filteredTags = Array.from(tags)
        .filter((tag) => tag.length > 0 && tag.length <= 50)
        .map((tag) => this.normalizeTag(tag));

      return [...new Set(filteredTags)]; // Remove duplicates
    } catch (error) {
      console.error('Error extracting tags from artifact:', error);
      return [];
    }
  }

  private getCredibilityLevel(score: number): string {
    if (score >= 80) return 'high-credibility';
    if (score >= 60) return 'medium-credibility';
    if (score >= 40) return 'low-credibility';
    return 'very-low-credibility';
  }

  private getPerformanceLevel(score: number): string {
    if (score >= 80) return 'high-performance';
    if (score >= 60) return 'medium-performance';
    if (score >= 40) return 'low-performance';
    return 'very-low-performance';
  }

  private getVisibilityLevel(score: number): string {
    if (score >= 80) return 'high-visibility';
    if (score >= 60) return 'medium-visibility';
    if (score >= 40) return 'low-visibility';
    return 'very-low-visibility';
  }

  private getCategoryTags(artifactType: string): string[] {
    const categoryTagMap: Record<string, string[]> = {
      'visibility-matrix': [
        'visibility',
        'geo',
        'ai-platforms',
        'brand-analysis',
      ],
      'competitive-intelligence': [
        'competitive',
        'market-analysis',
        'competitors',
        'positioning',
      ],
      'content-optimization': [
        'content',
        'seo',
        'optimization',
        'ai-platforms',
      ],
      'brand-monitor-report': ['monitoring', 'brand', 'mentions', 'sentiment'],
      'brand-monitor': ['monitoring', 'brand', 'mentions', 'sentiment'],
      'keyword-strategy-report': ['keywords', 'research', 'seo', 'strategy'],
      visibilityAcrossModels: [
        'visibility',
        'geo',
        'ai-platforms',
        'brand-analysis',
      ],
      competitiveIntelligence: [
        'competitive',
        'market-analysis',
        'competitors',
        'positioning',
      ],
      contentOptimization: ['content', 'seo', 'optimization', 'ai-platforms'],
    };

    return categoryTagMap[artifactType] || ['general'];
  }

  private getTimeBasedTags(timestamp?: string): string[] {
    if (!timestamp) return [];

    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) return ['recent', 'today'];
      if (diffInHours < 168) return ['recent', 'this-week']; // 7 days
      if (diffInHours < 720) return ['recent', 'this-month']; // 30 days
      return ['older', 'historical'];
    } catch (error) {
      return [];
    }
  }

  private normalizeTag(tag: string): string {
    return tag
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  async extractTagsFromText(text: string): Promise<string[]> {
    const tags = new Set<string>();

    try {
      // Extract common patterns
      const patterns = [
        /#(\w+)/g, // Hashtags
        /@(\w+)/g, // Mentions
        /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, // Proper nouns
        /\b\d{4}\b/g, // Years
        /\b(?:ai|ml|seo|geo|api|ui|ux)\b/gi, // Common acronyms
      ];

      patterns.forEach((pattern) => {
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach((match) => {
            const normalized = this.normalizeTag(match);
            if (normalized.length > 0) {
              tags.add(normalized);
            }
          });
        }
      });

      return Array.from(tags);
    } catch (error) {
      console.error('Error extracting tags from text:', error);
      return [];
    }
  }

  getPopularTags(artifacts: Artifact[]): { tag: string; count: number }[] {
    const tagCounts: Record<string, number> = {};

    artifacts.forEach((artifact) => {
      if (artifact.metadata?.tags) {
        artifact.metadata.tags.forEach((tag) => {
          const normalized = this.normalizeTag(tag);
          if (normalized.length > 0) {
            tagCounts[normalized] = (tagCounts[normalized] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 tags
  }
}
