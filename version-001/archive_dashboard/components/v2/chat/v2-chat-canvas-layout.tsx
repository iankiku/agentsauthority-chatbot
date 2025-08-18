"use client";

import { cn } from "@workspace/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useMastraChat } from "../../../lib/v2/mastra-chat-adapter";
import { DataStreamProvider } from "../../../lib/v2/data-stream-provider";
import { ChatErrorBoundary } from "./chat-error-boundary";
import { ErrorFallback } from "./error-fallback";
import { EnhancedMultimodalInput } from "./enhanced-multimodal-input";
import { V2EmptyState } from "./v2-empty-state";
import { V2MessageList } from "./v2-message-list";
import { ConversationSidebar } from "./conversation-sidebar";
import { useConversations } from "../../../hooks/use-conversations";
import { getChatApiEndpoint } from "../../../lib/feature-flags";

interface V2ChatCanvasLayoutProps {
	className?: string;
}

function V2ChatCanvasContent({ className }: V2ChatCanvasLayoutProps) {
	const [error, setError] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [userId] = useState('demo-user'); // TODO: Get from auth context

	// Get chat endpoint based on feature flag
	const chatEndpoint = getChatApiEndpoint();

	// Todo: clean up if not needed
	// Simple conversation change handler - no localStorage needed
	const handleConversationChange = useCallback((id: string) => {
		// Could trigger analytics, update user preferences in DB, etc.
		console.log('Switched to conversation:', id);
	}, []);

	// Conversation management - clean state-based approach
	const {
		conversations,
		activeConversationId,
		activeConversation,
		isLoading: conversationsLoading,
		createNewConversation,
		selectConversation,
		deleteConversation,
		renameConversation,
		updateConversation,
	} = useConversations({ 
		userId,
		onConversationChange: handleConversationChange
	});

	// Use active conversation ID or create new one - simple logic
	const conversationId = useMemo(() => {
		if (activeConversationId) {
			return activeConversationId;
		}
		
		// If no active conversation and we have conversations, select the most recent one
		if (conversations.length > 0) {
			selectConversation(conversations[0].id);
			return conversations[0].id;
		}
		
		// Create new conversation if none exist
		return createNewConversation();
	}, [activeConversationId, conversations, selectConversation, createNewConversation]);

	// Use our enhanced Mastra chat adapter
	const {
		messages,
		input,
		setInput,
		handleSubmit,
		status,
		stop,
		regenerate,
		error: chatError,
	} = useMastraChat({
		id: conversationId, // Use proper UUID
		api: chatEndpoint, // Use feature flag to determine endpoint
		onError: (error) => {
			console.error("V2 Chat error:", error);
			// Provide user-friendly error message instead of technical details
			setError("⚠️ Unable to connect to chat service. Please contact support if this continues.");
		},
		onFinish: (message) => {
			console.log("V2 Chat message finished:", message);
			setError(null);
		},
		onData: (data) => {
			// Handle streaming data for artifacts
			if (process.env.NODE_ENV === 'development') {
				console.log("📊 Streaming data:", data);
			}
		},
	});

	// Initialize component
	useEffect(() => {
		setIsInitialized(true);
	}, []);

	// Handle chat errors
	useEffect(() => {
		if (chatError) {
			setError(chatError.message);
		}
	}, [chatError]);

	// Handle conversation updates when new messages arrive
	useEffect(() => {
		if (activeConversation && messages.length > 0) {
			const lastMessage = messages[messages.length - 1];
			updateConversation(activeConversation.id, {
				lastMessage: lastMessage.content?.substring(0, 100) || '',
				messageCount: messages.length,
			});
		}
	}, [messages, activeConversation, updateConversation]);

	// Memoized values and handlers
	const handleRetry = useCallback(() => {
		setError(null);
		if (messages.length > 0) {
			regenerate();
		}
	}, [messages.length, regenerate]);

	const isLoading = status === "loading" || status === "submitted";
	const hasMessages = messages.length > 0;

	// Error boundary and fallback states
	if (error) {
		return (
			<div
				className={`min-h-screen flex items-center justify-center ${className}`}
			>
				<ErrorFallback error={error} onRetry={handleRetry} />
			</div>
		);
	}

	// Loading state during initialization
	if (!isInitialized) {
		return (
			<div
				className={`min-h-screen flex items-center justify-center ${className}`}
			>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex items-center gap-3"
				>
					<div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
					<span className="text-muted-foreground">Initializing V2 Chat...</span>
				</motion.div>
			</div>
		);
	}

	return (
		<div className={cn("min-h-screen flex bg-background", className)}>
			{/* Conversation Sidebar - Responsive and Collapsible */}
			<div className="hidden lg:block flex-shrink-0">
				<ConversationSidebar
					conversations={conversations}
					activeConversationId={activeConversationId || undefined}
					onConversationSelect={selectConversation}
					onNewConversation={createNewConversation}
					onDeleteConversation={deleteConversation}
					onRenameConversation={renameConversation}
					isLoading={conversationsLoading}
					className="h-screen"
				/>
			</div>

			{/* Main Chat Area - Responsive */}
			<div className="flex-1 flex flex-col relative min-w-0 max-h-screen">
				{/* Scrollable Messages Area */}
				<div className="flex-1 overflow-y-auto overflow-x-hidden">
					<AnimatePresence mode="wait">
						{hasMessages ? (
							<motion.div
								key="messages"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="h-full"
							>
								<V2MessageList messages={messages} isLoading={isLoading} />
							</motion.div>
						) : (
							<motion.div
								key="empty"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="h-full"
							>
								{/* Centered initial state */}
								<div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
									<V2EmptyState
										onQuerySelect={(query) => {
											console.log("🔥 Query selected:", query);
											setInput(query);
										}}
									/>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Fixed Input at Bottom - Responsive */}
				<div className="flex-shrink-0 sticky bottom-0 p-3 lg:p-4 border-t bg-background/95 backdrop-blur-sm">
					<div className="max-w-4xl mx-auto">
						<EnhancedMultimodalInput
							input={input}
							setInput={setInput}
							handleSubmit={handleSubmit}
							status={status}
							stop={stop}
							variant="fixed"
							placeholder="Ask about your brand visibility..."
						/>
					</div>
				</div>

				{/* Debug Info (only in development) - Hide on mobile */}
				{process.env.NODE_ENV === "development" && (
					<div className="fixed top-4 right-4 bg-card border rounded-lg p-2 text-xs opacity-75 z-50 hidden lg:block">
						<div>Status: {status}</div>
						<div>Messages: {messages.length}</div>
						<div>Conversations: {conversations.length}</div>
						<div>Active: {activeConversationId?.substring(0, 8)}...</div>
						<div>Error: {error ? "❌" : "✅"}</div>
					</div>
				)}

				{/* Mobile Conversation Toggle - Show on mobile only */}
				<div className="lg:hidden fixed top-4 left-4 z-50">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="bg-primary text-primary-foreground p-2 rounded-lg shadow-lg"
						onClick={() => {
							// TODO: Implement mobile drawer for conversations
							console.log('Mobile conversations menu - to be implemented');
						}}
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</motion.button>
				</div>
			</div>
		</div>
	);
}

// Main export with DataStreamProvider and ErrorBoundary wrapper
export function V2ChatCanvasLayout({ className }: V2ChatCanvasLayoutProps) {
	return (
		<ChatErrorBoundary>
			<DataStreamProvider>
				<V2ChatCanvasContent className={className} />
			</DataStreamProvider>
		</ChatErrorBoundary>
	);
}
