# FRAG-007: Dashboard MVP for fragmentV2

**Status:** 🚨 Pending **Sprint:** Now **Owner:** Product/Engineering

---

## 🎯 Context & Goal

Deliver a SEMrush-inspired dashboard MVP for fragmentV2, featuring Brand
Performance, Visibility, Perception, and Questions pages. Each page will use
modular, reactive blocks (charts, tables, insights) to visualize AI/LLM scan
data and actionable recommendations.

---

## Task Description

- Design and implement dashboard UI with four main pages: Brand Performance,
  Visibility, Perception, Questions.
- Each page contains modular, reactive blocks (charts, tables, insights,
  recommendations).
- Blocks are driven by schema and update with new scan data.
- Dashboard supports pinning, unpinning, and rearranging blocks.
- Ensure visual/UX polish and alignment with shadcn/ui and pitch deck vision.

---

## Project Overview

- **Repo:** apps/fragmentV2
- **Stack:** Next.js 15, React 19, shadcn/ui, Tailwind, modular block system,
  charting library

⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️ Paste the **entire** PIPER-5 protocol
here. ⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️

---

## [MODE: RESEARCH] Analysis

- SEMrush dashboard is proven and familiar for target users.
- Users expect persistent, actionable insights organized by theme.
- Modular, schema-driven blocks enable future extensibility.
- shadcn/ui and Tailwind ensure design consistency.

---

## [MODE: PLAN] Proposed Solution

- Build dashboard shell with tabbed navigation for four pages.
- Implement modular block system (chart, table, insight, recommendation).
- Each block fetches and displays live data (SWR/React Query).
- Support pin/unpin, rearrange, and refresh actions for blocks.
- Ensure responsive, accessible, and visually polished UI.

---

## Implementation Checklist

- [ ] **Dashboard Shell and Navigation:**
  - Create the main dashboard layout with a sidebar or top navigation for the
    four pages: Brand Performance, Visibility, Perception, and Questions.
  - Use shadcn/ui components for the navigation and layout.
- [ ] **Modular Block System:**
  - Create a `Block` component that can dynamically render different types of
    artifacts (e.g., charts, tables, insights) based on the artifact schema.
  - Use a flexible grid system (e.g., `react-grid-layout`) to allow users to
    rearrange and resize blocks.
- [ ] **Data Fetching and State Management:**
  - Use a data fetching library like SWR or React Query to fetch the artifact
    data for the dashboard.
  - The data should be fetched on the client-side to ensure that the dashboard
    is always up-to-date.
- [ ] **Implement Block Components:**
  - Create the individual block components for each artifact type:
    - `ChartBlock`: Use a charting library like `recharts` or `nivo` to display
      various types of charts (e.g., line, bar, pie).
    - `TableBlock`: Use the `shadcn/ui` table component to display tabular data.
    - `InsightBlock`: A simple component to display a piece of text with an
      icon.
    - `RecommendationBlock`: A component that displays a recommendation with a
      call to action.
- [ ] **Pin/Unpin and Rearrange Logic:**
  - Implement the logic for pinning and unpinning blocks, which will update the
    `isPinned` field in the database.
  - Implement the logic for saving the layout of the dashboard when the user
    rearranges the blocks.
- [ ] **Sample Data and Mock Scans:**
  - Create a script to generate sample data for the dashboard so that it can be
    developed and tested without relying on real AI scans.
- [ ] **UI Polish and Empty States:**
  - Ensure that the dashboard is visually polished and consistent with the rest
    of the application.
  - Implement loading, error, and empty states for all the blocks to provide a
    good user experience.
- [ ] **Documentation:**
  - Create a `README.md` for the dashboard that explains the architecture, the
    block system, and how to add new block types.

---

## ✅ Acceptance Criteria

- Dashboard has four main pages with tabbed navigation.
- Each page displays modular, reactive blocks with live data.
- Users can pin/unpin and rearrange blocks.
- UI is visually polished, responsive, and accessible.
- All states (loading, error, empty) are handled gracefully.

---

## 🚫 Out of Scope / Backlog

- Advanced analytics and forecasting
- Multi-user/team dashboards
- Custom block creation by users

---

## 📎 References

- [project-docs/pitch-deck.md](../../project-docs/pitch-deck.md)
- [SEMrush dashboard screenshots]
- [PIPER-5 protocol](../../.vibeflow/piper-5.mdc)

---

# Task Progress

- [2025-07-08 10:00] — Started dashboard MVP design

# Final Review

[REVIEW verdict]
