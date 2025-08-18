import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { llmJSONCall } from "../lib/llmJSONCall";

/* ===========================================================================
   1. KEYWORD CLUSTER TOOL
============================================================================ */
const KeywordClusterInput = z.object({
	keywords: z
		.array(
			z.object({
				term: z.string(),
				volume: z.number(),
				difficulty: z.number().optional(),
			})
		)
		.describe("List of keyword objects"),
	maxClusters: z.number().default(10).describe("Max clusters to produce"),
});

const KeywordClusterOutput = z.object({
	clusters: z
		.array(
			z.object({
				name: z.string().describe("Cluster label"),
				keywords: z.array(z.string()).describe("Terms in this cluster"),
				totalVolume: z.number().describe("Sum of search volumes"),
				avgDifficulty: z
					.number()
					.optional()
					.describe("Average keyword difficulty"),
				aiRelevance: z
					.number()
					.min(0)
					.max(1)
					.describe("0–1 score for AI‑content potential"),
			})
		)
		.describe("Semantic clusters"),
});

/**
 * @tool keyword-cluster
 * @desc Group a list of keywords into semantic clusters using LLMs.
 * @input { keywords, maxClusters }
 * @output { clusters }
 */
export const keywordClusterTool = createTool({
	id: "keyword-cluster",
	description: "Semantic clustering of keywords for content mapping",
	inputSchema: KeywordClusterInput,
	outputSchema: KeywordClusterOutput,
	execute: async ({ context: { keywords, maxClusters } }) => {
		const prompt = `
	You are an SEO & AI strategist. Cluster these keywords into up to ${maxClusters} semantic groups:

	${keywords.map((k) => `- ${k.term} (vol:${k.volume}, diff:${k.difficulty ?? "?"})`).join("\n")}

	Respond in JSON matching this schema:

	${KeywordClusterOutput.toString()}
	`;
		try {
			return await llmJSONCall(KeywordClusterOutput, prompt);
		} catch (error) {
			console.warn(
				"[keywordClusterTool] LLM analysis failed, using fallback:",
				error
			);
			// Fallback: create a simple cluster with all keywords in one group
			const totalVolume = keywords.reduce((sum, k) => sum + k.volume, 0);
			const avgDifficulty =
				keywords.reduce((sum, k) => sum + (k.difficulty || 0), 0) /
				keywords.length;
			const fallbackClusters = [
				{
					name: "General Keywords",
					keywords: keywords.map((k) => k.term),
					totalVolume: totalVolume,
					avgDifficulty: avgDifficulty,
					aiRelevance: 0.5, // Default medium relevance
				},
			];
			return { clusters: fallbackClusters };
		}
	},
});

/* ===========================================================================
   2. BRAND MENTION TOOL
============================================================================ */
const BrandMentionInput = z.object({
	brandName: z.string().describe("Name of the brand"),
	timeframe: z
		.object({ start: z.string(), end: z.string() })
		.describe("ISO date range"),
	sources: z
		.array(z.enum(["web", "social", "news"]))
		.default(["web"])
		.describe("Where to look for mentions"),
});

const BrandMentionOutput = z.object({
	mentions: z
		.array(
			z.object({
				source: z.string(),
				url: z.string().url(),
				snippet: z.string(),
				sentiment: z.number().min(-1).max(1),
				isAiGenerated: z.boolean(),
				confidence: z.number().min(0).max(1),
			})
		)
		.describe("Individual mention records"),
	summary: z
		.object({
			totalMentions: z.number(),
			aiGeneratedCount: z.number(),
			avgSentiment: z.number(),
			topSources: z.array(z.string()),
		})
		.describe("Aggregate mention statistics")
		.optional(),
});

/**
 * @tool brand-mention
 * @desc Track brand mentions with sentiment & AI‑detection.
 * @input { brandName, timeframe, sources }
 * @output { mentions, summary }
 */
export const brandMentionTool = createTool({
	id: "brand-mention",
	description: "Monitor brand mentions and detect AI‑generated content (Firecrawl dependency removed)",
	inputSchema: BrandMentionInput,
	outputSchema: BrandMentionOutput,
	execute: async ({ context }) => {
		const { brandName, timeframe, sources } = context;
		console.log(`[brandMentionTool] Firecrawl dependency removed - returning placeholder data`);

		// Return placeholder data since Firecrawl was removed
		return {
			mentions: [],
			summary: {
				totalMentions: 0,
				aiGeneratedCount: 0,
				avgSentiment: 0,
				topSources: [],
			},
		};
	},
});

/* ===========================================================================
   3. PROMPT SIMULATION TOOL
============================================================================ */
const PromptSimInput = z.object({
	prompt: z.string().describe("Original AI prompt"),
	context: z.string().describe("Use-case or domain context"),
	targetMetrics: z
		.object({
			clarity: z.boolean().default(true),
			creativity: z.boolean().default(true),
			consistency: z.boolean().default(true),
		})
		.describe("Which metrics to score"),
});

const PromptSimOutput = z.object({
	scores: z
		.object({
			clarity: z.number().min(0).max(100),
			creativity: z.number().min(0).max(100),
			consistency: z.number().min(0).max(100),
		})
		.describe("0–100 per metric"),
	suggestions: z.array(z.string()).describe("Improvement tips"),
	improvedPrompt: z.string().describe("Rewritten prompt"),
});

/**
 * @tool prompt-sim
 * @desc Score & rewrite an AI prompt for clarity/creativity/consistency.
 * @input { prompt, context, targetMetrics }
 * @output { scores, suggestions, improvedPrompt }
 */
export const promptSimTool = createTool({
	id: "prompt-sim",
	description: "Evaluate and enhance AI prompts via LLM",
	inputSchema: PromptSimInput,
	outputSchema: PromptSimOutput,
	execute: async ({ context }) => {
		const { prompt, context: ctx, targetMetrics } = context;
		const metrics = Object.entries(targetMetrics)
			.filter(([, on]) => on)
			.map(([m]) => m)
			.join(", ");
		const p = `
You are a prompt engineer. Original prompt:
"${prompt}"
Context: ${ctx}
Metrics: ${metrics}

Return JSON: ${PromptSimOutput.toString()}
`;
		try {
			return await llmJSONCall(PromptSimOutput, p);
		} catch (error) {
			console.warn(
				"[promptSimTool] LLM analysis failed, using fallback:",
				error
			);
			// Fallback: return basic scores and suggestions
			return {
				scores: {
					clarity: 70,
					creativity: 70,
					consistency: 70,
				},
				suggestions: [
					"Could not analyze prompt due to technical issues. Consider reviewing for clarity and specificity.",
				],
				improvedPrompt: prompt, // Return original prompt as fallback
			};
		}
	},
});

/* ===========================================================================
   4. AI COPYWRITING TOOL
============================================================================ */
const AiCopyInput = z.object({
	content: z.string().describe("Text to transform"),
	format: z.enum(["twitter", "linkedin", "blog"]).describe("Target format"),
});

const AiCopyOutput = z.object({
	output: z.string().describe("Reformatted content"),
});

/**
 * @tool ai-copy
 * @desc Transform content into a social/blog format.
 * @input { content, format }
 * @output { output }
 */
export const aiCopywritingTool = createTool({
	id: "ai-copy",
	description: "Reformat content for Twitter, LinkedIn, or blog posts",
	inputSchema: AiCopyInput,
	outputSchema: AiCopyOutput,
	execute: async ({ context: { content, format } }) => {
		const prompt = `
You are a content reformatter. Convert the following into a ${format} style:

"${content}"

Return only the reformatted text.
`;
		try {
			const { output } = await llmJSONCall(AiCopyOutput, prompt);
			return { output };
		} catch (error) {
			console.warn(
				"[aiCopywritingTool] LLM analysis failed, using fallback:",
				error
			);
			// Fallback: return original content with format prefix
			const formatPrefix =
				format === "twitter"
					? "Tweet: "
					: format === "linkedin"
						? "LinkedIn Post: "
						: "Blog Post: ";
			return { output: formatPrefix + content };
		}
	},
});

export const geoSuiteTools = {
	keywordClusterTool,
	brandMentionTool,
	promptSimTool,
	aiCopywritingTool,
};
