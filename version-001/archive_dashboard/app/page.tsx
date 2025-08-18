"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FragmentLandingPage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to onboarding since this is the fragment app
		router.replace("/onboarding");
	}, [router]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
			<div className="text-center">
				<div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mx-auto mb-4">
					<svg
						className="w-8 h-8 text-white animate-spin"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</div>
				<h1 className="text-xl font-semibold text-white mb-2">
					Redirecting to Agents Authority
				</h1>
				<p className="text-zinc-400">Please wait...</p>
			</div>
		</div>
	);
}
