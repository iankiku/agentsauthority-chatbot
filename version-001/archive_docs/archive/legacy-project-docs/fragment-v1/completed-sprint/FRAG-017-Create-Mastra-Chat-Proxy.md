# FRAG-017 – Create Mastra Chat Proxy in Fragment

## 🚧 Status: COMPLETED

## Priority: High

## Effort: Medium

## Owner: AI / Junior Engineer

---

## 🎯 OBJECTIVE

Create a Next.js API route in `apps/fragment` that acts as a proxy to the
`apps/agents-mastra` server, specifically for agent chat streaming. This is a
critical step to enable `fragment` to communicate directly with our Mastra agent
system for real-time, artifact-driven conversations.

---

## 🔑 KEY TASKS

1.  **Create New API Route File**:
    - Location: `apps/fragment/app/api/mastra/chat/route.ts`
2.  **Implement POST Handler**:
    - This handler will receive `messages` from the `UnifiedChatBlock` component
      (which will later be updated to point to this new API).
    - Import `supervisorAgent` from
      `@workspace/agents-mastra/mastra/agents/supervisors`.
    - Import `AgentArtifactResponseSchema` from
      `@workspace/agents-mastra/mastra/schemas/artifactSchemas`.
    - **Crucially**: Call `supervisorAgent.stream()` with the incoming messages.
      Pass `AgentArtifactResponseSchema` to the `output` option of `stream()` to
      instruct the agent to generate structured output.
    - Process the `agentResponseStream` (which contains both `textStream` and a
      `promise` for the `object` artifact) into a `ReadableStream` that
      `fragment`'s `useChat` hook can consume. Send both text chunks and
      structured artifact data as Server-Sent Events (SSE) with distinct event
      types (e.g., `event: text` and `event: artifact`).
      - **Hint**: You'll need to listen to `agentResponseStream.textStream` for
        text chunks and `agentResponseStream.object` for the final structured
        artifact. Combine these into a single SSE stream.
    - Ensure proper `Content-Type` headers for SSE (`text/event-stream`).
3.  **Basic Error Handling**:
    - Implement `try-catch` blocks to gracefully handle potential errors during
      agent execution or streaming.
4.  **No UI Changes Yet**:
    - **Do NOT** modify `apps/fragment/app/api/chat/route.ts` or
      `UnifiedChatBlock` in this task. Those updates will be part of a later
      task.

---

## ✅ ACCEPTANCE CRITERIA

- A new file `apps/fragment/app/api/mastra/chat/route.ts` is created.
- The `POST` handler successfully calls `supervisorAgent.stream()` with incoming
  messages and the artifact schema.
- The API route correctly streams both text and structured artifact data as
  distinct Server-Sent Events (SSEs).
- The `Content-Type` header is set to `text/event-stream`.
- Basic error handling is in place for agent communication failures.
- No changes are made to `apps/fragment/app/api/chat/route.ts` or
  `UnifiedChatBlock`.

---

## 🕒 ESTIMATE

2 dev-days

---

## 🔗 CONTEXT & REFERENCES

- **Plan**: Phase 1, Task 1.1: Create Mastra API Proxy in `apps/fragment`
- **Technical Design**: `TECH.md` section "5. Mastra Agent-Driven UI Artifacts
  (NEW)"
- **Mastra Docs**:
  [https://mastra.ai/en/reference/agents/stream](https://mastra.ai/en/reference/agents/stream)
  (for agent streaming with structured output) or ask the mcp tool
- **Related Tickets**: `FRAG-009` (Mastra UI Integration) - this task is a
  prerequisite for that.
