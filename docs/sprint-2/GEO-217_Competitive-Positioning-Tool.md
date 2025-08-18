# GEO-217: Competitive Positioning Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P1 (Important) **Story Points**: 5  
**Estimated Time**: 8 hours **Assignee**: [Developer Name] **Sprint**: Sprint 2,
Phase 2C  
**Dependencies**: GEO-216 (Strategy Assessment Tool)

## 🎯 User Story

As a **GEO analyst**, I want **competitive positioning analysis** so that I can
**understand market positioning and competitive advantages**.

## 📝 Description

Create a competitive positioning tool that analyzes market positioning,
competitive advantages, market gaps, and positioning strategies. This tool will
use AI-powered analysis to evaluate positioning effectiveness and provide
actionable positioning recommendations.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Analyzes competitive positioning and market positioning
- [ ] **AC2**: Identifies competitive advantages and differentiation
- [ ] **AC3**: Identifies market gaps and opportunities
- [ ] **AC4**: Provides positioning strategy recommendations
- [ ] **AC5**: Evaluates positioning effectiveness
- [ ] **AC6**: Analyzes positioning risks and threats

### Data Structure Requirements

- [ ] **AC7**: Returns comprehensive positioning analysis with multiple
      dimensions
- [ ] **AC8**: Includes competitive advantage analysis
- [ ] **AC9**: Provides market gap identification
- [ ] **AC10**: Includes positioning strategy evaluation
- [ ] **AC11**: Supports different analysis depths and scopes
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
// lib/ai/tools/competitive-positioning-tool.ts
export const competitivePositioningTool = tool({
	description:
		"Competitive positioning analysis and market positioning strategy",
	inputSchema: z.object({
		targetCompany: z.object({
			name: z.string().min(1).max(100),
			description: z.string().min(10).max(1000),
			website: z.string().url(),
			industry: z.string().optional(),
			marketFocus: z.enum(["b2b", "b2c", "both"]).optional(),
			companySize: z.enum(["startup", "sme", "enterprise"]).optional(),
		}),
		competitors: z.array(z.string()).min(1).max(20),
		positioningDimensions: z
			.array(
				z.enum([
					"price",
					"quality",
					"features",
					"service",
					"brand",
					"innovation",
					"custom",
				])
			)
			.default(["price", "quality", "features"]),
		analysisType: z
			.enum(["comprehensive", "positioning", "advantages", "gaps", "strategy"])
			.default("comprehensive"),
		includeMarketGaps: z.boolean().default(true),
		includePositioningStrategy: z.boolean().default(true),
		includeEffectivenessEvaluation: z.boolean().default(true),
		customDimensions: z.array(z.string()).optional(),
		timeframe: z
			.enum(["current", "quarterly", "annual", "trending"])
			.default("current"),
	}),
	handler: async (ctx, args) => {
		const {
			targetCompany,
			competitors,
			positioningDimensions,
			analysisType,
			includeMarketGaps,
			includePositioningStrategy,
			includeEffectivenessEvaluation,
			customDimensions,
			timeframe,
		} = args;

		try {
			// Step 1: Create positioning map
			const positioningMap = await createPositioningMap(
				targetCompany,
				competitors,
				positioningDimensions,
				customDimensions,
				timeframe
			);

			// Step 2: Analyze competitive advantages
			const competitiveAdvantages = await analyzeCompetitiveAdvantages(
				targetCompany,
				competitors,
				positioningDimensions,
				timeframe
			);

			// Step 3: Identify market gaps (if enabled)
			let marketGaps = null;
			if (includeMarketGaps) {
				marketGaps = await identifyMarketGaps(
					targetCompany,
					competitors,
					positioningMap,
					timeframe
				);
			}

			// Step 4: Analyze positioning strategy (if enabled)
			let positioningStrategy = null;
			if (includePositioningStrategy) {
				positioningStrategy = await analyzePositioningStrategy(
					targetCompany,
					competitors,
					positioningMap,
					competitiveAdvantages,
					timeframe
				);
			}

			// Step 5: Evaluate positioning effectiveness (if enabled)
			let effectivenessEvaluation = null;
			if (includeEffectivenessEvaluation) {
				effectivenessEvaluation = await evaluatePositioningEffectiveness(
					targetCompany,
					competitors,
					positioningMap,
					competitiveAdvantages,
					timeframe
				);
			}

			// Step 6: Generate positioning insights
			const positioningInsights = await generatePositioningInsights(
				targetCompany,
				positioningMap,
				competitiveAdvantages,
				marketGaps,
				positioningStrategy,
				effectivenessEvaluation
			);

			return {
				targetCompany,
				competitors,
				positioningDimensions,
				analysisType,
				timeframe,
				positioningMap,
				competitiveAdvantages,
				marketGaps,
				positioningStrategy,
				effectivenessEvaluation,
				positioningInsights,
				analysisMetadata: {
					analysisType,
					includeMarketGaps,
					includePositioningStrategy,
					includeEffectivenessEvaluation,
					customDimensions: customDimensions || [],
					positioningDimensions,
					analysisQuality: calculateAnalysisQuality({
						positioningMap,
						competitiveAdvantages,
						marketGaps,
						positioningStrategy,
						effectivenessEvaluation,
					}),
					confidenceScores: calculateConfidenceScores({
						positioningMap,
						competitiveAdvantages,
						marketGaps,
						positioningStrategy,
						effectivenessEvaluation,
					}),
				},
				metadata: {
					executionTime: Date.now(),
					category: "competitive-positioning",
					analysisType,
					competitorsCount: competitors.length,
					positioningDimensionsCount: positioningDimensions.length,
					timeframe,
					success: true,
				},
			};
		} catch (error) {
			throw new Error(
				`Competitive positioning analysis failed: ${error.message}`
			);
		}
	},
});
```

### Response Data Structure

```typescript
interface CompetitivePositioningResult {
	targetCompany: {
		name: string;
		description: string;
		website: string;
		industry?: string;
		marketFocus?: "b2b" | "b2c" | "both";
		companySize?: "startup" | "sme" | "enterprise";
	};
	competitors: string[];
	positioningDimensions: string[];
	analysisType:
		| "comprehensive"
		| "positioning"
		| "advantages"
		| "gaps"
		| "strategy";
	timeframe: "current" | "quarterly" | "annual" | "trending";
	positioningMap: Array<{
		company: string;
		dimensions: Record<string, number>;
		position: string;
		strength: number;
		uniqueness: number;
		sustainability: number;
		risks: string[];
		opportunities: string[];
	}>;
	competitiveAdvantages: Array<{
		company: string;
		advantages: string[];
		strength: number;
		sustainability: number;
		uniqueness: number;
		leverage: string[];
		threats: string[];
		opportunities: string[];
	}>;
	marketGaps?: Array<{
		gap: string;
		description: string;
		opportunity: number;
		size: string;
		barriers: string[];
		potentialPlayers: string[];
		entryStrategies: string[];
		timeframe: string;
	}>;
	positioningStrategy?: {
		currentPosition: {
			position: string;
			description: string;
			strengths: string[];
			weaknesses: string[];
			effectiveness: number;
		};
		recommendedPosition: {
			position: string;
			description: string;
			rationale: string[];
			advantages: string[];
			risks: string[];
			implementation: string[];
		};
		positioningOptions: Array<{
			position: string;
			description: string;
			feasibility: number;
			potential: number;
			effort: number;
			risks: string[];
			advantages: string[];
		}>;
		implementationPlan: Array<{
			step: string;
			description: string;
			effort: number;
			timeframe: string;
			requirements: string[];
			successMetrics: string[];
		}>;
	};
	effectivenessEvaluation?: {
		positioningEffectiveness: Array<{
			company: string;
			overallScore: number;
			clarity: number;
			consistency: number;
			credibility: number;
			competitiveness: number;
			strengths: string[];
			weaknesses: string[];
			recommendations: string[];
		}>;
		marketPerception: Array<{
			company: string;
			perception: string;
			strengths: string[];
			weaknesses: string[];
			gaps: string[];
			recommendations: string[];
		}>;
		competitiveComparison: Array<{
			dimension: string;
			leader: string;
			laggard: string;
			insights: string[];
			opportunities: string[];
		}>;
	};
	positioningInsights: {
		keyFindings: string[];
		positioningImplications: string[];
		recommendations: Array<{
			category: string;
			recommendation: string;
			priority: "low" | "medium" | "high";
			impact: number;
			effort: number;
			timeframe: string;
		}>;
		positioningGaps: Array<{
			gap: string;
			description: string;
			opportunity: number;
			barriers: string[];
			solutions: string[];
		}>;
		competitiveThreats: Array<{
			threat: string;
			description: string;
			probability: number;
			impact: number;
			mitigation: string[];
		}>;
		positioningOpportunities: Array<{
			opportunity: string;
			description: string;
			potential: number;
			timeframe: string;
			requirements: string[];
		}>;
	};
	analysisMetadata: {
		analysisType: string;
		includeMarketGaps: boolean;
		includePositioningStrategy: boolean;
		includeEffectivenessEvaluation: boolean;
		customDimensions: string[];
		positioningDimensions: string[];
		analysisQuality: number;
		confidenceScores: Record<string, number>;
	};
	metadata: {
		executionTime: number;
		category: "competitive-positioning";
		analysisType: string;
		competitorsCount: number;
		positioningDimensionsCount: number;
		timeframe: string;
		success: boolean;
	};
}
```

### Positioning Functions

```typescript
async function createPositioningMap(
	targetCompany: any,
	competitors: string[],
	positioningDimensions: string[],
	customDimensions: string[] | undefined,
	timeframe: string
): Promise<PositioningMapEntry[]> {
	const allDimensions = [...positioningDimensions, ...(customDimensions || [])];

	const positioningData = await Promise.all(
		[targetCompany.name, ...competitors].map(async (company) => {
			const dimensions: Record<string, number> = {};

			// Analyze each dimension
			for (const dimension of allDimensions) {
				dimensions[dimension] = await analyzePositioningDimension(
					company,
					dimension,
					targetCompany,
					timeframe
				);
			}

			const position = await identifyPosition(
				company,
				dimensions,
				targetCompany
			);
			const strength = await calculatePositioningStrength(
				company,
				dimensions,
				targetCompany
			);
			const uniqueness = await calculateUniqueness(
				company,
				dimensions,
				competitors,
				targetCompany
			);
			const sustainability = await calculateSustainability(
				company,
				dimensions,
				targetCompany
			);
			const risks = await identifyPositioningRisks(
				company,
				dimensions,
				targetCompany
			);
			const opportunities = await identifyPositioningOpportunities(
				company,
				dimensions,
				targetCompany
			);

			return {
				company,
				dimensions,
				position,
				strength,
				uniqueness,
				sustainability,
				risks,
				opportunities,
			};
		})
	);

	return positioningData;
}

async function analyzeCompetitiveAdvantages(
	targetCompany: any,
	competitors: string[],
	positioningDimensions: string[],
	timeframe: string
): Promise<CompetitiveAdvantage[]> {
	const advantages = await Promise.all(
		[targetCompany.name, ...competitors].map(async (company) => {
			const companyAdvantages = await identifyCompetitiveAdvantages(
				company,
				targetCompany,
				positioningDimensions,
				timeframe
			);
			const strength = await calculateAdvantageStrength(
				company,
				companyAdvantages,
				targetCompany
			);
			const sustainability = await calculateAdvantageSustainability(
				company,
				companyAdvantages,
				targetCompany
			);
			const uniqueness = await calculateAdvantageUniqueness(
				company,
				companyAdvantages,
				competitors,
				targetCompany
			);
			const leverage = await identifyAdvantageLeverage(
				company,
				companyAdvantages,
				targetCompany
			);
			const threats = await identifyAdvantageThreats(
				company,
				companyAdvantages,
				targetCompany
			);
			const opportunities = await identifyAdvantageOpportunities(
				company,
				companyAdvantages,
				targetCompany
			);

			return {
				company,
				advantages: companyAdvantages,
				strength,
				sustainability,
				uniqueness,
				leverage,
				threats,
				opportunities,
			};
		})
	);

	return advantages;
}

async function identifyMarketGaps(
	targetCompany: any,
	competitors: string[],
	positioningMap: any[],
	timeframe: string
): Promise<MarketGap[]> {
	// Analyze positioning map to identify gaps
	const gaps = await analyzePositioningGaps(
		positioningMap,
		targetCompany,
		competitors
	);

	// Evaluate each gap
	const evaluatedGaps = await Promise.all(
		gaps.map(async (gap) => {
			const opportunity = await evaluateGapOpportunity(
				gap,
				targetCompany,
				competitors
			);
			const size = await estimateGapSize(gap, targetCompany, competitors);
			const barriers = await identifyGapBarriers(
				gap,
				targetCompany,
				competitors
			);
			const potentialPlayers = await identifyPotentialPlayers(
				gap,
				targetCompany,
				competitors
			);
			const entryStrategies = await suggestEntryStrategies(
				gap,
				targetCompany,
				competitors
			);
			const gapTimeframe = await estimateGapTimeframe(
				gap,
				targetCompany,
				competitors
			);

			return {
				gap: gap.name,
				description: gap.description,
				opportunity,
				size,
				barriers,
				potentialPlayers,
				entryStrategies,
				timeframe: gapTimeframe,
			};
		})
	);

	return evaluatedGaps;
}

async function analyzePositioningStrategy(
	targetCompany: any,
	competitors: string[],
	positioningMap: any[],
	competitiveAdvantages: any[],
	timeframe: string
): Promise<PositioningStrategy> {
	// Analyze current position
	const currentPosition = await analyzeCurrentPosition(
		targetCompany,
		positioningMap,
		competitiveAdvantages
	);

	// Recommend optimal position
	const recommendedPosition = await recommendOptimalPosition(
		targetCompany,
		positioningMap,
		competitiveAdvantages,
		competitors
	);

	// Identify positioning options
	const positioningOptions = await identifyPositioningOptions(
		targetCompany,
		positioningMap,
		competitiveAdvantages,
		competitors
	);

	// Create implementation plan
	const implementationPlan = await createImplementationPlan(
		targetCompany,
		recommendedPosition,
		positioningOptions
	);

	return {
		currentPosition,
		recommendedPosition,
		positioningOptions,
		implementationPlan,
	};
}

async function evaluatePositioningEffectiveness(
	targetCompany: any,
	competitors: string[],
	positioningMap: any[],
	competitiveAdvantages: any[],
	timeframe: string
): Promise<EffectivenessEvaluation> {
	// Evaluate positioning effectiveness
	const positioningEffectiveness = await Promise.all(
		[targetCompany.name, ...competitors].map(async (company) => {
			const overallScore = await calculatePositioningEffectiveness(
				company,
				targetCompany
			);
			const clarity = await evaluatePositioningClarity(company, targetCompany);
			const consistency = await evaluatePositioningConsistency(
				company,
				targetCompany
			);
			const credibility = await evaluatePositioningCredibility(
				company,
				targetCompany
			);
			const competitiveness = await evaluatePositioningCompetitiveness(
				company,
				targetCompany
			);
			const strengths = await identifyEffectivenessStrengths(
				company,
				targetCompany
			);
			const weaknesses = await identifyEffectivenessWeaknesses(
				company,
				targetCompany
			);
			const recommendations = await generateEffectivenessRecommendations(
				company,
				targetCompany
			);

			return {
				company,
				overallScore,
				clarity,
				consistency,
				credibility,
				competitiveness,
				strengths,
				weaknesses,
				recommendations,
			};
		})
	);

	// Analyze market perception
	const marketPerception = await Promise.all(
		[targetCompany.name, ...competitors].map(async (company) => {
			const perception = await analyzeMarketPerception(company, targetCompany);
			const strengths = await identifyPerceptionStrengths(
				company,
				targetCompany
			);
			const weaknesses = await identifyPerceptionWeaknesses(
				company,
				targetCompany
			);
			const gaps = await identifyPerceptionGaps(company, targetCompany);
			const recommendations = await generatePerceptionRecommendations(
				company,
				targetCompany
			);

			return {
				company,
				perception,
				strengths,
				weaknesses,
				gaps,
				recommendations,
			};
		})
	);

	// Analyze competitive comparison
	const competitiveComparison = await analyzeCompetitiveComparison(
		positioningMap,
		targetCompany,
		competitors
	);

	return {
		positioningEffectiveness,
		marketPerception,
		competitiveComparison,
	};
}

async function generatePositioningInsights(
	targetCompany: any,
	positioningMap: any[],
	competitiveAdvantages: any[],
	marketGaps: any,
	positioningStrategy: any,
	effectivenessEvaluation: any
): Promise<PositioningInsights> {
	// Generate key findings
	const keyFindings = await generateKeyFindings(
		targetCompany,
		positioningMap,
		competitiveAdvantages,
		marketGaps,
		positioningStrategy,
		effectivenessEvaluation
	);

	// Generate positioning implications
	const positioningImplications = await generatePositioningImplications(
		targetCompany,
		positioningMap,
		competitiveAdvantages,
		marketGaps,
		positioningStrategy,
		effectivenessEvaluation
	);

	// Generate recommendations
	const recommendations = await generateRecommendations(
		targetCompany,
		positioningMap,
		competitiveAdvantages,
		marketGaps,
		positioningStrategy,
		effectivenessEvaluation
	);

	// Identify positioning gaps
	const positioningGaps = await identifyPositioningGaps(
		targetCompany,
		positioningMap,
		competitiveAdvantages,
		marketGaps,
		positioningStrategy,
		effectivenessEvaluation
	);

	// Identify competitive threats
	const competitiveThreats = await identifyCompetitiveThreats(
		targetCompany,
		positioningMap,
		competitiveAdvantages,
		marketGaps,
		positioningStrategy,
		effectivenessEvaluation
	);

	// Identify positioning opportunities
	const positioningOpportunities = await identifyPositioningOpportunities(
		targetCompany,
		positioningMap,
		competitiveAdvantages,
		marketGaps,
		positioningStrategy,
		effectivenessEvaluation
	);

	return {
		keyFindings,
		positioningImplications,
		recommendations,
		positioningGaps,
		competitiveThreats,
		positioningOpportunities,
	};
}

function calculateAnalysisQuality(analysisResults: any): number {
	const components = [
		analysisResults.positioningMap,
		analysisResults.competitiveAdvantages,
		analysisResults.marketGaps,
		analysisResults.positioningStrategy,
		analysisResults.effectivenessEvaluation,
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
describe("competitivePositioningTool", () => {
	test("should create positioning map accurately");
	test("should analyze competitive advantages");
	test("should identify market gaps");
	test("should analyze positioning strategy");
	test("should evaluate positioning effectiveness");
	test("should generate actionable positioning insights");
	test("should validate input parameters correctly");
	test("should return properly structured response");
	test("should handle different positioning dimensions");
	test("should support custom dimensions");
	test("should provide confidence scoring");
	test("should handle different analysis types");
});
```

### Integration Tests

```typescript
describe("Competitive Positioning Tool Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with competitive intelligence agent");
	test("should handle external data source failures");
	test("should provide comprehensive positioning insights");
});
```

## 🔗 Dependencies

- **Requires**: GEO-216 (Strategy Assessment Tool)
- **External**: Market research databases, positioning analysis services
- **Internal**: AI analysis functions, positioning algorithms

## 📊 Performance Requirements

- **Response Time**: < 30 seconds for basic analysis, < 90 seconds for
  comprehensive analysis
- **Data Size**: Response payload < 400 KB
- **Reliability**: > 95% analysis completion rate
- **Concurrent Usage**: Support 8+ simultaneous positioning analyses

## 🔍 Definition of Ready

- [ ] Strategy assessment tool is implemented
- [ ] Positioning data sources are identified and configured
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
// User query: "Analyze competitive positioning for my company"
// Tool call with parameters:
{
	targetCompany: {
		name: "MyCompany",
		description: "Cloud-based project management software",
		website: "https://mycompany.com",
		industry: "SaaS",
		marketFocus: "b2b"
	},
	competitors: ["Asana", "Trello", "Monday.com"],
	positioningDimensions: ["price", "quality", "features"],
	analysisType: "comprehensive",
	includeMarketGaps: true,
	includePositioningStrategy: true,
	includeEffectivenessEvaluation: true
}
```

### Advanced Usage

```typescript
// User query: "Provide detailed positioning analysis with custom dimensions"
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
	positioningDimensions: ["price", "quality", "features", "service", "brand", "innovation"],
	analysisType: "comprehensive",
	includeMarketGaps: true,
	includePositioningStrategy: true,
	includeEffectivenessEvaluation: true,
	customDimensions: ["AI ethics", "enterprise integration", "talent acquisition"],
	timeframe: "trending"
}
```

## 📝 Notes

- Focus on comprehensive positioning intelligence gathering
- Implement robust error handling for external data sources
- Consider data privacy and ethical positioning analysis practices
- Design for extensibility (future positioning analysis types)
- Ensure high-quality insights and actionable recommendations

## 🔄 Follow-up Tasks

- GEO-218: Trend Analysis Tool
- GEO-219: Competitive Dashboard Tool
