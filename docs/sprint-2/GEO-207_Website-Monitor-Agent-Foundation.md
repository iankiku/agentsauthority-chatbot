# GEO-207: Website Monitor Agent Foundation

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Critical) **Story Points**: 5  
**Estimated Time**: 8 hours **Assignee**: [Developer Name] **Sprint**: Sprint 2,
Phase 2B  
**Dependencies**: None (foundational)

## 🎯 User Story

As a **GEO analyst**, I want a **website monitoring agent** so that I can
**track website changes and detect meaningful updates automatically**.

## 📝 Description

Create the foundational website monitoring agent that orchestrates the entire
website monitoring workflow. This agent will coordinate website scraping, change
detection, AI-powered analysis, notification management, and real-time updates.
It will provide SSE progress updates and integrate seamlessly with the existing
chat artifacts system.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Agent can be invoked through chat interface with website URL and
      monitoring parameters
- [ ] **AC2**: Agent orchestrates website scraping and change detection process
      automatically
- [ ] **AC3**: Agent manages AI-powered meaningful change analysis workflow
- [ ] **AC4**: Agent provides real-time SSE progress updates for each monitoring
      stage
- [ ] **AC5**: Agent handles errors gracefully and provides user-friendly
      feedback
- [ ] **AC6**: Agent integrates with existing chat artifacts system for result
      display

### Technical Requirements

- [ ] **AC7**: Agent uses Vercel AI SDK tool() function for integration
- [ ] **AC8**: Agent accepts websiteUrl, monitorType, checkInterval, and
      customFilters as parameters
- [ ] **AC9**: Agent returns structured data suitable for artifact visualization
- [ ] **AC10**: Agent implements proper error handling and fallback mechanisms
- [ ] **AC11**: Agent supports monitoring pause/resume functionality
- [ ] **AC12**: Agent provides monitoring status and configuration options

### Integration Requirements

- [ ] **AC13**: Agent works seamlessly with existing chat interface
- [ ] **AC14**: Agent description is clear and discoverable in tool list
- [ ] **AC15**: Agent parameter validation using Zod schemas
- [ ] **AC16**: Agent error responses are user-friendly and actionable
- [ ] **AC17**: Agent response format supports artifact generation
- [ ] **AC18**: Agent integrates with SSE infrastructure for real-time updates

## 🛠️ Technical Implementation

### File Structure

```
lib/ai/tools/
├── website-monitor-agent.ts          # Main agent orchestration
├── website-scraping-tool.ts          # Website scraping and content extraction
├── change-detection-tool.ts          # Change detection and diff analysis
├── meaningful-change-tool.ts         # AI-powered meaningful change analysis
├── notification-tool.ts              # Notification management
└── monitoring-scheduler.ts           # Monitoring scheduling and management
```

### Agent Implementation

```typescript
// lib/ai/tools/website-monitor-agent.ts
export const websiteMonitorAgent = tool({
	description:
		"Comprehensive website monitoring with AI-powered change analysis",
	inputSchema: z.object({
		websiteUrl: z.string().url(),
		monitorType: z
			.enum(["content", "structure", "performance", "comprehensive"])
			.default("comprehensive"),
		checkInterval: z.number().min(300).max(86400).default(3600), // 5 minutes to 24 hours
		customFilters: z.array(z.string()).optional(),
		notificationSettings: z
			.object({
				email: z.boolean().default(false),
				webhook: z.string().url().optional(),
				slack: z.string().optional(),
			})
			.optional(),
		baselineSnapshot: z.boolean().default(true),
	}),
	handler: async (ctx, args) => {
		const {
			websiteUrl,
			monitorType,
			checkInterval,
			customFilters,
			notificationSettings,
			baselineSnapshot,
		} = args;

		// Initialize SSE connection for progress updates
		const sseConnection = await initializeSSEConnection(ctx);

		try {
			// Step 1: Initial Website Scraping
			await sseConnection.sendProgress("Scraping website content...", 10);
			const scrapedContent = await scrapeWebsite(websiteUrl, monitorType);

			// Step 2: Baseline Snapshot Creation
			await sseConnection.sendProgress("Creating baseline snapshot...", 25);
			const baseline = baselineSnapshot
				? await createBaselineSnapshot(websiteUrl, scrapedContent)
				: await getExistingBaseline(websiteUrl);

			// Step 3: Change Detection
			await sseConnection.sendProgress("Detecting changes...", 50);
			const changes = await detectChanges(
				scrapedContent,
				baseline,
				customFilters
			);

			// Step 4: AI-Powered Meaningful Change Analysis
			await sseConnection.sendProgress("Analyzing meaningful changes...", 75);
			const meaningfulChanges = await analyzeMeaningfulChanges(
				changes,
				websiteUrl,
				monitorType
			);

			// Step 5: Notification Management
			await sseConnection.sendProgress("Managing notifications...", 90);
			const notifications = await manageNotifications(
				meaningfulChanges,
				notificationSettings
			);

			// Step 6: Monitoring Schedule Setup
			await sseConnection.sendProgress("Setting up monitoring schedule...", 95);
			const monitoringSchedule = await setupMonitoringSchedule(
				websiteUrl,
				checkInterval,
				monitorType
			);

			// Step 7: Final Results
			await sseConnection.sendProgress("Generating final report...", 100);

			return {
				websiteUrl,
				monitorType,
				checkInterval,
				scrapedContent,
				baseline,
				changes,
				meaningfulChanges,
				notifications,
				monitoringSchedule,
				metadata: {
					executionTime: Date.now(),
					category: "website-monitoring",
					totalChanges: changes.length,
					meaningfulChangesCount: meaningfulChanges.length,
					monitoringActive: true,
				},
			};
		} catch (error) {
			await sseConnection.sendError(error.message);
			throw error;
		}
	},
});
```

### Response Data Structure

```typescript
interface WebsiteMonitorResult {
	websiteUrl: string;
	monitorType: "content" | "structure" | "performance" | "comprehensive";
	checkInterval: number;
	scrapedContent: {
		html: string;
		markdown: string;
		text: string;
		metadata: {
			title: string;
			description: string;
			keywords: string[];
			lastModified: string;
			contentLength: number;
		};
		screenshots: {
			desktop: string;
			mobile: string;
		};
		performance: {
			loadTime: number;
			pageSize: number;
			requests: number;
		};
	};
	baseline: {
		id: string;
		createdAt: string;
		content: any;
		hash: string;
	};
	changes: Array<{
		type: "added" | "removed" | "modified";
		path: string;
		oldValue: string;
		newValue: string;
		diff: string;
		severity: "low" | "medium" | "high" | "critical";
		timestamp: string;
	}>;
	meaningfulChanges: Array<{
		changeId: string;
		summary: string;
		impact: "positive" | "negative" | "neutral";
		confidence: number;
		aiAnalysis: string;
		recommendations: string[];
		priority: "low" | "medium" | "high" | "critical";
		affectedAreas: string[];
		businessImpact: string;
	}>;
	notifications: {
		sent: boolean;
		channels: string[];
		recipients: string[];
		message: string;
		timestamp: string;
	};
	monitoringSchedule: {
		active: boolean;
		nextCheck: string;
		interval: number;
		lastCheck: string;
		totalChecks: number;
		successRate: number;
	};
	metadata: {
		executionTime: number;
		category: "website-monitoring";
		totalChanges: number;
		meaningfulChangesCount: number;
		monitoringActive: boolean;
	};
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("websiteMonitorAgent", () => {
	test("should orchestrate complete website monitoring workflow");
	test("should handle website scraping failures gracefully");
	test("should provide real-time progress updates via SSE");
	test("should detect changes accurately");
	test("should analyze meaningful changes with AI");
	test("should manage notifications correctly");
	test("should set up monitoring schedules");
	test("should return properly structured response");
	test("should validate input parameters correctly");
	test("should handle different monitor types");
	test("should integrate with existing chat artifacts system");
});
```

### Integration Tests

```typescript
describe("Website Monitor Agent Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should handle SSE connection management");
	test("should coordinate with all dependent tools");
	test("should manage monitoring schedules");
});
```

## 🔗 Dependencies

- **Requires**: None (foundational agent)
- **External**: Firecrawl API, OpenAI API, Claude API, Gemini API, Perplexity
  API
- **Internal**: SSE infrastructure, chat artifacts system, website scraping
  tool, change detection tool, meaningful change tool, notification tool,
  monitoring scheduler

## 📊 Performance Requirements

- **Response Time**: < 60 seconds for complete monitoring setup
- **Data Size**: Response payload < 500 KB
- **Reliability**: > 95% success rate
- **Concurrent Usage**: Support 10+ simultaneous monitoring setups

## 🔍 Definition of Ready

- [ ] SSE infrastructure is available
- [ ] Website scraping tool is implemented
- [ ] Change detection tool is implemented
- [ ] Meaningful change tool is implemented
- [ ] Notification tool is implemented
- [ ] Monitoring scheduler is implemented
- [ ] Test scenarios are defined

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Agent integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] SSE progress updates work correctly
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Monitor website changes for example.com"
// Tool call with parameters:
{
	websiteUrl: "https://example.com",
	monitorType: "comprehensive",
	checkInterval: 3600
}
```

### Advanced Usage

```typescript
// User query: "Set up comprehensive monitoring with notifications"
// Tool call with parameters:
{
	websiteUrl: "https://example.com",
	monitorType: "comprehensive",
	checkInterval: 1800,
	customFilters: ["pricing", "features", "contact"],
	notificationSettings: {
		email: true,
		webhook: "https://hooks.slack.com/services/xxx",
		slack: "#website-monitoring"
	},
	baselineSnapshot: true
}
```

## 📝 Notes

- Focus on orchestration and coordination of dependent tools
- Ensure real-time progress updates are informative and accurate
- Consider rate limiting and API cost optimization
- Design for extensibility (future monitoring capabilities)
- Implement proper error recovery and retry logic

## 🔄 Follow-up Tasks

- **GEO-208**: Website Scraping Tool
- **GEO-209**: Change Detection Tool
- **GEO-210**: Meaningful Change Analysis Tool
- **GEO-211**: Notification Management Tool
- **GEO-212**: Monitoring Scheduler Tool
