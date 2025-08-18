# GEO-201: Brand Monitor Agent Foundation

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Critical) **Story Points**: 5  
**Estimated Time**: 8 hours **Assignee**: [Developer Name] **Sprint**: Sprint 2,
Phase 2A  
**Dependencies**: None (foundational)

## 🎯 User Story

As a **GEO analyst**, I want a **brand monitoring agent** so that I can **get
comprehensive brand visibility analysis with real-time progress updates**.

## 📝 Description

Create the foundational brand monitoring agent that orchestrates the entire
brand monitoring workflow. This agent will coordinate competitor identification,
multi-provider AI analysis, brand detection, and visibility scoring. It will
provide real-time SSE progress updates and integrate seamlessly with the
existing chat artifacts system.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Agent can be invoked through chat interface with brand name and
      website URL
- [ ] **AC2**: Agent orchestrates competitor identification process
      automatically
- [ ] **AC3**: Agent manages multi-provider AI analysis workflow (OpenAI,
      Claude, Gemini, Perplexity)
- [ ] **AC4**: Agent provides real-time SSE progress updates for each analysis
      stage
- [ ] **AC5**: Agent handles errors gracefully and provides user-friendly
      feedback
- [ ] **AC6**: Agent integrates with existing chat artifacts system for result
      display

### Technical Requirements

- [ ] **AC7**: Agent uses Vercel AI SDK tool() function for integration
- [ ] **AC8**: Agent accepts brandName, websiteUrl, customPrompts, and
      competitors as parameters
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
├── brand-monitor-agent.ts          # Main agent orchestration
├── competitor-identification-tool.ts # Competitor identification
├── multi-provider-analysis-tool.ts  # Multi-AI provider analysis
├── brand-detection-tool.ts          # Brand mention detection
└── visibility-scoring-tool.ts       # Visibility scoring
```

### Agent Implementation

```typescript
// lib/ai/tools/brand-monitor-agent.ts
export const brandMonitorAgent = tool({
	description: "Comprehensive brand monitoring with multi-provider AI analysis",
	inputSchema: z.object({
		brandName: z.string().min(1).max(100),
		websiteUrl: z.string().url(),
		customPrompts: z.array(z.string()).optional(),
		competitors: z.array(z.string()).optional(),
	}),
	handler: async (ctx, args) => {
		const { brandName, websiteUrl, customPrompts, competitors } = args;

		// Initialize SSE connection for progress updates
		const sseConnection = await initializeSSEConnection(ctx);

		try {
			// Step 1: Competitor Identification
			await sseConnection.sendProgress("Identifying competitors...", 10);
			const identifiedCompetitors = await identifyCompetitors(
				brandName,
				websiteUrl
			);

			// Step 2: Multi-Provider Analysis
			await sseConnection.sendProgress("Analyzing brand visibility...", 30);
			const analysisResults = await performMultiProviderAnalysis(
				brandName,
				identifiedCompetitors,
				customPrompts
			);

			// Step 3: Brand Detection
			await sseConnection.sendProgress("Detecting brand mentions...", 60);
			const brandDetectionResults = await detectBrandMentions(
				analysisResults,
				brandName
			);

			// Step 4: Visibility Scoring
			await sseConnection.sendProgress("Calculating visibility scores...", 80);
			const visibilityScores = await calculateVisibilityScores(
				brandName,
				identifiedCompetitors,
				brandDetectionResults
			);

			// Step 5: Final Results
			await sseConnection.sendProgress("Generating final report...", 100);

			return {
				brandName,
				websiteUrl,
				competitors: identifiedCompetitors,
				analysisResults,
				brandDetectionResults,
				visibilityScores,
				metadata: {
					executionTime: Date.now(),
					category: "brand-monitoring",
					totalCompetitors: identifiedCompetitors.length,
					analysisProviders: ["openai", "claude", "gemini", "perplexity"],
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
interface BrandMonitorResult {
	brandName: string;
	websiteUrl: string;
	competitors: Array<{
		name: string;
		description: string;
		confidence: number;
		businessModel: string;
	}>;
	analysisResults: Array<{
		provider: string;
		response: string;
		mentions: number;
		context: string[];
		sentiment: "positive" | "neutral" | "negative";
		visibility_score: number;
		execution_time: number;
		success: boolean;
	}>;
	brandDetectionResults: Array<{
		text: string;
		brandName: string;
		confidence: number;
		context: string;
		sentiment: "positive" | "neutral" | "negative";
	}>;
	visibilityScores: {
		brandScore: number;
		competitorScores: Record<string, number>;
		shareOfVoice: number;
		competitivePosition: string;
		recommendations: string[];
	};
	metadata: {
		executionTime: number;
		category: "brand-monitoring";
		totalCompetitors: number;
		analysisProviders: string[];
	};
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("brandMonitorAgent", () => {
	test("should orchestrate complete brand monitoring workflow");
	test("should handle missing competitors gracefully");
	test("should provide real-time progress updates via SSE");
	test("should handle AI provider failures gracefully");
	test("should return properly structured response");
	test("should validate input parameters correctly");
	test("should handle custom prompts when provided");
	test("should integrate with existing chat artifacts system");
});
```

### Integration Tests

```typescript
describe("Brand Monitor Agent Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should handle SSE connection management");
	test("should coordinate with all dependent tools");
});
```

## 🔗 Dependencies

- **Requires**: None (foundational agent)
- **External**: OpenAI API, Claude API, Gemini API, Perplexity API
- **Internal**: SSE infrastructure, chat artifacts system, competitor
  identification tool, multi-provider analysis tool, brand detection tool,
  visibility scoring tool

## 📊 Performance Requirements

- **Response Time**: < 60 seconds for complete analysis
- **Data Size**: Response payload < 500 KB
- **Reliability**: > 95% success rate
- **Concurrent Usage**: Support 10+ simultaneous executions

## 🔍 Definition of Ready

- [ ] SSE infrastructure is available
- [ ] Competitor identification tool is implemented
- [ ] Multi-provider analysis tool is implemented
- [ ] Brand detection tool is implemented
- [ ] Visibility scoring tool is implemented
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
// User query: "Monitor brand visibility for Tesla"
// Tool call with parameters:
{
  brandName: "Tesla",
  websiteUrl: "https://tesla.com"
}
```

### Advanced Usage

```typescript
// User query: "Analyze Tesla against competitors with custom prompts"
// Tool call with parameters:
{
  brandName: "Tesla",
  websiteUrl: "https://tesla.com",
  customPrompts: [
    "Focus on electric vehicle market positioning",
    "Analyze sustainability messaging",
    "Compare technology innovation"
  ],
  competitors: ["Ford", "GM", "Volkswagen"]
}
```

## 📝 Notes

- Focus on orchestration and coordination of dependent tools
- Ensure real-time progress updates are informative and accurate
- Consider rate limiting and API cost optimization
- Design for extensibility (future monitoring capabilities)
- Implement proper error recovery and retry logic

## 🔄 Follow-up Tasks

- **GEO-202**: Competitor Identification Tool
- **GEO-203**: Multi-Provider Analysis Tool
- **GEO-204**: Brand Detection Tool
- **GEO-205**: SSE Infrastructure Setup
- **GEO-206**: Visibility Scoring Tool
