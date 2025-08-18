import { Router } from "express";
import { auth } from "../auth/auth";
import { AuthenticationError, handleApiError } from "../lib/api-errors";
import { apiMiddleware } from "../middleware/api-middleware";

const getSessionWithBypass = async (req: any) => {
	if (process.env.DISABLE_AUTH === "true") {
		console.log(
			`[AUTH] DISABLE_AUTH active in billing/index.ts. Using dummy session for ${req.method} ${req.originalUrl}`
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
		`[AUTH] Fetching real session in billing/index.ts for ${req.method} ${req.originalUrl}`
	);
	return await auth.api.getSession({ headers: req.headers as any });
};

const router = Router();

// Apply authentication middleware to all routes
router.use(apiMiddleware({ requireAuth: true, rateLimit: true }));

// GET /api/billing/portal - Create billing portal session
router.get("/portal", async (req, res) => {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError("Please log in to access billing");
		}

		console.log(
			`[BILLING] Handling billing event for user: ${session?.user?.id || "unknown"} on ${req.method} ${req.originalUrl}`
		);

		// TODO: Implement proper billing portal integration
		// For now, return a placeholder response
		res.json({
			url: `${process.env.APP_URL || "http://localhost:3001"}/dashboard/billing`,
			message: "Billing portal integration pending",
		});
	} catch (error) {
		const handledError = handleApiError(error);
		res.status(handledError.status).json(handledError.body);
	}
});

// GET /api/billing/customer - Get customer billing information
router.get("/customer", async (req, res) => {
	try {
		const session = await getSessionWithBypass(req);

		if (!session?.user) {
			throw new AuthenticationError(
				"Please log in to view billing information"
			);
		}

		console.log(
			`[BILLING] Handling billing event for user: ${session?.user?.id || "unknown"} on ${req.method} ${req.originalUrl}`
		);

		// TODO: Implement proper customer billing info retrieval
		// For now, return a placeholder response
		res.json({
			id: session.user.id,
			email: session.user.email,
			name: session.user.name || "Unknown",
			billing_status: "active",
			subscription: null,
			message: "Billing integration pending",
		});
	} catch (error) {
		const handledError = handleApiError(error);
		res.status(handledError.status).json(handledError.body);
	}
});

export const billingRouter = router;
