"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { 
	CheckCircle, 
	Sparkles, 
	TrendingUp, 
	Target, 
	Users, 
	ArrowRight,
	BarChart3,
	Eye,
	Zap
} from "lucide-react";
import { useState } from "react";

interface AnalysisData {
	userId: string;
	token: string;
	jobId: string;
	result?: any;
}

interface WelcomeFlowProps {
	analysisData: AnalysisData | null;
	onComplete: () => void;
}

export function WelcomeFlow({ analysisData, onComplete }: WelcomeFlowProps) {
	const [currentStep, setCurrentStep] = useState(0);

	const welcomeSteps = [
		{
			title: "Welcome to Agents Authority! 🎉",
			subtitle: "Your analysis is complete",
			content: (
				<div className="space-y-6">
					<div className="text-center">
						<div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<CheckCircle className="w-12 h-12 text-white" />
						</div>
						<h2 className="text-2xl font-bold mb-4">Analysis Complete!</h2>
						<p className="text-muted-foreground text-lg">
							We've successfully analyzed your brand across 200+ AI platforms and generated comprehensive insights.
						</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card className="border-green-200 bg-green-50">
							<CardContent className="p-4 text-center">
								<BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
								<h3 className="font-semibold">GEO Score</h3>
								<p className="text-2xl font-bold text-green-600">73%</p>
							</CardContent>
						</Card>
						<Card className="border-blue-200 bg-blue-50">
							<CardContent className="p-4 text-center">
								<Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
								<h3 className="font-semibold">Visibility</h3>
								<p className="text-2xl font-bold text-blue-600">68%</p>
							</CardContent>
						</Card>
						<Card className="border-purple-200 bg-purple-50">
							<CardContent className="p-4 text-center">
								<Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
								<h3 className="font-semibold">Competitors</h3>
								<p className="text-2xl font-bold text-purple-600">5</p>
							</CardContent>
						</Card>
					</div>
				</div>
			),
		},
		{
			title: "Your Dashboard Features",
			subtitle: "Everything you need to dominate AI search",
			content: (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card className="border-0 shadow-lg">
							<CardContent className="p-6">
								<div className="flex items-start space-x-4">
									<div className="p-3 bg-blue-100 rounded-full">
										<TrendingUp className="w-6 h-6 text-blue-600" />
									</div>
									<div>
										<h3 className="font-semibold text-lg mb-2">Real-time Monitoring</h3>
										<p className="text-muted-foreground">
											Track your brand visibility across ChatGPT, Claude, Perplexity, and 197 other AI platforms in real-time.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="border-0 shadow-lg">
							<CardContent className="p-6">
								<div className="flex items-start space-x-4">
									<div className="p-3 bg-green-100 rounded-full">
										<Target className="w-6 h-6 text-green-600" />
									</div>
									<div>
										<h3 className="font-semibold text-lg mb-2">Competitor Analysis</h3>
										<p className="text-muted-foreground">
											See how you stack up against competitors and identify opportunities to outrank them.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="border-0 shadow-lg">
							<CardContent className="p-6">
								<div className="flex items-start space-x-4">
									<div className="p-3 bg-purple-100 rounded-full">
										<Users className="w-6 h-6 text-purple-600" />
									</div>
									<div>
										<h3 className="font-semibold text-lg mb-2">Audience Insights</h3>
										<p className="text-muted-foreground">
											Understand what your audience is asking AI about your industry and brand.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="border-0 shadow-lg">
							<CardContent className="p-6">
								<div className="flex items-start space-x-4">
									<div className="p-3 bg-orange-100 rounded-full">
										<Zap className="w-6 h-6 text-orange-600" />
									</div>
									<div>
										<h3 className="font-semibold text-lg mb-2">AI-Powered Recommendations</h3>
										<p className="text-muted-foreground">
											Get actionable recommendations to improve your AI search rankings and visibility.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			),
		},
		{
			title: "Ready to Explore?",
			subtitle: "Let's dive into your dashboard",
			content: (
				<div className="space-y-6 text-center">
					<div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
						<Sparkles className="w-10 h-10 text-white" />
					</div>
					<h2 className="text-2xl font-bold">You're All Set!</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Your dashboard is ready with all your brand insights, competitor analysis, and AI visibility data. 
						Start exploring to discover opportunities to dominate AI search results.
					</p>
					
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
						<h3 className="font-semibold mb-2">🎯 Quick Start Tips:</h3>
						<ul className="text-left space-y-2 text-muted-foreground">
							<li>• Check your GEO Score to see how you rank</li>
							<li>• Review competitor analysis for opportunities</li>
							<li>• Explore platform-specific insights</li>
							<li>• Set up monitoring alerts for your brand</li>
						</ul>
					</div>
				</div>
			),
		},
	];

	const currentWelcomeStep = welcomeSteps[currentStep];

	const handleNext = () => {
		if (currentStep < welcomeSteps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			onComplete();
		}
	};

	const handleSkip = () => {
		onComplete();
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
			<div className="max-w-4xl w-full">
				<Card className="border-0 shadow-2xl">
					<CardHeader className="text-center pb-6">
						<div className="flex items-center justify-center space-x-2 mb-4">
							{welcomeSteps.map((_, index) => (
								<div
									key={index}
									className={`w-3 h-3 rounded-full transition-all duration-300 ${
										index <= currentStep 
											? "bg-blue-500" 
											: "bg-gray-200"
									}`}
								/>
							))}
						</div>
						<CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							{currentWelcomeStep.title}
						</CardTitle>
						<p className="text-xl text-muted-foreground">
							{currentWelcomeStep.subtitle}
						</p>
					</CardHeader>
					<CardContent className="px-8 pb-8">
						{currentWelcomeStep.content}
						
						<div className="flex items-center justify-between mt-8 pt-6 border-t">
							<Button 
								variant="ghost" 
								onClick={handleSkip}
								className="text-muted-foreground"
							>
								Skip Tour
							</Button>
							<Button 
								onClick={handleNext}
								className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
							>
								{currentStep < welcomeSteps.length - 1 ? (
									<>
										Next
										<ArrowRight className="w-4 h-4 ml-2" />
									</>
								) : (
									<>
										Enter Dashboard
										<Sparkles className="w-4 h-4 ml-2" />
									</>
								)}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
