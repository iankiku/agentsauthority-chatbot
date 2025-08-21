import { tool } from 'ai';
import { z } from 'zod';

export interface BrandDetectionResult {
  brandName: string;
  originalText: string;
  detectionMode: 'exact' | 'fuzzy' | 'semantic' | 'comprehensive';
  mentions: Array<{
    text: string;
    brandName: string;
    confidence: number;
    context: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    mentionType: 'direct' | 'indirect' | 'reference' | 'comparison';
    position: {
      start: number;
      end: number;
      line: number;
    };
    frequency: number;
    variations: string[];
    category: string;
    keyPhrases: string[];
  }>;
  summary: {
    totalMentions: number;
    uniqueMentions: number;
    averageConfidence: number;
    sentimentDistribution: {
      positive: number;
      neutral: number;
      negative: number;
    };
    mentionTypes: {
      direct: number;
      indirect: number;
      reference: number;
      comparison: number;
    };
  };
  metadata: {
    language: string;
    textLength: number;
    processingTime: number;
    category: 'brand-detection';
  };
}

interface BrandMention {
  text: string;
  brandName: string;
  confidence: number;
  context?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  mentionType?: 'direct' | 'indirect' | 'reference' | 'comparison';
  position: {
    start: number;
    end: number;
    line: number;
  };
  frequency: number;
  variations: string[];
  category: string;
  keyPhrases: string[];
  detectionMethod: 'exact' | 'fuzzy' | 'semantic';
}

export const brandDetectionTool = tool({
  description: 'Advanced brand mention detection with context analysis',
  inputSchema: z.object({
    text: z.string().min(1).max(10000),
    brandName: z.string().min(1).max(100),
    brandAliases: z.array(z.string()).optional(),
    language: z.enum(['en', 'es', 'fr', 'de', 'auto']).default('auto'),
    detectionMode: z
      .enum(['exact', 'fuzzy', 'semantic', 'comprehensive'])
      .default('comprehensive'),
    includeContext: z.boolean().default(true),
    minConfidence: z.number().min(0).max(1).default(0.7),
  }),
  handler: async (ctx, args) => {
    const {
      text,
      brandName,
      brandAliases,
      language,
      detectionMode,
      includeContext,
      minConfidence,
    } = args;

    try {
      // Step 1: Preprocess text and normalize brand names
      const normalizedText = await preprocessText(text, language);
      const normalizedBrandNames = await normalizeBrandNames(
        brandName,
        brandAliases,
      );

      // Step 2: Perform brand detection based on mode
      const detectedMentions = await detectBrandMentions(
        normalizedText,
        normalizedBrandNames,
        detectionMode,
      );

      // Step 3: Extract context for each mention
      const mentionsWithContext = includeContext
        ? await extractMentionContext(detectedMentions, normalizedText)
        : detectedMentions;

      // Step 4: Analyze sentiment for each mention
      const mentionsWithSentiment =
        await analyzeMentionSentiment(mentionsWithContext);

      // Step 5: Calculate confidence scores
      const scoredMentions = await calculateMentionConfidence(
        mentionsWithSentiment,
      );

      // Step 6: Filter by confidence threshold
      const filteredMentions = scoredMentions.filter(
        (mention) => mention.confidence >= minConfidence,
      );

      // Step 7: Categorize and classify mentions
      const categorizedMentions = await categorizeMentions(filteredMentions);

      return {
        brandName,
        originalText: text,
        detectionMode,
        mentions: categorizedMentions,
        summary: {
          totalMentions: categorizedMentions.length,
          uniqueMentions: new Set(categorizedMentions.map((m) => m.text)).size,
          averageConfidence:
            categorizedMentions.reduce((sum, m) => sum + m.confidence, 0) /
            categorizedMentions.length,
          sentimentDistribution:
            calculateSentimentDistribution(categorizedMentions),
          mentionTypes: calculateMentionTypeDistribution(categorizedMentions),
        },
        metadata: {
          language: language,
          textLength: text.length,
          processingTime: Date.now(),
          category: 'brand-detection',
        },
      };
    } catch (error) {
      throw new Error(
        `Brand detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  },
});

async function preprocessText(text: string, language: string): Promise<string> {
  // Mock text preprocessing - replace with actual preprocessing logic
  return text.toLowerCase().trim();
}

async function normalizeBrandNames(
  brandName: string,
  brandAliases?: string[],
): Promise<string[]> {
  const names = [brandName];
  if (brandAliases) {
    names.push(...brandAliases);
  }
  return names.map((name) => name.toLowerCase().trim());
}

async function detectBrandMentions(
  text: string,
  brandNames: string[],
  mode: string,
): Promise<BrandMention[]> {
  const mentions: BrandMention[] = [];

  switch (mode) {
    case 'exact':
      mentions.push(...(await exactMatchDetection(text, brandNames)));
      break;
    case 'fuzzy':
      mentions.push(...(await fuzzyMatchDetection(text, brandNames)));
      break;
    case 'semantic':
      mentions.push(...(await semanticDetection(text, brandNames)));
      break;
    case 'comprehensive':
      mentions.push(...(await exactMatchDetection(text, brandNames)));
      mentions.push(...(await fuzzyMatchDetection(text, brandNames)));
      mentions.push(...(await semanticDetection(text, brandNames)));
      break;
  }

  return deduplicateMentions(mentions);
}

async function exactMatchDetection(
  text: string,
  brandNames: string[],
): Promise<BrandMention[]> {
  const mentions: BrandMention[] = [];

  brandNames.forEach((brandName) => {
    const regex = new RegExp(`\\b${brandName}\\b`, 'gi');
    let match: RegExpExecArray | null;

    match = regex.exec(text);
    while (match !== null) {
      mentions.push({
        text: match[0],
        brandName: brandName,
        confidence: 0.9,
        position: {
          start: match.index,
          end: match.index + match[0].length,
          line: 1, // Mock line number
        },
        frequency: 1,
        variations: [match[0]],
        category: 'exact-match',
        keyPhrases: [],
        detectionMethod: 'exact',
      });
      match = regex.exec(text);
    }
  });

  return mentions;
}

async function fuzzyMatchDetection(
  text: string,
  brandNames: string[],
): Promise<BrandMention[]> {
  // Mock fuzzy matching - replace with actual fuzzy matching logic
  const mentions: BrandMention[] = [];

  brandNames.forEach((brandName) => {
    // Simple substring matching as mock fuzzy detection
    const lowerText = text.toLowerCase();
    const lowerBrand = brandName.toLowerCase();

    if (lowerText.includes(lowerBrand)) {
      const startIndex = lowerText.indexOf(lowerBrand);
      mentions.push({
        text: text.substring(startIndex, startIndex + brandName.length),
        brandName: brandName,
        confidence: 0.7,
        position: {
          start: startIndex,
          end: startIndex + brandName.length,
          line: 1,
        },
        frequency: 1,
        variations: [brandName],
        category: 'fuzzy-match',
        keyPhrases: [],
        detectionMethod: 'fuzzy',
      });
    }
  });

  return mentions;
}

async function semanticDetection(
  text: string,
  brandNames: string[],
): Promise<BrandMention[]> {
  // Mock semantic detection - replace with actual AI-based semantic detection
  const mentions: BrandMention[] = [];

  // Mock AI response for semantic detection
  const aiResponse = await queryAI(
    `Find brand mentions of ${brandNames.join(', ')} in this text: ${text}`,
  );

  // Parse AI response for semantic mentions
  if (aiResponse.includes('brand mention')) {
    brandNames.forEach((brandName) => {
      mentions.push({
        text: brandName,
        brandName: brandName,
        confidence: 0.8,
        position: {
          start: 0,
          end: brandName.length,
          line: 1,
        },
        frequency: 1,
        variations: [brandName],
        category: 'semantic-match',
        keyPhrases: [],
        detectionMethod: 'semantic',
      });
    });
  }

  return mentions;
}

async function extractMentionContext(
  mentions: BrandMention[],
  text: string,
): Promise<BrandMention[]> {
  return mentions.map((mention) => {
    const contextWindow = 200; // characters before and after
    const start = Math.max(0, mention.position.start - contextWindow);
    const end = Math.min(text.length, mention.position.end + contextWindow);
    const context = text.substring(start, end);

    return {
      ...mention,
      context: context.trim(),
    };
  });
}

async function analyzeMentionSentiment(
  mentions: BrandMention[],
): Promise<BrandMention[]> {
  return Promise.all(
    mentions.map(async (mention) => {
      const sentiment = await analyzeTextSentiment(
        mention.context || mention.text,
      );
      return {
        ...mention,
        sentiment,
      };
    }),
  );
}

async function calculateMentionConfidence(
  mentions: BrandMention[],
): Promise<BrandMention[]> {
  return mentions.map((mention) => {
    let confidence = 0;

    // Base confidence from detection method
    if (mention.detectionMethod === 'exact') confidence += 0.8;
    else if (mention.detectionMethod === 'fuzzy') confidence += 0.6;
    else if (mention.detectionMethod === 'semantic') confidence += 0.7;

    // Adjust based on context quality
    if (mention.context && mention.context.length > 50) confidence += 0.1;

    // Adjust based on mention frequency
    if (mention.frequency > 1) confidence += 0.05;

    // Adjust based on text quality
    if (mention.text.length > 2) confidence += 0.05;

    return {
      ...mention,
      confidence: Math.min(confidence, 1.0),
    };
  });
}

async function categorizeMentions(
  mentions: BrandMention[],
): Promise<BrandDetectionResult['mentions']> {
  return mentions.map((mention) => {
    // Determine mention type based on context and patterns
    let mentionType: 'direct' | 'indirect' | 'reference' | 'comparison' =
      'direct';

    if (mention.context) {
      const context = mention.context.toLowerCase();
      if (context.includes('compared to') || context.includes('versus')) {
        mentionType = 'comparison';
      } else if (
        context.includes('mentioned') ||
        context.includes('referenced')
      ) {
        mentionType = 'reference';
      } else if (context.includes('similar to') || context.includes('like')) {
        mentionType = 'indirect';
      }
    }

    return {
      text: mention.text,
      brandName: mention.brandName,
      confidence: mention.confidence,
      context: mention.context || '',
      sentiment: mention.sentiment || 'neutral',
      mentionType,
      position: mention.position,
      frequency: mention.frequency,
      variations: mention.variations,
      category: mention.category,
      keyPhrases: mention.keyPhrases,
    };
  });
}

function deduplicateMentions(mentions: BrandMention[]): BrandMention[] {
  const seen = new Set<string>();
  return mentions.filter((mention) => {
    const key = `${mention.brandName}-${mention.position.start}-${mention.position.end}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

async function analyzeTextSentiment(
  text: string,
): Promise<'positive' | 'neutral' | 'negative'> {
  // Mock sentiment analysis - replace with actual sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'innovative'];
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'disappointing'];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter((word) =>
    lowerText.includes(word),
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    lowerText.includes(word),
  ).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function calculateSentimentDistribution(
  mentions: BrandDetectionResult['mentions'],
): { positive: number; neutral: number; negative: number } {
  const distribution = { positive: 0, neutral: 0, negative: 0 };

  mentions.forEach((mention) => {
    distribution[mention.sentiment]++;
  });

  return distribution;
}

function calculateMentionTypeDistribution(
  mentions: BrandDetectionResult['mentions'],
): { direct: number; indirect: number; reference: number; comparison: number } {
  const distribution = { direct: 0, indirect: 0, reference: 0, comparison: 0 };

  mentions.forEach((mention) => {
    distribution[mention.mentionType]++;
  });

  return distribution;
}

// Mock AI query function - replace with actual AI provider integration
async function queryAI(prompt: string): Promise<string> {
  // Mock implementation - replace with actual AI provider calls
  return `Mock AI response for: ${prompt}`;
}
