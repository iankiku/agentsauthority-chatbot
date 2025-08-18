# Brand Authority API

This directory contains the unified backend API for the Brand Authority platform. It is built with Node.js, Express, and TypeScript, and it consolidates the core functionalities from the `firegeo` and `llm-brand-tracker` projects.

## Services Overview

This API is designed as a collection of modular services, each responsible for a distinct set of functionalities.

### 1. Authentication Service (`/auth`)

*   **Source:** Ported from the `firegeo` project.
*   **Technology:** `better-auth`
*   **Functionality:**
    *   Handles user registration, login, and session management.
    *   Provides secure, cookie-based authentication.
    *   Exposes endpoints for creating and managing user sessions.
*   **Status:** Fully ported and functional.

### 2. Billing & Subscriptions Service (`/billing`)

*   **Source:** Ported from the `firegeo` project.
*   **Technology:** `autumn-js`
*   **Functionality:**
    *   Manages subscription plans and billing.
    *   Integrates with Stripe for payment processing.
    *   Provides a webhook handler for real-time updates from the billing provider.
*   **Status:** Fully ported and functional.

### 3. User Profile & Settings Service (`/user`)

*   **Source:** Ported from the `firegeo` project.
*   **Functionality:**
    *   Allows users to manage their profile information (display name, bio, etc.).
    *   Provides endpoints for managing application-specific settings (e.g., theme, notifications).
*   **Status:** Fully ported and functional.

### 4. Scraping Service (`/scraping`)

*   **Source (Hybrid):**
    *   **URL Scraping:** From `firegeo`, using `Firecrawl`.
    *   **ChatGPT Scraping:** From `llm-brand-tracker`, using `Puppeteer`.
*   **Functionality:**
    *   `POST /scraping/url`: Scrapes a given URL for company information, metadata, and content.
    *   `POST /scraping/chatgpt`: Automates interaction with the ChatGPT interface to get direct responses to prompts.
*   **Status:** Core logic ported. The `chatgpt-scraper` is a key component that allows the backend to function without a frontend by directly interacting with the LLM.

### 5. AI-Powered Analysis Service (`/analysis`)

*   **Source (Hybrid):**
    *   **Core Engine:** From `firegeo`, providing a robust, multi-provider analysis workflow.
    *   **Prompt Generation:** From `llm-brand-tracker`, for creating diverse and effective prompts.
*   **Functionality:**
    *   Orchestrates the entire brand analysis process, from competitor identification to scoring.
    *   Leverages multiple AI providers for comprehensive analysis.
    *   Provides endpoints to start, monitor, and retrieve analysis results.
*   **Status:** Core logic ported and integrated.

## How It Works Without a Frontend

The backend is designed to be fully functional and testable without a frontend client. You can interact with the API directly using tools like `curl` or Postman.

**Example Workflow:**

1.  **Register a user:** `POST /auth/register`
2.  **Log in:** `POST /auth/login` (This will return a session cookie)
3.  **Start an analysis:** `POST /analysis` with the session cookie and a URL in the request body.
4.  **The backend will:**
    *   Use the **Scraping Service** to fetch content from the URL.
    *   Use the **Analysis Service** to identify competitors and generate prompts.
    *   Use the **ChatGPT Scraper** to get responses for the generated prompts.
    *   Score the results and save them to the database.

This self-contained backend architecture ensures that all core functionalities can be developed, tested, and validated independently of any frontend implementation.
