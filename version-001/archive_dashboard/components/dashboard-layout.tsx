"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { useClientNavigation } from "@/hooks/use-client-navigation";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { Bell, Download, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
	children: React.ReactNode;
	title?: string;
	showActions?: boolean;
	autoCollapseSidebar?: boolean; // Controls auto-collapse behavior (off by default)
}

export function DashboardLayout({
	children,
	title,
	showActions = true,
	autoCollapseSidebar = false,
}: DashboardLayoutProps) {
	const pathname = usePathname();
	const { navigateTo } = useClientNavigation();

	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	// Effect to monitor chat sidebar state and auto-collapse dashboard sidebar
	useEffect(() => {
		if (!autoCollapseSidebar) return;

		const checkChatSidebar = () => {
			const chatRoot = document.querySelector('[data-chat-layout="true"]');
			const expanded = chatRoot?.querySelector(
				'[data-chat-sidebar="expanded"]'
			);
			const collapsed = chatRoot?.querySelector(
				'[data-chat-sidebar="collapsed"]'
			);
			if (expanded && !collapsed) setIsSidebarCollapsed(true);
			else if (collapsed && !expanded) setIsSidebarCollapsed(false);
		};

		checkChatSidebar();

		const observer = new MutationObserver(checkChatSidebar);
		observer.observe(document.body, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, [autoCollapseSidebar]);

	// Get page title from pathname if not provided
	const getPageTitle = () => {
		if (title) return title;

		const path = pathname.split("/")[1];
		switch (path) {
			case "dashboard":
				return "Dashboard";
			case "chat":
				return "Chat";
			case "brand-monitor":
				return "Brand Monitor";
			case "visibility-explorer":
				return "Visibility Explorer";
			case "reports":
				return "Reports";
			case "settings":
				return "Settings";
			case "billing":
				return "Billing";
			case "onboarding":
				return "Setup";
			case "fix":
				return "Fix Recommendations";
			case "prompt-analysis":
				return "Prompt Analysis";
			case "competitors":
				return "Competitor Intelligence";
			default:
				return "Dashboard";
		}
	};

	const handleExport = () => {
		// Handle export functionality
		console.log("Exporting data...");
	};

	const handleAskAI = () => {
		// Navigate to chat interface
		navigateTo("/chat");
	};

	return (
		<SidebarProvider defaultOpen={!isSidebarCollapsed}>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<div className="flex items-center space-x-2">
						<h1 className="text-lg font-semibold">{getPageTitle()}</h1>
					</div>

					{/* Notifications */}
					<div className="flex items-center space-x-2 ml-auto">
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0 relative"
							onClick={() => navigateTo("/notifications")}
						>
							<Bell className="h-4 w-4" />
							<Badge
								variant="destructive"
								className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
							>
								3
							</Badge>
						</Button>
					</div>

					{/* Simplified Action Buttons */}
					{showActions && (
						<div className="flex items-center space-x-2">
							{/* Ask AI Button - Primary Action */}
							<Button
								variant="default"
								size="sm"
								className="h-8 bg-primary hover:bg-primary/90"
								onClick={handleAskAI}
							>
								<MessageSquare className="w-4 h-4 mr-2" />
								Ask AI
							</Button>

							{/* Secondary Actions - Minimal */}
							<Button
								variant="outline"
								size="sm"
								className="h-8"
								onClick={handleExport}
							>
								<Download className="w-4 h-4 mr-2" />
								Export
							</Button>
						</div>
					)}
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
