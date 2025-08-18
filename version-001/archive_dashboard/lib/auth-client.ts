import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003",
	plugins: [nextCookies()],
	handlers: {
		magicLink: {
			verify: {
				// Use our custom server-side verification route
				GET: "/api/auth/verify-token",
			},
		},
	},
	// Add explicit session refresh configuration
	session: {
		updateAge: 24 * 60 * 60, // 24 hours
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
});

export const { signIn, signUp, signOut, useSession } = authClient;
export const { verify } = authClient; // expose verify handler if needed

// Export a method to manually refresh session
export const refreshSession = async () => {
	try {
		// Force session refresh by calling the client's session method
		await authClient.session();
		console.log("🔄 Session refreshed manually");
	} catch (error) {
		console.error("❌ Failed to refresh session:", error);
	}
};
