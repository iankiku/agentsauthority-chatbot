import { Autumn } from "autumn-js";
import { NextFunction, Request, Response } from "express";
import { auth } from "../auth/auth";
import { InsufficientCreditsError } from "../lib/api-errors";

// Initialize Autumn client only if secret key is available
const autumnClient = process.env.AUTUMN_SECRET_KEY
	? new Autumn({ secretKey: process.env.AUTUMN_SECRET_KEY })
	: null;

export function autumnMiddleware(creditsRequired: number = 1) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const session = await auth.api.getSession({
				headers: req.headers as any,
			});

			if (!session?.user) {
				return res.status(401).json({ error: "Authentication required" });
			}

			// Skip credit checking if Autumn is not configured
			if (!autumnClient) {
				console.warn(
					"[Autumn Middleware] Autumn not configured, skipping credit check"
				);
				return next();
			}

			// Check if user has sufficient credits
			const access = await autumnClient.check({
				customer_id: session.user.id,
				feature_id: "messages",
			});

			if ((access.data?.balance ?? 0) < creditsRequired) {
				throw new InsufficientCreditsError(
					"Insufficient credits",
					creditsRequired,
					access.data?.balance || 0
				);
			}

			// Deduct credits
			await autumnClient.track({
				customer_id: session.user.id,
				feature_id: "messages",
				value: creditsRequired,
			});

			next();
		} catch (error) {
			if (error instanceof InsufficientCreditsError) {
				return res.status(402).json({
					error: error.message,
					creditsRequired: error.creditsRequired,
					creditsAvailable: error.creditsAvailable,
				});
			}

			console.error("[Autumn Middleware] Error:", error);
			res.status(500).json({ error: "Failed to process credits" });
		}
	};
}
