# Dashboard Chat UI Transformation - Amazon Style Tickets

## Engineering Rules & Guidelines

**CRITICAL RULES - READ BEFORE STARTING ANY TICKET:**

1. **Working Directory**: All work must be done in `/apps/dashboard`
2. **UI Components**: Use ONLY shadcn components from `packages/ui` - NO
   subframe imports
3. **New Pages Location**: All new V2 pages must be created under
   `apps/dashboard/app/v2` and components under `apps/dashboard/components/v2`
4. **API Constraint**: Use existing APIs only - NO new API development
5. **Authentication**: NO authentication logic implementation
6. **Component Strategy**: Build reusable components once, reuse everywhere
7. **Page Preservation**: Do NOT delete current pages during implementation
8. **Error Handling**: If engineer deviates or becomes confused, STOP and ask
   human
9. **Dependencies**: List all dependencies clearly in each ticket
10. **Status Updates**: Update completion status after each ticket
    implementation
11. **Progressive Implementation**: Start with `/v2/chat` page as foundation
    before scaling to other pages

## Ticket Status Legend

- `[ ]` = Not Started
- `[/]` = In Progress
- `[-]` = Cancelled
- `[x]` = Complete

## Implementation Strategy

**CRITICAL**: This transformation follows a progressive implementation approach:

1. **Start with TICKET-001**: Create the v2 chat foundation page as a testing
   ground
2. **Test Thoroughly**: Ensure the chat page works perfectly before proceeding
3. **Scaling Decision**: After chat page is validated, decide whether to proceed
   with other dashboard pages or iterate on the foundation
4. **No Parallel Development**: Complete and validate each ticket before
   starting the next
5. **Focus on Quality**: Better to have one perfect page than multiple broken
   pages

**Success Criteria for Progression**: Only proceed to TICKET-002 and beyond
after TICKET-001 is fully functional with streaming chat, artifact rendering,
and Perplexity-style design working perfectly.

---

## TICKET-001: Create v2 Directory Structure and Chat Page Foundation

**Status**: `[ ]`

### Description

Create the foundational directory structure for the new v2 pages within
`/apps/dashboard` and implement the basic chat page that will serve as the
template for all dashboard transformations using Perplexity design patterns.

### Detailed Prompt for LLM Engineer

**TASK**: Create a new `v2` directory structure within `apps/dashboard` and
implement a chat page using the existing Vercel AI Chat SDK infrastructure. This
is the foundational page that will serve as the testing ground before scaling to
other dashboard pages.

**STEP-BY-STEP IMPLEMENTATION:**

1. **Create Directory Structure**:

   ```
   apps/dashboard/v2/
   ├── app/
   │   ├── layout.tsx
   │   └── chat/
   │       └── page.tsx
   ├── components/
   │   ├── chat/
   │   │   ├── v2-chat-canvas-layout.tsx
   │   │   └── v2-chat-input.tsx
   │   └── layout/
   │       └── v2-layout.tsx
   └── lib/
       └── v2-constants.ts
   ```

2. **Implement V2 Layout Component** (apps/dashboard/app/v2/layout.tsx):
   - Dark/neutral background (#0A0A0A or similar)
   - IBM Plex font family implementation
   - Purple accent colors (#8B5CF6)
   - Minimalist design with no unnecessary chrome
   - Full viewport height layout

3. **Create V2 Chat Canvas Layout**
   (`apps/dashboard/components/v2/chat/v2-chat-canvas-layout.tsx`):
   - Reuse and extend existing `useChat` hook from `@ai-sdk/react`
   - Copy pattern from
     `apps/dashboard/components/dashboard/chat-canvas-layout.tsx`
   - Full-screen canvas area taking majority of viewport
   - Bottom-positioned chat input (fixed position)
   - Integrate with existing `ArtifactCanvas` component
   - Use existing `/api/chat` endpoint

4. **Implement V2 Chat Input**
   (`apps/dashboard/components/v2/chat/v2-chat-input.tsx`):
   - Copy base functionality from
     `apps/dashboard/components/chat/chat-input-enhanced.tsx`
   - Style with Perplexity-inspired design
   - Bottom-center positioning
   - Rounded corners and shadow
   - Send button with proper styling

5. **Create V2 Chat Page** (`apps/dashboard/app/v2/chat/page.tsx`):
   - Use the V2ChatCanvasLayout component
   - No initial prompt (empty state)
   - Suggested queries for first-time users
   - Empty state with helpful guidance

6. **Configure V2 App Layout** (`apps/dashboard/v2/app/layout.tsx`):
   - Minimal layout wrapper
   - Import IBM Plex fonts
   - Set up dark theme defaults
   - Include necessary providers

### Context & Code Snippets

**Existing Components to Reference:**

- `apps/dashboard/components/dashboard/chat-canvas-layout.tsx` - Main chat
  layout pattern
- `apps/dashboard/components/chat/artifact-canvas.tsx` - Artifact rendering
  system
- `apps/dashboard/components/chat/chat-input-enhanced.tsx` - Chat input
  implementation
- `apps/dashboard/hooks/use-chat.ts` - Chat hook utilities
- `apps/dashboard/app/api/chat/route.ts` - Existing chat API

**Styling References:**

- Use `packages/ui` components for buttons, inputs, etc.
- Copy color scheme from existing dashboard but with Perplexity-style minimalism
- Reference `apps/dashboard/app/globals.css` for theming patterns

### File Locations

```
apps/dashboard/
├── app/
│   └── v2/
│       ├── layout.tsx
│       └── chat/
│           └── page.tsx
├── components/
│   └── v2/
│       └── chat/
│           ├── v2-chat-canvas-layout.tsx
│           └── v2-chat-input.tsx
└── lib/
    └── v2/
        └── constants.ts
```

### Acceptance Criteria

1. ✅ Create `apps/dashboard/v2/` directory structure with all specified files
2. ✅ Implement `/v2/chat` page accessible via browser navigation
3. ✅ Full-screen canvas area taking 80%+ of viewport height
4. ✅ Bottom-positioned chat input fixed at bottom of screen
5. ✅ IBM Plex font family properly loaded and applied
6. ✅ Dark/neutral background (#0A0A0A) with purple accents (#8B5CF6)
7. ✅ Responsive design works on desktop (1920px), tablet (768px), mobile
   (375px)
8. ✅ Integration with existing `useChat` hook and `/api/chat` endpoint
9. ✅ Empty state shows suggested queries and helpful guidance
10. ✅ Chat functionality works with streaming responses
11. ✅ Artifact rendering works using existing ArtifactCanvas component

### Dependencies

- Existing `@ai-sdk/react: 2.0.0-beta.6` package
- Existing `packages/ui` shadcn components (Button, Input, etc.)
- Existing `/api/chat` endpoint functionality
- Existing artifact system in
  `apps/dashboard/components/chat/artifact-canvas.tsx`
- IBM Plex font (add to layout if not already available)

### Technical Requirements

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with dark mode
- **Fonts**: IBM Plex Sans for body text, IBM Plex Mono for code
- **Chat SDK**: Use existing `useChat` hook from `@ai-sdk/react`
- **Streaming**: Support real-time response streaming
- **Artifacts**: Integrate with existing artifact rendering system
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG 2.1 AA compliance (proper ARIA labels, keyboard
  navigation)
- **Performance**: Page load < 1 second, streaming starts < 2 seconds

---

## TICKET-002: Implement Dashboard Overview Chat Canvas Page

**Status**: `[ ]`

### Description

Create a dashboard overview page that transforms the static dashboard into a
chat-driven canvas interface where users can query their GEO score, key metrics,
and performance data through natural language conversation.

### Detailed Prompt for LLM Engineer

**TASK**: Create `/v2/dashboard` page that provides a conversational interface
for dashboard overview data using the chat canvas foundation from TICKET-001.

**STEP-BY-STEP IMPLEMENTATION:**

1. **Create Dashboard Overview Page**
   (`apps/dashboard/v2/app/dashboard/page.tsx`):
   - Import and use the `V2ChatCanvasLayout` component from TICKET-001
   - Set initial prompt: "Show me my current GEO score and key performance
     metrics"
   - Configure page-specific context for dashboard overview queries
   - Add page metadata and SEO optimization

2. **Implement Dashboard Chat Canvas**
   (`apps/dashboard/v2/components/dashboard/overview-chat-canvas.tsx`):
   - Extend the base chat canvas layout with dashboard-specific features
   - Configure `useChat` hook with dashboard-specific API endpoint:
     `/api/dashboard`
   - Add dashboard-specific suggested queries and empty state
   - Handle dashboard-specific artifact types

3. **Create Dashboard-Specific Artifacts**
   (`apps/dashboard/v2/components/dashboard/dashboard-artifacts.tsx`):
   - `GeoScorecardArtifact` - displays GEO score with breakdown
   - `MetricsDashboardArtifact` - key performance indicators layout
   - `TrendChartArtifact` - performance trends over time
   - `AlertPanelArtifact` - important notifications and changes
   - Ensure all artifacts use existing data sources

4. **Add Suggested Queries Component**
   (`apps/dashboard/v2/components/dashboard/suggested-queries.tsx`):
   - Create reusable component for dashboard query suggestions
   - Include queries for different user roles (executive, analyst, manager)
   - Make queries clickable to auto-populate chat input

5. **Integrate with Existing Data**:
   - Connect to existing GEO scoring APIs in `apps/dashboard/app/api/geo-scan/`
   - Use existing dashboard data from `apps/dashboard/app/api/dashboard/`
   - Reference current dashboard components in
     `apps/dashboard/components/dashboard/` for data patterns

6. **Configure Context and Routing**:
   - Set up proper Next.js routing for `/v2/dashboard`
   - Add navigation integration
   - Ensure authentication compatibility

### Context & Code Snippets

**Current Dashboard Reference:**

- `apps/dashboard/app/dashboard/page.tsx` - Current static dashboard
  implementation
- `apps/dashboard/components/dashboard/dashboard-overview.tsx` - Overview
  component patterns
- `apps/dashboard/components/dashboard/geo-score-card.tsx` - GEO score display
  patterns
- `apps/dashboard/components/dashboard/metrics-cards.tsx` - Metrics display
  patterns

**API Integration:**

- `apps/dashboard/app/api/dashboard/route.ts` - Dashboard data endpoint
- `apps/dashboard/app/api/geo-scan/route.ts` - GEO scoring data
- `apps/dashboard/lib/geo-scoring/` - GEO scoring utilities

**Artifact System:**

- `apps/dashboard/stores/artifacts-store.ts` - Artifact state management
- `apps/dashboard/components/artifacts/artifact-renderer.tsx` - Artifact
  rendering patterns
- `apps/dashboard/types/artifacts.ts` - Artifact type definitions

### File Locations

```
apps/dashboard/v2/app/dashboard/
└── page.tsx
apps/dashboard/v2/components/dashboard/
├── overview-chat-canvas.tsx
├── dashboard-artifacts.tsx
├── geo-scorecard-artifact.tsx
├── metrics-dashboard-artifact.tsx
├── trend-chart-artifact.tsx
├── alert-panel-artifact.tsx
└── suggested-queries.tsx
```

### Acceptance Criteria

1. ✅ Create `/v2/dashboard` page accessible via browser navigation
2. ✅ Auto-load with initial prompt: "Show me my current GEO score and key
   performance metrics"
3. ✅ Support natural language queries for GEO score, metrics, trends, and
   alerts
4. ✅ Display 4-6 suggested queries for new users with different complexity
   levels
5. ✅ Integrate with existing dashboard data sources (no new APIs)
6. ✅ Render all specified artifacts: geo_scorecard, metrics_dashboard,
   trend_chart, alert_panel
7. ✅ Maintain conversation context within session (users can ask follow-up
   questions)
8. ✅ Empty state with helpful suggestions and onboarding guidance
9. ✅ Responsive design works on all screen sizes
10. ✅ Page loads in < 2 seconds and chat responds within 3 seconds

### Dependencies

- **TICKET-001 completion** - V2 chat canvas foundation must be working
- **Existing dashboard data APIs** - `/api/dashboard`, `/api/geo-scan`
- **Existing artifact rendering system** - artifact infrastructure
- **`packages/ui` components** - Button, Card, Chart components
- **Authentication system** - existing auth integration

### Technical Requirements

- **Framework**: Next.js 15 App Router with TypeScript
- **Data Fetching**: Use existing API endpoints via fetch/axios
- **State Management**: React state + existing stores where applicable
- **Styling**: Tailwind CSS with dark theme consistency
- **Charts**: Use Recharts library for trend visualizations
- **Error Handling**: Graceful fallbacks for API failures
- **Loading States**: Skeleton screens while loading data

### Sample Queries to Support

**Executive Level:**

- "Show me my current GEO score and key performance metrics"
- "Give me a summary of my brand visibility"
- "Create an executive dashboard view"

**Analytical Level:**

- "What changed in my performance this week?"
- "Show me trends over the last 3 months"
- "Compare this month's metrics to last month"

**Operational Level:**

- "Are there any alerts I need to address?"
- "Show me my top performing metrics"
- "What metrics are declining?"

---

## TICKET-003: Implement Competitor Analysis Chat Canvas Page

**Status**: `[ ]`

### Description

Create a competitor analysis page that allows users to query competitive data,
market positioning, and benchmarking information through natural language
conversation.

### Detailed Prompt for LLM Engineer

Implement `/v2/dashboard/competitors` page using the chat canvas pattern. This
page should specialize in competitive analysis queries and generate comparison
charts, market position visualizations, and competitive gap analysis. Use
existing competitor data and create new artifact types for competitive
intelligence.

### Context & Code Snippets

- **Current Competitors Page**: `apps/dashboard/app/competitors/`
- **Chat Canvas Layout**: From TICKET-001
- **Artifact System**: Extend existing artifact types for competitor-specific
  visualizations

### File Locations

```
apps/v2/app/dashboard/competitors/page.tsx
apps/v2/components/competitors/
├── competitor-chat-canvas.tsx
├── competitor-artifacts.tsx
└── competitive-queries.tsx
apps/v2/lib/competitor-artifact-types.ts
```

### Acceptance Criteria

1. ✅ Create `/v2/dashboard/competitors` page with chat canvas
2. ✅ Auto-load with: "Show me how I compare to my top 3 competitors"
3. ✅ Support competitor comparison queries
4. ✅ Render artifacts: competitor_comparison, market_position_chart,
   competitive_gaps
5. ✅ Integrate with existing competitor data
6. ✅ Suggested queries for competitive analysis
7. ✅ Market positioning visualizations
8. ✅ Competitive intelligence insights

### Dependencies

- TICKET-001 completion
- TICKET-002 completion (for pattern consistency)
- Existing competitor data APIs
- Extended artifact system

### Sample Queries to Support

- "Compare my performance to top 3 competitors"
- "Show me competitor ranking changes this month"
- "Which competitor is gaining the most visibility?"
- "Create a competitive gap analysis"

---

## TICKET-004: Implement Platform Performance Chat Canvas Page

**Status**: `[ ]`

### Description

Create a platform-specific performance analysis page for AI platforms (ChatGPT,
Claude, Gemini, Perplexity) with chat-driven insights and optimization
recommendations.

### Detailed Prompt for LLM Engineer

Build `/v2/dashboard/platforms` page focusing on AI platform performance
analysis. Users should be able to query performance across different AI
platforms, get optimization recommendations, and view platform-specific trends
through natural language.

### Context & Code Snippets

- **Platform Data**: Existing platform performance data in dashboard
- **Chat Canvas**: Use established pattern from previous tickets
- **Platform Types**: ChatGPT, Claude, Gemini, Perplexity, others

### File Locations

```
apps/v2/app/dashboard/platforms/page.tsx
apps/v2/components/platforms/
├── platform-chat-canvas.tsx
├── platform-artifacts.tsx
└── platform-queries.tsx
apps/v2/lib/platform-artifact-types.ts
```

### Acceptance Criteria

1. ✅ Create `/v2/dashboard/platforms` page with chat canvas
2. ✅ Auto-load with: "Show my performance across all AI platforms"
3. ✅ Platform-specific performance breakdowns
4. ✅ Optimization recommendations per platform
5. ✅ Artifacts: platform_performance, platform_trends, optimization_matrix
6. ✅ Cross-platform comparison capabilities
7. ✅ Platform-specific improvement suggestions
8. ✅ Trend analysis and forecasting

### Dependencies

- TICKET-001, TICKET-002, TICKET-003 completion
- Existing platform performance data
- Extended artifact system for platforms

### Sample Queries to Support

- "Show my performance across all AI platforms"
- "Which platform should I focus on improving?"
- "Create a platform comparison chart"
- "Show me ChatGPT vs Claude performance trends"

---

## TICKET-005: Implement AI Insights Chat Canvas Page

**Status**: `[ ]`

### Description

Create an AI-powered insights page that generates actionable recommendations,
identifies patterns, and provides strategic guidance through conversational
interaction.

### Detailed Prompt for LLM Engineer

Develop `/v2/dashboard/insights` page that specializes in AI-generated insights
and recommendations. This page should analyze user data to identify
opportunities, patterns, and provide actionable next steps through natural
language conversation.

### Context & Code Snippets

- **Insights Logic**: Existing insight generation in dashboard
- **Pattern Recognition**: Use existing data analysis capabilities
- **Recommendation Engine**: Build on existing recommendation systems

### File Locations

```
apps/v2/app/dashboard/insights/page.tsx
apps/v2/components/insights/
├── insights-chat-canvas.tsx
├── insights-artifacts.tsx
└── insights-queries.tsx
apps/v2/lib/insights-artifact-types.ts
```

### Acceptance Criteria

1. ✅ Create `/v2/dashboard/insights` page with chat canvas
2. ✅ Auto-load with: "Generate insights and recommendations for improving my
   brand visibility"
3. ✅ AI-powered pattern recognition
4. ✅ Actionable recommendation generation
5. ✅ Artifacts: insight_cards, opportunity_matrix, recommendation_list
6. ✅ Priority-based opportunity identification
7. ✅ Strategic guidance and next steps
8. ✅ Trend analysis and predictions

### Dependencies

- TICKET-001 through TICKET-004 completion
- Existing analytics and insights data
- AI recommendation systems

### Sample Queries to Support

- "What are my biggest opportunities right now?"
- "Analyze my visibility trends and patterns"
- "Generate actionable recommendations"
- "Identify areas where I'm losing ground"

---

## TICKET-006: Implement Custom Reports Chat Canvas Page

**Status**: `[ ]`

### Description

Create a reports generation page that allows users to create custom reports,
export data, and generate stakeholder presentations through conversational
interface.

### Detailed Prompt for LLM Engineer

Build `/v2/dashboard/reports` page for custom report generation. Users should be
able to request specific reports, export data in various formats, and create
executive summaries through natural language queries.

### Context & Code Snippets

- **Existing Reports**: Current report functionality in dashboard
- **Export Capabilities**: Existing data export features
- **Report Templates**: Build on existing report structures

### File Locations

```
apps/v2/app/dashboard/reports/page.tsx
apps/v2/components/reports/
├── reports-chat-canvas.tsx
├── reports-artifacts.tsx
└── reports-queries.tsx
apps/v2/lib/reports-artifact-types.ts
```

### Acceptance Criteria

1. ✅ Create `/v2/dashboard/reports` page with chat canvas
2. ✅ Auto-load with: "Create a comprehensive performance report for this month"
3. ✅ Custom report generation capabilities
4. ✅ Data export functionality
5. ✅ Artifacts: performance_report, executive_summary, detailed_analysis
6. ✅ Multiple report formats and templates
7. ✅ Stakeholder-ready presentations
8. ✅ Scheduled reporting options

### Dependencies

- TICKET-001 through TICKET-005 completion
- Existing reporting infrastructure
- Data export capabilities

### Sample Queries to Support

- "Create a weekly performance report"
- "Show me month-over-month growth analysis"
- "Generate a competitor benchmarking report"
- "Export my data for the executive team"

---

## Implementation Notes

### Testing Strategy

After each ticket completion:

1. Test all chat functionality
2. Verify artifact rendering
3. Check responsive design
4. Validate accessibility
5. Test suggested queries
6. Verify data integration

### Component Reuse Strategy

- Create shared chat canvas layout
- Reusable artifact components
- Common query suggestion patterns
- Shared styling and themes
- Consistent navigation patterns

### Performance Considerations

- Lazy load artifact components
- Optimize chat streaming
- Cache frequent queries
- Minimize bundle size
- Progressive enhancement

---

## TICKET-007: Create Navigation Integration and Layout System

**Status**: `[ ]`

### Description

Implement a unified navigation system that connects all the new v2 chat canvas
pages and provides seamless transitions between different dashboard sections.

### Detailed Prompt for LLM Engineer

Create a navigation system for the v2 pages that maintains the Perplexity-style
minimalist design. Implement a top navigation bar or sidebar that allows users
to switch between Overview, Competitors, Platforms, Insights, and Reports while
maintaining conversation context.

### Context & Code Snippets

- **Current Navigation**: `apps/dashboard/components/navbar.tsx` and
  `apps/dashboard/components/app-sidebar.tsx`
- **Layout System**: `apps/dashboard/components/dashboard-layout.tsx`
- **V2 Pages**: All pages from TICKET-002 through TICKET-006

### File Locations

```
apps/v2/components/layout/
├── v2-navigation.tsx
├── v2-layout.tsx
└── navigation-items.tsx
apps/v2/app/layout.tsx
apps/v2/lib/navigation-config.ts
```

### Acceptance Criteria

1. ✅ Create unified navigation for all v2 pages
2. ✅ Maintain Perplexity-style minimalist design
3. ✅ Smooth transitions between pages
4. ✅ Active page indication
5. ✅ Responsive navigation (mobile/desktop)
6. ✅ Consistent layout across all pages
7. ✅ Context preservation during navigation
8. ✅ Breadcrumb navigation support

### Dependencies

- TICKET-001 through TICKET-006 completion
- `packages/ui` navigation components
- Existing layout patterns

### Technical Requirements

- Use Next.js App Router navigation
- Implement active state management
- Mobile-responsive design
- Keyboard navigation support
- ARIA accessibility labels

---

## TICKET-008: Implement Enhanced Artifact System for Dashboard

**Status**: `[ ]`

### Description

Extend the existing artifact system to support all dashboard-specific
visualizations including scorecards, comparison charts, trend analysis, and
custom reports.

### Detailed Prompt for LLM Engineer

Enhance the current artifact rendering system to support new dashboard artifact
types. Create specialized artifact components for GEO scorecards, competitor
comparisons, platform performance charts, insight cards, and custom reports.
Ensure all artifacts are interactive and follow the design system.

### Context & Code Snippets

- **Current Artifacts**: `apps/dashboard/components/artifacts/`
- **Artifact Store**: `apps/dashboard/stores/artifacts-store.ts`
- **Artifact Types**: `apps/dashboard/types/artifacts.ts`
- **Existing Renderer**:
  `apps/dashboard/components/artifacts/artifact-renderer.tsx`

### File Locations

```
apps/v2/components/artifacts/
├── dashboard-artifact-renderer.tsx
├── geo-scorecard-artifact.tsx
├── competitor-comparison-artifact.tsx
├── platform-performance-artifact.tsx
├── insights-cards-artifact.tsx
├── reports-artifact.tsx
└── artifact-types.ts
apps/v2/lib/dashboard-artifacts.ts
```

### Acceptance Criteria

1. ✅ Extend and reuse existing artifact system for dashboard types
2. ✅ Create GEO scorecard artifact component
3. ✅ Implement competitor comparison artifacts
4. ✅ Build platform performance visualizations
5. ✅ Design insight cards and recommendation lists
6. ✅ Create report generation artifacts
7. ✅ Interactive artifact features (zoom, export, pin, share)
8. ✅ Consistent styling with design system

### Dependencies

- TICKET-001 through TICKET-007 completion
- Existing artifact infrastructure
- `packages/ui` chart components
- Recharts library for visualizations

### Artifact Types to Implement

```typescript
// Dashboard-specific artifact types
export const DASHBOARD_ARTIFACTS = {
	GEO_SCORECARD: "geo_scorecard",
	METRICS_DASHBOARD: "metrics_dashboard",
	TREND_CHART: "trend_chart",
	COMPETITOR_COMPARISON: "competitor_comparison",
	MARKET_POSITION: "market_position_chart",
	PLATFORM_PERFORMANCE: "platform_performance",
	INSIGHT_CARDS: "insight_cards",
	OPPORTUNITY_MATRIX: "opportunity_matrix",
	PERFORMANCE_REPORT: "performance_report",
	EXECUTIVE_SUMMARY: "executive_summary",
} as const;
```

---

## TICKET-009: Implement Data Integration Utilities for Existing APIs

**Status**: `[ ]`

### Description

Create data integration utilities that connect the v2 chat canvas pages to
existing dashboard APIs and format data for artifact generation. This ticket
focuses only on connecting to existing APIs, not creating new ones.

### Detailed Prompt for LLM Engineer

**TASK**: Create data fetching and formatting utilities that connect v2
dashboard pages to existing APIs in `apps/dashboard/app/api/`. Focus on data
transformation and integration utilities only - do NOT create any new API
endpoints.

**STEP-BY-STEP IMPLEMENTATION:**

1. **Create Data Fetching Utilities** (`apps/dashboard/v2/lib/data/`):
   - `dashboard-data.ts` - fetch functions for existing dashboard endpoints
   - `competitor-data.ts` - fetch functions for existing competitor endpoints
   - `platform-data.ts` - fetch functions for existing platform endpoints
   - `data-formatters.ts` - transform API responses for artifact consumption
   - `artifact-data-mapper.ts` - map raw data to artifact-specific formats

2. **Implement Error Handling**:
   - Create `error-handlers.ts` with consistent error handling patterns
   - Add loading states and skeleton components
   - Implement graceful fallbacks for API failures

3. **Add Data Validation**:
   - Create `data-validators.ts` using existing validation patterns
   - Validate API responses before passing to artifacts
   - Type safety for all data transformations

4. **Reference Existing APIs**:
   - Use existing endpoints in `apps/dashboard/app/api/`
   - Copy patterns from `apps/dashboard/lib/` data utilities
   - Maintain consistency with current data fetching approaches

### Context & Code Snippets

**Existing APIs to Connect To:**

- `apps/dashboard/app/api/dashboard/` - Main dashboard data
- `apps/dashboard/app/api/companies/` - Company and competitor data
- `apps/dashboard/app/api/visibility-explorer/` - Platform visibility data
- `apps/dashboard/app/api/brand-monitor/` - Brand monitoring data
- `apps/dashboard/app/api/geo-scan/` - GEO scoring data

**Existing Data Utilities:**

- `apps/dashboard/lib/analyze-common.ts` - Common analysis utilities
- `apps/dashboard/lib/geo-scoring/` - GEO scoring utilities
- `apps/dashboard/lib/services/` - Service layer patterns
- `apps/dashboard/hooks/use-auth.ts` - Authentication patterns for API calls

**Data Formatting Examples:**

- Reference `apps/dashboard/components/brand-monitor/` for data transformation
  patterns
- Use `apps/dashboard/stores/` for state management patterns

### File Locations

```
apps/dashboard/v2/lib/data/
├── dashboard-data.ts
├── competitor-data.ts
├── platform-data.ts
├── data-formatters.ts
├── artifact-data-mapper.ts
├── error-handlers.ts
├── data-validators.ts
└── types.ts
```

### Acceptance Criteria

1. ✅ Connect to ALL existing dashboard API endpoints (no new endpoints created)
2. ✅ Implement data formatting utilities for artifact consumption
3. ✅ Create consistent error handling and fallback mechanisms
4. ✅ Add loading states and skeleton screen support
5. ✅ Implement data validation for all API responses
6. ✅ Ensure type safety throughout data flow
7. ✅ Handle API rate limiting and request throttling
8. ✅ Maintain data integrity and validation
9. ✅ Create reusable data fetching patterns for all v2 pages

### Dependencies

- TICKET-001 through TICKET-008 completion
- Existing dashboard API endpoints (NO new APIs)
- Existing data validation libraries
- Current authentication system
- Existing error handling patterns

### Technical Requirements

- **API Integration**: Use existing endpoints only via fetch/axios
- **Data Validation**: Use existing validation libraries and patterns
- **Error Handling**: Consistent error boundaries and fallbacks
- **Type Safety**: Full TypeScript typing for all data flows
- **Performance**: Implement request caching and debouncing
- **Authentication**: Use existing auth patterns for API calls

---

---

## Implementation Timeline

### Phase 1: Foundation & Testing (Week 1)

- TICKET-001: V2 directory and chat foundation (test with this page before
  proceeding)

### Phase 2: Core Dashboard Pages (Week 2)

- TICKET-002: Dashboard overview page
- TICKET-003: Competitor analysis page

### Phase 3: Platform & Insights Features (Week 3)

- TICKET-004: Platform performance page
- TICKET-005: AI insights page

### Phase 4: Reports & Navigation (Week 4)

- TICKET-006: Custom reports page
- TICKET-007: Navigation integration

### Phase 5: System Integration & Launch (Week 5)

- TICKET-008: Enhanced artifact system
- TICKET-009: Data integration utilities

## Success Metrics

### Technical Metrics

- Page load speed: < 1s (target: 800ms)
- AI response time: < 2s (target: 1.5s)
- Error rate: < 1% (target: 0.5%)
- Streaming response latency: < 500ms to first token

### User Experience Metrics

- Chat query success rate: > 95%
- Artifact rendering success: > 98%
- Mobile responsiveness: 100% compatibility
- Accessibility compliance: WCAG 2.1 AA
- Perplexity-style design implementation: 100% adherence

### Functional Metrics

- All chat functionality working: 100%
- Artifact system integration: 100%
- Responsive design compliance: 100%
- Font and styling implementation: 100%

### Business Metrics

- User engagement: 40% increase in session duration
- Feature adoption: 80% of users try chat interface
- Query volume: 3x increase over baseline
- User satisfaction: 4.5+ rating

## Risk Mitigation

### Technical Risks

1. **Performance Issues**: Implement caching and optimization
2. **Data Integration**: Thorough testing with existing APIs
3. **Browser Compatibility**: Progressive enhancement strategy

### User Experience Risks

1. **Learning Curve**: Comprehensive onboarding flow
2. **Feature Discovery**: Contextual help and tutorials
3. **Accessibility**: WCAG compliance testing

### Project Risks

1. **Timeline Delays**: Phased delivery approach
2. **Resource Constraints**: Clear priority framework
3. **Scope Creep**: Strict ticket adherence

## Next Steps After Completion

1. User testing and feedback collection
2. Performance monitoring and optimization
3. Advanced features (voice input, multi-modal)
4. Cross-session conversation memory
5. Collaborative chat sessions
6. Custom artifact creation tools
7. Integration with external data sources
8. Mobile app development
