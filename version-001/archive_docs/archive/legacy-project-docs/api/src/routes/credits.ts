import { Router } from "express";
import { apiMiddleware } from "../middleware/api-middleware";
import { handleGetCredits } from "../services/credits-service";

const router = Router();

// Apply authentication middleware to all routes
router.use(apiMiddleware({ requireAuth: true, rateLimit: true }));

// Credits routes
router.get("/", handleGetCredits);

export const creditsRouter = router;
