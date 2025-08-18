"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	BarChart3,
	ChevronDown,
	Globe,
	Target,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface DashboardEmptyStateProps {
	onQuerySelect: (query: string) => void;
}

const DASHBOARD_CATEGORIES = [
	{
		id: "geo-analysis",
		icon: BarChart3,
		title: "GEO Score Analysis",
		prompts: [
			{
				display: "Current GEO score breakdown",
				query:
					"Show me my current GEO score and detailed performance breakdown with recommendations",
			},
			{
				display: "Historical GEO trends",
				query:
					"Show me my GEO score trends over the last 3 months with insights",
			},
			{
				display: "GEO improvement recommendations",
				query: "What specific actions can I take to improve my GEO score?",
			},
		],
	},
	{
		id: "performance-tracking",
		icon: TrendingUp,
		title: "Performance Tracking",
		prompts: [
			{
				display: "30-day performance trends",
				query:
					"Show me my brand performance trends over the last 30 days with key insights",
			},
			{
				display: "Weekly performance summary",
				query:
					"Give me a weekly performance summary with highlights and concerns",
			},
			{
				display: "Performance vs goals",
				query:
					"How is my current performance tracking against my goals and targets?",
			},
		],
	},
	{
		id: "competitive-intelligence",
		icon: Target,
		title: "Competitive Intelligence",
		prompts: [
			{
				display: "Compare with competitors",
				query:
					"How does my brand compare to competitors in AI visibility and market positioning?",
			},
			{
				display: "Competitive gaps analysis",
				query: "Identify competitive gaps and opportunities for my brand",
			},
			{
				display: "Market share insights",
				query: "Show me my market share compared to key competitors",
			},
		],
	},
	{
		id: "platform-insights",
		icon: Globe,
		title: "Platform Insights",
		prompts: [
			{
				display: "Platform coverage analysis",
				query:
					"Which AI platforms mention my brand most frequently and how can I improve coverage?",
			},
			{
				display: "Platform-specific performance",
				query: "Show me detailed performance metrics for each AI platform",
			},
			{
				display: "Platform optimization tips",
				query:
					"Give me specific tips to optimize my presence on each AI platform",
			},
		],
	},
];

export function DashboardEmptyState({
	onQuerySelect,
}: DashboardEmptyStateProps) {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const handleCategoryClick = (categoryId: string) => {
		setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
	};

	const handlePromptClick = (query: string) => {
		onQuerySelect(query);
		setSelectedCategory(null); // Close category after selection
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-full p-6 text-center">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="mb-8"
			>
				<h2 className="text-2xl font-semibold text-gray-900 mb-2">Overview</h2>
				<p className="text-sm text-gray-600">
					Quick actions and summaries for your brand performance.
				</p>
			</motion.div>

			{/* Category Buttons */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="grid grid-cols-2 gap-2 max-w-xl w-full mb-6"
			>
				{DASHBOARD_CATEGORIES.map((category, index) => (
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
							{DASHBOARD_CATEGORIES.find(
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
