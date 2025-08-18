# GEO-005: Firecrawl Client Setup

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Blocker) **Story Points**: 2
**Estimated Time**: 1.5 hours **Assignee**: [Developer Name] **Sprint**: Sprint
1, Day 2

## 🎯 User Story

As a **brand manager**, I want to **monitor brand mentions across web sources in
real-time** so that I can **track brand sentiment and trending topics from
social media and news sources**.

## 📝 Description

Set up Firecrawl client for comprehensive web scraping capabilities. This will
enable real-time brand mention monitoring across Reddit, HackerNews, Twitter,
and other sources to provide comprehensive brand intelligence.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Firecrawl client properly installed and configured
- [ ] **AC2**: Can scrape Reddit for brand mentions successfully
- [ ] **AC3**: Can scrape HackerNews for brand mentions successfully
- [ ] **AC4**: Can scrape Twitter/X for brand mentions successfully
- [ ] **AC5**: Brand mention detection algorithm works accurately
- [ ] **AC6**: Sentiment analysis processes scraped content correctly
- [ ] **AC7**: Trending topic extraction identifies relevant themes
- [ ] **AC8**: Source attribution tracks where mentions originated
- [ ] **AC9**: Content deduplication removes duplicate mentions

### Technical Requirements

- [ ] **AC10**: Rate limiting prevents API abuse
- [ ] **AC11**: Error handling manages failed scrapes gracefully
- [ ] **AC12**: Response caching optimizes performance
- [ ] **AC13**: TypeScript interfaces for all scraped data
- [ ] **AC14**: Configurable source selection (Reddit, HN, Twitter)
- [ ] **AC15**: Content filtering removes spam and irrelevant content

### Performance Requirements

- [ ] **AC16**: Scraping completes within 30 seconds for standard queries
- [ ] **AC17**: Handles concurrent scraping requests (5+ simultaneous)
- [ ] **AC18**: Memory usage stays under 100MB during scraping
- [ ] **AC19**: Response payload optimized for relevant content only

### Data Quality Requirements

- [ ] **AC20**: Minimum 90% accuracy in brand mention detection
- [ ] **AC21**: Sentiment analysis correlates with manual review
- [ ] **AC22**: Trending topics are relevant to brand context
- [ ] **AC23**: Source credibility scoring implemented
- [ ] **AC24**: Content recency prioritized (last 7 days default)

## 🛠️ Technical Implementation

### File Structure

```
lib/
├── data-sources/
│   ├── firecrawl-client.ts               # Main Firecrawl client
│   ├── mention-detector.ts               # Brand mention detection
│   ├── sentiment-analyzer.ts             # Content sentiment analysis
│   ├── topic-extractor.ts                # Trending topic identification
│   └── types.ts                          # TypeScript interfaces
├── __tests__/
│   ├── firecrawl-client.test.ts         # Unit tests
│   └── integration/
│       └── web-scraping.test.ts          # Integration tests
```

### Core Implementation

#### 1. Firecrawl Client Class

```typescript
export class FirecrawlClient {
	private client: FirecrawlApp;
	private mentionDetector: MentionDetector;
	private sentimentAnalyzer: SentimentAnalyzer;

	constructor() {
		this.client = new FirecrawlApp({
			apiKey: process.env.FIRECRAWL_API_KEY,
		});
		this.mentionDetector = new MentionDetector();
		this.sentimentAnalyzer = new SentimentAnalyzer();
	}

	async crawlBrandMentions(
		brandName: string,
		sources: WebSource[] = ["reddit", "hackernews", "twitter"],
		options: CrawlOptions = {}
	): Promise<BrandMentionResult[]> {
		const crawlPromises = sources.map((source) =>
			this.crawlSource(source, brandName, options)
		);

		const results = await Promise.allSettled(crawlPromises);
		return this.processCrawlResults(results, brandName);
	}

	private async crawlSource(
		source: WebSource,
		brandName: string,
		options: CrawlOptions
	): Promise<RawCrawlResult[]> {
		const sourceConfig = this.getSourceConfig(source, brandName, options);

		const crawlResponse = await this.client.crawlUrl(sourceConfig.url, {
			limit: sourceConfig.limit,
			scrapeOptions: {
				formats: ["markdown"],
				excludeTags: ["script", "style", "nav"],
				onlyMainContent: true,
			},
		});

		return crawlResponse.data || [];
	}
}
```

#### 2. Brand Mention Detection

```typescript
export class MentionDetector {
	detectMentions(content: string, brandName: string): BrandMention[] {
		const mentions: BrandMention[] = [];

		// Exact brand name matches
		const exactMatches = this.findExactMatches(content, brandName);
		mentions.push(...exactMatches);

		// Fuzzy matching for brand variations
		const fuzzyMatches = this.findFuzzyMatches(content, brandName);
		mentions.push(...fuzzyMatches);

		// Context extraction around mentions
		mentions.forEach((mention) => {
			mention.context = this.extractContext(content, mention.position, 100);
		});

		return this.deduplicateMentions(mentions);
	}

	private findExactMatches(content: string, brandName: string): BrandMention[] {
		const regex = new RegExp(`\\b${this.escapeRegex(brandName)}\\b`, "gi");
		const matches = Array.from(content.matchAll(regex));

		return matches.map((match) => ({
			text: match[0],
			position: match.index!,
			type: "exact",
			confidence: 1.0,
		}));
	}

	private findFuzzyMatches(content: string, brandName: string): BrandMention[] {
		// Implement fuzzy matching for brand variations
		const variations = this.generateBrandVariations(brandName);
		const fuzzyMatches: BrandMention[] = [];

		variations.forEach((variation) => {
			const regex = new RegExp(`\\b${this.escapeRegex(variation)}\\b`, "gi");
			const matches = Array.from(content.matchAll(regex));

			matches.forEach((match) => {
				fuzzyMatches.push({
					text: match[0],
					position: match.index!,
					type: "fuzzy",
					confidence: this.calculateFuzzyConfidence(variation, brandName),
				});
			});
		});

		return fuzzyMatches;
	}
}
```

#### 3. Sentiment Analysis

```typescript
export class SentimentAnalyzer {
	analyzeSentiment(content: string, brandContext: string): SentimentResult {
		// Extract brand-specific context
		const relevantSentences = this.extractBrandSentences(content, brandContext);

		// Simple keyword-based sentiment (enhance with ML later)
		const sentiment = this.calculateKeywordSentiment(relevantSentences);

		return {
			overall: sentiment.overall,
			confidence: sentiment.confidence,
			positiveKeywords: sentiment.positiveWords,
			negativeKeywords: sentiment.negativeWords,
			neutralContext: relevantSentences.filter(
				(s) => !this.containsSentimentKeywords(s)
			),
		};
	}

	private calculateKeywordSentiment(sentences: string[]): {
		overall: "positive" | "neutral" | "negative";
		confidence: number;
		positiveWords: string[];
		negativeWords: string[];
	} {
		const positiveKeywords = [
			"excellent",
			"great",
			"amazing",
			"outstanding",
			"innovative",
			"leading",
			"best",
			"superior",
			"impressive",
			"successful",
		];

		const negativeKeywords = [
			"terrible",
			"awful",
			"poor",
			"disappointing",
			"failed",
			"worst",
			"problematic",
			"issues",
			"broken",
			"inadequate",
		];

		const text = sentences.join(" ").toLowerCase();

		const positiveCount = positiveKeywords.filter((word) =>
			text.includes(word)
		).length;

		const negativeCount = negativeKeywords.filter((word) =>
			text.includes(word)
		).length;

		if (positiveCount > negativeCount) {
			return {
				overall: "positive",
				confidence: Math.min(
					positiveCount / (positiveCount + negativeCount),
					0.9
				),
				positiveWords: positiveKeywords.filter((word) => text.includes(word)),
				negativeWords: negativeKeywords.filter((word) => text.includes(word)),
			};
		} else if (negativeCount > positiveCount) {
			return {
				overall: "negative",
				confidence: Math.min(
					negativeCount / (positiveCount + negativeCount),
					0.9
				),
				positiveWords: positiveKeywords.filter((word) => text.includes(word)),
				negativeWords: negativeKeywords.filter((word) => text.includes(word)),
			};
		} else {
			return {
				overall: "neutral",
				confidence: 0.5,
				positiveWords: [],
				negativeWords: [],
			};
		}
	}
}
```

#### 4. Data Types

```typescript
interface BrandMentionResult {
	source: WebSource;
	url: string;
	title: string;
	content: string;
	mentions: BrandMention[];
	sentiment: SentimentResult;
	publishedAt: string;
	author?: string;
	engagement?: {
		upvotes?: number;
		comments?: number;
		shares?: number;
	};
	credibilityScore: number;
}

interface BrandMention {
	text: string;
	position: number;
	type: "exact" | "fuzzy";
	confidence: number;
	context?: string;
}

interface SentimentResult {
	overall: "positive" | "neutral" | "negative";
	confidence: number;
	positiveKeywords: string[];
	negativeKeywords: string[];
	neutralContext: string[];
}

type WebSource = "reddit" | "hackernews" | "twitter" | "news";

interface CrawlOptions {
	timeframe?: "day" | "week" | "month";
	limit?: number;
	includeComments?: boolean;
	minEngagement?: number;
}
```

## 🧪 Testing Strategy (skip all unit/integration/feature testing implementation)

### Unit Tests

```typescript
describe("FirecrawlClient", () => {
	test("should initialize with API key");
	test("should crawl Reddit successfully");
	test("should crawl HackerNews successfully");
	test("should detect brand mentions accurately");
	test("should analyze sentiment correctly");
	test("should handle API errors gracefully");
	test("should respect rate limits");
});

describe("MentionDetector", () => {
	test("should find exact brand name matches");
	test("should find fuzzy brand variations");
	test("should extract relevant context");
	test("should deduplicate similar mentions");
});

describe("SentimentAnalyzer", () => {
	test("should identify positive sentiment");
	test("should identify negative sentiment");
	test("should handle neutral content");
	test("should provide confidence scores");
});
```

### Integration Tests

```typescript
describe("Firecrawl Integration", () => {
	test("should crawl real Reddit posts", { timeout: 30000 });
	test("should crawl real HackerNews posts", { timeout: 30000 });
	test("should handle rate limiting appropriately");
	test("should process large result sets efficiently");
});
```

### Test Data

```typescript
const testCases = [
	{
		brandName: "Tesla",
		expectedSources: ["reddit", "hackernews"],
		expectedMentions: { min: 5, max: 50 },
		expectedSentiment: "mixed",
	},
	{
		brandName: "Unknown Brand XYZ",
		expectedSources: ["reddit", "hackernews"],
		expectedMentions: { min: 0, max: 2 },
		expectedSentiment: "neutral",
	},
];
```

## 🔗 Dependencies

- **External**: Firecrawl API access and credits
- **Internal**: Environment configuration for API keys
- **Blockers**: Firecrawl account setup and API key configuration

## 📊 Performance Requirements

- **Scraping Time**: < 30 seconds for standard brand query
- **Memory Usage**: < 100MB during scraping operation
- **Concurrent Requests**: Support 5+ simultaneous brand analyses
- **Data Accuracy**: > 90% brand mention detection accuracy

## 🔍 Definition of Ready

- [ ] Firecrawl API account created and API key available
- [ ] Source websites identified (Reddit, HackerNews, Twitter)
- [ ] Rate limiting strategy defined
- [ ] Test brand names selected for validation

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Firecrawl client working with real API
- [ ] Brand mention detection accurate (>90%)
- [ ] Sentiment analysis providing reasonable results
- [ ] Rate limiting and error handling implemented
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with real APIs passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful
- [ ] Environment variables documented

## 🚀 Configuration Setup

### Environment Variables

```bash
# .env.local
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
FIRECRAWL_RATE_LIMIT=100  # requests per minute
```

### Source Configuration

```typescript
const sourceConfigs = {
	reddit: {
		baseUrl: "https://www.reddit.com/search",
		searchParam: "q",
		timeParam: "t",
		limitParam: "limit",
	},
	hackernews: {
		baseUrl: "https://hn.algolia.com/api/v1/search",
		searchParam: "query",
		timeParam: "numericFilters",
		limitParam: "hitsPerPage",
	},
};
```

## 📝 Notes

- Start with simple keyword-based sentiment analysis
- Focus on content quality over quantity
- Implement proper error handling for API failures
- Consider content freshness (prioritize recent mentions)

## 🔄 Follow-up Tasks

- **GEO-006**: Create Brand Monitor Tool using this client
- **GEO-023**: Add advanced sentiment analysis with ML (future sprint)
- **GEO-024**: Implement content caching for performance (future sprint)
