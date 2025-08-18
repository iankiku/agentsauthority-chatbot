import { ValidationError, handleApiError } from "@/lib/api-errors";
import { scrapeCompanyInfo } from "@/lib/scrape-utils";
import { NextRequest, NextResponse } from "next/server";

// Determine if authentication should be skipped for development purposes.
// To revert: remove this constant.
// const IS_SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

// Autumn temporarily disabled

export async function POST(request: NextRequest) {
	try {
		let sessionResponse: any = {};

		// if (IS_SKIP_AUTH) {
		// 	// Mock session and bypass credit checks if SKIP_AUTH is true.
		// 	// To revert: remove this block.
		// 	console.log(
		// 		"SKIP_AUTH is true: Bypassing session and credit checks for brand-monitor/scrape."
		// 	);
		// 	sessionResponse.user = { id: "mock-user", email: "dev@example.com" };
		// } else {
		// Original session and credit check logic
		// sessionResponse = await auth.api.getSession({
		// 	headers: request.headers,
		// });

		// if (!sessionResponse?.user) {
		// 	throw new AuthenticationError("Please log in to use this feature");
		// }

		// try {
		// 	const access = await autumn.check({
		// 		customer_id: sessionResponse.user.id,
		// 		feature_id: FEATURE_ID_MESSAGES,
		// 	});

		// 	if (
		// 		!access.data?.allowed ||
		// 		(access.data?.balance && access.data.balance < 1)
		// 	) {
		// 		throw new InsufficientCreditsError(
		// 			"Insufficient credits. You need at least 1 credit to analyze a URL.",
		// 			{ required: 1, available: access.data?.balance || 0 }
		// 		);
		// 	}
		// } catch (error) {
		// 	if (error instanceof InsufficientCreditsError) {
		// 		throw error;
		// 	}
		// 	console.error("[Brand Monitor Scrape] Credit check error:", error);
		// 	throw new ExternalServiceError(
		// 		"Unable to verify credits. Please try again",
		// 		"autumn"
		// 	);
		// }

		// // Track usage (1 credit for scraping) - only if not skipping auth
		// try {
		// 	await autumn.track({
		// 		customer_id: sessionResponse.user.id,
		// 		feature_id: FEATURE_ID_MESSAGES,
		// 		count: 1,
		// 	});
		// } catch (err) {
		// 	console.error("[Brand Monitor Scrape] Error tracking usage:", err);
		// }
		// }

		const { url, maxAge } = await request.json();

		if (!url) {
			throw new ValidationError("Invalid request", {
				url: "URL is required",
			});
		}

		// Ensure URL has protocol
		let normalizedUrl = url.trim();
		if (
			!normalizedUrl.startsWith("http://") &&
			!normalizedUrl.startsWith("https://")
		) {
			normalizedUrl = `https://${normalizedUrl}`;
		}

		const company = await scrapeCompanyInfo(normalizedUrl, maxAge);

		return NextResponse.json({ company });
	} catch (error) {
		return handleApiError(error);
	}
}
