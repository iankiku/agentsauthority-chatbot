# Fragment GEO Platform - Technical UI Implementation Plan

## 📋 **Executive Summary**

This document outlines the technical implementation plan for integrating AI
chatbot components from the Vercel AI Chatbot template into the Fragment app to
create a chat-centric interface for the Fragment GEO platform MVP.

## 🎯 **Core Objective**

Transform the existing Fragment chat page (`apps/fragment/app/chat/page.tsx`)
into a full-width, streaming chat interface that renders inline AI artifacts
(charts, tables, score cards) directly within the conversation flow, following
the "One Conversation, One Artifact, One Action" principle.

## 📦 **Required Package Dependencies**

### **Phase 1: Core Dependencies (Must Install First)**

```bash
# Install in apps/fragment/
pnpm add @ai-sdk/react@2.0.0-beta.6
pnpm add @ai-sdk/provider@2.0.0-beta.1
pnpm add ai@5.0.0-beta.6
pnpm add framer-motion@11.3.19
pnpm add fast-deep-equal@3.1.3
pnpm add swr@2.2.5
pnpm add usehooks-ts@3.1.0
pnpm add nanoid@5.0.8
pnpm add classnames@2.5.1
```

### **Phase 2: UI Enhancement Dependencies**

```bash
# Install in apps/fragment/
pnpm add @radix-ui/react-tooltip@1.1.3
pnpm add @radix-ui/react-dropdown-menu@2.1.2
pnpm add @radix-ui/react-separator@1.1.0
pnpm add @radix-ui/react-visually-hidden@1.1.0
pnpm add tailwindcss-animate@1.0.7
```

### **Phase 3: Optional Advanced Features**

```bash
# Install in apps/fragment/ (for future artifact editing)
pnpm add codemirror@6.0.1
pnpm add @codemirror/lang-javascript@6.2.2
pnpm add @codemirror/state@6.5.0
pnpm add @codemirror/view@6.35.3
```

## 🏗️ **Directory Structure to Create**

### **New Directories in `apps/fragment/`**

```
apps/fragment/
├── components/
│   ├── chat/                    # NEW - Chat-specific components
│   │   ├── chat-content.tsx
│   │   ├── chat-header.tsx
│   │   ├── chat-input.tsx
│   │   └── chat-messages.tsx
│   ├── artifacts/               # NEW - Artifact rendering system
│   │   ├── artifact-renderer.tsx
│   │   ├── geo-score-card.tsx
│   │   ├── competitor-matrix.tsx
│   │   ├── data-table.tsx
│   │   ├── line-chart.tsx
│   │   └── progress-bar.tsx
│   ├── messages/                # NEW - Message components
│   │   ├── message.tsx
│   │   ├── message-actions.tsx
│   │   ├── message-reasoning.tsx
│   │   └── thinking-message.tsx
│   └── ui/                      # EXISTING - Extend with new components
│       ├── tooltip.tsx          # NEW
│       ├── separator.tsx        # NEW
│       └── dropdown-menu.tsx    # NEW
├── hooks/                       # EXISTING - Extend with new hooks
│   ├── use-chat.ts              # NEW
│   ├── use-messages.ts          # NEW
│   └── use-artifact.ts          # NEW
├── lib/                         # EXISTING - Extend with new utilities
│   ├── chat-types.ts            # NEW
│   ├── chat-utils.ts            # NEW
│   └── artifact-schemas.ts      # NEW
└── types/                       # NEW - Type definitions
    ├── chat.ts
    ├── artifacts.ts
    └── messages.ts
```

## 🔄 **Component Migration & Adaptation Strategy**

### **Phase 1: Core Chat Infrastructure**

#### **1.1 Copy & Adapt Core Components**

**Source:** `ai-chatbot/components/chat.tsx` → **Target:**
`apps/fragment/components/chat/chat-content.tsx`

**Key Adaptations:**

- Remove artifact-specific logic (keep basic structure)
- Integrate with Fragment's existing session/auth system
- Adapt to Fragment's UI design system (orange theme)
- Remove sidebar dependency (full-width layout)

**Source:** `ai-chatbot/components/messages.tsx` → **Target:**
`apps/fragment/components/chat/chat-messages.tsx`

**Key Adaptations:**

- Simplify to focus on text + inline artifacts only
- Remove complex artifact canvas logic
- Adapt to Fragment's message styling

#### **1.2 Create Fragment-Specific Chat Hook**

**New File:** `apps/fragment/hooks/use-chat.ts`

```typescript
// Simplified version of ai-chatbot's useChat integration
// Focus on streaming text + tool calls for artifacts
// Integrate with Fragment's existing API endpoints
```

### **Phase 2: Artifact System Implementation**

#### **2.1 Create Artifact Renderer**

**New File:** `apps/fragment/components/artifacts/artifact-renderer.tsx`

**Purpose:** Dynamic component that renders different artifact types based on AI
tool calls

**Key Features:**

- Type-safe artifact detection from `message.toolInvocations`
- Chromeless design (no borders/cards - fits in chat bubbles)
- Fallback for unknown artifact types

#### **2.2 Create Fragment-Specific Artifacts**

**New Files:**

- `apps/fragment/components/artifacts/geo-score-card.tsx`
- `apps/fragment/components/artifacts/competitor-matrix.tsx`
- `apps/fragment/components/artifacts/data-table.tsx`
- `apps/fragment/components/artifacts/line-chart.tsx`

**Design Principles:**

- Chromeless (no self-contained styling)
- Use Fragment's design system (orange theme, shadcn/ui)
- Responsive and mobile-friendly
- Focus on data visualization only

### **Phase 3: Message System Enhancement**

#### **3.1 Adapt Message Components**

**Source:** `ai-chatbot/components/message.tsx` → **Target:**
`apps/fragment/components/messages/message.tsx`

**Key Adaptations:**

- Remove complex artifact canvas integration
- Focus on inline artifact rendering
- Adapt styling to Fragment's orange theme
- Simplify to MVP requirements

#### **3.2 Create Progress Indicator**

**New File:** `apps/fragment/components/artifacts/progress-bar.tsx`

**Purpose:** Compact progress bar for streaming analysis status

**Features:**

- Inline within chat messages
- Shows percentage and current stage
- Fragment's orange theme styling

## 🔧 **API Integration Strategy**

### **Phase 1: Chat API Enhancement**

**File:** `apps/fragment/app/api/chat/route.ts`

**Required Changes:**

- Integrate with Vercel AI SDK streaming
- Add tool call support for artifacts
- Maintain compatibility with existing Fragment endpoints
- Add mock session support for MVP demo

### **Phase 2: Artifact API Integration**

**File:** `apps/fragment/app/api/brand-monitor/analyze/route.ts`

**Required Changes:**

- Return tool calls in AI SDK format
- Stream progress updates
- Generate artifact data structures
- Integrate with existing brand analysis logic

## 🎨 **UI/UX Adaptation Strategy**

### **Phase 1: Layout Transformation**

**Current:** Sidebar + content layout **Target:** Full-width chat interface

**Changes Required:**

- Remove sidebar from chat page
- Full-height chat container
- Responsive design for mobile
- Fragment branding integration

### **Phase 2: Design System Integration**

**Color Scheme:**

- Primary: Fragment orange (`#f97316`)
- Background: Light gray (`#f9fafb`)
- Text: Dark gray (`#111827`)
- Accent: Orange variants

**Typography:**

- Use Fragment's existing font stack
- Maintain readability in chat context
- Consistent sizing across components

### **Phase 3: Responsive Design**

**Mobile-First Approach:**

- Single column layout on mobile
- Touch-friendly input areas
- Swipe gestures for navigation
- Optimized artifact display

## 🚀 **Implementation Phases**

### **Phase 1: Foundation (Week 1)**

1. Install core dependencies
2. Create directory structure
3. Copy and adapt core chat components
4. Set up basic chat hook
5. Create minimal artifact renderer

### **Phase 2: Core Features (Week 2)**

1. Implement streaming chat interface
2. Create first artifact component (GeoScoreCard)
3. Integrate with Fragment's API
4. Add progress indicators
5. Implement mock session

### **Phase 3: Enhancement (Week 3)**

1. Add multiple artifact types
2. Implement responsive design
3. Add error handling
4. Optimize performance
5. Add loading states

### **Phase 4: Polish (Week 4)**

1. UI/UX refinements
2. Accessibility improvements
3. Performance optimization
4. Testing and bug fixes
5. Documentation

## 📋 **Detailed Task Breakdown**

### **Task 1: Environment Setup**

- [ ] Install Phase 1 dependencies
- [ ] Create directory structure
- [ ] Update TypeScript config for new paths
- [ ] Configure ESLint for new components

### **Task 2: Core Chat Infrastructure**

- [ ] Copy and adapt `chat.tsx` to `chat-content.tsx`
- [ ] Create `use-chat.ts` hook
- [ ] Adapt `messages.tsx` to Fragment styling
- [ ] Create basic message component

### **Task 3: Artifact System**

- [ ] Create `artifact-renderer.tsx`
- [ ] Implement `geo-score-card.tsx`
- [ ] Create artifact type definitions
- [ ] Set up artifact schemas

### **Task 4: API Integration**

- [ ] Enhance `/api/chat` route
- [ ] Add tool call support
- [ ] Integrate with brand monitor API
- [ ] Add mock session support

### **Task 5: UI Components**

- [ ] Create progress bar component
- [ ] Implement thinking message
- [ ] Add message actions
- [ ] Create responsive layout

### **Task 6: Styling & Polish**

- [ ] Apply Fragment color scheme
- [ ] Implement responsive design
- [ ] Add loading states
- [ ] Optimize for mobile

### **Task 7: Testing & Integration**

- [ ] Test streaming functionality
- [ ] Verify artifact rendering
- [ ] Test responsive design
- [ ] Integration testing

### **Task 8: Documentation & Cleanup**

- [ ] Update component documentation
- [ ] Clean up unused code
- [ ] Performance optimization
- [ ] Final testing

## ⚠️ **Critical Considerations**

### **Performance**

- Implement proper memoization for message components
- Optimize artifact rendering for large datasets
- Use virtual scrolling for long conversations
- Lazy load artifact components

### **Accessibility**

- Ensure proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### **Error Handling**

- Graceful fallbacks for failed API calls
- User-friendly error messages
- Retry mechanisms
- Offline state handling

### **Security**

- Validate all artifact data
- Sanitize user inputs
- Rate limiting
- Session validation

## 🎯 **Success Metrics**

### **Functional Requirements**

- [ ] Full-width chat interface loads
- [ ] Streaming messages work correctly
- [ ] Artifacts render inline in chat
- [ ] Progress indicators show status
- [ ] Mock session bypasses auth

### **Performance Requirements**

- [ ] Chat loads in <2 seconds
- [ ] Messages stream smoothly
- [ ] Artifacts render in <1 second
- [ ] Mobile performance acceptable

### **UX Requirements**

- [ ] Intuitive chat flow
- [ ] Clear visual hierarchy
- [ ] Responsive design works
- [x] Error states are clear

## 🔗 **Key Files to Reference**

### **Source Files (ai-chatbot)**

- `ai-chatbot/components/chat.tsx` - Main chat component
- `ai-chatbot/components/messages.tsx` - Message rendering
- `ai-chatbot/components/message.tsx` - Individual message
- `ai-chatbot/components/artifact.tsx` - Artifact system
- `ai-chatbot/hooks/use-artifact.ts` - Artifact state management

### **Target Files (fragment)**

- `apps/fragment/app/chat/page.tsx` - Current chat page (to be transformed)
- `apps/fragment/app/api/chat/route.ts` - Chat API (to be enhanced)
- `apps/fragment/app/api/brand-monitor/analyze/route.ts` - Analysis API (to be
  enhanced)

### **Design System**

- `apps/fragment/components/ui/` - Existing UI components
- `apps/fragment/lib/` - Utilities and helpers

## 📝 **Next Steps**

1. **Review and approve** this implementation plan
2. **Install Phase 1 dependencies** to begin development
3. **Create directory structure** as outlined
4. **Start with Task 1** (Environment Setup)
5. **Follow the phased approach** for systematic implementation

This implementation plan provides a clear roadmap for transforming the Fragment
app into a chat-centric interface that showcases AI-generated artifacts inline,
following the MVP requirements outlined in the PRD.
