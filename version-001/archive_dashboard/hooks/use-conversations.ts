/**
 * useConversations Hook
 * 
 * Manages conversation list, creation, switching, and persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { generateUUID } from '@workspace/utils';
import type { Conversation } from '@/components/v2/chat/conversation-sidebar';

interface UseConversationsOptions {
  userId?: string;
  onConversationChange?: (conversationId: string) => void;
}

export function useConversations({ userId, onConversationChange }: UseConversationsOptions = {}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations from API - simple state management
  const loadConversations = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        // Transform API response to our format
        const formattedConversations: Conversation[] = data.map((conv: any) => ({
          id: conv.id,
          title: conv.title || 'New Chat',
          lastMessage: conv.lastMessage?.content || '',
          updatedAt: new Date(conv.updatedAt),
          messageCount: conv.messages?.length || 0,
        }));
        
        setConversations(formattedConversations);
        
        // Simple logic: select most recently updated conversation if none selected
        if (!activeConversationId && formattedConversations.length > 0) {
          // Conversations are already sorted by updatedAt DESC from the API
          const mostRecentId = formattedConversations[0].id;
          setActiveConversationId(mostRecentId);
          
          if (onConversationChange) {
            onConversationChange(mostRecentId);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, activeConversationId, onConversationChange]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Create new conversation - pure state management
  const createNewConversation = useCallback(() => {
    const newId = generateUUID();
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      updatedAt: new Date(),
      messageCount: 0,
    };

    // Add to top of list (most recent)
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newId);
    
    if (onConversationChange) {
      onConversationChange(newId);
    }
    
    return newId;
  }, [onConversationChange]);

  // Switch to conversation - pure state management
  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    
    if (onConversationChange) {
      onConversationChange(id);
    }
  }, [onConversationChange]);

  // Delete conversation
  const deleteConversation = useCallback(async (id: string) => {
    try {
      // Optimistically update UI
      setConversations(prev => prev.filter(c => c.id !== id));
      
      // If this was the active conversation, switch to another
      if (activeConversationId === id) {
        const remaining = conversations.filter(c => c.id !== id);
        if (remaining.length > 0) {
          selectConversation(remaining[0].id);
        } else {
          // Create a new conversation if none left
          createNewConversation();
        }
      }

      // Delete from API
      await fetch(`/api/chat?conversationId=${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      // Reload conversations to revert optimistic update
      loadConversations();
    }
  }, [activeConversationId, conversations, selectConversation, createNewConversation, loadConversations]);

  // Rename conversation
  const renameConversation = useCallback(async (id: string, newTitle: string) => {
    try {
      // Optimistically update UI
      setConversations(prev => prev.map(c => 
        c.id === id ? { ...c, title: newTitle, updatedAt: new Date() } : c
      ));

      // Update via API (this would typically be a PUT request to update conversation)
      // For now, the title will be updated when the next message is sent
    } catch (error) {
      console.error('Failed to rename conversation:', error);
      // Reload conversations to revert optimistic update
      loadConversations();
    }
  }, [loadConversations]);

  // Update conversation with new message info
  const updateConversation = useCallback((id: string, updates: Partial<Conversation>) => {
    setConversations(prev => prev.map(c => 
      c.id === id 
        ? { ...c, ...updates, updatedAt: new Date() }
        : c
    ));
  }, []);

  // Get active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return {
    conversations,
    activeConversationId,
    activeConversation,
    isLoading,
    createNewConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    updateConversation,
    loadConversations,
  };
}