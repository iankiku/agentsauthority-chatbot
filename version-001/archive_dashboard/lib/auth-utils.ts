/**
 * Validates session with the centralized auth service
 * Accepts a Headers object to align with usage in API routes
 */
export async function validateSession(headers: Headers) {
	try {
		const authServiceUrl =
			process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003";

		const sessionResponse = await fetch(
			`${authServiceUrl}/api/auth/get-session`,
			{
				headers: {
					cookie: headers.get("cookie") || "",
				},
			}
		);

		if (!sessionResponse.ok) {
			return { user: null, session: null };
		}

		const sessionData = await sessionResponse.json();
		return sessionData?.user ? sessionData : { user: null, session: null };
	} catch (error) {
		console.error("Session validation error:", error);
		return { user: null, session: null };
	}
}

/**
 * Creates an auth object compatible with the old Better Auth API
 * This maintains compatibility with existing API routes
 */
export const auth = {
	api: {
		getSession: async ({ headers }: { headers: Headers }) => {
			return await validateSession(headers);
		},
	},
};
