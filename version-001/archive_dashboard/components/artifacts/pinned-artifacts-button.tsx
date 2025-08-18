"use client";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { Pin } from "lucide-react";
import { useArtifactsStore } from "@/stores/artifacts-store";
import { useRouter } from "next/navigation";

export function PinnedArtifactsButton() {
  const { pinnedArtifacts } = useArtifactsStore();
  const router = useRouter();

  const handleClick = () => {
    // Navigate to dashboard with pinned panel open
    router.push("/dashboard?pinned=true");
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 relative"
          onClick={handleClick}
        >
          <Pin className="h-4 w-4" />
          {pinnedArtifacts.length > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-brand-600 text-white"
            >
              {pinnedArtifacts.length}
            </Badge>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {pinnedArtifacts.length === 0 
          ? "No pinned artifacts" 
          : `${pinnedArtifacts.length} pinned artifact${pinnedArtifacts.length === 1 ? '' : 's'}`
        }
      </TooltipContent>
    </Tooltip>
  );
}
