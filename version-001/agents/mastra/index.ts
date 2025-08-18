import { weatherAgent } from "@/mastra/agents/weather-agent";
import { storageKlass } from "@/mastra/config/memory";
import { dataGatheringWorkflow } from "@/mastra/workflows/dataGatheringWorkflow";
import { weatherWorkflow } from "@/mastra/workflows/weather-workflow";
import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { analysisExpertAgent } from "./agents/analysisAgent";
import { chatAgent, plannerAgent } from "./agents/assistants";
import { brandAnalysisAgent } from "./agents/brandAnalysisAgent";
import {
	aiCopywriterAgent,
	brandMonitorAgent,
	keywordClusterAgent,
	promptSimulatorAgent,
} from "./agents/geoSuiteAgents";
import { visibilityAnalysisAgent } from "./agents/visibilityAnalysisAgent";

// ===== AGENTS =====
export const mastra = new Mastra({
	agents: {
		weatherAgent,
		// roastMyWebsiteAgent,
		visibilityAnalysisAgent,
		brandAnalysisAgent,
		analysisExpertAgent,
		chatAgent,
		plannerAgent,
		// supervisorAgent,
		aiCopywriterAgent,
		brandMonitorAgent,
		keywordClusterAgent,
		promptSimulatorAgent,
	},
	// ===== Workflows =====
	workflows: { weatherWorkflow, dataGatheringWorkflow },
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	storage: storageKlass,

	// ===== MCP Servers =====
	// mcpServers: {
	// 	fragment_mcp_server,
	// },

	// ===== Server =====
	server: {
		build: {
			swaggerUI: true,
		},
		// port: 8080,
		// host: "0.0.0.0",
	},
});
