# FRAG-005: AI SDK & Agent Integration for fragmentV2

**Status:** 🚨 Pending **Sprint:** Now **Owner:** Engineering

---

## 🎯 Context & Goal

Abstract the AI SDK integration in fragmentV2 to support both LLMs (e.g., xAI
Grok, OpenAI) and our custom agents, enabling flexible orchestration and future
extensibility.

---

## Task Description

- Refactor AI SDK usage to allow agent plug-in.
- Add config to select between LLM and agent.
- Test with both xAI Grok and a sample agent.

---

## Project Overview

- **Repo:** apps/fragmentV2
- **Stack:** Next.js 15, Node.js, Vercel AI SDK, custom agent framework

⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️ Paste the **entire** PIPER-5 protocol
here. ⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️

---

## [MODE: RESEARCH] Analysis

- fragmentV2 currently uses Vercel AI SDK for LLM integration.
- We need to support custom agents for advanced orchestration.
- Configurable selection between LLM and agent is required.

---

## [MODE: PLAN] Proposed Solution

- Refactor AI SDK usage to allow agent plug-in.
- Add config to select between LLM and agent.
- Test with both xAI Grok and a sample agent.

---

## Implementation Checklist

- [ ] **Design AI Provider Interface:**
  - In `apps/fragmentV2/lib/ai/index.ts`, define an `AIProvider` interface with
    a single method: `generate(prompt: string, options: any): Promise<any>`.
- [ ] **Implement Vercel AI SDK Adapter:**
  - Create `apps/fragmentV2/lib/ai/providers/vercel.ts` that implements the
    `AIProvider` interface and uses the Vercel AI SDK to make calls to LLMs like
    xAI Grok and OpenAI.
- [ ] **Implement Custom Agent Adapter:**
  - Create `apps/fragmentV2/lib/ai/providers/custom.ts` that implements the
    `AIProvider` interface and is responsible for loading and executing custom
    agents.
  - This adapter will need to be able to dynamically load agent code from a
    specific directory (e.g., `apps/fragmentV2/agents`).
- [ ] **Create AI Service Factory:**
  - Create a factory function in `apps/fragmentV2/lib/ai/index.ts` that returns
    the appropriate AI provider based on an environment variable (e.g.,
    `AI_PROVIDER=vercel` or `AI_PROVIDER=custom`).
- [ ] **Refactor Chat API:**
  - Update the chat API route (`apps/fragmentV2/app/api/chat/route.ts`) to use
    the AI service factory to get the current AI provider and then call the
    `generate` method.
- [ ] **Create Sample Agent:**
  - Create a simple "hello world" agent in `apps/fragmentV2/agents/hello.ts`
    that can be used for testing the custom agent integration.
- [ ] **Testing:**
  - Test the chat functionality with the `AI_PROVIDER` set to `vercel` to ensure
    that the Vercel AI SDK integration is still working.
  - Test the chat functionality with the `AI_PROVIDER` set to `custom` to ensure
    that the custom agent integration is working.
- [ ] **Documentation:**
  - Create a `README.md` in `apps/fragmentV2/lib/ai` that explains the AI
    provider abstraction and how to create and use new AI providers and custom
    agents.

---

## ✅ Acceptance Criteria

- AI SDK can call both LLMs and custom agents.
- Config allows switching between LLM and agent.
- All features work as expected after integration.

---

## 🚫 Out of Scope / Backlog

- Multi-agent orchestration (future)
- Migration of other apps/packages

---

## 📎 References

- [project-docs/pitch-deck.md](../../project-docs/pitch-deck.md)
- [PIPER-5 protocol](../../.vibeflow/piper-5.mdc)

---

# Task Progress

- [2025-07-08 10:00] — Started AI SDK/agent integration

# Final Review

[REVIEW verdict]
