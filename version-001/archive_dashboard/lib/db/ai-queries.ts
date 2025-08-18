// apps/dashboard/lib/db/ai-queries.ts
import { ChatService } from '@workspace/database/services/chat-service';
import { convertToUIMessages, convertFromUIMessage } from '@/lib/ai/db-adapter';
import type { UIMessage } from 'ai';

export async function getChatMessages(chatId: string, userId: string) {
  const dbMessages = await ChatService.getConversationMessages(chatId, userId);
  return convertToUIMessages(dbMessages);
}

export async function saveChatMessages(messages: UIMessage[], chatId: string, userId: string) {
  const dbMessages = messages.map(msg => 
    convertFromUIMessage(msg, chatId, userId)
  );
  return await ChatService.saveMessages(dbMessages);
}
