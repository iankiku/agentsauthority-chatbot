# Phase 2B: Website Monitoring Agent Implementation

## 📋 Phase Overview

**Phase Name**: Website Monitoring Agent  
**Duration**: 2 weeks  
**Start Date**: [TBD]  
**End Date**: [TBD]  
**Story Points**: 35  
**Team**: Backend, Frontend, AI/ML

## 🎯 Phase Goal

Implement an intelligent website monitoring agent with AI-powered change
detection, significance filtering, and configurable notification systems. This
agent will provide real-time website change monitoring with intelligent
filtering to reduce noise.

## 📊 Phase Metrics

- **Velocity Target**: 35 story points
- **Definition of Done**: All acceptance criteria met, tests passing, code
  reviewed
- **Success Criteria**: Website monitoring agent fully functional with AI
  filtering

## 🎫 Phase Backlog

### GEO-301: Website Monitor Agent Foundation

**Type**: Backend Development **Priority**: P0 **Story Points**: 5  
**Estimated Time**: 8 hours

#### User Story

As a **GEO analyst**, I want a **website monitoring agent** so that I can
**track website changes with intelligent filtering and notifications**.

#### Acceptance Criteria

- [ ] Agent can be invoked through chat interface
- [ ] Agent manages website monitoring workflow
- [ ] Agent handles single page and full-site monitoring
- [ ] Agent provides monitoring status and configuration
- [ ] Agent integrates with existing chat artifacts system
- [ ] Agent supports monitoring pause/resume functionality

#### Technical Implementation

```typescript
// lib/ai/tools/website-monitor-agent.ts
export const websiteMonitorAgent = tool({
	description:
		"Intelligent website monitoring with AI-powered change detection",
	inputSchema: z.object({
		websiteUrl: z.string().url(),
		monitorType: z.enum(["single_page", "full_site"]),
		checkInterval: z.number().min(60), // minutes
		notificationPreference: z.enum(["none", "email", "webhook", "both"]),
		webhookUrl: z.string().url().optional(),
	}),
	handler: async (ctx, args) => {
		// Orchestrate website monitoring workflow
	},
});
```

---

### GEO-302: Change Detection Tool

**Type**: Backend Development **Priority**: P0 **Story Points**: 8  
**Estimated Time**: 12 hours

#### User Story

As a **GEO analyst**, I want **automated change detection** so that I can
**monitor website content changes in real-time**.

#### Acceptance Criteria

- [ ] Integrates with Firecrawl API for content scraping
- [ ] Supports single page monitoring with change tracking
- [ ] Supports full-site crawling with change detection
- [ ] Stores historical snapshots for comparison
- [ ] Handles different content types (HTML, text, images)
- [ ] Provides detailed change diffs and metadata

#### Technical Implementation

```typescript
// lib/ai/tools/change-detection-tool.ts
export const changeDetectionTool = tool({
	description: "Firecrawl-powered website change detection and tracking",
	inputSchema: z.object({
		url: z.string().url(),
		monitorType: z.enum(["single_page", "full_site"]),
		crawlLimit: z.number().optional(),
		crawlDepth: z.number().optional(),
	}),
	handler: async (ctx, args) => {
		// Use Firecrawl for change detection
	},
});
```

---

### GEO-303: AI Significance Tool

**Type**: Backend Development **Priority**: P0 **Story Points**: 10  
**Estimated Time**: 16 hours

#### User Story

As a **GEO analyst**, I want **AI-powered change significance filtering** so
that I can **focus on meaningful changes and reduce noise**.

#### Acceptance Criteria

- [ ] Analyzes changes using AI to determine significance
- [ ] Filters out noise (banners, timestamps, ads)
- [ ] Identifies meaningful changes (content, prices, features)
- [ ] Provides confidence scores for change significance
- [ ] Supports customizable significance thresholds
- [ ] Includes AI reasoning for each change analysis

#### Technical Implementation

```typescript
// lib/ai/tools/ai-significance-tool.ts
export const aiSignificanceTool = tool({
	description: "AI-powered change significance analysis and filtering",
	inputSchema: z.object({
		changeDiff: z.object({
			text: z.string(),
			json: z.any(),
		}),
		websiteName: z.string(),
		websiteUrl: z.string(),
		significanceThreshold: z.number().min(0).max(100).optional(),
	}),
	handler: async (ctx, args) => {
		// AI analysis of change significance
	},
});
```

---

### GEO-304: Monitoring Database Schema

**Type**: Backend Development **Priority**: P1 **Story Points**: 4  
**Estimated Time**: 6 hours

#### User Story

As a **GEO analyst**, I want **persistent monitoring data** so that I can
**track website changes over time and access historical data**.

#### Acceptance Criteria

- [ ] Database schema for websites table
- [ ] Database schema for scrape results table
- [ ] Database schema for change alerts table
- [ ] Database schema for monitoring sessions table
- [ ] Proper indexing for performance
- [ ] Data retention and cleanup policies

#### Technical Implementation

```typescript
// lib/db/schema.ts
export const websites = pgTable("websites", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").notNull(),
	name: text("name").notNull(),
	url: text("url").notNull(),
	monitorType: text("monitor_type").notNull(),
	checkInterval: integer("check_interval").notNull(),
	isActive: boolean("is_active").default(true),
	lastChecked: timestamp("last_checked"),
	createdAt: timestamp("created_at").defaultNow(),
});

export const scrapeResults = pgTable("scrape_results", {
	id: uuid("id").primaryKey().defaultRandom(),
	websiteId: uuid("website_id").notNull(),
	markdown: text("markdown"),
	changeStatus: text("change_status"),
	diff: jsonb("diff"),
	scrapedAt: timestamp("scraped_at").defaultNow(),
});
```

---

### GEO-305: Notification Tool

**Type**: Backend Development **Priority**: P1 **Story Points**: 8  
**Estimated Time**: 12 hours

#### User Story

As a **GEO analyst**, I want **configurable notifications** so that I can
**receive alerts about meaningful website changes**.

#### Acceptance Criteria

- [ ] Email notifications using Resend
- [ ] Webhook notifications with configurable payloads
- [ ] Notification filtering based on significance
- [ ] Rich notification content with change details
- [ ] Notification delivery status tracking
- [ ] Rate limiting and spam prevention

#### Technical Implementation

```typescript
// lib/ai/tools/notification-tool.ts
export const notificationTool = tool({
	description: "Configurable notification system for website changes",
	inputSchema: z.object({
		changeAlert: z.object({
			websiteName: z.string(),
			websiteUrl: z.string(),
			changeType: z.string(),
			significance: z.number(),
			diff: z.any(),
		}),
		notificationType: z.enum(["email", "webhook", "both"]),
		emailAddress: z.string().email().optional(),
		webhookUrl: z.string().url().optional(),
	}),
	handler: async (ctx, args) => {
		// Send notifications based on configuration
	},
});
```

---

### GEO-306: Monitoring Scheduler

**Type**: Backend Development **Priority**: P1 **Story Points**: 4  
**Estimated Time**: 6 hours

#### User Story

As a **GEO analyst**, I want **automated monitoring scheduling** so that I can
**monitor websites at regular intervals without manual intervention**.

#### Acceptance Criteria

- [ ] Background job scheduling for website checks
- [ ] Configurable check intervals (minimum 60 minutes)
- [ ] Intelligent scheduling to avoid rate limits
- [ ] Failed check retry logic
- [ ] Monitoring status tracking and reporting
- [ ] Graceful handling of website downtime

#### Technical Implementation

```typescript
// lib/monitoring/scheduler.ts
export class MonitoringScheduler {
	async scheduleWebsiteCheck(
		websiteId: string,
		interval: number
	): Promise<void>;
	async processScheduledChecks(): Promise<void>;
	async handleFailedCheck(websiteId: string, error: Error): Promise<void>;
}
```

---

### GEO-307: Historical Tracking Tool

**Type**: Backend Development **Priority**: P2 **Story Points**: 6  
**Estimated Time**: 10 hours

#### User Story

As a **GEO analyst**, I want **historical change tracking** so that I can
**analyze website evolution over time**.

#### Acceptance Criteria

- [ ] Stores historical snapshots with timestamps
- [ ] Provides change timeline and analytics
- [ ] Calculates change frequency and patterns
- [ ] Generates change summary reports
- [ ] Supports data export and analysis
- [ ] Implements data retention policies

#### Technical Implementation

```typescript
// lib/ai/tools/historical-tracking-tool.ts
export const historicalTrackingTool = tool({
	description: "Historical website change tracking and analytics",
	inputSchema: z.object({
		websiteId: z.string(),
		dateRange: z.object({
			start: z.date(),
			end: z.date(),
		}),
		analysisType: z.enum(["timeline", "frequency", "summary"]),
	}),
	handler: async (ctx, args) => {
		// Analyze historical changes
	},
});
```

## 🚀 Implementation Strategy

### Week 1: Foundation

- Set up monitoring database schema
- Create website monitor agent skeleton
- Implement basic change detection

### Week 2: Core Monitoring

- Build AI significance filtering
- Implement notification system
- Create monitoring scheduler

### Week 2: Integration & Polish

- Integrate all components
- Add historical tracking
- Performance optimization and testing

## 🧪 Testing Strategy

### Unit Tests

- Each tool has comprehensive unit tests
- Mock Firecrawl API responses
- Test AI significance analysis

### Integration Tests

- End-to-end website monitoring workflow
- Notification delivery testing
- Real Firecrawl integration (limited)

### Performance Tests

- Monitoring performance under load
- Database query optimization
- Memory usage monitoring

## 📈 Success Metrics

- **Accuracy**: 90% accuracy in change significance filtering
- **Performance**: <5min change detection time
- **Reliability**: 99% uptime for monitoring service
- **User Experience**: Configurable notifications with rich content
- **Cost Efficiency**: Intelligent scheduling reduces API costs by 50%

## 🔄 Dependencies

- Firecrawl API integration
- Database schema and migrations
- Email service (Resend) configuration
- Background job processing system
- Existing chat interface and artifacts

## 🚨 Risks & Mitigation

| Risk                                     | Impact | Mitigation                                          |
| ---------------------------------------- | ------ | --------------------------------------------------- |
| Firecrawl API rate limits                | High   | Implement intelligent scheduling and caching        |
| AI significance analysis accuracy        | Medium | Start with simple rules, improve with training data |
| Notification delivery reliability        | Medium | Multiple delivery methods and retry logic           |
| Database performance with large datasets | High   | Proper indexing and data retention policies         |

## 📝 Definition of Done

- [ ] All acceptance criteria met
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Monitoring dashboard functional
