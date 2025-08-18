"use client";

import dynamic from "next/dynamic";

// Force dynamic rendering to avoid build-time issues
export const runtime = "edge";

// Dynamically import the chat content to avoid SSR issues
const ChatContent = dynamic(
	() =>
		import("@/components/chat/chat-content").then((mod) => ({
			default: mod.ChatContent,
		})),
	{
		ssr: false,
		loading: () => (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		),
	}
);

export default function ChatPage() {
	return <ChatContent />;
}
