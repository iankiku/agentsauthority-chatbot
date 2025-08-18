# FRAG-019 – Create Artifact Creator Utility in Agents-Mastra

## 🚧 Status: COMPLETED

## Priority: High

## Effort: Medium

## Owner: AI / Junior Engineer

---

## 🎯 OBJECTIVE

Create a utility function in `apps/agents-mastra` that simplifies the creation
and validation of UI artifact payloads before they are streamed to the
`fragment` frontend. This utility will ensure that agents consistently generate
well-formed, type-safe artifact data.

---

## 🔑 KEY TASKS

1.  **Create New Utility File**:
    - Location: `apps/agents-mastra/lib/artifactCreator.ts`
2.  **Import Schemas**:
    - Import all necessary artifact schemas from
      `../mastra/schemas/artifactSchemas.ts`.
3.  **Implement `createArtifactResponse` Function**:
    - This function will take `type` (e.g., `"data-table"`), the artifact `data`
      payload, and optional `metadata` as input.
    - It will use the appropriate Zod schema (dynamically selected based on the
      `type`) to validate the incoming `data`.
    - If validation passes, it will return a structured object conforming to
      `AgentArtifactResponseSchema`.
    - If validation fails, it should throw a clear error, indicating the schema
      mismatch.
4.  **Implement `isArtifactType` Helper**:
    - Add a helper function to check if a given string is a valid artifact type.
5.  **Export Utility**:
    - Export the `createArtifactResponse` function and the helper function.

### Example Implementation Sketch:

```typescript
// apps/agents-mastra/lib/artifactCreator.ts
import { z } from "zod";
import {
	AgentArtifactResponseSchema,
	DataTableSchema,
	LineChartSchema,
	GeoScoreCardSchema,
	RecommendationsCardSchema,
	ArtifactType,
} from "../mastra/schemas/artifactSchemas";

const ARTIFACT_SCHEMAS = {
	"data-table": DataTableSchema,
	"line-chart": LineChartSchema,
	"geo-score-card": GeoScoreCardSchema,
	"recommendations-card": RecommendationsCardSchema,
};

export function createArtifactResponse<T extends ArtifactType>(
	type: T,
	data: z.infer<(typeof ARTIFACT_SCHEMAS)[T]>,
	metadata?: any
) {
	const schema = ARTIFACT_SCHEMAS[type];
	if (!schema) {
		throw new Error(`Unknown artifact type: ${type}`);
	}

	const validatedData = schema.shape.data.parse(data); // Validate only the data payload

	return AgentArtifactResponseSchema.parse({
		type: type,
		data: validatedData,
		metadata: metadata || {},
	});
}

export function isArtifactType(type: string): type is ArtifactType {
	return type in ARTIFACT_SCHEMAS;
}
```

---

## ✅ ACCEPTANCE CRITERIA

- A new file `apps/agents-mastra/lib/artifactCreator.ts` is created.
- The `createArtifactResponse` function correctly validates artifact data
  against the defined Zod schemas.
- The function throws an error if the data does not conform to the schema.
- The function returns a valid `AgentArtifactResponse` object upon successful
  validation.
- The `isArtifactType` helper correctly identifies valid artifact types.
- All necessary schemas are imported and used correctly.

---

## 🕒 ESTIMATE

1.5 dev-days

---

## 🔗 CONTEXT & REFERENCES

- **Plan**: Phase 1, Task 1.3: Create Artifact Creator Utility
- **Technical Design**: `TECH.md` section "5. Mastra Agent-Driven UI Artifacts
  (NEW)" (specifically the "Artifact Creator Utility" point)
- **Related Tickets**: `FRAG-018` (Define UI Artifact Schemas) is a
  prerequisite; `FRAG-020` (Supervisor Agent Artifact Integration) will consume
  this utility.
