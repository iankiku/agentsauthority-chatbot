// apps/dashboard/components/dashboard/chat-canvas-layout.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { generateUUID } from "@workspace/utils";
import { ArtifactCanvas } from "@/components/chat/artifact-canvas";
import { ChatInput } from "@/components/chat/chat-input-enhanced";
import { useState, useEffect } from "react";
import type { UIMessage } from "@ai-sdk/react";

interface ChatCanvasLayoutProps {
  pageType: "overview" | "competitors" | "platforms" | "insights" | "reports";
  initialPrompt?: string;
  systemContext: string;
}

export function ChatCanvasLayout({ 
  pageType, 
  initialPrompt, 
  systemContext 
}: ChatCanvasLayoutProps) {
  const [hasInitialized, setHasInitialized] = useState(false);

  const {
    messages,
    setMessages,
    append,
    status,
    stop,
    input,
    setInput,
    handleSubmit,
  } = useChat({
    id: generateUUID(),
    api: `/api/dashboard/${pageType}`,
    initialMessages: [
      {
        id: "system",
        role: "system",
        content: systemContext,
      },
    ],
  });

  // Auto-trigger initial visualization
  useEffect(() => {
    if (!hasInitialized && initialPrompt) {
      setHasInitialized(true);
      append({
        role: "user",
        content: initialPrompt,
      });
    }
  }, [hasInitialized, initialPrompt, append]);

  // Get the latest artifact message for canvas
  const latestArtifactMessage = messages
    .slice()
    .reverse()
    .find(msg => msg.toolInvocations && msg.toolInvocations.length > 0);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Canvas Area - Takes most of the screen */}
      <div className="flex-1 overflow-hidden">
        {latestArtifactMessage ? (
          <ArtifactCanvas
            message={latestArtifactMessage}
            messages={messages}
            mode="artifact"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {getEmptyStateTitle(pageType)}
              </h2>
              <p className="text-muted-foreground mb-6">
                {getEmptyStateDescription(pageType)}
              </p>
              <div className="space-y-2">
                {getSuggestedQueries(pageType).map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(query)}
                    className="block w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <span className="text-sm">{query}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getEmptyStateTitle(pageType: string): string {
  const titles: Record<ChatCanvasLayoutProps['pageType'], string> = {
    overview: "Dashboard Overview",
    competitors: "Competitor Analysis",
    platforms: "Platform Performance",
    insights: "AI Insights",
    reports: "Custom Reports"
  };
  return titles[pageType] || "Dashboard";
}

function getEmptyStateDescription(pageType: string): string {
  const descriptions: Record<ChatCanvasLayoutProps['pageType'], string> = {
    overview: "Ask me to show your overall performance, key metrics, or recent changes",
    competitors: "Ask me to analyze competitors, compare performance, or track market position",
    platforms: "Ask me to show platform-specific performance, trends, or optimization opportunities",
    insights: "Ask me to generate insights, identify patterns, or suggest improvements",
    reports: "Ask me to create custom reports, export data, or schedule analysis"
  };
  return descriptions[pageType] || "Ask me anything about your data";
}

function getSuggestedQueries(pageType: string): string[] {
  const queries: Record<ChatCanvasLayoutProps['pageType'], string[]> = {
    overview: [
      "Show me my current GEO score and key metrics",
      "What changed in my performance this week?",
      "Give me a summary of my brand visibility"
    ],
    competitors: [
      "Compare my performance to top 3 competitors",
      "Show me competitor ranking changes this month",
      "Which competitor is gaining the most visibility?"
    ],
    platforms: [
      "Show my performance across all AI platforms",
      "Which platform should I focus on improving?",
      "Create a platform comparison chart"
    ],
    insights: [
      "What are my biggest opportunities right now?",
      "Analyze my visibility trends and patterns",
      "Generate actionable recommendations"
    ],
    reports: [
      "Create a weekly performance report",
      "Show me month-over-month growth analysis",
      "Generate a competitor benchmarking report"
    ]
  };
  return queries[pageType] || [];
}