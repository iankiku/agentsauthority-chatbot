import { Router } from "express";
import { apiMiddleware } from "../middleware/api-middleware";
import { handleDebugTables } from "../services/debug-service";

const router = Router();

// Apply authentication middleware to all routes
router.use(apiMiddleware({ requireAuth: false, rateLimit: false }));

// Debug routes
router.get("/tables", handleDebugTables);

export const debugRouter = router;
