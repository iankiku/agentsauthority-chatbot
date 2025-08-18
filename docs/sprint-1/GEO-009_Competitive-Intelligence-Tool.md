# GEO-009: Competitive Intelligence Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Blocker) **Story Points**: 2
**Estimated Time**: 2 hours **Assignee**: [Developer Name] **Sprint**: Sprint 1,
Day 3 **Dependencies**: GEO-006 (Brand Monitor Tool), GEO-008 (Keyword
Opportunity Scanner)

## 🎯 User Story

As a **marketing manager**, I want to **analyze my competitive positioning
against key competitors across AI platforms** so that I can **identify
opportunities and threats in the AI search landscape**.

## 📝 Description

Create a sophisticated competitive intelligence tool that analyzes multiple
brands simultaneously across AI platforms, providing market positioning, share
of voice, and strategic recommendations. This tool will be the foundation for
competitive analysis artifacts.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Tool integrates with Vercel AI SDK tool() function
- [ ] **AC2**: Accepts primary brand name and competitor array as parameters
- [ ] **AC3**: Analyzes all brands across ChatGPT, Claude, Gemini simultaneously
- [ ] **AC4**: Calculates market share and competitive positioning metrics
- [ ] **AC5**: Identifies competitive gaps and opportunities
- [ ] **AC6**: Generates strategic recommendations for competitive advantage
- [ ] **AC7**: Handles edge cases (no competitors, API failures, etc.)
- [ ] **AC8**: Returns structured data suitable for visualization

### Data Structure Requirements

- [ ] **AC9**: Returns competitive positioning matrix
- [ ] **AC10**: Calculates share of voice percentages
- [ ] **AC11**: Provides gap analysis with specific opportunities
- [ ] **AC12**: Includes historical trend indicators
- [ ] **AC13**: Generates actionable strategic recommendations
- [ ] **AC14**: Tags results for dashboard categorization

### Integration Requirements

- [ ] **AC15**: Works seamlessly with existing chat interface
- [ ] **AC16**: Tool description is clear and discoverable
- [ ] **AC17**: Parameter validation using Zod schemas
- [ ] **AC18**: Error responses are user-friendly
- [ ] **AC19**: Response format supports artifact generation
- [ ] **AC20**: Integrates with multi-model client for parallel analysis

## 🛠️ Technical Implementation

### File Structure

```
lib/
├── ai/
│   └── tools/
│       ├── competitive-intelligence-tool.ts    # Main tool implementation
│       └── types.ts                            # Tool-specific types
├── __tests__/
│   └── competitive-intelligence.test.ts        # Unit tests
```

### Tool Implementation

```typescript
export const competitiveIntelligenceTool = tool({
	description:
		"Analyze competitive positioning and market share across AI platforms with multi-brand comparison",
	parameters: z.object({
		primaryBrand: z.string().min(1).max(100),
		competitors: z.array(z.string()).min(1).max(10),
		industry: z.string().optional(),
		timeframe: z.enum(["week", "month", "quarter"]).default("week"),
		includeRecommendations: z.boolean().default(true),
	}),
	execute: async ({
		primaryBrand,
		competitors,
		industry,
		timeframe,
		includeRecommendations,
	}) => {
		// Implementation details
	},
});
```

### Response Data Structure

```typescript
interface CompetitiveAnalysisResult {
	primaryBrand: string;
	competitors: string[];
	industry: string;
	timeframe: string;
	marketPosition: {
		overallRank: number;
		totalCompetitors: number;
		marketShare: number;
		competitiveScore: number;
	};
	shareOfVoice: {
		primaryBrand: number;
		competitors: Array<{
			name: string;
			share: number;
			rank: number;
			change: string;
		}>;
	};
	competitiveGaps: Array<{
		category: string;
		opportunity: string;
		impact: "high" | "medium" | "low";
		effort: "high" | "medium" | "low";
	}>;
	strategicRecommendations: string[];
	metadata: {
		executionTime: number;
		modelsQueried: string[];
		category: "competitive-analysis";
	};
}
```

### Competitive Analysis Logic

```typescript
function analyzeCompetitivePosition(
	primaryResults: ModelResult[],
	competitorResults: Record<string, ModelResult[]>
): CompetitiveAnalysis {
	// Calculate overall scores for each brand
	const brandScores = {
		[primaryBrand]: calculateOverallScore(primaryResults),
		...Object.fromEntries(
			Object.entries(competitorResults).map(([brand, results]) => [
				brand,
				calculateOverallScore(results),
			])
		),
	};

	// Determine market positioning
	const sortedBrands = Object.entries(brandScores)
		.sort(([, a], [, b]) => b - a)
		.map(([brand]) => brand);

	const primaryRank = sortedBrands.indexOf(primaryBrand) + 1;
	const marketShare = calculateMarketShare(brandScores, primaryBrand);

	// Identify competitive gaps
	const gaps = identifyCompetitiveGaps(primaryResults, competitorResults);

	return {
		marketPosition: {
			overallRank: primaryRank,
			totalCompetitors: sortedBrands.length,
			marketShare,
			competitiveScore: brandScores[primaryBrand],
		},
		shareOfVoice: calculateShareOfVoice(brandScores),
		competitiveGaps: gaps,
		strategicRecommendations: generateStrategicRecommendations(
			gaps,
			primaryRank
		),
	};
}
```

## 🧪 Testing Strategy (skip all unit/integration/feature testing implementation)

### Unit Tests

```typescript
describe("competitiveIntelligenceTool", () => {
	test("should analyze competitive positioning correctly");
	test("should calculate market share accurately");
	test("should identify competitive gaps");
	test("should generate strategic recommendations");
	test("should handle multiple competitors");
	test("should validate input parameters");
	test("should handle API failures gracefully");
	test("should return properly structured response");
});
```

### Integration Tests

```typescript
describe("Competitive Intelligence Tool Integration", () => {
	test("should work with multi-model client");
	test("should integrate with Vercel AI SDK");
	test("should create competitive analysis artifacts");
	test("should work with existing chat interface");
});
```

### Test Scenarios

```typescript
const testScenarios = [
	{
		name: "Market leader analysis",
		primaryBrand: "Apple",
		competitors: ["Samsung", "Google", "Microsoft"],
		expectedRank: "top 2",
		expectedInsights: ["market leadership", "competitive advantage"],
	},
	{
		name: "Challenger brand analysis",
		primaryBrand: "Tesla",
		competitors: ["Toyota", "Ford", "GM"],
		expectedRank: "middle tier",
		expectedInsights: ["disruption opportunity", "innovation gap"],
	},
	{
		name: "Niche player analysis",
		primaryBrand: "Slack",
		competitors: ["Microsoft Teams", "Zoom", "Discord"],
		expectedRank: "specialized",
		expectedInsights: ["niche positioning", "feature differentiation"],
	},
];
```

## 🔗 Dependencies

- **Requires**: GEO-006 (Brand Monitor Tool), GEO-008 (Keyword Opportunity
  Scanner)
- **External**: Multi-model client, Vercel AI SDK
- **Internal**: Existing chat system, artifact generation

## 📊 Performance Requirements

- **Response Time**: < 15 seconds for 4-brand analysis
- **Data Size**: Response payload < 100KB
- **Reliability**: > 90% success rate with proper error handling
- **Concurrent Usage**: Support 5+ simultaneous analyses

## 🔍 Definition of Ready

- [ ] GEO-006 (Brand Monitor Tool) is completed and tested
- [ ] GEO-008 (Keyword Opportunity Scanner) is completed and tested
- [ ] Multi-model client supports parallel brand analysis
- [ ] Test competitive scenarios are defined

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
// User query: "Compare my brand against Apple, Samsung, and Google"
// Tool call with parameters:
{
  primaryBrand: "Tesla",
  competitors: ["Apple", "Samsung", "Google"],
  timeframe: "week"
}
```

### Advanced Usage

```typescript
// User query: "Analyze competitive positioning in the electric vehicle market"
// Tool call with parameters:
{
  primaryBrand: "Tesla",
  competitors: ["Ford", "GM", "Toyota", "Volkswagen"],
  industry: "electric vehicles",
  timeframe: "month",
  includeRecommendations: true
}
```

## 📝 Notes

- Focus on actionable competitive insights
- Ensure responses are suitable for artifact generation
- Consider rate limiting implications with multiple brand analysis
- Design for extensibility (future competitor discovery)

## 🔄 Follow-up Tasks

- **GEO-010**: Create Competitive Analysis Artifact component
- **GEO-023**: Add automated competitor discovery (future sprint)
- **GEO-024**: Implement competitive alerting (future sprint)
