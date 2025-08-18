# 2025-07-08: Product Requirements Document (PRD) — fragmentV2 MVP

**Status:** 🚨 Pending **Sprint:** Now **Owner:** Product/Engineering

---

## 🎯 Context & Goal

Deliver an MVP of fragmentV2 that enables users to scan their brand's AI/LLM
visibility, receive actionable recommendations, and manage insights via a
modular dashboard. The product must be extensible, user-centric, and competitive
with leading GEO/SEO tools (see pitch deck).

---

## Product Vision

Fragment is the next-generation platform for Generative Engine Optimization
(GEO), helping brands maximize visibility and drive engagement in AI-powered
search engines (ChatGPT, Claude, Gemini, Perplexity, etc.).

---

## Target Users

- Marketers & Brand Managers
- SEO Professionals
- Content Creators & SMB Owners

---

## Core Features (MVP)

- Unified chat interface for ad hoc queries and scans
- SEMrush-inspired dashboard with Brand Performance, Visibility, Perception, and
  Questions pages
- Modular, reactive blocks (charts, tables, insights, recommendations)
- Pin/unpin and auto-pinning of actionable artifacts from chat to dashboard
- Persistent, user-specific data and artifact storage
- Authentication and user/session management
- File upload/download (local for dev, pluggable for prod)
- AI SDK integration with support for both LLMs and custom agents

---

## Non-Goals / Out of Scope (MVP)

- Multi-user/team dashboards
- Advanced analytics and forecasting
- Custom block creation by users
- Automated notifications and email
- API for external integrations

---

## Competitive Analysis

- SEMrush, Ahrefs, SimilarWeb, Jasper, SurferSEO
- Fragment's edge: multi-LLM scan, click-to-fix widgets, prompt simulator,
  predictive impact model, SMB-focused pricing

---

## Technical Architecture

- **Frontend:** Next.js 15, React 19, shadcn/ui, Tailwind, modular block system
- **Backend:** Node.js, Next.js API routes, custom agent orchestration
- **Database:** packages/database (Postgres/Supabase, Prisma, Drizzle)
- **Cache/Session:** Upstash Redis
- **File Storage:** Local file system (dev), pluggable for cloud in prod
- **AI/LLM:** Vercel AI SDK (xAI Grok, OpenAI, etc.), custom agent integration

---

## User Journeys

1. **Scan Brand Visibility:**
   - User enters domain or asks in chat ("Show me my brand visibility").
   - System runs scan, generates artifacts (charts, tables, insights).
   - User can pin results to dashboard.

2. **Monitor Dashboard:**
   - User visits dashboard to see live, persistent insights.
   - Can rearrange, pin/unpin, and refresh blocks.

3. **Take Action:**
   - User receives actionable recommendations (e.g., urgent fixes).
   - Can view, track, and act on recommendations from dashboard.

---

## Acceptance Criteria

- All MVP features are implemented and tested.
- Product is usable end-to-end for target users.
- No dependency on Vercel-specific services for local dev.
- Documentation is clear and complete.

---

## Roadmap (Q3 2025+)

- Prompt sandbox A/B testing + forecasting
- Advanced agent orchestration
- Predictive impact modeling
- Team/multi-user support
- API for developers
- VibeFlow campaign studio integration

---

## 📎 References

- [project-docs/pitch-deck.md](../../project-docs/pitch-deck.md)
- [PIPER-5 protocol](../../.vibeflow/piper-5.mdc)
- [SEMrush dashboard screenshots]

---

# Task Progress

- [2025-07-08 10:00] — Started PRD draft

# Final Review

[REVIEW verdict]
