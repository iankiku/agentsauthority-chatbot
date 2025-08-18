"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Brain,
	ChevronDown,
	Lightbulb,
	Target,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface InsightsEmptyStateProps {
	onQuerySelect: (query: string) => void;
}

const INSIGHTS_CATEGORIES = [
	{
		id: "ai-insights",
		icon: Brain,
		title: "AI-Generated Insights",
		prompts: [
			{
				display: "Generate brand visibility insights",
				query:
					"Generate AI-powered insights about my brand's visibility patterns and opportunities",
			},
			{
				display: "Identify trending opportunities",
				query:
					"Identify trending opportunities and patterns in my brand's AI presence",
			},
			{
				display: "Predictive insights analysis",
				query:
					"Provide predictive insights about future brand visibility trends",
			},
		],
	},
	{
		id: "performance-insights",
		icon: TrendingUp,
		title: "Performance Insights",
		prompts: [
			{
				display: "Performance pattern analysis",
				query:
					"Analyze performance patterns and provide insights on improving brand visibility",
			},
			{
				display: "Peak performance insights",
				query:
					"What insights can you provide about my peak performance periods?",
			},
			{
				display: "Performance optimization insights",
				query:
					"Generate insights on optimizing my brand's performance across AI platforms",
			},
		],
	},
	{
		id: "actionable-recommendations",
		icon: Target,
		title: "Actionable Recommendations",
		prompts: [
			{
				display: "Top improvement recommendations",
				query:
					"Provide top 5 actionable recommendations to improve my brand's AI visibility",
			},
			{
				display: "Strategic action insights",
				query:
					"Generate strategic action insights based on my current brand position",
			},
			{
				display: "Priority action items",
				query:
					"What are the priority action items I should focus on this month?",
			},
		],
	},
	{
		id: "market-insights",
		icon: Lightbulb,
		title: "Market Intelligence",
		prompts: [
			{
				display: "Market opportunity insights",
				query: "Provide insights on market opportunities in my industry",
			},
			{
				display: "Industry trend analysis",
				query:
					"Analyze industry trends and provide insights for strategic positioning",
			},
			{
				display: "Emerging market insights",
				query: "What emerging market insights should I be aware of?",
			},
		],
	},
];

export function InsightsEmptyState({ onQuerySelect }: InsightsEmptyStateProps) {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const handleCategoryClick = (categoryId: string) => {
		setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
	};

	const handlePromptClick = (query: string) => {
		onQuerySelect(query);
		setSelectedCategory(null); // Close category after selection
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-full p-8 text-center">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="mb-8"
			>
				<h2 className="text-2xl font-semibold text-gray-900 mb-2">
					AI-Generated Insights
				</h2>
				<p className="text-sm text-gray-600">
					Discover actionable insights and strategic recommendations powered by
					AI.
				</p>
			</motion.div>

			{/* Category Buttons */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="grid grid-cols-2 gap-2 max-w-xl w-full mb-6"
			>
				{INSIGHTS_CATEGORIES.map((category, index) => (
					<motion.button
						key={category.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 + index * 0.1 }}
						onClick={() => handleCategoryClick(category.id)}
						className={`flex items-center gap-2 p-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 text-left group shadow-sm hover:shadow-md ${
							selectedCategory === category.id
								? "border-orange-400 bg-orange-50"
								: ""
						}`}
					>
						<div className="shrink-0 w-6 h-6 rounded-md bg-gradient-to-r from-orange-100 to-orange-50 flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-100 transition-all">
							<category.icon className="w-3.5 h-3.5 text-orange-600" />
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-medium text-xs text-gray-900 group-hover:text-orange-900 transition-colors">
								{category.title}
							</h3>
						</div>
						<ChevronDown
							className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
								selectedCategory === category.id ? "rotate-180" : ""
							}`}
						/>
					</motion.button>
				))}
			</motion.div>

			{/* Expanded Prompts */}
			<AnimatePresence>
				{selectedCategory && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="overflow-hidden mb-4"
					>
						<div className="space-y-1.5 max-w-lg mx-auto">
							{INSIGHTS_CATEGORIES.find(
								(cat) => cat.id === selectedCategory
							)?.prompts.map((prompt, index) => (
								<motion.button
									key={index}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									onClick={() => handlePromptClick(prompt.query)}
									className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-md transition-all duration-200 text-xs text-gray-700 hover:text-orange-900"
								>
									{prompt.display}
								</motion.button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Call to Action */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.7 }}
				className="text-center"
			>
				<p className="text-sm text-gray-500">
					Choose a category above or type your question below
				</p>
			</motion.div>
		</div>
	);
}
