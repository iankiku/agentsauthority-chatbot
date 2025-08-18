# Product Requirements: Enhanced Brand Monitor & Visibility Explorer

_Last Updated: 2025-01-27_ _Status: **MVP Implementation Complete**_

---

## 1. Overview

This document outlines the requirements for the MVP of the Fragment suite, which
combines the **Brand Monitor** (continuous monitoring) with the **Visibility
Explorer** (one-time analysis) tool. This MVP provides users with comprehensive
and actionable insights into their brand's performance in AI-driven search
engines.

**🎯 Core System Distinctions:**

### **Brand Monitor** (Continuous Monitoring)

- **Purpose**: Ongoing brand monitoring across multiple data points
- **Function**: Tracks improvements, alerts on issues, generates scheduled
  reports
- **Timing**: Automated intervals with real-time alerts
- **Output**: Historical trends, alerts, scheduled reports, improvement tracking
- **Status**: ✅ **IMPLEMENTED** - Full page and API endpoints available

### **Visibility Explorer** (One-Time Analysis)

- **Purpose**: One-time AI search visibility analysis and competitor comparison
- **Function**: Checks how you appear in AI search results vs competitors
- **Timing**: On-demand analysis with immediate results
- **Output**: Score, recommendations, actionable fixes, competitor insights
- **Status**: 🚧 **PARTIALLY IMPLEMENTED** - API endpoints exist, frontend page
  needed

### **Action Implementation System** (New)

- **Purpose**: Step-by-step guides for implementing recommendations
- **Function**: Provides actionable steps, progress tracking, improvement
  measurement
- **Timing**: Post-analysis implementation workflow
- **Output**: Implementation guides, progress tracking, success measurement
- **Status**: 🚨 **PENDING** - Not yet implemented

**Key Technical Decisions:**

- **shadcn/ui Components**: All UI built using shadcn/ui for consistency and
  accessibility
- **Mastra Agent Integration**: Data processing handled by agents in
  `apps/agents`
- **SSE for Real-time Updates**: Server-Sent Events for live progress and data
  streaming
- **URL-Driven Navigation**: Dashboard tabs accessible via query parameters or
  dynamic routes
- **Responsive Design**: Mobile-first approach with adaptive grid layouts
- **Authentication Bypass**: MVP demo mode with no authentication restrictions
- **Chat-Centric UI**: Primary interaction model with inline AI artifacts

---

## 2. User Stories

### **Enhanced Brand Monitor** ✅ **IMPLEMENTED**

- **As a Marketer**, I want to track my brand's AI visibility score over time so
  that I can measure the impact of my optimization efforts.
- **As a Brand Manager**, I want to see historical competitor data and trends so
  that I can identify long-term competitive threats and opportunities.
- **As an SEO Specialist**, I want to filter visibility data by different AI
  providers (e.g., ChatGPT vs. Gemini) so that I can tailor my strategies for
  each platform.
- **As a Content Strategist**, I want to understand which of my competitors are
  most visible on AI platforms so that I can analyze their content and improve
  my own.

### **Visibility Explorer** 🚧 **API READY, FRONTEND NEEDED**

- **As a Marketing Director**, I want to visualize my brand's share of voice
  compared to competitors so that I can understand our market position.
- **As a Digital Marketing Manager**, I want to export visibility data for
  presentations and reports so that I can share insights with stakeholders.
- **As a Brand Analyst**, I want to drill down into specific AI provider data so
  that I can optimize for the most important platforms for my industry.
- **As a Marketing Manager**, I want to get immediate AI search visibility
  analysis so that I can quickly assess my current position and get actionable
  recommendations.

### **Action Implementation System** 🚨 **PENDING**

- **As a Marketing Specialist**, I want step-by-step guides for implementing
  recommendations so that I can take immediate action on insights.
- **As a Brand Manager**, I want to track progress on implemented actions so
  that I can measure the impact of changes.
- **As a Marketing Director**, I want to see which recommendations have been
  implemented and their results so that I can prioritize future actions.

---

## 3. Core Features

### 3.1. Enhanced Brand Monitor ✅ **IMPLEMENTED**

#### **Historical Tracking & Analytics**

- **Data Persistence**: Each brand analysis automatically saved to
  `brand_analysis_snapshots` table
- **Trend Visualization**: Line charts showing visibility score trends over
  30/60/90 days
- **Competitor Benchmarking**: Historical competitor data with score comparisons
- **Provider Performance**: Individual AI provider score tracking over time

#### **UI Components Implemented**

- ✅ `HistoricalTrendChart`: Line chart using shadcn/ui `ChartContainer` with
  Recharts
- ✅ `CompetitorComparisonTable`: Data table with historical competitor scores
- ✅ `ProviderBreakdownCard`: Card showing individual provider performance
- ✅ `AnalysisSnapshotCard`: Card displaying past analysis results
- ✅ `DateRangeFilter`: Filter component for selecting historical time periods

#### **API Integration** ✅ **COMPLETE**

- **Existing Endpoints**: Leverage current `/api/brand-monitor/analyze`,
  `/api/brand-monitor/scrape`
- **Historical Endpoints**:
  - ✅ `GET /api/brand-monitor/analyses/[analysisId]/history` - Fetch historical
    data
  - ✅ `GET /api/brand-monitor/analyses/[analysisId]/trends` - Get trend data
    for charts
  - ✅ `POST /api/brand-monitor/analyses/[analysisId]/export` - Export analysis
    data

### 3.2. Visibility Explorer 🚧 **API READY, FRONTEND NEEDED**

#### **Share of Voice Analysis**

- **Interactive Charts**: Pie/donut charts showing brand share of voice vs.
  competitors
- **Real-time Filtering**: Filter by AI provider, date range, or competitor set
- **Export Capabilities**: PDF/CSV export of visibility data and charts
- **Drill-down Views**: Click-to-view detailed competitor analysis
- **Immediate Analysis**: One-time AI search visibility assessment with instant
  results

#### **UI Components Required** 🚨 **MISSING**

- `ShareOfVoicePieChart`: Pie chart using shadcn/ui chart components
- `CompetitorBarChart`: Bar chart comparing visibility scores
- `ProviderFilter`: Dropdown filter for AI providers
- `VisibilityMetricsCard`: Card showing key metrics (total visibility, rank,
  etc.)
- `ExportButton`: Button for exporting data in various formats
- `CompetitorDetailModal`: Modal for detailed competitor analysis
- `VisibilityAnalysisForm`: Form for initiating one-time analysis

#### **API Integration** ✅ **COMPLETE**

- **Existing Endpoints**:
  - ✅ `GET /api/visibility-explorer/data` - Fetch aggregated visibility data
  - ✅ `POST /api/visibility-explorer/filter` - Apply filters to data
  - ✅ `GET /api/visibility-explorer/export` - Export filtered data
  - ✅ `GET /api/visibility-explorer/competitors/[id]` - Get detailed competitor
    data

### 3.3. Action Implementation System 🚨 **PENDING**

#### **Step-by-Step Implementation Guides**

- **Recommendation Cards**: Display actionable recommendations from analysis
- **Implementation Steps**: Detailed step-by-step guides for each recommendation
- **Progress Tracking**: Track completion status of implemented actions
- **Impact Measurement**: Measure improvements after action implementation
- **Success Metrics**: Track key performance indicators post-implementation

#### **UI Components Required** 🚨 **MISSING**

- `RecommendationCard`: Card displaying actionable recommendations
- `ImplementationSteps`: Step-by-step guide component
- `ProgressTracker`: Progress tracking component
- `ImpactMetrics`: Metrics showing post-implementation improvements
- `ActionDashboard`: Dashboard for managing implementation progress

#### **API Integration** 🚨 **MISSING**

- **New Endpoints Required**:
  - `GET /api/actions/recommendations` - Fetch recommendations from analysis
  - `POST /api/actions/[actionId]/start` - Start implementation of action
  - `PUT /api/actions/[actionId]/progress` - Update implementation progress
  - `GET /api/actions/[actionId]/impact` - Get impact metrics for completed
    action

---

## 4. User Journey Flow

### 4.1. Current MVP User Journey ✅ **IMPLEMENTED**

```
1. User accesses /chat (main entry point)
2. User types: "Analyze my brand visibility"
3. Chat interface processes request via /api/chat
4. AI generates analysis with inline artifacts (charts, tables, score cards)
5. User can navigate to /brand-monitor for detailed monitoring
6. User can access /dashboard for overview
```

### 4.2. Enhanced User Journey 🚧 **NEEDS IMPLEMENTATION**

```
1. User accesses /chat (main entry point)
2. User types: "Analyze my visibility" → Redirects to /visibility-explorer
3. User types: "Monitor my brand" → Redirects to /brand-monitor
4. User types: "Show recommendations" → Redirects to /actions
5. Visibility Explorer provides one-time analysis with immediate results
6. Brand Monitor provides continuous monitoring and historical trends
7. Action Implementation provides step-by-step guides for recommendations
```

### 4.3. Navigation Structure

#### **Current Navigation** ✅ **IMPLEMENTED**

- `/chat` - Main chat interface with AI artifacts
- `/dashboard` - Overview dashboard
- `/brand-monitor` - Brand monitoring interface
- `/login`, `/register` - Authentication (bypassed for MVP)

#### **Required Navigation** 🚨 **MISSING**

- `/visibility-explorer` - One-time visibility analysis
- `/actions` - Action implementation dashboard
- `/actions/[actionId]` - Individual action implementation guide

---

## 5. Data Flow & Architecture

### 5.1. Enhanced Brand Monitor Data Flow ✅ **IMPLEMENTED**

1. **Analysis Trigger**: User initiates brand analysis via existing
   `/api/brand-monitor/analyze` endpoint
2. **Real-time Progress**: SSE events provide live updates on analysis progress
3. **Data Storage**: Analysis results automatically saved to
   `brand_analysis_snapshots` table
4. **Historical Retrieval**: Frontend fetches historical data via new API
   endpoints
5. **UI Rendering**: Components consume data via SWR/React Query hooks

### 5.2. Visibility Explorer Data Flow 🚧 **API READY**

1. **Data Aggregation**: Backend aggregates data from `brand_analysis_snapshots`
   table
2. **Filter Processing**: User filters applied to aggregated data
3. **Chart Generation**: Processed data formatted for chart components
4. **Real-time Updates**: SSE events for live data updates during analysis
5. **Export Generation**: Server-side PDF/CSV generation for filtered data

### 5.3. Action Implementation Data Flow 🚨 **PENDING**

1. **Recommendation Generation**: AI generates actionable recommendations from
   analysis
2. **Implementation Tracking**: User progress tracked through implementation
   steps
3. **Impact Measurement**: Post-implementation metrics collected and analyzed
4. **Success Reporting**: Results and improvements reported back to user

### 5.4. Database Schema Changes

#### **Existing Table: `brand_analysis_snapshots`** ✅ **IMPLEMENTED**

```sql
CREATE TABLE brand_analysis_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    analysis_id UUID NOT NULL REFERENCES brand_analyses(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    visibility_score NUMERIC(5, 2) NOT NULL,
    share_of_voice NUMERIC(5, 2) NOT NULL,
    competitor_data JSONB NOT NULL, -- Array of competitor objects
    provider_breakdown JSONB NOT NULL, -- Object with provider scores
    analysis_metadata JSONB -- Additional analysis metadata
);
```

#### **New Table: `action_implementations`** 🚨 **PENDING**

```sql
CREATE TABLE action_implementations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    analysis_id UUID NOT NULL REFERENCES brand_analyses(id),
    recommendation_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, failed
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    progress_percentage INTEGER DEFAULT 0,
    implementation_steps JSONB NOT NULL, -- Array of step objects
    impact_metrics JSONB, -- Post-implementation metrics
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_action_implementations_user_id ON action_implementations(user_id);
CREATE INDEX idx_action_implementations_status ON action_implementations(status);
CREATE INDEX idx_action_implementations_analysis_id ON action_implementations(analysis_id);
```

### 5.5. API Response Formats

#### **Historical Data Response** ✅ **IMPLEMENTED**

```typescript
interface HistoricalDataResponse {
	snapshots: Array<{
		id: string;
		createdAt: string;
		visibilityScore: number;
		shareOfVoice: number;
		competitorData: CompetitorData[];
		providerBreakdown: Record<string, number>;
	}>;
	trends: {
		visibilityTrend: Array<{ date: string; score: number }>;
		shareOfVoiceTrend: Array<{ date: string; percentage: number }>;
	};
}
```

#### **Visibility Explorer Data Response** ✅ **IMPLEMENTED**

```typescript
interface VisibilityExplorerData {
	shareOfVoice: Array<{
		name: string;
		value: number;
		isOwn: boolean;
	}>;
	competitorScores: Array<{
		name: string;
		score: number;
		rank: number;
		isOwn: boolean;
	}>;
	providerBreakdown: Record<
		string,
		{
			ownScore: number;
			competitorScores: Array<{ name: string; score: number }>;
		}
	>;
}
```

#### **Action Implementation Response** 🚨 **PENDING**

```typescript
interface ActionImplementationResponse {
	recommendations: Array<{
		id: string;
		title: string;
		description: string;
		priority: "high" | "medium" | "low";
		estimatedImpact: number;
		implementationSteps: Array<{
			step: number;
			title: string;
			description: string;
			estimatedTime: string;
			completed: boolean;
		}>;
		status: "pending" | "in_progress" | "completed" | "failed";
		progressPercentage: number;
		impactMetrics?: {
			visibilityScoreChange: number;
			shareOfVoiceChange: number;
			rankingImprovement: number;
		};
	}>;
}
```

---

## 6. UI/UX Specifications

### 6.1. Dashboard Layout Structure ✅ **IMPLEMENTED**

#### **Main Dashboard Shell**

```tsx
// Layout structure for all dashboards
<DashboardLayout>
	<DashboardHeader>
		<DashboardTitle />
		<DateRangeFilter />
		<ExportButton />
	</DashboardHeader>
	<DashboardTabs>
		<TabList>
			<Tab value="overview">Overview</Tab>
			<Tab value="trends">Trends</Tab>
			<Tab value="competitors">Competitors</Tab>
			<Tab value="providers">Providers</Tab>
		</TabList>
		<TabContent value="overview">
			<OverviewGrid />
		</TabContent>
		{/* Other tab contents */}
	</DashboardTabs>
</DashboardLayout>
```

### 6.2. Component Specifications

#### **Chart Components** ✅ **IMPLEMENTED**

- **ChartContainer**: Use shadcn/ui `ChartContainer` for all charts
- **Responsive Design**: Charts adapt to container size
- **Interactive Elements**: Tooltips, hover states, click handlers
- **Accessibility**: ARIA labels and keyboard navigation support

#### **Data Tables** ✅ **IMPLEMENTED**

- **Sorting**: Client-side sorting for all columns
- **Filtering**: Real-time filtering with search input
- **Pagination**: Server-side pagination for large datasets
- **Export**: CSV export functionality for table data

#### **Filter Components** ✅ **IMPLEMENTED**

- **Provider Filter**: Multi-select dropdown for AI providers
- **Date Range**: Date picker with preset ranges (7d, 30d, 90d)
- **Competitor Filter**: Searchable dropdown for competitor selection
- **Real-time Updates**: Filters trigger immediate data updates

#### **New Components Required** 🚨 **MISSING**

- **Visibility Explorer Components**: Pie charts, bar charts, analysis forms
- **Action Implementation Components**: Recommendation cards, progress trackers,
  step guides
- **Navigation Components**: Enhanced navigation between different analysis
  modes

---

## 7. Technical Implementation Details

### 7.1. Frontend Architecture ✅ **IMPLEMENTED**

#### **Component Structure**

```
apps/fragment/components/
├── dashboards/
│   ├── brand-monitor/ ✅ **IMPLEMENTED**
│   │   ├── HistoricalTrendChart.tsx
│   │   ├── CompetitorComparisonTable.tsx
│   │   ├── ProviderBreakdownCard.tsx
│   │   └── AnalysisSnapshotCard.tsx
│   └── visibility-explorer/ 🚨 **MISSING**
│       ├── ShareOfVoicePieChart.tsx
│       ├── CompetitorBarChart.tsx
│       ├── ProviderFilter.tsx
│       └── VisibilityMetricsCard.tsx
├── actions/ 🚨 **MISSING**
│   ├── RecommendationCard.tsx
│   ├── ImplementationSteps.tsx
│   ├── ProgressTracker.tsx
│   └── ImpactMetrics.tsx
├── shared/
│   ├── DateRangeFilter.tsx ✅ **IMPLEMENTED**
│   ├── ExportButton.tsx ✅ **IMPLEMENTED**
│   └── DashboardLayout.tsx ✅ **IMPLEMENTED**
```

#### **Data Fetching Strategy** ✅ **IMPLEMENTED**

- **SWR/React Query**: For data fetching and caching
- **Optimistic Updates**: For immediate UI feedback
- **Error Boundaries**: Comprehensive error handling
- **Loading States**: Skeleton components during data loading

### 7.2. Backend Architecture ✅ **IMPLEMENTED**

#### **API Route Structure**

```
apps/fragment/app/api/
├── brand-monitor/ ✅ **IMPLEMENTED**
│   ├── analyses/
│   │   ├── [analysisId]/
│   │   │   ├── history/
│   │   │   │   └── route.ts
│   │   │   └── trends/
│   │   │       └── route.ts
│   │   └── route.ts
│   └── analyze/
│       └── route.ts
├── visibility-explorer/ ✅ **IMPLEMENTED**
│   ├── data/
│   │   └── route.ts
│   ├── filter/
│   │   └── route.ts
│   └── export/
│       └── route.ts
└── actions/ 🚨 **MISSING**
    ├── recommendations/
    │   └── route.ts
    └── [actionId]/
        ├── start/
        │   └── route.ts
        ├── progress/
        │   └── route.ts
        └── impact/
            └── route.ts
```

#### **Mastra Agent Integration** ✅ **IMPLEMENTED**

- **Data Processing**: All analysis logic handled by Mastra agents
- **Real-time Updates**: SSE events from agent processing
- **Error Handling**: Agent-level error handling and retry logic
- **Scalability**: Agent-based architecture for horizontal scaling

---

## 8. Implementation Status & Next Steps

### 8.1. Current MVP Status: **95% Complete**

#### **✅ Completed Features**

- **Brand Monitor**: Full implementation with page and API endpoints
- **Chat Interface**: Main entry point with AI artifact rendering
- **Authentication**: Bypassed for MVP demo
- **UI Components**: shadcn/ui components implemented
- **API Endpoints**: All brand monitor and visibility explorer APIs ready
- **Database Schema**: Core tables implemented
- **Responsive Design**: Mobile-first approach implemented

#### **🚧 Partially Complete**

- **Visibility Explorer**: API endpoints ready, frontend page missing
- **User Journey**: Basic flow implemented, enhanced navigation needed

#### **🚨 Missing Features**

- **Visibility Explorer Frontend**: Complete page implementation
- **Action Implementation System**: Full feature set
- **Enhanced Navigation**: Seamless flow between different analysis modes

### 8.2. Priority Implementation Order

#### **Phase 1: Complete MVP (Immediate)**

1. **Create Visibility Explorer Page** (`/visibility-explorer`)
   - Implement share of voice pie chart
   - Add competitor comparison bar chart
   - Create analysis form for one-time analysis
   - Add export functionality

2. **Enhance User Journey Navigation**
   - Update chat interface to redirect to appropriate pages
   - Add navigation between different analysis modes
   - Implement seamless user flow

#### **Phase 2: Action Implementation (Next Sprint)**

1. **Create Action Implementation System**
   - Build recommendation cards
   - Implement step-by-step guides
   - Add progress tracking
   - Create impact measurement

2. **Add Database Schema**
   - Create `action_implementations` table
   - Add necessary indexes and relationships

#### **Phase 3: Advanced Features (Future)**

1. **Ads Monitor**: Monitor advertising performance
2. **Competitor Monitor**: Enhanced competitor tracking
3. **Advanced Analytics**: Machine learning insights
4. **Integration APIs**: Third-party tool connections

### 8.3. Success Metrics

#### **MVP Completion Metrics**

- **Feature Completeness**: 100% of core features implemented
- **User Journey Completeness**: Seamless flow between all analysis modes
- **API Completeness**: All endpoints functional and tested
- **UI Completeness**: All pages accessible and functional

#### **User Engagement Metrics**

- **Dashboard Adoption**: 70% of users access enhanced Brand Monitor within 30
  days
- **Feature Usage**: 50% of users engage with Visibility Explorer within first
  month
- **Session Duration**: 25% increase in average session time
- **Return Usage**: 60% of users return within 7 days of first analysis

#### **Technical Performance Metrics**

- **Page Load Speed**: Dashboard pages load in under 2 seconds
- **Real-time Updates**: SSE events deliver updates within 500ms
- **Mobile Performance**: 90+ Lighthouse score on mobile devices
- **API Response Time**: 95% of API calls respond within 1 second

---

## 9. Risk Mitigation

### 9.1. Technical Risks

- **Performance**: Implement data pagination and lazy loading for large datasets
- **Scalability**: Use agent-based architecture for horizontal scaling
- **Data Accuracy**: Implement validation and error handling for AI provider
  responses
- **Mobile Experience**: Extensive mobile testing and responsive design

### 9.2. Business Risks

- **User Adoption**: Provide clear onboarding and feature discovery
- **Data Quality**: Implement data validation and user feedback mechanisms
- **Competitive Pressure**: Focus on unique features and superior UX
- **Market Changes**: Maintain flexibility in AI provider integration

---

## 10. Future Considerations

### 10.1. Scalability Planning

- **Multi-tenant Architecture**: Prepare for enterprise customers
- **API Rate Limiting**: Implement sophisticated rate limiting strategies
- **Data Archiving**: Plan for long-term data storage and retrieval
- **Internationalization**: Prepare for multi-language support

### 10.2. Feature Expansion

- **Advanced Analytics**: Machine learning-powered insights
- **Integration APIs**: Third-party tool integrations
- **White-label Solutions**: Customizable dashboards for agencies
- **Mobile App**: Native mobile application development
- **Ads Monitor**: Advertising performance tracking
- **Competitor Monitor**: Enhanced competitor analysis and monitoring
