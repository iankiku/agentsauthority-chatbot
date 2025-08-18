# GEO-203: Multi-Provider Analysis Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Critical) **Story Points**: 10  
**Estimated Time**: 16 hours **Assignee**: [Developer Name] **Sprint**: Sprint
2, Phase 2A  
**Dependencies**: None

## 🎯 User Story

As a **GEO analyst**, I want **multi-provider AI analysis** so that I can **get
comprehensive brand visibility across all major AI platforms**.

## 📝 Description

Create a multi-provider AI analysis tool that queries OpenAI, Claude, Gemini,
and Perplexity in parallel to analyze brand visibility. This tool will provide
consistent analysis across all providers, handle API rate limits gracefully,
implement intelligent caching, and return structured results with confidence
scores.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Queries OpenAI, Claude, Gemini, and Perplexity in parallel
- [ ] **AC2**: Handles API rate limits and failures gracefully
- [ ] **AC3**: Provides consistent analysis across all providers
- [ ] **AC4**: Returns structured results with confidence scores
- [ ] **AC5**: Supports custom prompts and analysis parameters
- [ ] **AC6**: Implements intelligent caching for cost optimization

### Data Structure Requirements

- [ ] **AC7**: Returns array of provider results with response, mentions,
      context
- [ ] **AC8**: Includes sentiment analysis (positive/neutral/negative) for each
      provider
- [ ] **AC9**: Provides visibility scores (0-100) for each provider
- [ ] **AC10**: Includes execution time and success status for each provider
- [ ] **AC11**: Aggregates results across providers with consensus scoring
- [ ] **AC12**: Tags results for provider-specific analysis

### Integration Requirements

- [ ] **AC13**: Works seamlessly with existing chat interface
- [ ] **AC14**: Tool description is clear and discoverable
- [ ] **AC15**: Parameter validation using Zod schemas
- [ ] **AC16**: Error responses are user-friendly and actionable
- [ ] **AC17**: Response format supports artifact generation
- [ ] **AC18**: Integrates with brand monitoring agent workflow

## 🛠️ Technical Implementation

### Tool Implementation

```typescript
// lib/ai/tools/multi-provider-analysis-tool.ts
export const multiProviderAnalysisTool = tool({
	description: "Multi-AI provider brand analysis with parallel processing",
	inputSchema: z.object({
		brandName: z.string().min(1).max(100),
		competitors: z.array(z.string()).min(1).max(20),
		prompts: z.array(z.string()).min(1).max(10),
		providers: z
			.array(z.enum(["openai", "claude", "gemini", "perplexity"]))
			.optional(),
		analysisType: z
			.enum(["visibility", "sentiment", "positioning", "comprehensive"])
			.default("comprehensive"),
		cacheResults: z.boolean().default(true),
	}),
	handler: async (ctx, args) => {
		const {
			brandName,
			competitors,
			prompts,
			providers,
			analysisType,
			cacheResults,
		} = args;

		try {
			// Step 1: Validate and prepare providers
			const activeProviders = await validateAndPrepareProviders(providers);

			// Step 2: Check cache for existing results
			if (cacheResults) {
				const cachedResults = await checkCache(
					brandName,
					competitors,
					prompts,
					analysisType
				);
				if (cachedResults) {
					return cachedResults;
				}
			}

			// Step 3: Generate analysis prompts
			const analysisPrompts = await generateAnalysisPrompts(
				brandName,
				competitors,
				prompts,
				analysisType
			);

			// Step 4: Execute parallel provider analysis
			const providerResults = await executeParallelAnalysis(
				activeProviders,
				analysisPrompts
			);

			// Step 5: Process and standardize results
			const processedResults = await processProviderResults(
				providerResults,
				brandName,
				competitors
			);

			// Step 6: Aggregate and score results
			const aggregatedResults = await aggregateResults(
				processedResults,
				analysisType
			);

			// Step 7: Cache results if enabled
			if (cacheResults) {
				await cacheResults(
					aggregatedResults,
					brandName,
					competitors,
					prompts,
					analysisType
				);
			}

			return {
				brandName,
				competitors,
				analysisType,
				providerResults: processedResults,
				aggregatedResults,
				metadata: {
					totalProviders: activeProviders.length,
					successfulProviders: processedResults.filter((r) => r.success).length,
					executionTime: Date.now(),
					cacheHit: false,
					category: "multi-provider-analysis",
				},
			};
		} catch (error) {
			throw new Error(`Multi-provider analysis failed: ${error.message}`);
		}
	},
});
```

### Response Data Structure

```typescript
interface MultiProviderAnalysisResult {
	brandName: string;
	competitors: string[];
	analysisType: "visibility" | "sentiment" | "positioning" | "comprehensive";
	providerResults: Array<{
		provider: string;
		response: string;
		mentions: number;
		context: string[];
		sentiment: "positive" | "neutral" | "negative";
		visibility_score: number;
		execution_time: number;
		success: boolean;
		error?: string;
		confidence: number;
		keyInsights: string[];
		recommendations: string[];
	}>;
	aggregatedResults: {
		overallVisibilityScore: number;
		consensusSentiment: "positive" | "neutral" | "negative";
		providerAgreement: number;
		topInsights: string[];
		keyRecommendations: string[];
		competitivePosition: string;
		marketOpportunities: string[];
	};
	metadata: {
		totalProviders: number;
		successfulProviders: number;
		executionTime: number;
		cacheHit: boolean;
		category: "multi-provider-analysis";
	};
}
```

### Provider Management Functions

```typescript
async function validateAndPrepareProviders(
	requestedProviders?: string[]
): Promise<ProviderConfig[]> {
	const allProviders = [
		{ name: "openai", apiKey: process.env.OPENAI_API_KEY, enabled: true },
		{ name: "claude", apiKey: process.env.ANTHROPIC_API_KEY, enabled: true },
		{ name: "gemini", apiKey: process.env.GOOGLE_API_KEY, enabled: true },
		{
			name: "perplexity",
			apiKey: process.env.PERPLEXITY_API_KEY,
			enabled: true,
		},
	];

	const availableProviders = allProviders.filter((p) => p.apiKey && p.enabled);

	if (requestedProviders) {
		return availableProviders.filter((p) =>
			requestedProviders.includes(p.name)
		);
	}

	return availableProviders;
}

async function executeParallelAnalysis(
	providers: ProviderConfig[],
	prompts: AnalysisPrompt[]
): Promise<ProviderResult[]> {
	const analysisPromises = providers.map(async (provider) => {
		try {
			const startTime = Date.now();
			const results = await Promise.all(
				prompts.map((prompt) => queryProvider(provider, prompt))
			);
			const executionTime = Date.now() - startTime;

			return {
				provider: provider.name,
				results,
				executionTime,
				success: true,
			};
		} catch (error) {
			return {
				provider: provider.name,
				error: error.message,
				success: false,
			};
		}
	});

	return Promise.all(analysisPromises);
}

async function processProviderResults(
	providerResults: ProviderResult[],
	brandName: string,
	competitors: string[]
): Promise<ProcessedProviderResult[]> {
	return providerResults.map((result) => {
		if (!result.success) {
			return {
				provider: result.provider,
				success: false,
				error: result.error,
			};
		}

		// Process each provider's results
		const processedResults = result.results.map((analysis) => {
			const mentions = countBrandMentions(
				analysis.response,
				brandName,
				competitors
			);
			const sentiment = analyzeSentiment(analysis.response, brandName);
			const visibilityScore = calculateVisibilityScore(
				analysis.response,
				brandName,
				competitors
			);
			const context = extractContext(analysis.response, brandName);

			return {
				response: analysis.response,
				mentions,
				context,
				sentiment,
				visibility_score: visibilityScore,
				confidence: analysis.confidence || 0.8,
				keyInsights: extractKeyInsights(analysis.response),
				recommendations: extractRecommendations(analysis.response),
			};
		});

		return {
			provider: result.provider,
			success: true,
			...processedResults[0], // For now, use first result
			execution_time: result.executionTime,
		};
	});
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("multiProviderAnalysisTool", () => {
	test("should query multiple AI providers in parallel");
	test("should handle provider failures gracefully");
	test("should provide consistent analysis across providers");
	test("should return structured results with confidence scores");
	test("should support custom prompts and parameters");
	test("should implement intelligent caching");
	test("should handle rate limits correctly");
	test("should aggregate results across providers");
	test("should validate input parameters correctly");
	test("should handle missing provider API keys");
	test("should provide fallback when providers are unavailable");
});
```

### Integration Tests

```typescript
describe("Multi-Provider Analysis Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with brand monitoring agent");
	test("should handle concurrent requests");
	test("should cache results appropriately");
});
```

## 🔗 Dependencies

- **Requires**: None
- **External**: OpenAI API, Claude API, Gemini API, Perplexity API
- **Internal**: Caching system, provider management utilities, result processing
  functions

## 📊 Performance Requirements

- **Response Time**: < 45 seconds for multi-provider analysis
- **Data Size**: Response payload < 300 KB
- **Reliability**: > 85% success rate (with provider fallbacks)
- **Concurrent Usage**: Support 15+ simultaneous executions

## 🔍 Definition of Ready

- [ ] All AI provider APIs are configured and accessible
- [ ] Caching system is implemented
- [ ] Provider management utilities are available
- [ ] Test scenarios are defined
- [ ] Rate limiting strategies are planned

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] Parallel processing works efficiently
- [ ] Caching system functions correctly
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Analyze Tesla brand visibility across AI providers"
// Tool call with parameters:
{
  brandName: "Tesla",
  competitors: ["Ford", "GM", "Volkswagen", "BMW"],
  prompts: ["Analyze brand visibility and market positioning"],
  analysisType: "comprehensive"
}
```

### Advanced Usage

```typescript
// User query: "Compare Tesla sentiment across specific providers"
// Tool call with parameters:
{
  brandName: "Tesla",
  competitors: ["Ford", "GM", "Volkswagen"],
  prompts: [
    "Analyze brand sentiment and public perception",
    "Compare technology innovation positioning",
    "Evaluate sustainability messaging effectiveness"
  ],
  providers: ["openai", "claude", "perplexity"],
  analysisType: "sentiment",
  cacheResults: true
}
```

## 📝 Notes

- Focus on parallel processing for optimal performance
- Implement robust error handling for provider failures
- Consider rate limiting and cost optimization strategies
- Design for extensibility (future AI providers)
- Ensure consistent result formatting across providers

## 🔄 Follow-up Tasks

- **GEO-204**: Brand Detection Tool
- **GEO-205**: SSE Infrastructure Setup
- **GEO-206**: Visibility Scoring Tool
