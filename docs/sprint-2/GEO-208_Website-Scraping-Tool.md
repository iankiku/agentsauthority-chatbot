# GEO-208: Website Scraping Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Critical) **Story Points**: 8  
**Estimated Time**: 12 hours **Assignee**: [Developer Name] **Sprint**: Sprint
2, Phase 2B  
**Dependencies**: None

## 🎯 User Story

As a **GEO analyst**, I want **comprehensive website scraping** so that I can
**extract and analyze website content for monitoring purposes**.

## 📝 Description

Create a comprehensive website scraping tool that extracts HTML, markdown, text
content, metadata, screenshots, and performance metrics from websites. This tool
will handle dynamic content, JavaScript rendering, rate limiting, and provide
structured data for change detection and analysis.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Extracts HTML, markdown, and text content from websites
- [ ] **AC2**: Captures metadata (title, description, keywords, last modified)
- [ ] **AC3**: Takes desktop and mobile screenshots
- [ ] **AC4**: Measures performance metrics (load time, page size, requests)
- [ ] **AC5**: Handles JavaScript rendering and dynamic content
- [ ] **AC6**: Implements rate limiting and respectful scraping

### Data Structure Requirements

- [ ] **AC7**: Returns structured content with HTML, markdown, and text formats
- [ ] **AC8**: Includes comprehensive metadata extraction
- [ ] **AC9**: Provides screenshot URLs for desktop and mobile views
- [ ] **AC10**: Includes performance metrics and timing data
- [ ] **AC11**: Handles different content types (text, images, forms, etc.)
- [ ] **AC12**: Provides content hash for change detection

### Integration Requirements

- [ ] **AC13**: Works seamlessly with existing chat interface
- [ ] **AC14**: Tool description is clear and discoverable
- [ ] **AC15**: Parameter validation using Zod schemas
- [ ] **AC16**: Error responses are user-friendly and actionable
- [ ] **AC17**: Response format supports artifact generation
- [ ] **AC18**: Integrates with website monitoring agent workflow

## 🛠️ Technical Implementation

### Tool Implementation

```typescript
// lib/ai/tools/website-scraping-tool.ts
export const websiteScrapingTool = tool({
	description:
		"Comprehensive website scraping with content extraction and performance metrics",
	inputSchema: z.object({
		websiteUrl: z.string().url(),
		scrapingMode: z
			.enum(["basic", "full", "comprehensive"])
			.default("comprehensive"),
		includeScreenshots: z.boolean().default(true),
		includePerformance: z.boolean().default(true),
		waitForRender: z.number().min(0).max(10000).default(2000),
		userAgent: z.string().optional(),
		viewport: z
			.object({
				width: z.number().default(1920),
				height: z.number().default(1080),
			})
			.optional(),
		extractSelectors: z.array(z.string()).optional(),
		excludeSelectors: z.array(z.string()).optional(),
	}),
	handler: async (ctx, args) => {
		const {
			websiteUrl,
			scrapingMode,
			includeScreenshots,
			includePerformance,
			waitForRender,
			userAgent,
			viewport,
			extractSelectors,
			excludeSelectors,
		} = args;

		try {
			// Step 1: Validate and prepare scraping parameters
			const scrapingConfig = await prepareScrapingConfig({
				websiteUrl,
				scrapingMode,
				userAgent,
				viewport,
				extractSelectors,
				excludeSelectors,
			});

			// Step 2: Perform initial website scraping
			const scrapedData = await scrapeWebsiteContent(scrapingConfig);

			// Step 3: Extract and process content
			const processedContent = await processScrapedContent(
				scrapedData,
				scrapingMode
			);

			// Step 4: Capture screenshots (if enabled)
			const screenshots = includeScreenshots
				? await captureScreenshots(websiteUrl, viewport, waitForRender)
				: null;

			// Step 5: Measure performance metrics (if enabled)
			const performance = includePerformance
				? await measurePerformance(websiteUrl, userAgent)
				: null;

			// Step 6: Extract metadata
			const metadata = await extractMetadata(scrapedData);

			// Step 7: Generate content hash
			const contentHash = await generateContentHash(processedContent);

			return {
				websiteUrl,
				scrapingMode,
				content: processedContent,
				metadata,
				screenshots,
				performance,
				contentHash,
				scrapingInfo: {
					timestamp: new Date().toISOString(),
					userAgent: userAgent || "default",
					viewport: viewport || { width: 1920, height: 1080 },
					waitForRender,
					extractSelectors,
					excludeSelectors,
				},
				metadata: {
					executionTime: Date.now(),
					category: "website-scraping",
					contentSize: JSON.stringify(processedContent).length,
					success: true,
				},
			};
		} catch (error) {
			throw new Error(`Website scraping failed: ${error.message}`);
		}
	},
});
```

### Response Data Structure

```typescript
interface WebsiteScrapingResult {
	websiteUrl: string;
	scrapingMode: "basic" | "full" | "comprehensive";
	content: {
		html: string;
		markdown: string;
		text: string;
		structuredData: {
			headings: Array<{
				level: number;
				text: string;
				id: string;
			}>;
			links: Array<{
				text: string;
				url: string;
				title: string;
			}>;
			images: Array<{
				src: string;
				alt: string;
				title: string;
			}>;
			forms: Array<{
				action: string;
				method: string;
				inputs: Array<{
					name: string;
					type: string;
					placeholder: string;
				}>;
			}>;
		};
		extractedContent: Record<string, string>;
	};
	metadata: {
		title: string;
		description: string;
		keywords: string[];
		lastModified: string;
		contentLength: number;
		language: string;
		charset: string;
		robots: string;
		canonical: string;
		ogTags: Record<string, string>;
		twitterTags: Record<string, string>;
		schemaMarkup: any[];
	};
	screenshots: {
		desktop: {
			url: string;
			width: number;
			height: number;
			format: string;
		};
		mobile: {
			url: string;
			width: number;
			height: number;
			format: string;
		};
	} | null;
	performance: {
		loadTime: number;
		pageSize: number;
		requests: number;
		domContentLoaded: number;
		firstContentfulPaint: number;
		largestContentfulPaint: number;
		cumulativeLayoutShift: number;
		firstInputDelay: number;
		timeToInteractive: number;
	} | null;
	contentHash: string;
	scrapingInfo: {
		timestamp: string;
		userAgent: string;
		viewport: {
			width: number;
			height: number;
		};
		waitForRender: number;
		extractSelectors: string[];
		excludeSelectors: string[];
	};
	metadata: {
		executionTime: number;
		category: "website-scraping";
		contentSize: number;
		success: boolean;
	};
}
```

### Scraping Functions

```typescript
async function scrapeWebsiteContent(
	config: ScrapingConfig
): Promise<ScrapedData> {
	const { websiteUrl, userAgent, viewport, waitForRender } = config;

	// Use Firecrawl for comprehensive scraping
	const firecrawlResult = await firecrawlScrape({
		url: websiteUrl,
		formats: ["html", "markdown"],
		onlyMainContent: false,
		waitFor: waitForRender,
		actions: [
			{
				type: "wait",
				milliseconds: waitForRender,
			},
			{
				type: "screenshot",
				fullPage: true,
			},
		],
	});

	return {
		html: firecrawlResult.html || "",
		markdown: firecrawlResult.markdown || "",
		screenshots: firecrawlResult.screenshot || null,
		rawData: firecrawlResult,
	};
}

async function processScrapedContent(
	scrapedData: ScrapedData,
	mode: string
): Promise<ProcessedContent> {
	const { html, markdown } = scrapedData;

	// Extract text content
	const textContent = await extractTextContent(html);

	// Extract structured data
	const structuredData = await extractStructuredData(html);

	// Extract specific content based on selectors
	const extractedContent = await extractSpecificContent(html, mode);

	return {
		html,
		markdown,
		text: textContent,
		structuredData,
		extractedContent,
	};
}

async function captureScreenshots(
	websiteUrl: string,
	viewport: any,
	waitForRender: number
): Promise<Screenshots> {
	const desktopScreenshot = await captureScreenshot(
		websiteUrl,
		{
			...viewport,
			device: "desktop",
		},
		waitForRender
	);

	const mobileScreenshot = await captureScreenshot(
		websiteUrl,
		{
			width: 375,
			height: 667,
			device: "mobile",
		},
		waitForRender
	);

	return {
		desktop: desktopScreenshot,
		mobile: mobileScreenshot,
	};
}

async function measurePerformance(
	websiteUrl: string,
	userAgent?: string
): Promise<PerformanceMetrics> {
	// Use browser automation to measure performance
	const performanceMetrics = await measurePagePerformance(
		websiteUrl,
		userAgent
	);

	return {
		loadTime: performanceMetrics.loadTime,
		pageSize: performanceMetrics.pageSize,
		requests: performanceMetrics.requests,
		domContentLoaded: performanceMetrics.domContentLoaded,
		firstContentfulPaint: performanceMetrics.firstContentfulPaint,
		largestContentfulPaint: performanceMetrics.largestContentfulPaint,
		cumulativeLayoutShift: performanceMetrics.cumulativeLayoutShift,
		firstInputDelay: performanceMetrics.firstInputDelay,
		timeToInteractive: performanceMetrics.timeToInteractive,
	};
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("websiteScrapingTool", () => {
	test("should extract HTML, markdown, and text content");
	test("should capture metadata accurately");
	test("should take desktop and mobile screenshots");
	test("should measure performance metrics");
	test("should handle JavaScript rendering");
	test("should implement rate limiting");
	test("should handle different scraping modes");
	test("should extract structured data correctly");
	test("should generate content hash");
	test("should handle scraping errors gracefully");
	test("should validate input parameters correctly");
});
```

### Integration Tests

```typescript
describe("Website Scraping Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with website monitoring agent");
	test("should handle various website types");
	test("should respect robots.txt and rate limits");
});
```

## 🔗 Dependencies

- **Requires**: None
- **External**: Firecrawl API, Puppeteer/Playwright for screenshots
- **Internal**: Content processing utilities, metadata extraction functions

## 📊 Performance Requirements

- **Response Time**: < 30 seconds for comprehensive scraping
- **Data Size**: Response payload < 1 MB
- **Reliability**: > 90% success rate
- **Concurrent Usage**: Support 15+ simultaneous scraping operations

## 🔍 Definition of Ready

- [ ] Firecrawl API is configured and accessible
- [ ] Screenshot capture utilities are available
- [ ] Performance measurement tools are implemented
- [ ] Test scenarios are defined
- [ ] Rate limiting strategies are planned

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] Content extraction accuracy meets requirements (>90%)
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Scrape content from example.com"
// Tool call with parameters:
{
	websiteUrl: "https://example.com",
	scrapingMode: "comprehensive",
	includeScreenshots: true,
	includePerformance: true
}
```

### Advanced Usage

```typescript
// User query: "Scrape specific content with custom settings"
// Tool call with parameters:
{
	websiteUrl: "https://example.com",
	scrapingMode: "full",
	includeScreenshots: true,
	includePerformance: true,
	waitForRender: 5000,
	userAgent: "Mozilla/5.0 (compatible; GEO-Bot/1.0)",
	viewport: { width: 1920, height: 1080 },
	extractSelectors: [".pricing", ".features", ".contact"],
	excludeSelectors: [".ads", ".sidebar"]
}
```

## 📝 Notes

- Focus on comprehensive content extraction and processing
- Implement respectful scraping practices
- Consider performance and resource optimization
- Design for extensibility (future scraping capabilities)
- Ensure robust error handling for various website types

## 🔄 Follow-up Tasks

- **GEO-209**: Change Detection Tool
- **GEO-210**: Meaningful Change Analysis Tool
- **GEO-211**: Notification Management Tool
- **GEO-212**: Monitoring Scheduler Tool
