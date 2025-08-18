# Product Requirements Document (PRD)

## 1. Purpose & Vision

KIVA GEO Suite empowers marketing teams and agencies to optimize for AI‑driven
search by combining traditional SEO auditing with advanced GEO (“Generative
Engine Optimization”) workflows. Users get real‑time AI visibility tracking,
prompt simulation, content clustering, automated copywriting, technical audit,
and actionable dashboards—all in one platform.

## 2. Target Personas

- **SEO Specialists** seeking to extend ranking insights into AI answer engines
  (ChatGPT, Gemini, Perplexity).
- **Content Strategists** who need data‑driven outlines and on‑brand AI copy.
- **Product Managers** wanting scheduled health checks on AI visibility and site
  readiness.
- **Developers & Agencies** integrating automation pipelines for recurring GEO
  reporting.

## 3. Key Features & User Stories

| Feature                            | User Story                                                                                                                               | Acceptance Criteria                                                                                                   |
| :--------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **Keyword & GSC Clustering**       | As an SEO specialist, I want to group keywords and click data into semantic clusters so I can prioritize content planning.               | - Clusters returned in JSON.<br>- Each cluster has name, intent, keywords[].<br>- Prioritization based on GSC clicks. |
| **Brand Mention Monitoring**       | As a brand manager, I want to probe AI engines for brand recall so I can track mention trends.                                           | - Returns boolean mentioned + excerpt per engine/prompt.<br>- Supports ChatGPT, Claude, Gemini, Perplexity.           |
| **Topical Depth Analysis**         | As a content strategist, I want to compare my topic clusters vs competitors to find coverage gaps.                                       | - Outputs depthScore 0–100.<br>- Lists missing gaps[] clusters.                                                       |
| **Prompt Simulation & Grading**    | As an AI marketer, I want to simulate common prompts against my site URL to score AI visibility.                                         | - Returns visibilityScore 0–100.<br>- Provides raw details[] responses.                                               |
| **Prerendered HTML Fetch**         | As a devops engineer, I want bot‑friendly HTML snapshots for JS‑heavy sites to improve crawlability.                                     | - Returns full HTML string of prerendered page.<br>- Works on SPAs.                                                   |
| **AI‑Optimized Copywriting**       | As a copywriter, I want AI‑generated, on‑brand copy optimized for AI answer snippets.                                                    | - Returns markdown‑formatted copy.<br>- Honors tone parameter.                                                        |
| **Real‑time Prompt Monitoring**    | As a content creator, I want to see trending public ChatGPT prompts containing my keywords for topic ideas.                              | - Reports matching prompt strings.                                                                                    |
| **AI Search Readiness Grader**     | As a site owner, I want a HubSpot‑style grade (A–E) for AI answer readiness along with issues and fixes.                                 | - Grade ∈ {A,B,C,D,E}.<br>- Lists issues[] and recommendations[].                                                     |
| **Automated Daily “Pulse” Report** | As a CMO, I want a daily scheduled report summarizing all above metrics in one markdown output.                                          | - Runs on cron (07:00 CST).<br>- Combines clusters, mentions, visibility, grade, and summary copy.                    |
| **Dashboard Widgets & Charts**     | As a dashboard builder, I want Chart.js configs and React Grid Layout JSON to render interactive visualizations.                         | - `chartJsConfig` and `layout` JSON available for every metric.<br>- Front‑end can render without transformation.     |
| **Code & QA Meta‑Agents**          | As an engineering lead, I want agents that generate code snippets and QA check results to ensure no hallucinations or errors in outputs. | - `codeWriterAgent` outputs TS/SQL fenced code.<br>- `qaAgent` returns `{status:"pass"                                | "fail", "issues":[]}`. |

## 4. Out of Scope

- Native mobile apps
- Multi‑language support beyond English
- Built-in user interface (front-end assumed externally)

## 5. UI Artifact Principles & Customer Value

To ensure a focused and valuable user experience, our UI blocks adhere to the
following principles:

1.  **One Artifact Per Block**: Each generative UI block will display **only one
    primary artifact** at a time. This prevents visual clutter and ensures the
    user's focus remains on a single, clear insight or action. Complex agent
    outputs should be broken down into sequential or distinct artifact messages.
2.  **Chromeless & Direct**: Artifact components are "chromeless" — they are
    pure visual representations of data, without additional UI adornments (like
    card borders or titles, which are provided by the `UnifiedChatBlock`). They
    directly render structured data provided by our agents, requiring no further
    transformation in the UI layer.
3.  **Customer Value-Driven**: Every artifact is designed to deliver immediate,
    actionable value to the user.
    - **GEO Score Card**: Provides an instant, visual summary of AI search
      visibility, enabling quick assessment of performance.
    - **Competitive Analysis Table/Chart**: Offers clear comparisons with
      rivals, highlighting strengths and weaknesses at a glance.
    - **Actionable Recommendations**: Presents clear, prioritized next steps
      with estimated impact, directly guiding the user towards business
      improvement.

## 6. Agent Naming Conventions

To improve clarity, all key agents and tools have been renamed to directly
reflect their functional purpose:

| Original Name  | New Functional Name      |
| -------------- | ------------------------ |
| KIVA           | **ContentClusterAgent**  |
| Profound       | **BrandMonitorAgent**    |
| Athena HQ      | **TopicalDepthAgent**    |
| Otterly AI     | **PromptSimulatorAgent** |
| Prerender.io   | **StaticRenderAgent**    |
| Goodie AI      | **AICopywriterAgent**    |
| Semrush        | **SEOInsightAgent**      |
| Scrunch        | **PromptTrendAgent**     |
| HubSpot Grader | **AIReadinessAgent**     |

_All documentation, code examples, and UI labels should reference the **new
functional names** going forward._

## 7. External-Data Safety Notice

Some features (e.g., visibility scoring that would normally consume **Semrush**,
**Google Trends**, or social-media endpoints) require paid or restricted APIs.
Until production keys are provisioned, the corresponding tools will return
**placeholder data** for local development and testing. Each placeholder
response is clearly marked with `mock: true`.

## 8. Roadmap (Updated)

| Phase                           | Timeline    | Key Milestones                                                                                                                                                                                                              |
| :------------------------------ | :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. MVP**                      | Weeks 1–2   | Integrate core agents & tools (**ContentClusterAgent**, **BrandMonitorAgent**, **TopicalDepthAgent**).<br>Expose baseline workflows.<br>Build streaming API.<br>Create React dashboard skeleton with **React Grid Layout**. |
| **2. Extended GEO**             | Weeks 3–4   | Add **PromptSimulatorAgent**, **StaticRenderAgent**, **AICopywriterAgent**.<br>Implement prompt simulation & copywriting.<br>Automations & scheduler.                                                                       |
| **3. QA & Reporting**           | Weeks 5–6   | Introduce **codeWriterAgent** & **qaAgent**.<br>Persist historical run data.<br>Build PDF report export.                                                                                                                    |
| **4. Performance & Audit**      | Weeks 7–8   | Integrate Core Web Vitals via Lighthouse tool.<br>Enhance **AIReadinessAgent** with accessibility checks.<br>Optimize tool parallelism.                                                                                     |
| **5. UX & UI Polish**           | Weeks 9–10  | Finalize React components (charts, **React Grid Layout** dashboards).<br>User settings & multi-site support.<br>Onboard beta customers.                                                                                     |
| **6. Scalability & Enterprise** | Weeks 11–12 | Dedicated API onboarding & RBAC.<br>SLA monitoring & alerts.<br>White-label reports & custom branding.                                                                                                                      |

**Next Review:** Weekly (during active development)
