// AI SDK + Mastra Tools Integration
export { brandAnalysisTool, type BrandAnalysisInput, type BrandAnalysisOutput } from './brand-analysis-tool';
export { visibilityAnalysisTool, type VisibilityAnalysisInput, type VisibilityAnalysisOutput } from './visibility-analysis-tool';
export { keywordClusterTool, type KeywordClusterInput, type KeywordClusterOutput } from './keyword-cluster-tool';
export { createMastraAgentTool, createSimpleMastraAgentTool, type MastraAgentToolConfig } from './mastra-agent-tool';

// All available tools for AI SDK integration
export const allMastraTools = {
  brandAnalysis: brandAnalysisTool,
  visibilityAnalysis: visibilityAnalysisTool,
  keywordCluster: keywordClusterTool,
};