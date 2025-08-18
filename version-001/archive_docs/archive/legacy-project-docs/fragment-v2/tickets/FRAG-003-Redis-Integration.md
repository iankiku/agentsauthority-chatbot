# FRAG-003: Redis Integration for fragmentV2

**Status:** 🚨 Pending **Sprint:** Now **Owner:** Engineering

---

## 🎯 Context & Goal

Integrate Upstash Redis for all session, cache, and streaming needs in
fragmentV2, replacing any Vercel/Redis code and ensuring compatibility with our
monorepo infra.

---

## Task Description

- Replace any Vercel/Redis code with Upstash REST API.
- Update .env.local and config.
- Test session, chat history, and streaming features.

---

## Project Overview

- **Repo:** apps/fragmentV2
- **Stack:** Next.js 15, Node.js, Upstash Redis

⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️ Paste the **entire** PIPER-5 protocol
here. ⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️

---

## [MODE: RESEARCH] Analysis

- fragmentV2 currently uses Vercel/Redis for session and streaming.
- Monorepo standard is Upstash Redis via REST API.
- All session, cache, and streaming logic must be updated.

---

## [MODE: PLAN] Proposed Solution

- Replace all Redis code with Upstash REST API.
- Update .env.local and config.
- Test all session, chat, and streaming features.

---

## Implementation Checklist

- [ ] **Audit Redis Usage:**
  - Search the `apps/fragmentV2` codebase for all instances of `@vercel/redis`,
    `ioredis`, or any other Redis client library.
  - Identify all the features that use Redis, such as session storage, caching,
    and real-time streaming.
- [ ] **Implement Upstash Client:**
  - In a central module, (e.g., `lib/redis.ts`), initialize the Upstash Redis
    client using the `@upstash/redis` package.
  - Export the client instance and any helper functions for common Redis
    operations (e.g., `get`, `set`, `del`, `publish`).
- [ ] **Refactor Existing Code:**
  - Replace all the old Redis client calls with the new Upstash client
    functions.
  - Pay close attention to any differences in the API and ensure that the logic
    remains the same.
- [ ] **Update Configuration:**
  - Remove any Vercel Redis-related environment variables from `.env.example`
    and `.env.local`.
  - Add the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` variables
    and ensure they are properly documented.
- [ ] **Testing:**
  - Thoroughly test all the features that were refactored, including:
    - User login and session persistence.
    - Caching of database queries or other expensive operations.
    - Real-time features like chat message streaming.
- [ ] **Documentation:**
  - Update the project's documentation to reflect the switch to Upstash Redis.
  - Provide clear instructions on how to set up the Upstash Redis connection for
    local development.

---

## ✅ Acceptance Criteria

- All session, cache, and streaming features use Upstash Redis.
- No dependency on Vercel/Redis for local dev.
- All features work as expected after integration.

---

## 🚫 Out of Scope / Backlog

- Migration of other apps/packages
- Advanced analytics

---

## 📎 References

- [project-docs/pitch-deck.md](../../project-docs/pitch-deck.md)
- [packages/database/](../../packages/database/)
- [PIPER-5 protocol](../../.vibeflow/piper-5.mdc)

---

# Task Progress

- [2025-07-08 10:00] — Started Redis integration

# Final Review

[REVIEW verdict]
