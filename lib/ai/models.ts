export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Chat model',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'gpt-4',
    name: 'OpenAI GPT-4',
    description: 'OpenAI GPT-4 for brand analysis',
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    description: 'Anthropic Claude for brand analysis',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google Gemini for brand analysis',
  },
];
