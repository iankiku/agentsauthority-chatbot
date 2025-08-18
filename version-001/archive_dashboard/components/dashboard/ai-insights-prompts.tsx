"use client";

import { useClientNavigation } from "@/hooks/use-client-navigation";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Brain, Lightbulb, TrendingUp, Zap } from "lucide-react";

interface InsightPrompt {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	category: "performance" | "growth" | "optimization" | "strategy";
}

const insightPrompts: InsightPrompt[] = [
	{
		id: "performance-analysis",
		title: "Performance Deep Dive",
		description:
			"Analyze your site's performance metrics and get actionable recommendations",
		icon: <TrendingUp className="h-5 w-5" />,
		category: "performance",
	},
	{
		id: "growth-opportunities",
		title: "Growth Opportunities",
		description:
			"Discover untapped growth channels and optimization strategies",
		icon: <Lightbulb className="h-5 w-5" />,
		category: "growth",
	},
	{
		id: "competitor-insights",
		title: "Competitor Analysis",
		description: "Get AI-powered insights on your competitive landscape",
		icon: <Brain className="h-5 w-5" />,
		category: "strategy",
	},
	{
		id: "quick-wins",
		title: "Quick Optimization Wins",
		description: "Find immediate improvements you can implement today",
		icon: <Zap className="h-5 w-5" />,
		category: "optimization",
	},
];

export function AIInsightsPrompts() {
	const { navigateTo } = useClientNavigation();

	const handlePromptClick = (prompt: InsightPrompt) => {
		// Navigate to chat with the specific prompt
		const promptMessage = getPromptMessage(prompt);
		navigateTo(`/chat?prompt=${encodeURIComponent(promptMessage)}`);
	};

	const getPromptMessage = (prompt: InsightPrompt) => {
		switch (prompt.id) {
			case "performance-analysis":
				return "Analyze my website's performance metrics in detail. Show me key areas for improvement and provide actionable recommendations.";
			case "growth-opportunities":
				return "Identify untapped growth opportunities for my business. What channels should I explore and what optimization strategies would be most effective?";
			case "competitor-insights":
				return "Provide a comprehensive competitive analysis. Show me how I compare to my competitors and what strategies they're using that I should consider.";
			case "quick-wins":
				return "What are the top 5 quick wins I can implement today to improve my performance? Focus on low-effort, high-impact changes.";
			default:
				return `Help me with ${prompt.title.toLowerCase()}: ${prompt.description}`;
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Brain className="h-5 w-5 text-primary" />
					AI-Powered Insights
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{insightPrompts.map((prompt) => (
					<div
						key={prompt.id}
						className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
					>
						<div className="flex items-center gap-3">
							<div className="flex-shrink-0 text-primary">{prompt.icon}</div>
							<div>
								<h4 className="font-medium text-sm">{prompt.title}</h4>
								<p className="text-xs text-muted-foreground">
									{prompt.description}
								</p>
							</div>
						</div>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => handlePromptClick(prompt)}
							className="flex-shrink-0"
						>
							Ask AI
						</Button>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
