import { handleApiError } from "@/lib/api-errors";
// Autumn temporarily disabled
import { NextRequest, NextResponse } from "next/server";

// Determine if authentication should be skipped for development purposes.
// To revert: remove this constant.
// const IS_SKIP_AUTH = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

const autumn = new Autumn({
	secretKey: process.env.AUTUMN_SECRET_KEY!,
});

export async function GET(request: NextRequest) {
	try {
		// if (IS_SKIP_AUTH) {
		// 	// Mock credits if SKIP_AUTH is true.
		// 	// To revert: remove this block.
		// 	console.log("SKIP_AUTH is true: Returning mock credit data.");
		// 	return NextResponse.json({
		// 		allowed: true,
		// 		balance: 999999,
		// 	});
		// }

		// Get the session
		// const sessionResponse = await auth.api.getSession({
		// 	headers: request.headers,
		// });

		// if (!sessionResponse?.user) {
		// 	throw new AuthenticationError("Please log in to view your credits");
		// }

		// Check feature access for messages
		// const access = await autumn.check({
		// 	customer_id: sessionResponse.user.id,
		// 	feature_id: FEATURE_ID_MESSAGES,
		// });

		return NextResponse.json({
			allowed: true,
			balance: 999999,
		});
	} catch (error) {
		return handleApiError(error);
	}
}
