"use client";

import type { ChatMessage } from "@/lib/v2/mastra-chat-adapter";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { V2Message } from "./v2-message";
import { V2TypingIndicator } from "./v2-typing-indicator";

interface V2MessageListProps {
	messages: ChatMessage[];
	isLoading: boolean;
	className?: string;
}

export function V2MessageList({
	messages,
	isLoading,
	className,
}: V2MessageListProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const endRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (isLoading || messages.length > 0) {
			endRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}
	}, [messages.length, isLoading]);

	// Filter out system messages for display
	const displayMessages = messages.filter((msg) => msg.role !== "system");

	return (
		<div
			ref={containerRef}
			className={`h-full overflow-y-auto pb-32 ${className} scroll-smooth`}
		>
			<div className="v2-message-container max-w-3xl mx-auto px-6 py-12">
				<AnimatePresence initial={false}>
					{displayMessages.map((message, index) => (
						<motion.div
							key={message.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{
								duration: 0.4,
								delay: index * 0.03,
								ease: "easeOut",
							}}
							className="mb-6"
						>
							<V2Message
								message={message}
								isLast={index === displayMessages.length - 1}
							/>
						</motion.div>
					))}
				</AnimatePresence>

				{/* Typing Indicator */}
				<AnimatePresence>
					{isLoading && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="mb-6"
						>
							<V2TypingIndicator />
						</motion.div>
					)}
				</AnimatePresence>

				{/* Scroll anchor */}
				<div ref={endRef} className="h-1" />
			</div>
		</div>
	);
}
