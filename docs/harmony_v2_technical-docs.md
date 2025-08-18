# Enhanced Chat Canvas - Technical Implementation Guide

## 🎯 Implementation Overview

Enhance existing chat canvas with comprehensive GEO intelligence tools that integrate real-time data from multiple sources (Firecrawl + multi-model queries) to create professional business intelligence artifacts.

## 📂 File Structure Changes

### New Files to Create

```
lib/
├── ai/
│   └── tools/
│       ├── geo-intelligence-suite.ts    # Core GEO tools
│       ├── multi-model-scanner.ts       # Cross-platform visibility
│       ├── brand-monitor.ts             # Firecrawl-powered monitoring
│       ├── keyword-opportunity.ts       # SEO/GEO keyword analysis
│       ├── competitor-intelligence.ts   # Advanced competitive analysis
│       └── content-optimizer.ts         # AI content recommendations
├── data-sources/
│   ├── firecrawl-client.ts             # Web scraping integration
│   ├── multi-model-client.ts           # AI model query client
│   ├── serper-client.ts                # Search data integration
│   └── data-aggregator.ts              # Smart data combination
├── artifacts/
│   ├── smart-aggregation.ts            # Intelligent artifact evolution
│   ├── artifact-categorizer.ts         # Auto-tagging system
│   └── historical-tracker.ts           # Time-series data management

components/
├── artifacts/
│   ├── geo-artifacts/
│   │   ├── visibility-matrix.tsx       # Multi-model visibility display
│   │   ├── brand-mention-intelligence.tsx # Comprehensive mention analysis
│   │   ├── keyword-opportunity-dashboard.tsx # SEO opportunity visualization
│   │   ├── competitor-intelligence-panel.tsx # Advanced competitive insights
│   │   ├── content-optimization-guide.tsx # AI content recommendations
│   │   └── historical-trend-chart.tsx  # Time-series visualizations
│   └── shared/
│       ├── model-heatmap.tsx           # Cross-model performance heatmap
│       ├── sentiment-analysis-chart.tsx # Sentiment visualization
│       ├── opportunity-matrix.tsx       # Opportunity scoring matrix
│       └── insight-grid.tsx            # Structured insights display

### Files to Extend (No Breaking Changes)
```
lib/ai/index.ts                    # Add new tools to existing system
components/artifacts/artifact.tsx  # Support new artifact types
lib/db/schema.ts                   # Extend artifacts with tags/categories
```

## 🔧 Core Implementation

### 1. Multi-Model Intelligence System

**File**: `lib/data-sources/multi-model-client.ts`

```typescript
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

export interface ModelResult {
  model: string;
  response: string;
  mentions: number;
  context: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  visibility_score: number;
}

export class MultiModelClient {
  async queryAllModels(
    brandName: string, 
    queries: string[] = [`Tell me about ${brandName}`]
  ): Promise<ModelResult[]> {
    const models = [
      { provider: 'openai', model: openai('gpt-4') },
      { provider: 'anthropic', model: anthropic('claude-3-sonnet-20240229') },
      { provider: 'google', model: google('gemini-1.5-pro') }
    ];

    const results = await Promise.allSettled(
      models.map(async ({ provider, model }) => {
        const responses = await Promise.all(
          queries.map(query => this.queryModel(model, query))
        );
        
        return {
          model: provider,
          response: responses[0],
          mentions: this.countBrandMentions(responses.join(' '), brandName),
          context: this.extractContext(responses, brandName),
          sentiment: this.analyzeSentiment(responses.join(' '), brandName),
          visibility_score: this.calculateVisibilityScore(responses, brandName)
        };
      })
    );

    return results
      .filter((result): result is PromiseFulfilledResult<ModelResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }

  private async queryModel(model: any, query: string): Promise<string> {
    const { text } = await generateText({
      model,
      prompt: query,
      maxTokens: 500
    });
    return text;
  }

  private countBrandMentions(text: string, brandName: string): number {
    const regex = new RegExp(brandName, 'gi');
    return (text.match(regex) || []).length;
  }

  private extractContext(responses: string[], brandName: string): string[] {
    // Extract sentences that mention the brand
    return responses
      .join(' ')
      .split(/[.!?]+/)
      .filter(sentence => 
        sentence.toLowerCase().includes(brandName.toLowerCase())
      )
      .slice(0, 3);
  }

  private analyzeSentiment(text: string, brandName: string): 'positive' | 'neutral' | 'negative' {
    // Simple sentiment analysis - would use more sophisticated NLP in production
    const brandContext = this.extractContext([text], brandName).join(' ');
    const positiveWords = ['good', 'great', 'excellent', 'best', 'leading', 'innovative'];
    const negativeWords = ['bad', 'poor', 'worst', 'failed', 'issues', 'problems'];
    
    const positiveCount = positiveWords.filter(word => 
      brandContext.toLowerCase().includes(word)
    ).length;
    const negativeCount = negativeWords.filter(word => 
      brandContext.toLowerCase().includes(word)
    ).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private calculateVisibilityScore(responses: string[], brandName: string): number {
    const totalMentions = this.countBrandMentions(responses.join(' '), brandName);
    const contextRelevance = this.extractContext(responses, brandName).length;
    const sentiment = this.analyzeSentiment(responses.join(' '), brandName);
    
    let score = Math.min(totalMentions * 10 + contextRelevance * 15, 80);
    
    if (sentiment === 'positive') score += 20;
    else if (sentiment === 'negative') score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }
}
```

### 2. Dashboard API Routes

**File**: `app/api/chat/dashboard/[page]/route.ts`

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { geoScoreTool } from '@/lib/ai/tools/geo-score-tool';
import { competitorTool } from '@/lib/ai/tools/competitor-tool';
import { platformTool } from '@/lib/ai/tools/platform-tool';
import { insightTool } from '@/lib/ai/tools/insight-tool';
import { reportTool } from '@/lib/ai/tools/report-tool';
import { dashboardContexts } from '@/lib/dashboard/contexts';

const toolMap = {
  overview: [geoScoreTool, competitorTool],
  competitors: [competitorTool, geoScoreTool],
  platforms: [platformTool, geoScoreTool],
  insights: [insightTool, geoScoreTool],
  reports: [reportTool, geoScoreTool, competitorTool]
};

export async function POST(
  request: Request,
  { params }: { params: { page: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages } = await request.json();
  const page = params.page as keyof typeof toolMap;
  const context = dashboardContexts[page];
  
  if (!context) {
    return new Response('Invalid dashboard page', { status: 400 });
  }

  const result = await streamText({
    model: openai('gpt-4'),
    messages: [
      {
        role: 'system',
        content: context.systemPrompt
      },
      ...messages
    ],
    tools: Object.fromEntries(
      toolMap[page].map(tool => [tool.description, tool])
    ),
    maxTokens: 2048,
  });

  return result.toDataStreamResponse();
}
```

### 3. Dashboard Tools Implementation

**File**: `lib/ai/tools/geo-score-tool.ts`

```typescript
import { tool } from 'ai';
import { z } from 'zod';
import { createArtifact } from '@/lib/artifacts';

export const geoScoreTool = tool({
  description: 'Get current GEO score and performance metrics',
  parameters: z.object({
    timeframe: z.enum(['week', 'month', 'quarter']).optional().default('week')
  }),
  execute: async ({ timeframe }, { userId }) => {
    // Mock data for demo - replace with real API calls later
    const geoData = {
      score: 78,
      change: timeframe === 'week' ? '+5 points' : '+12 points',
      trend: 'improving',
      platforms: [
        { name: 'ChatGPT', score: 82, change: '+3' },
        { name: 'Claude', score: 75, change: '+7' },
        { name: 'Gemini', score: 77, change: '+2' }
      ],
      recommendations: [
        'Increase content quality on Claude platform',
        'Optimize for trending AI topics',
        'Improve brand mention consistency'
      ],
      lastUpdated: new Date().toISOString()
    };

    // Create persistent artifact
    const artifact = await createArtifact({
      userId,
      type: 'geo-score-card',
      title: `GEO Score - ${timeframe}`,
      content: geoData,
      metadata: {
        timeframe,
        generatedAt: new Date().toISOString()
      }
    });

    return {
      type: 'geo-score',
      data: geoData,
      artifact: artifact.id,
      message: `Your current GEO score is ${geoData.score}/100, ${geoData.change} from last ${timeframe}.`
    };
  }
});
```

**File**: `lib/ai/tools/competitor-tool.ts`

```typescript
import { tool } from 'ai';
import { z } from 'zod';
import { createArtifact } from '@/lib/artifacts';

export const competitorTool = tool({
  description: 'Analyze competitive positioning and performance',
  parameters: z.object({
    competitors: z.array(z.string()).optional().default(['TechCorp', 'InnovateLabs']),
    metric: z.enum(['overall', 'platforms', 'content']).optional().default('overall')
  }),
  execute: async ({ competitors, metric }, { userId }) => {
    // Mock competitive data
    const competitiveData = {
      myScore: 78,
      myRank: 2,
      totalCompetitors: competitors.length + 1,
      competitors: competitors.map((name, index) => ({
        name,
        score: 85 - (index * 7),
        rank: index + 1,
        change: `${index % 2 ? '+' : '-'}${Math.floor(Math.random() * 10)}%`
      })),
      insights: [
        'You rank #2 in overall GEO performance',
        'TechCorp leads in content quality',
        'Opportunity to improve on Claude platform'
      ],
      recommendations: [
        'Focus on improving Claude platform presence',
        'Increase content publication frequency',
        'Target TechCorp\'s weak areas on Gemini'
      ]
    };

    const artifact = await createArtifact({
      userId,
      type: 'competitor-chart',
      title: `Competitive Analysis - ${metric}`,
      content: competitiveData,
      metadata: {
        competitors,
        metric,
        generatedAt: new Date().toISOString()
      }
    });

    return {
      type: 'competitive-analysis',
      data: competitiveData,
      artifact: artifact.id,
      message: `You rank #${competitiveData.myRank} out of ${competitiveData.totalCompetitors} competitors with a score of ${competitiveData.myScore}.`
    };
  }
});
```

### 4. Artifact Components

**File**: `components/artifacts/geo-score-card.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface GeoScoreCardProps {
  data: {
    score: number;
    change: string;
    trend: 'improving' | 'declining' | 'stable';
    platforms: Array<{
      name: string;
      score: number;
      change: string;
    }>;
    recommendations: string[];
  };
}

export function GeoScoreCard({ data }: GeoScoreCardProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          GEO Performance Score
          {data.trend === 'improving' ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score */}
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">{data.score}/100</div>
          <div className="text-sm text-gray-600">{data.change}</div>
        </div>

        {/* Platform Breakdown */}
        <div>
          <h4 className="font-semibold mb-3">Platform Performance</h4>
          <div className="space-y-2">
            {data.platforms.map((platform) => (
              <div key={platform.name} className="flex justify-between items-center">
                <span>{platform.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{platform.score}/100</span>
                  <span className="text-sm text-gray-500">{platform.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="font-semibold mb-3">Recommendations</h4>
          <ul className="space-y-1">
            {data.recommendations.map((rec, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-blue-500">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
```

**File**: `components/artifacts/competitor-chart.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CompetitorChartProps {
  data: {
    myScore: number;
    myRank: number;
    competitors: Array<{
      name: string;
      score: number;
      rank: number;
      change: string;
    }>;
    insights: string[];
  };
}

export function CompetitorChart({ data }: CompetitorChartProps) {
  const allCompetitors = [
    { name: 'You', score: data.myScore, rank: data.myRank, change: '0%', isMe: true },
    ...data.competitors.map(c => ({ ...c, isMe: false }))
  ].sort((a, b) => a.rank - b.rank);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Competitive Positioning</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ranking Chart */}
        <div className="space-y-3">
          {allCompetitors.map((competitor) => (
            <div
              key={competitor.name}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                competitor.isMe ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Badge variant={competitor.isMe ? 'default' : 'secondary'}>
                  #{competitor.rank}
                </Badge>
                <span className={competitor.isMe ? 'font-semibold' : ''}>
                  {competitor.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{competitor.score}/100</span>
                <span className="text-sm text-gray-500">{competitor.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Key Insights */}
        <div>
          <h4 className="font-semibold mb-3">Key Insights</h4>
          <ul className="space-y-1">
            {data.insights.map((insight, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-green-500">✓</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5. Database Schema Extension

**File**: `lib/db/schema.ts` (additions)

```typescript
// Add to existing artifacts table
export const artifacts = pgTable('artifacts', {
  // ... existing fields
  dashboardPage: varchar('dashboard_page', { length: 50 }), // 'overview', 'competitors', etc.
  isPinned: boolean('is_pinned').default(false),
  tags: text('tags').array(),
});

// Add dashboard-specific indexes
// CREATE INDEX idx_artifacts_dashboard_page ON artifacts(user_id, dashboard_page);
// CREATE INDEX idx_artifacts_pinned ON artifacts(user_id, is_pinned) WHERE is_pinned = true;
```

### 6. Page Implementation

**File**: `app/(dashboard)/page.tsx`

```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ChatDashboardLayout } from '@/components/dashboard/chat-dashboard-layout';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  return <ChatDashboardLayout page="overview" />;
}
```

## 🗄️ Mock Data Strategy

For the initial demo, all tools will use mock data. This allows us to:
1. Focus on UX and conversation flow
2. Demonstrate full functionality without API dependencies
3. Validate user interaction patterns
4. Build foundation for real data integration

**File**: `lib/dashboard/mock-data.ts`

```typescript
export const mockGeoData = {
  score: 78,
  platforms: [
    { name: 'ChatGPT', score: 82, mentions: 45, change: '+15%' },
    { name: 'Claude', score: 75, mentions: 32, change: '+22%' },
    { name: 'Gemini', score: 77, mentions: 28, change: '+8%' }
  ],
  competitors: [
    { name: 'TechCorp', score: 85, change: '+5%' },
    { name: 'InnovateLabs', score: 71, change: '-2%' }
  ],
  insights: [
    'Your Claude platform performance improved significantly',
    'TechCorp is leading in overall mentions',
    'Opportunity exists in Gemini optimization'
  ]
};
```

## 🧪 Testing Strategy

### Unit Tests
- Tool execution with mock data
- Artifact generation and persistence
- Component rendering with sample data

### Integration Tests
- End-to-end chat flow: question → tool → artifact
- Database artifact persistence
- Cross-page navigation with context preservation

### Manual Testing Checklist
- [ ] Chat interface loads on all dashboard pages
- [ ] Tools execute and return structured data
- [ ] Artifacts render correctly
- [ ] Conversation history persists
- [ ] Mobile responsive behavior
- [ ] Error handling for invalid queries

## 🚀 Deployment Checklist

### Environment Variables
```bash
# Add to .env.local
ENABLE_DASHBOARD_CHAT=true
MOCK_DATA_MODE=true  # Remove when connecting real APIs
```

### Database Migration
```sql
-- Run migration to add new columns
ALTER TABLE artifacts ADD COLUMN dashboard_page VARCHAR(50);
ALTER TABLE artifacts ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;
CREATE INDEX idx_artifacts_dashboard_page ON artifacts(user_id, dashboard_page);
```

### Build Verification
- [ ] TypeScript compilation passes
- [ ] No console errors in development
- [ ] All routes accessible
- [ ] Database queries execute successfully

This technical implementation focuses on minimal changes to existing architecture while delivering maximum user value through conversational dashboard interaction.