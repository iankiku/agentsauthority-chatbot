import { createStep, createWorkflow } from "@mastra/core/workflows";
import { v4 as uuidv4 } from "uuid";

import { z } from "zod";

/** 1️⃣ Normalize input URL */
const inputStep = createStep({
	id: "input",
	inputSchema: z.object({
		url: z.string().url(),
		prompt: z.string().optional(),
	}),
	outputSchema: z.object({
		url: z.string().url(),
		prompt: z.string().optional(),
	}),
	execute: async ({ inputData }) => {
		console.log("inputData from inputStep", inputData);

		const { url, prompt } = inputData;
		const trimmedUrl = url.trim();

		return { url: trimmedUrl, prompt: prompt };
	},
});

/** 2️⃣ Map & Crawl: build site map and fetch page HTML */
const mapAndCrawlStep = createStep({
	id: "mapAndCrawl",
	inputSchema: z.object({
		url: z.string().url(),
		prompt: z.string().optional(),
	}),
	outputSchema: z.object({
		url: z.string().url(),
		crawledData: z.object({
			linksArray: z.array(z.string()),
			content: z.array(
				z.object({ url: z.string(), content: z.string().optional() })
			),
		}),
	}),
	execute: async ({ inputData, runtimeContext }) => {
		const { url } = inputData;

		// Return placeholder data since Firecrawl tools were removed
		return {
			url,
			crawledData: {
				linksArray: [],
				content: [],
			},
		};
	},
});

/** 3️⃣ Deep Research: get broader context (Firecrawl dependency removed) */
const deepResearchStep = createStep({
	id: "deepResearch",
	inputSchema: z.object({
		url: z.string().url(),
		crawledData: z.object({
			linksArray: z.array(z.string()),
			content: z.array(
				z.object({ url: z.string(), content: z.string().optional() }) // Changed url to be required
			),
		}),
	}),
	outputSchema: z.object({
		url: z.string().url(),
		crawledData: z.any(),
		researchData: z.any(),
	}),
	execute: async ({ inputData, runtimeContext }) => {
		const { url, crawledData } = inputData;

		// Return placeholder data since Firecrawl tools were removed
		return { url, crawledData, researchData: {} };
	},
});

/** 🔄 Orchestrate the full pipeline */
export const dataGatheringWorkflow = createWorkflow({
	id: "data-gathering-workflow-" + uuidv4(),
	description:
		"Crawl a website and perform deep research to gather comprehensive data.",
	inputSchema: inputStep.inputSchema,
	outputSchema: deepResearchStep.outputSchema,
})
	.then(inputStep)
	.then(mapAndCrawlStep)
	.then(deepResearchStep)
	.commit();
