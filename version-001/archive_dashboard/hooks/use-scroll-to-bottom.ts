/**
 * useScrollToBottom Hook
 * 
 * Automatically scrolls to the bottom of a container when content changes
 * Used for chat message lists to keep the latest message visible
 */

import { useRef, useEffect, useCallback } from 'react';

interface UseScrollToBottomOptions {
  behavior?: 'smooth' | 'auto';
  threshold?: number; // Distance from bottom to trigger auto-scroll
}

export function useScrollToBottom<T extends HTMLElement = HTMLDivElement>(
  trigger?: any, // Dependency to trigger scroll
  options: UseScrollToBottomOptions = {}
) {
  const {
    behavior = 'smooth',
    threshold = 100
  } = options;

  const ref = useRef<T>(null);
  const isNearBottomRef = useRef(true);

  // Check if user is near the bottom of the scroll area
  const checkNearBottom = useCallback(() => {
    if (!ref.current) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    return distanceFromBottom <= threshold;
  }, [threshold]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior,
      });
    }
  }, [behavior]);

  // Force scroll to bottom (ignores user position)
  const forceScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // Handle scroll events to track user position
  const handleScroll = useCallback(() => {
    isNearBottomRef.current = checkNearBottom();
  }, [checkNearBottom]);

  // Auto-scroll when trigger changes and user is near bottom
  useEffect(() => {
    if (trigger !== undefined && isNearBottomRef.current) {
      // Small delay to ensure DOM has updated
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [trigger, scrollToBottom]);

  // Set up scroll listener
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    isNearBottomRef.current = checkNearBottom();

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, checkNearBottom]);

  return {
    ref,
    scrollToBottom: forceScrollToBottom,
    isNearBottom: () => isNearBottomRef.current,
  };
}