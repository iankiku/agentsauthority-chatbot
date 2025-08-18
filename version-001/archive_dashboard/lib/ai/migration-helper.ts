/**
 * Migration Helper for AI SDK + Mastra Tools Integration
 * 
 * This module provides utilities to help with the migration from complex Mastra streaming
 * to the cleaner AI SDK + tools pattern.
 */

import { featureFlags } from '../feature-flags';

/**
 * Configuration for the AI SDK + Mastra integration
 */
export interface AISDKMastraConfig {
  useStreamText: boolean;
  enableTools: boolean;
  maxTokens: number;
  temperature: number;
  defaultModel: string;
}

/**
 * Default configuration for AI SDK + Mastra integration
 */
export const defaultConfig: AISDKMastraConfig = {
  useStreamText: true,
  enableTools: featureFlags.useMastraTools,
  maxTokens: 4000,
  temperature: 0.7,
  defaultModel: 'gpt-4o-mini'
};

/**
 * Migration status and information
 */
export interface MigrationStatus {
  isV2Enabled: boolean;
  usingAISDK: boolean;
  toolsEnabled: boolean;
  recommendedActions: string[];
}

/**
 * Get current migration status
 */
export function getMigrationStatus(): MigrationStatus {
  const isV2Enabled = featureFlags.useAISDKChat;
  const usingAISDK = isV2Enabled;
  const toolsEnabled = featureFlags.useMastraTools;
  
  const recommendedActions: string[] = [];
  
  if (!isV2Enabled) {
    recommendedActions.push('Enable AI SDK chat by setting FEATURE_USE_AI_SDK_CHAT=true');
  }
  
  if (!toolsEnabled) {
    recommendedActions.push('Enable Mastra tools integration for better analysis capabilities');
  }
  
  if (isV2Enabled && toolsEnabled) {
    recommendedActions.push('Migration complete! Monitor performance and user feedback.');
  }
  
  return {
    isV2Enabled,
    usingAISDK,
    toolsEnabled,
    recommendedActions
  };
}

/**
 * Legacy function mapping for backward compatibility
 */
export const legacyFunctionMap = {
  'callAgentApi': 'Use AI SDK streamText with Mastra tools instead',
  'createAISDKTransformer': 'Use native AI SDK streaming capabilities',
  'callDelegatedAgent': 'Use AI SDK tools system for delegation',
  'extractAgentDelegation': 'Use AI SDK tools for direct agent calls'
};

/**
 * Performance comparison metrics
 */
export interface PerformanceMetrics {
  averageResponseTime: number;
  errorRate: number;
  tokenUsage: number;
  userSatisfaction: number;
}

/**
 * Log migration progress
 */
export function logMigrationProgress(stage: string, details?: any) {
  if (featureFlags.enableDebugMode) {
    console.log(`[AI SDK Migration] ${stage}:`, details || '');
  }
}

/**
 * Validate tool integration
 */
export function validateToolIntegration() {
  const issues: string[] = [];
  
  try {
    // Check if required environment variables are set
    if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
      issues.push('No AI provider API keys configured');
    }
    
    if (!process.env.MASTRA_BASE_URL) {
      issues.push('MASTRA_BASE_URL not configured');
    }
    
    // Log validation results
    if (issues.length === 0) {
      logMigrationProgress('Tool integration validation passed');
    } else {
      logMigrationProgress('Tool integration validation failed', issues);
    }
    
  } catch (error) {
    issues.push(`Validation error: ${error}`);
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}