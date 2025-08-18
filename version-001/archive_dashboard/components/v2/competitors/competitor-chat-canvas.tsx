"use client";

import { V2GenericChatCanvas } from "../chat/v2-generic-chat-canvas";
import { CompetitorEmptyState } from "./competitor-empty-state";

interface CompetitorChatCanvasProps {
	className?: string;
}

export function CompetitorChatCanvas({ className }: CompetitorChatCanvasProps) {
	return (
		<V2GenericChatCanvas
			className={className}
			chatId="v2-competitors"
			api="/api/competitors/chat"
			initialMessages={[
				{
					id: "welcome",
					role: "assistant",
					content:
						"Welcome to Competitive Analysis! I can help you compare your brand against competitors, analyze market positioning, and identify competitive gaps. What would you like to explore?",
				},
			]}
			EmptyState={CompetitorEmptyState}
			inputPlaceholder="Ask about competitor analysis, market positioning, or competitive gaps..."
		/>
	);
}
