"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useDashboardData } from "@/hooks/use-company-data";
import { BarChart3, Brain, Eye, TrendingUp, Users } from "lucide-react";
import { DonutChart } from "../charts/donut-chart";
import { EnhancedBarChart } from "../charts/enhanced-bar-chart";
import { EnhancedLineChart } from "../charts/enhanced-line-chart";
import { EnhancedMetricCard } from "./enhanced-metric-card";

export function EnhancedDashboardOverview() {
	const {
		company,
		analysis,
		competitors,
		platformPerformance,
		recentActivity,
		keyInsights,
		usageStats,
		isLoading,
	} = useDashboardData();

	// Sample data for charts - in real app this would come from the API
	const performanceTrendData = [
		{ name: "Jan", score: 65, visibility: 45 },
		{ name: "Feb", score: 68, visibility: 52 },
		{ name: "Mar", score: 71, visibility: 58 },
		{ name: "Apr", score: 73, visibility: 62 },
		{ name: "May", score: 76, visibility: 68 },
		{ name: "Jun", score: 78, visibility: 72 },
	];

	const platformData = [
		{ name: "ChatGPT", score: 78, color: "#10B981" },
		{ name: "Claude", score: 71, color: "#3B82F6" },
		{ name: "Gemini", score: 69, color: "#F59E0B" },
		{ name: "Perplexity", score: 74, color: "#8B5CF6" },
	];

	const competitorComparisonData = [
		{ name: "Your Brand", score: 78, market_share: 25 },
		{ name: "Competitor A", score: 82, market_share: 30 },
		{ name: "Competitor B", score: 75, market_share: 20 },
		{ name: "Competitor C", score: 70, market_share: 15 },
		{ name: "Others", score: 65, market_share: 10 },
	];

	const donutData = platformData.map((platform) => ({
		name: platform.name,
		value: platform.score,
		color: platform.color,
	}));

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-8">
			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<EnhancedMetricCard
					title="GEO Score"
					value={analysis?.overallScore || 73}
					change={{
						value: analysis?.weeklyChange || 5,
						period: "from last week",
						type: "increase",
					}}
					icon={BarChart3}
					iconBgColor="bg-gradient-to-br from-blue-500 to-blue-600"
					badge={{ text: "Excellent", variant: "default" }}
					actions={[
						{
							label: "Explain",
							onClick: () => console.log("Explain GEO Score"),
						},
						{
							label: "Improve",
							onClick: () => console.log("Improve GEO Score"),
						},
					]}
				/>

				<EnhancedMetricCard
					title="Market Rank"
					value={`#${analysis?.marketRank || 2}`}
					change={{
						value: 1,
						period: "position up",
						type: "increase",
					}}
					icon={TrendingUp}
					iconBgColor="bg-gradient-to-br from-green-500 to-green-600"
					subtitle="In your industry"
					actions={[
						{
							label: "View Details",
							onClick: () => console.log("View market details"),
						},
					]}
				/>

				<EnhancedMetricCard
					title="Visibility Score"
					value="68%"
					change={{
						value: 8,
						period: "this month",
						type: "increase",
					}}
					icon={Eye}
					iconBgColor="bg-gradient-to-br from-purple-500 to-purple-600"
					progress={{ value: 68, max: 100 }}
				/>

				<EnhancedMetricCard
					title="Competitors Tracked"
					value={analysis?.competitorsTracked || 5}
					icon={Users}
					iconBgColor="bg-gradient-to-br from-orange-500 to-orange-600"
					subtitle="Active monitoring"
					badge={{ text: "Active", variant: "outline" }}
				/>
			</div>

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Performance Trend */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="w-5 h-5" />
							Performance Trend
						</CardTitle>
					</CardHeader>
					<CardContent>
						<EnhancedLineChart
							data={performanceTrendData}
							lines={[
								{ dataKey: "score", stroke: "#3B82F6", name: "GEO Score" },
								{
									dataKey: "visibility",
									stroke: "#10B981",
									name: "Visibility",
								},
							]}
							height={300}
						/>
					</CardContent>
				</Card>

				{/* Platform Distribution */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Brain className="w-5 h-5" />
							Platform Performance
						</CardTitle>
					</CardHeader>
					<CardContent>
						<DonutChart
							data={donutData}
							height={300}
							centerText={{
								value: "73",
								label: "Avg Score",
							}}
						/>
					</CardContent>
				</Card>

				{/* Competitor Comparison */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="w-5 h-5" />
							Competitive Landscape
						</CardTitle>
					</CardHeader>
					<CardContent>
						<EnhancedBarChart
							data={competitorComparisonData}
							bars={[
								{ dataKey: "score", fill: "#3B82F6", name: "GEO Score" },
								{
									dataKey: "market_share",
									fill: "#10B981",
									name: "Market Share %",
								},
							]}
							height={300}
							layout="vertical"
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
