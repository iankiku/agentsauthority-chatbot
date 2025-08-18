'use server';

import type { VisibilityType } from '@/components/visibility-selector';
import { myProvider } from '@/lib/ai/providers';
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import { generateText, type UIMessage } from 'ai';
import { cookies } from 'next/headers';

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  try {
    // Try to use AI model for title generation
    const { text: title } = await generateText({
      model: myProvider.languageModel('title-model'),
      system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - do not use quotes or colons`,
      prompt: JSON.stringify(message),
    });

    return title;
  } catch (error) {
    // Fallback: extract text from message and create a simple title
    console.log('Title generation failed, using fallback:', error);

    const messageText =
      message.parts
        ?.filter((part) => part.type === 'text')
        ?.map((part) => (part as any).text)
        ?.join(' ')
        ?.trim() || '';

    if (messageText) {
      const words = messageText.split(' ').slice(0, 5);
      const title = words.join(' ') + (words.length >= 5 ? '...' : '');
      return title || 'New Chat';
    }

    return 'New Chat';
  }
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
