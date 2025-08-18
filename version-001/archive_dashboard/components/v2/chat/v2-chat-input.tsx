"use client";

import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/utils";
import { motion } from "framer-motion";
import { Mic, Plus, Send, Square, Waves } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface V2ChatInputProps {
	input: string;
	setInput: (value: string) => void;
	handleSubmit: (e: React.FormEvent) => void;
	isLoading: boolean;
	stop: () => void;
	placeholder?: string;
	className?: string;
	/**
	 * fixed: pinned at the bottom (uses .v2-chat-input positioning)
	 * inline: flows within layout (used for initial centered view)
	 */
	variant?: "fixed" | "inline";
}

export function V2ChatInput({
	input = "",
	setInput = () => {},
	handleSubmit = () => {},
	isLoading = false,
	stop = () => {},
	placeholder = "Ask me anything about your brand's AI visibility...",
	className,
	variant = "fixed",
}: V2ChatInputProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [isFocused, setIsFocused] = useState(false);

	// Ensure input is always a string
	const safeInput = typeof input === "string" ? input : "";

	// Debug input changes (simplified)
	useEffect(() => {
		console.log("💬 V2ChatInput input:", safeInput);
	}, [safeInput]);

	// Auto-resize textarea
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
		}
	}, [safeInput]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				console.log("⌨️ Enter pressed, input:", safeInput);
				console.log("⌨️ isLoading:", isLoading);
				console.log("⌨️ handleSubmit:", handleSubmit);
				e.preventDefault();
				if (safeInput.trim() && !isLoading) {
					console.log("⌨️ Calling handleSubmit");
					handleSubmit(e);
				} else {
					console.warn("⌨️ Cannot submit - empty input or loading");
				}
			}
		},
		[safeInput, isLoading, handleSubmit]
	);

	const canSend = useMemo(
		() => safeInput.trim().length > 0 && !isLoading,
		[safeInput, isLoading]
	);

	return (
		<div
			className={cn(
				variant === "fixed" ? "v2-chat-input" : "w-full max-w-2xl mx-auto px-4",
				className
			)}
		>
			{/* Input Container */}
			<motion.div
				layout
				className={cn(
					"bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg",
					// Reduced border radius from rounded-full to rounded-2xl
					"rounded-2xl px-4 py-3",
					isFocused && "ring-2 ring-orange-200/50 border-orange-300 shadow-xl"
				)}
			>
				<form
					onSubmit={(e) => {
						console.log("📝 Form onSubmit triggered");
						console.log("📝 Input:", safeInput);
						console.log("📝 handleSubmit:", handleSubmit);
						handleSubmit(e);
					}}
					data-chat-form
					className="flex items-center gap-2"
				>
					{/* Left icon */}
					<button
						type="button"
						aria-label="Add"
						className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
					>
						<Plus className="w-5 h-5" />
					</button>

					{/* Textarea */}
					<div className="flex-1">
						<Textarea
							ref={textareaRef}
							value={safeInput}
							onChange={(e) => {
								console.log("💬 Input onChange:", e.target.value);
								console.log("💬 setInput function:", setInput);
								if (typeof setInput === "function") {
									setInput(e.target.value);
									console.log("💬 Input set to:", e.target.value);
								} else {
									console.warn("💬 setInput is not a function:", setInput);
								}
							}}
							onKeyDown={handleKeyDown}
							onFocus={() => {
								setIsFocused(true);
							}}
							onBlur={() => {
								setIsFocused(false);
							}}
							placeholder={placeholder}
							className={cn(
								"min-h-[40px] max-h-[200px] resize-none",
								"border-0 bg-transparent focus:ring-0 focus:border-0 focus-visible:ring-0",
								"placeholder:text-gray-400 text-gray-900 leading-relaxed",
								"px-2 py-2"
							)}
							disabled={isLoading}
							aria-label="Chat message input"
							aria-describedby="chat-input-help"
						/>
					</div>

					{/* Right-side icons */}
					<button
						type="button"
						aria-label="Voice input"
						className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
					>
						<Mic className="w-5 h-5" />
					</button>
					<button
						type="button"
						aria-label="Waveform"
						className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
					>
						<Waves className="w-5 h-5" />
					</button>

					{/* Send/Stop Button */}
					<Button
						type={isLoading ? "button" : "submit"}
						onClick={isLoading ? stop : (e) => {
							console.log("🔘 Send button clicked");
							console.log("🔘 Input:", safeInput);
							console.log("🔘 canSend:", canSend);
							if (!canSend) {
								e.preventDefault();
								console.warn("🔘 Send prevented - canSend is false");
							}
						}}
						disabled={!canSend && !isLoading}
						size="sm"
						className={cn(
							"shrink-0 h-9 w-9 p-0 rounded-full transition-all duration-200",
							isLoading
								? "bg-gray-100 hover:bg-gray-200 text-gray-600"
								: canSend
									? "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg"
									: "bg-gray-100 text-gray-400 cursor-not-allowed"
						)}
						aria-label={isLoading ? "Stop generating" : "Send message"}
					>
						{isLoading ? (
							<Square className="w-4 h-4" />
						) : (
							<Send className="w-4 h-4" />
						)}
					</Button>

					{/* Hidden help text for accessibility */}
					<div id="chat-input-help" className="sr-only">
						Press Enter to send your message, or Shift+Enter for a new line
					</div>
				</form>
			</motion.div>
		</div>
	);
}
