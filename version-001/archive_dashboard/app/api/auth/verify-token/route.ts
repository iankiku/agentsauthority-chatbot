import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get("token");
	const callbackURL = searchParams.get("callbackURL");

	if (!token) {
		const webAppUrl =
			process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
		return NextResponse.redirect(
			new URL("/login?error=invalid_token", webAppUrl)
		);
	}

	try {
		const authServiceUrl =
			process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003";
		const verifyUrl = `${authServiceUrl}/api/auth/magic-link/verify?token=${token}`;

		console.log("🔗 Verifying token with auth service:", {
			verifyUrl,
			token,
			callbackURL,
		});

		const response = await fetch(verifyUrl, {
			method: "GET",
			headers: {
				// Forward any necessary headers from the original request
				Cookie: request.headers.get("Cookie") || "",
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error("❌ Auth service verification failed:", {
				status: response.status,
				statusText: response.statusText,
				errorData,
				token,
			});
			const webAppUrl =
				process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
			return NextResponse.redirect(
				new URL(
					`/login?error=${errorData.code || "verification_failed"}`,
					webAppUrl
				)
			);
		}

		// Extract all session cookies from the auth service's response
		const setCookieHeaders = response.headers.getSetCookie?.() || [];
		const legacySetCookie = response.headers.get("set-cookie");
		const allCookies =
			setCookieHeaders.length > 0
				? setCookieHeaders
				: legacySetCookie
					? [legacySetCookie]
					: [];

		console.log("🍪 Received session cookies:", {
			setCookieHeaders,
			legacySetCookie,
			allCookies,
		});

		// CRITICAL: Verify session was actually created before redirecting
		const sessionCheckUrl = `${authServiceUrl}/api/auth/get-session`;

		// Extract just the cookie values for the session validation request
		const cookieHeader = allCookies
			.map((cookie) => cookie.split(";")[0]) // Get just the name=value part
			.join("; ");

		console.log("🔍 Using cookie header for validation:", cookieHeader);

		const sessionResponse = await fetch(sessionCheckUrl, {
			headers: {
				Cookie: cookieHeader,
			},
		});

		let sessionData;
		try {
			sessionData = await sessionResponse.json();
		} catch (error) {
			console.error("❌ Failed to parse session response:", error);
		}

		console.log("🔍 Post-verification session check:", {
			sessionStatus: sessionResponse.status,
			hasUser: !!sessionData?.user,
			userEmail: sessionData?.user?.email,
			cookieHeaderUsed: cookieHeader,
			totalCookies: allCookies.length,
		});

		if (!sessionData?.user) {
			console.error(
				"❌ CRITICAL: Session not created after successful verification!"
			);
			const webAppUrl =
				process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
			return NextResponse.redirect(
				new URL("/login?error=session_creation_failed", webAppUrl)
			);
		}

		// Session is confirmed - proceed with redirect
		const redirectUrl = new URL(callbackURL || "/dashboard", request.url);
		const redirectResponse = NextResponse.redirect(redirectUrl);

		// Transfer all session cookies to the dashboard domain
		allCookies.forEach((cookie) => {
			console.log("🍪 Setting cookie:", cookie);
			redirectResponse.headers.append("set-cookie", cookie);
		});

		console.log(
			"✅ Session confirmed - redirecting to dashboard with session cookies"
		);

		// Check if this is being called from our loading page (AJAX request)
		const isAjaxRequest =
			request.headers.get("content-type")?.includes("application/json") ||
			request.headers.get("x-requested-with") === "XMLHttpRequest";

		if (isAjaxRequest) {
			// Return JSON response for AJAX calls
			return Response.json({
				success: true,
				redirectUrl: callbackURL || "/dashboard",
				message: "Verification successful",
			});
		}

		// Return redirect response for direct access
		return redirectResponse;
	} catch (error) {
		console.error("Magic link verification failed:", error);
		const webAppUrl =
			process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";
		return NextResponse.redirect(
			new URL("/login?error=internal_error", webAppUrl)
		);
	}
}
