import { z } from 'zod';
import { tool } from 'ai';
import { getMastraClient } from '../../mastra-client';

// Input schema for keyword clustering
const keywordClusterInputSchema = z.object({
  keywords: z.array(z.string()).describe('List of keywords to analyze and cluster'),
  businessName: z.string().describe('The business name for context'),
  industry: z.string().optional().describe('Industry context for better clustering'),
  maxClusters: z.number().min(2).max(10).optional().default(5).describe('Maximum number of clusters to create')
});

// Output schema for keyword clustering results
const keywordClusterOutputSchema = z.object({
  clusters: z.array(z.object({
    id: z.string(),
    name: z.string(),
    keywords: z.array(z.string()),
    theme: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
    searchVolume: z.number().optional(),
    competition: z.enum(['high', 'medium', 'low']).optional()
  })),
  recommendations: z.array(z.object({
    cluster: z.string(),
    strategy: z.string(),
    contentIdeas: z.array(z.string()),
    expectedImpact: z.string()
  })),
  insights: z.array(z.string())
});

/**
 * Keyword Cluster Tool
 * Uses Mastra's keywordClusterTool directly through the tool execution
 */
export const keywordClusterTool = tool({
  description: 'Analyze and cluster keywords to identify content themes and optimization opportunities for better AI visibility',
  inputSchema: keywordClusterInputSchema,
  execute: async (input) => {
    try {
      // Get the Mastra client
      const mastraClient = await getMastraClient();
      
      // For tools, we'll directly call the Mastra tool rather than going through an agent
      // This is more efficient for specific tool operations
      const agent = mastraClient.getAgent('brandAnalysisAgent'); // This agent has the keywordClusterTool
      
      // Prepare the request for keyword clustering
      const analysisRequest = `Please analyze and cluster these keywords: ${input.keywords.join(', ')} for the business "${input.businessName}"${input.industry ? ` in the ${input.industry} industry` : ''}. Create up to ${input.maxClusters} meaningful clusters with themes, priorities, and content recommendations.`;
      
      const result = await agent.generate({
        messages: [{
          role: 'user',
          content: analysisRequest
        }],
        resourceId: `keyword-cluster-${Date.now()}`,
        threadId: `keyword-analysis-${Date.now()}`
      });
      
      // Extract text response from generate result
      let response = '';
      if (result && typeof result === 'object') {
        if ('text' in result && typeof result.text === 'string') {
          response = result.text;
        } else if ('content' in result && typeof result.content === 'string') {
          response = result.content;
        } else {
          response = '{}';
        }
      } else if (typeof result === 'string') {
        response = result;
      } else {
        response = '{}';
      }
      
      // Try to extract and parse JSON response
      try {
        const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          response = jsonMatch[1];
        }
        
        const parsedResponse = JSON.parse(response);
        return keywordClusterOutputSchema.parse(parsedResponse);
      } catch (parseError) {
        console.warn('Failed to parse keyword cluster response, using fallback');
        
        // Fallback: create simple clusters
        const clusters = [];
        const chunkSize = Math.ceil(input.keywords.length / (input.maxClusters || 3));
        
        for (let i = 0; i < input.keywords.length; i += chunkSize) {
          const chunk = input.keywords.slice(i, i + chunkSize);
          clusters.push({
            id: `cluster-${i / chunkSize + 1}`,
            name: `Cluster ${i / chunkSize + 1}`,
            keywords: chunk,
            theme: `Theme for ${chunk[0]}`,
            priority: 'medium' as const,
          });
        }
        
        return {
          clusters,
          recommendations: clusters.map(cluster => ({
            cluster: cluster.name,
            strategy: `Optimize content for ${cluster.theme}`,
            contentIdeas: [`Create content focused on ${cluster.keywords[0]}`],
            expectedImpact: 'Improved visibility for related searches'
          })),
          insights: ['Keyword analysis completed with basic clustering']
        };
      }
    } catch (error) {
      console.error('Error executing keyword cluster tool:', error);
      throw new Error(`Failed to cluster keywords: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});

export type KeywordClusterInput = z.infer<typeof keywordClusterInputSchema>;
export type KeywordClusterOutput = z.infer<typeof keywordClusterOutputSchema>;