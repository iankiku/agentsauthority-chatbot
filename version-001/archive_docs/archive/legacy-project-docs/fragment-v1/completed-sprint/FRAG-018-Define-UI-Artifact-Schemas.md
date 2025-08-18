# FRAG-018 – Define UI Artifact Schemas in Agents-Mastra

## 🚧 Status: COMPLETED

## Priority: High

## Effort: Medium

## Owner: AI / Junior Engineer

---

## 🎯 OBJECTIVE

Define the canonical Zod schemas for all UI artifacts within
`apps/agents-mastra`. These schemas will serve as the single source of truth for
the structure of data that agents generate and `fragment`'s UI consumes. This
ensures type safety and consistency across the entire agent-to-UI pipeline.

---

## 🔑 KEY TASKS

1.  **Create New Schemas File**:
    - Location: `apps/agents-mastra/mastra/schemas/artifactSchemas.ts`
2.  **Define Base Artifact Schema**:
    - Create a `BaseArtifactSchema` that includes common properties like `type`
      (e.g., `"data-table"`, `"line-chart"`, `"geo-score-card"`,
      `"recommendations-card"`) and `data` (an `object` holding the
      artifact-specific payload).
    - Include a `metadata` field for optional information like `agentName`,
      `toolUsed`, `timestamp`, etc.
3.  **Define Specific Artifact Schemas**:
    - Based on our plan and `PRODUCT_REQUIREMENTS.md`, define Zod schemas for at
      least the following initial artifacts:
      - `DataTableSchema`: For tabular data (e.g., competitive analysis).
      - `LineChartSchema`: For line graph data.
      - `GeoScoreCardSchema`: For the GEO Score Card artifact (as described in
        `PRODUCT_REQUIREMENTS.md`).
      - `RecommendationsCardSchema`: For actionable recommendations (as
        described in `PRODUCT_REQUIREMENTS.md`).
    - These should extend `BaseArtifactSchema` and define the precise `data`
      structure expected by the corresponding UI components in `packages/ui`.
4.  **Create a Union Type for All Artifacts**:
    - Define an `AgentArtifactResponseSchema` as a Zod union (`z.union([...])`)
      of all individual artifact schemas. This will be used by the
      `supervisorAgent.stream()` method to ensure the output conforms to one of
      the defined artifact types.
5.  **Export Schemas and Types**:
    - Export all defined schemas and their inferred TypeScript types for easy
      import and use in other parts of `agents-mastra` and `fragment`.

---

## ✅ ACCEPTANCE CRITERIA

- A new file `apps/agents-mastra/mastra/schemas/artifactSchemas.ts` is created.
- `BaseArtifactSchema` is defined with common artifact properties.
- `DataTableSchema`, `LineChartSchema`, `GeoScoreCardSchema`, and
  `RecommendationsCardSchema` are defined with their specific data structures.
- `AgentArtifactResponseSchema` is defined as a Zod union of all artifact
  schemas.
- All schemas and their inferred types are correctly exported.
- The schemas accurately reflect the data structures needed by the UI components
  and will facilitate type-safe communication between agents and UI.

---

## 🕒 ESTIMATE

2 dev-days

---

## 🔗 CONTEXT & REFERENCES

- **Plan**: Phase 1, Task 1.2: Define Artifact Schemas in `apps/agents-mastra`
- **Technical Design**: `TECH.md` section "5. Mastra Agent-Driven UI Artifacts
  (NEW)" (specifically the "Artifact Schemas" point)
- **Mastra Docs**: Reference section on "Structured Output" for using Zod
  schemas with agents.
- **Related Tickets**: `FRAG-017` (Mastra Chat Proxy) will consume these
  schemas; `FRAG-019` (Artifact Creator Utility) will use them for validation.
