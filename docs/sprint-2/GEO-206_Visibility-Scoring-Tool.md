# GEO-206: Visibility Scoring Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P1 (Important) **Story Points**: 7  
**Estimated Time**: 12 hours **Assignee**: [Developer Name] **Sprint**: Sprint
2, Phase 2A  
**Dependencies**: GEO-204 (Brand Detection Tool)

## 🎯 User Story

As a **GEO analyst**, I want **competitive visibility scoring** so that I can
**understand my brand's position relative to competitors**.

## 📝 Description

Create a competitive visibility scoring tool that calculates visibility scores
(0-100) for all brands, provides competitive positioning analysis, calculates
share of voice metrics, generates competitive rankings, and provides actionable
insights and recommendations.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Calculates visibility scores (0-100) for all brands
- [ ] **AC2**: Provides competitive positioning analysis
- [ ] **AC3**: Calculates share of voice metrics
- [ ] **AC4**: Generates competitive rankings
- [ ] **AC5**: Supports historical trend analysis
- [ ] **AC6**: Provides actionable insights and recommendations

### Data Structure Requirements

- [ ] **AC7**: Returns visibility scores for target brand and all competitors
- [ ] **AC8**: Includes competitive positioning analysis with market share
- [ ] **AC9**: Provides share of voice breakdown by channel/context
- [ ] **AC10**: Generates competitive rankings with confidence scores
- [ ] **AC11**: Includes trend analysis and growth indicators
- [ ] **AC12**: Provides actionable recommendations with priority levels

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
// lib/ai/tools/visibility-scoring-tool.ts
export const visibilityScoringTool = tool({
	description: "Competitive visibility scoring and positioning analysis",
	inputSchema: z.object({
		brandName: z.string().min(1).max(100),
		competitors: z.array(z.string()).min(1).max(20),
		analysisResults: z.array(z.any()),
		brandDetectionResults: z.array(z.any()).optional(),
		historicalData: z.array(z.any()).optional(),
		scoringWeights: z
			.object({
				mentions: z.number().min(0).max(1).default(0.3),
				sentiment: z.number().min(0).max(1).default(0.2),
				context: z.number().min(0).max(1).default(0.2),
				reach: z.number().min(0).max(1).default(0.3),
			})
			.optional(),
		includeTrends: z.boolean().default(true),
	}),
	handler: async (ctx, args) => {
		const {
			brandName,
			competitors,
			analysisResults,
			brandDetectionResults,
			historicalData,
			scoringWeights,
			includeTrends,
		} = args;

		try {
			// Step 1: Calculate individual brand scores
			const brandScores = await calculateBrandScores(
				brandName,
				competitors,
				analysisResults,
				brandDetectionResults,
				scoringWeights
			);

			// Step 2: Calculate competitive positioning
			const competitivePositioning =
				await calculateCompetitivePositioning(brandScores);

			// Step 3: Calculate share of voice metrics
			const shareOfVoice = await calculateShareOfVoice(brandScores);

			// Step 4: Generate competitive rankings
			const competitiveRankings =
				await generateCompetitiveRankings(brandScores);

			// Step 5: Analyze trends (if historical data available)
			const trendAnalysis =
				includeTrends && historicalData
					? await analyzeTrends(brandScores, historicalData)
					: null;

			// Step 6: Generate insights and recommendations
			const insights = await generateInsights(
				brandScores,
				competitivePositioning,
				shareOfVoice
			);

			return {
				brandName,
				competitors,
				brandScores,
				competitivePositioning,
				shareOfVoice,
				competitiveRankings,
				trendAnalysis,
				insights,
				metadata: {
					scoringWeights: scoringWeights || {
						mentions: 0.3,
						sentiment: 0.2,
						context: 0.2,
						reach: 0.3,
					},
					totalBrands: competitors.length + 1,
					analysisTime: Date.now(),
					category: "visibility-scoring",
				},
			};
		} catch (error) {
			throw new Error(`Visibility scoring failed: ${error.message}`);
		}
	},
});
```

### Response Data Structure

```typescript
interface VisibilityScoringResult {
	brandName: string;
	competitors: string[];
	brandScores: Array<{
		brandName: string;
		visibilityScore: number;
		mentionCount: number;
		sentimentScore: number;
		contextRelevance: number;
		reachScore: number;
		confidence: number;
		breakdown: {
			mentions: number;
			sentiment: number;
			context: number;
			reach: number;
		};
	}>;
	competitivePositioning: {
		targetBrandRank: number;
		marketPosition: "leader" | "challenger" | "follower" | "niche";
		competitiveAdvantage: string[];
		competitiveDisadvantage: string[];
		marketShare: number;
		growthPotential: number;
	};
	shareOfVoice: {
		total: number;
		breakdown: Record<string, number>;
		channelDistribution: Record<string, number>;
		trend: "increasing" | "decreasing" | "stable";
	};
	competitiveRankings: Array<{
		rank: number;
		brandName: string;
		visibilityScore: number;
		change: number;
		confidence: number;
	}>;
	trendAnalysis?: {
		period: string;
		trends: Array<{
			brandName: string;
			trend: "up" | "down" | "stable";
			change: number;
			velocity: number;
		}>;
		predictions: Array<{
			brandName: string;
			predictedScore: number;
			confidence: number;
			timeframe: string;
		}>;
	};
	insights: {
		keyFindings: string[];
		opportunities: string[];
		threats: string[];
		recommendations: Array<{
			priority: "high" | "medium" | "low";
			category: string;
			description: string;
			impact: number;
			effort: number;
		}>;
	};
	metadata: {
		scoringWeights: Record<string, number>;
		totalBrands: number;
		analysisTime: number;
		category: "visibility-scoring";
	};
}
```

### Scoring Functions

```typescript
async function calculateBrandScores(
	brandName: string,
	competitors: string[],
	analysisResults: any[],
	brandDetectionResults: any[],
	weights: any
): Promise<BrandScore[]> {
	const allBrands = [brandName, ...competitors];
	const scores: BrandScore[] = [];

	for (const brand of allBrands) {
		// Calculate mention count
		const mentionCount = countBrandMentions(
			analysisResults,
			brandDetectionResults,
			brand
		);

		// Calculate sentiment score
		const sentimentScore = calculateSentimentScore(analysisResults, brand);

		// Calculate context relevance
		const contextRelevance = calculateContextRelevance(analysisResults, brand);

		// Calculate reach score
		const reachScore = calculateReachScore(analysisResults, brand);

		// Calculate weighted visibility score
		const visibilityScore =
			mentionCount * weights.mentions +
			sentimentScore * weights.sentiment +
			contextRelevance * weights.context +
			reachScore * weights.reach;

		scores.push({
			brandName: brand,
			visibilityScore: Math.min(visibilityScore, 100),
			mentionCount,
			sentimentScore,
			contextRelevance,
			reachScore,
			confidence: calculateConfidence(
				mentionCount,
				sentimentScore,
				contextRelevance,
				reachScore
			),
			breakdown: {
				mentions: mentionCount,
				sentiment: sentimentScore,
				context: contextRelevance,
				reach: reachScore,
			},
		});
	}

	return scores;
}

async function calculateCompetitivePositioning(
	brandScores: BrandScore[]
): Promise<CompetitivePositioning> {
	const targetBrand = brandScores[0]; // Assuming first is target brand
	const sortedScores = [...brandScores].sort(
		(a, b) => b.visibilityScore - a.visibilityScore
	);
	const targetRank =
		sortedScores.findIndex(
			(score) => score.brandName === targetBrand.brandName
		) + 1;

	// Determine market position
	let marketPosition: "leader" | "challenger" | "follower" | "niche";
	if (targetRank === 1) marketPosition = "leader";
	else if (targetRank <= 3) marketPosition = "challenger";
	else if (targetRank <= 6) marketPosition = "follower";
	else marketPosition = "niche";

	// Calculate market share
	const totalScore = brandScores.reduce(
		(sum, score) => sum + score.visibilityScore,
		0
	);
	const marketShare = (targetBrand.visibilityScore / totalScore) * 100;

	// Calculate growth potential
	const growthPotential = calculateGrowthPotential(targetBrand, brandScores);

	return {
		targetBrandRank: targetRank,
		marketPosition,
		competitiveAdvantage: identifyCompetitiveAdvantages(
			targetBrand,
			brandScores
		),
		competitiveDisadvantage: identifyCompetitiveDisadvantages(
			targetBrand,
			brandScores
		),
		marketShare,
		growthPotential,
	};
}

async function calculateShareOfVoice(
	brandScores: BrandScore[]
): Promise<ShareOfVoice> {
	const totalMentions = brandScores.reduce(
		(sum, score) => sum + score.mentionCount,
		0
	);
	const targetBrand = brandScores[0];

	const breakdown: Record<string, number> = {};
	brandScores.forEach((score) => {
		breakdown[score.brandName] = (score.mentionCount / totalMentions) * 100;
	});

	return {
		total: breakdown[targetBrand.brandName] || 0,
		breakdown,
		channelDistribution: calculateChannelDistribution(brandScores),
		trend: determineTrend(brandScores),
	};
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("visibilityScoringTool", () => {
	test("should calculate visibility scores for all brands");
	test("should provide accurate competitive positioning");
	test("should calculate share of voice metrics correctly");
	test("should generate competitive rankings");
	test("should analyze trends when historical data available");
	test("should generate actionable insights and recommendations");
	test("should handle custom scoring weights");
	test("should validate input parameters correctly");
	test("should return properly structured response");
	test("should handle edge cases gracefully");
});
```

### Integration Tests

```typescript
describe("Visibility Scoring Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with brand monitoring agent");
	test("should work with brand detection results");
	test("should handle historical data analysis");
});
```

## 🔗 Dependencies

- **Requires**: GEO-204 (Brand Detection Tool)
- **External**: None
- **Internal**: Scoring algorithms, trend analysis functions, insight generation
  utilities

## 📊 Performance Requirements

- **Response Time**: < 20 seconds for visibility scoring
- **Data Size**: Response payload < 250 KB
- **Reliability**: > 90% accuracy in scoring calculations
- **Concurrent Usage**: Support 20+ simultaneous executions

## 🔍 Definition of Ready

- [ ] Brand detection tool is implemented
- [ ] Scoring algorithms are designed
- [ ] Trend analysis functions are available
- [ ] Test scenarios are defined
- [ ] Insight generation logic is planned

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] Scoring accuracy meets requirements (>90%)
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Calculate visibility scores for Tesla and competitors"
// Tool call with parameters:
{
  brandName: "Tesla",
  competitors: ["Ford", "GM", "Volkswagen", "BMW"],
  analysisResults: [...], // From multi-provider analysis
  includeTrends: true
}
```

### Advanced Usage

```typescript
// User query: "Score with custom weights and historical data"
// Tool call with parameters:
{
  brandName: "Tesla",
  competitors: ["Ford", "GM", "Volkswagen"],
  analysisResults: [...],
  brandDetectionResults: [...],
  historicalData: [...],
  scoringWeights: {
    mentions: 0.4,
    sentiment: 0.3,
    context: 0.2,
    reach: 0.1
  },
  includeTrends: true
}
```

## 📝 Notes

- Focus on accurate and meaningful scoring algorithms
- Ensure competitive positioning analysis is insightful
- Consider industry-specific scoring factors
- Design for extensibility (future scoring methods)
- Implement robust trend analysis capabilities

## 🔄 Follow-up Tasks

- Phase 2B: Website Monitoring Agent tickets
