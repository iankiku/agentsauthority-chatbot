"use client";

import { ErrorMessage } from "@/components/messages/error-message";
import { Message } from "@/components/messages/message";
import { ThinkingMessage } from "@/components/messages/thinking-message";
import type { UIMessage } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useRef } from "react";
import { EmptyState } from "./empty-state";
import { ScrollToBottom } from "./scroll-to-bottom";

interface ChatInterfaceProps {
	messages: UIMessage[];
	status: string;
	error?: Error;
	onRetry?: () => void;
	mode: "chat" | "artifact" | "split";
}

function PureChatInterface({
	messages,
	status,
	error,
	onRetry,
	mode,
}: ChatInterfaceProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (status === "streaming" || status === "loading") {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages.length, status]);

	// Show error state
	if (error && onRetry) {
		return (
			<div className="flex-1 flex items-center justify-center p-4">
				<ErrorMessage error={error} onRetry={onRetry} />
			</div>
		);
	}

	// Show empty state
	if (messages.length === 0) {
		return (
			<div className="flex-1 flex items-center justify-center p-4">
				<EmptyState mode={mode} />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			{/* Messages Container */}
			<div
				ref={containerRef}
				className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
			>
				<AnimatePresence mode="popLayout">
					{messages.map((message, index) => (
						<motion.div
							key={message.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
						>
							<Message
								message={message}
								isLoading={
									status === "streaming" && index === messages.length - 1
								}
								isReadonly={false}
								requiresScrollPadding={false}
								mode={mode}
							/>
						</motion.div>
					))}
				</AnimatePresence>

				{/* Thinking indicator */}
				{status === "loading" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
					>
						<ThinkingMessage />
					</motion.div>
				)}

				{/* Scroll anchor */}
				<div ref={messagesEndRef} />
			</div>

			{/* Scroll to bottom button */}
			<ScrollToBottom containerRef={containerRef} />
		</div>
	);
}

export const ChatInterface = memo(PureChatInterface);
