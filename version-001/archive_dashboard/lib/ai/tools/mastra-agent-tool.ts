import { tool } from 'ai';
import { z } from 'zod';
import { getMastraClient } from '../../mastra-client';

/**
 * Configuration for creating a Mastra agent tool
 */
export interface MastraAgentToolConfig {
  id: string;
  description: string;
  agentName: string;
  inputSchema: z.ZodSchema;
  outputSchema?: z.ZodSchema;
  systemPrompt?: string;
  maxTokens?: number;
}

/**
 * Create an AI SDK tool from a Mastra agent
 * This wrapper converts Mastra agents into AI SDK compatible tools
 */
export function createMastraAgentTool({
  id,
  description,
  agentName,
  inputSchema,
  outputSchema,
  systemPrompt,
  maxTokens = 2000
}: MastraAgentToolConfig) {
  return tool({
    description,
    inputSchema,
    execute: async (input) => {
      try {
        // Get the Mastra client
        const mastraClient = await getMastraClient();
        const agent = mastraClient.getAgent(agentName);

        // Prepare the input as a user message
        const inputMessage = typeof input === 'string' 
          ? input 
          : JSON.stringify(input, null, 2);

        // Prepare messages array
        const messages = [];
        
        // Add system prompt if provided
        if (systemPrompt) {
          messages.push({
            role: 'assistant' as const,
            content: systemPrompt
          });
        }
        
        // Add the user input
        messages.push({
          role: 'user' as const,
          content: inputMessage
        });

        // Call the Mastra agent with generate method (not streaming for tools)
        const result = await agent.generate({
          messages,
          resourceId: `tool-${id}-${Date.now()}`,
          threadId: `tool-execution-${Date.now()}`
        });

        // Extract text response from generate result
        let response = '';
        if (result && typeof result === 'object') {
          if ('text' in result && typeof result.text === 'string') {
            response = result.text;
          } else if ('content' in result && typeof result.content === 'string') {
            response = result.content;
          } else {
            response = JSON.stringify(result, null, 2);
          }
        } else if (typeof result === 'string') {
          response = result;
        } else {
          response = 'No response received';
        }

        // If output schema is provided, try to parse and validate
        if (outputSchema) {
          try {
            // Try to extract JSON from response if it's wrapped in text
            const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
              response = jsonMatch[1];
            }
            
            // Parse JSON response
            const parsedResponse = JSON.parse(response);
            
            // Validate against schema
            const validatedResponse = outputSchema.parse(parsedResponse);
            return validatedResponse;
          } catch (parseError) {
            console.warn(`Failed to parse JSON response from ${agentName}:`, parseError);
            // Return raw response if parsing fails
            return response;
          }
        }

        return response;
      } catch (error) {
        console.error(`Error executing Mastra agent tool ${id}:`, error);
        throw new Error(`Failed to execute ${agentName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  });
}

/**
 * Utility function to create a simple text-based Mastra agent tool
 */
export function createSimpleMastraAgentTool({
  id,
  description,
  agentName,
  systemPrompt,
  maxTokens = 2000
}: Omit<MastraAgentToolConfig, 'inputSchema' | 'outputSchema'>) {
  return createMastraAgentTool({
    id,
    description,
    agentName,
    inputSchema: z.object({
      query: z.string().describe('The query or request to send to the agent')
    }),
    systemPrompt,
    maxTokens
  });
}