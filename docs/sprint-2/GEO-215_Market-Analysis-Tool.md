# GEO-215: Market Analysis Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Critical) **Story Points**: 7  
**Estimated Time**: 12 hours **Assignee**: [Developer Name] **Sprint**: Sprint
2, Phase 2C  
**Dependencies**: GEO-214 (Competitor Research Tool)

## 🎯 User Story

As a **GEO analyst**, I want **comprehensive market analysis** so that I can
**understand market dynamics, trends, and opportunities**.

## 📝 Description

Create a comprehensive market analysis tool that analyzes market dynamics,
identifies trends, segments markets, analyzes customer behavior, and provides
market insights. This tool will use multiple data sources, AI-powered analysis,
and provide detailed market intelligence for strategic decision-making.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Analyzes market dynamics and identifies key drivers
- [ ] **AC2**: Identifies market trends and emerging patterns
- [ ] **AC3**: Segments markets and analyzes customer behavior
- [ ] **AC4**: Provides market size and growth rate analysis
- [ ] **AC5**: Analyzes competitive landscape and intensity
- [ ] **AC6**: Identifies market opportunities and threats

### Data Structure Requirements

- [ ] **AC7**: Returns comprehensive market analysis with multiple dimensions
- [ ] **AC8**: Includes market segmentation and customer analysis
- [ ] **AC9**: Provides trend analysis and forecasting capabilities
- [ ] **AC10**: Includes competitive landscape analysis
- [ ] **AC11**: Supports different market scopes and timeframes
- [ ] **AC12**: Handles different industries and market types

### Integration Requirements

- [ ] **AC13**: Works seamlessly with existing chat interface
- [ ] **AC14**: Tool description is clear and discoverable
- [ ] **AC15**: Parameter validation using Zod schemas
- [ ] **AC16**: Error responses are user-friendly and actionable
- [ ] **AC17**: Response format supports artifact generation
- [ ] **AC18**: Integrates with competitive intelligence agent workflow

## 🛠️ Technical Implementation

### Tool Implementation

```typescript
// lib/ai/tools/market-analysis-tool.ts
export const marketAnalysisTool = tool({
	description:
		"Comprehensive market analysis with dynamics, trends, and segmentation",
	inputSchema: z.object({
		targetCompany: z.object({
			name: z.string().min(1).max(100),
			description: z.string().min(10).max(1000),
			website: z.string().url(),
			industry: z.string().optional(),
			marketFocus: z.enum(["b2b", "b2c", "both"]).optional(),
			companySize: z.enum(["startup", "sme", "enterprise"]).optional(),
		}),
		marketScope: z
			.enum(["local", "regional", "national", "global"])
			.default("global"),
		timeframe: z
			.enum(["current", "quarterly", "annual", "trending", "forecast"])
			.default("current"),
		analysisType: z
			.enum(["comprehensive", "dynamics", "trends", "segmentation", "customer"])
			.default("comprehensive"),
		includeForecasting: z.boolean().default(false),
		includeCustomerAnalysis: z.boolean().default(true),
		includeCompetitiveLandscape: z.boolean().default(true),
		customMetrics: z.array(z.string()).optional(),
		dataSources: z
			.array(
				z.enum([
					"market_reports",
					"financial_data",
					"social_media",
					"news",
					"surveys",
					"all",
				])
			)
			.default(["all"]),
	}),
	handler: async (ctx, args) => {
		const {
			targetCompany,
			marketScope,
			timeframe,
			analysisType,
			includeForecasting,
			includeCustomerAnalysis,
			includeCompetitiveLandscape,
			customMetrics,
			dataSources,
		} = args;

		try {
			// Step 1: Analyze market dynamics
			const marketDynamics = await analyzeMarketDynamics(
				targetCompany,
				marketScope,
				timeframe,
				dataSources
			);

			// Step 2: Identify market trends
			const marketTrends = await identifyMarketTrends(
				targetCompany,
				marketScope,
				timeframe,
				dataSources
			);

			// Step 3: Analyze market segmentation
			const marketSegmentation = await analyzeMarketSegmentation(
				targetCompany,
				marketScope,
				timeframe,
				dataSources
			);

			// Step 4: Analyze customer behavior (if enabled)
			let customerAnalysis = null;
			if (includeCustomerAnalysis) {
				customerAnalysis = await analyzeCustomerBehavior(
					targetCompany,
					marketScope,
					timeframe,
					dataSources
				);
			}

			// Step 5: Analyze competitive landscape (if enabled)
			let competitiveLandscape = null;
			if (includeCompetitiveLandscape) {
				competitiveLandscape = await analyzeCompetitiveLandscape(
					targetCompany,
					marketScope,
					timeframe,
					dataSources
				);
			}

			// Step 6: Generate market forecasting (if enabled)
			let marketForecasting = null;
			if (includeForecasting) {
				marketForecasting = await generateMarketForecasting(
					targetCompany,
					marketScope,
					marketTrends,
					marketDynamics
				);
			}

			// Step 7: Analyze custom metrics (if provided)
			let customMetricsAnalysis = null;
			if (customMetrics && customMetrics.length > 0) {
				customMetricsAnalysis = await analyzeCustomMetrics(
					targetCompany,
					customMetrics,
					marketScope,
					timeframe
				);
			}

			// Step 8: Generate market insights
			const marketInsights = await generateMarketInsights(
				targetCompany,
				marketDynamics,
				marketTrends,
				marketSegmentation,
				customerAnalysis,
				competitiveLandscape,
				marketForecasting
			);

			return {
				targetCompany,
				marketScope,
				timeframe,
				analysisType,
				marketDynamics,
				marketTrends,
				marketSegmentation,
				customerAnalysis,
				competitiveLandscape,
				marketForecasting,
				customMetricsAnalysis,
				marketInsights,
				analysisMetadata: {
					analysisType,
					includeForecasting,
					includeCustomerAnalysis,
					includeCompetitiveLandscape,
					customMetrics: customMetrics || [],
					dataSources: dataSources,
					analysisQuality: calculateAnalysisQuality({
						marketDynamics,
						marketTrends,
						marketSegmentation,
						customerAnalysis,
						competitiveLandscape,
						marketForecasting,
					}),
					confidenceScores: calculateConfidenceScores({
						marketDynamics,
						marketTrends,
						marketSegmentation,
						customerAnalysis,
						competitiveLandscape,
						marketForecasting,
					}),
				},
				metadata: {
					executionTime: Date.now(),
					category: "market-analysis",
					marketScope,
					timeframe,
					analysisType,
					dataSourcesCount: dataSources.length,
					success: true,
				},
			};
		} catch (error) {
			throw new Error(`Market analysis failed: ${error.message}`);
		}
	},
});
```

### Response Data Structure

```typescript
interface MarketAnalysisResult {
	targetCompany: {
		name: string;
		description: string;
		website: string;
		industry?: string;
		marketFocus?: "b2b" | "b2c" | "both";
		companySize?: "startup" | "sme" | "enterprise";
	};
	marketScope: "local" | "regional" | "national" | "global";
	timeframe: "current" | "quarterly" | "annual" | "trending" | "forecast";
	analysisType:
		| "comprehensive"
		| "dynamics"
		| "trends"
		| "segmentation"
		| "customer";
	marketDynamics: {
		marketSize: {
			total: string;
			growth: number;
			projection: string;
			confidence: number;
		};
		marketDrivers: Array<{
			driver: string;
			description: string;
			impact: "positive" | "negative" | "neutral";
			strength: number;
			timeframe: string;
		}>;
		marketRestraints: Array<{
			restraint: string;
			description: string;
			impact: "positive" | "negative" | "neutral";
			severity: number;
			timeframe: string;
		}>;
		marketOpportunities: Array<{
			opportunity: string;
			description: string;
			potential: number;
			timeframe: string;
			requirements: string[];
		}>;
		marketThreats: Array<{
			threat: string;
			description: string;
			probability: number;
			impact: number;
			mitigation: string[];
		}>;
		regulatoryEnvironment: Array<{
			regulation: string;
			description: string;
			impact: "positive" | "negative" | "neutral";
			compliance: string[];
		}>;
		technologyTrends: Array<{
			technology: string;
			adoption: number;
			impact: string;
			timeframe: string;
			relevance: number;
		}>;
	};
	marketTrends: {
		shortTerm: Array<{
			trend: string;
			description: string;
			impact: "positive" | "negative" | "neutral";
			confidence: number;
			timeframe: string;
		}>;
		longTerm: Array<{
			trend: string;
			description: string;
			impact: "positive" | "negative" | "neutral";
			confidence: number;
			timeframe: string;
		}>;
		emergingTrends: Array<{
			trend: string;
			description: string;
			emergence: number;
			potential: number;
			timeframe: string;
		}>;
		decliningTrends: Array<{
			trend: string;
			description: string;
			decline: number;
			impact: string;
			timeframe: string;
		}>;
	};
	marketSegmentation: {
		segments: Array<{
			name: string;
			size: string;
			growth: number;
			characteristics: string[];
			keyPlayers: string[];
			opportunities: string[];
			challenges: string[];
			customerProfile: {
				demographics: string[];
				psychographics: string[];
				behavior: string[];
				needs: string[];
				preferences: string[];
			};
		}>;
		segmentAnalysis: {
			mostAttractive: string[];
			fastestGrowing: string[];
			mostCompetitive: string[];
			emerging: string[];
		};
	};
	customerAnalysis?: {
		customerSegments: Array<{
			name: string;
			size: string;
			characteristics: string[];
			needs: string[];
			painPoints: string[];
			buyingBehavior: string;
			preferences: string[];
			satisfaction: number;
			loyalty: number;
		}>;
		customerJourney: {
			awareness: string[];
			consideration: string[];
			purchase: string[];
			retention: string[];
			advocacy: string[];
		};
		customerSatisfaction: {
			overall: number;
			bySegment: Record<string, number>;
			keyFactors: string[];
			improvementAreas: string[];
		};
		customerTrends: Array<{
			trend: string;
			description: string;
			impact: string;
			timeframe: string;
		}>;
	};
	competitiveLandscape?: {
		marketLeaders: Array<{
			company: string;
			marketShare: number;
			strengths: string[];
			weaknesses: string[];
			strategies: string[];
		}>;
		emergingPlayers: Array<{
			company: string;
			growth: number;
			innovations: string[];
			threats: string[];
		}>;
		nichePlayers: Array<{
			company: string;
			specialization: string;
			advantages: string[];
			limitations: string[];
		}>;
		competitiveIntensity: {
			overall: "low" | "medium" | "high";
			bySegment: Record<string, "low" | "medium" | "high">;
			factors: string[];
		};
		entryBarriers: Array<{
			barrier: string;
			description: string;
			strength: number;
			impact: string;
		}>;
	};
	marketForecasting?: {
		shortTerm: Array<{
			period: string;
			prediction: string;
			confidence: number;
			factors: string[];
		}>;
		longTerm: Array<{
			period: string;
			prediction: string;
			confidence: number;
			factors: string[];
		}>;
		scenarios: Array<{
			scenario: string;
			description: string;
			probability: number;
			impact: string;
		}>;
	};
	customMetricsAnalysis?: Array<{
		metric: string;
		value: any;
		trend: string;
		insights: string[];
		recommendations: string[];
	}>;
	marketInsights: {
		keyFindings: string[];
		strategicImplications: string[];
		recommendations: Array<{
			category: string;
			recommendation: string;
			priority: "low" | "medium" | "high";
			impact: number;
			effort: number;
		}>;
		risks: Array<{
			risk: string;
			probability: number;
			impact: number;
			mitigation: string[];
		}>;
		opportunities: Array<{
			opportunity: string;
			potential: number;
			timeframe: string;
			requirements: string[];
		}>;
	};
	analysisMetadata: {
		analysisType: string;
		includeForecasting: boolean;
		includeCustomerAnalysis: boolean;
		includeCompetitiveLandscape: boolean;
		customMetrics: string[];
		dataSources: string[];
		analysisQuality: number;
		confidenceScores: Record<string, number>;
	};
	metadata: {
		executionTime: number;
		category: "market-analysis";
		marketScope: string;
		timeframe: string;
		analysisType: string;
		dataSourcesCount: number;
		success: boolean;
	};
}
```

### Analysis Functions

```typescript
async function analyzeMarketDynamics(
	targetCompany: any,
	marketScope: string,
	timeframe: string,
	dataSources: string[]
): Promise<MarketDynamics> {
	// Analyze market size and growth
	const marketSize = await analyzeMarketSize(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Identify market drivers
	const marketDrivers = await identifyMarketDrivers(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Identify market restraints
	const marketRestraints = await identifyMarketRestraints(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Identify market opportunities
	const marketOpportunities = await identifyMarketOpportunities(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Identify market threats
	const marketThreats = await identifyMarketThreats(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Analyze regulatory environment
	const regulatoryEnvironment = await analyzeRegulatoryEnvironment(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Analyze technology trends
	const technologyTrends = await analyzeTechnologyTrends(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	return {
		marketSize,
		marketDrivers,
		marketRestraints,
		marketOpportunities,
		marketThreats,
		regulatoryEnvironment,
		technologyTrends,
	};
}

async function identifyMarketTrends(
	targetCompany: any,
	marketScope: string,
	timeframe: string,
	dataSources: string[]
): Promise<MarketTrends> {
	// Identify short-term trends
	const shortTerm = await identifyShortTermTrends(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Identify long-term trends
	const longTerm = await identifyLongTermTrends(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Identify emerging trends
	const emergingTrends = await identifyEmergingTrends(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Identify declining trends
	const decliningTrends = await identifyDecliningTrends(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	return {
		shortTerm,
		longTerm,
		emergingTrends,
		decliningTrends,
	};
}

async function analyzeMarketSegmentation(
	targetCompany: any,
	marketScope: string,
	timeframe: string,
	dataSources: string[]
): Promise<MarketSegmentation> {
	// Identify market segments
	const segments = await identifyMarketSegments(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Analyze segment characteristics
	const segmentsWithAnalysis = await Promise.all(
		segments.map(async (segment) => {
			const characteristics = await analyzeSegmentCharacteristics(
				segment,
				targetCompany,
				dataSources
			);
			const keyPlayers = await identifyKeyPlayers(
				segment,
				targetCompany,
				dataSources
			);
			const opportunities = await identifySegmentOpportunities(
				segment,
				targetCompany,
				dataSources
			);
			const challenges = await identifySegmentChallenges(
				segment,
				targetCompany,
				dataSources
			);
			const customerProfile = await analyzeCustomerProfile(
				segment,
				targetCompany,
				dataSources
			);

			return {
				...segment,
				characteristics,
				keyPlayers,
				opportunities,
				challenges,
				customerProfile,
			};
		})
	);

	// Analyze segment attractiveness
	const segmentAnalysis = await analyzeSegmentAttractiveness(
		segmentsWithAnalysis,
		targetCompany
	);

	return {
		segments: segmentsWithAnalysis,
		segmentAnalysis,
	};
}

async function analyzeCustomerBehavior(
	targetCompany: any,
	marketScope: string,
	timeframe: string,
	dataSources: string[]
): Promise<CustomerAnalysis> {
	// Identify customer segments
	const customerSegments = await identifyCustomerSegments(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Analyze customer journey
	const customerJourney = await analyzeCustomerJourney(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Analyze customer satisfaction
	const customerSatisfaction = await analyzeCustomerSatisfaction(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Identify customer trends
	const customerTrends = await identifyCustomerTrends(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	return {
		customerSegments,
		customerJourney,
		customerSatisfaction,
		customerTrends,
	};
}

async function analyzeCompetitiveLandscape(
	targetCompany: any,
	marketScope: string,
	timeframe: string,
	dataSources: string[]
): Promise<CompetitiveLandscape> {
	// Identify market leaders
	const marketLeaders = await identifyMarketLeaders(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Identify emerging players
	const emergingPlayers = await identifyEmergingPlayers(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Identify niche players
	const nichePlayers = await identifyNichePlayers(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Analyze competitive intensity
	const competitiveIntensity = await analyzeCompetitiveIntensity(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	// Analyze entry barriers
	const entryBarriers = await analyzeEntryBarriers(
		targetCompany,
		marketScope,
		timeframe,
		dataSources
	);

	return {
		marketLeaders,
		emergingPlayers,
		nichePlayers,
		competitiveIntensity,
		entryBarriers,
	};
}

async function generateMarketForecasting(
	targetCompany: any,
	marketScope: string,
	marketTrends: any,
	marketDynamics: any
): Promise<MarketForecasting> {
	// Generate short-term forecasts
	const shortTerm = await generateShortTermForecasts(
		targetCompany,
		marketScope,
		marketTrends,
		marketDynamics
	);

	// Generate long-term forecasts
	const longTerm = await generateLongTermForecasts(
		targetCompany,
		marketScope,
		marketTrends,
		marketDynamics
	);

	// Generate scenario analysis
	const scenarios = await generateScenarioAnalysis(
		targetCompany,
		marketScope,
		marketTrends,
		marketDynamics
	);

	return {
		shortTerm,
		longTerm,
		scenarios,
	};
}

async function analyzeCustomMetrics(
	targetCompany: any,
	customMetrics: string[],
	marketScope: string,
	timeframe: string
): Promise<CustomMetricsAnalysis[]> {
	const results = await Promise.all(
		customMetrics.map(async (metric) => {
			const value = await analyzeCustomMetric(
				metric,
				targetCompany,
				marketScope,
				timeframe
			);
			const trend = await analyzeMetricTrend(
				metric,
				targetCompany,
				marketScope,
				timeframe
			);
			const insights = await generateMetricInsights(
				metric,
				value,
				trend,
				targetCompany
			);
			const recommendations = await generateMetricRecommendations(
				metric,
				value,
				trend,
				targetCompany
			);

			return {
				metric,
				value,
				trend,
				insights,
				recommendations,
			};
		})
	);

	return results;
}

async function generateMarketInsights(
	targetCompany: any,
	marketDynamics: any,
	marketTrends: any,
	marketSegmentation: any,
	customerAnalysis: any,
	competitiveLandscape: any,
	marketForecasting: any
): Promise<MarketInsights> {
	// Generate key findings
	const keyFindings = await generateKeyFindings(
		targetCompany,
		marketDynamics,
		marketTrends,
		marketSegmentation,
		customerAnalysis,
		competitiveLandscape,
		marketForecasting
	);

	// Generate strategic implications
	const strategicImplications = await generateStrategicImplications(
		targetCompany,
		marketDynamics,
		marketTrends,
		marketSegmentation,
		customerAnalysis,
		competitiveLandscape,
		marketForecasting
	);

	// Generate recommendations
	const recommendations = await generateRecommendations(
		targetCompany,
		marketDynamics,
		marketTrends,
		marketSegmentation,
		customerAnalysis,
		competitiveLandscape,
		marketForecasting
	);

	// Identify risks
	const risks = await identifyRisks(
		targetCompany,
		marketDynamics,
		marketTrends,
		marketSegmentation,
		customerAnalysis,
		competitiveLandscape,
		marketForecasting
	);

	// Identify opportunities
	const opportunities = await identifyOpportunities(
		targetCompany,
		marketDynamics,
		marketTrends,
		marketSegmentation,
		customerAnalysis,
		competitiveLandscape,
		marketForecasting
	);

	return {
		keyFindings,
		strategicImplications,
		recommendations,
		risks,
		opportunities,
	};
}

function calculateAnalysisQuality(analysisResults: any): number {
	const components = [
		analysisResults.marketDynamics,
		analysisResults.marketTrends,
		analysisResults.marketSegmentation,
		analysisResults.customerAnalysis,
		analysisResults.competitiveLandscape,
		analysisResults.marketForecasting,
	];

	const qualityScores = components
		.filter((component) => component !== null)
		.map((component) => calculateComponentQuality(component));

	return qualityScores.length > 0
		? qualityScores.reduce((sum, score) => sum + score, 0) /
				qualityScores.length
		: 0;
}

function calculateConfidenceScores(
	analysisResults: any
): Record<string, number> {
	const scores: Record<string, number> = {};

	Object.keys(analysisResults).forEach((key) => {
		if (analysisResults[key] !== null) {
			scores[key] = calculateComponentConfidence(analysisResults[key]);
		}
	});

	return scores;
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("marketAnalysisTool", () => {
	test("should analyze market dynamics comprehensively");
	test("should identify market trends accurately");
	test("should segment markets effectively");
	test("should analyze customer behavior");
	test("should analyze competitive landscape");
	test("should generate market forecasting");
	test("should handle custom metrics analysis");
	test("should generate actionable market insights");
	test("should validate input parameters correctly");
	test("should return properly structured response");
	test("should handle different market scopes");
	test("should support different timeframes");
});
```

### Integration Tests

```typescript
describe("Market Analysis Tool Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with competitive intelligence agent");
	test("should handle external data source failures");
	test("should provide comprehensive market insights");
});
```

## 🔗 Dependencies

- **Requires**: GEO-214 (Competitor Research Tool)
- **External**: Market research databases, financial APIs, trend analysis
  services, customer data sources
- **Internal**: Data source connectors, AI analysis functions

## 📊 Performance Requirements

- **Response Time**: < 60 seconds for basic analysis, < 3 minutes for
  comprehensive analysis
- **Data Size**: Response payload < 1 MB
- **Reliability**: > 85% analysis completion rate
- **Concurrent Usage**: Support 3+ simultaneous market analyses

## 🔍 Definition of Ready

- [ ] Competitor research tool is implemented
- [ ] Market data sources are identified and configured
- [ ] AI analysis functions are defined
- [ ] Test scenarios are defined
- [ ] Error handling strategies are planned

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] Analysis quality and confidence scoring works accurately
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Analyze market for my SaaS company"
// Tool call with parameters:
{
	targetCompany: {
		name: "MySaaS",
		description: "Cloud-based project management software",
		website: "https://mysaas.com",
		industry: "SaaS",
		marketFocus: "b2b"
	},
	marketScope: "global",
	timeframe: "current",
	analysisType: "comprehensive",
	includeCustomerAnalysis: true,
	includeCompetitiveLandscape: true
}
```

### Advanced Usage

```typescript
// User query: "Provide comprehensive market analysis with forecasting"
// Tool call with parameters:
{
	targetCompany: {
		name: "TechCorp",
		description: "Enterprise AI solutions provider",
		website: "https://techcorp.com",
		industry: "Artificial Intelligence",
		marketFocus: "b2b",
		companySize: "enterprise"
	},
	marketScope: "global",
	timeframe: "forecast",
	analysisType: "comprehensive",
	includeForecasting: true,
	includeCustomerAnalysis: true,
	includeCompetitiveLandscape: true,
	customMetrics: ["AI adoption rate", "enterprise spending", "talent availability"],
	dataSources: ["market_reports", "financial_data", "news", "surveys"]
}
```

## 📝 Notes

- Focus on comprehensive market intelligence gathering
- Implement robust error handling for external data sources
- Consider data privacy and ethical market research practices
- Design for extensibility (future market analysis types)
- Ensure high-quality insights and actionable recommendations

## 🔄 Follow-up Tasks

- GEO-216: Strategy Assessment Tool
- GEO-217: Competitive Positioning Tool
- GEO-218: Trend Analysis Tool
- GEO-219: Competitive Dashboard Tool
