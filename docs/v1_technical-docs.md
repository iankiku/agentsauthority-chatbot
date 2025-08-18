# GEO/SEO Chat AI Dashboard - Technical Documentation

## Architecture Overview

Transform the existing Vercel AI chatbot into a specialized GEO/SEO dashboard
using the current architecture as foundation. The system will extend the
existing chat infrastructure to create persistent, database-backed artifacts.

## Current Architecture Analysis

### Existing Components

- **Framework**: Next.js 15 with App Router
- **AI Integration**: Vercel AI SDK (`ai: 5.0.0-beta.6`) with
  `@ai-sdk/react: 2.0.0-beta.6`
- **Chat System**: Existing chat implementation in `/chat` with:
  - Chat API endpoint at `/api/chat/route.ts`
  - Chat components in `components/chat/`
  - Artifact system with `ArtifactCanvas` component
  - Message handling and conversation persistence
- **Database**: Drizzle ORM with PostgreSQL
- **Authentication**: Better Auth integration
- **GEO Tools**: Already implemented brandMonitorAgent, visibilityExplorerAgent,
  actionImplementationAgent

### Key Strengths to Leverage

1. **Chat Infrastructure**: Already exists with streaming support
2. **Artifact System**: `ArtifactCanvas` with preview/code/settings views
3. **GEO Tools**: Basic brand monitoring and visibility analysis
4. **Database Schema**: Existing user and session management

## Technical Implementation Plan

### Phase 1: Foundation Architecture (Week 1-2)

#### 1.1 Database Schema Extensions

```sql
-- Extend existing schema for dashboard artifacts
CREATE TABLE dashboard_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  page_type VARCHAR(50) NOT NULL, -- 'overview', 'competitors', 'platforms', etc.
  artifact_type VARCHAR(50) NOT NULL, -- 'scorecard', 'chart', 'table', 'report'
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL, -- The actual artifact data
  metadata JSONB DEFAULT '{}', -- Additional metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_pinned BOOLEAN DEFAULT FALSE,
  tags TEXT[]
);

CREATE TABLE dashboard_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  page_type VARCHAR(50) NOT NULL,
  messages JSONB NOT NULL, -- Array of chat messages
  artifacts JSONB DEFAULT '[]', -- Array of artifact IDs created
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_dashboard_artifacts_user_id ON dashboard_artifacts(user_id);
CREATE INDEX idx_dashboard_artifacts_page_type ON dashboard_artifacts(page_type);
CREATE INDEX idx_dashboard_conversations_user_id ON dashboard_conversations(user_id);
```

#### 1.2 Universal ChatCanvasLayout Component

```typescript
// components/dashboard/chat-canvas-layout.tsx
interface ChatCanvasLayoutProps {
  pageType: "overview" | "competitors" | "platforms" | "insights" | "reports";
  initialPrompt?: string;
  systemContext: string;
  userId: string;
}

export function ChatCanvasLayout({
  pageType,
  initialPrompt,
  systemContext,
  userId
}: ChatCanvasLayoutProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/dashboard/${pageType}`,
    initialMessages: initialPrompt ? [
      { role: 'user', content: initialPrompt }
    ] : [],
    onFinish: async (message) => {
      // Save conversation and artifacts to database
      await saveConversationToDatabase(pageType, userId, messages, artifacts);
    }
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Canvas Area */}
      <div className="flex-1 overflow-auto">
        <ArtifactCanvas artifacts={artifacts} />
      </div>

      {/* Chat Input */}
      <div className="border-t p-4">
        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder={`Ask about ${pageType}...`}
        />
      </div>
    </div>
  );
}
```

#### 1.3 Page-Specific API Endpoints

```typescript
// app/api/dashboard/[pageType]/route.ts
export async function POST(req: Request) {
	const { messages, userId } = await req.json();
	const pageType = params.pageType as DashboardPageType;

	// Get page-specific context and tools
	const { systemContext, tools } = getPageContext(pageType);

	// Use existing chat infrastructure with page-specific tools
	const result = await streamText({
		model: myProvider.languageModel("chat-model"),
		messages: convertToModelMessages(messages),
		system: systemContext,
		tools: tools,
		experimental_activeTools: Object.keys(tools),
		experimental_transform: smoothStream({ chunking: "word" }),
	});

	// Extract artifacts from response and save to database
	const artifacts = extractArtifactsFromResponse(result);
	await saveArtifactsToDatabase(userId, pageType, artifacts);

	return result.toDataStreamResponse();
}
```

### Phase 2: Core Implementation (Week 3-4)

#### 2.1 Page Transformations

Replace static dashboard pages with ChatCanvasLayout:

```typescript
// app/dashboard/page.tsx
export default function DashboardOverviewPage() {
  const { user } = useAuth();

  return (
    <ChatCanvasLayout
      pageType="overview"
      systemContext={OVERVIEW_SYSTEM_CONTEXT}
      userId={user.id}
      initialPrompt="Show me my current GEO score and key metrics"
    />
  );
}

// app/dashboard/competitors/page.tsx
export default function CompetitorsPage() {
  const { user } = useAuth();

  return (
    <ChatCanvasLayout
      pageType="competitors"
      systemContext={COMPETITORS_SYSTEM_CONTEXT}
      userId={user.id}
      initialPrompt="Show me my top competitors and their performance"
    />
  );
}
```

#### 2.2 Enhanced GEO Tools Integration

Extend existing GEO tools to work with dashboard context:

```typescript
// lib/ai/tools/dashboard-geo-tools.ts
export const dashboardBrandMonitorAgent = tool({
	description: "Monitor brand visibility with dashboard persistence",
	inputSchema: z.object({
		brandName: z.string(),
		platforms: z.array(z.enum(["chatgpt", "claude", "gemini", "perplexity"])),
		saveToDashboard: z.boolean().default(true),
	}),
	execute: async ({ brandName, platforms, saveToDashboard }) => {
		// Use existing brandMonitorAgent logic
		const result = await brandMonitorAgent.execute({ brandName, platforms });

		// If saving to dashboard, create persistent artifact
		if (saveToDashboard) {
			const artifact = {
				type: "brand-monitor-report",
				title: `Brand Monitor: ${brandName}`,
				content: result,
				metadata: { brandName, platforms, timestamp: new Date() },
			};

			// Save to database (implementation needed)
			await saveArtifactToDatabase(artifact);
		}

		return result;
	},
});
```

#### 2.3 Artifact Management System

```typescript
// lib/dashboard/artifact-manager.ts
export class DashboardArtifactManager {
	async saveArtifact(
		userId: string,
		pageType: string,
		artifact: DashboardArtifact
	) {
		const db = getDatabase();

		return await db.insert(dashboardArtifacts).values({
			userId,
			pageType,
			artifactType: artifact.type,
			title: artifact.title,
			content: artifact.content,
			metadata: artifact.metadata,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	async getArtifacts(userId: string, pageType?: string) {
		const db = getDatabase();

		let query = db
			.select()
			.from(dashboardArtifacts)
			.where(eq(dashboardArtifacts.userId, userId));

		if (pageType) {
			query = query.where(eq(dashboardArtifacts.pageType, pageType));
		}

		return await query.orderBy(desc(dashboardArtifacts.createdAt));
	}

	async pinArtifact(artifactId: string, userId: string) {
		const db = getDatabase();

		return await db
			.update(dashboardArtifacts)
			.set({ isPinned: true, updatedAt: new Date() })
			.where(
				and(
					eq(dashboardArtifacts.id, artifactId),
					eq(dashboardArtifacts.userId, userId)
				)
			);
	}
}
```

### Phase 3: Advanced Features (Week 5-6)

#### 3.1 Conversation History & Memory
comment: don't we have this already?

```typescript
// lib/dashboard/conversation-manager.ts
export class DashboardConversationManager {
	async saveConversation(
		userId: string,
		pageType: string,
		messages: Message[],
		artifacts: string[]
	) {
		const db = getDatabase();

		return await db.insert(dashboardConversations).values({
			userId,
			pageType,
			messages: messages as any,
			artifacts: artifacts as any,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	async getConversationHistory(userId: string, pageType: string, limit = 10) {
		const db = getDatabase();

		return await db
			.select()
			.from(dashboardConversations)
			.where(
				and(
					eq(dashboardConversations.userId, userId),
					eq(dashboardConversations.pageType, pageType)
				)
			)
			.orderBy(desc(dashboardConversations.updatedAt))
			.limit(limit);
	}
}
```

#### 3.2 Export & Sharing Functionality
comment: super important for GTM as we would add our name to every report, visualization etc
sharable link to report that can be shared with others and also can be downloaded and saved as pdf, and twitted as images and when users use the link they can be asked to create account
```typescript
// lib/dashboard/export-manager.ts
export class DashboardExportManager {
	async exportArtifact(artifactId: string, format: "pdf" | "csv" | "json") {
		const artifact = await this.getArtifact(artifactId);

		switch (format) {
			case "pdf":
				return await this.generatePDF(artifact);
			case "csv":
				return await this.generateCSV(artifact);
			case "json":
				return await this.generateJSON(artifact);
		}
	}

	async scheduleReport(
		userId: string,
		pageType: string,
		schedule: ReportSchedule
	) {
		// Implementation for scheduled report generation
	}
}
```

## Database Schema (Drizzle)

```typescript
// lib/db/schema/dashboard.ts
import {
	pgTable,
	uuid,
	varchar,
	jsonb,
	timestamp,
	boolean,
	text,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const dashboardArtifacts = pgTable("dashboard_artifacts", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.references(() => users.id)
		.notNull(),
	pageType: varchar("page_type", { length: 50 }).notNull(),
	artifactType: varchar("artifact_type", { length: 50 }).notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	content: jsonb("content").notNull(),
	metadata: jsonb("metadata").default("{}"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	isPinned: boolean("is_pinned").default(false),
	tags: text("tags").array(),
});

export const dashboardConversations = pgTable("dashboard_conversations", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.references(() => users.id)
		.notNull(),
	pageType: varchar("page_type", { length: 50 }).notNull(),
	messages: jsonb("messages").notNull(),
	artifacts: jsonb("artifacts").default("[]"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});
```

## Page-Specific Contexts

### Overview Page Context

```typescript
const OVERVIEW_SYSTEM_CONTEXT = `
You are a GEO/SEO dashboard assistant for the Overview page.
Your role is to help users understand their overall brand visibility and performance.

Key capabilities:
- Show GEO scores and key metrics
- Display trend analysis and performance changes
- Provide executive summaries
- Generate actionable insights

Available tools:
- brandMonitorAgent: Track brand visibility across AI platforms
- visibilityExplorerAgent: Analyze competitive positioning
- actionImplementationAgent: Generate optimization recommendations

Always create persistent artifacts that users can reference later.
`;
```

### Competitors Page Context

```typescript
const COMPETITORS_SYSTEM_CONTEXT = `
You are a GEO/SEO dashboard assistant for the Competitors page.
Your role is to help users analyze their competitive landscape.

Key capabilities:
- Compare performance against competitors
- Track competitor ranking changes
- Identify competitive opportunities
- Generate competitive intelligence reports

Available tools:
- brandMonitorAgent: Monitor competitor brand mentions
- visibilityExplorerAgent: Analyze competitive positioning
- actionImplementationAgent: Generate competitive strategies

Focus on creating comparison artifacts and competitive analysis reports.
`;
```

## Integration with Existing Components

### Extending ArtifactCanvas

```typescript
// components/artifact-canvas.tsx (extended)
interface ExtendedArtifactCanvasProps {
  artifacts: Artifact[];
  dashboardArtifacts?: DashboardArtifact[]; // New prop for dashboard artifacts
  onPinArtifact?: (artifactId: string) => void;
  onExportArtifact?: (artifactId: string, format: string) => void;
}

export function ExtendedArtifactCanvas({
  artifacts,
  dashboardArtifacts = [],
  onPinArtifact,
  onExportArtifact
}: ExtendedArtifactCanvasProps) {
  // Combine regular artifacts with dashboard artifacts
  const allArtifacts = [...artifacts, ...dashboardArtifacts];

  return (
    <div className="space-y-4">
      {allArtifacts.map((artifact) => (
        <ArtifactCard
          key={artifact.id}
          artifact={artifact}
          onPin={onPinArtifact}
          onExport={onExportArtifact}
          showDashboardControls={artifact.type.startsWith('dashboard-')}
        />
      ))}
    </div>
  );
}
```

## Performance Considerations

### Caching Strategy

```typescript
// lib/dashboard/cache-manager.ts
export class DashboardCacheManager {
	private cache = new Map<string, { data: any; timestamp: number }>();
	private TTL = 5 * 60 * 1000; // 5 minutes

	async getCachedData(key: string) {
		const cached = this.cache.get(key);
		if (cached && Date.now() - cached.timestamp < this.TTL) {
			return cached.data;
		}
		return null;
	}

	setCachedData(key: string, data: any) {
		this.cache.set(key, { data, timestamp: Date.now() });
	}
}
```

### Database Optimization

- Index on `user_id` and `page_type` for fast queries
- JSONB indexing for complex queries on artifact content
- Partitioning by `page_type` for large datasets
- Connection pooling for concurrent users

## Security Considerations

### Data Access Control

```typescript
// lib/dashboard/access-control.ts
export async function validateArtifactAccess(
	userId: string,
	artifactId: string
) {
	const artifact = await getArtifact(artifactId);
	return artifact.userId === userId;
}

export async function validatePageAccess(userId: string, pageType: string) {
	// Implement page-specific access control
	const userPermissions = await getUserPermissions(userId);
	return userPermissions.includes(`dashboard:${pageType}`);
}
```

### Input Validation

```typescript
// lib/dashboard/validation.ts
export const dashboardQuerySchema = z.object({
	query: z.string().min(1).max(1000),
	pageType: z.enum([
		"overview",
		"competitors",
		"platforms",
		"insights",
		"reports",
	]),
	userId: z.string().uuid(),
});
```

## Testing Strategy (not a priority now)

### Unit Tests

```typescript
// tests/dashboard/artifact-manager.test.ts
describe("DashboardArtifactManager", () => {
	it("should save artifact to database", async () => {
		const manager = new DashboardArtifactManager();
		const artifact = {
			/* test artifact */
		};

		const result = await manager.saveArtifact("user-123", "overview", artifact);

		expect(result).toBeDefined();
	});
});
```

### Integration Tests (not a priority)

```typescript
// tests/dashboard/api.test.ts
describe("Dashboard API", () => {
	it("should process dashboard query and save artifacts", async () => {
		const response = await fetch("/api/dashboard/overview", {
			method: "POST",
			body: JSON.stringify({
				messages: [{ role: "user", content: "Show my GEO score" }],
				userId: "user-123",
			}),
		});

		expect(response.status).toBe(200);
		// Verify artifacts were saved to database
	});
});
```

## Deployment Considerations

### Environment Variables

```bash
# Required for dashboard functionality
DATABASE_URL=postgresql://...
DASHBOARD_CACHE_TTL=300000
DASHBOARD_MAX_ARTIFACTS_PER_USER=1000
DASHBOARD_EXPORT_ENABLED=true
```

### Monitoring

- Track artifact creation rates
- Monitor database query performance
- Alert on high error rates
- Track user engagement metrics

## Migration Strategy

### Phase 1: Foundation (Week 1-2)

1. Create database schema
2. Implement basic ChatCanvasLayout
3. Create first dashboard page (Overview)
4. Basic artifact persistence

### Phase 2: Core Features (Week 3-4)

1. All dashboard pages implemented
2. Enhanced GEO tools integration
3. Conversation history
4. Basic export functionality

### Phase 3: Advanced Features (Week 5-6)

1. Advanced analytics
2. Scheduled reports
3. Team collaboration
4. Performance optimization
