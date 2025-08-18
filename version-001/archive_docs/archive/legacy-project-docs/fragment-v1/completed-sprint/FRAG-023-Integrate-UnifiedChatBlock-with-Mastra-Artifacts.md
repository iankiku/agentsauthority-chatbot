# FRAG-023 – Integrate UnifiedChatBlock with Mastra Artifacts

## 🚧 Status: COMPLETED

## Priority: High

## Effort: Medium

## Owner: AI / Junior Engineer

---

## 🎯 OBJECTIVE

Integrate the `UnifiedChatBlock` component in `apps/fragment` to use the new
Mastra chat proxy (`FRAG-017`) and the `ArtifactRenderer` (`FRAG-022`). This
will complete the end-to-end flow, allowing users to interact with agents via
the chat interface and see structured UI artifacts dynamically rendered within
the chat.

---

## 🔑 KEY TASKS

1.  **Update `useChat` API Endpoint**:
    - Location: `apps/fragment/components/blocks/unified-chat-block.tsx`
    - Modify the `useChat` hook's `api` prop to point to the new Mastra chat
      proxy: `/api/mastra/chat`.
2.  **Integrate `ArtifactRenderer`**:
    - Within `UnifiedChatBlock`, replace any existing artifact rendering logic
      (or placeholders) with the new `ArtifactRenderer` component.
    - Pass the `messages` array from `useChat` to the `ArtifactRenderer`.
    - Ensure the `ArtifactRenderer` is positioned correctly to display artifacts
      prominently when available, while still allowing text messages to flow.
3.  **Refine UI State Logic**:
    - Adjust the `mode` state (`idle`, `chatting`, `artifact_view`) within
      `UnifiedChatBlock` to gracefully handle the presence of artifacts. When an
      artifact is rendered by `ArtifactRenderer`, the `UnifiedChatBlock` should
      present it clearly, minimizing any conflicting UI.
4.  **Remove Deprecated Logic/Imports**:
    - Clean up any old `api/chat` related code or direct artifact rendering
      logic that is now superseded by the new architecture.

### Example Sketch:

```tsx
// apps/fragment/components/blocks/unified-chat-block.tsx
"use client";

import { useEffect, useState } from "react";
import { useChat, type Message } from "ai/react";
import { ArtifactRenderer } from "@/components/artifacts/ArtifactRenderer";
// ... other imports ...

export function UnifiedChatBlock({ onArtifactGenerated }: Props) {
	const { messages, append, isLoading, reload, stop } = useChat({
		api: "/api/mastra/chat", // <--- UPDATED API ENDPOINT
		// ... other useChat configs ...
	});

	const [mode, setMode] = useState<"idle" | "chatting" | "artifact_view">(
		"idle"
	);

	// Refine mode detection to prioritize artifacts
	useEffect(() => {
		const hasArtifact = messages.some(
			(msg) =>
				msg.role === "tool" &&
				msg.toolInvocations?.some(
					(inv) =>
						(inv.result &&
							typeof inv.result === "object" &&
							"type" in inv.result &&
							inv.result.type.endsWith("card")) ||
						inv.result.type.endsWith("table") ||
						inv.result.type.endsWith("chart")
				)
		);
		if (hasArtifact) {
			setMode("artifact_view");
		} else if (isLoading || messages.length > 0) {
			setMode("chatting");
		} else {
			setMode("idle");
		}
	}, [messages, isLoading]);

	return (
		<div className="h-full flex flex-col">
			{/* Artifact layer - rendered when an artifact is available */}
			{mode === "artifact_view" && <ArtifactRenderer messages={messages} />}

			{/* Chat overlay - visible during chat, may be partially obscured by artifact */}
			{mode === "chatting" && (
				<div
					className={
						("absolute inset-0 flex flex-col justify-end p-4 z-10",
						mode === "artifact_view" ? "bg-background/80 backdrop-blur-sm" : "")
					}
				>
					{messages.map((message) => (
						<div key={message.id} className="whitespace-pre-wrap">
							{message.content}
						</div>
					))}
				</div>
			)}

			{/* Always-visible input */}
			<ChatInput onSubmit={append} onFocus={() => setMode("chatting")} />
		</div>
	);
}
```

---

## ✅ ACCEPTANCE CRITERIA

- `apps/fragment/components/blocks/unified-chat-block.tsx`'s `useChat` hook
  points to `/api/mastra/chat`.
- The `ArtifactRenderer` component is successfully integrated into
  `UnifiedChatBlock` and receives the `messages` prop.
- The `UnifiedChatBlock` correctly displays both text messages and the latest
  structured UI artifact from the agent's response, adhering to the "one
  artifact per block" rule.
- The UI transitions smoothly between chat and artifact views.
- All deprecated API calls or artifact rendering logic within `UnifiedChatBlock`
  are removed.
- The end-to-end flow (user prompt → agent response with artifact → UI
  rendering) is functional.

---

## 🕒 ESTIMATE

2 dev-days

---

## 🔗 CONTEXT & REFERENCES

- **Plan**: Phase 1, Task 1.7: Integrate `UnifiedChatBlock` with Mastra
  Artifacts
- **Technical Design**: `TECH.md` section "5. Mastra Agent-Driven UI Artifacts
  (NEW)" (specifically "Unified Chat Block Rendering" point)
- **Related Tickets**: `FRAG-017` (Mastra Chat Proxy) provides the API;
  `FRAG-022` (Implement Dynamic Artifact Renderer) provides the rendering logic;
  `FRAG-021` (Create Chromeless UI Artifact Components) provides the actual UI
  components.
