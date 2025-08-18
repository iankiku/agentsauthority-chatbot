#!/usr/bin/env node
import { MCPServer } from "@mastra/mcp";
import { weatherTool } from "../tools/weather-tool";

export const fragment_mcp_server = new MCPServer({
	name: "fragment-mcp-server",
	version: "1.0.0",
	tools: { weatherTool },
});

// server.startStdio().catch((error) => {
// 	console.error("Error running MCP server:", error);
// 	process.exit(1);
// });
