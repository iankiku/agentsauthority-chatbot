"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import {
	ArrowRight,
	Crown,
	Download,
	ExternalLink,
	Filter,
	Target,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";

const competitorData = {
	rankings: [
		{
			rank: 1,
			name: "Competitor A",
			score: 81,
			change: 3,
			trend: "up",
			marketShare: 28,
			website: "competitor-a.com",
			strengths: ["ChatGPT dominance", "Technical content"],
			weaknesses: ["Limited Gemini presence"],
		},
		{
			rank: 2,
			name: "Your Brand",
			score: 73,
			change: 5,
			trend: "up",
			marketShare: 25,
			website: "yourbrand.com",
			isOwn: true,
			strengths: ["Consistent growth", "Strong Perplexity"],
			weaknesses: ["Gemini optimization needed"],
		},
		{
			rank: 3,
			name: "Competitor C",
			score: 76,
			change: 0,
			trend: "stable",
			marketShare: 22,
			website: "competitor-c.com",
			strengths: ["Stable performance", "Brand mentions"],
			weaknesses: ["Slow growth"],
		},
		{
			rank: 4,
			name: "Competitor B",
			score: 69,
			change: -2,
			trend: "down",
			marketShare: 18,
			website: "competitor-b.com",
			strengths: ["Historical presence"],
			weaknesses: ["Declining visibility", "Poor Claude performance"],
		},
		{
			rank: 5,
			name: "Competitor D",
			score: 64,
			change: -4,
			trend: "down",
			marketShare: 7,
			website: "competitor-d.com",
			strengths: ["Niche expertise"],
			weaknesses: ["Limited reach", "Low AI visibility"],
		},
	],
	platformComparison: {
		ChatGPT: [
			{ name: "Competitor A", score: 85 },
			{ name: "Your Brand", score: 78 },
			{ name: "Competitor C", score: 74 },
			{ name: "Competitor B", score: 72 },
			{ name: "Competitor D", score: 67 },
		],
		Claude: [
			{ name: "Competitor C", score: 79 },
			{ name: "Competitor A", score: 77 },
			{ name: "Your Brand", score: 71 },
			{ name: "Competitor B", score: 66 },
			{ name: "Competitor D", score: 61 },
		],
		Gemini: [
			{ name: "Competitor A", score: 78 },
			{ name: "Competitor C", score: 75 },
			{ name: "Competitor B", score: 70 },
			{ name: "Your Brand", score: 69 },
			{ name: "Competitor D", score: 64 },
		],
		Perplexity: [
			{ name: "Your Brand", score: 74 },
			{ name: "Competitor A", score: 73 },
			{ name: "Competitor C", score: 71 },
			{ name: "Competitor B", score: 68 },
			{ name: "Competitor D", score: 65 },
		],
	},
};

export default function CompetitorReportsPage() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<div className="flex items-center space-x-2">
						<Users className="w-5 h-5" />
						<h1 className="text-lg font-semibold">Competitor Analysis</h1>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-6 p-6">
					{/* Header */}
					<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
						<div>
							<h2 className="text-3xl font-bold">Competitive Intelligence</h2>
							<p className="text-muted-foreground">
								Analyze your position against competitors across AI platforms
							</p>
						</div>
						<div className="flex gap-2">
							<Select defaultValue="30">
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="7">Last 7 days</SelectItem>
									<SelectItem value="30">Last 30 days</SelectItem>
									<SelectItem value="90">Last 90 days</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="outline">
								<Filter className="w-4 h-4 mr-2" />
								Filter
							</Button>
							<Button variant="outline">
								<Download className="w-4 h-4 mr-2" />
								Export
							</Button>
						</div>
					</div>

					{/* Market Position Overview */}
					<Card className="bg-gradient-to-r from-blue-50 to-primary/10 dark:from-blue-950 dark:to-primary/20 border-blue-200 dark:border-blue-800">
						<CardContent className="p-8">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-lg font-medium text-muted-foreground mb-2">
										Your Market Position
									</h3>
									<div className="flex items-center space-x-4">
										<div className="flex items-center space-x-2">
											<Crown className="w-8 h-8 text-orange-500" />
											<span className="text-4xl font-bold text-orange-600">
												#2
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<TrendingUp className="w-6 h-6 text-green-500" />
											<span className="text-lg font-semibold text-green-500">
												+1 position
											</span>
										</div>
									</div>
									<p className="text-sm text-muted-foreground mt-2">
										25% market share • 73% visibility score
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm text-muted-foreground mb-2">
										Gap to #1
									</p>
									<p className="text-2xl font-bold text-red-600">8 points</p>
									<p className="text-sm text-muted-foreground">
										Competitor A leads
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Competitor Rankings */}
					<Card>
						<CardHeader>
							<CardTitle>Competitive Rankings</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{competitorData.rankings.map((competitor) => (
									<div
										key={competitor.name}
										className={`p-4 rounded-lg border transition-all ${
											competitor.isOwn
												? "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800"
												: "hover:bg-muted/50"
										}`}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-4">
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
														competitor.rank === 1
															? "bg-yellow-500 text-black"
															: competitor.rank === 2
																? "bg-gray-400 text-black"
																: competitor.rank === 3
																	? "bg-orange-600 text-white"
																	: "bg-gray-600 text-white"
													}`}
												>
													{competitor.rank}
												</div>
												<div>
													<div className="flex items-center space-x-2">
														<h3
															className={`font-semibold ${competitor.isOwn ? "text-orange-600" : ""}`}
														>
															{competitor.name}
														</h3>
														{competitor.isOwn && (
															<Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30 text-xs">
																You
															</Badge>
														)}
														{competitor.rank === 1 && (
															<Crown className="w-4 h-4 text-yellow-500" />
														)}
													</div>
													<div className="flex items-center space-x-4 text-sm text-muted-foreground">
														<span>{competitor.website}</span>
														<span>•</span>
														<span>{competitor.marketShare}% market share</span>
													</div>
												</div>
											</div>
											<div className="flex items-center space-x-6">
												<div className="text-right">
													<div className="flex items-center space-x-2">
														<span className="text-2xl font-bold">
															{competitor.score}%
														</span>
														<div className="flex items-center">
															{competitor.trend === "up" ? (
																<TrendingUp className="w-4 h-4 text-green-500" />
															) : competitor.trend === "down" ? (
																<TrendingDown className="w-4 h-4 text-red-500" />
															) : null}
															{competitor.change !== 0 && (
																<span
																	className={`text-sm ${
																		competitor.trend === "up"
																			? "text-green-500"
																			: competitor.trend === "down"
																				? "text-red-500"
																				: "text-muted-foreground"
																	}`}
																>
																	{competitor.change > 0 ? "+" : ""}
																	{competitor.change}%
																</span>
															)}
														</div>
													</div>
													<Progress
														value={competitor.score}
														className="w-24 h-2 mt-1"
													/>
												</div>
												<Button variant="outline" size="sm">
													<ExternalLink className="w-3 h-3 mr-1" />
													Analyze
												</Button>
											</div>
										</div>

										{/* Strengths and Weaknesses */}
										<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<h4 className="text-sm font-medium text-green-600 mb-2">
													Strengths
												</h4>
												<div className="space-y-1">
													{competitor.strengths.map((strength, index) => (
														<div
															key={index}
															className="flex items-center space-x-2"
														>
															<div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
															<span className="text-sm text-muted-foreground">
																{strength}
															</span>
														</div>
													))}
												</div>
											</div>
											<div>
												<h4 className="text-sm font-medium text-red-600 mb-2">
													Weaknesses
												</h4>
												<div className="space-y-1">
													{competitor.weaknesses.map((weakness, index) => (
														<div
															key={index}
															className="flex items-center space-x-2"
														>
															<div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
															<span className="text-sm text-muted-foreground">
																{weakness}
															</span>
														</div>
													))}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Platform-by-Platform Comparison */}
					<Card>
						<CardHeader>
							<CardTitle>Platform Performance Comparison</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{Object.entries(competitorData.platformComparison).map(
									([platform, rankings]) => (
										<div key={platform} className="space-y-4">
											<h4 className="font-semibold text-lg">{platform}</h4>
											<div className="space-y-3">
												{rankings.map((competitor, index) => (
													<div
														key={competitor.name}
														className="flex items-center justify-between"
													>
														<div className="flex items-center space-x-3">
															<span
																className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
																	index === 0
																		? "bg-yellow-500 text-black"
																		: index === 1
																			? "bg-gray-400 text-black"
																			: index === 2
																				? "bg-orange-600 text-white"
																				: "bg-gray-600 text-white"
																}`}
															>
																{index + 1}
															</span>
															<span
																className={`${competitor.name === "Your Brand" ? "font-semibold text-orange-600" : ""}`}
															>
																{competitor.name}
															</span>
														</div>
														<div className="flex items-center space-x-3">
															<Progress
																value={competitor.score}
																className="w-16 h-2"
															/>
															<span className="font-semibold w-10 text-right">
																{competitor.score}%
															</span>
														</div>
													</div>
												))}
											</div>
										</div>
									)
								)}
							</div>
						</CardContent>
					</Card>

					{/* Strategic Insights */}
					<Card>
						<CardHeader>
							<CardTitle>Strategic Insights & Opportunities</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
								<div className="flex items-start space-x-3">
									<Target className="w-5 h-5 text-green-500 mt-0.5" />
									<div>
										<h4 className="font-medium text-green-800 dark:text-green-200">
											Perplexity Leadership
										</h4>
										<p className="text-sm text-green-700 dark:text-green-300">
											You lead on Perplexity with 74% visibility. This platform
											advantage can be leveraged for growth.
										</p>
									</div>
								</div>
							</div>

							<div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
								<div className="flex items-start space-x-3">
									<TrendingDown className="w-5 h-5 text-red-500 mt-0.5" />
									<div>
										<h4 className="font-medium text-red-800 dark:text-red-200">
											Gemini Gap
										</h4>
										<p className="text-sm text-red-700 dark:text-red-300">
											Ranking 4th on Gemini with 69% visibility. Competitor A
											leads by 9 points - focus optimization here.
										</p>
									</div>
								</div>
							</div>

							<div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
								<div className="flex items-start space-x-3">
									<ArrowRight className="w-5 h-5 text-blue-500 mt-0.5" />
									<div>
										<h4 className="font-medium text-blue-800 dark:text-blue-200">
											Overtake Opportunity
										</h4>
										<p className="text-sm text-blue-700 dark:text-blue-300">
											With +5% growth vs Competitor A's +3%, you're closing the
											8-point gap. Maintain momentum to reach #1.
										</p>
									</div>
								</div>
							</div>

							<div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
								<div className="flex items-start space-x-3">
									<Crown className="w-5 h-5 text-yellow-500 mt-0.5" />
									<div>
										<h4 className="font-medium text-yellow-800 dark:text-yellow-200">
											Market Share Growth
										</h4>
										<p className="text-sm text-yellow-700 dark:text-yellow-300">
											Your 25% market share is growing. Focus on ChatGPT and
											Gemini to capture more from declining competitors.
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
