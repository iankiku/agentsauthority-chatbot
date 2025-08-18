import type { Artifact } from '../artifact-processor';

export class CategoryMapper {
  private categoryMap: Record<string, string> = {
    'visibility-matrix': 'brand-visibility',
    'competitive-intelligence': 'competitive-intelligence',
    'content-optimization': 'content-strategy',
    'brand-monitor-report': 'brand-monitoring',
    'keyword-strategy-report': 'keyword-research',
    'brand-monitor': 'brand-monitoring',
    visibilityAcrossModels: 'brand-visibility',
    competitiveIntelligence: 'competitive-intelligence',
    contentOptimization: 'content-strategy',
  };

  determineCategory(artifact: Artifact): string {
    // Direct type mapping
    if (this.categoryMap[artifact.type]) {
      return this.categoryMap[artifact.type];
    }

    // Content-based categorization
    if (artifact.content) {
      // Check for visibility-related content
      if (
        artifact.content.overallScore !== undefined ||
        artifact.content.platformResults ||
        artifact.content.visibilityScore
      ) {
        return 'brand-visibility';
      }

      // Check for competitive analysis content
      if (
        artifact.content.primaryBrand ||
        artifact.content.competitors ||
        artifact.content.marketPosition ||
        artifact.content.shareOfVoice
      ) {
        return 'competitive-intelligence';
      }

      // Check for content optimization
      if (
        artifact.content.platformAnalysis ||
        artifact.content.overallOptimization ||
        artifact.content.targetKeywords
      ) {
        return 'content-strategy';
      }

      // Check for brand monitoring
      if (
        artifact.content.brandName ||
        artifact.content.mentionCount ||
        artifact.content.sentimentAnalysis ||
        artifact.content.credibilityScore
      ) {
        return 'brand-monitoring';
      }

      // Check for keyword research
      if (
        artifact.content.keywords ||
        artifact.content.keywordDensity ||
        artifact.content.searchVolume
      ) {
        return 'keyword-research';
      }
    }

    // Fallback categorization based on metadata
    if (artifact.metadata?.tags) {
      const tags = artifact.metadata.tags.map((tag) => tag.toLowerCase());

      if (tags.includes('competitive') || tags.includes('competitor')) {
        return 'competitive-intelligence';
      }
      if (tags.includes('visibility') || tags.includes('geo')) {
        return 'brand-visibility';
      }
      if (tags.includes('content') || tags.includes('seo')) {
        return 'content-strategy';
      }
      if (tags.includes('monitor') || tags.includes('brand')) {
        return 'brand-monitoring';
      }
      if (tags.includes('keyword') || tags.includes('research')) {
        return 'keyword-research';
      }
    }

    // Default category
    return 'general';
  }

  getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
      'brand-visibility': 'Brand visibility analysis across AI platforms',
      'competitive-intelligence': 'Competitive analysis and market positioning',
      'content-strategy': 'Content optimization and strategy recommendations',
      'brand-monitoring': 'Real-time brand mention monitoring and analysis',
      'keyword-research': 'Keyword strategy and research insights',
      general: 'General artifact without specific categorization',
    };

    return descriptions[category] || 'Unknown category';
  }

  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'brand-visibility': 'blue',
      'competitive-intelligence': 'red',
      'content-strategy': 'green',
      'brand-monitoring': 'orange',
      'keyword-research': 'purple',
      general: 'gray',
    };

    return colors[category] || 'gray';
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'brand-visibility': '👁️',
      'competitive-intelligence': '🎯',
      'content-strategy': '📝',
      'brand-monitoring': '📊',
      'keyword-research': '🔍',
      general: '📄',
    };

    return icons[category] || '📄';
  }

  getAllCategories(): string[] {
    return [
      'brand-visibility',
      'competitive-intelligence',
      'content-strategy',
      'brand-monitoring',
      'keyword-research',
      'general',
    ];
  }

  isKnownCategory(category: string): boolean {
    return this.getAllCategories().includes(category);
  }

  getCategoryHierarchy(): Record<string, string[]> {
    return {
      'brand-visibility': ['visibility-matrix', 'visibilityAcrossModels'],
      'competitive-intelligence': [
        'competitive-intelligence',
        'competitiveIntelligence',
      ],
      'content-strategy': ['content-optimization', 'contentOptimization'],
      'brand-monitoring': ['brand-monitor-report', 'brand-monitor'],
      'keyword-research': ['keyword-strategy-report'],
    };
  }
}
