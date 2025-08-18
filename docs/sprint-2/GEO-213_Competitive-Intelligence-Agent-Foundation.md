# GEO-213: Competitive Intelligence Agent Foundation

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Critical) **Story Points**: 5  
**Estimated Time**: 8 hours **Assignee**: [Developer Name] **Sprint**: Sprint 2,
Phase 2C  
**Dependencies**: None (foundational)

## 🎯 User Story

As a **GEO analyst**, I want a **competitive intelligence agent** so that I can
**analyze competitor strategies and market positioning comprehensively**.

## 📝 Description

Create the foundational competitive intelligence agent that orchestrates the
entire competitive analysis workflow. This agent will coordinate competitor
research, market analysis, strategy assessment, competitive positioning, and
trend analysis. It will provide real-time SSE progress updates and integrate
seamlessly with the existing chat artifacts system.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Agent can be invoked through chat interface with target company
      and analysis parameters
- [ ] **AC2**: Agent orchestrates comprehensive competitor research and analysis
      automatically
- [ ] **AC3**: Agent manages multi-dimensional competitive intelligence workflow
- [ ] **AC4**: Agent provides real-time SSE progress updates for each analysis
      stage
- [ ] **AC5**: Agent handles errors gracefully and provides user-friendly
      feedback
- [ ] **AC6**: Agent integrates with existing chat artifacts system for result
      display

### Technical Requirements

- [ ] **AC7**: Agent uses Vercel AI SDK tool() function for integration
- [ ] **AC8**: Agent accepts targetCompany, competitors, analysisType, and
      marketContext as parameters
- [ ] **AC9**: Agent returns structured data suitable for artifact visualization
- [ ] **AC10**: Agent implements proper error handling and fallback mechanisms
- [ ] **AC11**: Agent supports analysis pause/resume functionality
- [ ] **AC12**: Agent provides analysis status and configuration options

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
├── competitive-intelligence-agent.ts    # Main agent orchestration
├── competitor-research-tool.ts          # Competitor research and data collection
├── market-analysis-tool.ts              # Market analysis and trends
├── strategy-assessment-tool.ts          # Strategy analysis and positioning
├── competitive-positioning-tool.ts      # Competitive positioning analysis
├── trend-analysis-tool.ts               # Trend analysis and forecasting
└── competitive-dashboard-tool.ts        # Competitive dashboard generation
```

### Agent Implementation

```typescript
// lib/ai/tools/competitive-intelligence-agent.ts
export const competitiveIntelligenceAgent = tool({
	description:
		"Comprehensive competitive intelligence analysis with market insights",
	inputSchema: z.object({
		targetCompany: z.object({
			name: z.string().min(1).max(100),
			description: z.string().min(10).max(1000),
			website: z.string().url(),
			industry: z.string().optional(),
			marketFocus: z.enum(["b2b", "b2c", "both"]).optional(),
			companySize: z.enum(["startup", "sme", "enterprise"]).optional(),
		}),
		competitors: z.array(z.string()).min(1).max(20).optional(),
		analysisType: z
			.enum(["comprehensive", "strategic", "tactical", "market", "trends"])
			.default("comprehensive"),
		marketContext: z
			.object({
				industry: z.string().optional(),
				geographicScope: z
					.enum(["local", "regional", "national", "global"])
					.optional(),
				timeframe: z
					.enum(["current", "quarterly", "annual", "trending"])
					.default("current"),
				keyMetrics: z.array(z.string()).optional(),
			})
			.optional(),
		includeTrends: z.boolean().default(true),
		includeForecasting: z.boolean().default(false),
		customAnalysis: z.array(z.string()).optional(),
	}),
	handler: async (ctx, args) => {
		const {
			targetCompany,
			competitors,
			analysisType,
			marketContext,
			includeTrends,
			includeForecasting,
			customAnalysis,
		} = args;

		// Initialize SSE connection for progress updates
		const sseConnection = await initializeSSEConnection(ctx);

		try {
			// Step 1: Competitor Research and Identification
			await sseConnection.sendProgress(
				"Researching competitors and market landscape...",
				10
			);
			const competitorResearch = await researchCompetitors(
				targetCompany,
				competitors,
				marketContext
			);

			// Step 2: Market Analysis
			await sseConnection.sendProgress(
				"Analyzing market dynamics and trends...",
				25
			);
			const marketAnalysis = await analyzeMarket(
				targetCompany,
				competitorResearch.competitors,
				marketContext
			);

			// Step 3: Strategy Assessment
			await sseConnection.sendProgress(
				"Assessing competitive strategies...",
				45
			);
			const strategyAssessment = await assessStrategies(
				targetCompany,
				competitorResearch.competitors,
				analysisType
			);

			// Step 4: Competitive Positioning
			await sseConnection.sendProgress(
				"Analyzing competitive positioning...",
				65
			);
			const competitivePositioning = await analyzeCompetitivePositioning(
				targetCompany,
				competitorResearch.competitors,
				strategyAssessment
			);

			// Step 5: Trend Analysis (if enabled)
			let trendAnalysis = null;
			if (includeTrends) {
				await sseConnection.sendProgress(
					"Analyzing market trends and patterns...",
					80
				);
				trendAnalysis = await analyzeTrends(
					targetCompany,
					competitorResearch.competitors,
					marketContext
				);
			}

			// Step 6: Forecasting (if enabled)
			let forecasting = null;
			if (includeForecasting) {
				await sseConnection.sendProgress("Generating market forecasts...", 90);
				forecasting = await generateForecasts(
					targetCompany,
					competitorResearch.competitors,
					trendAnalysis,
					marketContext
				);
			}

			// Step 7: Custom Analysis (if provided)
			let customAnalysisResults = null;
			if (customAnalysis && customAnalysis.length > 0) {
				await sseConnection.sendProgress("Performing custom analysis...", 95);
				customAnalysisResults = await performCustomAnalysis(
					targetCompany,
					competitorResearch.competitors,
					customAnalysis
				);
			}

			// Step 8: Final Results
			await sseConnection.sendProgress(
				"Generating comprehensive report...",
				100
			);

			return {
				targetCompany,
				analysisType,
				marketContext,
				competitorResearch,
				marketAnalysis,
				strategyAssessment,
				competitivePositioning,
				trendAnalysis,
				forecasting,
				customAnalysisResults,
				summary: {
					totalCompetitors: competitorResearch.competitors.length,
					analysisDepth: analysisType,
					keyInsights: extractKeyInsights({
						marketAnalysis,
						strategyAssessment,
						competitivePositioning,
						trendAnalysis,
						forecasting,
					}),
					recommendations: generateRecommendations({
						targetCompany,
						competitivePositioning,
						marketAnalysis,
						trendAnalysis,
					}),
					riskAssessment: assessCompetitiveRisks({
						targetCompany,
						competitorResearch,
						marketAnalysis,
						trendAnalysis,
					}),
					opportunityAnalysis: identifyOpportunities({
						targetCompany,
						competitivePositioning,
						marketAnalysis,
						trendAnalysis,
					}),
				},
				metadata: {
					executionTime: Date.now(),
					category: "competitive-intelligence",
					analysisType,
					includeTrends,
					includeForecasting,
					customAnalysisCount: customAnalysis?.length || 0,
					success: true,
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
interface CompetitiveIntelligenceResult {
	targetCompany: {
		name: string;
		description: string;
		website: string;
		industry?: string;
		marketFocus?: "b2b" | "b2c" | "both";
		companySize?: "startup" | "sme" | "enterprise";
	};
	analysisType:
		| "comprehensive"
		| "strategic"
		| "tactical"
		| "market"
		| "trends";
	marketContext?: {
		industry?: string;
		geographicScope?: "local" | "regional" | "national" | "global";
		timeframe: "current" | "quarterly" | "annual" | "trending";
		keyMetrics?: string[];
	};
	competitorResearch: {
		competitors: Array<{
			name: string;
			description: string;
			website: string;
			industry: string;
			marketFocus: string;
			companySize: string;
			strengths: string[];
			weaknesses: string[];
			marketShare: number;
			revenue: string;
			employees: string;
			founded: string;
			headquarters: string;
			keyProducts: string[];
			targetMarket: string;
			competitiveAdvantages: string[];
			recentDevelopments: string[];
		}>;
		marketLandscape: {
			totalMarketSize: string;
			growthRate: number;
			keyTrends: string[];
			marketSegments: Array<{
				name: string;
				size: string;
				growth: number;
				keyPlayers: string[];
			}>;
		};
	};
	marketAnalysis: {
		marketDynamics: {
			drivers: string[];
			restraints: string[];
			opportunities: string[];
			threats: string[];
		};
		competitiveLandscape: {
			marketLeaders: string[];
			emergingPlayers: string[];
			nichePlayers: string[];
			competitiveIntensity: "low" | "medium" | "high";
		};
		customerAnalysis: {
			customerSegments: Array<{
				name: string;
				size: string;
				needs: string[];
				preferences: string[];
				buyingBehavior: string;
			}>;
			customerSatisfaction: {
				overall: number;
				bySegment: Record<string, number>;
				keyFactors: string[];
			};
		};
	};
	strategyAssessment: {
		competitiveStrategies: Array<{
			competitor: string;
			strategy: string;
			description: string;
			strengths: string[];
			weaknesses: string[];
			effectiveness: number;
		}>;
		strategicPositions: Array<{
			competitor: string;
			position: string;
			differentiation: string[];
			valueProposition: string;
		}>;
		innovationAnalysis: {
			innovationLeaders: string[];
			innovationAreas: string[];
			innovationGaps: string[];
		};
	};
	competitivePositioning: {
		positioningMap: Array<{
			company: string;
			price: number;
			quality: number;
			features: number;
			marketShare: number;
		}>;
		competitiveAdvantages: Array<{
			company: string;
			advantages: string[];
			sustainability: number;
		}>;
		marketGaps: Array<{
			segment: string;
			description: string;
			opportunity: number;
			barriers: string[];
		}>;
	};
	trendAnalysis?: {
		marketTrends: Array<{
			trend: string;
			description: string;
			impact: "positive" | "negative" | "neutral";
			timeframe: string;
			confidence: number;
		}>;
		technologyTrends: Array<{
			technology: string;
			adoption: number;
			impact: string;
			timeframe: string;
		}>;
		consumerTrends: Array<{
			trend: string;
			description: string;
			impact: string;
			timeframe: string;
		}>;
	};
	forecasting?: {
		marketForecast: {
			shortTerm: Array<{
				period: string;
				prediction: string;
				confidence: number;
			}>;
			longTerm: Array<{
				period: string;
				prediction: string;
				confidence: number;
			}>;
		};
		competitiveForecast: Array<{
			competitor: string;
			prediction: string;
			timeframe: string;
			confidence: number;
		}>;
	};
	customAnalysisResults?: Array<{
		analysis: string;
		results: any;
		insights: string[];
		recommendations: string[];
	}>;
	summary: {
		totalCompetitors: number;
		analysisDepth: string;
		keyInsights: string[];
		recommendations: Array<{
			category: string;
			recommendation: string;
			priority: "low" | "medium" | "high";
			impact: number;
			effort: number;
		}>;
		riskAssessment: Array<{
			risk: string;
			probability: number;
			impact: number;
			mitigation: string;
		}>;
		opportunityAnalysis: Array<{
			opportunity: string;
			potential: number;
			timeframe: string;
			requirements: string[];
		}>;
	};
	metadata: {
		executionTime: number;
		category: "competitive-intelligence";
		analysisType: string;
		includeTrends: boolean;
		includeForecasting: boolean;
		customAnalysisCount: number;
		success: boolean;
	};
}
```

### Helper Functions

```typescript
async function researchCompetitors(
	targetCompany: any,
	competitors: string[] | undefined,
	marketContext: any
): Promise<CompetitorResearch> {
	// If competitors not provided, identify them automatically
	const competitorList =
		competitors || (await identifyCompetitors(targetCompany, marketContext));

	// Research each competitor
	const competitorData = await Promise.all(
		competitorList.map(async (competitor) => {
			return await researchCompetitor(competitor, targetCompany, marketContext);
		})
	);

	// Analyze market landscape
	const marketLandscape = await analyzeMarketLandscape(
		targetCompany,
		competitorData,
		marketContext
	);

	return {
		competitors: competitorData,
		marketLandscape,
	};
}

async function analyzeMarket(
	targetCompany: any,
	competitors: any[],
	marketContext: any
): Promise<MarketAnalysis> {
	// Analyze market dynamics
	const marketDynamics = await analyzeMarketDynamics(
		targetCompany,
		competitors,
		marketContext
	);

	// Analyze competitive landscape
	const competitiveLandscape = await analyzeCompetitiveLandscape(
		competitors,
		marketContext
	);

	// Analyze customer segments
	const customerAnalysis = await analyzeCustomerSegments(
		targetCompany,
		competitors,
		marketContext
	);

	return {
		marketDynamics,
		competitiveLandscape,
		customerAnalysis,
	};
}

async function assessStrategies(
	targetCompany: any,
	competitors: any[],
	analysisType: string
): Promise<StrategyAssessment> {
	// Assess competitive strategies
	const competitiveStrategies = await assessCompetitiveStrategies(
		competitors,
		analysisType
	);

	// Analyze strategic positions
	const strategicPositions = await analyzeStrategicPositions(
		competitors,
		analysisType
	);

	// Analyze innovation
	const innovationAnalysis = await analyzeInnovation(competitors, analysisType);

	return {
		competitiveStrategies,
		strategicPositions,
		innovationAnalysis,
	};
}

async function analyzeCompetitivePositioning(
	targetCompany: any,
	competitors: any[],
	strategyAssessment: any
): Promise<CompetitivePositioning> {
	// Create positioning map
	const positioningMap = await createPositioningMap(targetCompany, competitors);

	// Analyze competitive advantages
	const competitiveAdvantages = await analyzeCompetitiveAdvantages(
		targetCompany,
		competitors
	);

	// Identify market gaps
	const marketGaps = await identifyMarketGaps(
		targetCompany,
		competitors,
		strategyAssessment
	);

	return {
		positioningMap,
		competitiveAdvantages,
		marketGaps,
	};
}

async function analyzeTrends(
	targetCompany: any,
	competitors: any[],
	marketContext: any
): Promise<TrendAnalysis> {
	// Analyze market trends
	const marketTrends = await analyzeMarketTrends(
		targetCompany,
		competitors,
		marketContext
	);

	// Analyze technology trends
	const technologyTrends = await analyzeTechnologyTrends(
		targetCompany,
		competitors,
		marketContext
	);

	// Analyze consumer trends
	const consumerTrends = await analyzeConsumerTrends(
		targetCompany,
		competitors,
		marketContext
	);

	return {
		marketTrends,
		technologyTrends,
		consumerTrends,
	};
}

async function generateForecasts(
	targetCompany: any,
	competitors: any[],
	trendAnalysis: any,
	marketContext: any
): Promise<Forecasting> {
	// Generate market forecasts
	const marketForecast = await generateMarketForecast(
		targetCompany,
		competitors,
		trendAnalysis,
		marketContext
	);

	// Generate competitive forecasts
	const competitiveForecast = await generateCompetitiveForecast(
		competitors,
		trendAnalysis,
		marketContext
	);

	return {
		marketForecast,
		competitiveForecast,
	};
}

function extractKeyInsights(analysisResults: any): string[] {
	const insights: string[] = [];

	// Extract insights from market analysis
	if (analysisResults.marketAnalysis) {
		insights.push(...extractMarketInsights(analysisResults.marketAnalysis));
	}

	// Extract insights from strategy assessment
	if (analysisResults.strategyAssessment) {
		insights.push(
			...extractStrategyInsights(analysisResults.strategyAssessment)
		);
	}

	// Extract insights from competitive positioning
	if (analysisResults.competitivePositioning) {
		insights.push(
			...extractPositioningInsights(analysisResults.competitivePositioning)
		);
	}

	// Extract insights from trend analysis
	if (analysisResults.trendAnalysis) {
		insights.push(...extractTrendInsights(analysisResults.trendAnalysis));
	}

	// Extract insights from forecasting
	if (analysisResults.forecasting) {
		insights.push(...extractForecastInsights(analysisResults.forecasting));
	}

	return insights.slice(0, 10); // Return top 10 insights
}

function generateRecommendations(analysisResults: any): Array<Recommendation> {
	const recommendations: Recommendation[] = [];

	// Generate strategic recommendations
	if (analysisResults.competitivePositioning) {
		recommendations.push(
			...generateStrategicRecommendations(
				analysisResults.competitivePositioning
			)
		);
	}

	// Generate market recommendations
	if (analysisResults.marketAnalysis) {
		recommendations.push(
			...generateMarketRecommendations(analysisResults.marketAnalysis)
		);
	}

	// Generate trend-based recommendations
	if (analysisResults.trendAnalysis) {
		recommendations.push(
			...generateTrendRecommendations(analysisResults.trendAnalysis)
		);
	}

	return recommendations.sort(
		(a, b) => b.impact * b.priority - a.impact * a.priority
	);
}

function assessCompetitiveRisks(analysisResults: any): Array<RiskAssessment> {
	const risks: RiskAssessment[] = [];

	// Assess market risks
	if (analysisResults.marketAnalysis) {
		risks.push(...assessMarketRisks(analysisResults.marketAnalysis));
	}

	// Assess competitive risks
	if (analysisResults.competitivePositioning) {
		risks.push(
			...assessCompetitiveRisks(analysisResults.competitivePositioning)
		);
	}

	// Assess trend risks
	if (analysisResults.trendAnalysis) {
		risks.push(...assessTrendRisks(analysisResults.trendAnalysis));
	}

	return risks.sort(
		(a, b) => b.probability * b.impact - a.probability * a.impact
	);
}

function identifyOpportunities(
	analysisResults: any
): Array<OpportunityAnalysis> {
	const opportunities: OpportunityAnalysis[] = [];

	// Identify market opportunities
	if (analysisResults.marketAnalysis) {
		opportunities.push(
			...identifyMarketOpportunities(analysisResults.marketAnalysis)
		);
	}

	// Identify positioning opportunities
	if (analysisResults.competitivePositioning) {
		opportunities.push(
			...identifyPositioningOpportunities(
				analysisResults.competitivePositioning
			)
		);
	}

	// Identify trend opportunities
	if (analysisResults.trendAnalysis) {
		opportunities.push(
			...identifyTrendOpportunities(analysisResults.trendAnalysis)
		);
	}

	return opportunities.sort((a, b) => b.potential - a.potential);
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("competitiveIntelligenceAgent", () => {
	test("should orchestrate comprehensive competitive analysis");
	test("should handle different analysis types");
	test("should provide real-time progress updates");
	test("should integrate with SSE infrastructure");
	test("should handle errors gracefully");
	test("should return structured competitive intelligence data");
	test("should support custom analysis requests");
	test("should generate actionable insights and recommendations");
	test("should assess competitive risks and opportunities");
	test("should validate input parameters correctly");
	test("should work with existing chat interface");
	test("should create artifacts correctly");
});
```

### Integration Tests

```typescript
describe("Competitive Intelligence Agent Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with SSE infrastructure");
	test("should handle long-running analysis tasks");
	test("should provide comprehensive competitive insights");
});
```

## 🔗 Dependencies

- **Requires**: None (foundational agent)
- **External**: Market research APIs, competitor data sources, trend analysis
  services
- **Internal**: SSE infrastructure, artifact generation system

## 📊 Performance Requirements

- **Response Time**: < 30 seconds for basic analysis, < 2 minutes for
  comprehensive analysis
- **Data Size**: Response payload < 500 KB
- **Reliability**: > 95% analysis completion rate
- **Concurrent Usage**: Support 10+ simultaneous competitive analyses

## 🔍 Definition of Ready

- [ ] SSE infrastructure is set up
- [ ] Market research data sources are identified
- [ ] Competitor analysis methodologies are defined
- [ ] Test scenarios are defined
- [ ] Artifact generation is planned

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Agent integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] SSE progress updates work reliably
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Analyze competitive landscape for my SaaS company"
// Tool call with parameters:
{
	targetCompany: {
		name: "MySaaS",
		description: "Cloud-based project management software for small teams",
		website: "https://mysaas.com",
		industry: "SaaS",
		marketFocus: "b2b",
		companySize: "startup"
	},
	analysisType: "comprehensive",
	marketContext: {
		geographicScope: "global",
		timeframe: "current"
	}
}
```

### Advanced Usage

```typescript
// User query: "Provide strategic competitive analysis with trends and forecasting"
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
	competitors: ["OpenAI", "Anthropic", "Google AI"],
	analysisType: "strategic",
	marketContext: {
		industry: "Artificial Intelligence",
		geographicScope: "global",
		timeframe: "trending",
		keyMetrics: ["market share", "revenue growth", "customer satisfaction"]
	},
	includeTrends: true,
	includeForecasting: true,
	customAnalysis: ["AI ethics positioning", "enterprise adoption patterns"]
}
```

## 📝 Notes

- Focus on comprehensive competitive intelligence gathering
- Implement robust error handling for external data sources
- Design for extensibility (future analysis types)
- Ensure high-quality insights and actionable recommendations
- Consider data privacy and ethical competitive intelligence practices

## 🔄 Follow-up Tasks

- GEO-214: Competitor Research Tool
- GEO-215: Market Analysis Tool
- GEO-216: Strategy Assessment Tool
- GEO-217: Competitive Positioning Tool
- GEO-218: Trend Analysis Tool
- GEO-219: Competitive Dashboard Tool
