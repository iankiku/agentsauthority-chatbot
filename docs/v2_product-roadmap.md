# Product Roadmap v2: From MVP to Validation

## Guiding Principle

Our roadmap is designed to answer the most critical business questions as quickly and efficiently as possible. We will not build a broad set of features. Instead, we will build the *minimum possible product* to validate our core thesis, and then expand deliberately based on evidence.

**Core Thesis:** A conversational "Living Dashboard" that creates persistent artifacts is more valuable to users than traditional, ephemeral AI chat interfaces.

---

## Phase 1: The MVP - Prove the Core Loop (Weeks 1-3)

**Goal:** Validate that users understand and value the concept of a chat interface that generates persistent, interactive artifacts.

| Week  | Key Theme              | Deliverables                                                                                                                              | Success Criteria                                                                    |
| :---- | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| **1** | **The Canvas**         | - `artifacts` table created in PostgreSQL via Drizzle.<br>- `UniversalCanvas` UI component built.<br>- Basic chat input connected to the backend. | - Developers can manually insert an artifact into the DB and see it render on the canvas. |
| **2** | **The First Tool**     | - `keywordClusterTool` migrated to Vercel AI SDK.<br>- Backend chat logic integrates the tool.<br>- Successful tool calls persist a `keyword-cluster-report` artifact to the DB. | - A user query can successfully trigger the tool and create a valid artifact in the DB. |
| **3** | **The "Aha!" Moment** | - `KeywordClusterReport` React component built to visualize the artifact's JSON data.<br>- Basic artifact interactions (pinning).<br>- Polish UI and deploy for first user testing. | - **Activation:** >40% of testers create their first artifact.<br>- **Retention:** >30% of testers return within a week. |

### End of Phase 1 Goal State

A user can log in, see a single canvas, ask the app to cluster keywords, and see a beautiful, persistent report artifact appear on their screen. They can log out and log back in, and the artifact will still be there. This is the entire MVP.

---

## Phase 2: The Expansion Test - Prove Data Integration (Weeks 4-6)

**Pre-requisite:** Phase 1 success metrics MUST be met before starting Phase 2.

**Goal:** Validate that our architecture can support tools that rely on external, real-time data APIs, which is critical for future growth.

| Week  | Key Theme                  | Deliverables                                                                                                                                                           | Success Criteria                                                                                             |
| :---- | :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **4** | **Data Source Integration**  | - Research and select a third-party web search/news API (e.g., Serper, Tavily API, etc.).<br>- Integrate the chosen API into the backend.                               | - A backend service can successfully fetch search results for a given query (e.g., a brand name).          |
| **5** | **The Second Tool**        | - Build the `brandMentionTool` using the new data source.<br>- The tool should search for a brand name and return a list of recent mentions.<br>- Integrate the tool into the chat server logic. | - A user query like "Find recent mentions of [brand]" triggers the tool and creates a `brand-mention-report` artifact. |
| **6** | **The Second Artifact**    | - Build the `BrandMentionReport` React component to visualize the mentions.<br>- Refine the UI to handle multiple, different artifact types on the canvas.<br>- Deploy for user testing. | - Users can successfully generate and view both keyword and brand mention artifacts on their canvas. |

### End of Phase 2 Goal State

The product now has two tools, proving it can be a platform. We have validated that we can handle both stateless, LLM-driven tools (`keywordClusterTool`) and stateful, data-driven tools (`brandMentionTool`). This confirms the viability of our technical architecture for future expansion.

---

## Beyond Phase 2: The Viability Roadmap

If both Phase 1 and Phase 2 are successful, we will have strong evidence that our core product thesis is correct and technically sound. The subsequent roadmap will focus on achieving commercial viability.

-   **Q3: The "Dashboard" Experience:**
    -   **Focus:** Enhance artifact management.
    -   **Features:** Artifact search, filtering, renaming, and deleting. More advanced canvas interactions (e.g., drag-and-drop positioning).

-   **Q4: The "Collaboration" Loop:**
    -   **Focus:** Introduce multi-user and sharing capabilities.
    -   **Features:** Sharing artifacts via public links, basic team workspaces.

-   **Q1 (Next Year): The "Platform" Play:**
    -   **Focus:** Accelerate the addition of new, high-value tools.
    -   **Features:** Introduce 3-5 new GEO/SEO tools based on user feedback (e.g., technical SEO audit, competitor analysis).
