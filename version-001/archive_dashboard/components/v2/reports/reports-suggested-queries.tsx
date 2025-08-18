"use client";

import { Button } from "@workspace/ui";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, BarChart3, TrendingUp, Users } from "lucide-react";

interface ReportsSuggestedQueriesProps {
	onQuerySelect: (query: string) => void;
}

const queryCategories = [
	{
		title: "Performance Reports",
		icon: BarChart3,
		color: "text-blue-600",
		queries: [
			"Create a comprehensive performance report for this month",
			"Generate a quarterly brand visibility analysis",
			"Show me year-over-year performance comparison",
		],
	},
	{
		title: "Growth Analysis",
		icon: TrendingUp,
		color: "text-green-600",
		queries: [
			"Show me month-over-month growth analysis",
			"Create a growth trajectory report",
			"Analyze performance trends over the last 6 months",
		],
	},
	{
		title: "Competitive Reports",
		icon: Users,
		color: "text-purple-600",
		queries: [
			"Generate a competitor benchmarking report",
			"Create a competitive landscape analysis",
			"Compare my performance against top 3 competitors",
		],
	},
	{
		title: "Data Export & Sharing",
		icon: Download,
		color: "text-orange-600",
		queries: [
			"Export my data for the executive team",
			"Create a stakeholder presentation",
			"Generate a PDF report for board meeting",
		],
	},
];

export function ReportsSuggestedQueries({ onQuerySelect }: ReportsSuggestedQueriesProps) {
	return (
		<div className="max-w-4xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="mb-6"
			>
				<h3 className="text-lg font-semibold text-black mb-2">
					Popular Report Queries
				</h3>
				<p className="text-sm text-gray-600">
					Click any query to get started, or type your own report request below
				</p>
			</motion.div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{queryCategories.map((category, categoryIndex) => {
					const Icon = category.icon;
					return (
						<motion.div
							key={category.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
							className="bg-white border border-gray-200 rounded-lg p-4"
						>
							<div className="flex items-center mb-3">
								<Icon className={`h-5 w-5 mr-2 ${category.color}`} />
								<h4 className="font-medium text-black">{category.title}</h4>
							</div>
							
							<div className="space-y-2">
								{category.queries.map((query, queryIndex) => (
									<motion.div
										key={query}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ 
											duration: 0.2, 
											delay: categoryIndex * 0.1 + queryIndex * 0.05 
										}}
									>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onQuerySelect(query)}
											className="w-full justify-start text-left h-auto p-2 text-sm text-gray-700 hover:text-black hover:bg-gray-50"
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
				className="mt-6 flex flex-wrap gap-2 justify-center"
			>
				{[
					{ icon: FileText, label: "Executive Summary", query: "Create an executive summary of my brand performance" },
					{ icon: Calendar, label: "Weekly Report", query: "Create a weekly performance report" },
					{ icon: Download, label: "Export Data", query: "Export all my performance data to Excel" },
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
								className="flex items-center space-x-2 hover:bg-orange-50 hover:border-orange-200"
							>
								<Icon className="h-4 w-4" />
								<span>{action.label}</span>
							</Button>
						</motion.div>
					);
				})}
			</motion.div>
		</div>
	);
}
