"use client";

import { useState } from "react";
import type { UIMessage } from "@ai-sdk/react";
import { ArtifactRenderer } from "./artifact-renderer";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { 
  Maximize2, 
  Code2, 
  Eye, 
  ExternalLink,
  Copy,
  Download
} from "lucide-react";
import { cn } from "@workspace/utils";

interface ArtifactPreviewProps {
  message: UIMessage;
  className?: string;
}

export function ArtifactPreview({ message, className }: ArtifactPreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  
  const artifact = message?.toolInvocations?.[0]?.result as any;

  if (!artifact) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(artifact, null, 2));
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(artifact, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artifact-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenInCanvas = () => {
    // This would trigger opening the artifact in the canvas
    console.log('Open in canvas:', artifact);
  };

  return (
    <div className={cn(
      "border rounded-lg bg-background overflow-hidden",
      className
    )}>
      {/* Preview Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium">
            {artifact.type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Artifact'}
          </span>
          <Badge variant="secondary" className="text-xs">
            Preview
          </Badge>
        </div>

        <div className="flex items-center space-x-1">
          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-background rounded-md p-1 border mr-2">
            <button
              onClick={() => setViewMode('preview')}
              className={cn(
                "p-1 rounded-sm transition-colors",
                viewMode === 'preview' 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={cn(
                "p-1 rounded-sm transition-colors",
                viewMode === 'code' 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <Code2 className="w-3 h-3" />
            </button>
          </div>

          {/* Action Buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 w-7 p-0"
          >
            <Copy className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 w-7 p-0"
          >
            <Download className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenInCanvas}
            className="h-7 w-7 p-0"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="h-64 overflow-hidden">
        {viewMode === 'preview' ? (
          <div className="h-full p-4 overflow-auto">
            <ArtifactRenderer messages={[message]} />
          </div>
        ) : (
          <div className="h-full p-4 overflow-auto">
            <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
              <code>{JSON.stringify(artifact, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Preview Footer */}
      <div className="flex items-center justify-between p-3 border-t bg-muted/30">
        <div className="text-xs text-muted-foreground">
          Created {new Date().toLocaleDateString()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenInCanvas}
          className="h-7 text-xs"
        >
          <Maximize2 className="w-3 h-3 mr-1" />
          Open in Canvas
        </Button>
      </div>
    </div>
  );
}
