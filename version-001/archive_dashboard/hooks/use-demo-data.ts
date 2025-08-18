import { useEffect, useState } from "react";

// ACME Corporation Demo Data
const acmeCompany = {
	name: "ACME Corporation",
	url: "https://acme.com",
	industry: "Manufacturing & Innovation",
	description:
		"Leading manufacturer of anvils, dynamite, road runner traps, and rocket skates. Trusted by cartoon characters worldwide since 1928.",
	visibilityScore: 87,
	sentimentScore: 82,
	shareOfVoice: 35,
	overallScore: 85,
	averagePosition: 1.8,
	weeklyChange: +5,
	monthlyAnalyses: 23,
	competitorsTracked: 5,
	marketRank: 2,
	rankChange: +1,
};

const acmeCompetitors = [
	{
		name: "Wile E. Coyote Industries",
		url: "https://coyote-industries.com",
		visibilityScore: 92,
		shareOfVoice: 40,
		rank: 1,
		strengths: ["Advanced technology", "Innovative products", "Strong R&D"],
		weaknesses: ["High failure rate", "Expensive products", "Safety concerns"],
	},
	{
		name: "Warner Bros. Manufacturing",
		url: "https://warner-manufacturing.com",
		visibilityScore: 78,
		shareOfVoice: 25,
		rank: 3,
		strengths: ["Brand recognition", "Diverse portfolio", "Global reach"],
		weaknesses: ["High costs", "Complex operations", "Slow innovation"],
	},
	{
		name: "Looney Tunes Corp",
		url: "https://looneytunes-corp.com",
		visibilityScore: 71,
		shareOfVoice: 20,
		rank: 4,
		strengths: ["Entertainment value", "Creative products", "Strong marketing"],
		weaknesses: [
			"Limited functionality",
			"Niche market",
			"Inconsistent quality",
		],
	},
	{
		name: "Cartoon Network Industries",
		url: "https://cartoon-network-industries.com",
		visibilityScore: 65,
		shareOfVoice: 15,
		rank: 5,
		strengths: ["Modern approach", "Digital focus", "Youth appeal"],
		weaknesses: [
			"Limited experience",
			"Small market share",
			"Unproven track record",
		],
	},
];

const platformPerformance = [
	{
		name: "ChatGPT",
		score: 89,
		icon: "Brain",
		color: "text-light-orange",
		trend: "+3",
		insights: "Excellent visibility for manufacturing queries",
	},
	{
		name: "Claude",
		score: 85,
		icon: "MessageSquare",
		color: "text-light-blue",
		trend: "+2",
		insights: "Strong performance on technical discussions",
	},
	{
		name: "Gemini",
		score: 82,
		icon: "Search",
		color: "text-light-orange",
		trend: "+1",
		insights: "Good coverage of innovation topics",
	},
	{
		name: "Perplexity",
		score: 88,
		icon: "Sparkles",
		color: "text-light-orange",
		trend: "+4",
		insights: "Outstanding for product research queries",
	},
];

const recentActivity = [
	{
		type: "score_improvement",
		title: "GEO Score Improved",
		description: "Your overall score increased by 5 points to 87%",
		timestamp: "2 hours ago",
		color: "light-orange",
	},
	{
		type: "analysis_completed",
		title: "Competitor Analysis Completed",
		description: "Analysis for 5 competitors finished with detailed insights",
		timestamp: "6 hours ago",
		color: "light-blue",
	},
	{
		type: "optimization_opportunity",
		title: "Optimization Opportunity",
		description:
			"Gemini visibility can be improved by 8% through content optimization",
		timestamp: "1 day ago",
		color: "light-orange",
	},
];

const keyInsights = [
	{
		type: "strength",
		title: "Strong Performance",
		description:
			"ChatGPT mentions ACME 89% of the time for manufacturing queries",
		icon: "TrendingUp",
		color: "light-orange",
	},
	{
		type: "opportunity",
		title: "Market Opportunity",
		description:
			"Wile E. Coyote Industries leads by 5 points - focus on innovation content",
		icon: "Target",
		color: "light-blue",
	},
	{
		type: "trend",
		title: "Positive Trend",
		description:
			"ACME gaining market share with +5% growth vs industry average +2%",
		icon: "TrendingUp",
		color: "light-orange",
	},
];

const usageStats = {
	analyses: { used: 23, limit: 50, percentage: 46 },
	apiCalls: { used: 1200, limit: 5000, percentage: 24 },
};

export interface DemoData {
	company: typeof acmeCompany;
	competitors: typeof acmeCompetitors;
	platformPerformance: typeof platformPerformance;
	recentActivity: typeof recentActivity;
	keyInsights: typeof keyInsights;
	usageStats: typeof usageStats;
}

export function useDemoData(): DemoData {
	const [demoData, setDemoData] = useState<DemoData>({
		company: acmeCompany,
		competitors: acmeCompetitors,
		platformPerformance,
		recentActivity,
		keyInsights,
		usageStats,
	});

	// Simulate real-time updates
	useEffect(() => {
		const interval = setInterval(() => {
			// Update timestamps to keep them current
			setDemoData((prev) => ({
				...prev,
				recentActivity: prev.recentActivity.map((activity) => ({
					...activity,
					timestamp: activity.timestamp, // Keep original for demo
				})),
			}));
		}, 60000); // Update every minute

		return () => clearInterval(interval);
	}, []);

	return demoData;
}

// Export individual data for direct use
export {
	acmeCompany,
	acmeCompetitors,
	keyInsights,
	platformPerformance,
	recentActivity,
	usageStats,
};
