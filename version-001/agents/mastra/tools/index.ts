/**
 * Export all tools from the mastra directory
 */

/* ---------------------------------------------------------------------------
   GEO Suite Tools
   --------------------------------------------------------------------------- */
export * from "./geoSuiteTools";

/* exported members are below
 * GEO Specialist Tools:
 * - keywordClusterTool
 * - brandMentionTool
 * - topicalDepthTool
 * - promptSimTool
 * - staticRenderTool
 * - aiCopywritingTool
 * - promptTrendTool
 * - aiReadinessGraderTool
 *
 * Complete Collection:
 * - geoSuiteTools
 */

/* ---------------------------------------------------------------------------
   Analysis Tools
   --------------------------------------------------------------------------- */
export * from "./analysisTools";

/* exported members are below
 * Core Analysis Tools:
 * - imageAnalysisTool
 * - synthesizeTool
 * - widgetTool
 * - chartTool
 * - competitorFinderTool
 * - sentimentTool
 * - visibilityScoreTool
 * - opportunityTool
 */

/* ---------------------------------------------------------------------------
   Weather Tool
   --------------------------------------------------------------------------- */
export * from "./weather-tool";

/* exported members are below
 * Web Scraping Tools:
 * - scanWebsiteTool
 * - htmlTool
 * - rawHtmlTool
 * - linksTool
 * - screenshotTool
 */

/* ---------------------------------------------------------------------------
   Workflow Tools
   --------------------------------------------------------------------------- */
// export * from "./triggers"; // REMOVED as no longer needed

/* exported members are below
 * Workflow Management:
 * - startWorkflowTool
 */

/* ---------------------------------------------------------------------------
   Tool Collections
   --------------------------------------------------------------------------- */
// Export convenient tool collections for easy access
export const allTools = {
	// GEO suite tools
	...require("./geoSuiteTools").geoSuiteTools,

	// Analysis tools
	imageAnalysisTool: require("./analysisTools").imageAnalysisTool,
	synthesizeTool: require("./analysisTools").synthesizeTool,
	widgetTool: require("./analysisTools").widgetTool,
	chartTool: require("./analysisTools").chartTool,
	competitorFinderTool: require("./analysisTools").competitorFinderTool,
	sentimentTool: require("./analysisTools").sentimentTool,
	visibilityScoreTool: require("./analysisTools").visibilityScoreTool,
	opportunityTool: require("./analysisTools").opportunityTool,

	// Workflow tools
	// startWorkflowTool: require("./startWorkflowTool").startWorkflowTool, // REMOVED

	// Weather tool
	weatherTool: require("./weather-tool").weatherTool,
};

/**
 * Get tools by category
 */
export const getToolsByCategory = (category: string) => {
	const categories = {
		planning: ["taskPlanningTool", "taskDecompositionTool"],
		supervision: [
			"agentCoordinationTool",
			"taskRoutingTool",
			"executionMonitoringTool",
		],
		review: [
			"qualityAssessmentTool",
			"complianceValidationTool",
			"performanceReviewTool",
		],
		orchestration: ["geoOrchestratorTool"],
		geoSuite: [
			"keywordClusterTool",
			"brandMentionTool",
			"topicalDepthTool",
			"promptSimTool",
			"staticRenderTool",
			"aiCopywritingTool",
			"promptTrendTool",
			"aiReadinessGraderTool",
		],
		analysis: [
			"imageAnalysisTool",
			"synthesizeTool",
			"widgetTool",
			"chartTool",
			"competitorFinderTool",
			"sentimentTool",
			"visibilityScoreTool",
			"opportunityTool",
		],
		web: [
			"scanWebsiteTool",
			"htmlTool",
			"rawHtmlTool",
			"linksTool",
			"screenshotTool",
		],
		// workflow: ["startWorkflowTool"], // REMOVED
	};

	return categories[category as keyof typeof categories] || [];
};

/**
 * Get all available tool names
 */
export const getAvailableTools = () => {
	return Object.keys(allTools);
};
