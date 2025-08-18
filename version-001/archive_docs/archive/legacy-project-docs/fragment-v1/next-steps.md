# Next Steps for Fragment MVP

Based on the analysis of the current codebase against the project vision, here is the recommended plan to achieve a functional MVP.

## High-Level Goal

The primary objective is to deliver the core user journey outlined in the pitch deck: **Scan a user's site, Score its AI visibility, and provide actionable Fixes.** This requires orchestrating the existing agents and tools into end-to-end workflows.

## Recommended Implementation Plan

### 1. Implement the `MultiLLMScanWorkflow`
This workflow is the foundation of the "Scan" feature.

-   **Objective:** Systematically query major AI engines (ChatGPT, Gemini, etc.) for a given business and set of keywords.
-   **Inputs:** Business name, website URL, target keywords.
-   **Core Logic:**
    1.  Iterate through each target AI engine and keyword.
    2.  Use the `webSearchTool` to perform the queries.
    3.  Parse search results to identify mentions, rank, and context.
-   **Output:** An aggregated `aiEngineResults` object, matching the `GEOVisibilityInput` schema.

### 2. Implement the `ScoringWorkflow`
This workflow delivers the "Score" feature by processing the scan results.

-   **Objective:** Calculate a GEO visibility score and package it for the UI.
-   **Input:** The `aiEngineResults` object from the `MultiLLMScanWorkflow`.
-   **Core Logic:**
    1.  Execute the `geoVisibilityScorer` tool.
    2.  Use the `createArtifactResponse` utility to format the result.
-   **Output:** A `geo-score-card` UI artifact.

### 3. Implement the `RecommendationAgent`
This agent provides the actionable "Fix" widgets, which is a core value proposition.

-   **Objective:** Generate context-aware recommendations to improve a user's GEO score.
-   **Input:** The full analysis context (scan results, score, etc.).
-   **Core Logic:**
    1.  Analyze the inputs to diagnose the root causes of poor visibility.
    2.  Generate specific, high-impact recommendations (e.g., "Add this FAQ to your homepage," "Implement this schema markup").
    3.  Use the `aiCopywritingTool` if necessary to generate content snippets.
-   **Output:** A `recommendations-card` UI artifact.

### 4. Create the `GEOAnalysisOrchestratorWorkflow`
This master workflow ties all the components together into a single, seamless user experience.

-   **Objective:** Orchestrate the entire Scan -> Score -> Fix process.
-   **Input:** User's initial request (business name, website).
-   **Core Logic:**
    1.  Call `MultiLLMScanWorkflow`.
    2.  Pipe the results to `ScoringWorkflow`.
    3.  Pipe the combined results to `RecommendationAgent`.
    4.  Assemble all generated UI artifacts (`geo-score-card`, `recommendations-card`, etc.).
-   **Output:** A final `dashboard-layout` UI artifact, ready to be rendered on the frontend.

By focusing on these four components, we can rapidly develop a functional and compelling MVP that directly addresses the core user needs outlined in the project vision.
