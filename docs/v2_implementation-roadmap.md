# Implementation Roadmap v2: Building the MVP

This document provides a week-by-week, actionable checklist for the engineering team to build and deliver the "Living Dashboard" MVP as defined in the PRD v2.

**Project Goal:** Deliver a functional MVP in 3 weeks, proving the core concept of a chat interface that generates persistent artifacts.

---

### **Week 1: The Canvas - Building the Foundation**

**Goal:** Create the persistent back-end and the front-end rendering canvas. By the end of this week, a developer should be able to manually insert an artifact into the database and see it appear on the UI.

#### **Day 1-2: Database & Schema**

-   [ ] **Task:** Define the `artifacts` table schema in Drizzle (`/lib/db/schema.ts`) as specified in the Technical Docs v2.
-   [ ] **Task:** Generate the SQL migration file for the new table.
-   [ ] **Task:** Apply the migration to the development database to create the `artifacts` table.
-   [ ] **Verification:** Use Drizzle Studio to manually add a sample artifact record to the table and confirm it saves correctly.

#### **Day 3: API Endpoints**

-   [ ] **Task:** Create a new API route `GET /api/artifacts` that fetches all artifacts for the authenticated user from the database.
-   [ ] **Task:** Create a new API route `POST /api/artifacts` that allows for creating a new artifact (for testing purposes).
-   [ ] **Task:** Implement user authentication checks for both endpoints.
-   [ ] **Verification:** Use a tool like Postman or `curl` to test both endpoints. Confirm you can create and retrieve artifacts.

#### **Day 4-5: Frontend Canvas**

-   [ ] **Task:** Create the main `UniversalCanvas.tsx` component.
-   [ ] **Task:** Use a data-fetching hook (e.g., `useSWR` or React Query) within the canvas to call the `GET /api/artifacts` endpoint.
-   [ ] **Task:** Create a placeholder `ArtifactCard.tsx` component that receives the artifact data and displays its raw JSON content for now.
-   [ ] **Task:** Implement a loading state for the canvas while data is being fetched.
-   [ ] **Verification:** Load the application. The canvas should fetch and display the JSON of any manually-created artifacts from the database.

---

### **Week 2: The First Tool - Making the Canvas Live**

**Goal:** Integrate the `keywordClusterTool` so that a user's query can generate a new, persistent artifact automatically.

#### **Day 1-2: Tool Migration**

-   [ ] **Task:** Create the `lib/ai/tools/keyword-cluster-tool.ts` file.
-   [ ] **Task:** Define the Zod schemas for the tool's `parameters` and the structured `output` as specified in the Technical Docs v2.
-   [ ] **Task:** Implement the tool's `execute` function, lifting the core LLM prompt logic from the Mastra agent implementation.
-   [ ] **Task:** Write a standalone test script to invoke the tool directly and ensure it returns the expected JSON output.

#### **Day 3-4: Backend Integration**

-   [ ] **Task:** Modify the `POST /api/chat` API route.
-   [ ] **Task:** Add the `keywordClusterTool` to the `tools` object in the `streamText` call.
-   [ ] **Task:** Add the `onToolCall` or `onFinish` logic to check for `toolResult`.
-   [ ] **Task:** When the `keywordClusterTool` is successfully called, extract the resulting JSON and save it as a new record in the `artifacts` table.
-   [ ] **Verification:** Make a chat request that should trigger the tool. Verify that a new artifact record is created in the database with the correct `type` and `content`.

#### **Day 5: Frontend-Backend Connection**

-   [ ] **Task:** Ensure the `UniversalCanvas` component automatically refetches its data after a chat session is complete, so the new artifact appears without a manual refresh.
-   [ ] **Verification:** Perform the end-to-end flow: ask the chatbot to cluster keywords, and watch the new artifact card appear on the canvas automatically.

---

### **Week 3: The "Aha!" Moment - Delivering the Experience**

**Goal:** Transform the raw JSON artifact into a polished, valuable user experience and prepare for launch.

#### **Day 1-2: Artifact Visualization**

-   [ ] **Task:** Create the `components/artifacts/keyword-cluster-report.tsx` component.
-   [ ] **Task:** This component will take the `content` JSON of a `keyword-cluster-report` artifact as a prop.
-   [ ] **Task:** Design and build a clear, visually appealing representation of the keyword clusters (e.g., using cards, tags, and summary stats).
-   [ ] **Task:** Update the `UniversalCanvas` to use a dynamic mapping to render the `KeywordClusterReport` component when `artifact.type` is `'keyword-cluster-report'`. 
-   [ ] **Verification:** The canvas should now show a polished report instead of raw JSON.

#### **Day 3: UI Polish & Interaction**

-   [ ] **Task:** Implement the "pin" functionality. Add a pin icon to the `ArtifactCard`.
-   [ ] **Task:** Clicking the pin should call a new API route (`POST /api/artifacts/:id/pin`) that updates the `isPinned` flag in the database.
-   [ ] **Task:** Pinned artifacts should be styled differently or sorted to the top of the canvas.
-   [ ] **Verification:** Users can pin and unpin artifacts, and the state persists across reloads.

#### **Day 4-5: Testing & Deployment**

-   [ ] **Task:** Conduct thorough end-to-end testing of the entire user flow.
-   [ ] **Task:** Write key integration tests for the API endpoints.
-   [ ] **Task:** Clean up any remaining bugs and polish the UI.
-   [ ] **Task:** Prepare a staging environment and deploy the MVP for the internal demo and first user tests.
-   [ ] **Verification:** The product is stable, functional, and ready for its first users.
