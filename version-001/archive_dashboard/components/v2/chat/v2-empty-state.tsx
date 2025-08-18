"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	BarChart3,
	ChevronDown,
	FileText,
	TrendingUp,
	Users,
} from "lucide-react";
import { useState } from "react";

const PROMPT_CATEGORIES = [
	{
		id: "brand-analysis",
		icon: BarChart3,
		title: "Brand Analysis",
		prompts: [
			{
				display: "Analyze brand visibility across AI platforms",
				query:
					"Analyze my brand's visibility across ChatGPT, Claude, Gemini, and Perplexity with detailed scores and recommendations",
			},
			{
				display: "Check brand monitor status",
				query:
					"Show me my current brand monitoring status and any recent alerts or changes",
			},
			{
				display: "Brand sentiment analysis",
				query:
					"Analyze the sentiment and perception of my brand across AI platforms",
			},
		],
	},
	{
		id: "competitor-research",
		icon: Users,
		title: "Competitor Research",
		prompts: [
			{
				display: "Compare with competitors",
				query:
					"Show me a detailed competitor analysis for my industry with visibility scores and market positioning",
			},
			{
				display: "Competitive gaps analysis",
				query:
					"Identify gaps in my competitive strategy and opportunities for improvement",
			},
			{
				display: "Market positioning insights",
				query:
					"Analyze my market positioning compared to top competitors in my industry",
			},
		],
	},
	{
		id: "platform-insights",
		icon: TrendingUp,
		title: "Platform Insights",
		prompts: [
			{
				display: "AI platform trends",
				query:
					"What are the latest trends in AI platform visibility for brands in my industry?",
			},
			{
				display: "Platform performance comparison",
				query:
					"Compare my performance across different AI platforms and suggest optimization strategies",
			},
			{
				display: "Visibility optimization tips",
				query:
					"Provide specific tips to improve my brand's visibility on AI platforms",
			},
		],
	},
	{
		id: "generate-report",
		icon: FileText,
		title: "Generate Report",
		prompts: [
			{
				display: "Comprehensive monitoring report",
				query:
					"Generate a comprehensive brand monitoring report with actionable insights and recommendations",
			},
			{
				display: "Weekly performance summary",
				query:
					"Create a weekly performance summary showing key metrics and trends",
			},
			{
				display: "Stakeholder presentation",
				query:
					"Generate a stakeholder-ready presentation highlighting key brand visibility metrics",
			},
		],
	},
];

interface V2EmptyStateProps {
	onQuerySelect?: (query: string) => void;
	className?: string;
}

export function V2EmptyState({ onQuerySelect, className }: V2EmptyStateProps) {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const handleCategoryClick = (categoryId: string) => {
		setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
	};

	const handlePromptClick = (query: string) => {
		onQuerySelect?.(query);
		setSelectedCategory(null); // Close category after selection
	};

	return (
		<div
			className={`v2-empty-state flex flex-col items-center justify-center min-h-full px-4 ${className || ""}`}
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center max-w-2xl w-full"
			>
				{/* Header */}
				<div className="mb-8">
					<motion.h1
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1 }}
						className="text-2xl font-semibold mb-2 text-gray-900"
					>
						Start a new conversation
					</motion.h1>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="text-sm text-gray-600"
					>
						Ask anything about your brand visibility across AI platforms.
					</motion.p>
				</div>

				{/* Category Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="grid grid-cols-2 gap-2 max-w-xl w-full mb-6"
				>
					{PROMPT_CATEGORIES.map((category, index) => (
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
								{PROMPT_CATEGORIES.find(
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
			</motion.div>
		</div>
	);
}
