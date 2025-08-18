"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Activity, Search, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function BrandMonitorPage() {
	const [searchUrl, setSearchUrl] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const handleAnalyze = () => {
		if (!searchUrl) return;
		setIsAnalyzing(true);
		// Simulate analysis
		setTimeout(() => {
			setIsAnalyzing(false);
		}, 2000);
	};

	return (
		<DashboardLayout>
			{/* Analysis Input */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Analyze Your Brand</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex gap-4">
						<Input
							placeholder="Enter your website URL (e.g., example.com)"
							value={searchUrl}
							onChange={(e) => setSearchUrl(e.target.value)}
							className="flex-1"
						/>
						<Button
							onClick={handleAnalyze}
							disabled={!searchUrl || isAnalyzing}
							className="bg-blue-600 hover:bg-blue-700"
						>
							{isAnalyzing ? (
								<>
									<Activity className="mr-2 h-4 w-4 animate-spin" />
									Analyzing...
								</>
							) : (
								<>
									<Search className="mr-2 h-4 w-4" />
									Analyze
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Demo Results */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-green-600" />
							AI Visibility Score
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-green-600 mb-2">78/100</div>
						<p className="text-sm text-gray-600">
							Your brand appears in 78% of AI search results
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingDown className="h-5 w-5 text-red-600" />
							Competitor Analysis
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold text-red-600 mb-2">-12%</div>
						<p className="text-sm text-gray-600">
							Behind top competitor in AI visibility
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Platform Coverage</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span>ChatGPT</span>
								<span className="font-semibold">85%</span>
							</div>
							<div className="flex justify-between">
								<span>Claude</span>
								<span className="font-semibold">72%</span>
							</div>
							<div className="flex justify-between">
								<span>Gemini</span>
								<span className="font-semibold">68%</span>
							</div>
							<div className="flex justify-between">
								<span>Perplexity</span>
								<span className="font-semibold">89%</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="mt-8 text-center">
				<p className="text-gray-600 mb-4">
					Ready to dive deeper? Use the chat interface for detailed analysis.
				</p>
				<a
					href="/chat"
					className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
				>
					Start Chat Analysis
				</a>
			</div>
		</DashboardLayout>
	);
}
