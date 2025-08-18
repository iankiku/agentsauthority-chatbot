import { tool } from 'ai';
import { z } from 'zod';

export interface ContentOptimizationResult {
  content: string;
  targetKeywords: string[];
  industry?: string;
  contentType?: 'blog' | 'product' | 'landing' | 'social';
  platformAnalysis: {
    chatgpt: {
      score: number;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
    claude: {
      score: number;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
    gemini: {
      score: number;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
  };
  overallOptimization: {
    averageScore: number;
    priorityImprovements: string[];
    contentStructure: {
      suggestedFormat: string;
      recommendedSections: string[];
      lengthRecommendation: string;
    };
    keywordIntegration: {
      currentDensity: number;
      recommendedDensity: number;
      placementSuggestions: string[];
    };
  };
  strategicRecommendations: string[];
  metadata: {
    executionTime: number;
    contentLength: number;
    keywordCount: number;
    category: 'content-optimization';
  };
}

export const contentOptimizationTool = tool({
  description:
    'Analyze and optimize content for GEO performance across AI platforms with AI-powered recommendations',
  inputSchema: z.object({
    content: z
      .string()
      .min(10)
      .max(10000)
      .describe('The content text to analyze'),
    targetKeywords: z
      .array(z.string())
      .min(1)
      .max(20)
      .describe('Array of target keywords for optimization'),
    industry: z.string().optional().describe('Industry context for content'),
    contentType: z
      .enum(['blog', 'product', 'landing', 'social'])
      .optional()
      .describe('Type of content (e.g., blog, product page)'),
    includeRecommendations: z
      .boolean()
      .default(true)
      .describe('Include strategic recommendations'),
  }),
  execute: async ({
    content,
    targetKeywords,
    industry,
    contentType,
    includeRecommendations = true,
  }) => {
    const startTime = Date.now();

    try {
      const platformAnalysis = analyzeContentForPlatforms(
        content,
        targetKeywords,
        industry,
      );
      const overallOptimization = calculateOverallOptimization(
        platformAnalysis,
        content,
        targetKeywords,
      );
      const strategicRecommendations = includeRecommendations
        ? generateStrategicRecommendations(
            overallOptimization,
            platformAnalysis,
          )
        : [];

      const executionTime = Date.now() - startTime;

      const result: ContentOptimizationResult = {
        content,
        targetKeywords,
        industry,
        contentType,
        platformAnalysis,
        overallOptimization,
        strategicRecommendations,
        metadata: {
          executionTime,
          contentLength: content.length,
          keywordCount: targetKeywords.length,
          category: 'content-optimization',
        },
      };

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      const errorResult: ContentOptimizationResult = {
        content,
        targetKeywords,
        industry,
        contentType,
        platformAnalysis: {
          chatgpt: {
            score: 0,
            strengths: [],
            weaknesses: [],
            recommendations: [],
          },
          claude: {
            score: 0,
            strengths: [],
            weaknesses: [],
            recommendations: [],
          },
          gemini: {
            score: 0,
            strengths: [],
            weaknesses: [],
            recommendations: [],
          },
        },
        overallOptimization: {
          averageScore: 0,
          priorityImprovements: [`Content analysis failed: ${errorMessage}`],
          contentStructure: {
            suggestedFormat: 'N/A',
            recommendedSections: [],
            lengthRecommendation: 'N/A',
          },
          keywordIntegration: {
            currentDensity: 0,
            recommendedDensity: 0,
            placementSuggestions: [],
          },
        },
        strategicRecommendations: includeRecommendations
          ? ['Please review your content and keywords, then try again.']
          : [],
        metadata: {
          executionTime,
          contentLength: content.length,
          keywordCount: targetKeywords.length,
          category: 'content-optimization',
        },
      };

      return errorResult;
    }
  },
});

interface PlatformAnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface PlatformAnalysis {
  chatgpt: PlatformAnalysisResult;
  claude: PlatformAnalysisResult;
  gemini: PlatformAnalysisResult;
}

/**
 * Analyze content for each platform's preferences
 */
function analyzeContentForPlatforms(
  content: string,
  keywords: string[],
  industry?: string,
): PlatformAnalysis {
  const chatgptAnalysis = analyzeForChatGPT(content, keywords, industry);
  const claudeAnalysis = analyzeForClaude(content, keywords, industry);
  const geminiAnalysis = analyzeForGemini(content, keywords, industry);

  return {
    chatgpt: chatgptAnalysis,
    claude: claudeAnalysis,
    gemini: geminiAnalysis,
  };
}

/**
 * Analyze content specifically for ChatGPT preferences
 */
function analyzeForChatGPT(
  content: string,
  keywords: string[],
  industry?: string,
): PlatformAnalysisResult {
  const conversationalScore = calculateConversationalTone(content);
  const qaFormatScore = calculateQAFormat(content);
  const keywordDensity = calculateKeywordDensity(content, keywords);

  const score =
    conversationalScore * 0.4 + qaFormatScore * 0.3 + keywordDensity * 0.3;

  const strengths = identifyStrengths(content, 'chatgpt', keywords);
  const weaknesses = identifyWeaknesses(content, 'chatgpt', keywords);
  const recommendations = generatePlatformRecommendations(
    content,
    'chatgpt',
    keywords,
  );

  return { score, strengths, weaknesses, recommendations };
}

/**
 * Analyze content specifically for Claude preferences
 */
function analyzeForClaude(
  content: string,
  keywords: string[],
  industry?: string,
): PlatformAnalysisResult {
  const depthScore = calculateContentDepth(content);
  const nuanceScore = calculateNuanceAndSubtlety(content);
  const keywordDensity = calculateKeywordDensity(content, keywords);

  const score = depthScore * 0.4 + nuanceScore * 0.3 + keywordDensity * 0.3;

  const strengths = identifyStrengths(content, 'claude', keywords);
  const weaknesses = identifyWeaknesses(content, 'claude', keywords);
  const recommendations = generatePlatformRecommendations(
    content,
    'claude',
    keywords,
  );

  return { score, strengths, weaknesses, recommendations };
}

/**
 * Analyze content specifically for Gemini preferences
 */
function analyzeForGemini(
  content: string,
  keywords: string[],
  industry?: string,
): PlatformAnalysisResult {
  const multimodalScore = calculateMultimodalPotential(content);
  const relevanceScore = calculateRelevance(content, keywords);
  const keywordDensity = calculateKeywordDensity(content, keywords);

  const score =
    multimodalScore * 0.4 + relevanceScore * 0.3 + keywordDensity * 0.3;

  const strengths = identifyStrengths(content, 'gemini', keywords);
  const weaknesses = identifyWeaknesses(content, 'gemini', keywords);
  const recommendations = generatePlatformRecommendations(
    content,
    'gemini',
    keywords,
  );

  return { score, strengths, weaknesses, recommendations };
}

/**
 * Calculate overall optimization metrics
 */
function calculateOverallOptimization(
  platformAnalysis: PlatformAnalysis,
  content: string,
  keywords: string[],
): ContentOptimizationResult['overallOptimization'] {
  const averageScore =
    (platformAnalysis.chatgpt.score +
      platformAnalysis.claude.score +
      platformAnalysis.gemini.score) /
    3;

  const priorityImprovements = getPriorityImprovements(platformAnalysis);
  const contentStructure = suggestContentStructure(content);
  const keywordIntegration = suggestKeywordIntegration(content, keywords);

  return {
    averageScore,
    priorityImprovements,
    contentStructure,
    keywordIntegration,
  };
}

/**
 * Helper functions for content analysis (simplified for this implementation)
 */
function calculateConversationalTone(content: string): number {
  const conversationalWords = ['you', 'I', 'we', 'our', 'us', 'ask', 'imagine'];
  const count = conversationalWords.filter((word) =>
    content.toLowerCase().includes(word),
  ).length;
  return Math.min(count * 10, 100);
}

function calculateQAFormat(content: string): number {
  const qaIndicators = ['?', 'questions', 'answers', 'how to', 'what is'];
  const count = qaIndicators.filter((indicator) =>
    content.toLowerCase().includes(indicator),
  ).length;
  return Math.min(count * 15, 100);
}

function calculateKeywordDensity(content: string, keywords: string[]): number {
  if (keywords.length === 0 || content.length === 0) return 0;
  const totalWords = content.toLowerCase().split(/\s+/).length;
  let keywordCount = 0;
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g');
    const matches = content.toLowerCase().match(regex);
    if (matches) keywordCount += matches.length;
  });
  return Math.min((keywordCount / totalWords) * 100, 100);
}

function calculateContentDepth(content: string): number {
  const wordCount = content.split(/\s+/).length;
  return Math.min((wordCount / 500) * 100, 100);
}

function calculateNuanceAndSubtlety(content: string): number {
  const complexWords = [
    'however',
    'although',
    'nevertheless',
    'consequently',
    'moreover',
    'furthermore',
  ];
  const count = complexWords.filter((word) =>
    content.toLowerCase().includes(word),
  ).length;
  return Math.min(count * 20, 100);
}

function calculateMultimodalPotential(content: string): number {
  const multimodalIndicators = [
    'image',
    'video',
    'chart',
    'diagram',
    'graph',
    'visualize',
    'show',
    'demonstrate',
  ];
  const count = multimodalIndicators.filter((indicator) =>
    content.toLowerCase().includes(indicator),
  ).length;
  return Math.min(count * 25, 100);
}

function calculateRelevance(content: string, keywords: string[]): number {
  const keywordCoverage = keywords.filter((keyword) =>
    content.toLowerCase().includes(keyword.toLowerCase()),
  ).length;
  return Math.min((keywordCoverage / keywords.length) * 100, 100);
}

function identifyStrengths(
  content: string,
  platform: 'chatgpt' | 'claude' | 'gemini',
  keywords: string[],
): string[] {
  const strengths: string[] = [];
  // Simplified - in a real scenario, this would use AI to analyze
  if (content.length > 500) strengths.push('Comprehensive content length');
  if (keywords.every((kw) => content.toLowerCase().includes(kw.toLowerCase())))
    strengths.push('Good keyword integration');
  return strengths;
}

function identifyWeaknesses(
  content: string,
  platform: 'chatgpt' | 'claude' | 'gemini',
  keywords: string[],
): string[] {
  const weaknesses: string[] = [];
  // Simplified - in a real scenario, this would use AI to analyze
  if (content.length < 200) weaknesses.push('Content is too short');
  if (!keywords.some((kw) => content.toLowerCase().includes(kw.toLowerCase())))
    weaknesses.push('Poor keyword integration');
  return weaknesses;
}

function generatePlatformRecommendations(
  content: string,
  platform: 'chatgpt' | 'claude' | 'gemini',
  keywords: string[],
): string[] {
  const recommendations: string[] = [];
  // Simplified - in a real scenario, this would use AI to generate detailed recommendations
  if (platform === 'chatgpt')
    recommendations.push('Add more conversational elements and Q&A sections');
  if (platform === 'claude')
    recommendations.push('Elaborate on complex topics with more nuance');
  if (platform === 'gemini')
    recommendations.push(
      'Suggest integrating visual elements like charts or diagrams',
    );
  return recommendations;
}

function getPriorityImprovements(platformAnalysis: PlatformAnalysis): string[] {
  const improvements: string[] = [];
  const allWeaknesses = [
    ...platformAnalysis.chatgpt.weaknesses,
    ...platformAnalysis.claude.weaknesses,
    ...platformAnalysis.gemini.weaknesses,
  ];
  const uniqueWeaknesses = [...new Set(allWeaknesses)];
  return uniqueWeaknesses.slice(0, 3); // Top 3 unique weaknesses
}

function suggestContentStructure(
  content: string,
): ContentOptimizationResult['overallOptimization']['contentStructure'] {
  const wordCount = content.split(/\s+/).length;
  let suggestedFormat = 'Standard Article';
  let recommendedSections: string[] = [
    'Introduction',
    'Main Body',
    'Conclusion',
  ];
  let lengthRecommendation = 'Around 800-1200 words';

  if (wordCount < 400) {
    suggestedFormat = 'Short Post/Summary';
    recommendedSections = ['Introduction', 'Key Points', 'Summary'];
    lengthRecommendation = 'Around 300-500 words';
  } else if (wordCount > 1500) {
    suggestedFormat = 'In-depth Guide/Report';
    recommendedSections = [
      'Abstract',
      'Introduction',
      'Detailed Sections',
      'Conclusion',
      'References',
    ];
    lengthRecommendation = 'Over 1500 words';
  }

  return {
    suggestedFormat,
    recommendedSections,
    lengthRecommendation,
  };
}

function suggestKeywordIntegration(
  content: string,
  keywords: string[],
): ContentOptimizationResult['overallOptimization']['keywordIntegration'] {
  const currentDensity = calculateKeywordDensity(content, keywords);
  const recommendedDensity = 1.5; // Target 1.5% - 2.5% density

  const placementSuggestions: string[] = [];
  if (
    !keywords.some((kw) => content.toLowerCase().startsWith(kw.toLowerCase()))
  )
    placementSuggestions.push(
      'Include target keywords in the opening paragraph',
    );
  if (!keywords.some((kw) => content.toLowerCase().endsWith(kw.toLowerCase())))
    placementSuggestions.push(
      'Include target keywords in the concluding paragraph',
    );
  placementSuggestions.push(
    'Distribute keywords naturally throughout the content',
  );

  return {
    currentDensity: Number.parseFloat(currentDensity.toFixed(2)),
    recommendedDensity,
    placementSuggestions,
  };
}

function generateStrategicRecommendations(
  overallOptimization: ContentOptimizationResult['overallOptimization'],
  platformAnalysis: PlatformAnalysis,
): string[] {
  const recommendations: string[] = [];

  if (overallOptimization.averageScore < 60) {
    recommendations.push(
      'Conduct a full content audit to identify low-performing assets',
    );
  }
  if (
    overallOptimization.keywordIntegration.currentDensity <
    overallOptimization.keywordIntegration.recommendedDensity
  ) {
    recommendations.push(
      'Review keyword strategy and optimize content for better keyword density',
    );
  }

  if (platformAnalysis.chatgpt.score < 50) {
    recommendations.push(
      'Adapt content for conversational AI interfaces like ChatGPT',
    );
  }
  if (platformAnalysis.claude.score < 50) {
    recommendations.push(
      'Enhance content depth and nuance for platforms like Claude',
    );
  }
  if (platformAnalysis.gemini.score < 50) {
    recommendations.push(
      'Explore multimodal content formats for better Gemini performance',
    );
  }

  return recommendations.slice(0, 5); // Limit to top 5
}
