"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useV2Chat } from "../../../lib/v2/sdk-validation";
import { ErrorFallback } from "../chat/error-fallback";
import { V2ChatInput } from "../chat/v2-chat-input";
import { V2MessageList } from "../chat/v2-message-list";
import { DashboardEmptyState } from "./dashboard-empty-state";

interface DashboardChatCanvasProps {
	className?: string;
}

export function DashboardChatCanvas({ className }: DashboardChatCanvasProps) {
	const [error, setError] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [localInput, setLocalInput] = useState<string>("");

	const chatHookResult = useV2Chat({
		id: "v2-dashboard",
		api: "/api/dashboard/chat", // Dashboard-specific API endpoint
		onError: (error) => {
			setError(error.message);
			console.error("V2 Dashboard Chat error:", error);
		},
		onResponse: () => {
			setError(null);
		},
		onFinish: () => {
			console.log("V2 Dashboard Chat message finished");
		},
		// Dashboard-specific initial messages
		initialMessages: [
			{
				id: "welcome",
				role: "assistant",
				content:
					"Welcome to your Brand Visibility Dashboard! I can help you analyze your GEO score, track performance metrics, and explore your brand's AI presence. What would you like to know?",
			},
		],
	});

	// Destructure with fallbacks to prevent undefined errors
	const {
		messages = [],
		append = () => {},
		status = "idle",
		error: chatError = null,
		input: aiInput = "",
		setInput: aiSetInput = () => {},
		handleSubmit: aiHandleSubmit = () => {},
		stop = () => {},
		reload = () => {},
		validation = { compatible: true },
	} = chatHookResult || {};

	// Use AI SDK input if available, otherwise use local state
	const input = aiInput || localInput;
	const setInput =
		aiSetInput && aiSetInput.toString() !== "()=>{}"
			? aiSetInput
			: setLocalInput;
	const handleSubmit =
		aiHandleSubmit && aiHandleSubmit.toString() !== "()=>{}"
			? aiHandleSubmit
			: (e: React.FormEvent) => {
					e.preventDefault();
					console.log("Using local submit for:", input);
				};

	// Initialize component
	useEffect(() => {
		if (!isInitialized) {
			console.log("Dashboard Chat Canvas initialized");
			setIsInitialized(true);
		}
	}, [isInitialized]);

	// Handle retry for errors
	const handleRetry = () => {
		setError(null);
		reload();
	};

	// Show error fallback if there's an error
	if (error || chatError) {
		return (
			<ErrorFallback
				error={error || chatError?.message || "Unknown error"}
				onRetry={handleRetry}
				className="min-h-[600px]"
			/>
		);
	}

	// Show validation error if SDK is incompatible
	if (!validation.compatible) {
		return (
			<ErrorFallback
				error={`AI SDK compatibility issue: ${validation.error}`}
				onRetry={handleRetry}
				className="min-h-[600px]"
			/>
		);
	}

	const hasMessages = messages.length > 1; // More than just the welcome message
	const isLoading = status === "in_progress";

	return (
		<div className={`flex flex-col h-full min-h-[600px] ${className}`}>
			{/* Chat Messages Area */}
			<div className="flex-1 overflow-hidden">
				<AnimatePresence mode="wait">
					{!hasMessages ? (
						<motion.div
							key="empty-state"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
							className="h-full"
						>
							<div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
								<DashboardEmptyState
									onQuerySelect={(query) => {
										setInput(input ? `${input} ${query}` : query);
									}}
								/>

								{/* Inline input on initial state */}
								<div className="mt-6 w-full">
									<V2ChatInput
										input={input}
										setInput={setInput}
										handleSubmit={handleSubmit}
										isLoading={isLoading}
										stop={stop}
										placeholder="Ask about your brand visibility, GEO score, or performance metrics..."
										className="w-full"
										variant="inline"
									/>
								</div>
							</div>
						</motion.div>
					) : (
						<motion.div
							key="messages"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="h-full"
						>
							<V2MessageList
								messages={messages}
								isLoading={isLoading}
								className="h-full"
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Remove separate suggested queries strip; handled inline above */}

			{/* Fixed bottom input after first message */}
			{hasMessages && (
				<div className="flex-shrink-0">
					<V2ChatInput
						input={input}
						setInput={setInput}
						handleSubmit={handleSubmit}
						isLoading={isLoading}
						stop={stop}
						placeholder="Ask about your brand visibility, GEO score, or performance metrics..."
						className="w-full"
						variant="fixed"
					/>
				</div>
			)}
		</div>
	);
}
