/**
 * Enhanced Multimodal Input
 * 
 * Based on Vercel AI Chatbot's multimodal input with improvements:
 * - localStorage persistence
 * - Auto-resizing textarea
 * - Scroll to bottom functionality
 * - Better keyboard handling
 * - Status-aware UI
 */

'use client';

import React, { 
  useRef, 
  useEffect, 
  useState, 
  useCallback, 
  memo 
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, Square, Send } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/utils';
import type { MastraChatHelpers, ChatStatus } from '@/lib/v2/mastra-chat-adapter';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';

interface EnhancedMultimodalInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  status: ChatStatus;
  stop: () => void;
  placeholder?: string;
  className?: string;
  variant?: 'inline' | 'fixed';
  autoFocus?: boolean;
}

function PureEnhancedMultimodalInput({
  input,
  setInput,
  handleSubmit,
  status,
  stop,
  placeholder = "Send a message...",
  className,
  variant = 'fixed',
  autoFocus = true,
}: EnhancedMultimodalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [localInput, setLocalInput] = useState('');
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedInput = localStorage.getItem('v2-chat-input');
    if (savedInput && !input) {
      setInput(savedInput);
      setLocalInput(savedInput);
    }
  }, [input, setInput]);

  // Save to localStorage when input changes
  useEffect(() => {
    if (input !== localInput) {
      localStorage.setItem('v2-chat-input', input);
      setLocalInput(input);
    }
  }, [input, localInput]);

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  }, []);

  const resetHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '98px';
    }
  }, []);

  // Adjust height when input changes
  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustHeight();
  }, [setInput, adjustHeight]);

  // Submit form and clear input
  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === 'loading' || status === 'submitted') {
      return;
    }
    
    handleSubmit(e);
    localStorage.removeItem('v2-chat-input');
    resetHeight();
  }, [input, status, handleSubmit, resetHeight]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSubmit(e as any);
    }
  }, [onSubmit]);

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && textareaRef.current && typeof window !== 'undefined') {
      // Small delay to ensure component is mounted
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  // Scroll to bottom hook
  const { isAtBottom, scrollToBottom } = useScrollToBottom();

  // Auto-scroll when submitting
  useEffect(() => {
    if (status === 'submitted') {
      scrollToBottom();
    }
  }, [status, scrollToBottom]);

  const isLoading = status === 'loading' || status === 'submitted';
  const canSubmit = input.trim().length > 0 && !isLoading;

  return (
    <div className={cn("relative w-full flex flex-col gap-4", className)}>
      {/* Scroll to bottom button */}
      <AnimatePresence>
        {!isAtBottom && variant === 'fixed' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute left-1/2 bottom-28 -translate-x-1/2 z-50"
          >
            <Button
              className="rounded-full"
              size="icon"
              variant="outline"
              onClick={scrollToBottom}
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input form */}
      <form onSubmit={onSubmit} className="w-full">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className={cn(
              "min-h-[60px] max-h-[calc(75dvh)] resize-none rounded-2xl pr-12",
              "bg-muted border-v2-border focus:border-primary focus:ring-1 focus:ring-primary",
              isLoading && "opacity-50 cursor-not-allowed",
              variant === 'inline' && "rounded-lg",
            )}
            rows={2}
          />

          {/* Send/Stop button */}
          <div className="absolute bottom-2 right-2">
            {isLoading ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={stop}
                className="h-8 w-8 rounded-full hover:bg-muted-foreground/10"
              >
                <Square className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!canSubmit}
                className={cn(
                  "h-8 w-8 rounded-full",
                  canSubmit 
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>
              {status === 'submitted' ? 'Sending...' : 'Thinking...'}
            </span>
          </div>
        )}
      </form>
    </div>
  );
}

export const EnhancedMultimodalInput = memo(PureEnhancedMultimodalInput);