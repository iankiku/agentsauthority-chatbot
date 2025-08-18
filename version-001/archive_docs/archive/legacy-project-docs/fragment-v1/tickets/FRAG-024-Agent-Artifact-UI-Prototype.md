# FRAG-024: Agent → Artifact → UI Prototype (Weather Example)

**Status:** 🚨 Pending **Sprint:** Next **Owner:** Product/Engineering

---

## 🎯 Context & Goal

The goal of this ticket is to deliver a working prototype of the core Fragment
Intelligence loop using the **assistant** or **supervisor agent**. The prototype
should:

- Allow a user to interact with a UnifiedChatBlock in the dashboard.
- When the user asks a **weather-related question** (e.g., “What’s the weather
  in Paris?”), the agent should return:
  - A structured result (textual answer)
  - A **weather artifact** (e.g., weather card, chart, or visual block)
    conforming to the shared Zod schema
- The artifact and result are rendered in the UnifiedChatBlock UI, switching
  from chat to artifact view.

This should follow the artifact pattern as in the Vercel AI SDK examples (e.g.,
returning both a message and a visual artifact in the same response). **Mastra
is built on the Vercel SDK and can support all such flows.**

This prototype will serve as the foundation for all future agent-driven,
artifact-based dashboard features.

---

## 🧩 Implementation Checklist

### 1. **Assistant/Supervisor Agent Weather Artifact Response**

- [ ] Ensure the assistant or supervisor agent can return a valid weather
      artifact payload (e.g., weather card, chart) for a weather-related prompt.
- [ ] The agent response should include both a textual result and a structured
      artifact (as in Vercel SDK examples).
- [ ] Artifact must conform to the shared Zod schema (see
      `packages/ui/components/custom/artifacts/artifactSchemas.ts`).
- [ ] Add a test or mock endpoint if needed for rapid iteration.

### 2. **API Integration**

- [ ] `/api/chat` (or equivalent) in Fragment must route requests to the
      assistant or supervisor agent.
- [ ] Stream or return the artifact and result to the frontend.
- [ ] Handle errors and empty responses gracefully (return user-friendly error
      or empty state in UI).

### 3. **Artifact Schema Sync**

- [ ] Confirm that artifact schemas are in sync between agent and UI (weather
      card, chart, etc.).
- [ ] Document any required fields for the weather artifact type.

### 4. **UnifiedChatBlock UI**

- [ ] Ensure UnifiedChatBlock can detect and render the returned weather
      artifact and result in the UI.
- [ ] Block must be chromeless by default; chrome (header/actions) appears only
      when an artifact is present.
- [ ] Add a quick-action button for a “weather demo prompt” that reliably
      triggers artifact generation (e.g., “Show me the weather in New York”).
- [ ] Show a loading state (spinner or skeleton) while waiting for
      agent/artifact.
- [ ] Show clear error/empty state if agent cannot return an artifact.

### 5. **Minimal Dashboard Experience**

- [ ] User can add a UnifiedChatBlock to a dashboard (or pre-populate one for
      demo).
- [ ] Block state persists in localStorage or in-memory for the session
      (optional for prototype).
- [ ] Demo dashboard is visually polished (dark mode, branding, clear layout).

### 6. **Demo Flow**

- [ ] User (or demo user) can:
  - Add a UnifiedChatBlock
  - Enter a weather prompt (e.g., “What’s the weather in Tokyo?”)
  - See both a textual result and a weather artifact rendered in the block
- [ ] Provide a default weather prompt or quick-action for easy demo/testing.

---

## ✅ Acceptance Criteria

- [ ] User can interact with a UnifiedChatBlock, send a weather-related prompt,
      and receive both a structured artifact (weather card/chart) and a textual
      result rendered in the UI.
- [ ] At least one weather artifact type (card or chart) is supported
      end-to-end.
- [ ] Demo prompt/quick-action reliably triggers weather artifact generation.
- [ ] Error and empty states are user-friendly and visually consistent.
- [ ] All UI blocks are chromeless by default.
- [ ] All agent requests go through Mastra agents (not Vercel or legacy agents
      directly).
- [ ] Artifact schemas are in sync between agent and UI.
- [ ] The implementation follows the artifact pattern as in Vercel SDK examples
      (message + artifact in one response).

---

## 🎨 Visual/UX Requirements

- **Chromeless block design:** No header or chrome unless an artifact is
  present.
- **Artifact rendering:** Weather card/chart must be visually clear, responsive,
  and match design system (shadcn/ui).
- **Loading state:** Show spinner or skeleton while waiting for agent.
- **Error/empty state:** Show clear, actionable message if no artifact is
  returned.
- **Quick-action button:** Prominently placed for weather demo/testing.
- **Dark mode:** Prototype must work in both light and dark themes.
- **Branding:** Add logo, name, and tagline to dashboard for demo polish.

---

## 🚫 Out of Scope / Backlog

- Multi-agent orchestration
- Email, notifications, advanced security
- Full persistence (beyond session/localStorage)
- Advanced analytics, multi-modal, or collaborative features
- Automated tests (for now)

---

## 📎 References

- [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
- [project-docs/TECHNICAL_DESIGN.md](../TECHNICAL_DESIGN.md)
- [apps/fragment/components/blocks/UnifiedChatBlock.md](../../apps/fragment/components/blocks/UnifiedChatBlock.md)
- [packages/ui/components/custom/artifacts/artifactSchemas.ts](../../packages/ui/components/custom/artifacts/artifactSchemas.ts)
- [project-docs/completed-sprint/](../completed-sprint/)
- [Vercel AI SDK artifact examples](https://sdk.vercel.ai/docs/guides/tool-calling-artifacts)

---

**This ticket is the single source of truth for the prototype milestone. All
implementation, review, and demo should reference this ticket.**
