# FRAG-001: Local Dev Setup for fragmentV2

**Status:** 🚨 Pending **Sprint:** Now **Owner:** Engineering

---

## 🎯 Context & Goal

Migrate the Vercel AI Chatbot template to work locally in our monorepo, using
our infra (Postgres/Supabase, Upstash Redis, local file storage, custom agents).
This is foundational for all future development.

---

## Task Description

- Remove Vercel-specific infra (Neon, Vercel Blob, Vercel Redis).
- Integrate packages/database for all DB access.
- Use Upstash Redis for session/cache.
- Use local file storage for dev.
- Abstract AI SDK for agent plug-in.

---

## Project Overview

- **Repo:** apps/fragmentV2
- **Stack:** Next.js 15, React 19, shadcn/ui, Tailwind, packages/database,
  Upstash Redis, local file storage, Vercel AI SDK, custom agents

⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️ Paste the **entire** PIPER-5 protocol
here. ⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️

---

## [MODE: RESEARCH] Analysis

- Vercel template is tightly coupled to Neon/Drizzle, Vercel Blob, and Vercel
  Redis.
- Our infra uses Postgres/Supabase, Upstash Redis, and local file storage.
- All DB access must go through packages/database for consistency and future ORM
  flexibility.
- File storage must be local for dev, pluggable for prod.
- AI SDK must support both LLMs and our custom agents.

---

## [MODE: PLAN] Proposed Solution

- Refactor DB, Redis, and file storage layers.
- Test all flows locally.
- Document setup.

---

## Implementation Checklist

### 1. (skip- removed)

### 2. Redis Integration

- [ ] **Audit:** Locate all code importing or using a Redis client (e.g.,
      `ioredis`, `@vercel/redis`). This is likely in `lib/redis.ts` or similar
      utility files.
- [ ] **Refactor:** Replace the existing Redis client with the `@upstash/redis`
      SDK, using the REST API. All interactions should be wrapped in a utility
      module (e.g., `lib/cache.ts`).
- [ ] **Configure:** Update `.env.local` and `.env.example` with
      `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- [ ] **Test:** Verify that session management, chat history streaming, and any
      other caching mechanisms are fully functional with Upstash.

### 3. File Storage Abstraction

- [ ] **Design Adapter:** Create a storage provider interface in
      `lib/storage/index.ts`. It should define methods like `upload`,
      `download`, and `getPublicUrl`.
- [ ] **Implement Local Adapter:** Create a `lib/storage/local.ts` that
      implements the storage provider interface using the local file system
      (`fs/promises`). Files should be stored in a `data/uploads` directory
      within `apps/fragmentV2`.
- [ ] **Refactor API Routes:** Update all file-related API routes (e.g.,
      `/api/upload`) to use the new storage provider. The provider should be
      dynamically selected based on an environment variable
      (`STORAGE_PROVIDER=local`).
- [ ] **Remove Vercel Blob:** Delete all code related to `@vercel/blob`.

### 4. AI Integration Abstraction

- [ ] **Design Service Layer:** Create a new service at
      `lib/ai/agent-service.ts`. This service will be responsible for handling
      all interactions with AI models. (apps/agents is the brain for our agents)
- [ ] **Implement Agent Wrapper:** The `agent-service` should have a primary
      method, e.g., `invoke(prompt, options)`. Internally, it will use a
      strategy pattern to decide whether to call a standard LLM via the Vercel
      AI SDK or one of our custom agents. see example implementation from
      @fragment/lib/mastra-api.ts and mastra.ts also see how the chat/routes
      uses it. in fragment/app/api/chat/routes.ts
- [ ] **Configuration:** Add a configuration file or environment variables to
      specify which model or agent to use for different tasks. For the MVP, a
      simple `AI_PROVIDER` (`vercel` or `custom`) environment variable will
      suffice.
- [ ] **Refactor Chat API:** Update the chat API route (`/api/chat`) to use the
      new `agent-service` instead of directly calling the Vercel AI SDK.
- [ ] **Sample Agent:** Ensure a simple "hello world" custom agent is available
      for testing the custom agent path.

### 5. Testing & Documentation

- [ Skip this] **E2E Test Script:** Create a simple script (e.g.,
  `scripts/test-local-setup.ts`) that automates the core user flow: sign up, log
  in, start a chat, upload a file, and receive a response. This will serve as a
  quick verification tool.
- [ ] **Local Dev README:** Create a `README.local.md` in `apps/fragmentV2` that
      provides step-by-step instructions for setting up the local development
      environment, including the database, Redis, and environment variables.
- [ ] **Run All Flows:** Manually run all flows (auth, chat, artifact creation,
      file upload) locally to catch any issues not covered by the script.
- [ ] **Document Issues:** Document any issues, missing features, or
      architectural decisions in `project-docs/fragment-v2/technical-notes.md`.

---

## ✅ Acceptance Criteria

- All core features (auth, chat, artifact, file upload) work locally using our
  infra.
- No dependency on Vercel-specific services for local dev.
- Clear documentation for local setup.

---

## 🚫 Out of Scope / Backlog

- Cloud file storage (for prod)
- Multi-agent orchestration
- Advanced analytics

---

## 📎 References

- [project-docs/pitch-deck.md](../../project-docs/pitch-deck.md)
- [packages/database/](../../packages/database/)
- [PIPER-5 protocol](../../.vibeflow/piper-5.mdc)

---

# Task Progress

- [2025-07-08 10:00] — Started DB audit

# Final Review

[REVIEW verdict]
