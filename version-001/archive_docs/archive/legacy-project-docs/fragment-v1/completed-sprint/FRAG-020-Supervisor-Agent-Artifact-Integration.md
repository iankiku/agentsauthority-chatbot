# FRAG-020 – Supervisor Agent Artifact Integration

## 🚧 Status: COMPLETED

## Priority: High

## Effort: Medium

## Owner: AI / Junior Engineer

---

## 🎯 OBJECTIVE

Modify the `supervisorAgent` in `apps/agents-mastra` to leverage the new
artifact schemas and the `createArtifactResponse` utility. The agent should be
able to generate and emit structured UI artifact data (e.g., `GeoScoreCard`,
`RecommendationsCard`) directly as part of its streaming response, replacing
previous text-only or unstructured outputs for these insights.

---

## 🔑 KEY TASKS

1.  **Import Artifact Utility and Schemas**:
    - In `apps/agents-mastra/mastra/agents/supervisors.ts` (or the relevant
      supervisor agent file), import `createArtifactResponse` from
      `../../lib/artifactCreator` and the necessary artifact schemas (e.g.,
      `GeoScoreCardSchema`, `RecommendationsCardSchema`) from
      `../schemas/artifactSchemas`.
2.  **Integrate `createArtifactResponse` for Artifact Generation**:
    - Identify the logic within the `supervisorAgent` (or its tools/workflows)
      that currently generates text-based summaries or unstructured data for GEO
      scores and recommendations.
    - Refactor this logic to call `createArtifactResponse` with the appropriate
      artifact type and data. For example, instead of returning a string for a
      GEO score, call
      `createArtifactResponse("geo-score-card", { overallScore: 8.5, platformBreakdown: {...} })`.
    - Ensure the data passed to `createArtifactResponse` strictly conforms to
      the respective Zod schemas defined in `artifactSchemas.ts`.
3.  **Ensure Streaming with Structured Output**:
    - Verify that `supervisorAgent.stream()` is configured to use the `output`
      option with `AgentArtifactResponseSchema` (this might already be handled
      by `FRAG-017`'s proxy, but double-check that the agent itself is aware of
      the structured output requirement).
4.  **Update Agent's `instructions` and `tools` (if necessary)**:
    - Adjust the `supervisorAgent`'s `instructions` to guide it towards
      generating structured artifacts where appropriate (e.g., "When summarizing
      the GEO analysis, provide a structured GEO Score Card artifact.").
    - If specific tools within the supervisor's toolset are responsible for
      generating these insights, ensure those tools use
      `createArtifactResponse`.

### Example Sketch (Illustrative - actual implementation might vary based on agent logic):

```typescript
// apps/agents-mastra/mastra/agents/supervisors.ts (or relevant agent logic)
import { Agent } from "@mastra/core/agent";
import { createArtifactResponse } from "../../lib/artifactCreator";
import {
	GeoScoreCardSchema,
	RecommendationsCardSchema,
	AgentArtifactResponseSchema,
} from "../schemas/artifactSchemas";
import { openai } from "@ai-sdk/openai";

// Assuming a tool or internal logic computes a GEO score
async function generateGeoScoreArtifact(analysisResult: any) {
	// ... complex logic to derive score and breakdown from analysisResult ...
	const geoScoreData = {
		overallScore: analysisResult.score.overall,
		platformBreakdown: analysisResult.score.byPlatform,
		// ... other data conforming to GeoScoreCardSchema.shape.data
	};
	return createArtifactResponse("geo-score-card", geoScoreData);
}

// Assuming a tool or internal logic computes recommendations
async function generateRecommendationsArtifact(recs: any[]) {
	const recommendationsData = recs.map((rec) => ({
		title: rec.title,
		description: rec.description,
		impact: rec.impact,
		category: rec.category,
		actionItems: rec.actionItems,
	}));
	return createArtifactResponse("recommendations-card", {
		recommendations: recommendationsData,
	});
}

export const supervisorAgent = new Agent({
	name: "Supervisor Agent",
	instructions: `
    You are the primary interface for users, orchestrating responses and providing structured insights.
    When a GEO analysis is completed, output a 'geo-score-card' artifact.
    When recommendations are available, output a 'recommendations-card' artifact.
    Ensure all outputs are well-structured and adhere to their defined schemas.
  `,
	model: openai("gpt-4o"),
	// ... other configs ...
	tools: {
		// ... existing tools ...
		generateGeoScore: {
			// Example tool that might generate the artifact
			description: "Generates a structured GEO Score Card artifact.",
			schema: GeoScoreCardSchema.omit({ type: true, metadata: true }), // Only input data for this tool
			execute: async (input) => generateGeoScoreArtifact(input),
		},
		generateRecommendations: {
			// Example tool that might generate the artifact
			description: "Generates structured recommendations card artifact.",
			schema: RecommendationsCardSchema.omit({ type: true, metadata: true }), // Only input data for this tool
			execute: async (input) => generateRecommendationsArtifact(input),
		},
	},
});
```

---

## ✅ ACCEPTANCE CRITERIA

- The `supervisorAgent` (or its underlying tools/logic) is updated to use
  `createArtifactResponse` for generating GEO Score and Recommendations
  artifacts.
- The generated artifact data strictly conforms to `GeoScoreCardSchema` and
  `RecommendationsCardSchema` (as validated by `createArtifactResponse`).
- The `supervisorAgent.stream()` method (or the proxy in `FRAG-017`)
  successfully streams these structured artifacts alongside regular text.
- No manual JSON stringification of artifacts occurs directly within the agent
  or its tools; `createArtifactResponse` is the single point for this.
- The agent's instructions are updated to reflect its new capability of emitting
  structured artifacts.

---

## 🕒 ESTIMATE

2.5 dev-days

---

## 🔗 CONTEXT & REFERENCES

- **Plan**: Phase 1, Task 1.4: Update Supervisor Agent to Emit Artifacts
- **Technical Design**: `TECH.md` section "5. Mastra Agent-Driven UI Artifacts
  (NEW)" (specifically "Supervisor Agent Streaming" and "Agent Tools" points)
- **Related Tickets**: `FRAG-018` (Define UI Artifact Schemas) and `FRAG-019`
  (Artifact Creator Utility) are prerequisites; `FRAG-017` (Mastra Chat Proxy)
  will handle streaming these outputs.
