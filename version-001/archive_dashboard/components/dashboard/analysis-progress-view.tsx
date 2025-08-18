"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Badge } from "@workspace/ui/components/badge";
import { 
	Brain, 
	Target, 
	TrendingUp, 
	Users, 
	Search, 
	Globe, 
	CheckCircle,
	Loader2,
	Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";

interface AnalysisStep {
	id: string;
	title: string;
	description: string;
	icon: any;
	completed: boolean;
	inProgress: boolean;
	progress?: number;
}

interface AnalysisProgressViewProps {
	jobId: string;
	onComplete: (result: any) => void;
}

export function AnalysisProgressView({ jobId, onComplete }: AnalysisProgressViewProps) {
	const [progress, setProgress] = useState(0);
	const [currentStage, setCurrentStage] = useState("Initializing");
	const [steps, setSteps] = useState<AnalysisStep[]>([
		{
			id: "brand-discovery",
			title: "Brand Discovery",
			description: "Analyzing your brand voice and market position",
			icon: Brain,
			completed: false,
			inProgress: false,
		},
		{
			id: "competitor-research",
			title: "Competitor Research",
			description: "Finding and analyzing key competitors across 200+ AI endpoints",
			icon: Target,
			completed: false,
			inProgress: false,
		},
		{
			id: "visibility-scan",
			title: "Visibility Scanning",
			description: "Scanning your brand presence across ChatGPT, Claude, Perplexity",
			icon: Search,
			completed: false,
			inProgress: false,
		},
		{
			id: "trend-analysis",
			title: "Trend Analysis",
			description: "Analyzing trending topics and content opportunities",
			icon: TrendingUp,
			completed: false,
			inProgress: false,
		},
		{
			id: "audience-insights",
			title: "Audience Insights",
			description: "Understanding your target audience and preferences",
			icon: Users,
			completed: false,
			inProgress: false,
		},
		{
			id: "report-generation",
			title: "Report Generation",
			description: "Compiling insights and generating your dashboard",
			icon: Globe,
			completed: false,
			inProgress: false,
		},
	]);

	useEffect(() => {
		const eventSource = new EventSource(`/api/agent-status/${jobId}`);
		
		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				console.log("📡 Analysis Progress:", data);

				if (data.progress !== undefined) {
					setProgress(data.progress);
					
					// Update current step based on progress
					const stepIndex = Math.floor((data.progress / 100) * steps.length);
					setSteps((prev) =>
						prev.map((step, index) => ({
							...step,
							inProgress: index === stepIndex && data.progress < 100,
							completed: index < stepIndex || data.progress === 100,
							progress: index === stepIndex ? (data.progress % (100 / steps.length)) * (steps.length) : undefined,
						}))
					);
				}

				if (data.stage) {
					setCurrentStage(data.stage);
				}

				if (data.status === "completed") {
					eventSource.close();
					// Mark all steps as completed
					setSteps((prev) => prev.map(step => ({ ...step, completed: true, inProgress: false })));
					setProgress(100);
					
					// Wait a moment to show completion, then call onComplete
					setTimeout(() => {
						onComplete(data.result);
					}, 2000);
				}

				if (data.status === "failed") {
					eventSource.close();
					console.error("Analysis failed:", data.error);
					// Handle error state
				}
			} catch (error) {
				console.error("Error parsing SSE data:", error);
			}
		};

		eventSource.onerror = (error) => {
			console.error("SSE Error:", error);
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	}, [jobId, onComplete, steps.length]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
			<div className="max-w-4xl w-full space-y-8">
				{/* Header */}
				<div className="text-center space-y-4">
					<div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
						<Sparkles className="w-10 h-10 text-white" />
					</div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						Analyzing Your Brand
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Our AI agents are working hard to analyze your brand across 200+ AI platforms and generate comprehensive insights.
					</p>
				</div>

				{/* Overall Progress */}
				<Card className="border-0 shadow-xl">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span>Analysis Progress</span>
							<Badge variant="secondary" className="text-lg px-3 py-1">
								{Math.round(progress)}%
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Progress value={progress} className="h-3" />
						<p className="text-center text-muted-foreground">
							Current Stage: <span className="font-medium text-foreground">{currentStage}</span>
						</p>
					</CardContent>
				</Card>

				{/* Analysis Steps */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<Card 
								key={step.id} 
								className={`border-0 shadow-lg transition-all duration-500 ${
									step.completed 
										? "bg-gradient-to-br from-green-50 to-green-100 border-green-200" 
										: step.inProgress 
										? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 scale-105" 
										: "bg-white"
								}`}
							>
								<CardContent className="p-6">
									<div className="flex items-start space-x-4">
										<div className={`p-3 rounded-full ${
											step.completed 
												? "bg-green-500" 
												: step.inProgress 
												? "bg-blue-500" 
												: "bg-gray-200"
										}`}>
											{step.completed ? (
												<CheckCircle className="w-6 h-6 text-white" />
											) : step.inProgress ? (
												<Loader2 className="w-6 h-6 text-white animate-spin" />
											) : (
												<Icon className="w-6 h-6 text-gray-500" />
											)}
										</div>
										<div className="flex-1 space-y-2">
											<h3 className="font-semibold text-lg">{step.title}</h3>
											<p className="text-sm text-muted-foreground">{step.description}</p>
											{step.inProgress && step.progress !== undefined && (
												<Progress value={step.progress} className="h-2" />
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Fun Facts */}
				<Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-blue-50">
					<CardContent className="p-6 text-center">
						<h3 className="text-lg font-semibold mb-2">Did you know?</h3>
						<p className="text-muted-foreground">
							We're analyzing your brand across ChatGPT, Claude, Perplexity, and 197 other AI platforms 
							to give you the most comprehensive view of your AI search visibility.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
