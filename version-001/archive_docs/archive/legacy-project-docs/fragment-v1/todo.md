# Fragment TODO & Execution Priority

_Last Updated: 2025-01-19_ _Current Sprint: Hour 1 Foundation_

---

## 🚨 **URGENT HOUR 1 PRIORITY**

### [FRAG-005](tickets/FRAG-002-Open-Deep-Research-Integration.md) – Open-Deep-Research Integration ✅🚧🧪

**Status**: DONE - PENDING TESTING **Priority**: COMPLETE **Sprint**: Hours 1-6

**Critical Path**: The `research-service` was discovered to be fully functional.
The critical path became re-architecting the `fragment` application to bypass a
faulty API route and use client-side tool calling to correctly interface with
the research service. This work is complete.

**Why This Is #1**: This was the foundational blocker preventing the application
from using real data. With this resolved, the application can now generate real
competitive intelligence instead of relying on mock data.

**Context7/MCP**: The `business-research-tool` now correctly calls the
`research-service` and renders a `business_research_dashboard` artifact. This
pattern should be followed for future tool integrations.

---

## 📅 **EXECUTION SEQUENCE (AFTER FRAG-005)**

### Phase 1: Agent-Driven UI Artifacts (Current Sprint - 1.5 weeks) ✅

1.  **[FRAG-017](tickets/FRAG-017-Create-Mastra-Chat-Proxy.md)** – Create Mastra
    Chat Proxy in Fragment ✅
    - **Status**: COMPLETED
    - **Objective**: Proxy chat streaming to `agents-mastra`, streaming
      structured artifacts.
    - **Dependencies**: None.

2.  **[FRAG-018](tickets/FRAG-018-Define-UI-Artifact-Schemas.md)** – Define UI
    Artifact Schemas in Agents-Mastra ✅
    - **Status**: COMPLETED
    - **Objective**: Define Zod schemas for all UI artifacts as the single
      source of truth.
    - **Dependencies**: None.

3.  **[FRAG-019](tickets/FRAG-019-Create-Artifact-Creator-Utility.md)** – Create
    Artifact Creator Utility in Agents-Mastra ✅
    - **Status**: COMPLETED
    - **Objective**: Create a utility to simplify and validate artifact payload
      creation by agents.
    - **Dependencies**: `FRAG-018`.

4.  **[FRAG-020](tickets/FRAG-020-Supervisor-Agent-Artifact-Integration.md)** –
    Supervisor Agent Artifact Integration ✅
    - **Status**: COMPLETED
    - **Objective**: Modify `supervisorAgent` to generate structured UI artifact
      data directly.
    - **Dependencies**: `FRAG-018`, `FRAG-019`.

5.  **[FRAG-021](tickets/FRAG-021-Create-Chromeless-UI-Artifact-Components.md)**
    – Create Chromeless UI Artifact Components (packages/ui) ✅
    - **Status**: COMPLETED
    - **Objective**: Create chromeless React components in `packages/ui` to
      render structured artifact data.
    - **Dependencies**: `FRAG-018`.

6.  **[FRAG-022](tickets/FRAG-022-Implement-Dynamic-Artifact-Renderer.md)** –
    Implement Dynamic Artifact Renderer (Fragment) ✅
    - **Status**: COMPLETED
    - **Objective**: Implement a dynamic renderer in `apps/fragment` to display
      the latest structured UI artifact.
    - **Dependencies**: `FRAG-017`, `FRAG-018`, `FRAG-021`.

7.  **[FRAG-023](tickets/FRAG-023-Integrate-UnifiedChatBlock-with-Mastra-Artifacts.md)**
    – Integrate UnifiedChatBlock with Mastra Artifacts ✅
    - **Status**: COMPLETED
    - **Objective**: Integrate `UnifiedChatBlock` with the new chat proxy and
      `ArtifactRenderer`.
    - **Dependencies**: `FRAG-017`, `FRAG-022`, `FRAG-021`.

### Future Roadmap (Re-prioritized)

These tickets are now re-sequenced to follow the completion of the agent-driven
UI artifacts.

8.  **[FRAG-007](tickets/FRAG-003-Real-GEO-Data-Integration.md)** – Real GEO
    Data Integration ✅
    - **Status**: COMPLETED
    - **Note**: This now focuses on the _agent-driven_ real GEO data
      integration, consuming artifacts from the supervisor agent.
    - **Dependencies**: `FRAG-020` (Supervisor Agent emitting artifacts).

9.  **[FRAG-008](tickets/FRAG-004-Actionable-Recommendations-Engine.md)** –
    Actionable Recommendations Engine ✅
    - **Status**: COMPLETED
    - **Note**: This now depends on the `RecommendAgent` emitting
      `RecommendationsCard` artifacts.
    - **Dependencies**: `FRAG-020` (Supervisor Agent emitting artifacts).

10. **[FRAG-021](tickets/FRAG-005-Fragment-Pulse-Email.md)** – Fragment Pulse
    Email 🚨
    - **Status**: PENDING
    - **Dependencies**: Agent pipeline generating comprehensive data.

11. **[FRAG-026](tickets/FRAG-006-Agent-Orchestrator.md)** – Agent Orchestrator
    🚨
    - **Status**: READY
    - **Dependencies**: `FRAG-007` (for agent-driven data flow).

12. **[FRAG-031](tickets/FRAG-002-Open-Deep-Research-Integration.md)** –
    Research-API Extraction 🚨
    - **Status**: PENDING
    - **Note**: This ticket was previously completed in terms of stripping the
      UI. Its `ID` is now associated with that original task. Future deep
      research needs will leverage MCP.

13. **[FRAG-032](tickets/FRAG-007-MCP-Client-Integration.md)** – MCP Client
    Integration 🚨
    - **Status**: READY
    - **Dependencies**: `FRAG-031` (for research-api MCP endpoint).

14. **[FRAG-033](tickets/FRAG-008-TrendFinder-Integration.md)** – TrendFinder
    Integration 🚨
    - **Status**: ROADMAP

15. **[FRAG-009](tickets/FRAG-009-Mastra-UI-Integration.md)** – Mastra UI
    Integration 🚧
    - **Status**: PENDING
    - **Note**: This is now covered by FRAG-017, FRAG-022, FRAG-023. This ticket
      will be updated to reflect that it's largely superseded by the more
      detailed artifact integration plan.

16. **[FRAG-010](tickets/FRAG-010-Widget-Block-Test.md)** – Widget Block Display
    Test 🧪
    - **Status**: PENDING
    - **Note**: This test will validate the artifact rendering once `FRAG-022`
      and `FRAG-023` are complete.

17. **[FRAG-011](tickets/FRAG-011-Mastra-Agent-Discovery.md)** – Integrate
    Mastra Agent Discovery in UI 🚨
    - **Status**: PENDING

---

## 🎯 **CURRENT FOCUS**

**This Hour's Goal**: Implement the agent-driven real GEO data integration,
focusing on the `GeoScoreCard` and `RecommendationsCard` artifacts. **Success
Metric**: User can initiate a GEO analysis, and the agent streams back
structured `GeoScoreCard` and `RecommendationsCard` data that is correctly
rendered in the UI. **Blocker Resolution**: Phase 1 is complete, unblocking
Phase 2.

**Developer Instructions**:

1.  **Prioritize FRAG-007.** This is the next foundational piece.
2.  Proceed with `FRAG-008` after `FRAG-007` is complete, as it builds on
    similar principles of agent-driven artifact generation.
3.  **Remember the "one artifact per block" rule** as you implement agent logic
    to emit these artifacts.
4.  **Do NOT spend time on linting errors until all implementation for the
    current feature is done**, unless specifically addressed by a ticket like
    `FRAG-012`.

---

## 📊 **BACKLOG ORGANIZATION**

### Phase 1: Agent-Driven UI Artifacts (Current Sprint - High Priority) ✅

- `FRAG-017`: Create Mastra Chat Proxy in Fragment
- `FRAG-018`: Define UI Artifact Schemas in Agents-Mastra
- `FRAG-019`: Create Artifact Creator Utility in Agents-Mastra
- `FRAG-020`: Supervisor Agent Artifact Integration
- `FRAG-021`: Create Chromeless UI Artifact Components (packages/ui)
- `FRAG-022`: Implement Dynamic Artifact Renderer (Fragment)
- `FRAG-023`: Integrate UnifiedChatBlock with Mastra Artifacts

### Phase 2: Agent-Driven Real Data & Orchestration (Next Sprint - Medium Priority) ✅

- `FRAG-007`: Real GEO Data Integration (agent-driven) ✅
- `FRAG-008`: Actionable Recommendations Engine (agent-driven) ✅
- `FRAG-026`: Agent Orchestrator ✅

### Phase 3: Infrastructure & Advanced Features (Future Sprints - Lower Priority) 🚨

- `FRAG-021` (original Pulse Email): Fragment Pulse Email ✅
- `FRAG-031`: Research-API Extraction (Re-scoped & Completed: Now leverages MCP
  (remove) via Mastra Chat Proxy for deep research, `businessResearchTool`
  updated.) ✅
- `FRAG-032`: MCP Client Integration (Unblocked by FRAG-031 completion)
  🚨(remove)
- `FRAG-033`: TrendFinder Integration(remove)
- `FRAG-009`: Mastra UI Integration (Revisit after artifact flow is solid)
- `FRAG-010`: Widget Block Display Test (Testing `FRAG-022`/`FRAG-023`)(test
  with real data since firecrawl tools return should retrun real daata now)
- `FRAG-011`: Integrate Mastra Agent Discovery in UI( not needed)

---

## 📋 TECHNICAL DEBT & INFRASTRUCTURE

### High Impact (Revenue Blockers) 🚨

- Error handling and monitoring (general)
- Security and compliance (general)

### Medium Impact (Quality of Life) ⚠️

- `FRAG-012`: Resolve TypeScript Type Inference Error in geoSuiteTools.ts
- `FRAG-016`: TypeScript Error Fixes (ongoing, but focus on current feature
  first)
- Developer experience (general)
- Performance optimization (general)

### Low Impact (Future Consideration) 💡

- Advanced features (general)

---

## 🎨 UI/UX IMPROVEMENTS

### Revenue-Critical 🚨

- Onboarding experience
- Dashboard polish

### Enhancement Priority ⚠️

- Advanced interactions

---

## 🚀 GO-TO-MARKET TASKS

### Immediate (This Week) 🔥

- Customer research
- Content creation

### Short-term (Next Month) ⚠️

- Marketing foundation

---

## 📊 METRICS & ANALYTICS

### Revenue Metrics (Daily Tracking) 🎯

- Key metrics dashboard
- Product metrics

### Technical Metrics (Weekly Review) 🔧

- Performance monitoring

---

## 🚨 RISK MITIGATION

### Technical Risks & Solutions

- API Dependencies
- Response Quality
- Performance Under Load

### Business Architecture Risks

- Customer Expectations
- Competitive Response
- Pricing Pressure

### Mitigation Strategies

- Beta Customer Feedback Loop
- Technical Performance Monitoring
- Manual Override System

---

## 🎯 SUCCESS DEFINITIONS BY PHASE

### Week 1 Success ✅

- Real GEO data working for 10 businesses
- 5 beta customers successfully analyze their visibility
- <5 second response time for GEO scans
- Positive feedback from all beta testers

### Week 2 Success ✅

- First paying customer acquired ($49/month)
- Customer can track GEO improvements over time
- Recommendation engine provides actionable insights
- $2K MRR pipeline established

### Month 1 Success ✅

- $2K MRR achieved
- 20 paying customers
- 80% customer retention rate
- Product-market fit indicators (>8/10 must-have score)

---

## 📅 SPRINT PLANNING

### Current Sprint (Week of Jan 19) 🚧

**Sprint Goal**: Implement core agent-driven UI artifact pipeline.

**Daily Standups**: 9am PST **Sprint Review**: Friday 4pm PST **Retrospective**:
Friday 5pm PST

### Next Sprint (Week of Jan 26) 🚨

**Sprint Goal**: Convert beta customers to paying customers (original
FRAG-007/008 focus).

**Focus**: Revenue conversion and customer success

---

## 🤝 TEAM RESPONSIBILITIES

### Engineering Priority 🔧

1.  **FRAG-017 / FRAG-018**: Chat Proxy / Define Schemas (Start Immediately)
2.  **FRAG-019 / FRAG-020**: Artifact Creator / Supervisor Integration
3.  **FRAG-021 / FRAG-022 / FRAG-023**: Chromeless UI / Artifact Renderer /
    UnifiedChatBlock Integration
4.  **FRAG-007 / FRAG-008**: Real GEO Data / Recommendations (after artifact
    pipeline is solid)

### Product Priority 📈

1.  Customer Research
2.  Beta Recruitment
3.  Conversion Optimization

### Growth Priority 🚀

1.  Content Creation
2.  Outreach
3.  Metrics

---

**TODO Status**: 🚧 **ACTIVE EXECUTION - ALL HANDS ON DECK** **Success Metric**:
First paying customer = validation, no customers = pivot\*\* **Review Cadence**:
Daily during revenue sprint, weekly during scale phase\*\*

### **⚙️ NEXT PRIORITY: FRAG-026 - Agent Orchestrator & Memory Bus**

> **📋 Full Ticket**:
> [FRAG-026-Agent-Orchestrator.md](./tickets/FRAG-026-Agent-Orchestrator.md)

**Goal**: Replace monolithic `/api/geo-scan` logic with PIPER-5 agent pipeline.

#### **Sprint Tasks (3 days)** 🚧

- [ ] **Scaffold `lib/agent-bus.ts`**
  - [ ] Define `AgentContext`, `Agent` type, and `runPIPER5` orchestrator
- [ ] **Implement `probeAgent`** (crawl + multi-LLM calls)
- [ ] **Implement `ingestAgent`** (normalize & store facts)
- [ ] **Wire new orchestrator into `/api/geo-scan` behind `?agents=true` flag**
- [ ] **Add unit test** for orchestrator flow with mocked agents

#### **Acceptance** ✅

- API returns `facts` array with at least 3 fact types (mention, price,
  prompt_gap)
- Response time ⩽ 8 s for 3-query scan (OK to optimize later)
- Pulse Email consumes new output without changes to UI

### **🔥 CRITICAL: FRAG-031 - Research-API Extraction**

> **📋 Full Ticket**:
> [FRAG-031-Research-API-Extraction.md](./tickets/FRAG-031-Research-API-Extraction.md)

**Goal**: Convert `apps/open-deep-research` into a standalone API service that
Fragment agents can call for deep research tasks.

#### **Day 1: Create Research-API App Structure** 🚧

- [ ] **Create new app directory**
  - [ ] `mkdir apps/research-api`
  - [ ] Copy `apps/open-deep-research/` → `apps/research-api/`
  - [ ] Update `package.json` name to `"research-api"` and remove UI
        dependencies:
    ```json
    // Remove: next-themes, radix-ui, tailwindcss, lucide-react, @types/react-dom
    // Keep: next, react, ai, firecrawl, drizzle-orm, zod
    // Keep core logic: firecrawl research tools, AI integration
    ```

- [ ] **Strip UI components and auth**

  ```bash
  # Remove UI-specific directories
  rm -rf apps/research-api/app/(auth)
  rm -rf apps/research-api/components/ui
  rm -rf apps/research-api/components/auth-form.tsx
  rm -rf apps/research-api/components/chat.tsx
  rm -rf apps/research-api/hooks

  # Keep only:
  # - apps/research-api/app/api/ (API routes)
  # - apps/research-api/lib/ (core logic)
  # - apps/research-api/app/layout.tsx (minimal)
  # - apps/research-api/app/page.tsx (health check)
  ```

- [ ] **Create minimal health check page**

  ```typescript
  // apps/research-api/app/page.tsx
  export default function HealthPage() {
    return (
      <div className="p-8">
        <h1>Research API Service</h1>
        <p>Status: ✅ Active</p>
        <p>Endpoints: /api/research</p>
      </div>
    );
  }
  ```

#### **Day 2: Extract Deep Research Logic** 🚧

- [ ] **Create research API route**

  ```typescript
  // apps/research-api/app/api/research/route.ts
  import { NextRequest, NextResponse } from "next/server";
  import { deepResearchService } from "@/lib/services/deep-research";

  export async function POST(request: NextRequest) {
  	try {
  		const { topic, maxDepth = 3, focus } = await request.json();

  		if (!topic) {
  			return NextResponse.json(
  				{ success: false, error: "Topic is required" },
  				{ status: 400 }
  			);
  		}

  		// Uses existing deep-research logic but simplified:
  		// 1. No auth/user management (stripped out)
  		// 2. No database persistence (removed)
  		// 3. Structured JSON response for agent consumption
  		const results = await deepResearchService.execute({
  			topic,
  			maxDepth: Math.min(maxDepth, 5),
  			focus: focus || "business_analysis",
  		});

  		return NextResponse.json({
  			success: true,
  			data: {
  				findings: results.findings, // Array of research facts
  				analysis: results.analysis, // LLM summary
  				sources: results.sources, // Source URLs + metadata
  				execution_time_ms: results.executionTime,
  			},
  		});
  	} catch (error) {
  		console.error("Research API error:", error);
  		return NextResponse.json(
  			{ success: false, error: "Research failed" },
  			{ status: 500 }
  		);
  	}
  }

  export async function GET() {
  	return NextResponse.json({
  		status: "ok",
  		service: "research-api",
  		version: "1.0.0",
  	});
  }
  ```

- [ ] **Extract and simplify deepResearchService**

  ```typescript
  // apps/research-api/lib/services/deep-research.ts
  // Extracted from: apps/open-deep-research/app/(chat)/api/chat/route.ts

  import { firecrawl } from "@/lib/firecrawl";
  import { openai } from "ai";

  export const deepResearchService = {
  	async execute({
  		topic,
  		maxDepth,
  		focus,
  	}: {
  		topic: string;
  		maxDepth: number;
  		focus: string;
  	}) {
  		const startTime = Date.now();

  		// Extract the core deep research logic from original chat route
  		// Remove all UI/streaming/user management parts
  		// Return structured data instead of streaming

  		const findings = await this.gatherFindings(topic, maxDepth);
  		const analysis = await this.synthesizeAnalysis(findings, focus);
  		const sources = this.extractSources(findings);

  		return {
  			findings,
  			analysis,
  			sources,
  			executionTime: Date.now() - startTime,
  			currentDepth: maxDepth,
  		};
  	},

  	// ... implement helper methods
  };
  ```

#### **Day 3: Remove Dependencies & Simplify** 🚧

- [ ] **Strip authentication logic**

  ```bash
  # Remove auth-related files
  rm -rf apps/research-api/app/(auth)
  rm -rf apps/research-api/middleware.ts
  rm apps/research-api/lib/auth.ts
  ```

- [ ] **Remove database dependencies**

  ```bash
  # Remove database-related files
  rm -rf apps/research-api/lib/db
  rm apps/research-api/drizzle.config.ts

  # Update package.json to remove:
  # - drizzle-orm, drizzle-kit
  # - postgres-related packages
  ```

- [ ] **Simplify error handling**

  ```typescript
  // Simple error responses without exposing internals
  try {
  	// research logic
  } catch (error) {
  	console.error("Research failed:", error);
  	return NextResponse.json(
  		{ success: false, error: "Research service unavailable" },
  		{ status: 500 }
  	);
  }
  ```

- [ ] Research-API logs structured errors without exposing internal details

#### **Acceptance Criteria** ✅

- [ ] MCP client can connect to and discover tools from MCP servers
- [ ] Firecrawl MCP server exposes search, extract, scrape tools
- [ ] Fragment agents can call Firecrawl tools via MCP (not direct API)
- [ ] MCP failures don't crash agents (graceful degradation)
- [ ] Tool discovery is logged with server names and tool counts
- [ ] Response format includes MCP source attribution
- [ ] System can add new MCP servers without code changes

---

### **🚀 FUTURE EPIC: FRAG-033 - TrendFinder API Integration (Post-MVP)**

**Goal**: Create a simplified version of TrendFinder for social monitoring and
trend detection in Fragment.

#### **Core Features to Extract from TrendFinder**

- [ ] **Social Media Monitoring**
  - [ ] Twitter/X influencer tracking (rate-limited via X API free tier)
  - [ ] Website change detection via Firecrawl `/extract`
  - [ ] Reddit trend analysis for industry conversations

- [ ] **AI Trend Analysis**
  - [ ] Sentiment analysis of collected posts
  - [ ] Trend significance scoring
  - [ ] Competitive intelligence extraction

- [ ] **Alert System**
  - [ ] Slack/Discord webhook notifications
  - [ ] Email alerts via Fragment Pulse Email
  - [ ] Dashboard trend widgets

#### **Implementation Strategy**

- [ ] **Phase 1**: Extract core monitoring logic from
      https://github.com/iankiku/trendFinder
- [ ] **Phase 2**: Create `apps/trend-api` service (similar to research-api
      pattern)
- [ ] **Phase 3**: Integrate with Fragment via MCP tools
- [ ] **Phase 4**: Add trend widgets to Fragment dashboard

#### **Value Proposition**

"Fragment doesn't just tell you that you're invisible to AI search — it shows
you exactly what your competitors are doing to stay visible and alerts you to
new opportunities in real-time."

---

## ⚡ **CRITICAL SUCCESS FACTORS**

1. **FRAG-005 Completion**: Must be working within 6 hours
2. **Real Data Flow**: Fragment → Research-Service → Dashboard artifacts
3. **User Value**: Immediate competitive intelligence insights
4. **Technical Foundation**: Context7 MCP compliance for future agent
   consumption

**Remember**: Every feature depends on real data. FRAG-005 is the keystone that
enables everything else.

---
