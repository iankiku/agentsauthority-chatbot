import type { UIMessage } from '@ai-sdk/react';

export interface MessageProps {
  message: UIMessage;
  isLoading: boolean;
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}