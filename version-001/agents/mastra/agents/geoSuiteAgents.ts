import { defaultModel } from "@/mastra/lib/llm/models";
import { Agent } from "@mastra/core/agent";
import { memoryKlass } from "../config/memory";
import {
	aiCopywritingTool,
	brandMentionTool,
	keywordClusterTool,
	promptSimTool,
} from "../tools/geoSuiteTools";

/**
 * Content Cluster Agent
 * - Uses keywordClusterTool to build semantic clusters.
 */
export const keywordClusterAgent = new Agent({
	name: "Keyword Cluster Specialist",
	description: `
	This agent is used to cluster keywords to help plan content hubs and topic coverage.
	The agent will find seo/geo topics based on keywords in industry, trends and other factors that may be relevant to the website or business.
	The most searched keywords will be used to generate content for the website.
	`,
	instructions: () => `
 You are a Keyword Cluster Specialist. Cluster and map keywords
 to help plan content hubs and topic coverage.
 The agent will find seo/geo topics based on keywords in industry, trends and other factors that may be relevant to the website or business.
 The most searched keywords will be used to generate content for the website.
 `,
	model: defaultModel,
	tools: { keywordClusterTool },
	memory: memoryKlass,
});

/**
 * Brand Monitor Agent
 * - Uses brandMentionTool to track & summarize mentions.
 */
export const brandMonitorAgent = new Agent({
	name: "Brand Monitor",
	description: `
	This agent is used to track brand mentions, accross all channels.
	`,
	instructions: () => `
 You are a Brand Monitor. Track brand mentions,
 analyze sentiment, and detect AI‑generated content.
 You will search for brand mentions across all channels and analyze the sentiment of the mentions.
 `,
	model: defaultModel,
	tools: { brandMentionTool },
	memory: memoryKlass,
});

/**
 * Prompt Simulation Agent
 * - Uses promptSimTool to test & optimize prompts.
 */
export const promptSimulatorAgent = new Agent({
	name: "Prompt Simulator",
	description: `
	This agent is used to simulate user queries as prompts for example: best tacos in SF, The result be later used to generate content for the website.
	`,
	instructions: () => `
 You are a Prompt Simulator. Evaluate and improve AI prompts
 for clarity, creativity, and consistency.
 You will simulate user queries as prompts for example: best tacos in SF, The simulated queries(prompts) should be relevant to the business, website or product.
 The result be later used to generate content for the website. The goal is to identify what search terms, keywords, topics, etc can improve the website's GEO/SEO visibility.
 `,
	model: defaultModel,
	tools: { promptSimTool },
	memory: memoryKlass,
});

/**
 * AI Copywriting Agent
 * - Uses aiCopywritingTool to reformat content for social or blog.
 */
export const aiCopywriterAgent = new Agent({
	name: "AI Copywriter",
	instructions: () => `
 You are an AI Copywriter. Transform content into the specified format
 (twitter, linkedin, or blog) while preserving voice and key points.
 `,
	model: defaultModel,
	tools: { aiCopywritingTool },
	memory: memoryKlass,
});

/**
 * MVP agent registry
 */
export const geoSuiteAgents = {
	keywordClusterAgent,
	brandMonitorAgent,
	promptSimulatorAgent,
	aiCopywriterAgent,
};
