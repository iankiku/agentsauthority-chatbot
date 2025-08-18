"use client";

import { V2GenericChatCanvas } from "../chat/v2-generic-chat-canvas";
import { InsightsEmptyState } from "./insights-empty-state";

interface InsightsChatCanvasProps {
	className?: string;
}

export function InsightsChatCanvas({ className }: InsightsChatCanvasProps) {
	return (
		<V2GenericChatCanvas
			className={className}
			chatId="v2-insights"
			api="/api/insights/chat"
			initialMessages={[
				{
					id: "welcome",
					role: "assistant",
					content:
						"Welcome to AI-Powered Insights! I can help you generate insights about your brand visibility patterns, identify opportunities, and provide actionable recommendations. What would you like to explore?",
				},
			]}
			EmptyState={InsightsEmptyState}
			inputPlaceholder="Ask for insights, pattern analysis, or strategic recommendations..."
		/>
	);
}
