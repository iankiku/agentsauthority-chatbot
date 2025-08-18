import { Router } from "express";
import { checkProviders } from "../analysis/check-providers";
import { googleWebSearch } from "../lib/google-web-search";
import { apiMiddleware } from "../middleware/api-middleware";
import { scrapingRouter } from "../scraping/routes";
import {
	handleAnalyze,
	handleDeleteAnalysis,
	handleGetAnalyses,
	handleGetAnalysis,
	handleScrape,
} from "../services/brand-monitor-service";

const router = Router();

// Apply authentication middleware to all routes
router.use(apiMiddleware({ requireAuth: false, rateLimit: false }));

// Analysis routes
router.post("/analyze", handleAnalyze);
router.get("/analyses", handleGetAnalyses);
router.get("/analyses/:id", handleGetAnalysis);
router.delete("/analyses/:id", handleDeleteAnalysis);

// Scraping routes
router.post("/scrape", handleScrape);
router.use("/scraping", scrapingRouter);

// Provider check
router.get("/providers", checkProviders);

// Web search
router.post("/web-search", async (req, res) => {
	try {
		const { query } = req.body;
		if (!query) {
			return res.status(400).json({ error: "Search query is required" });
		}
		const searchResults = await googleWebSearch(query);
		res.json(searchResults);
	} catch (error) {
		console.error("[Web Search] Error:", error);
		res.status(500).json({ error: "Web search failed" });
	}
});

export const brandMonitorRouter = router;
