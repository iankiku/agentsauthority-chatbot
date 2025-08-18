# Enhanced Chat Canvas - GEO Intelligence PRD

## 🎯 Core Vision

Transform the existing chat canvas into a powerful GEO intelligence interface where users can ask natural language questions and receive rich, interactive business intelligence artifacts.

## 🚫 What We're NOT Building (Phase 1)

- Separate dashboard pages (comes in Phase 2/3)
- Complex enterprise features
- Multi-user collaboration
- Custom reporting systems

## ✅ What We ARE Building (Phase 1)

**Core Value**: Enhanced chat canvas with comprehensive GEO tools that create professional-grade business intelligence artifacts.

### Friday Demo Target
User in existing chat interface asks "Show my brand visibility across AI models", receives multi-model comparison chart with real-time data from ChatGPT, Claude, Gemini, and Perplexity.

## 📋 Implementation Requirements

### Phase 1: Enhanced Chat Canvas (2-3 days)

#### 1. Enhanced GEO Tools Suite
Create comprehensive tools for GEO intelligence within existing chat interface:

**File**: `lib/ai/tools/geo-intelligence-suite.ts`

##### Core GEO Tools:
```typescript
// 1. Multi-Model Visibility Scanner
export const visibilityAcrossModelsTool = tool({
  description: "Scan brand visibility across ChatGPT, Claude, Gemini, Perplexity",
  parameters: z.object({
    brandName: z.string(),
    queries: z.array(z.string()).optional(),
    timeframe: z.enum(['day', 'week', 'month']).default('week')
  }),
  execute: async ({ brandName, queries, timeframe }) => {
    // Real-time queries to multiple AI models
    const results = await Promise.all([
      queryModel('openai', brandName, queries),
      queryModel('anthropic', brandName, queries),
      queryModel('google', brandName, queries),
      queryModel('perplexity', brandName, queries)
    ]);
    
    return {
      brandName,
      timestamp: new Date().toISOString(),
      modelResults: results,
      overallVisibility: calculateVisibilityScore(results),
      insights: generateModelInsights(results),
      recommendations: generateOptimizations(results)
    };
  }
});

// 2. Brand Monitor with Real Data
export const brandMonitorTool = tool({
  description: "Monitor brand mentions across web sources using Firecrawl",
  parameters: z.object({
    brandName: z.string(),
    sources: z.array(z.string()).optional(),
    depth: z.enum(['surface', 'deep']).default('surface')
  }),
  execute: async ({ brandName, sources, depth }) => {
    // Use Firecrawl for comprehensive web scraping
    const crawlResults = await firecrawlClient.crawl({
      query: `"${brandName}" AI mentions`,
      sources: sources || ['reddit.com', 'hackernews.com', 'twitter.com'],
      depth: depth === 'deep' ? 3 : 1
    });
    
    return {
      brandName,
      totalMentions: crawlResults.length,
      sentimentAnalysis: analyzeSentiment(crawlResults),
      topSources: getTopSources(crawlResults),
      trendingtopics: extractTrendingTopics(crawlResults),
      competitorMentions: findCompetitorMentions(crawlResults),
      actionableInsights: generateInsights(crawlResults)
    };
  }
});

// 3. Keyword Opportunity Scanner
export const keywordOpportunityTool = tool({
  description: "Find keyword opportunities for AI platform optimization",
  parameters: z.object({
    primaryKeywords: z.array(z.string()),
    industry: z.string(),
    competitorAnalysis: z.boolean().default(true)
  }),
  execute: async ({ primaryKeywords, industry, competitorAnalysis }) => {
    // Advanced keyword research with real data
    const keywordData = await analyzeKeywordOpportunities({
      keywords: primaryKeywords,
      industry,
      includeCompetitors: competitorAnalysis
    });
    
    return {
      primaryKeywords,
      opportunityMatrix: keywordData.opportunities,
      competitiveGaps: keywordData.gaps,
      contentSuggestions: keywordData.contentIdeas,
      platformStrategy: keywordData.platformRecommendations,
      difficultyScores: keywordData.difficulty,
      trafficPotential: keywordData.potential
    };
  }
});
```

#### 2. Professional Artifact Components
Create rich visualizations for GEO intelligence:

**File**: `components/artifacts/geo-artifacts/`

##### Advanced Artifact Types:
```typescript
// Multi-Model Visibility Matrix
export function VisibilityMatrix({ data }: { data: ModelVisibilityData }) {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Brand Visibility Across AI Models</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Heatmap showing visibility scores across models */}
        <ModelHeatmap data={data.modelResults} />
        {/* Performance trends over time */}
        <TrendChart data={data.historicalData} />
        {/* Model-specific insights */}
        <InsightGrid insights={data.insights} />
      </CardContent>
    </Card>
  );
}

// Keyword Opportunity Dashboard
export function KeywordOpportunityDashboard({ data }: { data: KeywordData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <OpportunityMatrix opportunities={data.opportunityMatrix} />
      <CompetitiveGapAnalysis gaps={data.competitiveGaps} />
      <ContentSuggestions suggestions={data.contentSuggestions} />
      <PlatformStrategy strategy={data.platformStrategy} />
    </div>
  );
}

// Brand Mention Intelligence
export function BrandMentionIntelligence({ data }: { data: BrandMentionData }) {
  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Brand Mention Analysis</CardTitle>
        <Badge>{data.totalMentions} mentions found</Badge>
      </CardHeader>
      <CardContent>
        <SentimentAnalysisChart sentiment={data.sentimentAnalysis} />
        <SourceBreakdown sources={data.topSources} />
        <TrendingTopics topics={data.trendingtopics} />
        <CompetitorMentions competitors={data.competitorMentions} />
      </CardContent>
    </Card>
  );
}
```

#### 3. Smart Artifact Evolution
- **File**: `lib/artifacts/smart-aggregation.ts`
- **Logic**: Detect when to update existing artifacts vs create new ones
- **Features**: Historical data accumulation, trend detection, anomaly alerts
- **Success**: Artifacts become smarter over time with more data

### Phase 2: Dashboard Pages & Navigation (Week 2)

#### 1. Artifact Organization Pages
Create pages that display and organize artifacts created in chat:
- `/dashboard` - All artifacts with smart filtering
- `/dashboard/visibility` - Model visibility artifacts
- `/dashboard/mentions` - Brand monitoring artifacts  
- `/dashboard/keywords` - Keyword opportunity artifacts
- `/dashboard/competitive` - Competitive analysis artifacts

#### 2. Bidirectional Navigation
- **From Chat**: Click artifact → "View in Dashboard" → goes to relevant page
- **From Dashboard**: Click "Ask Follow-up" → returns to chat with context
- **Smart Context**: Dashboard preserves chat conversation context

### Phase 3: Advanced Intelligence (Week 3-4)

#### 1. Real-time Data Integration
- **Firecrawl**: Web scraping for brand mentions
- **Multi-Model APIs**: Real-time queries across AI platforms
- **Smart Caching**: Intelligent data refresh strategies
- **Background Updates**: Continuous monitoring and alerts

## 🎮 User Experience Flow

### Enhanced Chat Experience (Phase 1)
1. **Entry**: User lands on existing chat interface (no changes to current flow)
2. **Enhanced Queries**: User asks GEO-specific questions like:
   - "Show my brand visibility across AI models"
   - "Find keyword opportunities in my industry"
   - "Monitor brand mentions this week"
3. **Rich Artifacts**: AI generates professional-grade business intelligence artifacts
4. **Smart Evolution**: Follow-up questions enhance existing artifacts with new data
5. **Professional Output**: Artifacts suitable for business presentations and analysis

### Multi-Model Intelligence Flow
1. **Single Query**: "Check my brand visibility"
2. **Real-time Processing**: Tool queries ChatGPT, Claude, Gemini, Perplexity simultaneously
3. **Comprehensive Results**: Visibility matrix showing performance across all models
4. **Actionable Insights**: Platform-specific optimization recommendations
5. **Historical Context**: Trends and changes over time

### Smart Data Aggregation
1. **First Query**: Creates baseline artifact with current data
2. **Follow-up Queries**: 
   - Same topic → Updates existing artifact with new data
   - Related topic → Links artifacts together
   - New topic → Creates new artifact
3. **Historical Intelligence**: Artifacts accumulate data and show trends
4. **Anomaly Detection**: Alerts when significant changes occur

## 🔧 Technical Implementation

### Current Architecture (Keep)
- Next.js 15 with App Router ✅
- Vercel AI SDK ✅
- Drizzle ORM + PostgreSQL ✅
- Tailwind CSS ✅
- Radix UI components ✅

### New Components Needed
```
components/
├── dashboard/
│   ├── chat-dashboard-layout.tsx    # Main dashboard chat interface
│   ├── dashboard-context-provider.tsx # Page-specific context
│   └── suggested-queries.tsx        # Quick-start queries
├── artifacts/
│   ├── geo-score-card.tsx          # GEO score visualization
│   ├── competitor-chart.tsx        # Competitive analysis
│   ├── platform-performance.tsx    # Platform breakdown
│   └── insight-list.tsx           # Recommendations
```

### Database Extensions
```sql
-- Extend existing artifacts table
ALTER TABLE artifacts ADD COLUMN dashboard_page VARCHAR(50);
ALTER TABLE artifacts ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;

-- Add dashboard-specific indexes
CREATE INDEX idx_artifacts_dashboard_page ON artifacts(user_id, dashboard_page);
```

## 📊 Success Metrics (Friday Demo)

### Must Have
- [ ] User can ask "Show my GEO score" and get visual response
- [ ] Artifacts save and persist between sessions  
- [ ] Chat interface works on desktop and mobile
- [ ] Dashboard navigation maintains chat experience

### Nice to Have
- [ ] Multiple artifact types (scorecards, charts, lists)
- [ ] Page-specific suggested queries
- [ ] Export functionality (PDF/image)
- [ ] Pin important artifacts

## ⚠️ Constraints & Decisions

### Data Strategy
**Decision**: Use mock/sample data for demo
**Rationale**: Real API integration can wait until core experience is validated

### Design System
**Decision**: Keep existing Tailwind + Radix components
**Rationale**: Focus on functionality over visual polish for initial demo

### Scope Boundaries
**Out of Scope for Week 1**:
- Real-time data APIs
- Complex analytics
- Enterprise features
- Mobile app
- Multi-user collaboration

## 🗓️ 3-Day Implementation Plan

### Day 1: Foundation
- [ ] Set up chat interface on `/dashboard` route
- [ ] Create basic GEO score tool with mock data
- [ ] Implement artifact rendering system
- [ ] Test end-to-end: question → tool → artifact

### Day 2: Enhancement  
- [ ] Add competitor analysis tool
- [ ] Create visual artifact components
- [ ] Implement conversation persistence
- [ ] Add suggested queries and onboarding

### Day 3: Polish
- [ ] Mobile responsive testing
- [ ] Error handling and loading states
- [ ] Dashboard navigation integration
- [ ] Demo preparation and edge case fixes

## 🎬 Friday Demo Script

1. **Show current problem**: "Traditional dashboards require clicking through multiple pages"
2. **Introduce solution**: "Now you can just ask questions in natural language"
3. **Demo core flow**: Type "Show my GEO score" → see instant visualization
4. **Show persistence**: Navigate away and back, artifacts still there
5. **Show different page**: Go to competitors page, ask competitive question
6. **Value prop**: "Every question becomes permanent business intelligence"

This PRD is focused on delivering immediate, demoable value that aligns with our vision of transforming dashboard interaction through conversation.