'use client';

import { useChat } from '@ai-sdk/react';
import { generateUUID } from '@workspace/utils';

export function useFragmentChat() {
  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    error,
    input,
    setInput,
    append,
    reload
  } = useChat({
    id: generateUUID(),
    api: '/api/chat',
  });

  return {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    error,
    input,
    setInput,
    append,
    reload
  };
}
