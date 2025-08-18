"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useArtifactsStore } from "@/stores/artifacts-store";
import { useChat } from "@ai-sdk/react";
import { cn, generateUUID } from "@workspace/utils";
import { useEffect, useState } from "react";
import { ArtifactCanvas } from "./artifact-canvas";
import { ChatInput } from "./chat-input-enhanced";
import { ChatInterface } from "./chat-interface";

type ChatMode = "chat" | "artifact" | "split";

export function ChatContent() {
	const [input, setInput] = useState<string>("");
	const [mode, setMode] = useState<ChatMode>("chat");
	const isMobile = useIsMobile();
	const { showPinnedPanel } = useArtifactsStore();

	// Handle URL prompt parameter
	useEffect(() => {
		if (typeof window !== "undefined") {
			const urlParams = new URLSearchParams(window.location.search);
			const promptParam = urlParams.get("prompt");
			if (promptParam) {
				setChatInput(promptParam);
				// Clear the URL parameter after setting the input
				const newUrl = window.location.pathname;
				window.history.replaceState({}, "", newUrl);
			}
		}
	}, [setChatInput]);

	const {
		messages,
		setMessages,
		append,
		status,
		stop,
		regenerate,
		error,
		reload,
		input: chatInput,
		setInput: setChatInput,
		handleSubmit,
	} = useChat({
		id: generateUUID(),
		api: "/api/chat",
		onFinish: (message) => {
			// Auto-switch to artifact mode if the response contains artifacts
			const hasArtifacts =
				message.toolInvocations && message.toolInvocations.length > 0;
			if (hasArtifacts && !isMobile) {
				setMode("artifact");
			}
		},
	});

	// Determine if we have artifacts in the current conversation
	const hasArtifacts = messages.some(
		(message) => message.toolInvocations && message.toolInvocations.length > 0
	);

	// Get the latest artifact message
	const latestArtifactMessage = messages
		.slice()
		.reverse()
		.find(
			(message) => message.toolInvocations && message.toolInvocations.length > 0
		);

	// Auto-adjust mode based on content and screen size
	useEffect(() => {
		if (isMobile) {
			// On mobile, always use single-pane mode
			setMode(hasArtifacts ? "artifact" : "chat");
		} else {
			// On desktop, use split mode when we have artifacts
			if (hasArtifacts && mode === "chat") {
				setMode("split");
			}
		}
	}, [hasArtifacts, isMobile, mode]);

	const handleModeChange = (newMode: ChatMode) => {
		setMode(newMode);
	};

	return (
		<div className="flex flex-col h-full bg-background">
			{/* Mode Toggle Bar (Desktop Only) */}
			{!isMobile && hasArtifacts && (
				<div className="flex items-center justify-center p-2 border-b bg-muted/30">
					<div className="flex items-center space-x-1 bg-background rounded-lg p-1 border">
						<button
							onClick={() => handleModeChange("chat")}
							className={cn(
								"px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
								mode === "chat"
									? "bg-primary text-primary-foreground"
									: "hover:bg-muted"
							)}
						>
							Chat
						</button>
						<button
							onClick={() => handleModeChange("split")}
							className={cn(
								"px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
								mode === "split"
									? "bg-primary text-primary-foreground"
									: "hover:bg-muted"
							)}
						>
							Split View
						</button>
						<button
							onClick={() => handleModeChange("artifact")}
							className={cn(
								"px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
								mode === "artifact"
									? "bg-primary text-primary-foreground"
									: "hover:bg-muted"
							)}
						>
							Canvas
						</button>
					</div>
				</div>
			)}

			{/* Main Content Area */}
			<div className="flex flex-1 overflow-hidden">
				{/* Chat Interface */}
				<div
					className={cn(
						"flex flex-col",
						mode === "chat"
							? "w-full"
							: mode === "split"
								? "w-1/2 border-r"
								: "hidden"
					)}
				>
					<ChatInterface
						messages={messages}
						status={status}
						error={error}
						onRetry={reload}
						mode={mode}
					/>
				</div>

				{/* Artifact Canvas */}
				{(mode === "artifact" || mode === "split") && latestArtifactMessage && (
					<div
						className={cn(
							"flex flex-col bg-muted/20",
							mode === "artifact" ? "w-full" : "w-1/2"
						)}
					>
						<ArtifactCanvas
							message={latestArtifactMessage}
							messages={messages}
							mode={mode}
						/>
					</div>
				)}
			</div>

			{/* Chat Input - Always Visible */}
			<div className="border-t bg-background">
				<ChatInput
					input={chatInput}
					setInput={setChatInput}
					handleSubmit={handleSubmit}
					status={status}
					stop={stop}
					messages={messages}
					mode={mode}
				/>
			</div>
		</div>
	);
}
