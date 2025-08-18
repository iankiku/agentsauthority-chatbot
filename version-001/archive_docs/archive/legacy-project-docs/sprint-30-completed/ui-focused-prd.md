# Fragment GEO Platform - UI-Focused PRD (MVP)

## 🎯 **Demo User Journey: Chat → Analysis → Results → Actions (Simplified)**

### **Core Principle: One Conversation, One Artifact, One Action**

The simplest demo journey for the MVP focuses on a direct conversational flow:

1.  **User asks a question** → Chat interface
2.  **AI analyzes in real-time** → Streaming progress + live results (text +
    inline artifacts)
3.  **Results appear as visual artifact** → Single, actionable UI component
    directly in chat
4.  **User takes action** → New chat query for deeper insights or next steps

---

## 🏠 **Page Layout: Full-Width Chat Interface**

The entire page will be dedicated to the chat interface. There will be no
separate "artifact canvas" panel. All AI responses, including structured data
visualizations (artifacts), will appear inline within the chat message stream.
This maintains a natural conversational flow and contextual relevance.

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Fragment GEO | Credits: 150 (Mock)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    CHAT WINDOW                      │   │
│  │                                                     │   │
│  │  💬 User: "Analyze my website's AI visibility"       │   │
│  │                                                     │   │
│  │  🤖 Assistant: "Analyzing your website..."           │   │
│  │     [Compact Progress Bar Component]                │   │
│  │                                                     │   │
│  │  🤖 Assistant: "Analysis complete! Here's your GEO   │   │
│  │     visibility score:"                               │   │
│  │     ┌────────────────────────────────────┐          │   │
│  │     │  📈 GEO Score Card (rendered inline)│          │   │
│  │     │                                    │          │   │
│  │     │    [Chart/Details]                 │          │   │
│  │     └────────────────────────────────────┘          │   │
│  │                                                     │   │
│  │  🤖 Assistant: "Would you like a detailed table of  │   │
│  │     competitors?"                                   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ [Type your question or choose a suggestion] │   │   │
│  │  │                                             │   │   │
│  │  │ [Send]                                     │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Design Principles:**

- **Chat-centric:** The conversation is the primary interaction model.
- **Inline Generative UI:** Artifacts are embedded directly within the chat
  history.
- **No Login/Auth for Demo:** All interactions will assume a mock user ID and
  bypass authentication for the MVP demo.
- **Simplicity over complexity:** Focus on the core chat-to-artifact flow.
- **Responsiveness:** Works well on various screen sizes (mobile-first
  approach).

---

## 🗣️ **Step 1: Chat Interface & Initial State**

### **Initial Landing State**

When a user lands on the page (e.g., `/chat`), they will see a welcoming message
from the AI assistant and a persistent input field.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💬 Fragment GEO Assistant                          │   │
│  │                                                     │   │
│  │  Hi! I'm your GEO assistant. I can analyze your    │   │
│  │  website's AI visibility across ChatGPT, Claude,   │   │
│  │  Gemini, and Perplexity.                           │   │
│  │                                                     │   │
│  │  What would you like to analyze?                   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ 💡 Try: "Analyze my website's AI visibility"│   │
│  │  │ 💡 Try: "Compare me to competitors"         │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ [Type your question or website URL...]      │   │   │
│  │  │                                             │   │   │
│  │  │ [Send Button]                              │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**User Input Examples:**

- "Analyze example.com's AI visibility"
- "Show me a competitive analysis for my brand"
- "How does Brand X compare to Brand Y in AI search?"

---

## ⚡ **Step 2: Real-Time Analysis & Progress (Streaming)**

### **Progress State within Chat**

When the user submits a query, the AI assistant will respond with text updates
and a compact progress indicator. These updates will stream in real-time.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💬 User: "Analyze example.com's AI visibility"      │   │
│  │                                                     │   │
│  │  🤖 Assistant: "Understood! I'm starting the         │   │
│  │     analysis for example.com now."                  │   │
│  │                                                     │   │
│  │  [Compact Progress Bar: ███████████████ 75%]        │   │
│  │  <small>Stage: Analyzing with AI Providers...</small> │   │
│  │                                                     │   │
│  │  🤖 Assistant: "Gathering data from OpenAI, Claude, │   │
│  │     and Gemini. This might take a moment."          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────┐           │
│  │ [Type your question or website URL...]      │           │
│  │                                             │           │
│  │ [Send Button]                              │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**

- **Live streaming text:** Messages appear as they are generated.
- **Compact Progress Bar:** A small, inline component showing percentage
  completion and current stage.
- **Provider mentions:** Assistant messages can indicate which AI providers are
  currently being queried.

---

## 📊 **Step 3: Results Artifact (Inline)**

### **Generative UI Display**

Once the analysis is complete, the AI assistant will present the results as a
rich, interactive UI artifact directly within the chat stream.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💬 User: "Analyze example.com's AI visibility"      │   │
│  │                                                     │   │
│  │  🤖 Assistant: "Analysis complete! Here's your GEO   │   │
│  │     visibility score for example.com:"               │   │
│  │                                                     │   │
│  │  ┌────────────────────────────────────┐              │   │
│  │  │  📈 GEO SCORE CARD                 │              │   │
│  │  │                                    │              │   │
│  │  │  <Content of GeoScoreCard.tsx>     │              │   │
│  │  │  (Score: 72/100, Trend, Breakdown) │              │   │
│  │  │                                    │              │   │
│  │  └────────────────────────────────────┘              │   │
│  │                                                     │   │
│  │  🤖 Assistant: "Based on this, would you like to    │   │
│  │     generate Q&A content or view a detailed          │   │
│  │     competitor matrix?"                             │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ [Type your question or choose a suggestion] │   │   │
│  │  │                                             │   │   │
│  │  │ [Send Button]                              │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**

- **Dynamic Rendering:** The `ArtifactRenderer` will identify the artifact type
  from the AI's response (via tool calls in AI SDK messages) and render the
  corresponding React component.
- **Chromeless Artifacts:** All artifact components (`GeoScoreCard`,
  `CompetitorMatrix`, `LineChart`, etc.) will be designed without their own
  borders or headers, allowing them to fit seamlessly into the chat bubble
  style.
- **Contextual follow-up:** The AI can immediately suggest next steps or offer
  to display related data in different formats (e.g., "Show this as a table,"
  "Generate recommendations").

---

## 🎯 **Step 4: Action & Iteration**

### **Continued Conversation & New Artifacts**

The user can continue the conversation, requesting different views of the data
or asking for actionable insights. Each new request will trigger a new AI
response, potentially with a new inline artifact.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💬 User: "Show me a detailed competitor table"      │   │
│  │                                                     │   │
│  │  🤖 Assistant: "Certainly! Here's a comparison of    │   │
│  │     your brand against top competitors:"             │   │
│  │                                                     │   │
│  │  ┌────────────────────────────────────┐              │   │
│  │  │  📋 COMPETITOR MATRIX              │              │   │
│  │  │                                    │              │   │
│  │  │  <Content of CompetitorMatrix.tsx> │              │   │
│  │  │  (Table of scores, market share)   │              │   │
│  │  │                                    │              │   │
│  │  └────────────────────────────────────┘              │   │
│  │                                                     │   │
│  │  🤖 Assistant: "What else can I help you with?"      │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ [Type your question or choose a suggestion] │   │   │
│  │  │                                             │   │   │
│  │  │ [Send Button]                              │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**

- **Iterative Analysis:** Users can refine their queries and explore data
  interactively.
- **Dynamic Artifact Switching:** The chat UI will seamlessly replace previous
  artifacts with new ones based on the latest AI response.

---

## 🎨 **UI Component Specifications (Refined)**

### **`ChatContent` (`apps/fragment/app/chat/page.tsx`)**

- **Purpose:** The main container for the chat UI, managing messages, input, and
  rendering.
- **Props:** `session` (mocked for MVP), `customer` (mocked for MVP).
- **Internal State:** `messages` (from `useChat`), `input` (for text field),
  `selectedConversationId`.
- **Render Logic:**
  - Maps over `messages` from `useChat`.
  - For `user` messages, displays plain text.
  - For `assistant` messages:
    - Checks `message.toolInvocations` for structured `result` objects
      (artifacts).
    - If an artifact is present, renders `ArtifactRenderer` with the specific
      message.
    - If no artifact, renders `message.content` as markdown.
    - Includes compact progress indicator when `status` is `streaming`.

**Proposed Code Structure (Conceptual):**

```typescript
// apps/fragment/app/chat/page.tsx (within ChatContent component)

// ... existing imports and useChat hook
import { ArtifactRenderer } from "@/components/artifacts/ArtifactRenderer"; // Assuming this path
import ReactMarkdown from "react-markdown"; // For rendering markdown text
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown
import { format } from "date-fns"; // For date formatting

return (
  <div className="flex h-screen bg-gray-50">
    {/* ... Sidebar (if kept) */}

    <div className="flex-1 flex flex-col">
      {/* ... Header */}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentConversation?.messages && currentConversation.messages.length > 0 ? (
          <div className="space-y-4 mb-20">
            {currentConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {/* Check for artifact in assistant message */}
                  {message.role === "assistant" && message.toolInvocations && message.toolInvocations.length > 0 ? (
                    // Assuming only one artifact per message for simplicity in MVP
                    <ArtifactRenderer messages={[message]} />
                  ) : (
                    // Render markdown content for text messages
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  )}
                  <p className={`text-xs mt-1 ${
                    message.role === "user" ? "text-orange-100" : "text-gray-500"
                  }`}>
                    {format(new Date(message.createdAt), "h:mm a")}
                  </p>
                </div>
              </div>
            ))}
            {/* ... sendMessage.isPending loading indicator */}
          </div>
        ) : (
          {/* ... empty state */}
        )}
      </div>

      {/* Input Area */}
      {/* ... existing input area */}
    </div>
  </div>
);
```

### **`ArtifactRenderer` (`apps/fragment/components/artifacts/ArtifactRenderer.tsx`)**

- **Purpose:** A utility component to dynamically select and render the correct
  chromeless UI artifact component based on the `type` property of the artifact
  data.
- **Props:** `messages: Message[]` (specifically, messages containing
  `toolInvocations`).
- **Logic:**
  - Extracts the latest relevant `toolInvocation.result` (artifact) from the
    provided messages.
  - Uses a lookup map (`ARTIFACT_COMPONENTS`) to match `artifact.type` (e.g.,
    "geo_score_card", "data_table", "line_chart") to the corresponding React
    component.
  - Renders the selected component, passing `artifact.data` as props.
  - Handles fallback for unrecognized artifact types.

### **Chromeless UI Artifact Components (`apps/fragment/components/artifacts/*.tsx`)**

- **Purpose:** Dedicated React components for visualizing specific types of
  analysis data.
- **Examples:** `GeoScoreCard.tsx`, `CompetitorMatrix.tsx`, `LineChart.tsx`,
  `DataTable.tsx`, etc.
- **Props:** Each component will receive a `data` prop strongly typed according
  to its corresponding Zod schema (e.g., `GeoScoreCardArtifactSchema`).
- **Design:**
  - **NO** self-contained cards, borders, shadows, or titles. These are provided
    by the surrounding chat message bubble or ambient UI.
  - Focus purely on data visualization and interaction.
  - Use `shadcn/ui` components for consistency.

### **Progress Indicator Component (New, e.g., `CompactProgressBar.tsx`)**

- **Purpose:** To display real-time analysis progress directly within the chat
  stream.
- **Placement:** Rendered inline with AI assistant messages, either as part of
  the initial "thinking" message or as a separate progress update message.
- **Props:** `percentage: number`, `message: string`, `stage: string`.
- **Design:** A thin progress bar and concise status text.

### **API Endpoints (Existing)**

- `/api/chat`: Handles general chat interactions, streaming text and tool calls.
- `/api/brand-monitor/analyze`: Handles the main brand analysis, also streaming
  progress and final results (will need to be adjusted to return tool calls in a
  `useChat`-compatible format).

---

## 🚀 **Current Task, Focus, and Inspiration**

### **Current Task:**

Our current task is to build the **Minimal Viable Product (MVP) frontend for the
Fragment GEO platform**.

### **Focus:**

The core focus is to develop a **chat-centric user interface** that directly
integrates AI-generated analysis results. This means:

1.  **Inline AI Artifacts**: Instead of a separate "canvas" or panel, all AI
    responses, including structured data visualizations like tables, lists, or
    charts, will appear directly within the chat message stream. This ensures a
    natural, conversational flow and maintains context.
2.  **AI-Driven UI Generation**: The system should be capable of auto-generating
    and displaying the appropriate UI (e.g., a table for tabular data, a chart
    for trends) based on the AI's analysis, as it streams or once it's complete.
3.  **User Control over Format**: Users will be able to specify how they want
    the data viewed (e.g., as markdown, charts, or graphs), giving them
    flexibility in data consumption.

### **Inspiration:**

Our primary inspiration and architectural guide for the chat UI and streaming
capabilities is the **Vercel AI Chatbot template**
(https://github.com/vercel/ai-chatbot) and its underlying **Vercel AI SDK**. We
will be referencing this repository and its associated documentation extensively
to achieve a seamless integration within the Fragment app. The design philosophy
of "one conversation, one artifact, one action" also drives our approach to
simplicity for the MVP demo.

### **Outcome:**

The successful outcome of this phase is a **functional MVP demo of the Fragment
GEO platform** that showcases the following:

1.  **Full-Width Chat Interface**: A user interface that dedicates the entire
    page to the chat, displaying all interactions and AI-generated content.
2.  **Streaming Agent Responses**: The frontend must effectively handle and
    render streaming responses from our AI agents, progressively displaying
    information as it becomes available.
3.  **Database Integration for Display**: While not the immediate wiring task,
    the UI must be designed to eventually display structured responses pulled
    from our database (e.g., Brand Monitor, Visibility Score results) in
    digestible formats (lists, charts, etc.), providing clear insights and
    actionable recommendations.
4.  **Mock Session for Demo**: For this specific phase, we will bypass
    authentication and session management. The application should use a mock
    session ID to allow direct access to the demo functionality without
    requiring login or signup.
5.  **Clear Priorities**: The implementation will strictly adhere to the defined
    MVP priorities, focusing solely on the core chat and inline artifact
    rendering, deferring any non-essential features (like complex navigation or
    extensive dashboard layouts) to future iterations.

## ✅ **Priorities for MVP Demo**

### **High Priority (Must-Have for Demo)**

1.  **Core Chat UI Functionality:** `apps/fragment/app/chat/page.tsx` displaying
    user and assistant text messages.
2.  **Vercel AI SDK `useChat` Integration:** Ensure `useChat` is correctly
    hooked up to our `/api/chat` endpoint and streams responses.
3.  **Basic Artifact Rendering:** Implement `ArtifactRenderer` to detect and
    render at least _one_ key artifact type (e.g., `GeoScoreCard`). This
    includes making `GeoScoreCard.tsx` chromeless.
4.  **Streaming Progress Indicator:** A simple inline progress bar/message to
    show analysis status.
5.  **Mock Session/Auth Bypass:** Ensure the app runs without login, using a
    mock user ID for API calls.

### **Medium Priority (Important Enhancements)**

1.  **Multiple Artifact Types:** Extend `ArtifactRenderer` to handle `DataTable`
    and `LineChart` artifacts.
2.  **User Control over Format:** Agent's ability to generate different artifact
    types based on natural language requests (e.g., "Show as table," "Show as
    chart").
3.  **Contextual Follow-ups:** AI suggesting next steps or related analyses
    after an artifact is presented.

### **Non-Priorities for MVP Demo (Out of Scope for now)**

- Full dashboard pages (Brand Monitor, Visibility Explorer, etc.) as separate
  routes.
- Historical analysis browsing outside the chat context.
- Advanced filtering or export features on the frontend (beyond simple artifact
  display).
- Complex multi-artifact layouts or drag-and-drop features.

This revised PRD provides a clear, actionable plan for delivering a compelling
MVP demo focused on the core generative UI experience within a familiar chat
interface.
