"use client";

import {
	BarChart3,
	ChevronDown,
	CreditCard,
	Eye,
	FileText,
	Globe,
	LogOut,
	MessageSquare,
	Search,
	Settings,
	Sparkles,
	TrendingUp,
	User,
	Users,
	Zap,
} from "lucide-react";
import type * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@workspace/ui/components/sidebar";
import { useClientNavigation } from "@/hooks/use-client-navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { useState } from "react";

// Menu items
const data = {
	navMain: [
		{
			title: "Overview",
			items: [
				{
					title: "Dashboard",
					url: "/dashboard",
					icon: BarChart3,
				},
				{
					title: "Chat",
					url: "/chat",
					icon: MessageSquare,
				},
			],
		},
		{
			title: "Analysis",
			items: [
				{
					title: "Brand Monitor",
					url: "/brand-monitor",
					icon: TrendingUp,
				},
				{
					title: "Visibility Explorer",
					url: "/visibility-explorer",
					icon: Eye,
				},
				{
					title: "Prompt Analysis",
					url: "/prompt-analysis",
					icon: Zap,
				},
				{
					title: "Competitor Intelligence",
					url: "/competitors",
					icon: Users,
				},
			],
		},
		{
			title: "Reports",
			items: [
				{
					title: "All Reports",
					url: "/reports",
					icon: FileText,
				},
				{
					title: "Visibility Reports",
					url: "/reports/visibility",
					icon: Search,
				},
				{
					title: "Performance Reports",
					url: "/reports/performance",
					icon: BarChart3,
				},
				{
					title: "Brand Reports",
					url: "/reports/brand",
					icon: Globe,
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: session } = useSession();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const { navigateTo, isActive } = useClientNavigation();

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			// Call the Better Auth signOut function
			await signOut();

			// Call our enhanced logout API endpoint for thorough cleanup
			try {
				await fetch("/api/auth/logout", {
					method: "POST",
					credentials: "include",
				});
			} catch (apiError) {
				console.warn(
					"Logout API call failed (continuing with client cleanup):",
					apiError
				);
			}

			// Clear additional client-side storage
			if (typeof window !== "undefined") {
				// Clear localStorage items related to auth
				const authKeys = [
					"auth-token",
					"session-token",
					"user-session",
					"better-auth-session",
					"autumn-session",
				];

				authKeys.forEach((key) => {
					localStorage.removeItem(key);
					sessionStorage.removeItem(key);
				});

				// Clear auth-related cookies on client side
				const authCookies = [
					"better-auth.session_token",
					"session",
					"auth-session",
				];

				authCookies.forEach((cookieName) => {
					// Clear for current domain
					document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

					// Clear for parent domain (for cross-domain sessions)
					const domain = window.location.hostname;
					const parentDomain = domain.split(".").slice(-2).join(".");
					if (parentDomain !== domain) {
						document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${parentDomain};`;
					}
				});
			}

			// Small delay to ensure cleanup is complete, then redirect
			setTimeout(() => {
				// Redirect to marketing site landing page after logout
				const redirectUrl =
					process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
				window.location.href = redirectUrl;
			}, 100);
		} catch (error) {
			console.error("Logout error:", error);
			setIsLoggingOut(false);
		}
	};

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<div className="flex items-center space-x-2 px-2 py-2">
					<div className="w-8 h-8 bg-gradient-to-br from-light-orange to-light-blue rounded-lg flex items-center justify-center">
						<Sparkles className="w-5 h-5 text-white" />
					</div>
					<span className="text-xl font-bold">Agents Authority</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				{data.navMain.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{item.items.map((menuItem) => (
									<SidebarMenuItem key={menuItem.title}>
										<SidebarMenuButton
											onClick={() => navigateTo(menuItem.url)}
											className={
												isActive(menuItem.url)
													? "bg-accent text-accent-foreground"
													: ""
											}
										>
											<menuItem.icon />
											<span>{menuItem.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			{/* Enhanced User Account Section */}
			<SidebarFooter className="p-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="w-full justify-start h-auto p-3 hover:bg-muted/50"
						>
							<div className="flex items-center gap-3 w-full">
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={session?.user?.image || undefined}
										alt={session?.user?.name || "Demo User"}
									/>
									<AvatarFallback className="bg-primary/10 text-primary">
										{session?.user?.name?.charAt(0)?.toUpperCase() || "D"}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 text-left">
									<div className="text-sm font-medium text-foreground">
										{session?.user?.name || "Demo User"}
									</div>
									<div className="text-xs text-muted-foreground">
										{session?.user?.email || "demo@agentauthority.com"}
									</div>
								</div>
								<ChevronDown className="h-4 w-4 text-muted-foreground" />
							</div>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56" side="top">
						<DropdownMenuLabel>
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium leading-none">
									{session?.user?.name || "Demo User"}
								</p>
								<p className="text-xs leading-none text-muted-foreground">
									{session?.user?.email || "demo@agentauthority.com"}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => navigateTo("/profile")}
							className="cursor-pointer"
						>
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => navigateTo("/billing")}
							className="cursor-pointer"
						>
							<CreditCard className="mr-2 h-4 w-4" />
							<span>Billing</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => navigateTo("/settings")}
							className="cursor-pointer"
						>
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleLogout}
							disabled={isLoggingOut}
							className="text-red-600 focus:text-red-600 cursor-pointer"
						>
							<LogOut className="mr-2 h-4 w-4" />
							<span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
