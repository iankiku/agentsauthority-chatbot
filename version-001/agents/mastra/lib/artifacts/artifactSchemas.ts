import { z } from "zod";

// ============================================================================
// Base Artifact Schema
// ============================================================================
export const BaseArtifactSchema = z.object({
	type: z
		.string()
		.describe(
			"A string identifying the type of UI artifact (e.g., 'data-table', 'line-chart', 'geo-score-card')."
		),
	data: z
		.record(z.any())
		.describe("An object containing the artifact-specific payload."),
	metadata: z
		.record(z.any())
		.optional()
		.describe(
			"Optional metadata about the artifact, such as agentName, toolUsed, timestamp."
		),
});

export type BaseArtifact = z.infer<typeof BaseArtifactSchema>;

// ============================================================================
// Specific Artifact Schemas
// ============================================================================

// DataTableSchema for tabular data
export const DataTableSchema = BaseArtifactSchema.extend({
	type: z.literal("data-table"),
	data: z.object({
		headers: z.array(z.string()).describe("Array of column headers."),
		rows: z
			.array(z.array(z.any()))
			.describe(
				"Array of data rows, where each row is an array of values corresponding to headers."
			),
		title: z.string().optional().describe("Optional title for the data table."),
		description: z
			.string()
			.optional()
			.describe("Optional description for the data table."),
	}),
});
export type DataTableArtifact = z.infer<typeof DataTableSchema>;

// LineChartSchema for line graph data
export const LineChartSchema = BaseArtifactSchema.extend({
	type: z.literal("line-chart"),
	data: z.object({
		labels: z
			.array(z.string())
			.describe("Labels for the X-axis (e.g., time periods)."),
		datasets: z
			.array(
				z.object({
					label: z
						.string()
						.describe("Label for the dataset (e.g., 'Revenue')."),
					data: z.array(z.number()).describe("Array of numerical data points."),
					borderColor: z.string().optional().describe("Color for the line."),
					backgroundColor: z
						.string()
						.optional()
						.describe("Background color for points."),
				})
			)
			.describe("Array of datasets to be plotted."),
		title: z.string().optional().describe("Optional title for the line chart."),
		description: z
			.string()
			.optional()
			.describe("Optional description for the line chart."),
	}),
});
export type LineChartArtifact = z.infer<typeof LineChartSchema>;

// GeoScoreCardSchema for the GEO Score Card artifact
export const GeoScoreCardSchema = BaseArtifactSchema.extend({
	type: z.literal("geo-score-card"),
	data: z.object({
		score: z.number().describe("The GEO score value."),
		description: z
			.string()
			.describe("A brief description or interpretation of the GEO score."),
		change: z
			.number()
			.optional()
			.describe("Optional: Change in score from a previous period."),
		changeType: z
			.enum(["increase", "decrease", "neutral"])
			.optional()
			.describe("Optional: Type of change (increase, decrease, neutral)."),
		trendData: z
			.array(z.number())
			.optional()
			.describe(
				"Optional: Array of numbers representing historical data for a sparkline."
			),
		targetAudience: z
			.string()
			.optional()
			.describe("Optional: The target audience this score relates to."),
		location: z
			.string()
			.optional()
			.describe("Optional: The geographical location this score pertains to."),
	}),
});
export type GeoScoreCardArtifact = z.infer<typeof GeoScoreCardSchema>;

// RecommendationsCardSchema for actionable recommendations
export const RecommendationsCardSchema = BaseArtifactSchema.extend({
	type: z.literal("recommendations-card"),
	data: z.object({
		title: z.string().describe("Title of the recommendations card."),
		recommendations: z
			.array(
				z.object({
					id: z.string().describe("Unique ID for the recommendation."),
					text: z.string().describe("The recommendation text."),
					action: z
						.string()
						.optional()
						.describe("Optional: A suggested action or link."),
					impact: z
						.string()
						.optional()
						.describe("Optional: Estimated impact of the recommendation."),
				})
			)
			.describe("Array of actionable recommendations."),
		source: z
			.string()
			.optional()
			.describe(
				"Optional: Source of the recommendations (e.g., 'AI Analysis', 'Industry Trends')."
			),
	}),
});
export type RecommendationsCardArtifact = z.infer<
	typeof RecommendationsCardSchema
>;

// DashboardLayoutSchema for draggable/resizable widget layouts
export const DashboardLayoutSchema = BaseArtifactSchema.extend({
	type: z.literal("dashboard-layout"),
	data: z.object({
		layout: z
			.array(
				z.object({
					i: z.string().describe("Unique ID of the grid item."),
					x: z.number().describe("X position of the item in the grid."),
					y: z.number().describe("Y position of the item in the grid."),
					w: z.number().describe("Width of the item in grid units."),
					h: z.number().describe("Height of the item in grid units."),
					minW: z.number().optional().describe("Minimum width of the item."),
					maxW: z.number().optional().describe("Maximum width of the item."),
					minH: z.number().optional().describe("Minimum height of the item."),
					maxH: z.number().optional().describe("Maximum height of the item."),
					isDraggable: z
						.boolean()
						.optional()
						.describe("Whether the item is draggable."),
					isResizable: z
						.boolean()
						.optional()
						.describe("Whether the item is resizable."),
					// The content of the widget itself will be an artifact, e.g., DataTableData, LineChartData
					// This needs to be flexible to hold any of the other artifact types
					content: z
						.object({
							type: z.string(), // e.g., "data-table", "line-chart", etc.
							data: z.record(z.any()),
						})
						.describe(
							"The artifact content to be rendered within this grid item."
						),
				})
			)
			.describe("Array of RGL layout items, each containing an artifact."),
	}),
});
export type DashboardLayoutArtifact = z.infer<typeof DashboardLayoutSchema>;

// ============================================================================
// Union Type for All Artifacts
// ============================================================================
export const AgentArtifactResponseSchema = z.discriminatedUnion("type", [
	DataTableSchema,
	LineChartSchema,
	GeoScoreCardSchema,
	RecommendationsCardSchema,
	DashboardLayoutSchema,
]);

export type AgentArtifactResponse = z.infer<typeof AgentArtifactResponseSchema>;

// Helper type for artifact types for use in utility functions
export type ArtifactType = z.infer<typeof AgentArtifactResponseSchema>["type"];
