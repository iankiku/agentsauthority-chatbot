/**
 * Artifact types for the dashboard application
 */

export interface Artifact {
	id: string;
	type: string;
	data: any;
}

export type ArtifactType =
	| "geo_score_card"
	| "competitor_matrix"
	| "data_table"
	| "line_chart"
	| "recommendations_card"
	| "dashboard_layout";

/**
 * Data Table Artifact
 */
export interface DataTableArtifact extends Artifact {
	type: "data_table";
	data: {
		headers: string[];
		rows: any[][];
		title?: string;
		description?: string;
	};
}

/**
 * Line Chart Artifact
 */
export interface LineChartArtifact extends Artifact {
	type: "line_chart";
	data: {
		labels: string[];
		datasets: {
			label: string;
			data: number[];
			borderColor?: string;
			backgroundColor?: string;
		}[];
		title?: string;
		description?: string;
	};
}

/**
 * GEO Score Card Artifact
 */
export interface GeoScoreCardArtifact extends Artifact {
	type: "geo_score_card";
	data: {
		score: number;
		description: string;
		change?: number;
		changeType?: "increase" | "decrease" | "neutral";
		trendData?: number[];
		targetAudience?: string;
		location?: string;
	};
}

/**
 * Competitor Matrix Artifact
 */
export interface CompetitorMatrixArtifact extends Artifact {
	type: "competitor_matrix";
	data: {
		competitors: string[];
		metrics: string[];
		scores: Record<string, Record<string, number>>;
		title?: string;
		description?: string;
	};
}

/**
 * Recommendations Card Artifact
 */
export interface RecommendationsCardArtifact extends Artifact {
	type: "recommendations_card";
	data: {
		title: string;
		recommendations: {
			id: string;
			text: string;
			action?: string;
			impact?: string;
		}[];
		source?: string;
	};
}

/**
 * Dashboard Layout Artifact
 */
export interface DashboardLayoutArtifact extends Artifact {
	type: "dashboard_layout";
	data: {
		layout: {
			i: string;
			x: number;
			y: number;
			w: number;
			h: number;
			minW?: number;
			maxW?: number;
			minH?: number;
			maxH?: number;
			isDraggable?: boolean;
			isResizable?: boolean;
			content: {
				type: string;
				data: any;
			};
		}[];
	};
}
