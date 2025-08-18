"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { cn } from "@workspace/utils";
import {
	AlertTriangle,
	ArrowRight,
	Lightbulb,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";

interface Insight {
	id: string;
	type: "opportunity" | "warning" | "success" | "recommendation";
	title: string;
	description: string;
	impact: "high" | "medium" | "low";
	effort: "high" | "medium" | "low";
	category: string;
	actionable: boolean;
}

const insightsData: Insight[] = [
	{
		id: "1",
		type: "opportunity",
		title: "Improve ChatGPT Visibility",
		description: "Your brand appears in only 23% of relevant ChatGPT responses. Optimizing content structure could increase this to 45%.",
		impact: "high",
		effort: "medium",
		category: "Content Optimization",
		actionable: true,
	},
	{
		id: "2",
		type: "warning",
		title: "Competitor Gaining Ground",
		description: "TechCorp has increased their AI visibility by 15% this month, now ranking above you in 3 key categories.",
		impact: "high",
		effort: "high",
		category: "Competitive Intelligence",
		actionable: true,
	},
	{
		id: "3",
		type: "success",
		title: "Perplexity Performance Strong",
		description: "Your Perplexity citations have increased 40% this quarter, maintaining top 3 position in your industry.",
		impact: "medium",
		effort: "low",
		category: "Platform Performance",
		actionable: false,
	},
	{
		id: "4",
		type: "recommendation",
		title: "Expand FAQ Content",
		description: "Adding 15 targeted FAQ pages could capture 60% more question-based queries across all AI platforms.",
		impact: "medium",
		effort: "medium",
		category: "Content Strategy",
		actionable: true,
	},
];

export function EnhancedInsightsPanel() {
	const getInsightIcon = (type: string) => {
		switch (type) {
			case "opportunity":
				return TrendingUp;
			case "warning":
				return AlertTriangle;
			case "success":
				return Target;
			case "recommendation":
				return Lightbulb;
			default:
				return Lightbulb;
		}
	};

	const getInsightColor = (type: string) => {
		switch (type) {
			case "opportunity":
				return "text-blue-600 bg-blue-50 border-blue-200";
			case "warning":
				return "text-red-600 bg-red-50 border-red-200";
			case "success":
				return "text-green-600 bg-green-50 border-green-200";
			case "recommendation":
				return "text-purple-600 bg-purple-50 border-purple-200";
			default:
				return "text-gray-600 bg-gray-50 border-gray-200";
		}
	};

	const getImpactBadge = (impact: string) => {
		switch (impact) {
			case "high":
				return { text: "High Impact", variant: "default" as const };
			case "medium":
				return { text: "Medium Impact", variant: "secondary" as const };
			case "low":
				return { text: "Low Impact", variant: "outline" as const };
			default:
				return { text: "Unknown", variant: "outline" as const };
		}
	};

	const getEffortBadge = (effort: string) => {
		switch (effort) {
			case "high":
				return { text: "High Effort", variant: "destructive" as const };
			case "medium":
				return { text: "Medium Effort", variant: "secondary" as const };
			case "low":
				return { text: "Low Effort", variant: "outline" as const };
			default:
				return { text: "Unknown", variant: "outline" as const };
		}
	};

	return (
		<div className="space-y-6">
			{/* Key Insights */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<CardTitle className="text-xl font-semibold flex items-center gap-2">
							<Lightbulb className="w-5 h-5" />
							Key Insights
						</CardTitle>
						<Button variant="outline" size="sm">
							View All
							<ArrowRight className="w-4 h-4 ml-1" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{insightsData.map((insight) => {
						const IconComponent = getInsightIcon(insight.type);
						const impactBadge = getImpactBadge(insight.impact);
						const effortBadge = getEffortBadge(insight.effort);

						return (
							<div
								key={insight.id}
								className={cn(
									"p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
									getInsightColor(insight.type)
								)}
							>
								<div className="flex items-start gap-3">
									<div className="flex-shrink-0">
										<IconComponent className="w-5 h-5 mt-0.5" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2">
											<h4 className="font-semibold text-foreground">
												{insight.title}
											</h4>
											<Badge variant={impactBadge.variant} className="text-xs">
												{impactBadge.text}
											</Badge>
											{insight.effort && (
												<Badge variant={effortBadge.variant} className="text-xs">
													{effortBadge.text}
												</Badge>
											)}
										</div>
										<p className="text-sm text-muted-foreground mb-3">
											{insight.description}
										</p>
										<div className="flex items-center justify-between">
											<span className="text-xs text-muted-foreground bg-white/50 px-2 py-1 rounded">
												{insight.category}
											</span>
											{insight.actionable && (
												<Button
													variant="outline"
													size="sm"
													className="text-xs"
													onClick={() => console.log(`Taking action on ${insight.id}`)}
												>
													<Zap className="w-3 h-3 mr-1" />
													Take Action
												</Button>
											)}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<Card>
				<CardHeader className="pb-4">
					<CardTitle className="text-xl font-semibold flex items-center gap-2">
						<Zap className="w-5 h-5" />
						Quick Actions
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<Button className="w-full justify-start" size="lg">
						<TrendingUp className="w-4 h-4 mr-2" />
						Run New Analysis
					</Button>
					<Button variant="outline" className="w-full justify-start" size="lg">
						<Target className="w-4 h-4 mr-2" />
						Optimize Content
					</Button>
					<Button variant="outline" className="w-full justify-start" size="lg">
						<AlertTriangle className="w-4 h-4 mr-2" />
						Monitor Competitors
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
