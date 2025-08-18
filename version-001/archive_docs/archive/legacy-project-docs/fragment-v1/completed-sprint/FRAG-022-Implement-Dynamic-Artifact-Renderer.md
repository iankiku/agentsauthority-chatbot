# FRAG-022 – Implement Dynamic Artifact Renderer (Fragment)

## 🚧 Status: COMPLETED

## Priority: High

## Effort: Medium

## Owner: AI / Junior Engineer

---

## 🎯 OBJECTIVE

Implement a dynamic `ArtifactRenderer` component in `apps/fragment` that can
intelligently parse the incoming Server-Sent Event (SSE) stream from the Mastra
chat proxy (`FRAG-017`) and render the appropriate chromeless UI artifact
component based on the `type` field in the structured `AgentArtifactResponse`.
This component will ensure that only one primary artifact is displayed per
message/block.

---

## 🔑 KEY TASKS

1.  **Create New Renderer Component File**:
    - Location: `apps/fragment/components/artifacts/ArtifactRenderer.tsx`
2.  **Import Artifact Components and Schemas**:
    - Import all chromeless UI artifact components (e.g., `DataTable`,
      `LineChart`, `GeoScoreCard`, `RecommendationsCard`) from
      `packages/ui/src/components/custom/artifacts/`.
    - Import `AgentArtifactResponse` type and `isArtifactType` helper from
      `apps/agents-mastra/mastra/schemas/artifactSchemas` (assuming
      `shared-types` will re-export these for `fragment`).
3.  **Implement `ArtifactRenderer` Logic**:
    - The component will receive `messages` (from `useChat` or similar) as a
      prop.
    - It needs to iterate through the `messages` and identify the latest
      `toolInvocations` that have a `result` containing an
      `AgentArtifactResponse`.
    - **Crucially**: Only render the _latest_ valid `AgentArtifactResponse`
      encountered. If a message contains multiple `toolInvocations` or if
      previous messages also had artifacts, ensure only the most recent one is
      actively displayed to adhere to the "one artifact per block" rule. Text
      messages should be displayed as usual, but the artifact takes precedence
      when present.
    - Use a `switch` statement or a lookup map to dynamically select the correct
      chromeless UI artifact component based on `artifact.type`.
    - Pass the `artifact.data` to the selected component as props.
4.  **Error Handling for Invalid Artifacts**:
    - If an incoming artifact payload does not match its expected schema (which
      should be prevented by `artifactCreator` but is a good safeguard), display
      a generic error message or a fallback component.

### Example Sketch:

```tsx
// apps/fragment/components/artifacts/ArtifactRenderer.tsx
"use client";

import React from "react";
import { Message } from "ai"; // Assuming AI SDK message structure
import { AgentArtifactResponse, isArtifactType } from "@workspace/shared-types"; // Will be updated to re-export

// Import your chromeless UI artifact components
import { GeoScoreCard } from "@workspace/ui/src/components/custom/artifacts/GeoScoreCard";
import { RecommendationsCard } from "@workspace/ui/src/components/custom/artifacts/RecommendationsCard";
import { DataTable } from "@workspace/ui/src/components/custom/artifacts/DataTable";
import { LineChart } from "@workspace/ui/src/components/custom/artifacts/LineChart";

const ARTIFACT_COMPONENTS: Record<string, React.ComponentType<any>> = {
	"geo-score-card": GeoScoreCard,
	"recommendations-card": RecommendationsCard,
	"data-table": DataTable,
	"line-chart": LineChart,
};

interface ArtifactRendererProps {
	messages: Message[];
}

export function ArtifactRenderer({ messages }: ArtifactRendererProps) {
	let latestArtifact: AgentArtifactResponse | null = null;

	// Find the latest artifact in the messages array
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		if (message.role === "tool" && message.toolInvocations) {
			for (const invocation of message.toolInvocations) {
				if (
					"result" in invocation &&
					typeof invocation.result === "object" &&
					invocation.result !== null
				) {
					const potentialArtifact = invocation.result as AgentArtifactResponse;
					if (isArtifactType(potentialArtifact.type)) {
						latestArtifact = potentialArtifact;
						break; // Found the latest, stop searching this message's invocations
					}
				}
			}
		}
		if (latestArtifact) break; // Found the latest artifact overall, stop searching messages
	}

	if (!latestArtifact) {
		return null; // No artifact to render
	}

	const Component = ARTIFACT_COMPONENTS[latestArtifact.type];

	if (!Component) {
		console.error(
			`No rendering component found for artifact type: ${latestArtifact.type}`
		);
		return <div className="text-red-500">Error: Unknown artifact type.</div>;
	}

	try {
		return <Component data={latestArtifact.data} />;
	} catch (error) {
		console.error(
			`Error rendering artifact type ${latestArtifact.type}:`,
			error
		);
		return <div className="text-red-500">Error rendering artifact.</div>;
	}
}
```

---

## ✅ ACCEPTANCE CRITERIA

- A new file `apps/fragment/components/artifacts/ArtifactRenderer.tsx` is
  created.
- The `ArtifactRenderer` correctly identifies and renders the _latest_
  structured `AgentArtifactResponse` from the `messages` prop.
- It correctly maps `artifact.type` to the corresponding chromeless UI
  component.
- The selected UI component receives the `artifact.data` as its `data` prop.
- The component adheres to the "one artifact per block" rule, displaying only
  the most recent artifact.
- Basic error handling for unknown artifact types or rendering failures is in
  place.
- No UI chrome (borders, titles) is added by this renderer; it only renders the
  chromeless artifact components.

---

## 🕒 ESTIMATE

2 dev-days

---

## 🔗 CONTEXT & REFERENCES

- **Plan**: Phase 1, Task 1.6: Implement Dynamic Artifact Renderer
- **Technical Design**: `TECH.md` section "5. Mastra Agent-Driven UI Artifacts
  (NEW)" (specifically "Unified Chat Block Rendering" point)
- **Related Tickets**: `FRAG-017` (Mastra Chat Proxy) will provide the SSE
  stream; `FRAG-018` (Define UI Artifact Schemas) provides the types; `FRAG-021`
  (Create Chromeless UI Artifact Components) provides the components to render.
