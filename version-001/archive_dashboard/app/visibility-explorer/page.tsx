"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Progress } from "@workspace/ui/components/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Download, Search, Target, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

interface VisibilityData {
	shareOfVoice: Array<{
		name: string;
		value: number;
		isOwn: boolean;
	}>;
	competitorScores: Array<{
		name: string;
		score: number;
		rank: number;
		isOwn: boolean;
	}>;
	providerBreakdown: Record<
		string,
		{
			ownScore: number;
			competitorScores: Array<{ name: string; score: number }>;
		}
	>;
}

export default function VisibilityExplorerPage() {
	const [url, setUrl] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [analysisData, setAnalysisData] = useState<VisibilityData | null>(null);

	// Mock data for demo
	const mockData: VisibilityData = {
		shareOfVoice: [
			{ name: "Your Brand", value: 35, isOwn: true },
			{ name: "Competitor A", value: 28, isOwn: false },
			{ name: "Competitor B", value: 22, isOwn: false },
			{ name: "Competitor C", value: 15, isOwn: false },
		],
		competitorScores: [
			{ name: "Your Brand", score: 85, rank: 1, isOwn: true },
			{ name: "Competitor A", score: 78, rank: 2, isOwn: false },
			{ name: "Competitor B", score: 72, rank: 3, isOwn: false },
			{ name: "Competitor C", score: 65, rank: 4, isOwn: false },
		],
		providerBreakdown: {
			ChatGPT: {
				ownScore: 88,
				competitorScores: [
					{ name: "Competitor A", score: 82 },
					{ name: "Competitor B", score: 75 },
					{ name: "Competitor C", score: 68 },
				],
			},
			Claude: {
				ownScore: 82,
				competitorScores: [
					{ name: "Competitor A", score: 76 },
					{ name: "Competitor B", score: 70 },
					{ name: "Competitor C", score: 62 },
				],
			},
			Gemini: {
				ownScore: 85,
				competitorScores: [
					{ name: "Competitor A", score: 79 },
					{ name: "Competitor B", score: 73 },
					{ name: "Competitor C", score: 66 },
				],
			},
		},
	};

	const handleAnalyze = async () => {
		if (!url.trim()) return;

		setIsAnalyzing(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setAnalysisData(mockData);
		setIsAnalyzing(false);
	};

	const handleExport = () => {
		// Mock export functionality
		console.log("Exporting visibility data...");
	};

	return (
		<DashboardLayout>
			<div className="space-y-6">
				{/* Analysis Form */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Search className="h-5 w-5" />
							One-Time Visibility Analysis
						</CardTitle>
						<CardDescription>
							Enter your website URL to get immediate AI search visibility
							analysis and competitor comparison
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="url">Website URL</Label>
							<div className="flex gap-2">
								<Input
									id="url"
									type="url"
									placeholder="https://yourwebsite.com"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									aria-describedby="url-help"
								/>
								<Button
									onClick={handleAnalyze}
									disabled={!url.trim() || isAnalyzing}
									aria-label="Start visibility analysis"
								>
									{isAnalyzing ? "Analyzing..." : "Analyze"}
								</Button>
							</div>
							<p id="url-help" className="text-sm text-muted-foreground">
								Enter the full URL including https://
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Analysis Results */}
				{analysisData && (
					<div className="space-y-6">
						{/* Quick Stats */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Target className="h-4 w-4 text-blue-600" />
											<div>
												<p className="text-sm font-medium">Visibility Score</p>
												<p className="text-2xl font-bold text-blue-600">85</p>
											</div>
										</div>
										<div className="flex space-x-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													console.log("Explaining Visibility Score")
												}
											>
												Explain
											</Button>
											<Button variant="outline" size="sm">
												Fix
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<TrendingUp className="h-4 w-4 text-green-600" />
											<div>
												<p className="text-sm font-medium">Market Rank</p>
												<p className="text-2xl font-bold text-green-600">#1</p>
											</div>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => console.log("Explaining Market Rank")}
										>
											Explain
										</Button>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Users className="h-4 w-4 text-purple-600" />
											<div>
												<p className="text-sm font-medium">Share of Voice</p>
												<p className="text-2xl font-bold text-purple-600">
													35%
												</p>
											</div>
										</div>
										<div className="flex space-x-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => console.log("Explaining Share of Voice")}
											>
												Explain
											</Button>
											<Button variant="outline" size="sm">
												Fix
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Search className="h-4 w-4 text-orange-600" />
											<div>
												<p className="text-sm font-medium">Competitors</p>
												<p className="text-2xl font-bold text-orange-600">3</p>
											</div>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => console.log("Explaining Competitors")}
										>
											Explain
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Detailed Analysis Tabs */}
						<Tabs defaultValue="overview" className="space-y-4">
							<div className="flex items-center justify-between">
								<TabsList>
									<TabsTrigger value="overview">Overview</TabsTrigger>
									<TabsTrigger value="competitors">Competitors</TabsTrigger>
									<TabsTrigger value="providers">AI Providers</TabsTrigger>
									<TabsTrigger value="recommendations">
										Recommendations
									</TabsTrigger>
								</TabsList>
								<Button onClick={handleExport} variant="outline" size="sm">
									<Download className="h-4 w-4 mr-2" />
									Export Data
								</Button>
							</div>

							<TabsContent value="overview" className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle>Share of Voice Analysis</CardTitle>
										<CardDescription>
											Your brand's visibility compared to competitors across AI
											platforms
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{analysisData.shareOfVoice.map((item, index) => (
												<div
													key={index}
													className="flex items-center justify-between"
												>
													<div className="flex items-center space-x-2">
														<span className="font-medium">{item.name}</span>
														{item.isOwn && (
															<Badge variant="default" className="text-xs">
																Your Brand
															</Badge>
														)}
													</div>
													<div className="flex items-center space-x-2">
														<Progress value={item.value} className="w-32" />
														<span className="text-sm font-medium">
															{item.value}%
														</span>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="competitors" className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle>Competitor Comparison</CardTitle>
										<CardDescription>
											Detailed visibility scores and rankings for all
											competitors
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{analysisData.competitorScores.map(
												(competitor, index) => (
													<div
														key={index}
														className="flex items-center justify-between p-4 border rounded-lg"
													>
														<div className="flex items-center space-x-3">
															<div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
																<span className="text-sm font-bold">
																	#{competitor.rank}
																</span>
															</div>
															<div>
																<p className="font-medium">{competitor.name}</p>
																<p className="text-sm text-muted-foreground">
																	Visibility Score: {competitor.score}/100
																</p>
															</div>
														</div>
														<div className="flex items-center space-x-2">
															{competitor.isOwn && (
																<Badge variant="default">Your Brand</Badge>
															)}
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	console.log(`Explaining ${competitor.name}`)
																}
															>
																Explain
															</Button>
														</div>
													</div>
												)
											)}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="providers" className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle>AI Provider Breakdown</CardTitle>
										<CardDescription>
											Performance across different AI platforms (ChatGPT,
											Claude, Gemini)
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-6">
											{Object.entries(analysisData.providerBreakdown).map(
												([provider, data]) => (
													<div key={provider} className="space-y-3">
														<div className="flex items-center justify-between">
															<h4 className="font-medium">{provider}</h4>
															<div className="flex space-x-2">
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		console.log(
																			`Explaining ${provider} performance`
																		)
																	}
																>
																	Explain
																</Button>
																{data.ownScore < 90 && (
																	<Button variant="outline" size="sm">
																		Fix
																	</Button>
																)}
															</div>
														</div>
														<div className="space-y-2">
															<div className="flex items-center justify-between">
																<span className="text-sm">Your Score</span>
																<span className="font-medium">
																	{data.ownScore}/100
																</span>
															</div>
															<Progress
																value={data.ownScore}
																className="w-full"
															/>
														</div>
														<div className="text-sm text-muted-foreground">
															Competitor average:{" "}
															{Math.round(
																data.competitorScores.reduce(
																	(sum, c) => sum + c.score,
																	0
																) / data.competitorScores.length
															)}
															/100
														</div>
													</div>
												)
											)}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="recommendations" className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle>Actionable Recommendations</CardTitle>
										<CardDescription>
											Specific steps to improve your AI search visibility
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="p-4 border rounded-lg">
												<div className="flex items-start justify-between">
													<div className="flex items-start space-x-3">
														<div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
														<div>
															<h4 className="font-medium">
																Optimize for Claude
															</h4>
															<p className="text-sm text-muted-foreground mt-1">
																Your Claude score (82) is lower than ChatGPT
																(88). Focus on content that appeals to Claude's
																preferences.
															</p>
														</div>
													</div>
													<Button variant="outline" size="sm">
														Fix Issue
													</Button>
												</div>
											</div>
											<div className="p-4 border rounded-lg">
												<div className="flex items-start justify-between">
													<div className="flex items-start space-x-3">
														<div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
														<div>
															<h4 className="font-medium">
																Improve Content Depth
															</h4>
															<p className="text-sm text-muted-foreground mt-1">
																Add more comprehensive, detailed content to
																increase visibility across all AI platforms.
															</p>
														</div>
													</div>
													<Button variant="outline" size="sm">
														Fix Issue
													</Button>
												</div>
											</div>
											<div className="p-4 border rounded-lg">
												<div className="flex items-start justify-between">
													<div className="flex items-start space-x-3">
														<div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
														<div>
															<h4 className="font-medium">
																Monitor Competitor B
															</h4>
															<p className="text-sm text-muted-foreground mt-1">
																Competitor B is gaining ground. Monitor their
																content strategy and adapt accordingly.
															</p>
														</div>
													</div>
													<Button variant="outline" size="sm">
														Fix Issue
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				)}

				{/* Empty State */}
				{!analysisData && !isAnalyzing && (
					<Card>
						<CardContent className="p-12 text-center">
							<Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium mb-2">
								Ready to Analyze Your Visibility?
							</h3>
							<p className="text-muted-foreground mb-4">
								Enter your website URL above to get started with your AI search
								visibility analysis
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</DashboardLayout>
	);
}
