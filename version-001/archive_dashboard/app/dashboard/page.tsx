"use client";

import { PinnedArtifactsPanel } from "@/components/artifacts/pinned-artifacts-panel";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AnalysisProgressView } from "@/components/dashboard/analysis-progress-view";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { WelcomeFlow } from "@/components/dashboard/welcome-flow";
import { refreshSession, useSession } from "@/lib/auth-client";
import { useArtifactsStore } from "@/stores/artifacts-store";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/utils";
import { Pin, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface AnalysisData {
	userId: string;
	token: string;
	jobId: string;
	result?: any;
}

export default function DashboardPage() {
	const searchParams = useSearchParams();
	const [showPinnedPanel, setShowPinnedPanel] = useState(false);
	const { pinnedArtifacts } = useArtifactsStore();
	const { data: session, isLoading: sessionLoading } = useSession();

	// New user flow state
	const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
	const [isNewUser, setIsNewUser] = useState(false);
	const [analysisComplete, setAnalysisComplete] = useState(false);
	const [showWelcome, setShowWelcome] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Check if pinned panel should be open based on URL parameter
	useEffect(() => {
		const pinnedParam = searchParams.get("pinned");
		if (pinnedParam === "true") {
			setShowPinnedPanel(true);
		}
	}, [searchParams]);

	// Handle new user flow
	useEffect(() => {
		const initializeDashboard = async () => {
			// Wait for session to load first
			if (sessionLoading) {
				return;
			}

			// Check URL parameters for new user flow
			const userId = searchParams.get("userId");
			const sessionToken = searchParams.get("sessionToken");
			const jobId = searchParams.get("jobId");
			const newUser = searchParams.get("newUser") === "true";

			if (userId && sessionToken && jobId) {
				setAnalysisData({ userId, token: sessionToken, jobId });
				setIsNewUser(newUser);

				// Set session cookie for authentication
				document.cookie = `better-auth.session_token=${sessionToken}; path=/; max-age=604800; samesite=lax`;

				// Check if analysis is already complete
				await checkAnalysisStatus(jobId);
			} else {
				// Check for existing session
				await checkExistingSession();
			}

			setIsLoading(false);
		};

		initializeDashboard();
	}, [searchParams, sessionLoading, session]);

	const checkAnalysisStatus = async (jobId: string) => {
		try {
			const response = await fetch(`/api/agent-status/${jobId}`);
			const data = await response.json();

			if (data.status === "completed") {
				setAnalysisComplete(true);
				setShowWelcome(isNewUser);
			} else {
				// Analysis still in progress
				setAnalysisComplete(false);
			}
		} catch (error) {
			console.error("Error checking analysis status:", error);
			setAnalysisComplete(true); // Fallback to showing dashboard
		}
	};

	const checkExistingSession = async () => {
		try {
			console.log("🔍 Session check starting:", {
				hasSession: !!session?.user,
				sessionLoading,
				userEmail: session?.user?.email,
				timestamp: new Date().toISOString(),
			});

			// If we already have a session from the hook, use it
			if (session?.user) {
				console.log("✅ Session found immediately:", session.user.email);
				setAnalysisComplete(true);
				return;
			}

			// If session is still loading, wait
			if (sessionLoading) {
				console.log("⏳ Session still loading, waiting...");
				return;
			}

			// Give Better Auth client multiple attempts to detect session
			// This is crucial for magic link redirects where cookies are just set
			for (let attempt = 1; attempt <= 3; attempt++) {
				console.log(`🔄 Session detection attempt ${attempt}/3`);

				// Wait progressively longer between attempts
				await new Promise((resolve) => setTimeout(resolve, attempt * 1000));

				// Force a session refresh to detect newly set cookies
				try {
					await refreshSession();
					console.log(`✅ Session refresh completed for attempt ${attempt}`);
				} catch (refreshError) {
					console.error(
						`❌ Session refresh failed on attempt ${attempt}:`,
						refreshError
					);
				}

				// Check if session was detected after refresh
				if (session?.user) {
					console.log(
						`✅ Session found on attempt ${attempt}:`,
						session.user.email
					);
					setAnalysisComplete(true);
					return;
				}

				console.log(`⚠️ Attempt ${attempt} failed, session still not detected`);
			}

			// Final check - if still no session after all attempts, redirect
			console.error(
				"❌ Session detection failed after 3 attempts, redirecting to login"
			);
			const webAppUrl =
				process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

			// Add current URL as redirect parameter
			const currentUrl = window.location.href;
			const loginUrl = `${webAppUrl}/login?redirect=${encodeURIComponent(currentUrl)}`;

			console.log("🔄 Redirecting to login:", loginUrl);
			window.location.href = loginUrl;
		} catch (error) {
			console.error("❌ Session check failed:", error);
			// Redirect to login on error
			const webAppUrl =
				process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
			window.location.href = `${webAppUrl}/login?error=session_check_failed`;
		}
	};

	const handleWelcomeComplete = () => {
		setShowWelcome(false);
	};

	const handleAnalysisComplete = (result: any) => {
		setAnalysisComplete(true);
		setShowWelcome(isNewUser);
		if (analysisData) {
			setAnalysisData({ ...analysisData, result });
		}
	};

	// Show loading state
	if (isLoading || sessionLoading) {
		return (
			<DashboardLayout>
				<div className="flex items-center justify-center h-full">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-muted-foreground">Loading dashboard...</p>
					</div>
				</div>
			</DashboardLayout>
		);
	}

	// Show analysis progress if analysis is not complete
	if (analysisData && !analysisComplete) {
		return (
			<DashboardLayout>
				<AnalysisProgressView
					jobId={analysisData.jobId}
					onComplete={handleAnalysisComplete}
				/>
			</DashboardLayout>
		);
	}

	// Show welcome flow for new users
	if (showWelcome && isNewUser) {
		return (
			<DashboardLayout>
				<WelcomeFlow
					analysisData={analysisData}
					onComplete={handleWelcomeComplete}
				/>
			</DashboardLayout>
		);
	}

	// Show main dashboard
	return (
		<DashboardLayout>
			<div className="flex h-full gap-4">
				{/* Main Dashboard Content */}
				<div
					className={cn(
						"flex-1 transition-all duration-300",
						showPinnedPanel && "mr-80"
					)}
				>
					<DashboardContent />
				</div>

				{/* Pinned Artifacts Panel */}
				{showPinnedPanel && (
					<div className="fixed right-4 top-20 bottom-4 w-72 z-40">
						<PinnedArtifactsPanel />
					</div>
				)}

				{/* Toggle Button */}
				<Button
					variant={showPinnedPanel ? "default" : "outline"}
					size="sm"
					onClick={() => setShowPinnedPanel(!showPinnedPanel)}
					className={cn(
						"fixed right-4 top-4 z-50 transition-all duration-300",
						showPinnedPanel && "right-80"
					)}
				>
					{showPinnedPanel ? (
						<>
							<X className="h-4 w-4 mr-2" />
							Hide Pinned
						</>
					) : (
						<>
							<Pin className="h-4 w-4 mr-2" />
							Pinned ({pinnedArtifacts.length})
						</>
					)}
				</Button>
			</div>
		</DashboardLayout>
	);
}
