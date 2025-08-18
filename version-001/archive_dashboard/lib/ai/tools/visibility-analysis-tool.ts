import { z } from 'zod';
import { createMastraAgentTool } from './mastra-agent-tool';

// Input schema for visibility analysis
const visibilityAnalysisInputSchema = z.object({
  businessName: z.string().describe('The name of the business to analyze'),
  website: z.string().url().optional().describe('The website URL of the business'),
  targetKeywords: z.array(z.string()).optional().describe('Keywords to analyze visibility for'),
  competitors: z.array(z.string()).optional().describe('List of competitor names for comparison'),
  timeframe: z.enum(['7d', '30d', '90d', '1y']).optional().default('30d').describe('Timeframe for analysis'),
  platforms: z.array(z.enum(['chatgpt', 'claude', 'gemini', 'perplexity'])).optional().describe('Specific AI platforms to analyze')
});

// Output schema for visibility analysis results
const visibilityAnalysisOutputSchema = z.object({
  brandName: z.string(),
  overallVisibilityScore: z.number().min(0).max(100),
  shareOfVoice: z.number().min(0).max(100),
  competitorRankings: z.array(z.object({
    name: z.string(),
    score: z.number().min(0).max(100),
    rank: z.number()
  })),
  platformPerformance: z.object({
    chatgpt: z.object({
      score: z.number().min(0).max(100),
      mentions: z.number(),
      averagePosition: z.number().optional()
    }).optional(),
    claude: z.object({
      score: z.number().min(0).max(100),
      mentions: z.number(),
      averagePosition: z.number().optional()
    }).optional(),
    gemini: z.object({
      score: z.number().min(0).max(100),
      mentions: z.number(),
      averagePosition: z.number().optional()
    }).optional(),
    perplexity: z.object({
      score: z.number().min(0).max(100),
      mentions: z.number(),
      averagePosition: z.number().optional()
    }).optional()
  }),
  keywordPerformance: z.array(z.object({
    keyword: z.string(),
    score: z.number().min(0).max(100),
    mentions: z.number(),
    trend: z.enum(['up', 'down', 'stable'])
  })).optional(),
  historicalTrends: z.array(z.object({
    date: z.string(),
    score: z.number(),
    change: z.number()
  })).optional(),
  insights: z.array(z.string()),
  recommendations: z.array(z.object({
    category: z.string(),
    action: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
    expectedOutcome: z.string()
  }))
});

/**
 * Visibility Analysis Tool
 * Converts the Mastra visibilityAnalysisAgent into an AI SDK tool
 */
export const visibilityAnalysisTool = createMastraAgentTool({
  id: 'visibility-analysis',
  description: 'Analyze brand visibility across AI platforms, calculate share of voice, compare against competitors, and provide actionable insights for improving brand presence',
  agentName: 'visibilityAnalysisAgent',
  inputSchema: visibilityAnalysisInputSchema,
  outputSchema: visibilityAnalysisOutputSchema,
  systemPrompt: `You are a visibility analysis specialist. When analyzing brand visibility, provide structured JSON output with:
- Overall visibility score (0-100)
- Share of voice percentage
- Competitor rankings with scores
- Platform-specific performance metrics
- Keyword performance analysis
- Historical trends when available
- Actionable insights and recommendations

Focus on providing specific, measurable insights that can guide brand visibility improvement strategies.`,
  maxTokens: 3000
});

export type VisibilityAnalysisInput = z.infer<typeof visibilityAnalysisInputSchema>;
export type VisibilityAnalysisOutput = z.infer<typeof visibilityAnalysisOutputSchema>;