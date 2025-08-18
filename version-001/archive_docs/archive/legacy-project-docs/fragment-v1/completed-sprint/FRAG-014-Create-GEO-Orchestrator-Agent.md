# FRAG-014: Create GEO Orchestrator Agent

## 🚧 Status: In Progress

## Overview

Create a GEO (Generative Engine Optimization) Orchestrator Agent that
coordinates the specialist agents and synthesizes their findings into
comprehensive reports. This agent will serve as the master controller for the
GEO suite, managing the execution of specialist agents and combining their
outputs into actionable insights.

## Business Value

- Provides a unified interface for running GEO analyses
- Enables comprehensive reports that combine insights from multiple specialist
  agents
- Simplifies the integration of GEO capabilities into the main application
- Delivers actionable recommendations with prioritization

## Technical Details

### Requirements

1. Create a new orchestrator agent in
   `apps/agents-mastra/mastra/agents/geoOrchestratorAgent.ts`
2. Implement a tool that coordinates the execution of specialist agents
3. Implement logic to synthesize findings from multiple agents
4. Update the geoAnalysisWorkflow to use the new orchestrator agent

### Implementation Details

#### 1. Orchestrator Tool Schema

Define input and output schemas for the orchestration tool:

```typescript
// Input schema
const orchestrationInput = z.object({
	url: z.string().url(),
	analysisType: z.enum([
		"full",
		"quick",
		"content-focus",
		"technical-focus",
		"brand-focus",
		"ai-readiness",
	]),
	competitors: z.array(z.string().url()).optional(),
	industry: z.string().optional(),
	brandValues: z.array(z.string()).optional(),
	priorityAreas: z.array(z.string()).optional(),
});

// Output schema
const orchestrationOutput = z.object({
	geoScore: z.number(), // 0-100 overall score
	summary: z.string(),
	keyFindings: z.array(z.string()),
	recommendations: z.array(
		z.object({
			area: z.string(),
			action: z.string(),
			priority: z.enum(["critical", "high", "medium", "low"]),
			impact: z.enum(["high", "medium", "low"]),
			effort: z.enum(["high", "medium", "low"]),
		})
	),
	detailedReports: z.record(z.string(), z.any()),
	nextSteps: z.array(z.string()),
});
```

#### 2. Agent Selection Logic

Implement logic to determine which specialist agents to run based on the
analysis type:

```typescript
function determineAgentsToRun(analysisType: string): string[] {
	switch (analysisType) {
		case "full":
			return [
				"Content Cluster Specialist",
				"Brand Monitor",
				"Topical Depth Analyzer",
				"Prompt Simulator",
				"Static Render Specialist",
				"AI Copywriter",
				"Prompt Trend Analyst",
				"AI Readiness Evaluator",
			];
		case "quick":
			return ["Topical Depth Analyzer", "AI Readiness Evaluator"];
		// ... other analysis types
	}
}
```

#### 3. Agent Execution

Implement logic to execute specialist agents with appropriate inputs:

```typescript
async function runSpecialistAgent(agentName: string, input: any): Promise<any> {
	// Map agent name to the actual agent instance
	const agentMap: Record<string, Agent> = {
		"Content Cluster Specialist": contentClusterAgent,
		"Brand Monitor": brandMonitorAgent,
		// ... other agents
	};

	const agent = agentMap[agentName];
	if (!agent) {
		throw new Error(`Agent not found: ${agentName}`);
	}

	// Prepare agent-specific input
	const agentInput = prepareAgentInput(agentName, input);

	// Run the agent
	// For now, return mock results
	return mockAgentResult(agentName, input);
}
```

#### 4. Results Synthesis

Implement logic to synthesize results from multiple specialist agents:

```typescript
function synthesizeResults(
	detailedReports: Record<string, any>,
	input: any
): {
	summary: string;
	keyFindings: string[];
	recommendations: any[];
	nextSteps: string[];
} {
	// Analyze the results from all agents and generate a comprehensive synthesis
	// ... implementation details
}
```

#### 5. GEO Score Calculation

Implement logic to calculate the overall GEO score:

```typescript
function calculateOverallScore(detailedReports: Record<string, any>): number {
	// Calculate a weighted average of scores from all agents
	// ... implementation details
}
```

#### 6. Orchestrator Agent Definition

Create the GEO Orchestrator Agent:

```typescript
export const geoOrchestratorAgent = new Agent({
	name: "GEO Orchestrator Agent",
	instructions: () => `
    You are the master orchestrator for the Generative Engine Optimization (GEO) suite.
    
    Your role is to coordinate specialist agents and synthesize their findings into comprehensive reports.
    
    // ... detailed instructions
  `,
	...getConfig(
		"GEO Orchestrator Agent",
		getAgentType("GEO Orchestrator Agent")
	),
	tools: { geoOrchestratorTool },
});
```

#### 7. Workflow Integration

Update the geoAnalysisWorkflow to use the new orchestrator agent:

```typescript
// Add a step to the workflow that uses the orchestrator
.then(
	createStep({
		id: "geoOrchestration",
		// ... configuration
		execute: async ({ inputData }) => {
			return geoOrchestratorTool.handler(inputData);
		},
		// ... input mapping
	})
)
```

### Testing

- Test the orchestrator with different analysis types
- Test the synthesis of results from multiple agents
- Test the calculation of the overall GEO score
- Test the integration with the geoAnalysisWorkflow

## Acceptance Criteria

- [x] GEO Orchestrator Agent is implemented in
      `apps/agents-mastra/mastra/agents/geoOrchestratorAgent.ts`
- [x] Orchestration tool is implemented with appropriate input and output
      schemas
- [x] Agent selection logic is implemented for different analysis types
- [x] Results synthesis logic is implemented
- [x] GEO score calculation logic is implemented
- [x] geoAnalysisWorkflow is updated to use the new orchestrator agent
- [x] Documentation is added to explain how to use the orchestrator agent

## Dependencies

- [x] FRAG-013 (Agent Configuration Service)

## Estimated Effort

- 6 hours

## Notes

- This ticket builds on FRAG-013 (Agent Configuration Service)
- The initial implementation uses mock results for specialist agents
- Future enhancements will include real agent execution and more sophisticated
  synthesis logic
