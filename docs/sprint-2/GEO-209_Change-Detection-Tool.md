# GEO-209: Change Detection Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P1 (Important) **Story Points**: 6  
**Estimated Time**: 10 hours **Assignee**: [Developer Name] **Sprint**: Sprint
2, Phase 2B  
**Dependencies**: GEO-208 (Website Scraping Tool)

## 🎯 User Story

As a **GEO analyst**, I want **accurate change detection** so that I can
**identify meaningful differences between website versions**.

## 📝 Description

Create a sophisticated change detection tool that compares website content
between different snapshots, generates detailed diffs, calculates change
severity, and provides structured change data for analysis. This tool will
handle text, HTML, metadata, and structural changes with high accuracy.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Compares website content between baseline and current snapshots
- [ ] **AC2**: Generates detailed diffs for text, HTML, and metadata changes
- [ ] **AC3**: Calculates change severity levels (low, medium, high, critical)
- [ ] **AC4**: Handles different content types (text, images, forms, links)
- [ ] **AC5**: Provides change categorization and classification
- [ ] **AC6**: Supports custom filters and change thresholds

### Data Structure Requirements

- [ ] **AC7**: Returns array of changes with type, path, old/new values, diff
- [ ] **AC8**: Includes change severity and confidence scores
- [ ] **AC9**: Provides change categorization and affected areas
- [ ] **AC10**: Includes change metadata (timestamp, location, context)
- [ ] **AC11**: Supports change aggregation and summary statistics
- [ ] **AC12**: Handles edge cases (new pages, deleted content, structural
      changes)

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
// lib/ai/tools/change-detection-tool.ts
export const changeDetectionTool = tool({
	description: "Sophisticated website change detection with diff analysis",
	inputSchema: z.object({
		baselineSnapshot: z.object({
			content: z.any(),
			metadata: z.any(),
			timestamp: z.string(),
			hash: z.string(),
		}),
		currentSnapshot: z.object({
			content: z.any(),
			metadata: z.any(),
			timestamp: z.string(),
			hash: z.string(),
		}),
		detectionMode: z
			.enum(["text", "html", "structure", "comprehensive"])
			.default("comprehensive"),
		changeThreshold: z.number().min(0).max(1).default(0.1),
		customFilters: z.array(z.string()).optional(),
		includeContext: z.boolean().default(true),
		severityWeights: z
			.object({
				text: z.number().min(0).max(1).default(0.3),
				structure: z.number().min(0).max(1).default(0.4),
				metadata: z.number().min(0).max(1).default(0.2),
				performance: z.number().min(0).max(1).default(0.1),
			})
			.optional(),
	}),
	handler: async (ctx, args) => {
		const {
			baselineSnapshot,
			currentSnapshot,
			detectionMode,
			changeThreshold,
			customFilters,
			includeContext,
			severityWeights,
		} = args;

		try {
			// Step 1: Validate snapshots and prepare comparison
			const comparisonConfig = await prepareComparisonConfig({
				baselineSnapshot,
				currentSnapshot,
				detectionMode,
				severityWeights,
			});

			// Step 2: Perform content comparison
			const contentChanges = await compareContent(
				baselineSnapshot.content,
				currentSnapshot.content,
				detectionMode
			);

			// Step 3: Compare metadata
			const metadataChanges = await compareMetadata(
				baselineSnapshot.metadata,
				currentSnapshot.metadata
			);

			// Step 4: Analyze structural changes
			const structuralChanges = await analyzeStructuralChanges(
				baselineSnapshot.content,
				currentSnapshot.content
			);

			// Step 5: Calculate change severity
			const changesWithSeverity = await calculateChangeSeverity(
				[...contentChanges, ...metadataChanges, ...structuralChanges],
				severityWeights
			);

			// Step 6: Apply custom filters
			const filteredChanges = await applyCustomFilters(
				changesWithSeverity,
				customFilters
			);

			// Step 7: Generate change summary
			const changeSummary = await generateChangeSummary(filteredChanges);

			// Step 8: Add context to changes
			const changesWithContext = includeContext
				? await addChangeContext(
						filteredChanges,
						baselineSnapshot,
						currentSnapshot
					)
				: filteredChanges;

			return {
				baselineTimestamp: baselineSnapshot.timestamp,
				currentTimestamp: currentSnapshot.timestamp,
				detectionMode,
				changes: changesWithContext,
				summary: changeSummary,
				changeAnalysis: {
					totalChanges: changesWithContext.length,
					severityDistribution:
						calculateSeverityDistribution(changesWithContext),
					changeTypes: calculateChangeTypeDistribution(changesWithContext),
					affectedAreas: identifyAffectedAreas(changesWithContext),
					changeVelocity: calculateChangeVelocity(
						baselineSnapshot,
						currentSnapshot
					),
				},
				metadata: {
					executionTime: Date.now(),
					category: "change-detection",
					changeThreshold,
					filtersApplied: customFilters || [],
					success: true,
				},
			};
		} catch (error) {
			throw new Error(`Change detection failed: ${error.message}`);
		}
	},
});
```

### Response Data Structure

```typescript
interface ChangeDetectionResult {
	baselineTimestamp: string;
	currentTimestamp: string;
	detectionMode: "text" | "html" | "structure" | "comprehensive";
	changes: Array<{
		id: string;
		type: "added" | "removed" | "modified" | "moved";
		category: "text" | "html" | "structure" | "metadata" | "performance";
		path: string;
		oldValue: string;
		newValue: string;
		diff: string;
		severity: "low" | "medium" | "high" | "critical";
		confidence: number;
		timestamp: string;
		context: {
			before: string;
			after: string;
			location: string;
		};
		affectedAreas: string[];
		impact: "positive" | "negative" | "neutral";
		description: string;
	}>;
	summary: {
		totalChanges: number;
		criticalChanges: number;
		highPriorityChanges: number;
		mediumPriorityChanges: number;
		lowPriorityChanges: number;
		changeCategories: Record<string, number>;
		mostAffectedAreas: string[];
		changeTrend: "increasing" | "decreasing" | "stable";
	};
	changeAnalysis: {
		totalChanges: number;
		severityDistribution: {
			critical: number;
			high: number;
			medium: number;
			low: number;
		};
		changeTypes: {
			text: number;
			structure: number;
			metadata: number;
			performance: number;
		};
		affectedAreas: string[];
		changeVelocity: number;
	};
	metadata: {
		executionTime: number;
		category: "change-detection";
		changeThreshold: number;
		filtersApplied: string[];
		success: boolean;
	};
}
```

### Detection Functions

```typescript
async function compareContent(
	baselineContent: any,
	currentContent: any,
	mode: string
): Promise<ContentChange[]> {
	const changes: ContentChange[] = [];

	switch (mode) {
		case "text":
			changes.push(
				...(await compareTextContent(baselineContent.text, currentContent.text))
			);
			break;
		case "html":
			changes.push(
				...(await compareHtmlContent(baselineContent.html, currentContent.html))
			);
			break;
		case "structure":
			changes.push(
				...(await compareStructuredData(
					baselineContent.structuredData,
					currentContent.structuredData
				))
			);
			break;
		case "comprehensive":
			changes.push(
				...(await compareTextContent(baselineContent.text, currentContent.text))
			);
			changes.push(
				...(await compareHtmlContent(baselineContent.html, currentContent.html))
			);
			changes.push(
				...(await compareStructuredData(
					baselineContent.structuredData,
					currentContent.structuredData
				))
			);
			break;
	}

	return changes;
}

async function compareTextContent(
	baselineText: string,
	currentText: string
): Promise<ContentChange[]> {
	const changes: ContentChange[] = [];

	// Use diff algorithm to find text differences
	const textDiff = await generateTextDiff(baselineText, currentText);

	textDiff.forEach((diff, index) => {
		changes.push({
			id: `text-${index}`,
			type: diff.type,
			category: "text",
			path: `text-content`,
			oldValue: diff.oldValue,
			newValue: diff.newValue,
			diff: diff.diff,
			severity: calculateTextChangeSeverity(diff),
			confidence: 0.9,
			timestamp: new Date().toISOString(),
			context: {
				before: diff.contextBefore,
				after: diff.contextAfter,
				location: diff.location,
			},
			affectedAreas: ["content"],
			impact: "neutral",
			description: `Text ${diff.type}: ${diff.summary}`,
		});
	});

	return changes;
}

async function calculateChangeSeverity(
	changes: any[],
	weights: any
): Promise<any[]> {
	return changes.map((change) => {
		let severityScore = 0;

		// Base severity from change type
		switch (change.type) {
			case "added":
				severityScore += 0.3;
				break;
			case "removed":
				severityScore += 0.5;
				break;
			case "modified":
				severityScore += 0.4;
				break;
		}

		// Adjust based on category weights
		switch (change.category) {
			case "text":
				severityScore *= weights.text;
				break;
			case "structure":
				severityScore *= weights.structure;
				break;
			case "metadata":
				severityScore *= weights.metadata;
				break;
			case "performance":
				severityScore *= weights.performance;
				break;
		}

		// Determine severity level
		let severity: "low" | "medium" | "high" | "critical";
		if (severityScore < 0.25) severity = "low";
		else if (severityScore < 0.5) severity = "medium";
		else if (severityScore < 0.75) severity = "high";
		else severity = "critical";

		return {
			...change,
			severity,
			severityScore,
		};
	});
}

async function generateChangeSummary(changes: any[]): Promise<ChangeSummary> {
	const totalChanges = changes.length;
	const criticalChanges = changes.filter(
		(c) => c.severity === "critical"
	).length;
	const highPriorityChanges = changes.filter(
		(c) => c.severity === "high"
	).length;
	const mediumPriorityChanges = changes.filter(
		(c) => c.severity === "medium"
	).length;
	const lowPriorityChanges = changes.filter((c) => c.severity === "low").length;

	const changeCategories = changes.reduce((acc, change) => {
		acc[change.category] = (acc[change.category] || 0) + 1;
		return acc;
	}, {});

	const mostAffectedAreas = identifyMostAffectedAreas(changes);
	const changeTrend = calculateChangeTrend(changes);

	return {
		totalChanges,
		criticalChanges,
		highPriorityChanges,
		mediumPriorityChanges,
		lowPriorityChanges,
		changeCategories,
		mostAffectedAreas,
		changeTrend,
	};
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("changeDetectionTool", () => {
	test("should compare website content between snapshots");
	test("should generate detailed diffs for text changes");
	test("should calculate change severity levels accurately");
	test("should handle different content types");
	test("should provide change categorization");
	test("should support custom filters");
	test("should include change context");
	test("should generate change summary");
	test("should handle edge cases gracefully");
	test("should validate input parameters correctly");
	test("should return properly structured response");
});
```

### Integration Tests

```typescript
describe("Change Detection Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with website monitoring agent");
	test("should work with website scraping results");
	test("should handle various change types");
});
```

## 🔗 Dependencies

- **Requires**: GEO-208 (Website Scraping Tool)
- **External**: Diff algorithms, text comparison libraries
- **Internal**: Change analysis utilities, severity calculation functions

## 📊 Performance Requirements

- **Response Time**: < 20 seconds for change detection
- **Data Size**: Response payload < 300 KB
- **Reliability**: > 95% accuracy in change detection
- **Concurrent Usage**: Support 20+ simultaneous change detection operations

## 🔍 Definition of Ready

- [ ] Website scraping tool is implemented
- [ ] Diff algorithms are available
- [ ] Change analysis utilities are implemented
- [ ] Test scenarios are defined
- [ ] Severity calculation logic is planned

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] Change detection accuracy meets requirements (>95%)
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Detect changes between website snapshots"
// Tool call with parameters:
{
	baselineSnapshot: baselineData,
	currentSnapshot: currentData,
	detectionMode: "comprehensive",
	changeThreshold: 0.1
}
```

### Advanced Usage

```typescript
// User query: "Analyze changes with custom filters and severity weights"
// Tool call with parameters:
{
	baselineSnapshot: baselineData,
	currentSnapshot: currentData,
	detectionMode: "comprehensive",
	changeThreshold: 0.05,
	customFilters: ["pricing", "features", "contact"],
	includeContext: true,
	severityWeights: {
		text: 0.4,
		structure: 0.3,
		metadata: 0.2,
		performance: 0.1
	}
}
```

## 📝 Notes

- Focus on accurate change detection and diff generation
- Implement robust severity calculation algorithms
- Consider performance optimization for large content comparisons
- Design for extensibility (future change detection methods)
- Ensure comprehensive change categorization and analysis

## 🔄 Follow-up Tasks

- **GEO-210**: Meaningful Change Analysis Tool
- **GEO-211**: Notification Management Tool
- **GEO-212**: Monitoring Scheduler Tool
