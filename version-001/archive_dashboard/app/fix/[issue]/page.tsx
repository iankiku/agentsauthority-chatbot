"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import {
	ArrowLeft,
	CheckCircle,
	Clock,
	FileText,
	MessageSquare,
	Play,
	Sparkles,
	Target,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FixRecommendation {
	id: string;
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	estimatedTime: string;
	impact: number;
	status: "pending" | "in-progress" | "completed";
	steps: string[];
}

export default function FixIssuePage() {
	const params = useParams();
	const issue = params.issue as string;
	const [recommendations, setRecommendations] = useState<FixRecommendation[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate loading AI recommendations
		setTimeout(() => {
			const mockRecommendations: FixRecommendation[] = [
				{
					id: "1",
					title: "Optimize Content for AI Search",
					description:
						"Improve your content structure and keywords to better align with AI search algorithms",
					priority: "high",
					estimatedTime: "2-3 hours",
					impact: 85,
					status: "pending",
					steps: [
						"Audit current content for AI-friendly keywords",
						"Restructure content with clear headings and sections",
						"Add FAQ sections to address common queries",
						"Optimize meta descriptions and titles",
					],
				},
				{
					id: "2",
					title: "Enhance Technical SEO",
					description:
						"Improve website technical aspects that affect AI search visibility",
					priority: "medium",
					estimatedTime: "4-6 hours",
					impact: 70,
					status: "pending",
					steps: [
						"Improve page load speed",
						"Fix mobile responsiveness issues",
						"Add structured data markup",
						"Optimize internal linking structure",
					],
				},
				{
					id: "3",
					title: "Create AI-Optimized Content",
					description:
						"Develop new content specifically designed for AI search engines",
					priority: "medium",
					estimatedTime: "8-12 hours",
					impact: 65,
					status: "pending",
					steps: [
						"Research trending topics in your industry",
						"Create comprehensive, long-form content",
						"Include relevant examples and case studies",
						"Add interactive elements and multimedia",
					],
				},
			];
			setRecommendations(mockRecommendations);
			setIsLoading(false);
		}, 1500);
	}, []);

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800 border-red-200";
			case "medium":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "low":
				return "bg-green-100 text-green-800 border-green-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="w-4 h-4 text-green-600" />;
			case "in-progress":
				return <Clock className="w-4 h-4 text-blue-600" />;
			default:
				return <Clock className="w-4 h-4 text-gray-400" />;
		}
	};

	const handleStartFix = (recommendationId: string) => {
		setRecommendations((prev) =>
			prev.map((rec) =>
				rec.id === recommendationId
					? { ...rec, status: "in-progress" as const }
					: rec
			)
		);
	};

	const handleCompleteFix = (recommendationId: string) => {
		setRecommendations((prev) =>
			prev.map((rec) =>
				rec.id === recommendationId
					? { ...rec, status: "completed" as const }
					: rec
			)
		);
	};

	const decodedIssue = decodeURIComponent(issue);

	return (
		<DashboardLayout showActions={false}>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Link href="/dashboard">
							<Button variant="outline" size="sm">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Dashboard
							</Button>
						</Link>
						<div>
							<h1 className="text-2xl font-bold">Fix: {decodedIssue}</h1>
							<p className="text-muted-foreground">
								AI-powered recommendations to improve your performance
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
							<Sparkles className="w-4 h-4 text-white" />
						</div>
						<span className="text-sm font-medium">AI Recommendations</span>
					</div>
				</div>

				{isLoading ? (
					<Card>
						<CardContent className="p-12 text-center">
							<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
							</div>
							<h3 className="text-lg font-medium mb-2">
								Analyzing your issue...
							</h3>
							<p className="text-muted-foreground">
								Our AI is generating personalized recommendations
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-6">
						{/* Summary Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Target className="w-5 h-5" />
									<span>Impact Summary</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="text-center">
										<div className="text-3xl font-bold text-blue-600 mb-2">
											{recommendations.length}
										</div>
										<p className="text-sm text-muted-foreground">
											Recommendations
										</p>
									</div>
									<div className="text-center">
										<div className="text-3xl font-bold text-green-600 mb-2">
											{Math.round(
												recommendations.reduce(
													(sum, rec) => sum + rec.impact,
													0
												) / recommendations.length
											)}
											%
										</div>
										<p className="text-sm text-muted-foreground">
											Average Impact
										</p>
									</div>
									<div className="text-center">
										<div className="text-3xl font-bold text-primary mb-2">
											{recommendations.reduce((sum, rec) => {
												const time = parseInt(rec.estimatedTime.split("-")[0]);
												return sum + time;
											}, 0)}
											h
										</div>
										<p className="text-sm text-muted-foreground">Total Time</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Recommendations */}
						<div className="space-y-4">
							{recommendations.map((recommendation) => (
								<Card
									key={recommendation.id}
									className="border-l-4 border-l-blue-500"
								>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<CardTitle className="text-lg">
														{recommendation.title}
													</CardTitle>
													<Badge
														className={getPriorityColor(
															recommendation.priority
														)}
													>
														{recommendation.priority} priority
													</Badge>
												</div>
												<p className="text-muted-foreground">
													{recommendation.description}
												</p>
											</div>
											<div className="flex items-center space-x-2">
												{getStatusIcon(recommendation.status)}
												<span className="text-sm capitalize">
													{recommendation.status}
												</span>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<h4 className="font-medium mb-3">
													Implementation Steps
												</h4>
												<ol className="space-y-2">
													{recommendation.steps.map((step, index) => (
														<li
															key={index}
															className="flex items-start space-x-2"
														>
															<span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
																{index + 1}
															</span>
															<span className="text-sm">{step}</span>
														</li>
													))}
												</ol>
											</div>
											<div className="space-y-4">
												<div>
													<div className="flex justify-between text-sm mb-2">
														<span>Expected Impact</span>
														<span>{recommendation.impact}%</span>
													</div>
													<Progress
														value={recommendation.impact}
														className="h-2"
													/>
												</div>
												<div className="flex items-center space-x-2 text-sm text-muted-foreground">
													<Clock className="w-4 h-4" />
													<span>
														Estimated time: {recommendation.estimatedTime}
													</span>
												</div>
												<div className="flex space-x-2">
													{recommendation.status === "pending" && (
														<Button
															onClick={() => handleStartFix(recommendation.id)}
															className="bg-blue-600 hover:bg-blue-700"
														>
															<Play className="w-4 h-4 mr-2" />
															Start Fix
														</Button>
													)}
													{recommendation.status === "in-progress" && (
														<Button
															onClick={() =>
																handleCompleteFix(recommendation.id)
															}
															variant="outline"
														>
															<CheckCircle className="w-4 h-4 mr-2" />
															Mark Complete
														</Button>
													)}
													<Button variant="outline">
														<MessageSquare className="w-4 h-4 mr-2" />
														Ask AI
													</Button>
													<Button variant="outline">
														<FileText className="w-4 h-4 mr-2" />
														View Details
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						{/* Action Buttons */}
						<div className="flex justify-center space-x-4">
							<Link href="/chat">
								<Button className="bg-blue-600 hover:bg-blue-700">
									<MessageSquare className="w-4 h-4 mr-2" />
									Chat with AI Assistant
								</Button>
							</Link>
							<Link href="/dashboard">
								<Button variant="outline">
									<TrendingUp className="w-4 h-4 mr-2" />
									View Progress
								</Button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
