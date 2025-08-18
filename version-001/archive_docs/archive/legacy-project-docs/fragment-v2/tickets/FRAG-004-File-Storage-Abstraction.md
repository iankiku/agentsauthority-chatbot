# FRAG-004: File Storage Abstraction for fragmentV2

**Status:** 🚨 Pending **Sprint:** Now **Owner:** Engineering

---

## 🎯 Context & Goal

Replace Vercel Blob with local file storage for development, and design a
pluggable interface for cloud storage in production, ensuring all file
upload/download APIs work locally.

---

## Task Description

- Implement local file storage adapter.
- Update file upload/download endpoints.
- Document how to swap to cloud storage for prod.

---

## Project Overview

- **Repo:** apps/fragmentV2
- **Stack:** Next.js 15, Node.js, local file system, pluggable storage

⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️ Paste the **entire** PIPER-5 protocol
here. ⚠️ WARNING: NEVER MODIFY THIS SECTION ⚠️

---

## [MODE: RESEARCH] Analysis

- fragmentV2 currently uses Vercel Blob for file storage.
- Local dev requires a file system adapter.
- Production will need a pluggable interface for cloud storage.

---

## [MODE: PLAN] Proposed Solution

- Implement local file storage adapter.
- Update file upload/download endpoints.
- Document swap process for cloud storage.

---

## Implementation Checklist

- [ ] **Design Storage Interface:**
  - In `apps/fragmentV2/lib/storage/index.ts`, define a `Storage` interface with
    the following methods: `upload(file: File): Promise<string>`,
    `download(fileId: string): Promise<Buffer>`, and
    `getPublicUrl(fileId: string): Promise<string>`.
- [ ] **Implement Local Storage Adapter:**
  - Create `apps/fragmentV2/lib/storage/local.ts` which implements the `Storage`
    interface.
  - The `upload` method should save the file to a local directory (e.g.,
    `apps/fragmentV2/data/uploads`) and return a unique file ID.
  - The `download` method should read the file from the local directory based on
    the file ID.
  - The `getPublicUrl` method should return a local URL path (e.g.,
    `/api/files/[fileId]`) that can be used to serve the file.
- [ ] **Create File Serving API:**
  - Create a new API route in `apps/fragmentV2/app/api/files/[fileId]/route.ts`
    that uses the local storage adapter to retrieve and serve the file with the
    correct content type.
- [ ] **Refactor File Upload/Download Logic:**
  - Audit the codebase for any usage of Vercel Blob and replace it with the new
    `Storage` interface.
  - Ensure that the file upload and download features in the chat interface are
    working correctly with the local storage adapter.
- [ ] **Update Configuration:**
  - Add a `STORAGE_PROVIDER` environment variable to `.env.example` and
    `.env.local` to specify which storage provider to use (`local` for now).
  - Use this variable to dynamically select the correct storage adapter in the
    application.
- [ ] **Documentation:**
  - Create a `README.md` in `apps/fragmentV2/lib/storage` that explains the
    storage abstraction layer and how to add new storage providers in the future
    (e.g., for S3 or Google Cloud Storage).

---

## ✅ Acceptance Criteria

- All file upload/download APIs work locally using the file system.
- Pluggable interface allows easy swap to cloud storage for prod.
- Clear documentation for devs.

---

## 🚫 Out of Scope / Backlog

- Cloud storage implementation (for prod)
- Migration of other apps/packages

---

## 📎 References

- [project-docs/pitch-deck.md](../../project-docs/pitch-deck.md)
- [PIPER-5 protocol](../../.vibeflow/piper-5.mdc)

---

# Task Progress

- [2025-07-08 10:00] — Started file storage abstraction

# Final Review

[REVIEW verdict]
