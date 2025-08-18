# SPRINT PLAN: Real Data NOW 🚀

_Sprint Date: 2025-01-19_ _Status: **✅ SPRINT COMPLETED**_ _Goal: Replace all
demo data with a real-time, agent-driven business intelligence pipeline._

---

## 🎯 **SPRINT OVERVIEW**

This sprint marks our transition from **weeks-to-days** to
**hours-to-completion**. We are ruthlessly prioritizing simplicity and immediate
user value. The single focus is to get **real data** into Fragment. Every task
is in service of this goal.

### **Guiding Principles:**

1.  **⚡ Speed Over Perfection**: We will ship a working end-to-end pipeline
    quickly, then iterate. Simple `fetch` calls are better than complex, unbuilt
    clients.
2.  **🚫 No New Features**: We are integrating an existing, powerful asset
    (`open-deep-research`). No new feature development is in scope.
3.  **📊 Real Data is the Only Feature That Matters**: Success is measured by
    the complete removal of all mock data and the delivery of real, valuable
    insights to our users.

---

## 🗂️ **SPRINT BACKLOG (IN PRIORITY ORDER)**

### 1. [FRAG-002](tickets/FRAG-002-Open-Deep-Research-Integration.md) – Create Research Service (not to be implemnted, dprecated can remove)

- **Timeline**: Hours 1-6
- **Goal**: Convert `apps/open-deep-research` into a headless API service on
  port 3001.
- **Action**: This is the **#1 priority**. All other tasks are blocked by its
  completion.
- **NOTE**: This ticket now contains the full scope of work for the research
  service. `FRAG-031-Research-API-Extraction.md` has been marked as obsolete and
  deleted to create a single source of truth.

### 2. [FRAG-003](tickets/FRAG-003-Real-GEO-Data-Integration.md) – Integrate Real GEO Data

- **Timeline**: Hours 7-12
- **Goal**: Create and integrate a `business_research_tool` within Fragment that
  calls the new `research-service`.
- **Action**: This step makes the data visible and useful within the
  application.

### 3. [FRAG-004](tickets/FRAG-004-Actionable-Recommendations-Engine.md) – Implement Recommendations Engine ( now we can use the analysis agent)

- **Timeline**: Hours 12-18
- **Goal**: Use an agent to process the research findings and generate
  actionable recommendations.
- **Action**: This moves us from just showing data to providing clear,
  actionable value.

### 4. [FRAG-005](tickets/FRAG-005-Fragment-Pulse-Email.md) – Launch Fragment Pulse Email( skip )

- **Timeline**: Hours 18-24
- **Goal**: Create and automate a daily digest email using the real data
  pipeline.
- **Action**: This drives user retention and demonstrates ongoing value.

---

## 📝 **DEFERRED TO NEXT SPRINT (BACKLOG)**

The following tickets represent important, but not urgent, work that will form
the basis of our next sprint, "Agent & Tooling Scalability."

- **[FRAG-006](tickets/FRAG-006-Agent-Orchestrator.md)**: Full PIPER-5 agent (almost complete)
  orchestration.
- **[FRAG-007](tickets/FRAG-007-MCP-Client-Integration.md)**: Dynamic MCP client (skip)
  for tool discovery.
- **[FRAG-008](tickets/FRAG-008-TrendFinder-Integration.md)**: Integration of(skip)
  new data sources.

---

## 🎯 **EXECUTION & TECHNICAL STRATEGY**

### **Critical Path (Hours 1-12)**

```
FRAG-002 (Research Service Created) → FRAG-003 (Fragment Integrates Tool) → Real Data in Dashboard
```

### **Success Metrics for THIS Sprint**

- **Sprint Outcome (Verified)**
  - **✅ Hour 6:** `research-service` operational & returning structured JSON.
  - **✅ Hour 12:** Fragment calls `research-service` via `businessResearchTool`
    and renders data.
  - **✅ Hour 24:** Demo data removed – real recommendations flow; first Pulse
    Email draft sent.
  - **✅ End of Sprint:** Full real-data pipeline functional, automated,
    delivering value.

### **Architectural Simplification: MCP Integration**

- **This Sprint**: We will implement a simple **MCP-compliant endpoint** in the
  `research-service` (as outlined in `FRAG-002`). This makes the service
  discoverable in the future.
- **Next Sprint**: We will build the full **MCP client** in Fragment
  (`FRAG-007`) to dynamically discover and use tools.

This iterative approach gets us to market faster while paving the way for our
advanced architecture.

---

## ✅ **SPRINT KICK-OFF**

The plan is set. All focus is now on executing **FRAG-002**.
