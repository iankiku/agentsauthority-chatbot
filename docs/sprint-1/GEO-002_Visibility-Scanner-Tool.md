# GEO-002: Visibility Scanner Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Blocker) **Story Points**: 2
**Estimated Time**: 2 hours **Assignee**: [Developer Name] **Sprint**: Sprint 1,
Day 1 **Dependencies**: GEO-001 (Multi-Model Client Setup)

## 🎯 User Story

As a **marketing manager**, I want to **scan my brand visibility across all AI
models with a single query** so that I can **quickly understand my brand's
presence in the AI ecosystem**.

## 📝 Description

Create a Vercel AI SDK tool that integrates with the multi-model client to
provide comprehensive brand visibility analysis. This tool will be the primary
interface for users to analyze their brand across ChatGPT, Claude, and Gemini.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Tool integrates with Vercel AI SDK tool() function
- [ ] **AC2**: Accepts brand name as required parameter
- [ ] **AC3**: Accepts optional custom queries array
- [ ] **AC4**: Accepts optional timeframe parameter (day/week/month)
- [ ] **AC5**: Uses MultiModelClient to query all models in parallel
- [ ] **AC6**: Returns structured data suitable for visualization
- [ ] **AC7**: Generates actionable insights based on results
- [ ] **AC8**: Provides platform-specific optimization recommendations
- [ ] **AC9**: Handles edge cases (no mentions, API failures, etc.)

### Data Structure Requirements

- [ ] **AC10**: Returns brand name and timestamp
- [ ] **AC11**: Returns individual model results with scores
- [ ] **AC12**: Calculates overall visibility score
- [ ] **AC13**: Provides insights array with explanations
- [ ] **AC14**: Includes recommendations for improvement
- [ ] **AC15**: Tags results for future dashboard categorization

### Integration Requirements

- [ ] **AC16**: Works seamlessly with existing chat interface
- [ ] **AC17**: Tool description is clear and discoverable
- [ ] **AC18**: Parameter validation using Zod schemas
- [ ] **AC19**: Error responses are user-friendly
- [ ] **AC20**: Response format supports artifact generation

## 🛠️ Technical Implementation

### File Structure

```
lib/
├── ai/
│   └── tools/
│       ├── visibility-across-models-tool.ts    # Main tool implementation
│       ├── types.ts                            # Tool-specific types
│       └── utils.ts                            # Helper functions
├── __tests__/
│   └── visibility-tool.test.ts                 # Unit tests
```

### Tool Implementation

```typescript
export const visibilityAcrossModelsTool = tool({
	description:
		"Scan brand visibility across ChatGPT, Claude, Gemini, and Perplexity with real-time analysis",
	parameters: z.object({
		brandName: z.string().min(1).max(100),
		queries: z.array(z.string()).optional().default([]),
		timeframe: z.enum(["day", "week", "month"]).default("week"),
		includeRecommendations: z.boolean().default(true),
	}),
	execute: async ({
		brandName,
		queries,
		timeframe,
		includeRecommendations,
	}) => {
		// Implementation details
	},
});
```

### Response Data Structure

```typescript
interface VisibilityAnalysisResult {
	brandName: string;
	timestamp: string;
	timeframe: string;
	modelResults: ModelResult[];
	overallVisibility: number;
	insights: string[];
	recommendations: string[];
	metadata: {
		executionTime: number;
		modelsQueried: string[];
		queriesUsed: string[];
		category: "visibility-analysis";
	};
}
```

### Query Generation Logic

```typescript
function generateQueries(
	brandName: string,
	customQueries?: string[]
): string[] {
	const defaultQueries = [
		`Tell me about ${brandName}`,
		`What is ${brandName} known for?`,
		`How would you describe ${brandName}?`,
		`What are the key features of ${brandName}?`,
	];

	return customQueries && customQueries.length > 0
		? customQueries
		: defaultQueries;
}
```

### Insight Generation

```typescript
function generateInsights(results: ModelResult[], brandName: string): string[] {
	const insights = [];

	// Visibility insights
	const avgScore =
		results.reduce((sum, r) => sum + r.visibility_score, 0) / results.length;
	if (avgScore > 70)
		insights.push(
			`Strong visibility across AI platforms (${avgScore.toFixed(1)}/100)`
		);

	// Sentiment insights
	const sentiments = results.map((r) => r.sentiment);
	const positiveCount = sentiments.filter((s) => s === "positive").length;
	if (positiveCount > results.length / 2) {
		insights.push(
			`Positive sentiment dominant across ${positiveCount}/${results.length} models`
		);
	}

	// Model-specific insights
	const bestModel = results.reduce((best, current) =>
		current.visibility_score > best.visibility_score ? current : best
	);
	insights.push(
		`Strongest performance on ${bestModel.model} (${bestModel.visibility_score}/100)`
	);

	return insights;
}
```

## 🧪 Testing Strategy (skip all unit/integration/feature testing implementation)

### Unit Tests

```typescript
describe("visibilityAcrossModelsTool", () => {
	test("should accept valid parameters");
	test("should validate brand name requirements");
	test("should use default queries when none provided");
	test("should generate appropriate insights");
	test("should handle multi-model client errors");
	test("should return properly structured response");
});
```

### Integration Tests

```typescript
describe("Visibility Tool Integration", () => {
	test("should work with real multi-model client");
	test("should integrate with Vercel AI SDK");
	test("should handle timeout scenarios");
	test("should work with existing chat interface");
});
```

### Test Scenarios

```typescript
const testScenarios = [
	{
		name: "Well-known brand",
		brandName: "Apple",
		expectedVisibility: "high",
		expectedInsights: ["Strong visibility", "Positive sentiment"],
	},
	{
		name: "Unknown brand",
		brandName: "RandomBrandXYZ123",
		expectedVisibility: "low",
		expectedInsights: ["Limited visibility", "Consider content strategy"],
	},
	{
		name: "Custom queries",
		brandName: "Tesla",
		queries: ["Tesla electric vehicles", "Tesla innovation"],
		expectedBehavior: "uses custom queries instead of defaults",
	},
];
```

## 🔗 Dependencies

- **Requires**: GEO-001 (Multi-Model Client) must be completed
- **External**: Vercel AI SDK, Zod validation
- **Internal**: Existing chat system and tool registration

## 📊 Performance Requirements

- **Response Time**: < 12 seconds total (including multi-model queries)
- **Data Size**: Response payload < 50KB
- **Reliability**: > 90% success rate with proper error handling
- **Concurrent Usage**: Support 10+ simultaneous analyses

## 🔍 Definition of Ready

- [ ] GEO-001 (Multi-Model Client) is completed and tested
- [ ] Vercel AI SDK tool system is understood
- [ ] Test brand scenarios are defined
- [ ] Response data structure is approved

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with multi-model client passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful
- [ ] Documentation includes usage examples

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Show my brand visibility across AI models"
// Tool call with parameters:
{
  brandName: "Acme Corp",
  timeframe: "week"
}
```

### Advanced Usage

```typescript
// User query: "Check how Tesla is perceived across AI platforms for electric vehicles"
// Tool call with parameters:
{
  brandName: "Tesla",
  queries: ["Tesla electric vehicles", "Tesla sustainability", "Tesla innovation"],
  timeframe: "month",
  includeRecommendations: true
}
```

## 📝 Notes

- Focus on clear, actionable insights
- Ensure responses are suitable for artifact generation
- Consider rate limiting implications with multiple API calls
- Design for extensibility (future model additions)

## 🔄 Follow-up Tasks

- **GEO-003**: Create Visibility Matrix Artifact component
- **GEO-017**: Add Perplexity model support (future sprint)
- **GEO-018**: Implement result caching (future sprint)
