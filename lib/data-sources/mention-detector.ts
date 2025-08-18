import type { BrandMention } from './firecrawl-types';

export class MentionDetector {
  detectMentions(content: string, brandName: string): BrandMention[] {
    const mentions: BrandMention[] = [];

    // Exact brand name matches
    const exactMatches = this.findExactMatches(content, brandName);
    mentions.push(...exactMatches);

    // Fuzzy matching for brand variations
    const fuzzyMatches = this.findFuzzyMatches(content, brandName);
    mentions.push(...fuzzyMatches);

    // Context extraction around mentions
    mentions.forEach((mention) => {
      mention.context = this.extractContext(content, mention.position, 100);
    });

    return this.deduplicateMentions(mentions);
  }

  private findExactMatches(content: string, brandName: string): BrandMention[] {
    const regex = new RegExp(`\\b${this.escapeRegex(brandName)}\\b`, 'gi');
    const matches = Array.from(content.matchAll(regex));

    return matches.map((match) => ({
      text: match[0],
      position: match.index || 0,
      type: 'exact',
      confidence: 1.0,
    }));
  }

  private findFuzzyMatches(content: string, brandName: string): BrandMention[] {
    // Implement fuzzy matching for brand variations
    const variations = this.generateBrandVariations(brandName);
    const fuzzyMatches: BrandMention[] = [];

    variations.forEach((variation) => {
      const regex = new RegExp(`\\b${this.escapeRegex(variation)}\\b`, 'gi');
      const matches = Array.from(content.matchAll(regex));

      matches.forEach((match) => {
        fuzzyMatches.push({
          text: match[0],
          position: match.index || 0,
          type: 'fuzzy',
          confidence: this.calculateFuzzyConfidence(variation, brandName),
        });
      });
    });

    return fuzzyMatches;
  }

  private generateBrandVariations(brandName: string): string[] {
    const variations: string[] = [];

    // Common brand name variations
    const commonVariations = [
      brandName.toLowerCase(),
      brandName.toUpperCase(),
      brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase(),
    ];

    // Handle multi-word brand names
    if (brandName.includes(' ')) {
      const words = brandName.split(' ');
      variations.push(
        words
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(' '),
      );
      variations.push(words.map((word) => word.toUpperCase()).join(' '));
      variations.push(words.join('').toLowerCase());
      variations.push(words.join('').toUpperCase());
    }

    // Handle special characters and abbreviations
    if (brandName.includes('&')) {
      variations.push(brandName.replace('&', 'and'));
      variations.push(brandName.replace('&', 'AND'));
    }

    if (brandName.includes('.')) {
      variations.push(brandName.replace(/\./g, ''));
      variations.push(brandName.replace(/\./g, ' '));
    }

    return [...new Set([...commonVariations, ...variations])];
  }

  private calculateFuzzyConfidence(
    variation: string,
    originalBrand: string,
  ): number {
    // Simple similarity calculation
    const maxLength = Math.max(variation.length, originalBrand.length);
    const minLength = Math.min(variation.length, originalBrand.length);

    if (maxLength === 0) return 0;

    const similarity = minLength / maxLength;
    return Math.max(0.5, similarity); // Minimum confidence of 0.5 for fuzzy matches
  }

  private extractContext(
    content: string,
    position: number,
    contextLength: number,
  ): string {
    const start = Math.max(0, position - contextLength / 2);
    const end = Math.min(content.length, position + contextLength / 2);

    let context = content.substring(start, end);

    // Try to start at a word boundary
    const firstSpace = context.indexOf(' ');
    if (firstSpace > 0 && firstSpace < contextLength / 4) {
      context = context.substring(firstSpace + 1);
    }

    // Try to end at a word boundary
    const lastSpace = context.lastIndexOf(' ');
    if (lastSpace > context.length - contextLength / 4) {
      context = context.substring(0, lastSpace);
    }

    return context.trim();
  }

  private deduplicateMentions(mentions: BrandMention[]): BrandMention[] {
    const seen = new Set<string>();
    const unique: BrandMention[] = [];

    mentions.forEach((mention) => {
      const key = `${mention.text}-${mention.position}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(mention);
      }
    });

    return unique.sort((a, b) => a.position - b.position);
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
