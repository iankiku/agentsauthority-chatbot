import { NextFunction, Request, Response } from "express";
import { auth } from "../auth/auth";
import { AuthenticationError, handleApiError } from "../lib/api-errors";
import { autumnMiddleware } from "./autumn-middleware";
import { apiRateLimit } from "./rate-limit";

interface ApiHandlerOptions {
	requireAuth?: boolean;
	rateLimit?: boolean;
	featureId?: string;
	creditsRequired?: number;
}

export function apiMiddleware(
	options: ApiHandlerOptions = { requireAuth: true, rateLimit: true }
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (options.rateLimit) {
				const clientIP =
					req.ip ||
					req.headers["x-forwarded-for"]?.toString() ||
					req.socket.remoteAddress ||
					"unknown";
				await apiRateLimit(clientIP);
			}

			if (options.requireAuth) {
				if (process.env.DISABLE_AUTH === "true") {
					console.log(
						`[AUTH] DISABLE_AUTH is active. Injecting dummy session for request to ${req.method} ${req.originalUrl}`
					);
					// Inject dummy session for testing
					(req as any).session = {
						user: {
							id: "test-user-id",
							email: "test@example.com",
							name: "Test User",
						},
					};
					return next();
				}
				console.log(
					`[AUTH] Performing real session check for request to ${req.method} ${req.originalUrl}`
				);
				const session = await auth.api.getSession({
					headers: req.headers as any,
				});
				if (!session?.user) {
					throw new AuthenticationError("Authentication required");
				}
				(req as any).session = session; // Attach session to request for later use
			}

			if (options.featureId && options.creditsRequired) {
				return autumnMiddleware(options.creditsRequired)(req, res, next);
			}

			next();
		} catch (error) {
			const handledError = handleApiError(error);
			res.status(handledError.status).json(handledError.body);
		}
	};
}
