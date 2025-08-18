"use client";

import { Button } from "@workspace/ui";
import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Target, Brain, Zap, FileText } from "lucide-react";

interface InsightsSuggestedQueriesProps {
	onQuerySelect: (query: string) => void;
}

const queryCategories = [
	{
		title: "Opportunity Analysis",
		icon: Target,
		color: "text-green-600",
		queries: [
			"What are my biggest opportunities right now?",
			"Where should I focus my efforts for maximum impact?",
			"What quick wins can I implement today?",
		],
	},
	{
		title: "Pattern Recognition",
		icon: TrendingUp,
		color: "text-blue-600",
		queries: [
			"Analyze my visibility trends and patterns",
			"What patterns do you see in my performance data?",
			"Identify seasonal trends in my brand mentions",
		],
	},
	{
		title: "Strategic Insights",
		icon: Brain,
		color: "text-purple-600",
		queries: [
			"Generate actionable strategic recommendations",
			"What's my competitive advantage?",
			"How can I differentiate from competitors?",
		],
	},
	{
		title: "Performance Optimization",
		icon: Zap,
		color: "text-orange-600",
		queries: [
			"Identify areas where I'm losing ground",
			"What's working best for my brand?",
			"How can I improve my visibility score?",
		],
	},
];

export function InsightsSuggestedQueries({ onQuerySelect }: InsightsSuggestedQueriesProps) {
	return (
		<div className="max-w-4xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="mb-6"
			>
				<h3 className="text-lg font-semibold text-black mb-2">
					Popular Insights Queries
				</h3>
				<p className="text-sm text-gray-600">
					Click any query to get started, or type your own insights question below
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
					{ icon: FileText, label: "Insights Report", query: "Generate a comprehensive insights report" },
					{ icon: Lightbulb, label: "AI Recommendations", query: "Give me your top 5 AI-powered recommendations" },
					{ icon: Target, label: "Priority Matrix", query: "Create a priority matrix of opportunities" },
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
