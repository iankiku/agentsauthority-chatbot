import type { SentimentResult } from './firecrawl-types';

export class SentimentAnalyzer {
  analyzeSentiment(content: string, brandContext: string): SentimentResult {
    // Extract brand-specific context
    const relevantSentences = this.extractBrandSentences(content, brandContext);

    // Simple keyword-based sentiment (enhance with ML later)
    const sentiment = this.calculateKeywordSentiment(relevantSentences);

    return {
      overall: sentiment.overall,
      confidence: sentiment.confidence,
      positiveKeywords: sentiment.positiveWords,
      negativeKeywords: sentiment.negativeWords,
      neutralContext: relevantSentences.filter(
        (s) => !this.containsSentimentKeywords(s),
      ),
    };
  }

  private extractBrandSentences(content: string, brandName: string): string[] {
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const normalizedBrand = brandName.toLowerCase();

    return sentences.filter((sentence) =>
      sentence.toLowerCase().includes(normalizedBrand),
    );
  }

  private calculateKeywordSentiment(sentences: string[]): {
    overall: 'positive' | 'neutral' | 'negative';
    confidence: number;
    positiveWords: string[];
    negativeWords: string[];
  } {
    const positiveKeywords = [
      'excellent',
      'great',
      'amazing',
      'outstanding',
      'innovative',
      'leading',
      'best',
      'superior',
      'impressive',
      'successful',
      'love',
      'fantastic',
      'brilliant',
      'revolutionary',
      'premium',
      'quality',
      'reliable',
      'trusted',
      'popular',
      'growth',
      'improved',
      'better',
      'awesome',
      'incredible',
      'wonderful',
    ];

    const negativeKeywords = [
      'terrible',
      'awful',
      'poor',
      'disappointing',
      'failed',
      'worst',
      'problematic',
      'issues',
      'broken',
      'inadequate',
      'hate',
      'horrible',
      'terrible',
      'disaster',
      'scandal',
      'controversy',
      'lawsuit',
      'recall',
      'defective',
      'expensive',
      'overpriced',
      'cheap',
      'low quality',
      'unreliable',
      'failing',
    ];

    const text = sentences.join(' ').toLowerCase();

    const positiveCount = positiveKeywords.filter((word) =>
      text.includes(word),
    ).length;

    const negativeCount = negativeKeywords.filter((word) =>
      text.includes(word),
    ).length;

    const positiveWords = positiveKeywords.filter((word) => text.includes(word));
    const negativeWords = negativeKeywords.filter((word) => text.includes(word));

    if (positiveCount > negativeCount && positiveCount > 0) {
      return {
        overall: 'positive',
        confidence: Math.min(
          positiveCount / (positiveCount + negativeCount),
          0.9,
        ),
        positiveWords,
        negativeWords,
      };
    } else if (negativeCount > positiveCount && negativeCount > 0) {
      return {
        overall: 'negative',
        confidence: Math.min(
          negativeCount / (positiveCount + negativeCount),
          0.9,
        ),
        positiveWords,
        negativeWords,
      };
    } else {
      return {
        overall: 'neutral',
        confidence: 0.5,
        positiveWords: [],
        negativeWords: [],
      };
    }
  }

  private containsSentimentKeywords(sentence: string): boolean {
    const positiveKeywords = [
      'excellent', 'great', 'amazing', 'outstanding', 'innovative', 'leading',
      'best', 'superior', 'impressive', 'successful', 'love', 'fantastic',
      'brilliant', 'revolutionary', 'premium', 'quality', 'reliable',
      'trusted', 'popular', 'growth', 'improved', 'better', 'awesome',
      'incredible', 'wonderful',
    ];

    const negativeKeywords = [
      'terrible', 'awful', 'poor', 'disappointing', 'failed', 'worst',
      'problematic', 'issues', 'broken', 'inadequate', 'hate', 'horrible',
      'disaster', 'scandal', 'controversy', 'lawsuit', 'recall', 'defective',
      'expensive', 'overpriced', 'cheap', 'low quality', 'unreliable', 'failing',
    ];

    const text = sentence.toLowerCase();
    return positiveKeywords.some((word) => text.includes(word)) ||
           negativeKeywords.some((word) => text.includes(word));
  }
}
