import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Public routes that don't require authentication
	const publicRoutes = [
		"/onboarding", // Onboarding flow
		"/auth/verifying", // Magic link verification loading page
		"/api/auth", // Better Auth routes
		"/api/brand-monitor/analyze", // Brand analysis API for onboarding
		"/api/agent-status", // SSE endpoints for job tracking
		"/_next", // Next.js internal routes
		"/favicon.ico", // Standard favicon
	];

	// Check if the current path is public
	const isPublicRoute = publicRoutes.some(
		(route) => pathname.startsWith(route) || pathname === "/"
	);

	// Skip auth check for public routes
	if (isPublicRoute) {
		const response = NextResponse.next();

		// Add security headers
		response.headers.set("X-Frame-Options", "DENY");
		response.headers.set("X-Content-Type-Options", "nosniff");
		response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
		response.headers.set("X-XSS-Protection", "1; mode=block");

		return response;
	}

	// Use Better Auth's optimized session cookie check
	// This is much faster than making API calls
	const sessionCookie = getSessionCookie(request, {
		cookiePrefix: "better-auth", // Match our auth config
	});

	console.log("🔍 Middleware session check:", {
		hasSessionCookie: !!sessionCookie,
		sessionCookieValue: sessionCookie
			? sessionCookie.substring(0, 20) + "..."
			: null,
		allCookies: request.headers.get("cookie"),
		pathname,
	});

	if (!sessionCookie) {
		console.log("❌ No session cookie found, redirecting to web app login");
		// Redirect to web app login page
		const webAppUrl =
			process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
		const loginUrl = new URL("/login", webAppUrl);
		loginUrl.searchParams.set("redirect", request.url);
		return NextResponse.redirect(loginUrl);
	}

	console.log("✅ Session cookie found, allowing access");
	// User has session cookie, continue
	const response = NextResponse.next();

	// Add security headers
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("X-XSS-Protection", "1; mode=block");

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).)",
	],
};
