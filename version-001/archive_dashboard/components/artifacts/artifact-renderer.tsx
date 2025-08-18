"use client";

import { UIMessage } from "@ai-sdk/react";
import { memo } from "react";
import { CompetitorMatrix } from "./competitor-matrix";
import { DataTable } from "./data-table";
import { GeoScoreCard } from "./geo-score-card";
import { LineChartComponent } from "./line-chart";

const ARTIFACT_COMPONENTS: Record<
	string,
	React.ComponentType<{ data: any }>
> = {
	geo_score_card: GeoScoreCard,
	competitor_matrix: CompetitorMatrix,
	data_table: DataTable,
	line_chart: LineChartComponent,
};

interface ArtifactRendererProps {
	messages: UIMessage[];
}

function PureArtifactRenderer({ messages }: ArtifactRendererProps) {
	const message = messages[0];
	const artifact = message?.toolInvocations?.[0]?.result as any;

	if (!artifact || !message) {
		return null;
	}

	const Component = ARTIFACT_COMPONENTS[artifact.type];

	if (!Component) {
		return <div>Unsupported artifact type: {artifact.type}</div>;
	}

	return (
		<div className="relative">
			{/* Pin button positioned in top-right corner */}
			<div className="absolute top-2 right-2 z-10">
				<ArtifactPinButton message={message} />
			</div>

			{/* Artifact component */}
			<Component data={artifact.data} />
		</div>
	);
}

export const ArtifactRenderer = memo(PureArtifactRenderer);
