"use client";

import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Textarea,
} from "@workspace/ui";
import {
	BarChart3,
	Bot,
	FileText,
	Menu,
	Search,
	Send,
	Share2,
	Sparkles,
	Target,
	X,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

export default function V2LandingPage() {
	const [chatQuery, setChatQuery] = useState("");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const router = useRouter();

	const handleChatSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (chatQuery.trim()) {
			// Navigate to chat with the query as a URL parameter
			router.push(`/v2/chat?q=${encodeURIComponent(chatQuery.trim())}`);
		}
	};

	const handleDashboardClick = (dashboardType: string, query: string) => {
		router.push(
			`/v2/chat?q=${encodeURIComponent(query)}&type=${dashboardType}`
		);
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Navigation Header */}
			<nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
				<div className="mx-auto max-w-7xl px-6">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<div className="flex items-center">
							<Link href="/v2" className="text-xl font-bold text-black">
								Fragment
							</Link>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-8">
							<Link
								href="#"
								className="text-gray-700 hover:text-orange-600 transition-colors"
							>
								Marketing
							</Link>
							<Link
								href="#"
								className="text-gray-700 hover:text-orange-600 transition-colors"
							>
								Integrations
							</Link>
							<Link
								href="#"
								className="text-gray-700 hover:text-orange-600 transition-colors"
							>
								Competitor Monitor
							</Link>
							<Link
								href="#"
								className="text-gray-700 hover:text-orange-600 transition-colors"
							>
								Social Automation
							</Link>
							<Link
								href="#"
								className="text-gray-700 hover:text-orange-600 transition-colors"
							>
								Affiliates
							</Link>
							<Link
								href="#"
								className="text-gray-700 hover:text-orange-600 transition-colors"
							>
								Docs & Support
							</Link>
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							>
								{mobileMenuOpen ? (
									<X className="h-5 w-5" />
								) : (
									<Menu className="h-5 w-5" />
								)}
							</Button>
						</div>
					</div>

					{/* Mobile Navigation */}
					{mobileMenuOpen && (
						<div className="md:hidden py-4 border-t border-gray-200">
							<div className="flex flex-col space-y-4">
								<Link
									href="#"
									className="text-gray-700 hover:text-orange-600 transition-colors"
								>
									Marketing
								</Link>
								<Link
									href="#"
									className="text-gray-700 hover:text-orange-600 transition-colors"
								>
									Integrations
								</Link>
								<Link
									href="#"
									className="text-gray-700 hover:text-orange-600 transition-colors"
								>
									Competitor Monitor
								</Link>
								<Link
									href="#"
									className="text-gray-700 hover:text-orange-600 transition-colors"
								>
									Social Automation
								</Link>
								<Link
									href="#"
									className="text-gray-700 hover:text-orange-600 transition-colors"
								>
									Affiliates
								</Link>
								<Link
									href="#"
									className="text-gray-700 hover:text-orange-600 transition-colors"
								>
									Docs & Support
								</Link>
							</div>
						</div>
					)}
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50 py-20 px-6">
				<div className="mx-auto max-w-7xl">
					<div className="text-center">
						<Badge
							variant="secondary"
							className="mb-6 bg-orange-50 text-orange-700 border-orange-200"
						>
							<Sparkles className="w-4 h-4 mr-2" />
							Fragment V2 - Now Available
						</Badge>

						<h1 className="text-5xl font-bold tracking-tight text-black mb-6">
							AI-Powered Brand
							<span className="text-orange-500 block">
								Visibility Intelligence
							</span>
						</h1>

						{/* Chat Input */}
						<div className="max-w-2xl mx-auto mb-8 px-4 sm:px-6">
							<form onSubmit={handleChatSubmit} className="relative">
								<Textarea
									placeholder="Ask about your brand's AI visibility... (e.g., 'How does my brand appear in AI search results?')"
									value={chatQuery}
									onChange={(e) => setChatQuery(e.target.value)}
									className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-orange-500 focus:ring-2 pr-16 sm:pr-20 shadow-sm hover:shadow-md transition-all duration-200 min-h-[44px] max-h-[200px] resize-none"
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											handleChatSubmit(e);
										}
									}}
								/>
								<Button
									type="submit"
									size="sm"
									className="absolute right-2 sm:right-3 top-3 sm:top-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg sm:rounded-xl px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
									disabled={!chatQuery.trim()}
								>
									<Send className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
									<span className="hidden sm:inline">Ask</span>
								</Button>
							</form>
							<p className="text-sm sm:text-base text-gray-500 mt-4 text-center px-2">
								Start a conversation to analyze your brand's AI presence
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-20 px-6 bg-white">
				<div className="mx-auto max-w-7xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-black mb-4">
							Everything you need to understand your AI presence
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							Comprehensive tools and insights to monitor, analyze, and optimize
							how AI systems perceive and represent your brand.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Brand Visibility Dashboard */}
						<Card
							className="border-gray-200 hover:border-orange-200 transition-colors cursor-pointer hover:shadow-lg"
							onClick={() =>
								handleDashboardClick(
									"brand-visibility",
									"Create a comprehensive brand visibility dashboard showing how my brand appears across different AI models and search results"
								)
							}
						>
							<CardHeader>
								<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
									<Search className="h-6 w-6 text-orange-600" />
								</div>
								<CardTitle className="text-xl text-black">
									Brand Visibility Dashboard
								</CardTitle>
								<CardDescription className="text-gray-600">
									Monitor how your brand appears across AI models, search
									engines, and digital platforms in real-time
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									variant="ghost"
									className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0"
								>
									Create Dashboard →
								</Button>
							</CardContent>
						</Card>

						{/* Competitor Analysis Dashboard */}
						<Card
							className="border-gray-200 hover:border-orange-200 transition-colors cursor-pointer hover:shadow-lg"
							onClick={() =>
								handleDashboardClick(
									"competitor-analysis",
									"Build a competitor analysis dashboard comparing my brand against top competitors in AI search results and visibility metrics"
								)
							}
						>
							<CardHeader>
								<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
									<Target className="h-6 w-6 text-orange-600" />
								</div>
								<CardTitle className="text-xl text-black">
									Competitor Analysis Dashboard
								</CardTitle>
								<CardDescription className="text-gray-600">
									Compare your AI presence against competitors with side-by-side
									metrics and insights
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									variant="ghost"
									className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0"
								>
									Create Dashboard →
								</Button>
							</CardContent>
						</Card>

						{/* Performance Tracking Dashboard */}
						<Card
							className="border-gray-200 hover:border-orange-200 transition-colors cursor-pointer hover:shadow-lg"
							onClick={() =>
								handleDashboardClick(
									"performance-tracking",
									"Set up a performance tracking dashboard to monitor my brand sentiment, mention frequency, and AI model rankings over time"
								)
							}
						>
							<CardHeader>
								<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
									<BarChart3 className="h-6 w-6 text-orange-600" />
								</div>
								<CardTitle className="text-xl text-black">
									Performance Tracking Dashboard
								</CardTitle>
								<CardDescription className="text-gray-600">
									Track brand sentiment, mention frequency, and ranking changes
									across AI platforms
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									variant="ghost"
									className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0"
								>
									Create Dashboard →
								</Button>
							</CardContent>
						</Card>

						{/* AI Model Monitoring Dashboard */}
						<Card
							className="border-gray-200 hover:border-orange-200 transition-colors cursor-pointer hover:shadow-lg"
							onClick={() =>
								handleDashboardClick(
									"ai-model-monitoring",
									"Create an AI model monitoring dashboard to track how different AI systems like ChatGPT, Claude, and Gemini respond to queries about my brand"
								)
							}
						>
							<CardHeader>
								<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
									<Bot className="h-6 w-6 text-orange-600" />
								</div>
								<CardTitle className="text-xl text-black">
									AI Model Monitoring Dashboard
								</CardTitle>
								<CardDescription className="text-gray-600">
									Track responses across ChatGPT, Claude, Gemini, and other AI
									models for brand consistency
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									variant="ghost"
									className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0"
								>
									Create Dashboard →
								</Button>
							</CardContent>
						</Card>

						{/* Content Strategy Dashboard */}
						<Card
							className="border-gray-200 hover:border-orange-200 transition-colors cursor-pointer hover:shadow-lg"
							onClick={() =>
								handleDashboardClick(
									"content-strategy",
									"Build a content strategy dashboard to optimize my content for better AI visibility and search rankings"
								)
							}
						>
							<CardHeader>
								<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
									<FileText className="h-6 w-6 text-orange-600" />
								</div>
								<CardTitle className="text-xl text-black">
									Content Strategy Dashboard
								</CardTitle>
								<CardDescription className="text-gray-600">
									Optimize your content strategy for better AI visibility and
									search performance
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									variant="ghost"
									className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0"
								>
									Create Dashboard →
								</Button>
							</CardContent>
						</Card>

						{/* Social Media AI Dashboard */}
						<Card
							className="border-gray-200 hover:border-orange-200 transition-colors cursor-pointer hover:shadow-lg"
							onClick={() =>
								handleDashboardClick(
									"social-media-ai",
									"Set up a social media AI dashboard to monitor how AI tools summarize and reference my social media presence"
								)
							}
						>
							<CardHeader>
								<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
									<Share2 className="h-6 w-6 text-orange-600" />
								</div>
								<CardTitle className="text-xl text-black">
									Social Media AI Dashboard
								</CardTitle>
								<CardDescription className="text-gray-600">
									Monitor how AI systems interpret and summarize your social
									media presence
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									variant="ghost"
									className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0"
								>
									Create Dashboard →
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-6 bg-gray-50">
				<div className="mx-auto max-w-4xl text-center">
					<h2 className="text-3xl font-bold text-black mb-6">
						Ready to understand your AI presence?
					</h2>
					<p className="text-lg text-gray-600 mb-8">
						Join thousands of brands already using Fragment to monitor and
						optimize their AI visibility across the digital landscape.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/v2/chat">
							<Button
								size="lg"
								className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
							>
								<Zap className="mr-2 h-5 w-5" />
								Start Free Analysis
							</Button>
						</Link>

						<Button
							variant="outline"
							size="lg"
							className="border-gray-300 text-gray-700 hover:bg-white"
						>
							Schedule Demo
						</Button>
					</div>
				</div>
			</section>

			{/* Loading Suspense Fallback */}
			<Suspense
				fallback={
					<div className="flex items-center justify-center min-h-screen">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
					</div>
				}
			>
				{/* Any async components would go here */}
			</Suspense>
		</div>
	);
}
