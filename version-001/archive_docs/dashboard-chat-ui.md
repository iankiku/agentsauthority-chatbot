# Dashboard Chat UI Architecture

## Overview

Transform every dashboard page into a chat-driven canvas where users type queries and get dynamic visualizations rendered above. This creates a unified, conversational interface across the entire platform using the Vercel AI SDK.

## Vercel AI Chatbot SDK resources
 https://chat-sdk.dev/docs/getting-started/overview

https://deepwiki.com/search/relevantcontextthis-query-was_01fdbd6b-50e8-4877-96a8-16f86f64eff9

https://deepwiki.com/search/explain-how-the-canvas-is-buil_9209997d-7fd5-4450-b6d6-e9761dccaabb and                                                               │
│   https://deepwiki.com/search/relevantcontextthis-query-was_01fdbd6b-50e8-4877-96a8-16f86f64eff9

https://github.com/vercel/ai-chatbot 
-----

Adopting the perplexity design that mimics perplexity.com built with vercel chat ui sdk and vercel ai sdk. 


## Revised Prompt: Describe Perplexity-Style GEO Generative Engine & SEO Dashboard UI for LLM Engineer

> **Note**: The Perplexity chat interface is implemented using the **Vercel Chat UI SDK** and associated APIs. This SDK enables Perplexity’s real-time, streaming, citation-first conversational interface, and it should be leveraged for both core functionality and UI patterns.

***

### 1. Layout & Visual Design

- **Minimalist, Distraction-Free Layout**: Use a clean interface with a dark (or neutral) background, high-contrast accent colors (e.g., purple for key interactive elements), and ample white space for focus.
- **Wide, Tall Main Window**: The central main pane accommodates chat and dashboard modules, providing generous vertical space for responses and visual elements.
- **Left Sidebar**:
  - Positioned vertically on the left side of the screen (not top).
  - Hosts mode/source selection (e.g., GEO, SEO, audit types), project/session navigation, and quick filters.
  - Updates contextually with relevant options without crowding the main view.
- **Consistent Typography & Icons**: Use modern, legible fonts and intuitive icons throughout for a professional and uniform look.

***

### 2. Core Interaction Pattern

- **Prompt/Search Field Positioned at Bottom Center**:
  - Single prominent chat/search input located at the bottom for easy access.
  - Accepts natural language queries, keywords, and file uploads (e.g., sitemaps, HTML, text).
  - Incorporate quick-action buttons (upload, notes, trigger analysis) adjacent to input.
- **Multi-Modal Input Support**: Enable uploading diverse content (code snippets, images, audio) with extensible support for new modalities.
- **Streaming, Real-Time Responses**:
  - Leverage Vercel Chat UI SDK's streaming features to show answers as they generate.
  - Responses appear incrementally, providing immediate user feedback.
- **Answer Cards/Modules**:
  - Display each user query and AI response as stacked, card-style bubbles.
  - Information is clear, concise, expandable for details, and visually separated to avoid crowding.

***

### 3. Information Hierarchy & Dashboard Content

- **KPI Cards Panel**: Place essential metrics upfront as cards (e.g., GEO score, rankings, traffic data, crawl stats).
- **Conversational Analytics**:
  - Each user prompt triggers a corresponding AI-generated response with insights, tables, charts.
  - Bubbles include timestamp and inline citations for transparency and traceability.
- **Citations & Source Transparency**:
  - Numbered, clickable citations (mirroring Perplexity’s model).
  - Optional expandable source view panels per response.
- **Mode & Context Switching**: The sidebar facilitates quick toggling among GEO, SEO, Deep Audit, Keyword Discovery, and custom dashboard views.

***

### 4. Filtering, Drill-Down, and Controls

- **Minimal Contextual Filters**:
  - Located in or near the sidebar or top area of the main pane (popovers preferred).
  - Filters for project, date range, keyword, market, competitor.
- **Drill-Down Functionality**:
  - Clickable KPIs or AI responses open detailed modals or panels.
  - Show trends, competitor breakdowns, audit details without cluttering the main UI.

***

### 5. Accessibility & Performance

- **Responsive Design**: Fully adaptable across desktop, tablet, and mobile devices with no loss of clarity or usability.
- **Accessibility Compliance**:
  - Adhere to WCAG standards—high contrast, readable fonts, alt text, keyboard navigation.
- **Performance**:
  - Use Vercel SDK streaming for fast, non-blocking rendering.
  - Avoid heavy visuals and large, slow-loading widgets.

***

### 6. User Empowerment & Transparency

- **Engine/Model & Data Source Switching**: Expose toggles to choose between LLM engines (GPT-4, Claude, etc.) and data sources.
- **Citable Query History**: Maintain a chronological history with the ability to revisit and restore past searches or sessions.
- **Loading & Progress Indicators**: Use skeleton screens and animated loaders during long-running operations to inform users.

***

### 7. Example Wireframe (Left Sidebar)

```plaintext
---------------------------------------------
| [Sidebar: Mode/Project/Filters]            |
|                                           |
|  [KPI Card][KPI Card][KPI Card][KPI Card]  |
|                                           |
| CHAT HISTORY / DASHBOARD                   |
|                                           |
| [User Prompt 1]                            |
|    AI Response (card; text, chart) [1][2]|
| [User Prompt 2]                            |
|    AI Response [1]                         |
|                                           |
| [Prompt/Query Input Bar: ______________ ]|
---------------------------------------------
```

***

### 8. SDK Implementation Instructions

- **Use the Vercel Chat UI SDK** (ai-sdk) as Perplexity does to provide:
  - Streaming, conversational UI with `useChat` hooks and real-time updates.
  - Inline citations and multi-modal message schema (text, code, images, tables).
  - Integration of backend endpoints supporting streaming LLM outputs with citation mapping.
- Style components using `shadcn/ui` or similar libraries recommended by Vercel to match Perplexity’s clean, minimalist aesthetic.

***

### End Goal

Create a **Perplexity-inspired, Vercel Chat UI SDK–powered GEO and SEO dashboard** with:

- A **left sidebar** for mode and context navigation.
- Central chat and KPI areas for real-time, streaming, citation-backed insights.
- Minimalist, accessible, responsive design focused on clarity and performance.
- Full multi-modal input/output support and user empowerment through transparent, traceable data.

***

**Citations**:  
- Perplexity’s UI and real-time streaming with citations are powered by the Vercel Chat UI SDK  
- UX pattern validated by Perplexity’s official interface and community UX analysis[1][7][8]

[1] https://www.arsturn.com/blog/navigating-the-perplexity-interface-user-experience-insights
[2] https://www.youtube.com/watch?v=w_YRnA8RdnU
[3] https://connect.mozilla.org/t5/discussions/perplexity-ai-into-the-sidebar/td-p/78491
[4] https://www.reddit.com/r/perplexity_ai/comments/1g6ogbr/customize_the_entire_perplexity_user_interface/
[5] https://github.com/srbhptl39/MCP-SuperAssistant/issues/79
[6] https://x.com/WesRothMoney/status/1945106082159796232
[7] https://www.reddit.com/r/perplexity_ai/comments/1kf8d9p/new_ui_on_the_web_version/
[8] https://www.perplexity.ai/ko/hub/blog/getting-started-with-perplexity
[9] https://felloai.com/2025/07/how-to-use-perplexity-ai-complete-beginners-guide/





The Perplexity chat interface primarily uses the IBM Plex font family as its main typography. This is a clean, modern grotesque (sans-serif) typeface known for high readability and a professional look.

Regarding font size specifics, although exact values are not publicly detailed by Perplexity, typical minimalist UI designs like Perplexity’s usually employ:

Body text: Around 14–16px for main content readability

Headings and key labels: Larger sizes, often 18–24px depending on hierarchy

Interface elements (input fields, buttons): Usually 14–16px for usability

The choice of IBM Plex aligns with a design philosophy prioritizing clarity, legibility, and a neutral professional tone suitable for fast, trustworthy information delivery.

No direct official style guide states precise font sizes, but the use of IBM Plex and typical clean UI sizing conventions fits Perplexity’s minimalist, readable, and accessible interface style.

Summary:

Aspect	Detail
Font family	IBM Plex (Grotesque, Sans-serif)
Font sizes	Approx. 14–16px body text, larger for headings (18–24px typical)
Style focus	Clarity, legibility, professional & modern look
This font choice supports Perplexity’s emphasis on minimalism, accessibility, and information-first design.

Citations:
Reddit discussion confirming IBM Plex is Perplexity's font
Reference to Perplexity typography as a "grotesque font family with history and design sensibilities"










---- mimimalist design ----
## Summary of Minimalist Dashboard Design Principles

### Main Points

- **Clarity**: Ensure metrics and visualizations are readable at a glance with clear labels, concise titles, and logical grouping.
- **Prioritization**: Place core KPIs and essential metrics in prominent areas (top or left), and minimize secondary data.
- **Limit Visual Load**: Stick to ~5–9 key elements per screen to prevent information overload and increase comprehension.
- **Consistent Visual Hierarchy**: Use grids, alignment, consistent colors, fonts, and styles. Structure content with deliberate spacing and white space.
- **Thoughtful Chart Choices**: Match each chart type to the data (e.g., use bar charts for comparisons, line charts for trends, and pie charts sparingly).
- **Interactive, Not Overwhelming**: Offer minimal, intuitive filters and drill-downs. Keep interactive elements focused and easy to use.
- **Responsiveness and Accessibility**: Design for all devices with high-contrast colors, readable fonts, and alt text. Support accessibility tools.

### Full List of Dos and Don’ts

| Dos                                                   | Don’ts                                                    |
|-------------------------------------------------------|-----------------------------------------------------------|
| Group related metrics; prioritize KPIs                 | Overload with excessive data or widgets                   |
| Structure content with grids and hierarchy             | Use misaligned or randomly placed elements                |
| Use consistent colors, fonts, chart styles             | Change styles or chart types excessively                  |
| Enable user-driven, minimal filtering and interaction  | Add too many controls, buttons, or toggles                |
| Ensure accessibility (contrast, readable fonts, alt)   | Use tiny fonts, low-contrast, or color-only distinctions  |
| Match chart types to data; use icons for clarity       | Rely on jargon, ambiguous terms, or non-intuitive designs |
| Optimize performance and load times                    | Add slow widgets or heavy, unoptimized visuals            |
| Make dashboards responsive for all devices             | Ignore mobile/tablet viewers and accessibility            |

***

## Using Vercel ChatUI SDK to Build a Minimalistic Dashboard

You can leverage the Vercel AI Chat UI SDK in Next.js to create a responsive, interactive, and minimalist dashboard. Here’s how to do it:

### Core Steps

1. **Install Dependencies**
   - Use Vercel’s template or install `ai`, `shadcn/ui`, and supporting packages.
   - Example:
     ```bash
     npx create-next-app --example https://github.com/vercel/ai-chatbot
     npm install ai @shadcn/ui tailwindcss
     ```

2. **Set Up the Chat Component**
   - Import and use the `useChat` hook for streaming chat and real-time updates.
   - Keep UI components minimal: cards, grids, and chat interface via shadcn/ui or Chakra UI.
   - Sample setup:
     ```jsx
     import { useChat } from "ai/react";
     const { messages, input, handleInputChange, handleSubmit } = useChat();
     // Render chat messages and input form
     ```

3. **Layout Design**
   - Use grid/card layouts for the dashboard and chat box.
   - Separate main metrics (as cards or tiles) from chat/sidebar controls.
   - Apply spacing and white space liberally to preserve a minimal aesthetic.

4. **Add Minimal Filtering & Drill-Downs**
   - Use popovers or modals for drill-downs (avoid crowding the main view).
   - Allow switching between dashboards/contexts using a collapsible sidebar or tab navigation.

5. **Enable Multi-Modal Widgets (Optional)**
   - Include support for files, images, or audio using ChatUI’s attachment and streaming capabilities.
   - Templates and examples for multi-modal integration are available in Vercel’s GitHub Repo and templates.

6. **Deploy and Optimize**
   - Deploy on Vercel for instant scaling and fast load times.
   - Ensure accessibility compliance and cross-device responsiveness by testing layouts.

### Additional Best Practices

- **State Management**: Rely on UI hooks like `useChat` for seamless message streaming and state logic.[1][2][3]
- **Component Reusability**: Encapsulate chat, cards, and filter controls into small, composable components.
- **Performance**: Avoid heavy components, prioritize fast load, and limit live data widgets to only those necessary.
- **Customization**: Integrate your API or connect to OpenAI, Anthropic, or other LLMs through backend routes as needed.

### Useful Guides & Templates

- [Vercel Chatbot UI Template](https://vercel.com/templates/next.js/chatbot-ui)
- [Semaphore: Vercel AI SDK Walkthrough](https://semaphore.io/blog/vercel-ai-sdk)
- [YouTube: Next.js + Vercel AI SDK Chatbot Tutorial](https://www.youtube.com/watch?v=_tBTfvQr38M)
- [DEV Community: Step-by-Step Chat App with Shadcn/ui](https://dev.to/mongodb/building-a-chat-application-with-mongodb-memory-provider-for-vercel-ai-sdk-56ap)

By following these steps and principles, you can create a **minimalist dashboard** using the Vercel Chat UI SDK that is clean, responsive, interactive, and ready for production—without sacrificing clarity or performance.[2][3][1]

[1] https://dev.to/mongodb/building-a-chat-application-with-mongodb-memory-provider-for-vercel-ai-sdk-56ap
[2] https://semaphore.io/blog/vercel-ai-sdk
[3] https://www.youtube.com/watch?v=_tBTfvQr38M
[4] https://www.youtube.com/watch?v=pOz_evbzSX4
[5] https://vercel.com/templates/next.js/chatbot-ui
[6] https://www.youtube.com/watch?v=D48I3Nd0E5U
[7] https://www.youtube.com/watch?v=lp1RtS7RKtw
[8] https://www.youtube.com/watch?v=wrd_-TseTIo
[9] https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
[10] https://www.linkedin.com/posts/anant-garg_v0-vercel-ai-activity-7245440250691411969-mhr_
[11] https://vercel.com/templates/nextjs
[12] https://www.youtube.com/watch?v=c8_tafixiAs
[13] https://vercel.com/templates/next.js/ai-chatbot-telemetry
[14] https://nextjstemplates.com/blog/admin-dashboard-templates
[15] https://github.com/birobirobiro/awesome-shadcn-ui
[16] https://vercel.com/templates/next.js/nextjs-ai-chatbot
[17] https://vercel.com/templates/tailwind
[18] https://v0.dev/chat/ui-component-designer-vlS6RzYgyba
[19] https://vercel.com/templates/ai
[20] https://blog.saeloun.com/2023/07/13/building-chatbot-in-next-js-using-vercel-ai-sdk/

## Core Architecture: Chat Canvas Everywhere

Every dashboard page becomes:
- **Canvas Area**: Dynamic artifact rendering (charts, tables, insights)
- **Chat Input**: Natural language queries that generate visualizations
- **Persistent Context**: Each page maintains domain-specific context

## Implementation Strategy

### 1. Universal Chat Canvas Layout

```tsx
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

      {/* Chat Input - Fixed at bottom */}
      <div className="border-t bg-background p-4">
        <ChatInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
          messages={messages}
          mode="artifact"
        />
      </div>
    </div>
  );
}

function getEmptyStateTitle(pageType: string): string {
  const titles = {
    overview: "Dashboard Overview",
    competitors: "Competitor Analysis",
    platforms: "Platform Performance",
    insights: "AI Insights",
    reports: "Custom Reports"
  };
  return titles[pageType as keyof typeof titles] || "Dashboard";
}

function getEmptyStateDescription(pageType: string): string {
  const descriptions = {
    overview: "Ask me to show your overall performance, key metrics, or recent changes",
    competitors: "Ask me to analyze competitors, compare performance, or track market position",
    platforms: "Ask me to show platform-specific performance, trends, or optimization opportunities",
    insights: "Ask me to generate insights, identify patterns, or suggest improvements",
    reports: "Ask me to create custom reports, export data, or schedule analysis"
  };
  return descriptions[pageType as keyof typeof descriptions] || "Ask me anything about your data";
}

function getSuggestedQueries(pageType: string): string[] {
  const queries = {
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
  return queries[pageType as keyof typeof queries] || [];
}
```

### 2. Page-Specific API Endpoints

#### Dashboard Overview API

```ts
// apps/dashboard/app/api/dashboard/overview/route.ts
import { NextRequest } from "next/server";
import { getAgent } from "@/lib/mastra-client";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    const agent = await getAgent("dashboard-overview");
    
    const systemContext = `You are a dashboard overview assistant. You specialize in:
    
    CAPABILITIES:
    - Creating overview dashboards with key metrics
    - Generating GEO score visualizations
    - Showing performance trends and changes
    - Highlighting important alerts and insights
    
    AVAILABLE ARTIFACTS:
    - geo_scorecard: Overall GEO score with breakdown
    - metrics_dashboard: Key performance indicators
    - trend_chart: Performance over time
    - alert_panel: Important notifications and changes
    - summary_report: Executive summary of current status
    
    CONTEXT: This is the main dashboard overview page. Users expect to see their most important metrics and recent changes at a glance.
    
    Always respond with relevant artifacts that visualize the requested data.`;

    const contextualMessages = [
      { role: "system", content: systemContext },
      ...messages
    ];

    const result = await agent.generate(contextualMessages);
    
    return new Response(result.content || result.text, {
      headers: { "Content-Type": "text/plain" },
    });
    
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return new Response("Unable to load dashboard overview. Please try again.", {
      status: 500,
    });
  }
}
```

#### Competitor Analysis API

```ts
// apps/dashboard/app/api/dashboard/competitors/route.ts
import { NextRequest } from "next/server";
import { getAgent } from "@/lib/mastra-client";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    const agent = await getAgent("competitor-analysis");
    
    const systemContext = `You are a competitor analysis assistant. You specialize in:
    
    CAPABILITIES:
    - Competitor performance comparisons
    - Market positioning analysis
    - Competitive intelligence insights
    - Ranking and visibility tracking
    
    AVAILABLE ARTIFACTS:
    - competitor_comparison: Side-by-side performance comparison
    - market_position_chart: Market ranking visualization
    - competitive_gaps: Opportunity analysis vs competitors
    - competitor_trends: Historical performance tracking
    - market_share_pie: Visibility share breakdown
    
    CONTEXT: This is the competitor analysis page. Users want to understand how they stack up against competition and identify opportunities.
    
    Always provide competitive context and actionable insights.`;

    const contextualMessages = [
      { role: "system", content: systemContext },
      ...messages
    ];

    const result = await agent.generate(contextualMessages);
    
    return new Response(result.content || result.text, {
      headers: { "Content-Type": "text/plain" },
    });
    
  } catch (error) {
    console.error("Competitor analysis error:", error);
    return new Response("Unable to load competitor analysis. Please try again.", {
      status: 500,
    });
  }
}
```

#### Platform Performance API

```ts
// apps/dashboard/app/api/dashboard/platforms/route.ts
import { NextRequest } from "next/server";
import { getAgent } from "@/lib/mastra-client";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    const agent = await getAgent("platform-analysis");
    
    const systemContext = `You are a platform performance assistant. You specialize in:
    
    CAPABILITIES:
    - AI platform performance analysis (ChatGPT, Claude, Gemini, Perplexity)
    - Platform-specific optimization recommendations
    - Cross-platform comparison and trends
    - Platform visibility scoring
    
    AVAILABLE ARTIFACTS:
    - platform_performance: Performance across all platforms
    - platform_trends: Historical platform performance
    - optimization_matrix: Platform-specific improvement opportunities
    - platform_comparison: Side-by-side platform analysis
    
    CONTEXT: This is the platform performance page. Users want to understand how they perform on different AI platforms and where to focus optimization efforts.`;

    const contextualMessages = [
      { role: "system", content: systemContext },
      ...messages
    ];

    const result = await agent.generate(contextualMessages);
    
    return new Response(result.content || result.text, {
      headers: { "Content-Type": "text/plain" },
    });
    
  } catch (error) {
    console.error("Platform analysis error:", error);
    return new Response("Unable to load platform analysis. Please try again.", {
      status: 500,
    });
  }
}
```

#### AI Insights API

```ts
// apps/dashboard/app/api/dashboard/insights/route.ts
import { NextRequest } from "next/server";
import { getAgent } from "@/lib/mastra-client";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    const agent = await getAgent("insights-generator");
    
    const systemContext = `You are an AI insights generator. You specialize in:
    
    CAPABILITIES:
    - Pattern recognition in brand visibility data
    - Actionable recommendation generation
    - Opportunity identification and prioritization
    - Strategic insights and market intelligence
    
    AVAILABLE ARTIFACTS:
    - insight_cards: Key insights with impact scores
    - opportunity_matrix: Prioritized improvement opportunities
    - recommendation_list: Actionable next steps
    - trend_analysis: Pattern recognition and predictions
    
    CONTEXT: This is the insights page. Users want AI-generated insights that help them understand their data and take action to improve performance.`;

    const contextualMessages = [
      { role: "system", content: systemContext },
      ...messages
    ];

    const result = await agent.generate(contextualMessages);
    
    return new Response(result.content || result.text, {
      headers: { "Content-Type": "text/plain" },
    });
    
  } catch (error) {
    console.error("Insights generation error:", error);
    return new Response("Unable to generate insights. Please try again.", {
      status: 500,
    });
  }
}
```

#### Custom Reports API

```ts
// apps/dashboard/app/api/dashboard/reports/route.ts
import { NextRequest } from "next/server";
import { getAgent } from "@/lib/mastra-client";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    const agent = await getAgent("report-generator");
    
    const systemContext = `You are a custom report generator. You specialize in:
    
    CAPABILITIES:
    - Comprehensive performance reporting
    - Executive summary generation
    - Data export and visualization
    - Custom analysis based on user requirements
    
    AVAILABLE ARTIFACTS:
    - performance_report: Detailed performance analysis
    - executive_summary: High-level overview for stakeholders
    - detailed_analysis: Deep-dive into specific metrics
    - export_data: Formatted data for external use
    
    CONTEXT: This is the reports page. Users want to generate comprehensive reports for internal use, stakeholder presentations, or data export.`;

    const contextualMessages = [
      { role: "system", content: systemContext },
      ...messages
    ];

    const result = await agent.generate(contextualMessages);
    
    return new Response(result.content || result.text, {
      headers: { "Content-Type": "text/plain" },
    });
    
  } catch (error) {
    console.error("Report generation error:", error);
    return new Response("Unable to generate report. Please try again.", {
      status: 500,
    });
  }
}
```

### 3. Dashboard Page Implementations

#### Overview Page

```tsx
// apps/dashboard/app/dashboard/page.tsx
import { ChatCanvasLayout } from "@/components/dashboard/chat-canvas-layout";

export default function DashboardOverviewPage() {
  return (
    <ChatCanvasLayout
      pageType="overview"
      initialPrompt="Show me my current GEO score and key performance metrics"
      systemContext="Dashboard Overview - Show key metrics, recent changes, and overall performance summary"
    />
  );
}
```

#### Competitors Page

```tsx
// apps/dashboard/app/dashboard/competitors/page.tsx
import { ChatCanvasLayout } from "@/components/dashboard/chat-canvas-layout";

export default function CompetitorsPage() {
  return (
    <ChatCanvasLayout
      pageType="competitors"
      initialPrompt="Show me how I compare to my top 3 competitors"
      systemContext="Competitor Analysis - Compare performance, analyze market position, and identify competitive opportunities"
    />
  );
}
```

#### Platforms Page

```tsx
// apps/dashboard/app/dashboard/platforms/page.tsx
import { ChatCanvasLayout } from "@/components/dashboard/chat-canvas-layout";

export default function PlatformsPage() {
  return (
    <ChatCanvasLayout
      pageType="platforms"
      initialPrompt="Show my performance across all AI platforms"
      systemContext="Platform Performance - Analyze performance across ChatGPT, Claude, Gemini, Perplexity and other AI platforms"
    />
  );
}
```

#### Insights Page

```tsx
// apps/dashboard/app/dashboard/insights/page.tsx
import { ChatCanvasLayout } from "@/components/dashboard/chat-canvas-layout";

export default function InsightsPage() {
  return (
    <ChatCanvasLayout
      pageType="insights"
      initialPrompt="Generate insights and recommendations for improving my brand visibility"
      systemContext="AI Insights - Generate actionable insights, identify patterns, and provide optimization recommendations"
    />
  );
}
```

#### Reports Page

```tsx
// apps/dashboard/app/dashboard/reports/page.tsx
import { ChatCanvasLayout } from "@/components/dashboard/chat-canvas-layout";

export default function ReportsPage() {
  return (
    <ChatCanvasLayout
      pageType="reports"
      initialPrompt="Create a comprehensive performance report for this month"
      systemContext="Custom Reports - Generate detailed reports, export data, and create custom analysis views"
    />
  );
}
```

### 4. Enhanced Artifact Types for Dashboard

```ts
// apps/dashboard/lib/dashboard-artifacts.ts
export const DASHBOARD_ARTIFACT_TYPES = {
  // Overview artifacts
  GEO_SCORECARD: "geo_scorecard",
  METRICS_DASHBOARD: "metrics_dashboard", 
  TREND_CHART: "trend_chart",
  ALERT_PANEL: "alert_panel",
  
  // Competitor artifacts
  COMPETITOR_COMPARISON: "competitor_comparison",
  MARKET_POSITION: "market_position_chart",
  COMPETITIVE_GAPS: "competitive_gaps",
  MARKET_SHARE: "market_share_pie",
  
  // Platform artifacts
  PLATFORM_PERFORMANCE: "platform_performance",
  PLATFORM_TRENDS: "platform_trends",
  OPTIMIZATION_MATRIX: "optimization_matrix",
  
  // Insights artifacts
  INSIGHT_CARDS: "insight_cards",
  OPPORTUNITY_MATRIX: "opportunity_matrix",
  RECOMMENDATION_LIST: "recommendation_list",
  
  // Reports artifacts
  PERFORMANCE_REPORT: "performance_report",
  EXECUTIVE_SUMMARY: "executive_summary",
  DETAILED_ANALYSIS: "detailed_analysis",
} as const;

export type DashboardArtifactType = typeof DASHBOARD_ARTIFACT_TYPES[keyof typeof DASHBOARD_ARTIFACT_TYPES];
```

### 5. Navigation Integration

```tsx
// apps/dashboard/components/dashboard/dashboard-navigation.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@workspace/utils";
import { 
  BarChart3, 
  Users, 
  Layers, 
  Lightbulb, 
  FileText,
  MessageSquare 
} from "lucide-react";

const navigationItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: BarChart3,
    description: "Key metrics and performance summary"
  },
  {
    name: "Competitors", 
    href: "/dashboard/competitors",
    icon: Users,
    description: "Competitive analysis and market position"
  },
  {
    name: "Platforms",
    href: "/dashboard/platforms", 
    icon: Layers,
    description: "AI platform performance breakdown"
  },
  {
    name: "Insights",
    href: "/dashboard/insights",
    icon: Lightbulb,
    description: "AI-generated insights and recommendations"
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    description: "Custom reports and data exports"
  },
  {
    name: "Chat",
    href: "/chat",
    icon: MessageSquare,
    description: "Open-ended AI conversation"
  }
];

export function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-8 h-14">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <IconComponent className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
```

## User Experience Flow

### 1. Page Load
- User navigates to any dashboard page (e.g., `/dashboard/competitors`)
- Page loads with empty canvas and suggested queries
- Initial prompt automatically triggers to show default visualization
- Canvas displays relevant chart/table/scorecard

### 2. User Interaction
- User types natural language query in input box
- AI processes request with page-specific context
- New visualization replaces canvas content
- User can continue asking follow-up questions

### 3. Context Persistence
- Each page maintains its domain expertise
- Previous conversation context is preserved
- Users can refine and iterate on visualizations
- Seamless transition between different data views

## Example User Queries by Page

### Overview Page
- "Show me my current GEO score and key metrics"
- "What changed in my performance this week?"
- "Give me a summary of my brand visibility"
- "Create an executive dashboard view"

### Competitors Page
- "Compare my performance to top 3 competitors"
- "Show me competitor ranking changes this month"
- "Which competitor is gaining the most visibility?"
- "Create a competitive gap analysis"

### Platforms Page
- "Show my performance across all AI platforms"
- "Which platform should I focus on improving?"
- "Create a platform comparison chart"
- "Show me ChatGPT vs Claude performance trends"

### Insights Page
- "What are my biggest opportunities right now?"
- "Analyze my visibility trends and patterns"
- "Generate actionable recommendations"
- "Identify areas where I'm losing ground"

### Reports Page
- "Create a weekly performance report"
- "Show me month-over-month growth analysis"
- "Generate a competitor benchmarking report"
- "Export my data for the executive team"

## Key Benefits

1. **Unified UX**: Every page uses the same chat-canvas pattern, creating consistency
2. **Natural Interaction**: Users can ask for any visualization in plain English
3. **Context-Aware**: Each page has specialized knowledge for its domain
4. **Dynamic Content**: No static dashboards - everything is generated on-demand
5. **Infinite Flexibility**: Users can request any combination of data and visualizations
6. **Conversational Discovery**: Users can explore data through natural conversation
7. **Reduced Cognitive Load**: No need to learn complex dashboard interfaces

## Technical Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Chat SDK**: Vercel AI SDK (`useChat` hook)
- **UI Components**: shadcn/ui with custom artifacts
- **Styling**: Tailwind CSS

### Backend
- **API Routes**: Page-specific endpoints (`/api/dashboard/{page}`)
- **AI Agents**: Mastra agents with specialized contexts
- **Streaming**: Real-time response streaming
- **Artifacts**: Dynamic component generation

### Data Flow
1. User query → Chat input
2. API endpoint → AI agent with page context
3. Agent response → Artifact generation
4. Canvas update → Visual display
5. User refinement → Iterative improvement

This architecture transforms traditional static dashboards into dynamic, conversational interfaces that make complex data analysis accessible through natural language interaction.