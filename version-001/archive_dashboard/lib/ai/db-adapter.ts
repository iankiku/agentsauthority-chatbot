// apps/dashboard/lib/ai/db-adapter.ts
import type { UIMessage } from 'ai';
import type { Message, NewMessage } from '@workspace/database';

export function convertToUIMessages(dbMessages: Message[]): UIMessage[] {
  return dbMessages.map(msg => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    parts: [{ type: 'text', text: msg.content }],
    createdAt: msg.createdAt,
  }));
}

export function convertFromUIMessage(uiMessage: UIMessage, chatId: string, userId: string): NewMessage {
  const content = uiMessage.parts?.find((p: any) => p.type === 'text')?.text ?? '';
  
  return {
    id: uiMessage.id,
    conversationId: chatId,
    userId,
    role: uiMessage.role,
    content: content,
    createdAt: uiMessage.createdAt || new Date(),
  };
}
