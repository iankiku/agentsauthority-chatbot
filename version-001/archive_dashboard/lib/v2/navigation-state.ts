import type { UIMessage } from "@ai-sdk/react";
import { create } from "zustand";

interface NavigationState {
	activeSection: string;
	conversationHistory: Record<string, UIMessage[]>;
	setActiveSection: (section: string) => void;
	preserveConversation: (section: string, messages: UIMessage[]) => void;
	getConversation: (section: string) => UIMessage[];
	clearConversation: (section: string) => void;
	clearAllConversations: () => void;
}

export const useNavigationState = create<NavigationState>((set, get) => ({
	activeSection: "chat",
	conversationHistory: {},

	setActiveSection: (section) => {
		console.log(`Navigation: Switching to section ${section}`);
		set({ activeSection: section });
	},

	preserveConversation: (section, messages) => {
		console.log(
			`Navigation: Preserving ${messages.length} messages for section ${section}`
		);
		set({
			conversationHistory: {
				...get().conversationHistory,
				[section]: messages,
			},
		});
	},

	getConversation: (section) => {
		const conversation = get().conversationHistory[section] || [];
		console.log(
			`Navigation: Retrieved ${conversation.length} messages for section ${section}`
		);
		return conversation;
	},

	clearConversation: (section) => {
		console.log(`Navigation: Clearing conversation for section ${section}`);
		const { [section]: removed, ...rest } = get().conversationHistory;
		set({ conversationHistory: rest });
	},

	clearAllConversations: () => {
		console.log("Navigation: Clearing all conversations");
		set({ conversationHistory: {} });
	},
}));

// Navigation items configuration
export const navigationItems = [
	{
		id: "chat",
		label: "Chat",
		path: "/v2/chat",
		description: "AI-powered brand analysis chat",
	},
	{
		id: "dashboard",
		label: "Overview",
		path: "/v2/dashboard",
		description: "Brand visibility dashboard",
	},
	{
		id: "competitors",
		label: "Competitors",
		path: "/v2/competitors",
		description: "Competitive analysis tools",
	},
	{
		id: "platforms",
		label: "Platforms",
		path: "/v2/platforms",
		description: "Platform monitoring",
	},
	{
		id: "insights",
		label: "Insights",
		path: "/v2/insights",
		description: "AI-generated insights",
	},
	{
		id: "reports",
		label: "Reports",
		path: "/v2/reports",
		description: "Detailed reports and analytics",
	},
];

// Helper functions for navigation
export const getNavigationItem = (id: string) => {
	return navigationItems.find((item) => item.id === id);
};

export const isValidNavigationSection = (section: string) => {
	return navigationItems.some((item) => item.id === section);
};

// Hook for navigation with conversation preservation
export const useNavigationWithPreservation = () => {
	const {
		activeSection,
		setActiveSection,
		preserveConversation,
		getConversation,
	} = useNavigationState();

	const navigateToSection = (
		section: string,
		currentMessages?: UIMessage[]
	) => {
		// Preserve current conversation if messages exist
		if (currentMessages && currentMessages.length > 0) {
			preserveConversation(activeSection, currentMessages);
		}

		// Navigate to new section
		setActiveSection(section);

		// Return preserved conversation for new section
		return getConversation(section);
	};

	return {
		activeSection,
		navigateToSection,
		getConversation,
		preserveConversation,
	};
};
