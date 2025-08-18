// apps/dashboard/components/v2/chat/ai-chat-canvas.tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import ErrorBoundary from '@/components/error-boundary';
import { AiMessages } from './ai-messages';
import { AiInput } from './ai-input';

// Placeholder for a custom fetch wrapper
const fetchWithErrorHandlers = (url: string, options: any) => fetch(url, options);

export function AiChatCanvas({ chatId }: { chatId: string }) {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    status,
    stop,
    regenerate,
  } = useChat({
    id: chatId,
    api: '/api/chat-v2',
    transport: new DefaultChatTransport({
      fetch: fetchWithErrorHandlers,
    }),
  });

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {status === 'loading' && (
          <div className="flex items-center justify-center h-full w-full text-gray-500">
            Loading chat...
          </div>
        )}
        {status !== 'loading' && (
          <>
            <AiMessages messages={messages} status={status} />
            <AiInput 
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              status={status}
            />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

