# AI Chatbot Implementation Plan for Dashboard V2

## Executive Summary

This document outlines the complete migration from the current Mastra-based v2 chat system to a clean AI SDK implementation based on the proven ai-chatbot reference. The goal is to copy the ai-chatbot patterns exactly, removing Mastra agent calls initially for a clean, reliable foundation.

## Current vs Target Architecture

### Current (V2 Chat - Complex)

```
User Input → V2ChatCanvasLayout → useMastraChat → /api/chat → Complex Mastra Streaming → Custom Parsers → UI
```

### Target (AI Chatbot - Clean)

```
User Input → AiChatCanvas → useChat → /api/chat-v2 → AI SDK streamText → Native Streaming → UI
```

## Phase 1: API Layer Migration

### 1.1 Replace `/api/chat-v2/route.ts`

**Current Issues:**
- Complex nested `createUIMessageStream` calls (lines 121-159)
- Redundant stream creation code
- Missing proper error handling

**Target Implementation:**
Copy `ai-chatbot/app/(chat)/api/chat/route.ts` exactly:

```typescript
// New /api/chat-v2/route.ts
import { auth } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { streamText } from 'ai';
import { z } from 'zod';

const requestSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
});

export async function POST(request: Request) {
  // 1. Authentication (copy from ai-chatbot)
  // 2. Request validation (copy schema pattern)  
  // 3. Database operations (adapt to our schema)
  // 4. AI SDK streamText (copy exactly)
  // 5. Response streaming (copy pattern)
}
```

### 1.2 Database Integration

**Map ai-chatbot schema to our existing schema:**

| AI Chatbot | Our Dashboard | Adaptation |
|------------|---------------|------------|
| `chats` table | `conversations` table | Map `id` and `userId` |
| `messages` table | `messages` table | Map `chatId` to `conversationId` |
| `document` table | Not needed initially | Skip for now |
| `votes` table | Not needed initially | Skip for now |

**Database Queries to Adapt:**
- Copy `ai-chatbot/lib/db/queries.ts` patterns
- Adapt to our `@workspace/database` exports
- Use existing `getChatMessages`, `saveChatMessages` functions

## Phase 2: Component Architecture Migration

### 2.1 Main Chat Component

**Current:** `V2ChatCanvasLayout` (1000+ lines, complex)
**Target:** Copy `ai-chatbot/components/chat.tsx` (clean, simple)

**Key Changes:**
```typescript
// New /components/v2/chat/ai-chat-canvas.tsx
import { useChat } from 'ai/react';
import { Messages } from './messages';
import { MultimodalInput } from './multimodal-input';

export function AiChatCanvas({ id }: { id: string }) {
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
  } = useChat({
    id,
    api: '/api/chat-v2',
    // Copy ai-chatbot configuration exactly
  });

  return (
    <div className="flex flex-col h-screen">
      <Messages messages={messages} isLoading={isLoading} />
      <MultimodalInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
```

### 2.2 Messages Component

**Current:** `V2MessageList` + `V2Message` (complex rendering)
**Target:** Copy `ai-chatbot/components/messages.tsx` + `message.tsx`

**Files to Create:**
- `/components/v2/chat/messages.tsx` - Copy from ai-chatbot exactly
- `/components/v2/chat/message.tsx` - Copy from ai-chatbot exactly
- Adapt styling to use our `@workspace/ui` components

### 2.3 Input Component

**Current:** `EnhancedMultimodalInput` (complex, localStorage, auto-resize)
**Target:** Copy `ai-chatbot/components/multimodal-input.tsx`

**Simplification:**
- Remove localStorage persistence
- Remove auto-resize complexity
- Use simple controlled input pattern from ai-chatbot

## Phase 3: Hook Migration

### 3.1 Replace useMastraChat

**Current:** `lib/v2/mastra-chat-adapter.ts` (complex state management)
**Target:** Use `useChat` from `ai/react` directly

**Migration:**
```typescript
// Remove: useMastraChat custom hook
// Use: useChat from ai/react

const {
  messages,
  input,
  setInput,
  handleSubmit,
  isLoading,
  error
} = useChat({
  id: conversationId,
  api: '/api/chat-v2'
});
```

### 3.2 State Management

**Copy ai-chatbot patterns:**
- Use `useChat` for message state
- Copy `hooks/use-messages.tsx` if needed for additional functionality
- Remove complex state management from v2 system

## Phase 4: UI Integration

### 4.1 Sidebar Integration

**Keep existing:** `ConversationSidebar` component
**Modify:** Update to work with new chat component

```typescript
// Update feature flag integration
export function getChatComponent() {
  return useAiChatEnabled() ? AiChatCanvas : V2ChatCanvasLayout;
}
```

### 4.2 Styling Adaptation

**Components to adapt:**
- Keep existing Tailwind classes
- Use `@workspace/ui` components where possible
- Copy ai-chatbot component structure, adapt styling

## Phase 5: Feature Flag Integration

### 5.1 Safe Rollout

**Current feature flag system:**
```typescript
// lib/feature-flags.ts (already updated)
export function useAiChatEnabled() {
  return process.env.AI_CHAT_ENABLED === 'true' || 
         process.env.NODE_ENV === 'development';
}

export function getChatComponent() {
  return useAiChatEnabled() ? AiChatCanvas : V2ChatCanvasLayout;
}
```

### 5.2 Progressive Migration

1. **Development:** Enable `AI_CHAT_ENABLED=true` for testing
2. **Staging:** Test with subset of users
3. **Production:** Gradual rollout (10% → 50% → 100%)

## Phase 6: Remove Mastra Dependencies

### 6.1 Files to Remove (After Migration)
- `lib/v2/mastra-chat-adapter.ts`
- `lib/ai/tools/` directory (initially)
- `lib/mastra-client.ts` references in chat
- Complex transformation utilities

### 6.2 Clean Up
- Remove unused imports
- Delete complex streaming logic
- Simplify error handling

## Implementation Steps

### Step 1: Core API Route
1. Copy `ai-chatbot/app/(chat)/api/chat/route.ts`
2. Adapt authentication to use `@/lib/auth-utils`
3. Adapt database queries to our schema
4. Remove tool integration initially
5. Test basic streaming functionality

### Step 2: Main Chat Component
1. Create `/components/v2/chat/ai-chat-canvas.tsx`
2. Copy `ai-chatbot/components/chat.tsx` structure
3. Integrate with existing sidebar
4. Update feature flag routing

### Step 3: Messages System
1. Copy `ai-chatbot/components/messages.tsx`
2. Copy `ai-chatbot/components/message.tsx`
3. Adapt to use `@workspace/ui` components
4. Test message rendering

### Step 4: Input System
1. Copy `ai-chatbot/components/multimodal-input.tsx`
2. Simplify compared to current `EnhancedMultimodalInput`
3. Test input handling and submission

### Step 5: Integration Testing
1. Enable feature flag in development
2. Test full chat flow
3. Compare performance vs current system
4. Fix any integration issues

### Step 6: Production Deployment
1. Deploy with feature flag disabled
2. Enable for development team
3. Gradual rollout to users
4. Monitor performance and errors

## Success Metrics

### Performance Improvements
- **Response Time:** Target 50% reduction in initial response time
- **Error Rate:** Target 80% reduction in chat errors
- **Code Complexity:** Target 60% reduction in lines of code

### User Experience
- **Message Rendering:** Instant message display
- **Error Handling:** Graceful error recovery
- **Stream Quality:** Smooth streaming without parsing failures

## Risk Mitigation

### Rollback Plan
1. Disable feature flag immediately
2. Current V2 system remains fully functional
3. No data loss (same database schema)

### Testing Strategy
1. **Unit Tests:** Copy ai-chatbot test patterns
2. **Integration Tests:** Full chat flow testing
3. **Performance Tests:** Compare against current system
4. **User Acceptance:** A/B testing with subset

## File Structure Changes

### New Files to Create
```
apps/dashboard/components/v2/chat/
├── ai-chat-canvas.tsx          # Main chat component (copy from ai-chatbot)
├── messages.tsx                # Messages list (copy from ai-chatbot)
├── message.tsx                 # Individual message (copy from ai-chatbot)
├── multimodal-input.tsx        # Input component (copy from ai-chatbot)
└── chat-error-boundary.tsx     # Error handling (adapt existing)

apps/dashboard/lib/ai/
├── models.ts                   # AI models config (copy from ai-chatbot)
└── providers.ts                # AI providers (copy from ai-chatbot)
```

### Files to Modify
```
apps/dashboard/app/api/chat-v2/route.ts    # Replace with ai-chatbot pattern
apps/dashboard/lib/feature-flags.ts         # Already updated
apps/dashboard/components/v2/chat/v2-chat-canvas-layout.tsx  # Keep as fallback
```

### Files to Remove (Later)
```
apps/dashboard/lib/v2/mastra-chat-adapter.ts     # Complex state management
apps/dashboard/lib/ai/tools/                     # Mastra tool wrappers
apps/dashboard/components/v2/chat/enhanced-multimodal-input.tsx  # Complex input
```

## Dependencies

### Required Packages (Already Installed)
- `ai` - AI SDK for React
- `@ai-sdk/openai` - OpenAI provider
- `@ai-sdk/anthropic` - Anthropic provider

### Remove After Migration
- Custom Mastra streaming utilities
- Complex transformation dependencies

## Timeline Estimate

- **Phase 1 (API):** 2-3 days
- **Phase 2 (Components):** 3-4 days
- **Phase 3 (Hooks):** 1-2 days
- **Phase 4 (UI):** 2-3 days
- **Phase 5 (Feature Flags):** 1 day
- **Phase 6 (Cleanup):** 1-2 days

**Total: 10-15 days** for complete migration

## Conclusion

This migration will transform the chat system from a complex, error-prone Mastra integration to a clean, reliable AI SDK implementation. The ai-chatbot reference provides a proven foundation that we can copy exactly, then enhance with our specific features later.

The feature flag approach ensures zero-risk deployment, and the existing database schema compatibility means no data migration required.