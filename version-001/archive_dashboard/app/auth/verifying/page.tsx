"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyingPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [status, setStatus] = useState<"verifying" | "success" | "error">(
		"verifying"
	);
	const [errorMessage, setErrorMessage] = useState<string>("");

	useEffect(() => {
		const token = searchParams.get("token");
		const callbackURL = searchParams.get("callbackURL");

		if (!token) {
			setStatus("error");
			setErrorMessage(
				"Invalid verification link. Please try requesting a new magic link."
			);
			return;
		}

		// Show verification process to user
		verifyMagicLink(token, callbackURL || "/dashboard");
	}, [searchParams]);

	const verifyMagicLink = async (token: string, callbackURL: string) => {
		try {
			console.log("🔗 Starting magic link verification with loading UI");

			// Call our verification endpoint
			const response = await fetch(
				`/api/auth/verify-token?token=${token}&callbackURL=${encodeURIComponent(callbackURL)}`,
				{
					method: "GET",
					credentials: "include", // Important for cookies
				}
			);

			if (response.redirected || response.ok) {
				console.log(
					"✅ Verification successful, transitioning to success state"
				);
				setStatus("success");

				// Brief success state before redirect
				setTimeout(() => {
					console.log("🔄 Redirecting to dashboard");
					// Let the server handle the redirect, or manually redirect
					if (response.redirected) {
						window.location.href = response.url;
					} else {
						router.push(callbackURL);
					}
				}, 1000);
			} else {
				const errorData = await response
					.json()
					.catch(() => ({ error: "Unknown error" }));
				console.error("❌ Verification failed:", errorData);
				setStatus("error");
				setErrorMessage(
					errorData.error || "Verification failed. Please try again."
				);
			}
		} catch (error) {
			console.error("❌ Verification request failed:", error);
			setStatus("error");
			setErrorMessage(
				"Network error. Please check your connection and try again."
			);
		}
	};

	const handleRetry = () => {
		const webAppUrl =
			process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
		window.location.href = `${webAppUrl}/login`;
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
			<div className="max-w-md w-full mx-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 text-center">
					{/* Logo/Header */}
					<div className="mb-8">
						<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-white"
							>
								<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
								<path d="M20 3v4" />
								<path d="M22 5h-4" />
								<path d="M4 17v2" />
								<path d="M5 18H3" />
							</svg>
						</div>
						<h1 className="text-2xl font-bold text-gray-900">
							Agents Authority
						</h1>
					</div>

					{/* Status Content */}
					{status === "verifying" && (
						<div className="space-y-6">
							<div className="space-y-4">
								<div className="relative">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
									<div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-blue-200 mx-auto animate-pulse"></div>
								</div>
								<h2 className="text-xl font-semibold text-gray-900">
									Verifying your login...
								</h2>
								<p className="text-gray-600">
									Please wait while we authenticate you and set up your session.
								</p>
							</div>

							{/* Progress dots */}
							<div className="flex justify-center space-x-2">
								<div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
								<div
									className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
									style={{ animationDelay: "0.1s" }}
								></div>
								<div
									className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
									style={{ animationDelay: "0.2s" }}
								></div>
							</div>
						</div>
					)}

					{status === "success" && (
						<div className="space-y-6">
							<div className="space-y-4">
								<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-green-600"
									>
										<polyline points="20,6 9,17 4,12" />
									</svg>
								</div>
								<h2 className="text-xl font-semibold text-gray-900">
									Authentication Successful!
								</h2>
								<p className="text-gray-600">
									Welcome back! Redirecting you to your dashboard...
								</p>
							</div>
						</div>
					)}

					{status === "error" && (
						<div className="space-y-6">
							<div className="space-y-4">
								<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-red-600"
									>
										<circle cx="12" cy="12" r="10" />
										<line x1="15" y1="9" x2="9" y2="15" />
										<line x1="9" y1="9" x2="15" y2="15" />
									</svg>
								</div>
								<h2 className="text-xl font-semibold text-gray-900">
									Verification Failed
								</h2>
								<p className="text-gray-600">{errorMessage}</p>
							</div>

							<button
								onClick={handleRetry}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
							>
								Try Again
							</button>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="text-center mt-6">
					<p className="text-sm text-gray-500">
						Having trouble?{" "}
						<a
							href="mailto:support@agentsauthority.ai"
							className="text-blue-600 hover:underline"
						>
							Contact Support
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
