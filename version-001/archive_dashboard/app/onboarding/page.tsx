"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Progress } from "@workspace/ui/components/progress";
import {
	ArrowLeft,
	ArrowRight,
	Brain,
	Check,
	Sparkles,
	Target,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const onboardingSteps = ["Welcome", "Your Brand", "Competitors", "Goals"];

export default function OnboardingPage() {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		website: "",
		email: "",
		industry: "",
		companySize: "",
		competitors: ["", "", ""] as string[],
		goals: [] as string[],
	});

	// Check for analysis completion from URL params
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const analysis = urlParams.get("analysis");
		const url = urlParams.get("url");
		const email = urlParams.get("email");

		if (analysis === "complete" && url) {
			setFormData((prev) => ({
				...prev,
				website: url,
				email: email || "",
			}));
		}
	}, []);

	const progress = (currentStep / onboardingSteps.length) * 100;

	const handleNext = () => {
		if (currentStep < onboardingSteps.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="text-center space-y-6">
						<div className="space-y-4">
							<div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
								<Sparkles className="w-8 h-8 text-primary-foreground" />
							</div>
							<h2 className="text-3xl font-bold text-foreground">
								Welcome to Agents Authority
							</h2>
							{formData.website && (
								<div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
									<div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
										<Check className="w-5 h-5" />
										<span className="font-medium">
											Analysis Complete for {formData.website}
										</span>
									</div>
									<p className="text-green-600/80 dark:text-green-400/80 text-sm mt-1">
										Your AI visibility analysis is ready. Let's set up your
										account.
									</p>
								</div>
							)}
							<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
								Let's get your brand optimized for AI search. This quick setup
								will help us personalize your experience and provide the most
								relevant insights.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
							<div className="text-center">
								<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
									<Brain className="w-6 h-6 text-primary" />
								</div>
								<h3 className="font-semibold text-foreground mb-2">
									AI Search Optimization
								</h3>
								<p className="text-muted-foreground text-sm">
									Optimize for ChatGPT, Claude, Gemini & Perplexity
								</p>
							</div>
							<div className="text-center">
								<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
									<TrendingUp className="w-6 h-6 text-primary" />
								</div>
								<h3 className="font-semibold text-foreground mb-2">
									Performance Tracking
								</h3>
								<p className="text-muted-foreground text-sm">
									Monitor your AI visibility scores
								</p>
							</div>
							<div className="text-center">
								<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
									<Target className="w-6 h-6 text-primary" />
								</div>
								<h3 className="font-semibold text-foreground mb-2">
									Smart Insights
								</h3>
								<p className="text-muted-foreground text-sm">
									Get actionable optimization recommendations
								</p>
							</div>
						</div>
					</div>
				);

			case 2:
				return (
					<div className="space-y-6">
						<div className="text-center mb-8">
							<h2 className="text-2xl font-bold text-foreground mb-2">
								Tell us about your brand
							</h2>
							<p className="text-muted-foreground">
								Help us understand your business better
							</p>
						</div>

						<div className="space-y-4">
							<div>
								<Label htmlFor="website" className="text-foreground">
									Website URL
								</Label>
								<Input
									id="website"
									type="url"
									placeholder="https://yourwebsite.com"
									value={formData.website}
									onChange={(e) =>
										setFormData({ ...formData, website: e.target.value })
									}
									className="bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary"
								/>
							</div>

							<div>
								<Label htmlFor="email" className="text-foreground">
									Email Address
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="your@email.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									className="bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary"
								/>
							</div>

							<div>
								<Label htmlFor="industry" className="text-foreground">
									Industry
								</Label>
								<select
									id="industry"
									value={formData.industry}
									onChange={(e) =>
										setFormData({ ...formData, industry: e.target.value })
									}
									className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2 focus:border-primary focus:outline-none"
									aria-label="Select your industry"
								>
									<option value="">Select your industry</option>
									<option value="technology">Technology</option>
									<option value="healthcare">Healthcare</option>
									<option value="finance">Finance</option>
									<option value="education">Education</option>
									<option value="retail">Retail</option>
									<option value="marketing">Marketing</option>
									<option value="consulting">Consulting</option>
									<option value="other">Other</option>
								</select>
							</div>

							<div>
								<Label htmlFor="companySize" className="text-foreground">
									Company Size
								</Label>
								<select
									id="companySize"
									value={formData.companySize}
									onChange={(e) =>
										setFormData({ ...formData, companySize: e.target.value })
									}
									className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2 focus:border-primary focus:outline-none"
									aria-label="Select company size"
								>
									<option value="">Select company size</option>
									<option value="1-10">1-10 employees</option>
									<option value="11-50">11-50 employees</option>
									<option value="51-200">51-200 employees</option>
									<option value="201-1000">201-1000 employees</option>
									<option value="1000+">1000+ employees</option>
								</select>
							</div>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-6">
						<div className="text-center mb-8">
							<h2 className="text-2xl font-bold text-foreground mb-2">
								Who are your competitors?
							</h2>
							<p className="text-muted-foreground">
								We'll track their AI visibility alongside yours
							</p>
						</div>

						<div className="space-y-4">
							<div>
								<Label htmlFor="competitor1" className="text-foreground">
									Primary Competitor
								</Label>
								<Input
									id="competitor1"
									type="text"
									placeholder="Competitor name or website"
									value={formData.competitors[0]}
									onChange={(e) =>
										setFormData({
											...formData,
											competitors: [
												e.target.value,
												formData.competitors[1],
												formData.competitors[2],
											],
										})
									}
									className="bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary"
								/>
							</div>

							<div>
								<Label htmlFor="competitor2" className="text-foreground">
									Secondary Competitor
								</Label>
								<Input
									id="competitor2"
									type="text"
									placeholder="Competitor name or website"
									value={formData.competitors[1]}
									onChange={(e) =>
										setFormData({
											...formData,
											competitors: [
												formData.competitors[0],
												e.target.value,
												formData.competitors[2],
											],
										})
									}
									className="bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary"
								/>
							</div>

							<div>
								<Label htmlFor="competitor3" className="text-foreground">
									Third Competitor (Optional)
								</Label>
								<Input
									id="competitor3"
									type="text"
									placeholder="Competitor name or website"
									value={formData.competitors[2]}
									onChange={(e) =>
										setFormData({
											...formData,
											competitors: [
												formData.competitors[0],
												formData.competitors[1],
												e.target.value,
											],
										})
									}
									className="bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary"
								/>
							</div>
						</div>
					</div>
				);

			case 4:
				return (
					<div className="space-y-6">
						<div className="text-center mb-8">
							<h2 className="text-2xl font-bold text-foreground mb-2">
								What are your goals?
							</h2>
							<p className="text-muted-foreground">
								Select all that apply to help us customize your experience
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[
								"Improve AI search visibility",
								"Track competitor performance",
								"Generate content ideas",
								"Optimize for specific AI platforms",
								"Increase brand awareness",
								"Social media content creation",
								"Content automation",
								"Audience insights",
							].map((goal) => (
								<label
									key={goal}
									className="flex items-center space-x-3 p-4 bg-background border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
								>
									<input
										type="checkbox"
										checked={formData.goals.includes(goal)}
										onChange={(e) => {
											if (e.target.checked) {
												setFormData({
													...formData,
													goals: [...formData.goals, goal],
												});
											} else {
												setFormData({
													...formData,
													goals: formData.goals.filter((g) => g !== goal),
												});
											}
										}}
										className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
										aria-label={goal}
									/>
									<span className="text-foreground">{goal}</span>
								</label>
							))}
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Onboarding Section */}
			<section className="py-16 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto">
					{/* Progress Bar */}
					<div className="mb-8">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-muted-foreground">
								Step {currentStep} of {onboardingSteps.length}
							</span>
							<span className="text-sm font-medium text-primary">
								{progress}% Complete
							</span>
						</div>
						<Progress value={progress} className="h-2" />
					</div>

					{/* Main Content */}
					<Card className="border-border shadow-xl bg-card">
						<CardContent className="p-8">{renderStepContent()}</CardContent>
					</Card>

					{/* Navigation Buttons */}
					<div className="flex justify-between mt-8">
						{currentStep > 1 && (
							<Button
								variant="outline"
								onClick={handlePrevious}
								className="flex items-center border-border text-foreground hover:bg-accent bg-background"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Previous
							</Button>
						)}
						{currentStep < onboardingSteps.length && (
							<Button
								onClick={handleNext}
								className={`flex items-center bg-primary hover:bg-primary/90 text-primary-foreground ${currentStep === 1 ? "ml-auto" : ""}`}
							>
								Next
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						)}
						{currentStep === onboardingSteps.length && (
							<Link href="/dashboard" className="ml-auto">
								<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
									Go to Dashboard
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
