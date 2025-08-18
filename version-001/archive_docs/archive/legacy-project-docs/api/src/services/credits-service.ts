import { Autumn } from "autumn-js";
import { Request, Response } from "express";
import { auth } from "../auth/auth";
import { AuthenticationError } from "../lib/api-errors";

// Initialize Autumn client only if secret key is available
const autumnClient = process.env.AUTUMN_SECRET_KEY
	? new Autumn({ secretKey: process.env.AUTUMN_SECRET_KEY })
	: null;

const getSessionWithBypass = async (req: any) => {
	if (process.env.DISABLE_AUTH === "true") {
		console.log(
			`[AUTH] DISABLE_AUTH active in credits-service.ts. Using dummy session for ${req.method} ${req.originalUrl}`
		);
		return {
			user: {
				id: "test-user-id",
				email: "test@example.com",
				name: "Test User",
			},
		};
	}
	console.log(
		`[AUTH] Fetching real session in credits-service.ts for ${req.method} ${req.originalUrl}`
	);
	return await auth.api.getSession({ headers: req.headers as any });
};

export async function handleGetCredits(req: Request, res: Response) {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError("Please log in to view your credits");
		}

		// Return placeholder credits if Autumn is not configured
		if (!autumnClient) {
			console.warn(
				"[Credits Service] Autumn not configured, returning placeholder credits"
			);
			return res.json({
				balance: 1000,
				limit: 1000,
				featureId: "messages",
			});
		}

		const access = await autumnClient.check({
			customer_id: session.user.id,
			feature_id: "messages",
		});

		res.json({
			balance: access.data?.balance || 0,
			limit: access.data?.allowed ? 1000 : 0, // Default limit if allowed
			featureId: "messages",
		});
	} catch (error) {
		console.error("[Credits Service] Get credits error:", error);
		res.status(500).json({ error: "Failed to fetch credits" });
	}
}
