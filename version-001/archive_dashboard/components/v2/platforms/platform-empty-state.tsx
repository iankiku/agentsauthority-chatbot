"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	BarChart3,
	ChevronDown,
	Lightbulb,
	Settings,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface PlatformEmptyStateProps {
	onQuerySelect: (query: string) => void;
}

const PLATFORM_CATEGORIES = [
	{
		id: "platform-analysis",
		icon: BarChart3,
		title: "Platform Analysis",
		prompts: [
			{
				display: "Analyze performance across platforms",
				query:
					"Analyze my brand's performance across ChatGPT, Claude, Gemini, and Perplexity platforms",
			},
			{
				display: "Platform coverage assessment",
				query:
					"Assess my brand coverage and visibility across different AI platforms",
			},
			{
				display: "Platform-specific insights",
				query:
					"Provide platform-specific insights and recommendations for improvement",
			},
		],
	},
	{
		id: "performance-metrics",
		icon: TrendingUp,
		title: "Performance Metrics",
		prompts: [
			{
				display: "Platform performance comparison",
				query: "Compare my performance metrics across different AI platforms",
			},
			{
				display: "Best performing platforms",
				query: "Which platforms show the best performance for my brand?",
			},
			{
				display: "Platform performance trends",
				query: "Show me performance trends for each platform over time",
			},
		],
	},
	{
		id: "optimization-strategies",
		icon: Settings,
		title: "Optimization Strategies",
		prompts: [
			{
				display: "Platform optimization recommendations",
				query:
					"Provide optimization strategies for improving performance on each platform",
			},
			{
				display: "Platform-specific tactics",
				query: "What specific tactics work best for each AI platform?",
			},
			{
				display: "Cross-platform optimization",
				query: "How can I optimize my strategy across all AI platforms?",
			},
		],
	},
	{
		id: "emerging-platforms",
		icon: Lightbulb,
		title: "Emerging Platforms",
		prompts: [
			{
				display: "New platform opportunities",
				query: "What new AI platforms should I consider for brand visibility?",
			},
			{
				display: "Emerging platform trends",
				query: "Analyze emerging trends in AI platform development",
			},
			{
				display: "Platform roadmap insights",
				query: "Provide insights on platform roadmaps and future opportunities",
			},
		],
	},
];

export function PlatformEmptyState({ onQuerySelect }: PlatformEmptyStateProps) {
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
					Platform Performance
				</h2>
				<p className="text-sm text-gray-600">
					Analyze and optimize your brand's performance across AI platforms.
				</p>
			</motion.div>

			{/* Category Buttons */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="grid grid-cols-2 gap-2 max-w-xl w-full mb-6"
			>
				{PLATFORM_CATEGORIES.map((category, index) => (
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
							{PLATFORM_CATEGORIES.find(
								(cat) => cat.id === selectedCategory
							)?.prompts.map((prompt, index) => (
								<motion.button
									key={index}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									onClick={() => handlePromptClick(prompt.query)}
									className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-md transition-all duration-200 text-xs text-gray-700 hover:text-orange-900 cursor-pointer"
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
