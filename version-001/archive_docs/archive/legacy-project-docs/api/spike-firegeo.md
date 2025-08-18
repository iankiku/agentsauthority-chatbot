
# SPIKE: Consolidating Backend Logic for Brand Authority API

**Objective:** To analyze the `firegeo` and `llm-brand-tracker` codebases and create a detailed plan for extracting their backend functionalities into a single, robust, and scalable API. This new API will serve as the backbone for a new brand authority platform.

**Core Tenets:**

*   **Technology:** The new API will be built using **Node.js with Express**, leveraging the existing TypeScript expertise in both projects.
*   **Database:** **PostgreSQL** with **Drizzle ORM**, adopting the more comprehensive schema from `firegeo` as the foundation.
*   **Modularity:** Services will be designed as modular components (Auth, Billing, Scraping, Analysis) to ensure maintainability and scalability.

---

## Phase 1: Foundational Services Extraction

This phase focuses on porting the well-structured, foundational services from the `firegeo` project.

### Task 1: Authentication API

*   **Goal:** Extract the `better-auth` implementation to handle user authentication and session management.
*   **Source Files (`firegeo`):**
    *   `lib/auth.ts`: Core `better-auth` configuration.
    *   `lib/auth-client.ts`: Client-side helpers.
    *   `app/api/auth/[...all]/route.ts`: The main auth handler.
    *   `middleware.ts`: For protecting routes.
    *   `better-auth.config.ts`: CLI configuration.
*   **Action Plan:**
    1.  Create a new set of API endpoints under `/auth` (e.g., `/auth/login`, `/auth/register`, `/auth/session`).
    2.  Migrate the configuration from `lib/auth.ts` and `better-auth.config.ts` into the new API's auth module.
    3.  Re-implement the middleware logic for the new API framework.

### Task 2: Billing & Subscription API

*   **Goal:** Extract the `autumn-js` integration for handling payments and subscriptions.
*   **Source Files (`firegeo`):**
    *   `app/api/autumn/[...all]/route.ts`: The Autumn billing webhook handler.
    *   `hooks/useAutumnCustomer.tsx`: Provides context for how the frontend interacts with billing.
    *   `config/autumn-products.ts`: Product definitions.
*   **Action Plan:**
    1.  Create new endpoints under `/billing` (e.g., `/billing/portal`, `/billing/webhook`).
    2.  Replicate the logic from `app/api/autumn/[...all]/route.ts`, ensuring the `identify` function correctly links users to billing customers.
    3.  Migrate product configurations from `config/autumn-products.ts`.

### Task 3: User Profile & Settings API

*   **Goal:** Port the user profile and settings management functionality.
*   **Source Files (`firegeo`):**
    *   `app/api/user/profile/route.ts`: Handles GET/PUT/PATCH for user profiles.
    *   `app/api/user/settings/route.ts`: Handles GET/PUT/PATCH for user settings.
*   **Action Plan:**
    1.  Create endpoints like `GET /users/me`, `PATCH /users/me`, `GET /settings`, `PATCH /settings`.
    2.  Adapt the Drizzle queries from the source files to the new API's database module.

### Task 4: Database Schema Consolidation

*   **Goal:** Merge the database schemas from both projects into a single, unified schema.
*   **Source Files:**
    *   `firegeo/lib/db/schema.ts`: The primary schema, which is more comprehensive and includes user profiles, chat, and brand analysis tables.
    *   `llm-brand-tracker/shared/schema.ts`: A simpler schema for topics, prompts, and responses.
*   **Action Plan:**
    1.  Use `firegeo/lib/db/schema.ts` as the base schema.
    2.  Incorporate the `topics` table from `llm-brand-tracker` to better categorize prompts.
    3.  Ensure all foreign key relationships are correctly established in the new unified schema.
    4.  Generate a new set of migrations for the consolidated schema.

---

## Phase 2: Core Analysis Engine (Hybrid Approach)

This phase involves merging the brand analysis and scraping logic from both projects to create a powerful, multi-faceted analysis engine.

### Task 1: Unified Scraping Service

*   **Goal:** Combine the different scraping methods into a single service that can handle website content scraping and direct LLM interaction.
*   **Source Files:**
    *   **Firecrawl (from `firegeo`):** `lib/scrape-utils.ts` - Excellent for scraping structured data from websites.
    *   **Puppeteer (from `llm-brand-tracker`):** `server/services/chatgpt-scraper.ts` - **This is the key "ChatGPT scraping" component.** It directly automates interaction with the ChatGPT interface.
    *   **Cheerio (from `llm-brand-tracker`):** `server/services/scraper.ts` - A lightweight HTML parser for simpler scraping tasks.
*   **Action Plan:**
    1.  Create a `ScrapingService` module.
    2.  **Integrate Puppeteer:** Port the `ChatGPTScraper` class from `llm-brand-tracker`. This will be exposed via an endpoint like `POST /scrape/chatgpt`. This is critical for emulating real user interaction with ChatGPT.
    3.  **Integrate Firecrawl:** Port the `scrapeCompanyInfo` function from `firegeo` for robust website analysis. Expose via `POST /scrape/url`.
    4.  The new service should intelligently choose the scraper based on the target (e.g., a URL vs. a direct LLM prompt).

### Task 2: AI-Powered Analysis Service

*   **Goal:** Consolidate the AI-driven analysis, prompt generation, and scoring logic.
*   **Source Files:**
    *   **Core Analysis (`firegeo`):** `lib/ai-utils-enhanced.ts` and `lib/analyze-common.ts`. This is a very strong foundation with multi-provider support and SSE streaming.
    *   **Prompt Generation (`llm-brand-tracker`):** `server/services/prompt-generator.ts`. This file contains logic for generating diverse and contextually relevant prompts.
    *   **Brand/Competitor Detection (`firegeo`):** `lib/brand-detection-utils.ts` and `lib/brand-detection-config.ts`.
*   **Action Plan:**
    1.  **Adopt `firegeo`'s Engine:** Use the analysis workflow from `firegeo/lib/analyze-common.ts` as the primary orchestrator for the analysis process (competitor ID, prompt generation, scoring, etc.).
    2.  **Enhance Prompt Generation:** Integrate the dynamic prompt generation techniques from `llm-brand-tracker/server/services/prompt-generator.ts` into the `firegeo` workflow to create more diverse and effective prompts.
    3.  **Centralize AI Calls:** Use `firegeo/lib/ai-utils-enhanced.ts` as the single point of interaction with various LLM providers (OpenAI, Anthropic, etc.), leveraging its web search capabilities.
    4.  **Create a new `AnalysisService`** that exposes methods like `startAnalysis(url, config)` and `getAnalysisStatus(id)`.

---

## Phase 3: New API Endpoint Structure

The new API will be organized around resources, providing a clean and RESTful interface.

*   **/auth/**
    *   `POST /auth/register`
    *   `POST /auth/login`
    *   `POST /auth/logout`
    *   `GET /auth/session`
*   **/billing/**
    *   `GET /billing/portal` (Redirects to Stripe/Autumn portal)
    *   `POST /billing/webhook` (Handles events from payment provider)
*   **/user/**
    *   `GET /user/me`
    *   `PATCH /user/me`
    *   `GET /user/settings`
    *   `PATCH /user/settings`
*   **/analysis/**
    *   `POST /analysis` - Start a new analysis. Body: `{ "url": "...", "config": {...} }`. Returns an `analysisId`.
    *   `GET /analysis/{id}/status` - Get real-time progress via Server-Sent Events (SSE).
    *   `GET /analysis/{id}` - Get the final, completed analysis report.
    *   `GET /analysis` - Get a list of all past analyses for the user.
*   **/scrape/**
    *   `POST /scrape/url` - Scrape a single URL for company info (uses Firecrawl).
    *   `POST /scrape/chatgpt` - Scrape a prompt directly from ChatGPT (uses Puppeteer).

This plan provides a clear path to creating a powerful, consolidated backend by leveraging the strengths of both `firegeo` and `llm-brand-tracker`.
