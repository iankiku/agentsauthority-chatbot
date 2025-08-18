import { defaultModel } from "@/mastra/lib/llm/models";
import { Agent } from "@mastra/core/agent";
import { memoryKlass } from "../config/memory";
import {
	aiCopywritingTool,
	brandMentionTool,
	keywordClusterTool,
	promptSimTool,
} from "../tools/geoSuiteTools";
import {
	aiCopywriterAgent,
	brandMonitorAgent,
	keywordClusterAgent,
	promptSimulatorAgent,
} from "./geoSuiteAgents";

export const analysisExpertAgent = new Agent({
	name: "Analysis Expert",
	description: `
	Analyze the content of any kind that is relevant to the business, website or product.
	Uses other agents to do the analysis such as keywordClusterAgent, brandMonitorAgent, promptSimulatorAgent, aiCopywriterAgent.
	`,
	instructions: () => `
 You are an Analysis Expert. Analyze the content of any kind that is relevant to the business, websi	.
 You will use the other agents to do the analysis such as keywordClusterAgent, brandMonitorAgent, promptSimulatorAgent, aiCopywriterAgent.
 The result will be used to determine this website or business GEO/SEO visibility.
 
 `,
	model: defaultModel,
	tools: {
		keywordClusterTool,
		brandMentionTool,
		promptSimTool,
		aiCopywritingTool,
	},
	memory: memoryKlass,
});

export const geoSuiteAgents = {
	analysisExpertAgent,
	keywordClusterAgent,
	brandMonitorAgent,
	promptSimulatorAgent,
	aiCopywriterAgent,
};
