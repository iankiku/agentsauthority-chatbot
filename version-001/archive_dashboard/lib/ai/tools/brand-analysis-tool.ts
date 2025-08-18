import { z } from 'zod';
import { createMastraAgentTool } from './mastra-agent-tool';

// Input schema for brand analysis
const brandAnalysisInputSchema = z.object({
  businessName: z.string().describe('The name of the business to analyze'),
  website: z.string().url().optional().describe('The website URL of the business'),
  competitors: z.array(z.string()).optional().describe('List of competitor names'),
  keywords: z.array(z.string()).optional().describe('Target keywords to analyze'),
  analysisType: z.enum(['comprehensive', 'quick', 'competitive']).optional().default('comprehensive').describe('Type of analysis to perform')
});

// Output schema for structured brand analysis results
const brandAnalysisOutputSchema = z.object({
  brandName: z.string(),
  visibilityScore: z.number().min(0).max(100),
  sentimentScore: z.number().min(-1).max(1),
  shareOfVoice: z.number().min(0).max(100),
  competitivePosition: z.string(),
  keyInsights: z.array(z.string()),
  recommendations: z.array(z.object({
    priority: z.enum(['high', 'medium', 'low']),
    action: z.string(),
    expectedImpact: z.string()
  })),
  providerBreakdown: z.object({
    openai: z.number().min(0).max(100).optional(),
    anthropic: z.number().min(0).max(100).optional(),
    google: z.number().min(0).max(100).optional(),
    perplexity: z.number().min(0).max(100).optional()
  }).optional(),
  historicalTrends: z.array(z.object({
    period: z.string(),
    score: z.number(),
    change: z.number()
  })).optional()
});

/**
 * Brand Analysis Tool
 * Converts the Mastra brandAnalysisAgent into an AI SDK tool
 */
export const brandAnalysisTool = createMastraAgentTool({
  id: 'brand-analysis',
  description: 'Perform comprehensive brand analysis including visibility scoring, sentiment analysis, competitive positioning, and actionable recommendations across AI platforms',
  agentName: 'brandAnalysisAgent',
  inputSchema: brandAnalysisInputSchema,
  outputSchema: brandAnalysisOutputSchema,
  systemPrompt: `You are a brand analysis expert. When analyzing a brand, provide structured JSON output with:
- Comprehensive visibility scoring (0-100)
- Sentiment analysis (-1 to 1)
- Share of voice calculations
- Competitive positioning insights
- Actionable recommendations with priority levels
- Provider-specific breakdowns when available
- Historical trends if data exists

Ensure all numeric scores are within the specified ranges and recommendations are specific and actionable.`,
  maxTokens: 3000
});

export type BrandAnalysisInput = z.infer<typeof brandAnalysisInputSchema>;
export type BrandAnalysisOutput = z.infer<typeof brandAnalysisOutputSchema>;