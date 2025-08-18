"use client";

import { useState } from "react";
import type { UIMessage } from "@ai-sdk/react";
import { Button } from "@workspace/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { 
  Copy, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown, 
  Share2,
  MoreHorizontal,
  Edit3,
  Bookmark
} from "lucide-react";
import { cn } from "@workspace/utils";

interface MessageActionsProps {
  message: UIMessage;
  isLoading?: boolean;
}

export function MessageActions({ message, isLoading }: MessageActionsProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleRegenerate = () => {
    // This would trigger message regeneration
    console.log('Regenerate message:', message.id);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(feedback === type ? null : type);
    // Send feedback to analytics/backend
    console.log('Feedback:', type, message.id);
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share message:', message.id);
  };

  const handleEdit = () => {
    // Implement edit functionality for user messages
    console.log('Edit message:', message.id);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Save bookmark to backend
    console.log('Bookmark message:', message.id, !isBookmarked);
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Copy */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy message</TooltipContent>
      </Tooltip>

      {/* Edit (User messages only) */}
      {isUser && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-7 w-7 p-0"
            >
              <Edit3 className="w-3 h-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit message</TooltipContent>
        </Tooltip>
      )}

      {/* Regenerate (Assistant messages only) */}
      {isAssistant && !isLoading && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              className="h-7 w-7 p-0"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Regenerate response</TooltipContent>
        </Tooltip>
      )}

      {/* Feedback (Assistant messages only) */}
      {isAssistant && !isLoading && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback('up')}
                className={cn(
                  "h-7 w-7 p-0",
                  feedback === 'up' && "text-green-600 bg-green-50"
                )}
              >
                <ThumbsUp className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Good response</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback('down')}
                className={cn(
                  "h-7 w-7 p-0",
                  feedback === 'down' && "text-red-600 bg-red-50"
                )}
              >
                <ThumbsDown className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Poor response</TooltipContent>
          </Tooltip>
        </>
      )}

      {/* Bookmark */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={cn(
              "h-7 w-7 p-0",
              isBookmarked && "text-yellow-600 bg-yellow-50"
            )}
          >
            <Bookmark className={cn(
              "w-3 h-3",
              isBookmarked && "fill-current"
            )} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isBookmarked ? 'Remove bookmark' : 'Bookmark message'}
        </TooltipContent>
      </Tooltip>

      {/* Share */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-7 w-7 p-0"
          >
            <Share2 className="w-3 h-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share message</TooltipContent>
      </Tooltip>

      {/* More actions */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>More actions</TooltipContent>
      </Tooltip>
    </div>
  );
}
