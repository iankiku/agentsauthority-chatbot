"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	BarChart3,
	Calendar,
	ChevronDown,
	Download,
	FileText,
} from "lucide-react";
import { useState } from "react";

interface ReportsEmptyStateProps {
	onQuerySelect: (query: string) => void;
}

const REPORTS_CATEGORIES = [
	{
		id: "standard-reports",
		icon: FileText,
		title: "Standard Reports",
		prompts: [
			{
				display: "Comprehensive brand report",
				query:
					"Generate a comprehensive brand visibility report with all key metrics and insights",
			},
			{
				display: "Monthly performance report",
				query:
					"Create a monthly performance report with trends and recommendations",
			},
			{
				display: "Executive summary report",
				query:
					"Generate an executive summary report for stakeholder presentation",
			},
		],
	},
	{
		id: "analytics-reports",
		icon: BarChart3,
		title: "Analytics Reports",
		prompts: [
			{
				display: "Detailed analytics breakdown",
				query:
					"Create a detailed analytics report with performance breakdowns and insights",
			},
			{
				display: "Competitive analytics report",
				query:
					"Generate a competitive analytics report comparing my brand with competitors",
			},
			{
				display: "Platform analytics summary",
				query:
					"Create a platform-specific analytics report for each AI platform",
			},
		],
	},
	{
		id: "custom-reports",
		icon: Calendar,
		title: "Custom Reports",
		prompts: [
			{
				display: "Custom date range report",
				query:
					"Generate a custom report for a specific date range with selected metrics",
			},
			{
				display: "Department-specific report",
				query:
					"Create a department-specific report tailored for marketing team",
			},
			{
				display: "Campaign performance report",
				query: "Generate a report focusing on specific campaign performance",
			},
		],
	},
	{
		id: "export-options",
		icon: Download,
		title: "Export & Sharing",
		prompts: [
			{
				display: "Export report to PDF",
				query: "Generate and export a comprehensive report in PDF format",
			},
			{
				display: "Create shareable dashboard",
				query: "Create a shareable dashboard link for stakeholders",
			},
			{
				display: "Schedule automated reports",
				query: "Set up automated report generation and delivery schedule",
			},
		],
	},
];

export function ReportsEmptyState({ onQuerySelect }: ReportsEmptyStateProps) {
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
					Reports & Analytics
				</h2>
				<p className="text-sm text-gray-600">
					Generate comprehensive reports and export your brand analysis data.
				</p>
			</motion.div>

			{/* Category Buttons */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="grid grid-cols-2 gap-2 max-w-xl w-full mb-6"
			>
				{REPORTS_CATEGORIES.map((category, index) => (
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
							{REPORTS_CATEGORIES.find(
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
