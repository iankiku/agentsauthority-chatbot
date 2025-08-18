"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import {
	Brain,
	Copy,
	Download,
	Instagram,
	Linkedin,
	MessageSquare,
	Plus,
	Search,
	Settings,
	Share2,
	Sparkles,
	Star,
	Target,
	Twitter,
	Youtube,
	Zap,
} from "lucide-react";
import { useState } from "react";

interface ModelResult {
	model: string;
	response: string;
	score: number;
	keywords: string[];
	brandMentions: number;
	sentiment: "positive" | "neutral" | "negative";
	responseTime: number;
	isGenerating: boolean;
}

interface PromptTemplate {
	id: string;
	name: string;
	prompt: string;
	category: string;
	avgScore: number;
	usageCount: number;
	lastUsed: string;
}

interface ContentTemplate {
	id: string;
	name: string;
	type: "twitter" | "linkedin" | "video" | "instagram";
	description: string;
	icon: React.ReactNode;
	color: string;
}

export default function PromptAnalysisPage() {
	const [prompt, setPrompt] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [results, setResults] = useState<ModelResult[]>([]);
	const [selectedPrompt, setSelectedPrompt] = useState("");
	const [contentInput, setContentInput] = useState("");
	const [isGeneratingContent, setIsGeneratingContent] = useState(false);
	const [generatedContent, setGeneratedContent] = useState<any>(null);

	// Mock AI models
	const models = [
		{ name: "ChatGPT", icon: Brain, color: "text-green-600" },
		{ name: "Claude", icon: MessageSquare, color: "text-blue-600" },
		{ name: "Gemini", icon: Sparkles, color: "text-purple-600" },
		{ name: "Perplexity", icon: Search, color: "text-orange-600" },
	];

	// Mock prompt templates
	const promptTemplates: PromptTemplate[] = [
		{
			id: "1",
			name: "Brand Visibility Analysis",
			prompt:
				"Analyze the visibility of [BRAND] in AI search results and provide recommendations for improvement",
			category: "Analysis",
			avgScore: 8.5,
			usageCount: 127,
			lastUsed: "2 hours ago",
		},
		{
			id: "2",
			name: "Competitor Comparison",
			prompt:
				"Compare [BRAND] with [COMPETITOR] in terms of AI search visibility and market positioning",
			category: "Comparison",
			avgScore: 7.8,
			usageCount: 89,
			lastUsed: "1 day ago",
		},
		{
			id: "3",
			name: "Content Optimization",
			prompt:
				"Suggest content optimization strategies for [BRAND] to improve AI search visibility",
			category: "Optimization",
			avgScore: 9.2,
			usageCount: 156,
			lastUsed: "3 hours ago",
		},
	];

	// Content generation templates
	const contentTemplates: ContentTemplate[] = [
		{
			id: "1",
			name: "Twitter Thread",
			type: "twitter",
			description: "Transform your content into an engaging Twitter thread",
			icon: <Twitter className="w-5 h-5" />,
			color: "bg-blue-500",
		},
		{
			id: "2",
			name: "LinkedIn Post",
			type: "linkedin",
			description: "Create professional LinkedIn content",
			icon: <Linkedin className="w-5 h-5" />,
			color: "bg-blue-600",
		},
		{
			id: "3",
			name: "Video Script",
			type: "video",
			description: "Generate video content scripts",
			icon: <Youtube className="w-5 h-5" />,
			color: "bg-red-500",
		},
		{
			id: "4",
			name: "Instagram Post",
			type: "instagram",
			description: "Create Instagram-friendly content",
			icon: <Instagram className="w-5 h-5" />,
			color: "bg-pink-500",
		},
	];

	const handleAnalyzePrompt = async () => {
		if (!prompt.trim()) return;

		setIsAnalyzing(true);
		setResults([]);

		// Simulate API calls to different models
		const mockResults: ModelResult[] = models.map((model, index) => ({
			model: model.name,
			response: "",
			score: 0,
			keywords: [],
			brandMentions: 0,
			sentiment: "neutral" as const,
			responseTime: 0,
			isGenerating: true,
		}));

		setResults(mockResults);

		// Simulate sequential responses
		for (let i = 0; i < models.length; i++) {
			await new Promise((resolve) =>
				setTimeout(resolve, 1000 + Math.random() * 2000)
			);

			const mockResponse = `Based on the prompt "${prompt}", here's my analysis for ${models[i].name}:

${models[i].name} provides comprehensive insights into brand visibility optimization. The analysis shows strong potential for improvement in AI search rankings through strategic content optimization and technical SEO enhancements.

Key recommendations include:
- Optimize content structure for AI algorithms
- Enhance keyword targeting and semantic relevance
- Improve technical SEO factors
- Monitor competitor strategies and adapt accordingly

This approach should significantly improve your brand's visibility across AI platforms.`;

			const mockKeywords = [
				"brand visibility",
				"AI optimization",
				"content strategy",
				"SEO",
				"competitor analysis",
			];
			const mockScore = 7.5 + Math.random() * 2.5;
			const mockBrandMentions = Math.floor(Math.random() * 5) + 1;
			const mockSentiment = ["positive", "neutral", "positive"][
				Math.floor(Math.random() * 3)
			] as const;
			const mockResponseTime = 1000 + Math.random() * 2000;

			setResults((prev) =>
				prev.map((result, idx) =>
					idx === i
						? {
								...result,
								response: mockResponse,
								score: mockScore,
								keywords: mockKeywords,
								brandMentions: mockBrandMentions,
								sentiment: mockSentiment,
								responseTime: mockResponseTime,
								isGenerating: false,
							}
						: result
				)
			);
		}

		setIsAnalyzing(false);
	};

	const handleGenerateContent = async (template: ContentTemplate) => {
		if (!contentInput.trim()) return;

		setIsGeneratingContent(true);

		// Simulate content generation
		await new Promise((resolve) => setTimeout(resolve, 2000));

		const mockGeneratedContent = {
			type: template.type,
			content: `Generated ${template.name} content based on: "${contentInput}"

🎯 Key Points:
• Optimized for ${template.type} platform
• Engaging and shareable content
• Brand-consistent messaging
• Call-to-action included

📊 Performance Metrics:
• Estimated reach: 10K-50K
• Engagement rate: 3.5%
• Click-through rate: 2.1%`,
			timestamp: new Date().toISOString(),
		};

		setGeneratedContent(mockGeneratedContent);
		setIsGeneratingContent(false);
	};

	const handlePostToSocial = (platform: string) => {
		console.log(`Posting to ${platform}...`);
		// Implement actual social media posting
	};

	const getSentimentColor = (sentiment: string) => {
		switch (sentiment) {
			case "positive":
				return "text-green-600";
			case "negative":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	return (
		<DashboardLayout>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">
							Prompt Analysis & Content Generation
						</h1>
						<p className="text-muted-foreground">
							Test prompts across AI models and generate content instantly
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
							<Sparkles className="w-4 h-4 text-white" />
						</div>
						<span className="text-sm font-medium">AI-Powered</span>
					</div>
				</div>

				<Tabs defaultValue="prompt-analysis" className="space-y-6">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="prompt-analysis">Prompt Analysis</TabsTrigger>
						<TabsTrigger value="content-generation">
							Content Generation
						</TabsTrigger>
					</TabsList>

					<TabsContent value="prompt-analysis" className="space-y-6">
						{/* Prompt Input */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Target className="w-5 h-5" />
									<span>Test Your Prompt</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Enter your prompt to test across AI models
									</label>
									<Textarea
										placeholder="e.g., Analyze the visibility of my brand 'TechCorp' in AI search results and provide recommendations for improvement..."
										value={prompt}
										onChange={(e) => setPrompt(e.target.value)}
										className="min-h-[100px]"
									/>
								</div>
								<div className="flex items-center space-x-4">
									<Button
										onClick={handleAnalyzePrompt}
										disabled={!prompt.trim() || isAnalyzing}
										className="bg-blue-600 hover:bg-blue-700"
									>
										{isAnalyzing ? (
											<>
												<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
												Analyzing...
											</>
										) : (
											<>
												<Search className="w-4 h-4 mr-2" />
												Test Prompt
											</>
										)}
									</Button>
									<Button variant="outline">
										<Settings className="w-4 h-4 mr-2" />
										Advanced Settings
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Model Results */}
						{results.length > 0 && (
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{results.map((result, index) => (
									<Card key={index} className="relative">
										<CardHeader>
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-2">
													<div
														className={`w-8 h-8 rounded-lg flex items-center justify-center ${
															models
																.find((m) => m.name === result.model)
																?.color.replace("text-", "bg-") + "/10"
														}`}
													>
														{React.createElement(
															models.find((m) => m.name === result.model)
																?.icon || Brain,
															{
																className: `w-4 h-4 ${models.find((m) => m.name === result.model)?.color}`,
															}
														)}
													</div>
													<CardTitle className="text-lg">
														{result.model}
													</CardTitle>
												</div>
												<div className="flex items-center space-x-2">
													{result.isGenerating ? (
														<div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
													) : (
														<div className="flex items-center space-x-1">
															<Star className="w-4 h-4 text-yellow-500 fill-current" />
															<span className="font-semibold">
																{result.score.toFixed(1)}
															</span>
														</div>
													)}
												</div>
											</div>
										</CardHeader>
										<CardContent className="space-y-4">
											{result.isGenerating ? (
												<div className="space-y-2">
													<div className="h-4 bg-gray-200 rounded animate-pulse" />
													<div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
													<div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
												</div>
											) : (
												<>
													<div className="space-y-2">
														<div className="flex items-center justify-between text-sm">
															<span>Response Time</span>
															<span className="font-medium">
																{result.responseTime}ms
															</span>
														</div>
														<div className="flex items-center justify-between text-sm">
															<span>Brand Mentions</span>
															<span className="font-medium">
																{result.brandMentions}
															</span>
														</div>
														<div className="flex items-center justify-between text-sm">
															<span>Sentiment</span>
															<span
																className={`font-medium ${getSentimentColor(result.sentiment)}`}
															>
																{result.sentiment}
															</span>
														</div>
													</div>

													<div className="space-y-2">
														<label className="text-sm font-medium">
															Keywords Detected
														</label>
														<div className="flex flex-wrap gap-1">
															{result.keywords.map((keyword, idx) => (
																<Badge
																	key={idx}
																	variant="secondary"
																	className="text-xs"
																>
																	{keyword}
																</Badge>
															))}
														</div>
													</div>

													<div className="space-y-2">
														<label className="text-sm font-medium">
															Response
														</label>
														<div className="p-3 bg-gray-50 rounded-lg text-sm max-h-32 overflow-y-auto">
															{result.response}
														</div>
													</div>

													<div className="flex items-center space-x-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																console.log(
																	`Explaining ${result.model} response`
																)
															}
														>
															<MessageSquare className="w-3 h-3 mr-1" />
															Explain
														</Button>
														<Button variant="outline" size="sm">
															<Settings className="w-3 h-3 mr-1" />
															Optimize
														</Button>
														<Button variant="outline" size="sm">
															<Copy className="w-3 h-3 mr-1" />
															Copy
														</Button>
													</div>
												</>
											)}
										</CardContent>
									</Card>
								))}
							</div>
						)}

						{/* Prompt Templates */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Zap className="w-5 h-5" />
									<span>Prompt Templates</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{promptTemplates.map((template) => (
										<Card
											key={template.id}
											className="cursor-pointer hover:shadow-md transition-shadow"
										>
											<CardContent className="p-4">
												<div className="space-y-3">
													<div className="flex items-center justify-between">
														<h4 className="font-medium">{template.name}</h4>
														<Badge variant="outline" className="text-xs">
															{template.category}
														</Badge>
													</div>
													<p className="text-sm text-muted-foreground line-clamp-2">
														{template.prompt}
													</p>
													<div className="flex items-center justify-between text-xs text-muted-foreground">
														<div className="flex items-center space-x-1">
															<Star className="w-3 h-3 text-yellow-500 fill-current" />
															<span>{template.avgScore.toFixed(1)}</span>
														</div>
														<span>{template.usageCount} uses</span>
													</div>
													<Button
														variant="outline"
														size="sm"
														className="w-full"
														onClick={() => setPrompt(template.prompt)}
													>
														Use Template
													</Button>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="content-generation" className="space-y-6">
						{/* Content Input */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Share2 className="w-5 h-5" />
									<span>Generate Content</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<label className="text-sm font-medium">
										Enter your content or topic
									</label>
									<Textarea
										placeholder="e.g., Our new AI-powered marketing tool helps businesses improve their search visibility..."
										value={contentInput}
										onChange={(e) => setContentInput(e.target.value)}
										className="min-h-[100px]"
									/>
								</div>
							</CardContent>
						</Card>

						{/* Content Templates */}
						<Card>
							<CardHeader>
								<CardTitle>Choose Content Type</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									{contentTemplates.map((template) => (
										<Card
											key={template.id}
											className="cursor-pointer hover:shadow-md transition-shadow"
											onClick={() => handleGenerateContent(template)}
										>
											<CardContent className="p-4 text-center space-y-3">
												<div
													className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center mx-auto`}
												>
													{template.icon}
												</div>
												<div>
													<h4 className="font-medium">{template.name}</h4>
													<p className="text-sm text-muted-foreground">
														{template.description}
													</p>
												</div>
												<Button
													variant="outline"
													size="sm"
													className="w-full"
													disabled={!contentInput.trim() || isGeneratingContent}
												>
													{isGeneratingContent ? (
														<>
															<div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-1" />
															Generating...
														</>
													) : (
														<>
															<Plus className="w-3 h-3 mr-1" />
															Generate
														</>
													)}
												</Button>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Generated Content */}
						{generatedContent && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Generated Content</span>
										<div className="flex items-center space-x-2">
											<Button variant="outline" size="sm">
												<Download className="w-3 h-3 mr-1" />
												Export
											</Button>
											<Button variant="outline" size="sm">
												<Copy className="w-3 h-3 mr-1" />
												Copy
											</Button>
										</div>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="p-4 bg-gray-50 rounded-lg">
										<pre className="whitespace-pre-wrap text-sm">
											{generatedContent.content}
										</pre>
									</div>

									<div className="flex items-center space-x-4">
										<Button
											onClick={() => handlePostToSocial("twitter")}
											className="bg-blue-400 hover:bg-blue-500"
										>
											<Twitter className="w-4 h-4 mr-2" />
											Post to Twitter
										</Button>
										<Button
											onClick={() => handlePostToSocial("linkedin")}
											className="bg-blue-600 hover:bg-blue-700"
										>
											<Linkedin className="w-4 h-4 mr-2" />
											Post to LinkedIn
										</Button>
										<Button
											onClick={() => handlePostToSocial("instagram")}
											className="bg-pink-500 hover:bg-pink-600"
										>
											<Instagram className="w-4 h-4 mr-2" />
											Post to Instagram
										</Button>
									</div>
								</CardContent>
							</Card>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</DashboardLayout>
	);
}
