# GEO-210: Meaningful Change Analysis Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P1 (Important) **Story Points**: 7  
**Estimated Time**: 12 hours **Assignee**: [Developer Name] **Sprint**: Sprint
2, Phase 2B  
**Dependencies**: GEO-209 (Change Detection Tool)

## 🎯 User Story

As a **GEO analyst**, I want **AI-powered meaningful change analysis** so that I
can **understand the business impact of website changes**.

## 📝 Description

Create an AI-powered meaningful change analysis tool that uses multiple AI
providers to analyze website changes, determine their business impact, provide
actionable insights, and generate recommendations. This tool will filter out
noise and focus on changes that matter to business objectives.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Analyzes website changes using multiple AI providers
- [ ] **AC2**: Determines business impact and significance of changes
- [ ] **AC3**: Provides actionable insights and recommendations
- [ ] **AC4**: Filters out noise and irrelevant changes
- [ ] **AC5**: Categorizes changes by business impact and priority
- [ ] **AC6**: Generates change summaries and trend analysis

### Data Structure Requirements

- [ ] **AC7**: Returns meaningful changes with business impact analysis
- [ ] **AC8**: Includes AI provider consensus and confidence scores
- [ ] **AC9**: Provides actionable recommendations with priority levels
- [ ] **AC10**: Includes change categorization and business context
- [ ] **AC11**: Supports trend analysis and pattern recognition
- [ ] **AC12**: Handles different business contexts and objectives

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
// lib/ai/tools/meaningful-change-analysis-tool.ts
export const meaningfulChangeAnalysisTool = tool({
	description:
		"AI-powered meaningful change analysis with business impact assessment",
	inputSchema: z.object({
		changes: z.array(z.any()),
		websiteUrl: z.string().url(),
		businessContext: z
			.object({
				industry: z.string().optional(),
				businessType: z
					.enum(["b2b", "b2c", "ecommerce", "saas", "other"])
					.optional(),
				keyMetrics: z.array(z.string()).optional(),
				objectives: z.array(z.string()).optional(),
			})
			.optional(),
		analysisProviders: z
			.array(z.enum(["openai", "claude", "gemini", "perplexity"]))
			.optional(),
		impactThreshold: z.number().min(0).max(1).default(0.3),
		includeTrends: z.boolean().default(true),
		analysisDepth: z
			.enum(["basic", "comprehensive", "expert"])
			.default("comprehensive"),
	}),
	handler: async (ctx, args) => {
		const {
			changes,
			websiteUrl,
			businessContext,
			analysisProviders,
			impactThreshold,
			includeTrends,
			analysisDepth,
		} = args;

		try {
			// Step 1: Filter and preprocess changes
			const filteredChanges = await filterRelevantChanges(
				changes,
				impactThreshold
			);

			// Step 2: Analyze changes with multiple AI providers
			const aiAnalysisResults = await analyzeChangesWithAI(
				filteredChanges,
				websiteUrl,
				businessContext,
				analysisProviders
			);

			// Step 3: Determine business impact
			const impactAnalysis = await determineBusinessImpact(
				filteredChanges,
				aiAnalysisResults,
				businessContext
			);

			// Step 4: Generate actionable insights
			const insights = await generateActionableInsights(
				impactAnalysis,
				businessContext,
				analysisDepth
			);

			// Step 5: Categorize and prioritize changes
			const categorizedChanges = await categorizeChanges(
				impactAnalysis,
				businessContext
			);

			// Step 6: Analyze trends (if enabled)
			const trendAnalysis = includeTrends
				? await analyzeChangeTrends(filteredChanges, websiteUrl)
				: null;

			// Step 7: Generate recommendations
			const recommendations = await generateRecommendations(
				insights,
				categorizedChanges,
				businessContext
			);

			return {
				websiteUrl,
				businessContext,
				meaningfulChanges: categorizedChanges,
				impactAnalysis,
				insights,
				recommendations,
				trendAnalysis,
				aiConsensus: {
					providers: analysisProviders || [
						"openai",
						"claude",
						"gemini",
						"perplexity",
					],
					agreement: calculateProviderAgreement(aiAnalysisResults),
					confidence: calculateOverallConfidence(aiAnalysisResults),
				},
				metadata: {
					executionTime: Date.now(),
					category: "meaningful-change-analysis",
					totalChanges: changes.length,
					meaningfulChangesCount: categorizedChanges.length,
					impactThreshold,
					analysisDepth,
					success: true,
				},
			};
		} catch (error) {
			throw new Error(`Meaningful change analysis failed: ${error.message}`);
		}
	},
});
```

### Response Data Structure

```typescript
interface MeaningfulChangeAnalysisResult {
	websiteUrl: string;
	businessContext: {
		industry?: string;
		businessType?: "b2b" | "b2c" | "ecommerce" | "saas" | "other";
		keyMetrics?: string[];
		objectives?: string[];
	};
	meaningfulChanges: Array<{
		changeId: string;
		originalChange: any;
		businessImpact: "positive" | "negative" | "neutral" | "mixed";
		impactScore: number;
		confidence: number;
		category:
			| "pricing"
			| "features"
			| "content"
			| "structure"
			| "performance"
			| "seo"
			| "other";
		priority: "low" | "medium" | "high" | "critical";
		aiAnalysis: {
			summary: string;
			reasoning: string;
			providers: string[];
			consensus: number;
		};
		affectedMetrics: string[];
		recommendations: string[];
		trend: "improving" | "declining" | "stable";
	}>;
	impactAnalysis: {
		overallImpact: "positive" | "negative" | "neutral" | "mixed";
		impactScore: number;
		mostSignificantChanges: string[];
		riskAssessment: {
			level: "low" | "medium" | "high" | "critical";
			factors: string[];
			mitigation: string[];
		};
		opportunityAssessment: {
			level: "low" | "medium" | "high" | "excellent";
			opportunities: string[];
			actions: string[];
		};
	};
	insights: {
		keyFindings: string[];
		patterns: string[];
		anomalies: string[];
		trends: string[];
		recommendations: Array<{
			priority: "low" | "medium" | "high" | "critical";
			category: string;
			description: string;
			impact: number;
			effort: number;
			timeframe: string;
		}>;
	};
	recommendations: {
		immediate: string[];
		shortTerm: string[];
		longTerm: string[];
		monitoring: string[];
		alerts: string[];
	};
	trendAnalysis?: {
		changeVelocity: number;
		trendDirection: "increasing" | "decreasing" | "stable";
		patterns: string[];
		predictions: Array<{
			metric: string;
			prediction: string;
			confidence: number;
			timeframe: string;
		}>;
	};
	aiConsensus: {
		providers: string[];
		agreement: number;
		confidence: number;
		disagreements: string[];
	};
	metadata: {
		executionTime: number;
		category: "meaningful-change-analysis";
		totalChanges: number;
		meaningfulChangesCount: number;
		impactThreshold: number;
		analysisDepth: string;
		success: boolean;
	};
}
```

### Analysis Functions

```typescript
async function analyzeChangesWithAI(
	changes: any[],
	websiteUrl: string,
	businessContext: any,
	providers: string[]
): Promise<AIAnalysisResult[]> {
	const analysisPromises = providers.map(async (provider) => {
		const prompt = generateAnalysisPrompt(changes, websiteUrl, businessContext);

		try {
			const result = await queryAIProvider(provider, prompt);
			return {
				provider,
				result,
				success: true,
			};
		} catch (error) {
			return {
				provider,
				error: error.message,
				success: false,
			};
		}
	});

	return Promise.all(analysisPromises);
}

async function determineBusinessImpact(
	changes: any[],
	aiResults: AIAnalysisResult[],
	businessContext: any
): Promise<BusinessImpactAnalysis> {
	const successfulResults = aiResults.filter((r) => r.success);

	// Aggregate AI analysis results
	const aggregatedAnalysis = aggregateAIAnalysis(successfulResults);

	// Calculate overall impact score
	const impactScore = calculateImpactScore(
		changes,
		aggregatedAnalysis,
		businessContext
	);

	// Determine overall impact direction
	const overallImpact = determineOverallImpact(impactScore, aggregatedAnalysis);

	// Assess risks and opportunities
	const riskAssessment = assessRisks(
		changes,
		aggregatedAnalysis,
		businessContext
	);
	const opportunityAssessment = assessOpportunities(
		changes,
		aggregatedAnalysis,
		businessContext
	);

	return {
		overallImpact,
		impactScore,
		mostSignificantChanges: identifyMostSignificantChanges(
			changes,
			aggregatedAnalysis
		),
		riskAssessment,
		opportunityAssessment,
	};
}

async function generateActionableInsights(
	impactAnalysis: BusinessImpactAnalysis,
	businessContext: any,
	analysisDepth: string
): Promise<ActionableInsights> {
	const insights: ActionableInsights = {
		keyFindings: [],
		patterns: [],
		anomalies: [],
		trends: [],
		recommendations: [],
	};

	// Generate insights based on impact analysis
	insights.keyFindings = generateKeyFindings(impactAnalysis, businessContext);
	insights.patterns = identifyPatterns(impactAnalysis);
	insights.anomalies = detectAnomalies(impactAnalysis);
	insights.trends = analyzeTrends(impactAnalysis);

	// Generate recommendations based on analysis depth
	insights.recommendations = generateRecommendations(
		impactAnalysis,
		businessContext,
		analysisDepth
	);

	return insights;
}

async function categorizeChanges(
	impactAnalysis: BusinessImpactAnalysis,
	businessContext: any
): Promise<MeaningfulChange[]> {
	return impactAnalysis.mostSignificantChanges.map((change) => {
		const category = categorizeChange(change, businessContext);
		const priority = determinePriority(change, impactAnalysis);
		const trend = determineTrend(change);

		return {
			changeId: change.id,
			originalChange: change,
			businessImpact: change.impact,
			impactScore: change.impactScore,
			confidence: change.confidence,
			category,
			priority,
			aiAnalysis: change.aiAnalysis,
			affectedMetrics: identifyAffectedMetrics(change, businessContext),
			recommendations: generateChangeRecommendations(change, businessContext),
			trend,
		};
	});
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("meaningfulChangeAnalysisTool", () => {
	test("should analyze changes with multiple AI providers");
	test("should determine business impact accurately");
	test("should generate actionable insights");
	test("should filter out irrelevant changes");
	test("should categorize changes by business impact");
	test("should provide trend analysis");
	test("should generate recommendations");
	test("should handle different business contexts");
	test("should calculate AI consensus");
	test("should validate input parameters correctly");
	test("should return properly structured response");
});
```

### Integration Tests

```typescript
describe("Meaningful Change Analysis Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with website monitoring agent");
	test("should work with change detection results");
	test("should handle various business contexts");
});
```

## 🔗 Dependencies

- **Requires**: GEO-209 (Change Detection Tool)
- **External**: OpenAI API, Claude API, Gemini API, Perplexity API
- **Internal**: AI analysis utilities, business impact assessment functions

## 📊 Performance Requirements

- **Response Time**: < 45 seconds for meaningful change analysis
- **Data Size**: Response payload < 400 KB
- **Reliability**: > 90% accuracy in business impact assessment
- **Concurrent Usage**: Support 15+ simultaneous analysis operations

## 🔍 Definition of Ready

- [ ] Change detection tool is implemented
- [ ] AI provider APIs are configured
- [ ] Business impact assessment logic is designed
- [ ] Test scenarios are defined
- [ ] Analysis prompts are optimized

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] Business impact assessment accuracy meets requirements (>90%)
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Analyze meaningful changes for example.com"
// Tool call with parameters:
{
	changes: detectedChanges,
	websiteUrl: "https://example.com",
	impactThreshold: 0.3,
	analysisDepth: "comprehensive"
}
```

### Advanced Usage

```typescript
// User query: "Analyze changes with business context and custom providers"
// Tool call with parameters:
{
	changes: detectedChanges,
	websiteUrl: "https://example.com",
	businessContext: {
		industry: "SaaS",
		businessType: "b2b",
		keyMetrics: ["conversion_rate", "user_engagement", "revenue"],
		objectives: ["increase_conversions", "improve_ux"]
	},
	analysisProviders: ["openai", "claude", "perplexity"],
	impactThreshold: 0.2,
	includeTrends: true,
	analysisDepth: "expert"
}
```

## 📝 Notes

- Focus on accurate business impact assessment
- Implement robust AI consensus calculation
- Consider different business contexts and objectives
- Design for extensibility (future analysis methods)
- Ensure comprehensive recommendation generation

## 🔄 Follow-up Tasks

- **GEO-211**: Notification Management Tool
- **GEO-212**: Monitoring Scheduler Tool
