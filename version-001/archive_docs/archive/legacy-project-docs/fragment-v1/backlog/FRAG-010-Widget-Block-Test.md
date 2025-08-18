# FRAG-010 – Widget Block Display Test 🧪

_Created: 2025-07-05_ _Status: **COMPLETED**_

---

## 🎯 OBJECTIVE

Verify that a standalone call to **`widget-tool`** can generate a layout that is
rendered by the Generative Block UI in Fragment.

---

## 🔑 TASKS

1. **Tool Invocation Script**
   - Add a simple debug page at `/debug/widget-test`.
   - Hard-code `widgets` array (3 sample charts) and POST to
     `/api/mastra/tools/widget-tool`.
2. **Block Engine Adapter**
   - Ensure `ArtifactRenderer` recognises `{ layout:[...] }` payload and mounts
     `ReactGridLayout` accordingly.
3. **Visual Assertion**
   - Add Playwright test `widget-block.spec.ts` that:
     1. Navigates to `/debug/widget-test`.
     2. Waits for 3 grid items.
     3. Takes screenshot for CI diff.
4. **Documentation**
   - Update `docs/widget-to-block-migration.md` with new `widget-tool` example.

---

## ✅ ACCEPTANCE CRITERIA

- [ ] Debug page renders 3 draggable/resizable widgets.
- [ ] Grid layout matches positions returned by tool (check `data-grid` attrs).
- [ ] Test passes in CI pipeline.

---

## 🕒 ESTIMATE

**1 dev-day**

---

**Owner:** _TBD_
