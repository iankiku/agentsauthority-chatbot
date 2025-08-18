import type { NextConfig } from "next";

// Load environment variables from project root
require("../../scripts/load-root-env.js").loadRootEnv();

const nextConfig: NextConfig = {
	env: {
		NEXT_PUBLIC_SKIP_AUTH: "false",
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
	},
	async headers() {
		return [
			{
				// Apply CORS headers to all API routes
				source: "/api/:path*",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: [
							process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000",
							process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001",
							process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003",
						].join(", "),
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, POST, PUT, DELETE, OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type, Authorization, Cookie",
					},
					{
						key: "Access-Control-Allow-Credentials",
						value: "true",
					},
				],
			},
		];
	},
};

export default nextConfig;
