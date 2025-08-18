// Load environment variables from .env.local before anything else
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { analysisRouter } from "./analysis";
import { auth } from "./auth";
import { billingRouter } from "./billing";
import { chatRouter } from "./chat";
import { creditsRouter } from "./credits";
import { apiMiddleware } from "./middleware/api-middleware";
import { apiRateLimit } from "./middleware/rate-limit";
import { scrapingRouter } from "./scraping/routes";
dotenv.config({ path: "./.env.local" });

console.log(
	"process.env.DISABLE_AUTH ",
	process.env.DISABLE_AUTH,
	"type: ",
	typeof process.env.DISABLE_AUTH
);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(apiRateLimit);

// API middleware
app.use(apiMiddleware);

// Routes
app.use("/api/auth", auth.handler);
app.use("/api/analysis", analysisRouter);
app.use("/api/chat", chatRouter);
app.use("/api/credits", creditsRouter);
app.use("/api/scraping", scrapingRouter);
app.use("/api/billing", billingRouter);

// Health check
app.get("/health", (req, res) => {
	console.log("Health check");
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
	console.log(`API server running on port ${PORT}`);
	console.log(`API docs: http://localhost:${PORT}/api/docs`);
	console.log(`Health check: http://localhost:${PORT}/health`);
});
