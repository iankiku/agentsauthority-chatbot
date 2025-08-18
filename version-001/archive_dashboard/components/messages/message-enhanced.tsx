"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import type { UIMessage } from "@ai-sdk/react";
import { MessageContent } from "./message-content";
import { MessageActions } from "./message-actions";
import { ArtifactPreview } from "../artifacts/artifact-preview";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { 
  Bot, 
  User, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Code2
} from "lucide-react";
import { cn } from "@workspace/utils";

interface MessageProps {
  message: UIMessage;
  isLoading?: boolean;
  isReadonly?: boolean;
  requiresScrollPadding?: boolean;
  mode: 'chat' | 'artifact' | 'split';
}

function PureMessage({ 
  message, 
  isLoading = false, 
  isReadonly = false,
  requiresScrollPadding = false,
  mode
}: MessageProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showArtifactPreview, setShowArtifactPreview] = useState(false);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const hasArtifacts = message.toolInvocations && message.toolInvocations.length > 0;
  const hasContent = message.content && message.content.length > 0;

  // Don't show artifact preview in artifact mode (since it's shown in canvas)
  const shouldShowArtifactPreview = hasArtifacts && mode !== 'artifact' && showArtifactPreview;

  return (
    <motion.div
      layout
      className={cn(
        "group relative flex gap-3 px-4 py-6",
        requiresScrollPadding && "pb-32",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0",
        isUser ? "order-2" : "order-1"
      )}>
        <Avatar className="h-8 w-8">
          {isUser ? (
            <>
              <AvatarImage src="/user-avatar.png" alt="User" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src="/bot-avatar.png" alt="Assistant" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 min-w-0",
        isUser ? "order-1" : "order-2"
      )}>
        {/* Message Header */}
        <div className={cn(
          "flex items-center gap-2 mb-2",
          isUser ? "justify-end" : "justify-start"
        )}>
          <span className="text-sm font-medium">
            {isUser ? "You" : "Assistant"}
          </span>
          
          {hasArtifacts && (
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Artifact
            </Badge>
          )}

          {isLoading && (
            <Badge variant="outline" className="text-xs">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center"
              >
                <div className="w-2 h-2 bg-current rounded-full mr-1" />
                Thinking...
              </motion.div>
            </Badge>
          )}

          {/* Collapse/Expand Button */}
          {(hasContent || hasArtifacts) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>

        {/* Message Body */}
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className={cn(
            "rounded-lg p-4 max-w-none",
            isUser 
              ? "bg-primary text-primary-foreground ml-8" 
              : "bg-muted mr-8"
          )}>
            {/* Text Content */}
            {hasContent && (
              <MessageContent 
                content={message.content}
                isLoading={isLoading}
              />
            )}

            {/* Artifact Preview Toggle */}
            {hasArtifacts && mode !== 'artifact' && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowArtifactPreview(!showArtifactPreview)}
                  className="w-full"
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  {showArtifactPreview ? 'Hide' : 'Show'} Artifact Preview
                  {showArtifactPreview ? (
                    <ChevronUp className="w-4 h-4 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Artifact Preview */}
          {shouldShowArtifactPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 mr-8"
            >
              <ArtifactPreview message={message} />
            </motion.div>
          )}
        </motion.div>

        {/* Message Actions */}
        {!isReadonly && isExpanded && (
          <div className={cn(
            "mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
            isUser ? "flex justify-end mr-8" : "flex justify-start mr-8"
          )}>
            <MessageActions 
              message={message}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export const Message = memo(PureMessage);
