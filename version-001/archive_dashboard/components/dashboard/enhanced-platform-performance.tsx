"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { cn } from "@workspace/utils";
import {
	Brain,
	ChevronRight,
	MessageSquare,
	Search,
	Sparkles,
	TrendingDown,
	TrendingUp,
} from "lucide-react";

interface PlatformData {
	name: string;
	score: number;
	change: number;
	trend: "up" | "down" | "stable";
	icon: "Brain" | "MessageSquare" | "Search" | "Sparkles";
	color: string;
	bgColor: string;
	insights: string[];
	lastUpdated: string;
}

const platformsData: PlatformData[] = [
	{
		name: "ChatGPT",
		score: 78,
		change: 5,
		trend: "up",
		icon: "Brain",
		color: "#10B981",
		bgColor: "bg-green-50",
		insights: ["Strong in technical queries", "Improving brand mentions"],
		lastUpdated: "2 hours ago",
	},
	{
		name: "Claude",
		score: 71,
		change: 2,
		trend: "up",
		icon: "MessageSquare",
		color: "#3B82F6",
		bgColor: "bg-blue-50",
		insights: ["Good conversational context", "Needs content optimization"],
		lastUpdated: "1 hour ago",
	},
	{
		name: "Gemini",
		score: 69,
		change: -1,
		trend: "down",
		icon: "Search",
		color: "#F59E0B",
		bgColor: "bg-yellow-50",
		insights: ["Declining search relevance", "Requires SEO updates"],
		lastUpdated: "3 hours ago",
	},
	{
		name: "Perplexity",
		score: 74,
		change: 8,
		trend: "up",
		icon: "Sparkles",
		color: "#8B5CF6",
		bgColor: "bg-purple-50",
		insights: ["Excellent citation rate", "Growing market presence"],
		lastUpdated: "30 minutes ago",
	},
];

export function EnhancedPlatformPerformance() {
	const getIcon = (iconName: string) => {
		switch (iconName) {
			case "Brain":
				return Brain;
			case "MessageSquare":
				return MessageSquare;
			case "Search":
				return Search;
			case "Sparkles":
				return Sparkles;
			default:
				return Brain;
		}
	};

	const getScoreColor = (score: number) => {
		if (score >= 80) return "text-green-600";
		if (score >= 70) return "text-blue-600";
		if (score >= 60) return "text-yellow-600";
		return "text-red-600";
	};

	const getScoreBadge = (score: number) => {
		if (score >= 80) return { text: "Excellent", variant: "default" as const };
		if (score >= 70) return { text: "Good", variant: "secondary" as const };
		if (score >= 60) return { text: "Fair", variant: "outline" as const };
		return { text: "Needs Work", variant: "destructive" as const };
	};

	return (
		<Card>
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<CardTitle className="text-xl font-semibold">
						Platform Performance
					</CardTitle>
					<Button variant="outline" size="sm">
						View All Platforms
						<ChevronRight className="w-4 h-4 ml-1" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{platformsData.map((platform, index) => {
					const IconComponent = getIcon(platform.icon);
					const TrendIcon = platform.trend === "up" ? TrendingUp : TrendingDown;
					const badge = getScoreBadge(platform.score);

					return (
						<div
							key={platform.name}
							className={cn(
								"p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
								platform.bgColor
							)}
						>
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center space-x-3">
									<div
										className="w-10 h-10 rounded-lg flex items-center justify-center"
										style={{ backgroundColor: platform.color }}
									>
										<IconComponent className="w-5 h-5 text-white" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<span className="font-semibold text-foreground">
												{platform.name}
											</span>
											<Badge variant={badge.variant} className="text-xs">
												{badge.text}
											</Badge>
										</div>
										<p className="text-xs text-muted-foreground">
											Updated {platform.lastUpdated}
										</p>
									</div>
								</div>

								<div className="text-right">
									<div className="flex items-center gap-2 mb-1">
										<span
											className={cn(
												"text-2xl font-bold",
												getScoreColor(platform.score)
											)}
										>
											{platform.score}%
										</span>
										<div
											className={cn(
												"flex items-center text-sm",
												platform.trend === "up"
													? "text-green-600"
													: "text-red-600"
											)}
										>
											<TrendIcon className="w-3 h-3 mr-1" />
											{platform.change > 0 ? "+" : ""}
											{platform.change}
										</div>
									</div>
								</div>
							</div>

							{/* Progress Bar */}
							<div className="mb-3">
								<Progress value={platform.score} className="h-2" />
							</div>

							{/* Insights */}
							<div className="space-y-1 mb-3">
								{platform.insights.map((insight, idx) => (
									<p
										key={idx}
										className="text-xs text-muted-foreground flex items-center"
									>
										<span className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
										{insight}
									</p>
								))}
							</div>

							{/* Actions */}
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									className="text-xs"
									onClick={() => console.log(`Analyzing ${platform.name}`)}
								>
									Analyze
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="text-xs"
									onClick={() => console.log(`Optimizing ${platform.name}`)}
								>
									Optimize
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="text-xs"
									onClick={() =>
										console.log(`Viewing ${platform.name} details`)
									}
								>
									Details
								</Button>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
