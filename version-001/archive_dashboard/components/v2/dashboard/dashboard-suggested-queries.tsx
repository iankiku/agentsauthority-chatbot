"use client";

import { Button } from "@workspace/ui";
import { motion } from "framer-motion";
import {
	BarChart3,
	FileText,
	Lightbulb,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";

interface DashboardSuggestedQueriesProps {
	onQuerySelect: (query: string) => void;
}

const queryCategories = [
	{
		title: "Performance Analysis",
		icon: BarChart3,
		color: "text-blue-600",
		queries: [
			"Show me my current GEO score and breakdown",
			"What's my overall brand visibility score?",
			"How has my performance changed this month?",
		],
	},
	{
		title: "Trend Analysis",
		icon: TrendingUp,
		color: "text-green-600",
		queries: [
			"Show me performance trends over the last 30 days",
			"What are the biggest changes in my visibility?",
			"Compare this month to last month's performance",
		],
	},
	{
		title: "Competitive Intelligence",
		icon: Target,
		color: "text-purple-600",
		queries: [
			"How do I compare to my top competitors?",
			"Who are my main competitors in AI visibility?",
			"What's my market share in AI-generated content?",
		],
	},
	{
		title: "Insights & Recommendations",
		icon: Lightbulb,
		color: "text-orange-600",
		queries: [
			"What are the top 3 ways to improve my visibility?",
			"Which platforms should I focus on?",
			"What content gaps should I address?",
		],
	},
];

export function DashboardSuggestedQueries({
	onQuerySelect,
}: DashboardSuggestedQueriesProps) {
	return (
		<div className="max-w-5xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="mb-4"
			>
				<h3 className="text-base font-semibold text-black mb-1">
					Popular Queries
				</h3>
				<p className="text-sm text-gray-600">Click any query to get started</p>
			</motion.div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{queryCategories.map((category, categoryIndex) => {
					const Icon = category.icon;
					return (
						<motion.div
							key={category.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
							className="bg-white border border-gray-200 rounded-lg p-3"
						>
							<div className="flex items-center mb-2">
								<Icon className="h-4 w-4 mr-2 text-gray-600" />
								<h4 className="font-medium text-black text-sm">
									{category.title}
								</h4>
							</div>

							<div className="space-y-1">
								{category.queries.map((query, queryIndex) => (
									<motion.div
										key={query}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{
											duration: 0.2,
											delay: categoryIndex * 0.1 + queryIndex * 0.05,
										}}
									>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onQuerySelect(query)}
											className="w-full justify-start text-left h-auto p-2 text-xs text-gray-700 hover:text-black hover:bg-gray-50"
										>
											{query}
										</Button>
									</motion.div>
								))}
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Quick Action Buttons */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.4 }}
				className="mt-4 flex flex-wrap gap-2 justify-center"
			>
				{[
					{
						icon: FileText,
						label: "Generate Report",
						query: "Generate a comprehensive brand visibility report",
					},
					{
						icon: Users,
						label: "Competitor Analysis",
						query: "Show me a detailed competitor analysis",
					},
					{
						icon: BarChart3,
						label: "Performance Summary",
						query: "Give me a quick performance summary",
					},
				].map((action, index) => {
					const Icon = action.icon;
					return (
						<motion.div
							key={action.label}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.2, delay: 0.5 + index * 0.1 }}
						>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onQuerySelect(action.query)}
								className="flex items-center space-x-1.5 hover:bg-gray-50 border-gray-200 text-xs"
							>
								<Icon className="h-3.5 w-3.5" />
								<span>{action.label}</span>
							</Button>
						</motion.div>
					);
				})}
			</motion.div>
		</div>
	);
}
