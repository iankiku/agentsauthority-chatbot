"use client";

import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import {
	BarChart3,
	FileText,
	MessageSquare,
	PlusCircle,
	Search,
	Settings,
	TrendingUp,
} from "lucide-react";

interface QuickAction {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	href?: string;
	onClick?: () => void;
	variant?: "default" | "secondary" | "outline";
}

const quickActions: QuickAction[] = [
	{
		id: "start-brand-scan",
		title: "Start Brand Scan",
		description: "Launch a comprehensive brand analysis",
		icon: <Search className="h-4 w-4" />,
		href: "/brand-monitor",
		variant: "default",
	},
	{
		id: "view-reports",
		title: "View Reports",
		description: "Access your latest analysis reports",
		icon: <FileText className="h-4 w-4" />,
		href: "/reports",
		variant: "outline",
	},
	{
		id: "chat-with-ai",
		title: "Chat with AI",
		description: "Get instant insights and recommendations",
		icon: <MessageSquare className="h-4 w-4" />,
		href: "/chat",
		variant: "outline",
	},
	{
		id: "competitor-analysis",
		title: "Competitor Analysis",
		description: "Analyze your competitive landscape",
		icon: <TrendingUp className="h-4 w-4" />,
		href: "/competitors",
		variant: "outline",
	},
	{
		id: "visibility-explorer",
		title: "Visibility Explorer",
		description: "Explore your online presence",
		icon: <BarChart3 className="h-4 w-4" />,
		href: "/visibility-explorer",
		variant: "outline",
	},
	{
		id: "project-settings",
		title: "Project Settings",
		description: "Configure your project preferences",
		icon: <Settings className="h-4 w-4" />,
		href: "/settings",
		variant: "secondary",
	},
];

export function QuickActionsPanel() {
	const handleActionClick = (action: QuickAction) => {
		if (action.onClick) {
			action.onClick();
		} else if (action.href) {
			// In a real app, you'd use Next.js router here
			window.location.href = action.href;
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<PlusCircle className="h-5 w-5 text-primary" />
					Quick Actions
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="grid grid-cols-1 gap-2">
					{quickActions.map((action) => (
						<Button
							key={action.id}
							variant={action.variant || "outline"}
							className="justify-start h-auto p-3 text-left"
							onClick={() => handleActionClick(action)}
						>
							<div className="flex items-center gap-3 w-full">
								<div className="flex-shrink-0">{action.icon}</div>
								<div className="flex-1">
									<div className="font-medium text-sm">{action.title}</div>
									<div className="text-xs opacity-70">{action.description}</div>
								</div>
							</div>
						</Button>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
