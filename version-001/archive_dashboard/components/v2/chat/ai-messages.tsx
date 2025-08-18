// apps/dashboard/components/v2/chat/ai-messages.tsx
import { PreviewMessage } from './ai-message';
import { useMessages } from '@/hooks/use-messages';

export function AiMessages({ messages, status }: { messages: any[], status: string }) {
  const { containerRef, endRef } = useMessages({ status });

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <PreviewMessage key={message.id} message={message} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
