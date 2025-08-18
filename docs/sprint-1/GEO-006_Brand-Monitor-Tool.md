# GEO-006: Brand Monitor Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Blocker) **Story Points**: 2
**Estimated Time**: 2 hours **Assignee**: [Developer Name] **Sprint**: Sprint 1,
Day 2 **Dependencies**: GEO-005 (Firecrawl Client Setup)

## 🎯 User Story

As a **marketing professional**, I want to **monitor my brand mentions across
web sources through natural language queries** so that I can **understand public
sentiment and track trending topics related to my brand**.

## 📝 Description

Create a Vercel AI SDK tool that integrates with the Firecrawl client to provide
comprehensive brand monitoring across web sources. This tool will enable users
to track brand mentions, analyze sentiment, and identify trending topics through
conversational queries.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Tool integrates with Vercel AI SDK tool() function
- [ ] **AC2**: Accepts brand name as required parameter
- [ ] **AC3**: Accepts optional sources array (Reddit, HackerNews, Twitter)
- [ ] **AC4**: Accepts optional timeframe parameter (day/week/month)
- [ ] **AC5**: Uses FirecrawlClient to scrape web sources
- [ ] **AC6**: Returns comprehensive brand mention analysis
- [ ] **AC7**: Provides sentiment breakdown across sources
- [ ] **AC8**: Identifies trending topics related to brand
- [ ] **AC9**: Handles edge cases (no mentions, scraping failures)

### Data Analysis Requirements

- [ ] **AC10**: Aggregates mentions across all sources
- [ ] **AC11**: Calculates overall sentiment distribution
- [ ] **AC12**: Ranks sources by mention volume and engagement
- [ ] **AC13**: Extracts top trending topics/themes
- [ ] **AC14**: Identifies potential competitor mentions
- [ ] **AC15**: Provides source credibility assessment

### Integration Requirements

- [ ] **AC16**: Works seamlessly with existing chat interface
- [ ] **AC17**: Tool description is discoverable and clear
- [ ] **AC18**: Parameter validation using Zod schemas
- [ ] **AC19**: Error responses are user-friendly
- [ ] **AC20**: Response format supports artifact generation

### Performance Requirements

- [ ] **AC21**: Tool execution completes within 45 seconds
- [ ] **AC22**: Handles multiple concurrent requests
- [ ] **AC23**: Memory usage optimized for large result sets
- [ ] **AC24**: Response payload size reasonable (<100KB)

## 🛠️ Technical Implementation

### File Structure

```
lib/
├── ai/
│   └── tools/
│       ├── brand-monitor-tool.ts           # Main tool implementation
│       ├── brand-monitor-types.ts          # Tool-specific types
│       └── brand-monitor-utils.ts          # Helper functions
├── __tests__/
│   └── brand-monitor-tool.test.ts          # Unit tests
```

### Tool Implementation

```typescript
export const brandMonitorTool = tool({
	description:
		"Monitor brand mentions across web sources (Reddit, HackerNews, Twitter) with sentiment analysis and trending topics",
	parameters: z.object({
		brandName: z.string().min(1).max(100),
		sources: z
			.array(z.enum(["reddit", "hackernews", "twitter"]))
			.optional()
			.default(["reddit", "hackernews"]),
		timeframe: z.enum(["day", "week", "month"]).default("week"),
		includeCompetitors: z.boolean().default(false),
		minEngagement: z.number().optional().default(1),
	}),
	execute: async ({
		brandName,
		sources,
		timeframe,
		includeCompetitors,
		minEngagement,
	}) => {
		const firecrawlClient = new FirecrawlClient();

		try {
			// Crawl brand mentions across sources
			const crawlResults = await firecrawlClient.crawlBrandMentions(
				brandName,
				sources,
				{ timeframe, minEngagement }
			);

			// Process and analyze results
			const analysis = await analyzeBrandMentions(crawlResults, brandName);

			// Include competitor analysis if requested
			let competitorMentions = [];
			if (includeCompetitors) {
				competitorMentions = await findCompetitorMentions(
					crawlResults,
					brandName
				);
			}

			return {
				brandName,
				timeframe,
				timestamp: new Date().toISOString(),
				totalMentions: crawlResults.length,
				sources: sources,
				sentimentAnalysis: analysis.sentiment,
				sourceBreakdown: analysis.sourceBreakdown,
				trendingTopics: analysis.trendingTopics,
				topMentions: analysis.topMentions,
				competitorMentions,
				insights: generateBrandInsights(analysis, brandName),
				recommendations: generateActionableRecommendations(analysis, brandName),
				metadata: {
					executionTime: Date.now() - startTime,
					sourcesScraped: sources.length,
					category: "brand-monitoring",
				},
			};
		} catch (error) {
			throw new Error(`Brand monitoring failed: ${error.message}`);
		}
	},
});
```

### Analysis Functions

```typescript
async function analyzeBrandMentions(
	crawlResults: BrandMentionResult[],
	brandName: string
): Promise<BrandAnalysis> {
	const analysis = {
		sentiment: calculateSentimentDistribution(crawlResults),
		sourceBreakdown: analyzeSourcePerformance(crawlResults),
		trendingTopics: extractTrendingTopics(crawlResults, brandName),
		topMentions: rankMentionsByEngagement(crawlResults),
	};

	return analysis;
}

function calculateSentimentDistribution(
	results: BrandMentionResult[]
): SentimentDistribution {
	const sentiments = results.map((r) => r.sentiment.overall);

	return {
		positive: sentiments.filter((s) => s === "positive").length,
		neutral: sentiments.filter((s) => s === "neutral").length,
		negative: sentiments.filter((s) => s === "negative").length,
		totalMentions: sentiments.length,
		overallTrend: determineOverallSentiment(sentiments),
	};
}

function analyzeSourcePerformance(
	results: BrandMentionResult[]
): SourceBreakdown[] {
	const sourceGroups = groupBy(results, "source");

	return Object.entries(sourceGroups).map(([source, mentions]) => ({
		source: source as WebSource,
		mentionCount: mentions.length,
		averageEngagement: calculateAverageEngagement(mentions),
		sentimentBreakdown: calculateSentimentDistribution(mentions),
		topMention: mentions.sort(
			(a, b) => (b.engagement?.upvotes || 0) - (a.engagement?.upvotes || 0)
		)[0],
	}));
}

function extractTrendingTopics(
	results: BrandMentionResult[],
	brandName: string
): TrendingTopic[] {
	// Extract keywords and phrases from mention contexts
	const allContent = results.map((r) => r.content).join(" ");
	const keywords = extractKeywords(allContent, brandName);

	// Group and rank by frequency
	const topicCounts = keywords.reduce(
		(acc, keyword) => {
			acc[keyword] = (acc[keyword] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	// Return top trending topics
	return Object.entries(topicCounts)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 10)
		.map(([topic, count]) => ({
			topic,
			mentions: count,
			sentiment: analyzTopicSentiment(results, topic),
			sources: getTopicSources(results, topic),
		}));
}
```

### Insight Generation

```typescript
function generateBrandInsights(
	analysis: BrandAnalysis,
	brandName: string
): string[] {
	const insights = [];

	// Sentiment insights
	const sentiment = analysis.sentiment;
	if (sentiment.positive > sentiment.negative) {
		insights.push(
			`Positive sentiment dominates with ${sentiment.positive}/${sentiment.totalMentions} positive mentions`
		);
	} else if (sentiment.negative > sentiment.positive) {
		insights.push(
			`Negative sentiment detected: ${sentiment.negative}/${sentiment.totalMentions} negative mentions need attention`
		);
	}

	// Source performance insights
	const topSource = analysis.sourceBreakdown.sort(
		(a, b) => b.mentionCount - a.mentionCount
	)[0];
	if (topSource) {
		insights.push(
			`Strongest presence on ${topSource.source} with ${topSource.mentionCount} mentions`
		);
	}

	// Trending topic insights
	if (analysis.trendingTopics.length > 0) {
		const topTopic = analysis.trendingTopics[0];
		insights.push(
			`"${topTopic.topic}" is trending with ${topTopic.mentions} mentions`
		);
	}

	// Engagement insights
	const totalEngagement = analysis.topMentions.reduce(
		(sum, mention) => sum + (mention.engagement?.upvotes || 0),
		0
	);
	if (totalEngagement > 100) {
		insights.push(
			`High engagement detected: ${totalEngagement} total upvotes/likes across mentions`
		);
	}

	return insights;
}

function generateActionableRecommendations(
	analysis: BrandAnalysis,
	brandName: string
): string[] {
	const recommendations = [];

	// Sentiment-based recommendations
	if (analysis.sentiment.negative > analysis.sentiment.positive) {
		recommendations.push(
			"Address negative feedback patterns identified in mentions"
		);
		recommendations.push(
			"Develop content strategy to improve brand perception"
		);
	}

	// Source-specific recommendations
	const lowPerformingSources = analysis.sourceBreakdown.filter(
		(s) => s.mentionCount < 2
	);
	if (lowPerformingSources.length > 0) {
		recommendations.push(
			`Increase brand presence on ${lowPerformingSources.map((s) => s.source).join(", ")}`
		);
	}

	// Topic-based recommendations
	if (analysis.trendingTopics.length > 0) {
		const topTopic = analysis.trendingTopics[0];
		recommendations.push(
			`Create content around trending topic: "${topTopic.topic}"`
		);
	}

	// General recommendations
	recommendations.push(
		"Monitor competitor mentions for market positioning insights"
	);
	recommendations.push("Engage with high-engagement posts to build community");

	return recommendations;
}
```

### Data Types

```typescript
interface BrandMonitoringResult {
	brandName: string;
	timeframe: string;
	timestamp: string;
	totalMentions: number;
	sources: WebSource[];
	sentimentAnalysis: SentimentDistribution;
	sourceBreakdown: SourceBreakdown[];
	trendingTopics: TrendingTopic[];
	topMentions: BrandMentionResult[];
	competitorMentions: CompetitorMention[];
	insights: string[];
	recommendations: string[];
	metadata: {
		executionTime: number;
		sourcesScraped: number;
		category: "brand-monitoring";
	};
}

interface SentimentDistribution {
	positive: number;
	neutral: number;
	negative: number;
	totalMentions: number;
	overallTrend: "positive" | "neutral" | "negative";
}

interface SourceBreakdown {
	source: WebSource;
	mentionCount: number;
	averageEngagement: number;
	sentimentBreakdown: SentimentDistribution;
	topMention: BrandMentionResult;
}

interface TrendingTopic {
	topic: string;
	mentions: number;
	sentiment: "positive" | "neutral" | "negative";
	sources: WebSource[];
}
```

## 🧪 Testing Strategy (skip all unit/integration/feature testing implementation)

### Unit Tests

```typescript
describe("brandMonitorTool", () => {
	test("should accept valid parameters");
	test("should validate brand name requirements");
	test("should handle different source combinations");
	test("should process crawl results correctly");
	test("should generate meaningful insights");
	test("should handle firecrawl client errors");
	test("should respect timeframe parameters");
});
```

### Integration Tests

```typescript
describe("Brand Monitor Integration", () => {
	test("should work with real firecrawl client", { timeout: 60000 });
	test("should integrate with chat interface");
	test("should handle large result sets");
	test("should work with various brand names");
});
```

### Performance Tests

```typescript
describe("Brand Monitor Performance", () => {
	test("should complete within 45 seconds");
	test("should handle concurrent requests");
	test("should optimize memory usage");
	test("should handle network timeouts gracefully");
});
```

## 🔗 Dependencies

- **Requires**: GEO-005 (Firecrawl Client) must be completed
- **External**: Vercel AI SDK, Zod validation
- **Internal**: Existing chat system and tool registration

## 📊 Performance Requirements

- **Execution Time**: < 45 seconds total (including web scraping)
- **Memory Usage**: < 150MB during execution
- **Data Processing**: Handle 100+ mentions efficiently
- **Concurrent Users**: Support 5+ simultaneous monitoring requests

## 🔍 Definition of Ready

- [ ] GEO-005 (Firecrawl Client) completed and tested
- [ ] Web sources accessible and scrapable
- [ ] Test brand scenarios defined
- [ ] Response data structure approved

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates with chat interface successfully
- [ ] Web scraping and analysis working correctly
- [ ] Sentiment analysis providing reasonable results
- [ ] Trending topic extraction functional
- [ ] Error handling provides user-friendly messages
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with real web scraping passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Brand Monitoring

```typescript
// User query: "Monitor Tesla brand mentions this week"
{
  brandName: "Tesla",
  sources: ["reddit", "hackernews"],
  timeframe: "week"
}
```

### Advanced Monitoring with Competitors

```typescript
// User query: "Check Apple brand mentions including competitor analysis"
{
  brandName: "Apple",
  sources: ["reddit", "hackernews", "twitter"],
  timeframe: "month",
  includeCompetitors: true,
  minEngagement: 5
}
```

## 📝 Notes

- Focus on actionable insights over raw data
- Ensure response structure supports artifact visualization
- Consider rate limiting when scraping multiple sources
- Prioritize content quality and relevance

## 🔄 Follow-up Tasks

- **GEO-007**: Create Brand Mention Intelligence Artifact
- **GEO-025**: Add competitor analysis enhancement (future sprint)
- **GEO-026**: Implement alert system for significant changes (future sprint)
