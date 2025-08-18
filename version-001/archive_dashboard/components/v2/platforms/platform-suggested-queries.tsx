"use client";

import { Button } from "@workspace/ui";
import { motion } from "framer-motion";
import { Globe, BarChart3, TrendingUp, Settings, Zap, FileText } from "lucide-react";

interface PlatformSuggestedQueriesProps {
	onQuerySelect: (query: string) => void;
}

const queryCategories = [
	{
		title: "Platform Overview",
		icon: Globe,
		color: "text-blue-600",
		queries: [
			"Show my performance across all AI platforms",
			"Which platform performs best for my brand?",
			"Give me a platform performance summary",
		],
	},
	{
		title: "Platform Comparison",
		icon: BarChart3,
		color: "text-green-600",
		queries: [
			"Create a platform comparison chart",
			"Compare ChatGPT vs Claude performance",
			"Show me Gemini vs Perplexity metrics",
		],
	},
	{
		title: "Performance Trends",
		icon: TrendingUp,
		color: "text-purple-600",
		queries: [
			"Show platform performance trends over time",
			"Which platform is improving fastest?",
			"Analyze monthly platform changes",
		],
	},
	{
		title: "Optimization",
		icon: Settings,
		color: "text-orange-600",
		queries: [
			"Which platform should I focus on improving?",
			"Give me optimization recommendations",
			"What's my biggest platform opportunity?",
		],
	},
];

export function PlatformSuggestedQueries({ onQuerySelect }: PlatformSuggestedQueriesProps) {
	return (
		<div className="max-w-4xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="mb-6"
			>
				<h3 className="text-lg font-semibold text-black mb-2">
					Popular Platform Analysis Queries
				</h3>
				<p className="text-sm text-gray-600">
					Click any query to get started, or type your own platform analysis question below
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
					{ icon: FileText, label: "Platform Report", query: "Generate a comprehensive platform performance report" },
					{ icon: Zap, label: "Quick Optimization", query: "Give me 3 quick platform optimization tips" },
					{ icon: BarChart3, label: "Health Check", query: "Run a platform health check analysis" },
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
