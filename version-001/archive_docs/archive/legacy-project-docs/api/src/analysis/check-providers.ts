import { Request, Response, Router } from "express";
import { handleApiError } from "../lib/api-errors";
import { getConfiguredProviders } from "../lib/provider-config";

// Function for use in routes
export async function checkProviders(req: Request, res: Response) {
	try {
		const configuredProviders = getConfiguredProviders();
		const providers = configuredProviders.map((p: any) => p.name);

		res.json({
			providers,
			count: providers.length,
			available: providers.length > 0,
		});
	} catch (error) {
		const handledError = handleApiError(error);
		res.status(handledError.status).json(handledError.body);
	}
}

const router = Router();

// POST /api/analysis/check-providers - Check available AI providers
router.post("/", checkProviders);

export const checkProvidersRouter = router;
