"use client";

import { PinnedArtifactsButton } from "@/components/artifacts/pinned-artifacts-button";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { useClientNavigation } from "@/hooks/use-client-navigation";
import { signOut, useSession } from "@/lib/auth-client";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import {
	ArrowLeft,
	Bell,
	ChevronDown,
	CreditCard,
	LogOut,
	MessageSquare,
	Settings,
	Sparkles,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Conversation {
	id: string;
	title: string;
	lastUpdated: string;
}

interface ChatLayoutProps {
	children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
	const { data: session } = useSession();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Check for mobile screen size
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
			// Auto-collapse sidebar on mobile
			if (window.innerWidth < 768) {
				setSidebarCollapsed(true);
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [currentConversationId, setCurrentConversationId] = useState("1");
	const { navigateTo } = useClientNavigation();

	// Initialize conversations
	useEffect(() => {
		setConversations([
			{
				id: "1",
				title: "Brand Analysis Discussion",
				lastUpdated: "2 hours ago",
			},
			{
				id: "2",
				title: "Competitor Research",
				lastUpdated: "1 day ago",
			},
			{
				id: "3",
				title: "SEO Optimization Tips",
				lastUpdated: "3 days ago",
			},
		]);
	}, []);

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

	const handleBackToDashboard = () => {
		navigateTo("/dashboard");
	};

	const handleNewConversation = () => {
		const newId = (conversations.length + 1).toString();
		const newConversation: Conversation = {
			id: newId,
			title: `New Chat ${newId}`,
			lastUpdated: "Just now",
		};
		setConversations([newConversation, ...conversations]);
		setCurrentConversationId(newId);
	};

	const handleDeleteConversation = (conversationId: string) => {
		setConversations(
			conversations.filter((conv) => conv.id !== conversationId)
		);
		if (currentConversationId === conversationId) {
			const remainingConversations = conversations.filter(
				(conv) => conv.id !== conversationId
			);
			if (remainingConversations.length > 0) {
				setCurrentConversationId(remainingConversations[0].id);
			}
		}
	};

	const handleUpdateConversationTitle = (
		conversationId: string,
		newTitle: string
	) => {
		setConversations(
			conversations.map((conv) =>
				conv.id === conversationId ? { ...conv, title: newTitle } : conv
			)
		);
	};

	return (
		<TooltipProvider>
			<div
				className="flex h-screen bg-background relative"
				data-chat-layout="true"
			>
				{/* Mobile Overlay */}
				{isMobile && !sidebarCollapsed && (
					<div
						className="fixed inset-0 bg-black/50 z-40 md:hidden"
						onClick={() => setSidebarCollapsed(true)}
					/>
				)}

				{/* Left Sidebar */}
				<div
					className={`${
						sidebarCollapsed
							? "w-12"
							: isMobile
								? "w-80 fixed left-0 top-0 h-full z-50"
								: "w-64"
					} bg-background border-r flex flex-col transition-all duration-300 ${
						isMobile && !sidebarCollapsed ? "shadow-xl" : ""
					}`}
					data-chat-sidebar={sidebarCollapsed ? "collapsed" : "expanded"}
				>
					{/* Sidebar Header */}
					<div className="h-16 px-4 border-b flex items-center gap-2">
						<div className="w-8 h-8 bg-gradient-to-br from-light-orange to-light-blue rounded-lg flex items-center justify-center">
							<Sparkles className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold">Agents Authority</span>
					</div>

					{/* Back to Dashboard Button */}
					{!sidebarCollapsed && (
						<div className="p-4 border-b">
							<Button
								variant="outline"
								size="sm"
								onClick={handleBackToDashboard}
								className="w-full flex items-center gap-2 justify-start hover:bg-muted/50 transition-colors"
							>
								<ArrowLeft className="h-4 w-4" />
								<span>Back to Dashboard</span>
							</Button>
						</div>
					)}

					{/* Chat Sidebar */}
					<div className="flex-1 flex flex-col">
						<ChatSidebar
							conversations={conversations}
							currentConversationId={currentConversationId}
							onConversationSelect={setCurrentConversationId}
							onNewConversation={handleNewConversation}
							onDeleteConversation={handleDeleteConversation}
							onUpdateConversationTitle={handleUpdateConversationTitle}
							sidebarCollapsed={sidebarCollapsed}
							onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
						/>
					</div>

					{/* User Menu in Sidebar Footer */}
					<div className="p-4 border-t">
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
							<DropdownMenuContent align="end" className="w-56">
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
					</div>
				</div>

				{/* Main Content Area */}
				<div
					className={`flex-1 flex flex-col ${isMobile && !sidebarCollapsed ? "pointer-events-none" : ""}`}
				>
					{/* Top Header with Notifications */}
					<header className="h-16 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between">
						<div className="flex items-center gap-2">
							{/* Mobile Menu Button */}
							{isMobile && sidebarCollapsed && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSidebarCollapsed(false)}
									className="h-8 w-8 p-0 mr-2 md:hidden"
								>
									<MessageSquare className="h-4 w-4" />
								</Button>
							)}
							<h1 className="text-lg font-semibold">Chat</h1>
						</div>

						<div className="flex items-center gap-2">
							{/* Pinned Artifacts */}
							<PinnedArtifactsButton />

							{/* Notifications */}
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
					</header>

					{/* Main Chat Content */}
					<main className="flex-1 overflow-hidden">{children}</main>
				</div>
			</div>
		</TooltipProvider>
	);
}
