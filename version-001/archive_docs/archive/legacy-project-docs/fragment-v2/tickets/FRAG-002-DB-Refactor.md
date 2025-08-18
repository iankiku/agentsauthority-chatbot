# FRAG-002: Database Refactor for fragmentV2

**Status:** 🚨 Pending **Sprint:** Now **Owner:** Engineering

---

## 🎯 Context & Goal

Refactor all database access in fragmentV2 to use the shared packages/database
module, supporting both Prisma and Drizzle ORM for future flexibility and
consistency across the monorepo.

---

## Task Description

- Audit all DB calls in fragmentV2.
- Replace direct ORM/Drizzle/Prisma usage with packages/database exports.
- Add missing queries to packages/database if needed.
- Test all DB-dependent features.

---

## Project Overview

- **Repo:** apps/fragmentV2, packages/database
- **Stack:** Next.js 15, Node.js, Postgres/Supabase, Prisma, Drizzle

⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️ Paste the **entire** PIPER-5 protocol
here. ⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️

---

## [MODE: RESEARCH] Analysis

- fragmentV2 currently uses direct ORM calls (Drizzle/Prisma/Neon).
- Monorepo standard is to use packages/database for all DB access.
- Supporting both Prisma and Drizzle allows for future migration and
  flexibility.
- Some queries may need to be ported or added to packages/database.

---

## [MODE: PLAN] Proposed Solution

- Audit all DB calls in fragmentV2.
- Refactor to use only packages/database for DB access.
- Add missing queries to packages/database.
- Test all DB-dependent features.

---

## Implementation Checklist

- [ ] **Audit Database Calls:**
  - Use a global search in `apps/fragmentV2` for keywords like `prisma`,
    `drizzle`, `neon`, `sql` to identify all files with direct database access.
  - Create a list of all unique queries and their locations.
- [ ] **Analyze `packages/database`:**
  - Review the existing exports from `packages/database`.
  - Identify which of the audited queries can be replaced with existing
    functions and which will require new functions to be added.
- [ ] **Extend `packages/database`:**
  - For each missing query, add a new, well-named function to
    `packages/database`. For example, instead of a raw query, create a function
    like `getUserSessions(userId)`.
  - Ensure that the new functions are ORM-agnostic if possible, or provide clear
    separation between Prisma and Drizzle implementations within the package.
- [ ] **Refactor `fragmentV2`:**
  - Go through the list of files from the audit and replace all direct database
    calls with the corresponding functions from `packages/database`.
  - Ensure that all data transformations and error handling are still correct
    after the refactor.
- [ ] **Testing:**
  - For each refactored feature, perform a thorough test to ensure it still
    works as expected. This includes user authentication, chat history, artifact
    creation, and any other feature that interacts with the database.
  - Write unit tests for the new functions added to `packages/database` to
    ensure they are correct and robust.
- [ ] **Documentation:**
  - Update the `README.md` in `packages/database` to document the new functions
    that were added.
  - Add a section to the `fragmentV2` documentation explaining the new database
    access patterns.

---

## ✅ Acceptance Criteria

- All DB access in fragmentV2 goes through packages/database.
- Both Prisma and Drizzle are supported in packages/database.
- All features work as expected after refactor.

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

- [2025-07-08 10:00] — Started DB audit

# Final Review

[REVIEW verdict]
