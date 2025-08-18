"use client";

import type { ChatMessage } from "@/lib/v2/mastra-chat-adapter";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/utils";
import { motion } from "framer-motion";
import { Bot, Copy, Sparkles, ThumbsDown, ThumbsUp, User, AlertTriangle } from "lucide-react";
import { Suspense, lazy, memo } from "react";
import remarkGfm from "remark-gfm";
// Lazy load ReactMarkdown for better performance
const ReactMarkdown = lazy(() => import("react-markdown"));
// Lazy load ArtifactRenderer for better performance
const ArtifactRenderer = lazy(() =>
	import("../../artifacts/artifact-renderer").then((module) => ({
		default: module.ArtifactRenderer,
	}))
);

interface V2MessageProps {
	message: ChatMessage;
	isLast: boolean;
	className?: string;
}

export const V2Message = memo(function V2Message({
	message,
	isLast,
	className,
}: V2MessageProps) {
	const isUser = message.role === "user";
	const isAssistant = message.role === "assistant";
	
	// Get content from parts array
	const textContent = message.parts.find(part => part.type === 'text')?.text || '';
	const hasFileAttachments = message.parts.some(part => part.type === 'file');
	
	// Check for artifacts in content
	const hasArtifact = textContent.includes('<artifact') || 
					   textContent.includes('```');
	
	// Check if this is an error message
	const isError = message.isError || 
				   (textContent.includes('**Service Alert**') ||
				    textContent.includes('credit balance is too low') ||
				    textContent.includes('Error:') ||
				    textContent.includes('Plans & Billing'));

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(textContent);
			// TODO: Add toast notification
		} catch (error) {
			console.error("Failed to copy message:", error);
		}
	};

	const handleFeedback = (helpful: boolean) => {
		// TODO: Implement feedback API call
		console.log("Feedback:", { messageId: message.id, helpful });
	};

	return (
		<motion.div
			layout
			className={cn(
				"group flex gap-4 max-w-none",
				isUser ? "flex-row-reverse" : "flex-row",
				className
			)}
		>
			{/* Avatar */}
			<div className="shrink-0">
				<Avatar className="w-8 h-8">
					<AvatarFallback
						className={cn(
							"text-xs font-medium",
							isUser
								? "bg-primary text-primary-foreground"
								: isError
									? "bg-red-200 text-red-700 border-2 border-red-300"
									: "bg-muted text-muted-foreground"
						)}
					>
						{isUser ? (
							<User className="w-4 h-4" />
						) : isError ? (
							<AlertTriangle className="w-4 h-4" />
						) : (
							<Bot className="w-4 h-4" />
						)}
					</AvatarFallback>
				</Avatar>
			</div>

			{/* Message Content */}
			<div
				className={cn("flex-1 min-w-0", isUser ? "text-right" : "text-left")}
			>
				{/* Text Message Bubble */}
				{textContent && (
					<div
						className={cn(
							"inline-block max-w-[80%] p-4 rounded-lg mb-3",
							isUser ? "v2-button-primary text-left" : 
							isError ? "border-red-300 bg-red-100 border-2 text-red-900 shadow-sm" : "v2-card"
						)}
					>
						{isUser ? (
							<p className="whitespace-pre-wrap break-words">
								{textContent}
							</p>
						) : (
							<div className="prose prose-sm prose-invert max-w-none">
								<Suspense
									fallback={<div className="animate-pulse">Loading...</div>}
								>
									<ReactMarkdown
										remarkPlugins={[remarkGfm]}
										components={{
											// Custom components for better styling
											code: ({ node, className, children, ...props }: any) => {
												const isInline = !className?.includes("language-");
												return isInline ? (
													<code
														className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-sm"
														{...props}
													>
														{children}
													</code>
												) : (
													<pre className="bg-muted p-4 rounded-lg overflow-x-auto">
														<code className="font-mono text-sm" {...props}>
															{children}
														</code>
													</pre>
												);
											},
											p: ({ children }) => (
												<p className="mb-3 last:mb-0 leading-relaxed">
													{children}
												</p>
											),
											ul: ({ children }) => (
												<ul className="mb-3 last:mb-0 space-y-1">{children}</ul>
											),
											ol: ({ children }) => (
												<ol className="mb-3 last:mb-0 space-y-1">{children}</ol>
											),
											li: ({ children }) => (
												<li className="leading-relaxed">{children}</li>
											),
										}}
									>
										{textContent}
									</ReactMarkdown>
								</Suspense>
							</div>
						)}
					</div>
				)}

				{/* Artifact Rendering */}
				{hasArtifact && !isUser && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-3"
					>
						<div className="v2-card p-1 max-w-full">
							{/* Artifact Header */}
							<div className="flex items-center gap-2 p-3 border-b border-v2-border">
								<Sparkles className="w-4 h-4 text-primary" />
								<span className="text-sm font-medium text-muted-foreground">
									Generated Artifact
								</span>
							</div>

							{/* Artifact Content */}
							<div className="p-4">
								<Suspense
									fallback={
										<div className="flex items-center justify-center h-32">
											<div className="animate-pulse text-sm text-muted-foreground">
												Loading artifact...
											</div>
										</div>
									}
								>
									<ArtifactRenderer messages={[message]} />
								</Suspense>
							</div>
						</div>
					</motion.div>
				)}

				{/* Message Actions */}
				{!isUser && (
					<div
						className={cn(
							"flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
							isUser ? "justify-end" : "justify-start"
						)}
					>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleCopy}
							className="h-7 px-2 text-xs"
						>
							<Copy className="w-3 h-3 mr-1" />
							Copy
						</Button>

						{isLast && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleFeedback(true)}
									className="h-7 px-2 text-xs"
								>
									<ThumbsUp className="w-3 h-3" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleFeedback(false)}
									className="h-7 px-2 text-xs"
								>
									<ThumbsDown className="w-3 h-3" />
								</Button>
							</>
						)}
					</div>
				)}
			</div>
		</motion.div>
	);
});
