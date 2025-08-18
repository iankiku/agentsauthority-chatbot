# Technical Design Document

> **Single Source of Truth:** See [docs/ARCHITECTURE.md](ARCHITECTURE.md) for
> canonical agent and UI block design.

## 1. High‑Level Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Front‑end   │◀───▶│ Mastra API  │◀───▶│ Mastra Core │
│ (React)     │     │ (Next.js)   │     │ (Workflows, │
└─────────────┘     └─────────────┘     │  Agents,    │
                                        │  Tools)     │
                                        └─────────────┘
                                          ▲    ▲    ▲
                                          │    │    │
                    ┌────────────┐        │    │    │
                    │ Data Store │◀───────┘    │    │
                    │ (Supabase) │            │    │
                    └────────────┘            │    │
                                              │    │
                                       ┌────────────┐
                                       │  Third‑party│
                                       │  APIs & LLM │
                                       └────────────┘
```

## 2. Components

- **All agent requests are routed through Mastra agents.** Vercel AI SDK may be
  used for streaming/transport, but all business logic and tool use is handled
  by Mastra.
- **All UI blocks are chromeless by default.** Chrome (header/actions) appears
  only when an artifact is present or required by UX.
- **Tools (`src/tools/*.ts`):** Zod‑validated wrappers around Firecrawl,
  prerender, LLM calls.
- **Agents (`src/agents/*.ts`):** Minimal instruction + tool set per domain use
  case.
- **Workflows (`src/workflows/*.ts`):** Declarative sequences of `createStep()`,
  `.asSubWorkflow()`, `.dountil()`.
- **Scheduler (`src/schedule.ts`):** Uses automations to register cron jobs.
- **Meta‑Agents:** `codeWriterAgent`, `qaAgent` for dynamic code generation &
  QA.
- **Prompt Loader:** `src/prompts/prompts.ts` for consistency and interpolation.

## 3. Data Flow

- **Trigger:** API request or scheduled automation.
- **Workflow Start:** `workflow.start(input)` creates a run.
- **Step Execution:** Each `createStep(toolOrAgent)` is invoked with mapped
  inputs.
- **Streaming:** `run.stream()` emits events (step:start, step:complete,
  thought).
- **Result:** `run.result()` returns aggregated JSON.
- **Storage:** Use event hooks (`run.on("step:complete")`) to persist outputs in
  Supabase tables for history/trends.

## 4. Scheduling & Automations

- **`DailyAIPulse`:** Cron at 07:00 CST defined via
  `automations.create({schedule: RRULE...})`.
- **On‑Demand:** expose `/api/workflows/:id/stream` endpoints.
- **Webhook:** future support for GitHub Actions, Zapier integrations.

## 5. Scaling & Resilience

- **Horizontal Scaling:** Mastra agent executors can run on multiple workers
  (serverless).
- **Retry Policies:** Wrap critical tools (e.g., prerender) with exponential
  back‑off.
- **Monitoring:** Emit telemetry in `experimental_telemetry` for observability
  (Trace, Metrics).

## 6. Security & Permissions

- **API Keys:** Stored in environment variables (Vercel Secrets / Supabase).
- **Access Control:** Only authenticated users can trigger workflows.
- **Data Encryption:** Use TLS for all third‑party calls, encryption at rest for
  Supabase.

## 7. Fragment ↔ Mastra Integration (NEW)

With the migration to **`apps/agents-mastra`** the legacy `@/agents` / `@/ai`
packages are **deprecated**. All future backend calls must target the Mastra
runtime.

### 7.1 API Surface (available from `apps/agents-mastra`)

| Endpoint                            | Method | Purpose                                                                            |
| ----------------------------------- | ------ | ---------------------------------------------------------------------------------- |
| `/api/mastra/workflows/:workflowId` | `POST` | Kick-off a workflow run with JSON payload = workflow _input_. Returns `{ runId }`. |
| `/api/mastra/runs/:runId/stream`    | `GET`  | Server-sent event (SSE) stream for real-time step updates & final result.          |
| `/api/mastra/tools/:toolId`         | `POST` | Direct ad-hoc tool execution (e.g., **widgetTool**) for lightweight UI demos.      |

All responses follow the Mastra **Run Event** schema so the Fragment app can
treat every backend call the same—whether it is a one-off tool or a multi-step
workflow.

### 7.2 Fragment Client SDK (thin wrapper)

A new helper wrapper lives at `apps/fragment/lib/mastra-client.ts`:

```ts
export class MastraClient {
	async startWorkflow(workflowId: string, input: any) {
		const res = await fetch(`/api/mastra/workflows/${workflowId}`, {
			method: "POST",
			body: JSON.stringify(input),
		});
		if (!res.ok) throw new Error(await res.text());
		return res.json() as Promise<{ runId: string }>;
	}

	streamRun(runId: string, onEvent: (data: any) => void) {
		const evtSrc = new EventSource(`/api/mastra/runs/${runId}/stream`);
		evtSrc.onmessage = (ev) => onEvent(JSON.parse(ev.data));
		return () => evtSrc.close();
	}

	async callTool(toolId: string, input: any) {
		const res = await fetch(`/api/mastra/tools/${toolId}`, {
			method: "POST",
			body: JSON.stringify(input),
		});
		if (!res.ok) throw new Error(await res.text());
		return res.json();
	}
}
```

### 7.3 Generative Block UI Flow

1. **Fragment component** dispatches
   `startWorkflow("geoAnalysisWorkflow", input)`.
2. The UI subscribes to `streamRun(runId)` and pushes each event into the
   existing **Block Engine** store (`blocks/addEvents`).
3. When a `step:complete` event contains a **widget layout** payload the
   `ArtifactRenderer` automatically mounts `ReactGridLayout` widgets.
4. The same pattern supports ad-hoc demos: e.g., clicking "Generate Widget"
   calls `callTool("widget-tool", { widgets:[...] })` and pipes the result into
   the Block renderer.

> NOTE: All code samples now import from **`@/agents-mastra/...`** – update any
> lingering `@/agents` or `@/ai` references.

---

For full architecture and integration details, see
[docs/ARCHITECTURE.md](ARCHITECTURE.md).
