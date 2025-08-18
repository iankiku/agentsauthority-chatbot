"use client";

import { useClientNavigation } from "@/hooks/use-client-navigation";
import { useDashboardData } from "@/hooks/use-company-data";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/utils";
import {
	BarChart3,
	ChevronRight,
	Eye,
	MessageSquare,
	Sparkles,
	TrendingUp,
} from "lucide-react";

interface MetricCardProps {
	title: string;
	value: string | number;
	change?: {
		value: number;
		type: "increase" | "decrease";
	};
	icon: any;
	gradient: string;
	onClick?: () => void;
}

function MetricCard({
	title,
	value,
	change,
	icon: Icon,
	gradient,
	onClick,
}: MetricCardProps) {
	return (
		<Card
			className={cn(
				"hover:shadow-md transition-all duration-200 cursor-pointer border-0",
				gradient
			)}
			onClick={onClick}
		>
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="p-2 bg-white/20 rounded-lg">
							<Icon className="w-5 h-5 text-white" />
						</div>
						<div>
							<p className="text-white/80 text-sm font-medium">{title}</p>
							<p className="text-white text-2xl font-bold">{value}</p>
						</div>
					</div>
					{change && (
						<div className="text-right">
							<div
								className={cn(
									"flex items-center text-sm font-medium",
									change.type === "increase" ? "text-white/90" : "text-white/70"
								)}
							>
								<TrendingUp className="w-3 h-3 mr-1" />+{change.value}
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export function SimplifiedDashboardOverview() {
	const { analysis, isLoading } = useDashboardData();
	const { navigateTo } = useClientNavigation();

	const handleAskAI = (prompt: string) => {
		navigateTo(`/chat?prompt=${encodeURIComponent(prompt)}`);
	};

	// Use real data if available, otherwise fall back to demo data
	const displayData = analysis || {
		overallScore: 73,
		marketRank: 2,
		weeklyChange: 5,
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[...Array(3)].map((_, i) => (
						<Card key={i} className="h-32 animate-pulse bg-muted" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Essential Metrics - Only 3 key KPIs */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<MetricCard
					title="Overall GEO Score"
					value={displayData.overallScore}
					change={{ value: displayData.weeklyChange || 5, type: "increase" }}
					icon={BarChart3}
					gradient="bg-gradient-to-br from-blue-500 to-blue-600"
					onClick={() =>
						handleAskAI("Explain my current GEO score and how it's calculated")
					}
				/>

				<MetricCard
					title="Market Position"
					value={`#${displayData.marketRank}`}
					change={{ value: 1, type: "increase" }}
					icon={TrendingUp}
					gradient="bg-gradient-to-br from-green-500 to-green-600"
					onClick={() =>
						handleAskAI("Show me my competitive position and market analysis")
					}
				/>

				<MetricCard
					title="AI Visibility"
					value="68%"
					change={{ value: 8, type: "increase" }}
					icon={Eye}
					gradient="bg-gradient-to-br from-purple-500 to-purple-600"
					onClick={() =>
						handleAskAI(
							"Analyze my visibility across AI platforms and suggest improvements"
						)
					}
				/>
			</div>

			{/* Quick Summary Status */}
			<Card className="border-l-4 border-l-green-500">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="p-2 bg-green-100 rounded-lg">
								<Sparkles className="w-5 h-5 text-green-600" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">
									System Status: All Good
								</h3>
								<p className="text-sm text-muted-foreground">
									4 platforms monitored • Last updated 2 minutes ago
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<Badge
								variant="outline"
								className="bg-green-50 text-green-700 border-green-200"
							>
								+12% this week
							</Badge>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									handleAskAI(
										"Give me a detailed performance summary for this week"
									)
								}
							>
								<MessageSquare className="w-4 h-4 mr-2" />
								Ask AI
								<ChevronRight className="w-4 h-4 ml-1" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Platform Quick View */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg font-semibold">
							Platform Overview
						</CardTitle>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								handleAskAI("Compare my performance across all AI platforms")
							}
						>
							<MessageSquare className="w-4 h-4 mr-2" />
							Analyze Platforms
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{[
							{
								name: "ChatGPT",
								score: 78,
								color: "bg-green-100 text-green-700",
							},
							{ name: "Claude", score: 71, color: "bg-blue-100 text-blue-700" },
							{
								name: "Gemini",
								score: 69,
								color: "bg-yellow-100 text-yellow-700",
							},
							{
								name: "Perplexity",
								score: 74,
								color: "bg-purple-100 text-purple-700",
							},
						].map((platform) => (
							<div
								key={platform.name}
								className="text-center p-4 rounded-lg border hover:shadow-sm transition-all cursor-pointer"
								onClick={() =>
									handleAskAI(
										`Analyze my ${platform.name} performance and suggest improvements`
									)
								}
							>
								<div
									className={cn(
										"inline-flex items-center justify-center w-10 h-10 rounded-full mb-2",
										platform.color
									)}
								>
									<span className="text-sm font-semibold">
										{platform.score}
									</span>
								</div>
								<p className="text-sm font-medium text-foreground">
									{platform.name}
								</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
