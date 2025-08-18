# GEO-214: Competitor Research Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Critical) **Story Points**: 8  
**Estimated Time**: 12 hours **Assignee**: [Developer Name] **Sprint**: Sprint
2, Phase 2C  
**Dependencies**: None

## 🎯 User Story

As a **GEO analyst**, I want **comprehensive competitor research** so that I can
**gather detailed information about competitors and market landscape**.

## 📝 Description

Create a comprehensive competitor research tool that gathers detailed
information about competitors, analyzes market landscape, identifies key
players, and provides structured competitor data. This tool will use multiple
data sources, AI-powered analysis, and provide comprehensive competitor profiles
with market positioning.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Gathers comprehensive competitor information from multiple
      sources
- [ ] **AC2**: Analyzes market landscape and identifies key players
- [ ] **AC3**: Provides detailed competitor profiles with strengths/weaknesses
- [ ] **AC4**: Identifies market segments and competitive positioning
- [ ] **AC5**: Handles different industries and market types
- [ ] **AC6**: Provides market size and growth rate analysis

### Data Structure Requirements

- [ ] **AC7**: Returns detailed competitor profiles with comprehensive data
- [ ] **AC8**: Includes market landscape analysis and segmentation
- [ ] **AC9**: Provides competitive positioning and market share data
- [ ] **AC10**: Includes recent developments and strategic moves
- [ ] **AC11**: Supports different research depths and scopes
- [ ] **AC12**: Handles edge cases (new companies, niche markets, startups)

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
// lib/ai/tools/competitor-research-tool.ts
export const competitorResearchTool = tool({
	description:
		"Comprehensive competitor research and market landscape analysis",
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
		researchDepth: z
			.enum(["basic", "comprehensive", "expert"])
			.default("comprehensive"),
		marketScope: z
			.enum(["local", "regional", "national", "global"])
			.default("global"),
		includeFinancials: z.boolean().default(true),
		includeRecentDevelopments: z.boolean().default(true),
		includeMarketAnalysis: z.boolean().default(true),
		customResearchAreas: z.array(z.string()).optional(),
		dataSources: z
			.array(z.enum(["web", "social", "financial", "news", "patents", "all"]))
			.default(["all"]),
	}),
	handler: async (ctx, args) => {
		const {
			targetCompany,
			competitors,
			researchDepth,
			marketScope,
			includeFinancials,
			includeRecentDevelopments,
			includeMarketAnalysis,
			customResearchAreas,
			dataSources,
		} = args;

		try {
			// Step 1: Identify competitors if not provided
			const competitorList =
				competitors ||
				(await identifyCompetitors(targetCompany, marketScope, researchDepth));

			// Step 2: Gather competitor data from multiple sources
			const competitorData = await Promise.all(
				competitorList.map(async (competitor) => {
					return await researchCompetitor(
						competitor,
						targetCompany,
						researchDepth,
						dataSources,
						includeFinancials,
						includeRecentDevelopments
					);
				})
			);

			// Step 3: Analyze market landscape
			const marketLandscape = includeMarketAnalysis
				? await analyzeMarketLandscape(
						targetCompany,
						competitorData,
						marketScope
					)
				: null;

			// Step 4: Perform custom research areas
			let customResearchResults = null;
			if (customResearchAreas && customResearchAreas.length > 0) {
				customResearchResults = await performCustomResearch(
					targetCompany,
					competitorData,
					customResearchAreas
				);
			}

			// Step 5: Analyze competitive positioning
			const competitivePositioning = await analyzeCompetitivePositioning(
				targetCompany,
				competitorData,
				marketScope
			);

			// Step 6: Generate insights and recommendations
			const insights = await generateCompetitiveInsights(
				targetCompany,
				competitorData,
				marketLandscape,
				competitivePositioning
			);

			return {
				targetCompany,
				researchDepth,
				marketScope,
				competitors: competitorData,
				marketLandscape,
				competitivePositioning,
				customResearchResults,
				insights,
				researchMetadata: {
					totalCompetitors: competitorData.length,
					dataSources: dataSources,
					researchAreas: customResearchAreas || [],
					includeFinancials,
					includeRecentDevelopments,
					includeMarketAnalysis,
					researchQuality: calculateResearchQuality(
						competitorData,
						researchDepth
					),
					confidenceScores: calculateConfidenceScores(competitorData),
				},
				metadata: {
					executionTime: Date.now(),
					category: "competitor-research",
					researchDepth,
					marketScope,
					dataSourcesCount: dataSources.length,
					success: true,
				},
			};
		} catch (error) {
			throw new Error(`Competitor research failed: ${error.message}`);
		}
	},
});
```

### Response Data Structure

```typescript
interface CompetitorResearchResult {
	targetCompany: {
		name: string;
		description: string;
		website: string;
		industry?: string;
		marketFocus?: "b2b" | "b2c" | "both";
		companySize?: "startup" | "sme" | "enterprise";
	};
	researchDepth: "basic" | "comprehensive" | "expert";
	marketScope: "local" | "regional" | "national" | "global";
	competitors: Array<{
		name: string;
		description: string;
		website: string;
		industry: string;
		marketFocus: string;
		companySize: string;
		headquarters: string;
		founded: string;
		employees: string;
		revenue: string;
		marketShare: number;
		keyProducts: string[];
		targetMarket: string;
		strengths: string[];
		weaknesses: string[];
		competitiveAdvantages: string[];
		recentDevelopments: Array<{
			date: string;
			title: string;
			description: string;
			impact: "positive" | "negative" | "neutral";
			source: string;
		}>;
		financials: {
			revenue: string;
			growthRate: number;
			funding: string;
			valuation: string;
			profitability: string;
		};
		marketPosition: {
			position: string;
			marketShare: number;
			competitiveIntensity: "low" | "medium" | "high";
			barriersToEntry: string[];
		};
		technology: {
			techStack: string[];
			patents: number;
			innovationAreas: string[];
			technicalAdvantages: string[];
		};
		customerBase: {
			totalCustomers: string;
			customerSegments: string[];
			customerSatisfaction: number;
			retentionRate: number;
		};
		partnerships: Array<{
			partner: string;
			type: string;
			description: string;
			date: string;
		}>;
		expansion: {
			geographicPresence: string[];
			expansionPlans: string[];
			internationalMarkets: string[];
		};
		risks: string[];
		opportunities: string[];
		confidenceScore: number;
		dataQuality: number;
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
			characteristics: string[];
		}>;
		marketDrivers: string[];
		marketRestraints: string[];
		opportunities: string[];
		threats: string[];
		regulatoryEnvironment: string[];
		technologyTrends: string[];
		customerTrends: string[];
	};
	competitivePositioning: {
		positioningMap: Array<{
			company: string;
			price: number;
			quality: number;
			features: number;
			marketShare: number;
			innovation: number;
		}>;
		competitiveAdvantages: Array<{
			company: string;
			advantages: string[];
			sustainability: number;
			uniqueness: number;
		}>;
		marketGaps: Array<{
			segment: string;
			description: string;
			opportunity: number;
			barriers: string[];
			potentialPlayers: string[];
		}>;
		competitiveIntensity: {
			overall: "low" | "medium" | "high";
			bySegment: Record<string, "low" | "medium" | "high">;
			factors: string[];
		};
	};
	customResearchResults?: Array<{
		area: string;
		findings: string[];
		insights: string[];
		recommendations: string[];
		dataQuality: number;
	}>;
	insights: {
		keyFindings: string[];
		competitiveThreats: string[];
		opportunities: string[];
		strategicRecommendations: Array<{
			category: string;
			recommendation: string;
			priority: "low" | "medium" | "high";
			impact: number;
			effort: number;
		}>;
		marketGaps: string[];
		emergingTrends: string[];
		riskFactors: string[];
	};
	researchMetadata: {
		totalCompetitors: number;
		dataSources: string[];
		researchAreas: string[];
		includeFinancials: boolean;
		includeRecentDevelopments: boolean;
		includeMarketAnalysis: boolean;
		researchQuality: number;
		confidenceScores: Record<string, number>;
	};
	metadata: {
		executionTime: number;
		category: "competitor-research";
		researchDepth: string;
		marketScope: string;
		dataSourcesCount: number;
		success: boolean;
	};
}
```

### Research Functions

```typescript
async function identifyCompetitors(
	targetCompany: any,
	marketScope: string,
	researchDepth: string
): Promise<string[]> {
	// Use AI to identify relevant competitors
	const competitorQueries = await generateCompetitorQueries(
		targetCompany,
		marketScope
	);

	// Search for competitors using multiple sources
	const potentialCompetitors = await searchCompetitors(
		competitorQueries,
		marketScope
	);

	// Filter and rank competitors based on relevance
	const rankedCompetitors = await rankCompetitors(
		potentialCompetitors,
		targetCompany
	);

	// Return top competitors based on research depth
	const competitorCount =
		researchDepth === "basic" ? 5 : researchDepth === "comprehensive" ? 10 : 15;
	return rankedCompetitors.slice(0, competitorCount).map((c) => c.name);
}

async function researchCompetitor(
	competitorName: string,
	targetCompany: any,
	researchDepth: string,
	dataSources: string[],
	includeFinancials: boolean,
	includeRecentDevelopments: boolean
): Promise<CompetitorProfile> {
	// Gather basic company information
	const basicInfo = await gatherBasicCompanyInfo(competitorName, dataSources);

	// Gather detailed company information
	const detailedInfo = await gatherDetailedCompanyInfo(
		competitorName,
		researchDepth,
		dataSources
	);

	// Gather financial information if requested
	const financials = includeFinancials
		? await gatherFinancialInformation(competitorName, dataSources)
		: null;

	// Gather recent developments if requested
	const recentDevelopments = includeRecentDevelopments
		? await gatherRecentDevelopments(competitorName, dataSources)
		: [];

	// Analyze competitive positioning
	const marketPosition = await analyzeMarketPosition(
		competitorName,
		targetCompany
	);

	// Gather technology information
	const technology = await gatherTechnologyInfo(competitorName, dataSources);

	// Gather customer information
	const customerBase = await gatherCustomerInfo(competitorName, dataSources);

	// Gather partnership information
	const partnerships = await gatherPartnershipInfo(competitorName, dataSources);

	// Gather expansion information
	const expansion = await gatherExpansionInfo(competitorName, dataSources);

	// Analyze strengths and weaknesses
	const analysis = await analyzeCompetitorStrengthsWeaknesses(
		competitorName,
		targetCompany,
		detailedInfo,
		financials,
		technology,
		customerBase
	);

	// Calculate confidence scores
	const confidenceScore = calculateConfidenceScore(
		basicInfo,
		detailedInfo,
		financials
	);
	const dataQuality = calculateDataQuality(basicInfo, detailedInfo, financials);

	return {
		name: competitorName,
		description: detailedInfo.description,
		website: detailedInfo.website,
		industry: detailedInfo.industry,
		marketFocus: detailedInfo.marketFocus,
		companySize: detailedInfo.companySize,
		headquarters: detailedInfo.headquarters,
		founded: detailedInfo.founded,
		employees: detailedInfo.employees,
		revenue: detailedInfo.revenue,
		marketShare: marketPosition.marketShare,
		keyProducts: detailedInfo.keyProducts,
		targetMarket: detailedInfo.targetMarket,
		strengths: analysis.strengths,
		weaknesses: analysis.weaknesses,
		competitiveAdvantages: analysis.advantages,
		recentDevelopments,
		financials: financials || {
			revenue: "Unknown",
			growthRate: 0,
			funding: "Unknown",
			valuation: "Unknown",
			profitability: "Unknown",
		},
		marketPosition,
		technology,
		customerBase,
		partnerships,
		expansion,
		risks: analysis.risks,
		opportunities: analysis.opportunities,
		confidenceScore,
		dataQuality,
	};
}

async function analyzeMarketLandscape(
	targetCompany: any,
	competitorData: any[],
	marketScope: string
): Promise<MarketLandscape> {
	// Analyze total market size
	const marketSize = await analyzeMarketSize(
		targetCompany,
		competitorData,
		marketScope
	);

	// Analyze market growth
	const growthRate = await analyzeMarketGrowth(
		targetCompany,
		competitorData,
		marketScope
	);

	// Identify key trends
	const keyTrends = await identifyMarketTrends(
		targetCompany,
		competitorData,
		marketScope
	);

	// Analyze market segments
	const marketSegments = await analyzeMarketSegments(
		targetCompany,
		competitorData,
		marketScope
	);

	// Analyze market drivers and restraints
	const marketDrivers = await identifyMarketDrivers(
		targetCompany,
		competitorData,
		marketScope
	);
	const marketRestraints = await identifyMarketRestraints(
		targetCompany,
		competitorData,
		marketScope
	);

	// Identify opportunities and threats
	const opportunities = await identifyMarketOpportunities(
		targetCompany,
		competitorData,
		marketScope
	);
	const threats = await identifyMarketThreats(
		targetCompany,
		competitorData,
		marketScope
	);

	// Analyze regulatory environment
	const regulatoryEnvironment = await analyzeRegulatoryEnvironment(
		targetCompany,
		marketScope
	);

	// Analyze technology trends
	const technologyTrends = await analyzeTechnologyTrends(
		targetCompany,
		competitorData,
		marketScope
	);

	// Analyze customer trends
	const customerTrends = await analyzeCustomerTrends(
		targetCompany,
		competitorData,
		marketScope
	);

	return {
		totalMarketSize: marketSize,
		growthRate,
		keyTrends,
		marketSegments,
		marketDrivers,
		marketRestraints,
		opportunities,
		threats,
		regulatoryEnvironment,
		technologyTrends,
		customerTrends,
	};
}

async function analyzeCompetitivePositioning(
	targetCompany: any,
	competitorData: any[],
	marketScope: string
): Promise<CompetitivePositioning> {
	// Create positioning map
	const positioningMap = await createPositioningMap(
		targetCompany,
		competitorData
	);

	// Analyze competitive advantages
	const competitiveAdvantages = await analyzeCompetitiveAdvantages(
		targetCompany,
		competitorData
	);

	// Identify market gaps
	const marketGaps = await identifyMarketGaps(
		targetCompany,
		competitorData,
		marketScope
	);

	// Analyze competitive intensity
	const competitiveIntensity = await analyzeCompetitiveIntensity(
		targetCompany,
		competitorData,
		marketScope
	);

	return {
		positioningMap,
		competitiveAdvantages,
		marketGaps,
		competitiveIntensity,
	};
}

async function performCustomResearch(
	targetCompany: any,
	competitorData: any[],
	customResearchAreas: string[]
): Promise<CustomResearchResult[]> {
	const results = await Promise.all(
		customResearchAreas.map(async (area) => {
			const findings = await researchCustomArea(
				area,
				targetCompany,
				competitorData
			);
			const insights = await generateInsightsFromFindings(findings, area);
			const recommendations = await generateRecommendationsFromInsights(
				insights,
				area
			);
			const dataQuality = calculateCustomResearchQuality(findings, area);

			return {
				area,
				findings,
				insights,
				recommendations,
				dataQuality,
			};
		})
	);

	return results;
}

async function generateCompetitiveInsights(
	targetCompany: any,
	competitorData: any[],
	marketLandscape: any,
	competitivePositioning: any
): Promise<CompetitiveInsights> {
	// Generate key findings
	const keyFindings = await generateKeyFindings(
		targetCompany,
		competitorData,
		marketLandscape,
		competitivePositioning
	);

	// Identify competitive threats
	const competitiveThreats = await identifyCompetitiveThreats(
		targetCompany,
		competitorData,
		competitivePositioning
	);

	// Identify opportunities
	const opportunities = await identifyOpportunities(
		targetCompany,
		competitorData,
		marketLandscape,
		competitivePositioning
	);

	// Generate strategic recommendations
	const strategicRecommendations = await generateStrategicRecommendations(
		targetCompany,
		competitorData,
		marketLandscape,
		competitivePositioning
	);

	// Identify market gaps
	const marketGaps = await identifyMarketGaps(
		targetCompany,
		competitorData,
		marketLandscape
	);

	// Identify emerging trends
	const emergingTrends = await identifyEmergingTrends(
		targetCompany,
		competitorData,
		marketLandscape
	);

	// Identify risk factors
	const riskFactors = await identifyRiskFactors(
		targetCompany,
		competitorData,
		marketLandscape,
		competitivePositioning
	);

	return {
		keyFindings,
		competitiveThreats,
		opportunities,
		strategicRecommendations,
		marketGaps,
		emergingTrends,
		riskFactors,
	};
}

function calculateResearchQuality(
	competitorData: any[],
	researchDepth: string
): number {
	const baseQuality =
		researchDepth === "basic"
			? 0.6
			: researchDepth === "comprehensive"
				? 0.8
				: 0.9;

	const dataCompleteness =
		competitorData.reduce((sum, competitor) => {
			return sum + competitor.dataQuality;
		}, 0) / competitorData.length;

	const confidenceAverage =
		competitorData.reduce((sum, competitor) => {
			return sum + competitor.confidenceScore;
		}, 0) / competitorData.length;

	return (baseQuality + dataCompleteness + confidenceAverage) / 3;
}

function calculateConfidenceScores(
	competitorData: any[]
): Record<string, number> {
	const scores: Record<string, number> = {};

	competitorData.forEach((competitor) => {
		scores[competitor.name] = competitor.confidenceScore;
	});

	return scores;
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("competitorResearchTool", () => {
	test("should identify competitors automatically");
	test("should gather comprehensive competitor data");
	test("should analyze market landscape");
	test("should provide competitive positioning analysis");
	test("should handle different research depths");
	test("should support custom research areas");
	test("should calculate confidence scores");
	test("should validate input parameters correctly");
	test("should return properly structured response");
	test("should handle edge cases and errors");
	test("should integrate with multiple data sources");
	test("should provide actionable insights");
});
```

### Integration Tests

```typescript
describe("Competitor Research Tool Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with competitive intelligence agent");
	test("should handle external data source failures");
	test("should provide comprehensive competitor profiles");
});
```

## 🔗 Dependencies

- **Requires**: None
- **External**: Company databases, financial APIs, news APIs, social media APIs,
  patent databases
- **Internal**: Data source connectors, AI analysis functions

## 📊 Performance Requirements

- **Response Time**: < 45 seconds for basic research, < 2 minutes for
  comprehensive research
- **Data Size**: Response payload < 800 KB
- **Reliability**: > 90% data retrieval success rate
- **Concurrent Usage**: Support 5+ simultaneous research requests

## 🔍 Definition of Ready

- [ ] Data source APIs are identified and configured
- [ ] AI analysis functions are defined
- [ ] Research methodologies are established
- [ ] Test scenarios are defined
- [ ] Error handling strategies are planned

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] Data quality and confidence scoring works accurately
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Research competitors for my SaaS company"
// Tool call with parameters:
{
	targetCompany: {
		name: "MySaaS",
		description: "Cloud-based project management software",
		website: "https://mysaas.com",
		industry: "SaaS",
		marketFocus: "b2b"
	},
	researchDepth: "comprehensive",
	marketScope: "global",
	includeFinancials: true,
	includeRecentDevelopments: true,
	includeMarketAnalysis: true
}
```

### Advanced Usage

```typescript
// User query: "Provide expert competitor research with custom analysis"
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
	researchDepth: "expert",
	marketScope: "global",
	includeFinancials: true,
	includeRecentDevelopments: true,
	includeMarketAnalysis: true,
	customResearchAreas: ["AI ethics positioning", "enterprise adoption patterns", "talent acquisition strategies"],
	dataSources: ["web", "financial", "news", "patents"]
}
```

## 📝 Notes

- Focus on data quality and accuracy
- Implement robust error handling for external APIs
- Consider data privacy and ethical research practices
- Design for extensibility (future data sources)
- Ensure comprehensive competitor profiling

## 🔄 Follow-up Tasks

- GEO-215: Market Analysis Tool
- GEO-216: Strategy Assessment Tool
- GEO-217: Competitive Positioning Tool
- GEO-218: Trend Analysis Tool
- GEO-219: Competitive Dashboard Tool
