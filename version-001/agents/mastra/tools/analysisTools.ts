import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { llmJSONCall } from "../lib/llmJSONCall";

/* ===========================================================================
   SCHEMAS
============================================================================ */
// 1. GEO Visibility Schemas
export const GEOVisibilityInput = z.object({
	website: z.string().url(),
	businessName: z.string(),
	targetKeywords: z.array(z.string()),
	aiEngineResults: z.array(
		z.object({
			engine: z.enum(["chatgpt", "claude", "gemini", "perplexity"]),
			query: z.string(),
			mentioned: z.boolean(),
			position: z.number().nullable(),
			context: z.string(),
		})
	),
});
export const GEOVisibilityOutput = z.object({
	score: z.number().min(0).max(100),
	explanation: z.string(),
});

// 2. Quick Score Schemas
export const QuickScoreInput = z.object({
	mentions: z.number(),
	totalQueries: z.number(),
	avgPosition: z.number().nullable(),
	engines: z.array(z.string()),
	contextRelevance: z
		.enum(["low", "medium", "high"])
		.optional()
		.describe("Quality of the snippet contexts"),
});
export const QuickScoreOutput = z.object({
	score: z.number().min(0).max(100),
	breakdown: z.object({
		mentionRate: z.number(),
		positionScore: z.number(),
		engineCoverage: z.number(),
		relevanceBonus: z.number(),
	}),
	category: z.enum(["poor", "fair", "good", "excellent"]),
});

// 3. Sentiment Analysis Schemas
export const SentimentInput = z.object({
	texts: z.array(z.string()),
});
export const SentimentOutput = z.object({
	scores: z.array(z.object({ value: z.number(), rationale: z.string() })),
	average: z.number(),
});

// 4. Improvement Tracker Schemas
export const ImprovementTrackerInput = z.object({
	businessName: z.string(),
	currentScore: z.number(),
	previousScore: z.number(),
	appliedFixes: z
		.array(
			z.object({
				fixType: z.string(),
				appliedDate: z.string(),
				expectedImpact: z.number(),
			})
		)
		.optional(),
});
export const ImprovementTrackerOutput = z.object({
	trend: z.enum(["improving", "declining", "stable"]),
	delta: z.number(),
	recommendation: z.string(),
});

// 5. Benchmark Comparator Schemas
export const BenchmarkComparatorInput = z.object({
	businessName: z.string(),
	industry: z.string(),
	currentScore: z.number(),
	industryAverage: z.number().optional(),
	topPerformerScore: z.number().optional(),
	competitorScores: z
		.array(z.object({ name: z.string(), score: z.number() }))
		.optional(),
});
export const BenchmarkComparatorOutput = z.object({
	percentile: z.number().min(0).max(100),
	category: z.enum(["lagging", "average", "above-average", "leading"]),
	gapToAverage: z.number().optional(),
	gapToTop: z.number().optional(),
	recommendation: z.string(),
});

/* ===========================================================================
   TOOLS
============================================================================ */

/**
 * @tool geo-visibility-scorer
 * @desc Compute a single GEO visibility percentage (0–100) for a website.
 */
export const geoVisibilityScorer = createTool({
	id: "geo-visibility-scorer",
	description: "Compute GEO visibility % across AI engines",
	inputSchema: GEOVisibilityInput,
	outputSchema: GEOVisibilityOutput,
	execute: async ({ context }) => {
		const prompt = `
You are a GEO analyst. Given the AI engine mentions for ${context.businessName} (${context.website}),
compute a visibility score (0–100). Use:
- Mention frequency
- Rank positions (higher is better)
- Context relevance
Return JSON: { score, explanation }.
AI Engine Results:
${JSON.stringify(context.aiEngineResults, null, 2)}
`;
		try {
			return await llmJSONCall(GEOVisibilityOutput, prompt);
		} catch (error) {
			console.warn(
				"[geoVisibilityScorer] LLM analysis failed, using fallback:",
				error
			);
			// Fallback: calculate a basic score based on mention count
			const mentionCount = context.aiEngineResults.length;
			const fallbackScore = Math.min(100, mentionCount * 10); // 10 points per mention, max 100
			return {
				score: fallbackScore,
				explanation: `Could not perform detailed analysis. Calculated basic score of ${fallbackScore} based on ${mentionCount} mentions.`,
			};
		}
	},
});

/**
 * @tool quick-score-calculator
 * @desc Calculate a GEO score using a simple weighted formula.
 */
export const quickScoreCalculator = createTool({
	id: "quick-score-calculator",
	description:
		"Calculate a GEO score from mentions, position, and engine coverage",
	inputSchema: QuickScoreInput,
	outputSchema: QuickScoreOutput,
	execute: async ({ context }) => {
		const { mentions, totalQueries, avgPosition, engines, contextRelevance } =
			context;

		const mentionRate = totalQueries ? (mentions / totalQueries) * 100 : 0;
		const positionScore = avgPosition ? Math.max(0, 100 - avgPosition * 10) : 0;
		const engineCoverage = (engines.length / 4) * 100;
		const relevanceBonus =
			contextRelevance === "high" ? 10 : contextRelevance === "medium" ? 5 : 0;

		const raw =
			mentionRate * 0.4 +
			positionScore * 0.3 +
			engineCoverage * 0.2 +
			relevanceBonus * 0.1;

		const score = Math.round(Math.min(100, raw));
		// explicitly type category
		const category: z.infer<typeof QuickScoreOutput>["category"] =
			score >= 76
				? "excellent"
				: score >= 51
					? "good"
					: score >= 26
						? "fair"
						: "poor";

		return {
			score,
			breakdown: {
				mentionRate: Math.round(mentionRate),
				positionScore: Math.round(positionScore),
				engineCoverage: Math.round(engineCoverage),
				relevanceBonus,
			},
			category,
		};
	},
});

/**
 * @tool sentiment-tool
 * @desc Perform sentiment analysis on an array of text lines.
 */
export const sentimentTool = createTool({
	id: "sentiment-tool",
	description: "LLM-powered sentiment scoring with explanations",
	inputSchema: SentimentInput,
	outputSchema: SentimentOutput,
	execute: async ({ context: { texts } }) => {
		const prompt = `
Classify each line's sentiment on a scale -1 (very negative) to 1 (very positive), and give a one-sentence rationale.
Lines:
${texts.map((t, i) => `${i + 1}. ${t}`).join("\n")}
Return JSON: { scores: [{ value, rationale }], average }.
`;
		try {
			const { scores } = await llmJSONCall(SentimentOutput, prompt);
			const avg =
				scores.length > 0
					? scores.reduce((sum, s) => sum + s.value, 0) / scores.length
					: 0;
			return { scores, average: Number(avg.toFixed(3)) };
		} catch (error) {
			console.warn(
				"[sentimentTool] LLM analysis failed, using fallback:",
				error
			);
			// Fallback: create neutral scores for all texts
			const fallbackScores = texts.map((text, index) => ({
				value: 0, // Neutral sentiment
				rationale: `Could not analyze sentiment for text ${index + 1}. Using neutral fallback.`,
			}));
			return { scores: fallbackScores, average: 0 };
		}
	},
});

/**
 * @tool improvement-tracker
 * @desc Compare current vs previous GEO score and suggest next steps.
 */
export const improvementTracker = createTool({
	id: "improvement-tracker",
	description: "Track GEO score change and recommend next steps",
	inputSchema: ImprovementTrackerInput,
	outputSchema: ImprovementTrackerOutput,
	execute: async ({ context }) => {
		const { businessName, currentScore, previousScore } = context;
		const delta = Math.round(currentScore - previousScore);
		const trend: z.infer<typeof ImprovementTrackerOutput>["trend"] =
			delta > 0 ? "improving" : delta < 0 ? "declining" : "stable";
		const recommendation =
			delta >= 0
				? `Keep applying your fixes—score is up by ${delta}.`
				: `Revisit recent fixes—score is down by ${-delta}.`;
		return { trend, delta, recommendation };
	},
});

/**
 * @tool benchmark-comparator
 * @desc Place a GEO score in context of industry and competitors.
 */
export const benchmarkComparator = createTool({
	id: "benchmark-comparator",
	description: "Place a GEO score in context vs. benchmarks",
	inputSchema: BenchmarkComparatorInput,
	outputSchema: BenchmarkComparatorOutput,
	execute: async ({ context }) => {
		const {
			businessName,
			industry,
			currentScore,
			industryAverage,
			topPerformerScore,
		} = context;

		let percentile = 50;
		if (industryAverage != null) {
			percentile = Math.round((currentScore / industryAverage) * 50 + 25);
		}

		const category: z.infer<typeof BenchmarkComparatorOutput>["category"] =
			percentile >= 76
				? "leading"
				: percentile >= 51
					? "above-average"
					: percentile >= 26
						? "average"
						: "lagging";

		const gapToAverage =
			industryAverage != null
				? Math.round(currentScore - industryAverage)
				: undefined;
		const gapToTop =
			topPerformerScore != null
				? Math.round(topPerformerScore - currentScore)
				: undefined;

		const recommendation = `Your GEO score (${currentScore}) is ${category} in ${industry}.`;

		return { percentile, category, gapToAverage, gapToTop, recommendation };
	},
});

/* Export all tools */
export const geoAnalysisTools = {
	geoVisibilityScorer,
	quickScoreCalculator,
	sentimentTool,
	improvementTracker,
	benchmarkComparator,
};
