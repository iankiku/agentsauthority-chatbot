# 🚀 IMMEDIATE ACTION PLAN - Enhanced Chat Canvas

## ✅ COMPLETED: Founder Review & Strategy Alignment

The harmony_v2_* docs are now **coding-ready** and focused on enhancing the existing chat canvas with comprehensive GEO intelligence tools.

## 🎯 WHAT WE'RE BUILDING (Friday Demo Target)

**Core Value**: Enhanced chat canvas with professional-grade GEO intelligence tools that integrate real-time multi-source data.

**Demo Flow**: User in existing chat asks "Show my brand visibility across AI models" → receives real-time multi-model analysis matrix → professional business intelligence artifact.

## 🏃‍♂️ START HERE - First 4 Hours Today

### 1. Multi-Model Client Setup (2 hours)
**File**: `lib/data-sources/multi-model-client.ts`

```typescript
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export class MultiModelClient {
  async queryAllModels(brandName: string, queries: string[] = [`Tell me about ${brandName}`]) {
    const models = [
      { provider: 'openai', model: openai('gpt-4') },
      { provider: 'anthropic', model: anthropic('claude-3-sonnet-20240229') },
      { provider: 'google', model: google('gemini-1.5-pro') }
    ];

    const results = await Promise.allSettled(
      models.map(async ({ provider, model }) => {
        const { text } = await generateText({
          model,
          prompt: queries[0],
          maxTokens: 500
        });
        
        return {
          model: provider,
          response: text,
          mentions: this.countBrandMentions(text, brandName),
          sentiment: this.analyzeSentiment(text, brandName),
          visibility_score: this.calculateVisibilityScore(text, brandName)
        };
      })
    );

    return results.filter(r => r.status === 'fulfilled').map(r => r.value);
  }

  private countBrandMentions(text: string, brandName: string): number {
    return (text.match(new RegExp(brandName, 'gi')) || []).length;
  }

  private analyzeSentiment(text: string, brandName: string): 'positive' | 'neutral' | 'negative' {
    // Simple implementation - enhance with proper NLP
    const context = text.toLowerCase();
    const positive = ['good', 'great', 'excellent', 'leading'].some(word => context.includes(word));
    const negative = ['bad', 'poor', 'issues', 'problems'].some(word => context.includes(word));
    
    if (positive && !negative) return 'positive';
    if (negative && !positive) return 'negative';
    return 'neutral';
  }

  private calculateVisibilityScore(text: string, brandName: string): number {
    const mentions = this.countBrandMentions(text, brandName);
    const sentiment = this.analyzeSentiment(text, brandName);
    
    let score = Math.min(mentions * 20, 70);
    if (sentiment === 'positive') score += 30;
    else if (sentiment === 'negative') score -= 20;
    
    return Math.max(0, Math.min(100, score));
  }
}
```

### 2. Visibility Scanner Tool (2 hours)
**File**: `lib/ai/tools/visibility-across-models-tool.ts`

```typescript
import { tool } from 'ai';
import { z } from 'zod';
import { MultiModelClient } from '@/lib/data-sources/multi-model-client';

const multiModelClient = new MultiModelClient();

export const visibilityAcrossModelsTool = tool({
  description: "Scan brand visibility across ChatGPT, Claude, Gemini, Perplexity",
  parameters: z.object({
    brandName: z.string(),
    queries: z.array(z.string()).optional().default([]),
    timeframe: z.enum(['day', 'week', 'month']).default('week')
  }),
  execute: async ({ brandName, queries, timeframe }) => {
    const defaultQueries = [`Tell me about ${brandName}`, `What is ${brandName} known for?`];
    const searchQueries = queries.length > 0 ? queries : defaultQueries;
    
    const results = await multiModelClient.queryAllModels(brandName, searchQueries);
    
    return {
      brandName,
      timestamp: new Date().toISOString(),
      timeframe,
      modelResults: results,
      overallVisibility: results.reduce((sum, r) => sum + r.visibility_score, 0) / results.length,
      insights: this.generateInsights(results, brandName),
      recommendations: this.generateRecommendations(results, brandName)
    };
  }
});
```

## 📋 TODAY'S TICKETS (Priority Order)

### Ticket #1: Multi-Model Client ⏱️ 2 hours
- [ ] Create multi-model client for parallel AI queries
- [ ] Test with ChatGPT, Claude, Gemini
- [ ] Implement visibility scoring algorithm

### Ticket #2: Visibility Scanner Tool ⏱️ 2 hours  
- [ ] Build tool for brand visibility analysis
- [ ] Integrate with multi-model client
- [ ] Test tool execution in existing chat

### Ticket #3: Visibility Matrix Artifact ⏱️ 2 hours
- [ ] Create professional visualization component
- [ ] Multi-model comparison heatmap
- [ ] Interactive insights and recommendations

### Ticket #4: Firecrawl Integration ⏱️ 1.5 hours
- [ ] Setup web scraping for brand mentions
- [ ] Test Reddit, HackerNews, Twitter scraping
- [ ] Add sentiment analysis

**END OF DAY TARGET**: Real-time multi-model brand visibility analysis working

## 🎬 FRIDAY DEMO SCRIPT

**Problem** (30s): "Brand visibility in the AI era is complex and fragmented across multiple platforms."

**Multi-Model Solution** (2m): 
1. Stay in existing chat interface
2. Ask: "Show my brand visibility across AI models"
3. Watch real-time queries to ChatGPT, Claude, Gemini
4. Receive professional visibility matrix with insights

**Web Intelligence** (1.5m):
1. Ask: "Monitor my brand mentions this week"
2. See real-time web scraping of Reddit, HackerNews, Twitter
3. Get comprehensive sentiment analysis and trending topics

**Value** (1m): "Professional business intelligence created through conversation - suitable for presentations and strategic decisions."

## 🚨 CRITICAL SUCCESS FACTORS

### ✅ DO THIS
- Build on existing chat interface (no breaking changes)
- Start with multi-model client for real-time AI queries
- Create professional-grade artifact visualizations
- Integrate Firecrawl for real web data
- Focus on business intelligence quality

### ❌ DON'T DO THIS
- Don't create dashboard pages yet (Phase 2)
- Don't build user management or enterprise features
- Don't change existing chat architecture
- Don't over-engineer - focus on demo value
- Don't worry about complex AI model optimization yet

## 📞 NEED HELP? Check These Files

1. **Vision Alignment**: `docs/vision/PRD.md`
2. **Technical Details**: `docs/harmony_v2_technical-docs.md`
3. **All Tickets**: `docs/harmony_v2_implementation-roadmap.md`
4. **Current Architecture**: `package.json`, existing components

## ⚡ QUICK WINS FOR MOTIVATION

After each ticket completion, you should be able to:
- ✅ **Ticket #1**: Navigate to `/dashboard` successfully
- ✅ **Ticket #2**: Type messages and see them in chat interface
- ✅ **Ticket #3**: Get AI responses to questions
- ✅ **Ticket #4**: Ask "Show my GEO score" and get structured response

## 🎯 END OF WEEK GOAL

**Demo-ready conversational dashboard** where users can:
1. Ask questions in natural language
2. Receive visual artifacts (scorecards, charts)
3. Have artifacts persist across sessions
4. Navigate between different dashboard contexts

---

**READY TO START? Begin with Ticket #1 - your Friday demo depends on execution speed!**