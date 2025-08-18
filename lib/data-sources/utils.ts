import type { SentimentType } from './types';

/**
 * Count brand mentions in text (case-insensitive)
 */
export function countBrandMentions(text: string, brandName: string): number {
  if (!text || !brandName) return 0;

  const normalizedText = text.toLowerCase();
  const normalizedBrand = brandName.toLowerCase();

  // Simple word boundary matching
  const regex = new RegExp(
    `\\b${normalizedBrand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
    'gi',
  );
  const matches = normalizedText.match(regex);

  return matches ? matches.length : 0;
}

/**
 * Analyze sentiment based on keyword presence
 */
export function analyzeSentiment(
  text: string,
  brandName: string,
): SentimentType {
  if (!text || !brandName) return 'neutral';

  const normalizedText = text.toLowerCase();
  const normalizedBrand = brandName.toLowerCase();

  // Positive keywords
  const positiveKeywords = [
    'excellent',
    'amazing',
    'great',
    'outstanding',
    'fantastic',
    'brilliant',
    'innovative',
    'revolutionary',
    'best',
    'top',
    'leading',
    'premium',
    'quality',
    'reliable',
    'trusted',
    'popular',
    'successful',
    'growth',
  ];

  // Negative keywords
  const negativeKeywords = [
    'terrible',
    'awful',
    'horrible',
    'worst',
    'disappointing',
    'failing',
    'bankrupt',
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
  ];

  // Check if brand is mentioned
  const brandMentioned = normalizedText.includes(normalizedBrand);
  if (!brandMentioned) return 'neutral';

  // Count positive and negative keywords
  let positiveCount = 0;
  let negativeCount = 0;

  positiveKeywords.forEach((keyword) => {
    if (normalizedText.includes(keyword)) positiveCount++;
  });

  negativeKeywords.forEach((keyword) => {
    if (normalizedText.includes(keyword)) negativeCount++;
  });

  // Determine sentiment based on keyword balance
  if (positiveCount > negativeCount && positiveCount > 0) {
    return 'positive';
  } else if (negativeCount > positiveCount && negativeCount > 0) {
    return 'negative';
  }

  return 'neutral';
}

/**
 * Calculate visibility score (0-100) based on mentions and context
 */
export function calculateVisibilityScore(
  text: string,
  brandName: string,
): number {
  if (!text || !brandName) return 0;

  const mentions = countBrandMentions(text, brandName);
  const normalizedText = text.toLowerCase();
  const normalizedBrand = brandName.toLowerCase();

  // Base score from mentions (0-50 points)
  let score = Math.min(mentions * 10, 50);

  // Context bonus (0-30 points)
  const contextKeywords = [
    'market',
    'industry',
    'sector',
    'business',
    'company',
    'brand',
    'product',
    'service',
    'technology',
    'innovation',
    'leadership',
  ];

  let contextScore = 0;
  contextKeywords.forEach((keyword) => {
    if (normalizedText.includes(keyword)) contextScore += 2;
  });
  score += Math.min(contextScore, 30);

  // Sentiment bonus (0-20 points)
  const sentiment = analyzeSentiment(text, brandName);
  if (sentiment === 'positive') {
    score += 20;
  } else if (sentiment === 'neutral') {
    score += 10;
  }

  return Math.min(Math.max(score, 0), 100);
}

/**
 * Extract relevant context sentences containing brand mentions
 */
export function extractContext(text: string, brandName: string): string[] {
  if (!text || !brandName) return [];

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const normalizedBrand = brandName.toLowerCase();
  const context: string[] = [];

  sentences.forEach((sentence) => {
    if (sentence.toLowerCase().includes(normalizedBrand)) {
      context.push(sentence.trim());
    }
  });

  return context.slice(0, 5); // Limit to 5 most relevant sentences
}

/**
 * Calculate average sentiment from multiple results
 */
export function calculateAverageSentiment(
  sentiments: SentimentType[],
): SentimentType {
  if (sentiments.length === 0) return 'neutral';

  const counts = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  sentiments.forEach((sentiment) => {
    counts[sentiment]++;
  });

  if (counts.positive > counts.negative && counts.positive > counts.neutral) {
    return 'positive';
  } else if (
    counts.negative > counts.positive &&
    counts.negative > counts.neutral
  ) {
    return 'negative';
  }

  return 'neutral';
}
