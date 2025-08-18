/**
 * Conversation Sidebar
 * 
 * Collapsible sidebar using shadcn sidebar components
 * Shows conversation history with icon mode support
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit2,
  Search
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/utils';

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: Date;
  messageCount?: number;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation?: (id: string) => void;
  onRenameConversation?: (id: string, newTitle: string) => void;
  isLoading?: boolean;
  className?: string;
}

function ConversationSidebarContent({
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  isLoading = false
}: Omit<ConversationSidebarProps, 'className'>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { state } = useSidebar();
  
  const isCollapsed = state === 'collapsed';

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle rename
  const handleRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = () => {
    if (editingId && editTitle.trim() && onRenameConversation) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditTitle('');
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <SidebarMenuButton
            onClick={onNewConversation}
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center"
            )}
            tooltip="New Chat"
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && <span>New Chat</span>}
          </SidebarMenuButton>
          <SidebarTrigger className="ml-2" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {!isCollapsed && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
        )}

        <SidebarMenu>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <SidebarMenuItem key={i}>
                <div className="h-10 bg-muted/50 rounded-md animate-pulse" />
              </SidebarMenuItem>
            ))
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-xs">
              {searchQuery ? 'No matches' : 'No chats yet'}
            </div>
          ) : (
            <AnimatePresence>
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => onConversationSelect(conversation.id)}
                      isActive={activeConversationId === conversation.id}
                      tooltip={conversation.title}
                      className="group relative"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          {editingId === conversation.id ? (
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename();
                                if (e.key === 'Escape') handleCancelRename();
                              }}
                              onBlur={handleSaveRename}
                              className="h-6 text-xs"
                              autoFocus
                            />
                          ) : (
                            <div className="flex flex-col min-w-0">
                              <span className="truncate text-xs font-medium">
                                {conversation.title}
                              </span>
                              {conversation.lastMessage && (
                                <span className="text-xs text-muted-foreground truncate">
                                  {conversation.lastMessage.substring(0, 30)}...
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </SidebarMenuButton>
                    {!isCollapsed && (
                      <>
                        <SidebarMenuAction
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(conversation.id, conversation.title);
                          }}
                          showOnHover
                        >
                          <Edit2 className="w-3 h-3" />
                        </SidebarMenuAction>
                        {onDeleteConversation && (
                          <SidebarMenuAction
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this conversation?')) {
                                onDeleteConversation(conversation.id);
                              }
                            }}
                            showOnHover
                            className="hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </SidebarMenuAction>
                        )}
                      </>
                    )}
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        {!isCollapsed && (
          <div className="text-center text-xs text-muted-foreground">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export function ConversationSidebar(props: ConversationSidebarProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className={cn("h-full", props.className)}>
        <ConversationSidebarContent {...props} />
      </div>
    </SidebarProvider>
  );
}