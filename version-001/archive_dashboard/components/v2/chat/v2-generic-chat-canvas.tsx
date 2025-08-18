"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useV2Chat } from "../../../lib/v2/sdk-validation";
import { ErrorFallback } from "./error-fallback";
import { V2ChatInput } from "./v2-chat-input";
import { V2MessageList } from "./v2-message-list";

type EmptyStateComponent = (props: {
	onQuerySelect: (query: string) => void;
}) => JSX.Element;

interface V2GenericChatCanvasProps {
	className?: string;
	chatId: string;
	api: string;
	initialMessages?: Array<{ id: string; role: string; content: string }>;
	EmptyState: EmptyStateComponent;
	inputPlaceholder?: string;
}

export function V2GenericChatCanvas({
	className,
	chatId,
	api,
	initialMessages,
	EmptyState,
	inputPlaceholder,
}: V2GenericChatCanvasProps) {
	const [error, setError] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [localInput, setLocalInput] = useState<string>("");

	const chatHookResult = useV2Chat({
		id: chatId,
		api,
		initialMessages,
		onError: (err: any) => {
			setError(err.message);
			console.error(`${chatId} error:`, err);
		},
		onResponse: () => setError(null),
		onFinish: () => {
			if (process.env.NODE_ENV === "development") {
				console.log(`${chatId} message finished`);
			}
		},
	});

	const {
		messages = [],
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

	useEffect(() => {
		if (!isInitialized) setIsInitialized(true);
	}, [isInitialized]);

	const initialCount = useMemo(
		() => initialMessages?.length ?? 0,
		[initialMessages]
	);
	const hasMessages = messages.length > initialCount;
	const isLoading = status === "in_progress" || status === "loading";

	const handleRetry = () => {
		setError(null);
		reload();
	};

	if (error || chatError) {
		return (
			<ErrorFallback
				error={error || chatError?.message || "Unknown error"}
				onRetry={handleRetry}
				className="min-h-[600px]"
			/>
		);
	}

	if (!validation.compatible) {
		return (
			<ErrorFallback
				error={`AI SDK compatibility issue: ${validation.error}`}
				onRetry={handleRetry}
				className="min-h-[600px]"
			/>
		);
	}

	return (
		<div className={`flex flex-col h-full min-h-[600px] ${className || ""}`}>
			{/* Chat Messages Area */}
			<div className="flex-1 overflow-hidden relative">
				<AnimatePresence mode="wait">
					{!hasMessages ? (
						<motion.div
							key="empty-state"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
							className="h-full absolute inset-0"
						>
							<div className="flex flex-col items-center justify-center min-h-full px-4 text-center">
								<EmptyState
									onQuerySelect={(query) => {
										console.log("🔥 Setting input to:", query);
										console.log("🔥 Current input before:", input);
										console.log("🔥 setInput function:", setInput);
										setInput(query);
										// Verify the input changed
										setTimeout(() => {
											console.log("🔥 Input after setInput:", input);
											const inputElement = document.querySelector(
												'textarea[placeholder*="Ask"]'
											) as HTMLTextAreaElement;
											if (inputElement) {
												console.log("🔥 Textarea value:", inputElement.value);
												inputElement.focus();
											}
										}, 100);
									}}
								/>

								{/* Centered input */}
								<div className="mt-8 w-full max-w-2xl">
									<V2ChatInput
										input={input}
										setInput={setInput}
										handleSubmit={handleSubmit}
										isLoading={isLoading}
										stop={stop}
										placeholder={inputPlaceholder}
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

			{/* Bottom input once conversation begins */}
			{hasMessages && (
				<V2ChatInput
					input={input}
					setInput={setInput}
					handleSubmit={handleSubmit}
					isLoading={isLoading}
					stop={stop}
					placeholder={inputPlaceholder}
					className="w-full"
				/>
			)}
		</div>
	);
}
