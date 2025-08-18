# PRD v2: The Living GEO/SEO Dashboard

## 1. Executive Summary

This document defines the Product Requirements for a new category of analytics tool: a **Living Dashboard** for Generative Engine Optimization (GEO) and SEO. We are transforming the standard, ephemeral AI chat experience into a persistent, value-generating asset. Every user query will create durable, interactive "artifacts" (charts, tables, reports) that live on the user's canvas, turning conversation into a permanent, evolving analytics dashboard. Our Minimum Viable Product (MVP) will prove this model with a single, powerful tool: **AI-Powered Keyword Clustering**.

---

## 2. The Problem & Our Opportunity

### Problem Statement

Modern marketing and SEO professionals are drowning in data but starving for wisdom. Current tools fall into two inadequate camps:

1.  **Static Dashboards (e.g., Ahrefs, SEMrush):** Powerful but rigid. They provide pre-defined views, require users to navigate complex interfaces, and cannot answer ad-hoc, natural language questions.
2.  **AI Chatbots (e.g., ChatGPT, Perplexity):** Flexible and conversational but ephemeral. Insights are trapped in the chat history, difficult to track over time, and disappear once the session ends.

There is no tool that combines the **conversational power of AI** with the **persistence and structure of a dashboard.**

### The Opportunity: The Living Dashboard

We will create the first-of-its-kind "Living Dashboard." It's a tool where the primary interface is a conversation, and the output is a persistent, organized, and interactive set of analytics artifacts.

**Our unique value proposition is simple but profound: We make insights durable.**

---

## 3. MVP: Strategy & Focus

Our MVP strategy is guided by the principle of **Keep It Simple, Stupid (KISS)**. We will deliver a product that does one thing exceptionally well, proving our core thesis.

### MVP Core Thesis

> Users will find more value in a conversational interface that creates persistent, high-quality analytics artifacts than in a traditional dashboard with dozens of features.

### MVP Features

#### a. The Universal Canvas

The entire application will be a single, unified chat canvas. This is the user's workspace. There are no separate pages or complex navigation.

-   **Priority:** P0
-   **Description:** A full-screen, minimalist interface with a chat input at the bottom. The canvas area will display the generated artifacts.

#### b. Persistent, Interactive Artifacts

This is the core of the product. Every query that generates a result will create an "artifact" card on the canvas.

-   **Priority:** P0
-   **Description:**
    -   Artifacts are the output of tool calls (e.g., a keyword cluster analysis).
    -   They are stored permanently in the database, associated with the user.
    -   Users can interact with artifacts: move them, pin them, view the data, and (in the future) refresh or share them.
    -   The canvas becomes a personalized, persistent record of the user's analysis.

#### c. The First Tool: AI-Powered Keyword Clustering

To prove the model, we will integrate a single, high-value tool migrated from our Mastra agent library: the `keywordClusterTool`.

-   **Priority:** P0
-   **Description:**
    -   A user can provide a list of keywords via the chat interface.
    -   The tool will use an LLM to group these keywords into semantically relevant clusters.
    -   The result will be displayed as a "Keyword Cluster" artifact on the canvas, showing the clusters, their keywords, total search volume, and AI relevance score.
-   **User Query Example:** "Cluster these keywords for me: [list of keywords]"

### What is NOT in the MVP

-   Multiple pages or routes.
-   Multiple tools. (We will focus on making one tool excellent).
-   Complex user roles, sharing, or collaboration features.
-   Advanced artifact interactions (e.g., scheduling, exporting).
-   Ads analysis or brand monitoring (these are non-functional or secondary).

---

## 4. Target Audience & User Journey

### Target Audience: The SEO Specialist

Our initial target user is the hands-on **SEO Specialist** or **Content Strategist**. They live in spreadsheets, understand the value of keyword clustering, and will immediately grasp the power of our tool.

### User Journey (MVP)

1.  **Onboarding:** Sarah, an SEO specialist, signs up. She is greeted with a clean canvas and a single prompt: "Welcome. What would you like to analyze? You can start by asking me to cluster some keywords."
2.  **First Query:** Sarah pastes a list of 50 keywords from a client project and types, "Cluster these keywords for my new blog."
3.  **Artifact Generation:** The system processes her request. A new "Keyword Cluster Report" artifact appears on her canvas. It visually displays 5-7 semantic groups with their associated keywords and metrics.
4.  **Interaction:** Sarah examines the artifact. She sees a clear content plan emerging from the clusters. She pins the artifact to the top of her canvas.
5.  **Persistence:** Sarah closes her browser. The next day, she logs back in. Her Keyword Cluster artifact is exactly where she left it, ready for her to use.
6.  **Realization:** Sarah realizes she just did an hour's worth of work in 30 seconds, and the result is saved and organized automatically. **This is the "Aha!" moment.**

---

## 5. Success Metrics

The success of the MVP will be measured by user engagement and adoption of the core "living dashboard" concept.

-   **Activation Rate:** >40% of new users must successfully create their first artifact within their first session.
-   **Retention (Week 1):** >30% of users who create an artifact must return within the first week. This proves the value of persistence.
-   **Core Action Adoption:** >50% of active users should use the "pin" functionality on an artifact, indicating they see it as a durable asset.
-   **Qualitative Feedback:** Direct interviews with our first 20 users to confirm the "Aha!" moment and validate that the persistent artifact model is superior to traditional tools.
