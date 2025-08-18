"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import type { UIMessage } from "@ai-sdk/react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
	CornerDownLeft,
	Image as ImageIcon,
	Mic,
	Paperclip,
	Send,
	Sparkles,
	Square,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatInputProps {
	input: string;
	setInput: (value: string) => void;
	handleSubmit: (e: React.FormEvent) => void;
	status: string;
	stop: () => void;
	messages: UIMessage[];
	mode: "chat" | "artifact" | "split";
}

export function ChatInput({
	input,
	setInput,
	handleSubmit,
	status,
	stop,
	messages,
	mode,
}: ChatInputProps) {
	const [isRecording, setIsRecording] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const isMobile = useIsMobile();

	const isLoading = status === "loading" || status === "streaming";
	const canSend = input && input.trim().length > 0 && !isLoading;

	// Auto-resize textarea
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
		}
	}, [input]);

	// Focus textarea on mount
	useEffect(() => {
		if (!isMobile) {
			textareaRef.current?.focus();
		}
	}, [isMobile]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				if (canSend) {
					handleSubmit(e as any);
				}
			}
		},
		[canSend, handleSubmit]
	);

	const handleVoiceInput = () => {
		setIsRecording(!isRecording);
		// Implement voice recording logic
	};

	const handleFileUpload = () => {
		// Implement file upload logic
		console.log("File upload clicked");
	};

	const handleImageUpload = () => {
		// Implement image upload logic
		console.log("Image upload clicked");
	};

	const suggestions = [
		"Analyze my website's SEO performance",
		"Create a competitor analysis report",
		"Generate a content strategy",
		"Build a landing page",
		"Design a dashboard component",
	];

	const handleSuggestionClick = (suggestion: string) => {
		setInput(suggestion);
		setShowSuggestions(false);
		textareaRef.current?.focus();
	};

	return (
		<div className="relative">
			{/* Suggestions Panel */}
			<AnimatePresence>
				{showSuggestions && messages.length === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						className="absolute bottom-full left-0 right-0 mb-2 p-4 bg-background border rounded-lg shadow-lg"
					>
						<div className="flex items-center space-x-2 mb-3">
							<Sparkles className="w-4 h-4 text-primary" />
							<span className="text-sm font-medium">Suggestions</span>
						</div>
						<div className="grid gap-2">
							{suggestions.map((suggestion, index) => (
								<button
									key={index}
									onClick={() => handleSuggestionClick(suggestion)}
									className="text-left p-2 text-sm rounded-md hover:bg-muted transition-colors"
								>
									{suggestion}
								</button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Input Container */}
			<div
				className={cn(
					"flex items-end space-x-2 p-4",
					mode === "split" ? "max-w-none" : "max-w-3xl mx-auto"
				)}
			>
				{/* Attachment Buttons */}
				<div className="flex items-end space-x-1 pb-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleFileUpload}
								className="h-8 w-8 p-0"
							>
								<Paperclip className="w-4 h-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Attach file</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleImageUpload}
								className="h-8 w-8 p-0"
							>
								<ImageIcon className="w-4 h-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Upload image</TooltipContent>
					</Tooltip>
				</div>

				{/* Input Field */}
				<div className="flex-1 relative">
					<Textarea
						ref={textareaRef}
						value={input || ""}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						onFocus={() => setShowSuggestions(messages.length === 0)}
						onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
						placeholder={
							mode === "artifact"
								? "Ask me to modify the artifact or create something new..."
								: "Ask me anything about your brand's AI visibility..."
						}
						className={cn(
							"min-h-[44px] max-h-[200px] resize-none pr-12",
							"focus:ring-2 focus:ring-primary focus:border-transparent"
						)}
						disabled={isLoading}
					/>

					{/* Voice Input Button */}
					<div className="absolute right-2 bottom-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleVoiceInput}
									className={cn(
										"h-8 w-8 p-0",
										isRecording && "text-red-500 animate-pulse"
									)}
								>
									<Mic className="w-4 h-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{isRecording ? "Stop recording" : "Voice input"}
							</TooltipContent>
						</Tooltip>
					</div>
				</div>

				{/* Send/Stop Button */}
				<div className="pb-2">
					{isLoading ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									onClick={stop}
									className="h-8 w-8 p-0"
								>
									<Square className="w-4 h-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Stop generation</TooltipContent>
						</Tooltip>
					) : (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="submit"
									size="sm"
									onClick={handleSubmit}
									disabled={!canSend}
									className="h-8 w-8 p-0"
								>
									<Send className="w-4 h-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								Send message {!isMobile && "(Enter)"}
							</TooltipContent>
						</Tooltip>
					)}
				</div>
			</div>

			{/* Keyboard Shortcut Hint */}
			{!isMobile && input.length > 0 && !isLoading && (
				<div className="absolute right-6 bottom-16 text-xs text-muted-foreground flex items-center space-x-1">
					<CornerDownLeft className="w-3 h-3" />
					<span>Send</span>
				</div>
			)}
		</div>
	);
}
