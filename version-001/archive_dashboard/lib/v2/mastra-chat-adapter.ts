/**
 * Mastra Chat Adapter
 * 
 * This adapter bridges AI SDK patterns with Mastra backend
 * to provide a consistent interface like Vercel's AI Chatbot
 */

import { useState, useCallback, useRef } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';
import { generateUUID } from '@workspace/utils';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: Array<{
    type: 'text' | 'file';
    text?: string;
    url?: string;
    name?: string;
    mediaType?: string;
  }>;
  content?: string; // For backward compatibility
  createdAt?: Date;
  isError?: boolean;
}

export interface ChatOptions {
  id: string;
  api?: string;
  messages?: ChatMessage[];
  onFinish?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
  onData?: (data: any) => void;
  generateId?: () => string;
}

export type ChatStatus = 'ready' | 'submitted' | 'loading' | 'error';

export interface MastraChatHelpers {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  sendMessage: (message: Partial<ChatMessage>) => Promise<void>;
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  status: ChatStatus;
  stop: () => void;
  regenerate: () => Promise<void>;
  resumeStream: () => Promise<void>;
  error: Error | null;
}

export function useMastraChat(options: ChatOptions): MastraChatHelpers {
  const {
    id,
    api = '/api/chat',
    messages: initialMessages = [],
    onFinish,
    onError,
    onData,
    generateId = generateUUID,
  } = options;

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState<string>('');
  const [status, setStatus] = useState<ChatStatus>('ready');
  const [error, setError] = useState<Error | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (message: Partial<ChatMessage>) => {
    if (status === 'loading' || status === 'submitted') {
      console.warn('Cannot send message while another request is in progress');
      return;
    }

    const userMessage: ChatMessage = {
      id: message.id || generateId(),
      role: 'user',
      parts: message.parts || [{ type: 'text', text: message.content || '' }],
      content: message.content, // For backward compatibility
      createdAt: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setStatus('submitted');
    setError(null);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          message: userMessage.parts[0]?.text || '',
          conversationId: id,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      setStatus('loading');

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      
      const assistantMessageId = generateId();
      
      // Add placeholder assistant message
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        parts: [{ type: 'text', text: '' }],
        createdAt: new Date(),
      }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          assistantMessage += chunk;
          
          // Update the assistant message with streaming content
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, parts: [{ type: 'text', text: assistantMessage }] }
              : msg
          ));

          // Call onData callback if provided
          if (onData) {
            onData({ type: 'text', content: chunk });
          }
        }
      }

      // Check if the response is an error message
      const isErrorMessage = assistantMessage.includes('error occurred') || 
                            assistantMessage.includes('credit balance is too low') ||
                            assistantMessage.includes('Error:') ||
                            assistantMessage.includes('Plans & Billing');

      const finalMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        parts: [{ 
          type: 'text', 
          text: assistantMessage || "I'm having trouble connecting to the AI service. Please try again." 
        }],
        content: assistantMessage, // For backward compatibility
        createdAt: new Date(),
        isError: isErrorMessage,
      };

      // Update with final message
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? finalMessage : msg
      ));

      if (isErrorMessage) {
        const error = new Error(assistantMessage);
        setError(error);
        if (onError) {
          onError(error);
        }
      } else if (onFinish) {
        onFinish(finalMessage);
      }

      setStatus('ready');

    } catch (err) {
      console.error('💥 Chat error:', err);
      
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Request was aborted');
        setStatus('ready');
        return;
      }

      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      // Add user-friendly error message to chat
      const userFriendlyMessage = error.message.includes('uuid') || error.message.includes('database')
        ? "⚠️ Unable to save your message. Please contact support if this continues."
        : `⚠️ ${error.message}`;
        
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        parts: [{ type: 'text', text: userFriendlyMessage }],
        content: userFriendlyMessage, // For backward compatibility
        createdAt: new Date(),
        isError: true,
      }]);

      if (onError) {
        onError(error);
      }

      setStatus('error');
    } finally {
      abortControllerRef.current = null;
    }
  }, [api, id, status, generateId, onData, onError, onFinish]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || status === 'loading' || status === 'submitted') {
      return;
    }

    const userInput = input.trim();
    setInput(''); // Clear input immediately
    
    await sendMessage({
      parts: [{ type: 'text', text: userInput }]
    });
  }, [input, sendMessage, status]);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStatus('ready');
    }
  }, []);

  const regenerate = useCallback(async () => {
    if (messages.length < 2) return;
    
    // Remove the last assistant message
    const messagesWithoutLast = messages.slice(0, -1);
    setMessages(messagesWithoutLast);
    
    // Get the last user message
    const lastUserMessage = messagesWithoutLast[messagesWithoutLast.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      await sendMessage(lastUserMessage);
    }
  }, [messages, sendMessage]);

  const resumeStream = useCallback(async () => {
    // For now, just regenerate the last message
    await regenerate();
  }, [regenerate]);

  return {
    messages,
    setMessages,
    sendMessage,
    input,
    setInput,
    handleSubmit,
    status,
    stop,
    regenerate,
    resumeStream,
    error,
  };
}