"use client";

import { V2GenericChatCanvas } from "../chat/v2-generic-chat-canvas";
import { PlatformEmptyState } from "./platform-empty-state";

interface PlatformChatCanvasProps {
	className?: string;
}

export function PlatformChatCanvas({ className }: PlatformChatCanvasProps) {
	return (
		<V2GenericChatCanvas
			className={className}
			chatId="v2-platforms"
			api="/api/platforms/chat"
			initialMessages={[
				{
					id: "welcome",
					role: "assistant",
					content:
						"Welcome to Platform Performance Analysis! I can help you analyze your brand's performance across AI platforms like ChatGPT, Claude, Gemini, and Perplexity. What would you like to explore?",
				},
			]}
			EmptyState={PlatformEmptyState}
			inputPlaceholder="Ask about platform performance, optimization recommendations, or cross-platform comparisons..."
		/>
	);
}
