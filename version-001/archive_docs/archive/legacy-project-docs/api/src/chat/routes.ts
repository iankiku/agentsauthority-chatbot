import { Router } from "express";
import { apiMiddleware } from "../middleware/api-middleware";
import {
	handleGetConversations,
	handleSendMessage,
} from "../services/chat-service";

const router = Router();

// Apply authentication middleware to all routes
router.use(apiMiddleware({ requireAuth: false, rateLimit: false }));

// Chat routes
router.post("/send", handleSendMessage);
router.get("/conversations", handleGetConversations);

export const chatRouter = router;
