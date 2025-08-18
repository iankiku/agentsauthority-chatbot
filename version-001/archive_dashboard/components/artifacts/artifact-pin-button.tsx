"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { Pin, PinOff } from "lucide-react";
import { useArtifactsStore } from "@/stores/artifacts-store";
import type { UIMessage } from "@ai-sdk/react";
import { cn } from "@workspace/utils";

interface ArtifactPinButtonProps {
  message: UIMessage;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
}

export function ArtifactPinButton({ 
  message, 
  className,
  size = "sm",
  variant = "ghost"
}: ArtifactPinButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { isPinned, pinArtifact, unpinArtifact, getPinnedArtifact } = useArtifactsStore();
  
  const pinned = isPinned(message.id);
  const pinnedArtifact = getPinnedArtifact(message.id);

  const handleTogglePin = () => {
    setIsAnimating(true);
    
    if (pinned && pinnedArtifact) {
      unpinArtifact(pinnedArtifact.id);
    } else {
      pinArtifact(message);
    }
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 200);
  };

  const buttonSizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9", 
    lg: "h-10 w-10"
  };

  const iconSizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          onClick={handleTogglePin}
          className={cn(
            buttonSizeClasses[size],
            "transition-all duration-200",
            pinned && "text-brand-600 hover:text-brand-700",
            isAnimating && "scale-110",
            className
          )}
        >
          {pinned ? (
            <Pin 
              className={cn(
                iconSizeClasses[size],
                "fill-current transition-transform duration-200",
                isAnimating && "rotate-12"
              )} 
            />
          ) : (
            <PinOff 
              className={cn(
                iconSizeClasses[size],
                "transition-transform duration-200",
                isAnimating && "rotate-12"
              )} 
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {pinned ? "Unpin artifact" : "Pin artifact to dashboard"}
      </TooltipContent>
    </Tooltip>
  );
}
