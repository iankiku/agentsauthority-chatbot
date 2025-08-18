// apps/dashboard/lib/feature-flags.ts
import { V2ChatCanvasLayout } from '@/components/v2/chat/v2-chat-canvas-layout';

import { AiChatCanvas } from '@/components/v2/chat/ai-chat-canvas';

export function useAiChatEnabled() {
  // Start with 0% rollout, gradually increase
  return process.env.AI_CHAT_ENABLED === 'true' || 
         process.env.NODE_ENV === 'development';
}

export function getChatApiEndpoint() {
  return useAiChatEnabled() ? '/api/chat-v2' : '/api/chat';
}

export function getChatComponent() {
  return useAiChatEnabled() ? AiChatCanvas : V2ChatCanvasLayout;
}
