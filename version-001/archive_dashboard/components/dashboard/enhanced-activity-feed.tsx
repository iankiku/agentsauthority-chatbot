"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { cn } from "@workspace/utils";
import {
	AlertTriangle,
	BarChart3,
	Bell,
	CheckCircle,
	Clock,
	Eye,
	MessageSquare,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";

interface ActivityItem {
	id: string;
	type: "analysis" | "alert" | "optimization" | "report" | "competitor" | "insight";
	title: string;
	description: string;
	timestamp: string;
	status: "completed" | "in_progress" | "failed" | "pending";
	priority: "high" | "medium" | "low";
	metadata?: {
		platform?: string;
		score?: number;
		change?: number;
		competitor?: string;
	};
}

const activityData: ActivityItem[] = [
	{
		id: "1",
		type: "analysis",
		title: "GEO Analysis Completed",
		description: "Your brand's AI visibility analysis across all platforms has been updated.",
		timestamp: "2 minutes ago",
		status: "completed",
		priority: "high",
		metadata: { score: 78, change: 5 },
	},
	{
		id: "2",
		type: "alert",
		title: "Competitor Alert",
		description: "TechCorp has gained 15% visibility in your key market segment.",
		timestamp: "1 hour ago",
		status: "pending",
		priority: "high",
		metadata: { competitor: "TechCorp", change: 15 },
	},
	{
		id: "3",
		type: "optimization",
		title: "Content Optimization",
		description: "ChatGPT content structure has been optimized for better visibility.",
		timestamp: "3 hours ago",
		status: "completed",
		priority: "medium",
		metadata: { platform: "ChatGPT", score: 82 },
	},
	{
		id: "4",
		type: "report",
		title: "Weekly Report Generated",
		description: "Your weekly AI visibility report is ready for review.",
		timestamp: "1 day ago",
		status: "completed",
		priority: "low",
	},
	{
		id: "5",
		type: "insight",
		title: "New Opportunity Identified",
		description: "FAQ content expansion could increase visibility by 60%.",
		timestamp: "2 days ago",
		status: "pending",
		priority: "medium",
	},
];

export function EnhancedActivityFeed() {
	const getActivityIcon = (type: string) => {
		switch (type) {
			case "analysis":
				return BarChart3;
			case "alert":
				return AlertTriangle;
			case "optimization":
				return Zap;
			case "report":
				return Eye;
			case "competitor":
				return Users;
			case "insight":
				return TrendingUp;
			default:
				return Bell;
		}
	};

	const getActivityColor = (type: string, status: string) => {
		if (status === "failed") return "text-red-600 bg-red-50 border-red-200";
		if (status === "in_progress") return "text-blue-600 bg-blue-50 border-blue-200";

		switch (type) {
			case "analysis":
				return "text-green-600 bg-green-50 border-green-200";
			case "alert":
				return "text-red-600 bg-red-50 border-red-200";
			case "optimization":
				return "text-purple-600 bg-purple-50 border-purple-200";
			case "report":
				return "text-blue-600 bg-blue-50 border-blue-200";
			case "competitor":
				return "text-orange-600 bg-orange-50 border-orange-200";
			case "insight":
				return "text-indigo-600 bg-indigo-50 border-indigo-200";
			default:
				return "text-gray-600 bg-gray-50 border-gray-200";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return CheckCircle;
			case "in_progress":
				return Clock;
			case "failed":
				return AlertTriangle;
			case "pending":
				return Clock;
			default:
				return Clock;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "text-green-600";
			case "in_progress":
				return "text-blue-600";
			case "failed":
				return "text-red-600";
			case "pending":
				return "text-yellow-600";
			default:
				return "text-gray-600";
		}
	};

	const getPriorityBadge = (priority: string) => {
		switch (priority) {
			case "high":
				return { text: "High", variant: "destructive" as const };
			case "medium":
				return { text: "Medium", variant: "secondary" as const };
			case "low":
				return { text: "Low", variant: "outline" as const };
			default:
				return { text: "Normal", variant: "outline" as const };
		}
	};

	return (
		<Card>
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<CardTitle className="text-xl font-semibold flex items-center gap-2">
						<Bell className="w-5 h-5" />
						Recent Activity
					</CardTitle>
					<Button variant="outline" size="sm">
						View All
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{activityData.map((activity) => {
						const IconComponent = getActivityIcon(activity.type);
						const StatusIcon = getStatusIcon(activity.status);
						const priorityBadge = getPriorityBadge(activity.priority);

						return (
							<div
								key={activity.id}
								className={cn(
									"p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
									getActivityColor(activity.type, activity.status)
								)}
							>
								<div className="flex items-start gap-3">
									<div className="flex-shrink-0">
										<IconComponent className="w-5 h-5 mt-0.5" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<h4 className="font-semibold text-foreground">
												{activity.title}
											</h4>
											<Badge variant={priorityBadge.variant} className="text-xs">
												{priorityBadge.text}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground mb-2">
											{activity.description}
										</p>
										
										{/* Metadata */}
										{activity.metadata && (
											<div className="flex items-center gap-4 mb-2 text-xs">
												{activity.metadata.platform && (
													<span className="bg-white/50 px-2 py-1 rounded">
														{activity.metadata.platform}
													</span>
												)}
												{activity.metadata.score && (
													<span className="bg-white/50 px-2 py-1 rounded">
														Score: {activity.metadata.score}%
													</span>
												)}
												{activity.metadata.change && (
													<span className="bg-white/50 px-2 py-1 rounded">
														{activity.metadata.change > 0 ? "+" : ""}{activity.metadata.change}%
													</span>
												)}
												{activity.metadata.competitor && (
													<span className="bg-white/50 px-2 py-1 rounded">
														{activity.metadata.competitor}
													</span>
												)}
											</div>
										)}

										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2 text-xs text-muted-foreground">
												<StatusIcon className={cn("w-3 h-3", getStatusColor(activity.status))} />
												<span className="capitalize">{activity.status.replace("_", " ")}</span>
												<span>•</span>
												<span>{activity.timestamp}</span>
											</div>
											
											{activity.status === "pending" && (
												<Button
													variant="outline"
													size="sm"
													className="text-xs"
													onClick={() => console.log(`Taking action on ${activity.id}`)}
												>
													Take Action
												</Button>
											)}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Load More */}
				<div className="mt-6 text-center">
					<Button variant="outline" className="w-full">
						Load More Activities
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
