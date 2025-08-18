"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
	BarChart3,
	Bell,
	Eye,
	Grid3X3,
	Lightbulb,
	PieChart,
	Table,
	TrendingUp,
} from "lucide-react";

const improvements = [
	{
		title: "Enhanced Metric Cards",
		description: "Interactive cards with trends, progress bars, and action buttons",
		icon: BarChart3,
		features: ["Trend indicators", "Progress tracking", "Quick actions", "Gradient backgrounds"],
		status: "Implemented",
	},
	{
		title: "Advanced Charts",
		description: "Professional data visualizations with Recharts integration",
		icon: PieChart,
		features: ["Line charts", "Bar charts", "Donut charts", "Interactive tooltips"],
		status: "Implemented",
	},
	{
		title: "Platform Performance",
		description: "Detailed AI platform analysis with insights and recommendations",
		icon: Eye,
		features: ["Score tracking", "Trend analysis", "Platform insights", "Action buttons"],
		status: "Implemented",
	},
	{
		title: "Smart Insights Panel",
		description: "AI-powered insights with priority levels and actionable recommendations",
		icon: Lightbulb,
		features: ["Impact assessment", "Effort estimation", "Priority badges", "Action tracking"],
		status: "Implemented",
	},
	{
		title: "Activity Feed",
		description: "Real-time activity tracking with status indicators and metadata",
		icon: Bell,
		features: ["Real-time updates", "Status tracking", "Priority levels", "Action items"],
		status: "Implemented",
	},
	{
		title: "Enhanced Data Tables",
		description: "Sortable, searchable, and exportable data tables with pagination",
		icon: Table,
		features: ["Search & filter", "CSV export", "Pagination", "Responsive design"],
		status: "Implemented",
	},
	{
		title: "Responsive Grid System",
		description: "Flexible grid layout for optimal data presentation across devices",
		icon: Grid3X3,
		features: ["Responsive design", "Flexible columns", "Auto-sizing", "Mobile optimized"],
		status: "Implemented",
	},
	{
		title: "Loading States",
		description: "Professional skeleton loaders for better user experience",
		icon: TrendingUp,
		features: ["Skeleton components", "Loading indicators", "Smooth transitions", "Performance"],
		status: "Implemented",
	},
];

export function DashboardImprovementsSummary() {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-2xl font-bold flex items-center gap-2">
					<TrendingUp className="w-6 h-6" />
					Dashboard Enhancements Summary
				</CardTitle>
				<p className="text-muted-foreground">
					Comprehensive improvements to make the dashboard more presentable and effective at displaying data
				</p>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{improvements.map((improvement, index) => {
						const IconComponent = improvement.icon;
						
						return (
							<div
								key={index}
								className="p-4 rounded-xl border bg-gradient-to-br from-background to-muted/20 hover:shadow-md transition-all duration-200"
							>
								<div className="flex items-start gap-3">
									<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
										<IconComponent className="w-5 h-5 text-primary" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2">
											<h3 className="font-semibold text-foreground">
												{improvement.title}
											</h3>
											<Badge variant="default" className="text-xs">
												{improvement.status}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground mb-3">
											{improvement.description}
										</p>
										<div className="space-y-1">
											{improvement.features.map((feature, idx) => (
												<div key={idx} className="flex items-center text-xs text-muted-foreground">
													<span className="w-1 h-1 bg-primary rounded-full mr-2" />
													{feature}
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Summary Stats */}
				<div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">8</div>
							<div className="text-sm text-muted-foreground">Components Enhanced</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">100%</div>
							<div className="text-sm text-muted-foreground">Implementation Complete</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">3</div>
							<div className="text-sm text-muted-foreground">Chart Types Added</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">∞</div>
							<div className="text-sm text-muted-foreground">Data Presentation Improved</div>
						</div>
					</div>
				</div>

				{/* Key Benefits */}
				<div className="mt-6">
					<h4 className="font-semibold text-foreground mb-3">Key Benefits</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="flex items-center gap-2 text-sm">
							<span className="w-2 h-2 bg-green-500 rounded-full" />
							<span>Professional, modern UI design</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<span className="w-2 h-2 bg-green-500 rounded-full" />
							<span>Interactive data visualizations</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<span className="w-2 h-2 bg-green-500 rounded-full" />
							<span>Actionable insights and recommendations</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<span className="w-2 h-2 bg-green-500 rounded-full" />
							<span>Real-time activity tracking</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<span className="w-2 h-2 bg-green-500 rounded-full" />
							<span>Responsive design for all devices</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<span className="w-2 h-2 bg-green-500 rounded-full" />
							<span>Enhanced user experience</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
