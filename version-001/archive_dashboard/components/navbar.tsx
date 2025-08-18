"use client";

import { useCustomer } from "@/hooks/useAutumnCustomer";
import { signOut, useSession } from "@/lib/auth-client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Autumn billing UI temporarily removed
function UserCredits() {
	const { customer } = useCustomer();
	const messageUsage = customer?.features?.messages;
	const remainingMessages = messageUsage ? messageUsage.balance || 0 : 0;

	return (
		<div className="flex items-center text-sm font-medium text-muted-foreground">
			<span>{remainingMessages}</span>
			<span className="ml-1">credits</span>
		</div>
	);
}

export function Navbar() {
	const { data: session, isPending } = useSession();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const router = useRouter();

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
		<nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link href="/" className="flex items-center">
							<div className="flex items-center space-x-2">
								<div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded flex items-center justify-center">
									<svg
										className="w-4 h-4 text-primary-foreground"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12 2L2 22h20L12 2z" />
									</svg>
								</div>
								<span className="text-xl font-bold text-foreground">
									gentAuthority
								</span>
							</div>
						</Link>
					</div>

					<div className="flex items-center space-x-4">
						{session && (
							<>
								<Link
									href="/chat"
									className="text-muted-foreground hover:text-primary transition-colors duration-200"
								>
									Basic Chat
								</Link>
								<Link
									href="/brand-monitor"
									className="text-muted-foreground hover:text-primary transition-colors duration-200"
								>
									Brand Monitor
								</Link>
							</>
						)}
						<Link
							href="/plans"
							className="text-muted-foreground hover:text-primary transition-colors duration-200"
						>
							Plans
						</Link>
						{session && <UserCredits />}
						{isPending ? (
							<div className="text-sm text-muted-foreground">Loading...</div>
						) : session ? (
							<>
								<Link
									href="/dashboard"
									className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 h-8 px-3 shadow-sm hover:shadow-md"
								>
									Dashboard
								</Link>
								<button
									onClick={handleLogout}
									disabled={isLoggingOut}
									className="border border-border text-foreground hover:bg-accent bg-background inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 h-8 px-3"
								>
									{isLoggingOut ? "Logging out..." : "Logout"}
								</button>
							</>
						) : (
							<>
								<Link
									href={`${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000"}/login`}
									className="border-border text-foreground hover:bg-accent bg-background inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 h-8 px-3 border"
								>
									Login
								</Link>
								<Link
									href={`${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000"}/auth/sign-up`}
									className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 h-8 px-3 shadow-sm hover:shadow-md"
								>
									Register
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
