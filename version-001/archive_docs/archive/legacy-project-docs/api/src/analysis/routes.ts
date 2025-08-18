import { Request, Response, Router } from "express";
import { createSSEMessage, performAnalysis } from "../lib/analyze-common";
import { Company } from "../lib/types";
import { analysesRouter } from "./analyses";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
	try {
		const {
			url,
			companyName,
			industry,
			description,
			useWebSearch,
			customPrompts,
			userSelectedCompetitors,
		} = req.body;
		if (!url) {
			return res.status(400).json({ error: "URL is required" });
		}

		const company: Company = {
			id: "",
			url,
			name: companyName,
			industry,
			description,
		};

		// Set SSE headers
		res.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Cache-Control",
		});

		// Create a sendEvent function that writes to the SSE stream
		const sendEvent = async (event: any) => {
			const message = createSSEMessage(event);
			res.write(message);

			// Flush the response to ensure immediate delivery
			if ((res as any).flush) {
				(res as any).flush();
			}
		};

		// Handle client disconnect
		req.on("close", () => {
			console.log("Client disconnected from SSE stream");
		});

		// Perform the analysis with SSE events
		const result = await performAnalysis({
			company,
			customPrompts,
			userSelectedCompetitors,
			useWebSearch,
			sendEvent,
		});

		// Send completion event
		await sendEvent({
			type: "complete",
			stage: "finalizing",
			data: result,
			timestamp: new Date(),
		});

		// End the response
		res.end();
	} catch (error) {
		console.error("Analysis error:", error);

		// Send error event if SSE is still active
		if (!res.headersSent) {
			res.writeHead(500, {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "Cache-Control",
			});
		}

		const errorEvent = {
			type: "error" as const,
			stage: "error" as any,
			data: {
				message: (error as Error).message,
				code: "ANALYSIS_ERROR",
				stage: "error",
				retryable: false,
			},
			timestamp: new Date(),
		};

		const message = createSSEMessage(errorEvent);
		res.write(message);
		res.end();
	}
});

router.use("/analyses", analysesRouter);

export const analysisRouter = router;
