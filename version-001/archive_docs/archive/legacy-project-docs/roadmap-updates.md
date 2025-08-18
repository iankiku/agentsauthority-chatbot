# Roadmap Updates: Fragment GEO Suite

_Last Updated: 2025-01-27_ _Status: **Q3/Q4 Planning**_

---

## 🎯 North Star: The Actionable GEO Dashboard

Our goal is to create a suite of modular, high-value tools that empower
marketers to master AI-driven search. We will prioritize features that provide
clear, actionable insights and can be shipped quickly by leveraging our existing
Fragment foundation.

**Core Architecture Principles:**

- **Modular Dashboard System**: Each tool (Brand Monitor, Visibility Explorer,
  etc.) is a separate dashboard with its own URL-driven tabs
- **shadcn/ui Foundation**: All UI components built using shadcn/ui for
  consistency and accessibility
- **Agent-Driven Data**: All data processing handled by Mastra agents in
  `apps/agents-mastra`
- **Real-time Updates**: SSE (Server-Sent Events) for live progress and data
  streaming
- **Responsive Design**: Mobile-first approach with adaptive layouts

---

## 🗺️ Milestone Breakdown

### **Q3 2025: Enhance the Core & Explore Visibility**

This quarter is focused on strengthening our core offering and delivering a
powerful new tool that provides immediate value.

#### **Milestone 1: Enhanced Brand Monitor** 🚧

- **Description**: Add historical tracking and trend analysis to the existing
  Brand Monitor. Users should be able to see how their visibility score changes
  over time.
- **Key Features**:
  - **Historical Data Snapshots**: Store analysis results in
    `brand_analysis_snapshots` table with timestamps
  - **Trend Visualization**: Line charts using shadcn/ui `ChartContainer` with
    Recharts showing 30/60/90 day trends
  - **Competitor Tracking**: Persistent competitor data with historical score
    comparisons
  - **Provider Breakdown**: Individual AI provider performance tracking over
    time
- **Technical Implementation**:
  - New API endpoint: `GET /api/brand-monitor/analyses/[analysisId]/history`
  - Database: Add `brand_analysis_snapshots` table with JSONB fields for
    flexible data storage
  - UI Components: `HistoricalTrendChart`, `CompetitorComparisonTable`,
    `ProviderBreakdownCard`
- **Metric**: Increase user retention by 20%

#### **Milestone 2: Launch Visibility Explorer** 🚨

- **Description**: A new tool that allows users to visualize their brand's share
  of voice across different AI platforms and against competitors.
- **Key Features**:
  - **Share of Voice Dashboard**: Interactive pie/donut charts using shadcn/ui
    chart components
  - **Competitor Visibility Matrix**: Bar charts comparing visibility scores
    across providers
  - **Provider Filtering**: Real-time filtering by AI provider (ChatGPT, Gemini,
    Claude, etc.)
  - **Export Capabilities**: PDF/CSV export of visibility data
- **Technical Implementation**:
  - New dashboard route: `/dashboard/visibility-explorer`
  - API endpoints: `GET /api/visibility-explorer/data`,
    `POST /api/visibility-explorer/filter`
  - UI Components: `ShareOfVoicePieChart`, `CompetitorBarChart`,
    `ProviderFilter`, `VisibilityMetricsCard`
  - Data aggregation from existing `brand_analysis_snapshots` table
- **Metric**: 50% of active users engage with the Visibility Explorer within the
  first month

### **Q4 2025: Deepen Perception & Answer User Questions**

This quarter is about expanding our analytical capabilities to cover sentiment
and user intent, providing a more holistic view of a brand's AI presence.

#### **Milestone 3: Launch Perception Heatmap** 🚨

- **Description**: A visual tool to analyze the sentiment (positive, neutral,
  negative) of AI-generated content mentioning the user's brand and competitors.
- **Key Features**:
  - **Sentiment Heatmap**: Interactive grid visualization using custom shadcn/ui
    components
  - **Topic Clustering**: AI-powered topic extraction and sentiment scoring
  - **Drill-down Analysis**: Click-to-view specific AI responses driving
    sentiment scores
  - **Sentiment Trends**: Time-series analysis of sentiment changes
- **Technical Implementation**:
  - New dashboard route: `/dashboard/perception-heatmap`
  - API endpoints: `POST /api/perception-analyze`, `GET /api/perception/trends`
  - Mastra Agent: `perceptionAnalysisAgent` for sentiment scoring and topic
    extraction
  - UI Components: `SentimentHeatmap`, `TopicClusterCard`,
    `SentimentTrendChart`, `ResponseDetailModal`
  - Database: New `perception_analysis` table for sentiment data storage
- **Metric**: Provide at least 3 actionable sentiment-based insights per
  analysis

#### **Milestone 4: Launch Question Index** 🚨

- **Description**: An SEO-inspired tool that identifies the top questions users
  are asking in a specific industry and shows how well the user's brand is
  positioned to answer them.
- **Key Features**:
  - **Question Discovery**: AI-powered extraction of industry-relevant questions
    from search data
  - **Content Gap Analysis**: Comparison of user's content vs. competitor
    content for question coverage
  - **Answer Quality Scoring**: AI assessment of how well content answers
    specific questions
  - **Content Recommendations**: Actionable suggestions for content creation
- **Technical Implementation**:
  - New dashboard route: `/dashboard/question-index`
  - API endpoints: `POST /api/question-index/analyze`,
    `GET /api/question-index/gaps`
  - Mastra Agent: `questionIndexAgent` for question extraction and content
    analysis
  - UI Components: `QuestionDiscoveryTable`, `ContentGapChart`,
    `AnswerQualityScore`, `ContentRecommendationsCard`
  - Database: New `question_index_analysis` table for question and content data
- **Metric**: Drive a 15% increase in content creation based on Question Index
  recommendations

#### **Milestone 5: Beta Launch Prompt Playground** 🚨

- **Description**: An advanced tool for marketers to simulate how different
  keywords and prompt structures affect AI responses, allowing them to test and
  refine their GEO strategy.
- **Key Features**:
  - **Prompt Simulator**: Real-time testing of prompts across multiple AI
    providers
  - **A/B Testing Interface**: Side-by-side comparison of different prompt
    variations
  - **Performance Tracking**: Save and track performance metrics for optimized
    prompts
  - **Template Library**: Pre-built prompt templates for common GEO scenarios
- **Technical Implementation**:
  - New dashboard route: `/dashboard/prompt-playground`
  - API endpoints: `POST /api/prompt-playground/simulate`,
    `GET /api/prompt-playground/templates`
  - Mastra Agent: `promptSimulationAgent` for multi-provider prompt testing
  - UI Components: `PromptSimulator`, `ABTestComparison`, `PerformanceMetrics`,
    `TemplateLibrary`
  - Database: New `prompt_simulations` table for storing test results and
    templates
- **Metric**: 25% of Pro-tier users create and save at least one prompt
  simulation

---

## 🏗️ Technical Foundation

### **Dashboard Architecture**

- **URL-Driven Navigation**: Each dashboard accessible via
  `/dashboard/[dashboardId]` with tab-based navigation
- **Modular Components**: Reusable shadcn/ui components across all dashboards
- **Real-time Updates**: SSE integration for live data streaming and progress
  updates
- **Responsive Design**: Mobile-first approach with adaptive grid layouts

### **Data Flow Architecture**

1. **User Input** → **Mastra Agent** → **Data Processing** → **Database
   Storage** → **UI Rendering**
2. **Real-time Updates**: SSE events for progress tracking and live data updates
3. **Caching Strategy**: SWR/React Query for efficient data fetching and caching
4. **Error Handling**: Comprehensive error boundaries and user-friendly error
   messages

### **Component Library Standards**

- **shadcn/ui Foundation**: All components built on shadcn/ui for consistency
- **Chart Components**: Recharts integration with shadcn/ui `ChartContainer`
- **Data Tables**: shadcn/ui `Table` components with sorting and filtering
- **Form Components**: shadcn/ui form components with validation
- **Navigation**: shadcn/ui `Tabs` for dashboard navigation

### **API Design Patterns**

- **RESTful Endpoints**: Consistent API design across all dashboard features
- **SSE Integration**: Real-time progress updates for long-running operations
- **Error Handling**: Standardized error responses with user-friendly messages
- **Authentication**: JWT-based authentication with role-based access control

---

## 📊 Success Metrics & KPIs

### **User Engagement**

- **Dashboard Adoption**: 70% of users access at least 2 different dashboards
  within 30 days
- **Feature Usage**: 50% of users engage with advanced features (filtering,
  exports, etc.)
- **Session Duration**: Average session time increases by 25% with new dashboard
  features

### **Technical Performance**

- **Page Load Speed**: Dashboard pages load in under 2 seconds
- **Real-time Updates**: SSE events deliver updates within 500ms
- **Mobile Performance**: 90+ Lighthouse score on mobile devices

### **Business Impact**

- **User Retention**: 20% increase in 30-day retention for users with multiple
  analyses
- **Feature Adoption**: 60% of Pro users utilize advanced features within 60
  days
- **Content Creation**: 15% increase in content creation based on tool
  recommendations
