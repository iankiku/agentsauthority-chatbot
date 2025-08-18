# GEO-219: Competitive Dashboard Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P1 (Important) **Story Points**: 8  
**Estimated Time**: 12 hours **Assignee**: [Developer Name] **Sprint**: Sprint
2, Phase 2C  
**Dependencies**: GEO-218 (Trend Analysis Tool)

## 🎯 User Story

As a **GEO analyst**, I want **a comprehensive competitive dashboard** so that I
can **view and analyze all competitive intelligence data in one unified
interface**.

## 📝 Description

Create a comprehensive competitive dashboard tool that aggregates and visualizes
all competitive intelligence data, provides real-time insights, generates
executive summaries, and offers interactive analysis capabilities. This tool
will serve as the central hub for all competitive intelligence activities.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Aggregates data from all competitive intelligence tools
- [ ] **AC2**: Provides real-time competitive insights and updates
- [ ] **AC3**: Generates executive summaries and reports
- [ ] **AC4**: Offers interactive analysis and filtering capabilities
- [ ] **AC5**: Displays competitive positioning and market share data
- [ ] **AC6**: Shows trend analysis and forecasting visualizations

### Data Structure Requirements

- [ ] **AC7**: Returns comprehensive dashboard data with multiple views
- [ ] **AC8**: Includes real-time competitive intelligence metrics
- [ ] **AC9**: Provides executive summary and key insights
- [ ] **AC10**: Includes interactive analysis capabilities
- [ ] **AC11**: Supports different dashboard views and filters
- [ ] **AC12**: Handles different industries and market types

### Integration Requirements

- [ ] **AC13**: Works seamlessly with existing chat interface
- [ ] **AC14**: Tool description is clear and discoverable
- [ ] **AC15**: Parameter validation using Zod schemas
- [ ] **AC16**: Error responses are user-friendly and actionable
- [ ] **AC17**: Response format supports artifact generation
- [ ] **AC18**: Integrates with all competitive intelligence tools

## 🛠️ Technical Implementation

### Tool Implementation

```typescript
// lib/ai/tools/competitive-dashboard-tool.ts
export const competitiveDashboardTool = tool({
	description:
		"Comprehensive competitive intelligence dashboard with real-time insights and analysis",
	inputSchema: z.object({
		targetCompany: z.object({
			name: z.string().min(1).max(100),
			description: z.string().min(10).max(1000),
			website: z.string().url(),
			industry: z.string().optional(),
			marketFocus: z.enum(["b2b", "b2c", "both"]).optional(),
			companySize: z.enum(["startup", "sme", "enterprise"]).optional(),
		}),
		dashboardType: z
			.enum([
				"comprehensive",
				"executive",
				"analytical",
				"trends",
				"competitive",
				"custom",
			])
			.default("comprehensive"),
		includeRealTimeData: z.boolean().default(true),
		includeHistoricalData: z.boolean().default(true),
		includeForecasting: z.boolean().default(true),
		includeExecutiveSummary: z.boolean().default(true),
		includeInteractiveAnalysis: z.boolean().default(true),
		customViews: z.array(z.string()).optional(),
		timeRange: z
			.enum(["day", "week", "month", "quarter", "year", "all"])
			.default("month"),
		refreshInterval: z.number().min(30).max(3600).optional(), // seconds
		dataSources: z
			.array(
				z.enum([
					"brand_monitor",
					"website_monitor",
					"competitive_intelligence",
					"trend_analysis",
					"all",
				])
			)
			.default(["all"]),
	}),
	handler: async (ctx, args) => {
		const {
			targetCompany,
			dashboardType,
			includeRealTimeData,
			includeHistoricalData,
			includeForecasting,
			includeExecutiveSummary,
			includeInteractiveAnalysis,
			customViews,
			timeRange,
			refreshInterval,
			dataSources,
		} = args;

		try {
			// Step 1: Gather competitive intelligence data
			const competitiveData = await gatherCompetitiveData(
				targetCompany,
				dataSources,
				timeRange,
				includeRealTimeData,
				includeHistoricalData
			);

			// Step 2: Generate real-time insights (if enabled)
			let realTimeInsights = null;
			if (includeRealTimeData) {
				realTimeInsights = await generateRealTimeInsights(
					targetCompany,
					competitiveData,
					timeRange
				);
			}

			// Step 3: Generate executive summary (if enabled)
			let executiveSummary = null;
			if (includeExecutiveSummary) {
				executiveSummary = await generateExecutiveSummary(
					targetCompany,
					competitiveData,
					realTimeInsights,
					dashboardType
				);
			}

			// Step 4: Generate forecasting data (if enabled)
			let forecastingData = null;
			if (includeForecasting) {
				forecastingData = await generateForecastingData(
					targetCompany,
					competitiveData,
					timeRange
				);
			}

			// Step 5: Generate interactive analysis (if enabled)
			let interactiveAnalysis = null;
			if (includeInteractiveAnalysis) {
				interactiveAnalysis = await generateInteractiveAnalysis(
					targetCompany,
					competitiveData,
					realTimeInsights,
					forecastingData,
					customViews
				);
			}

			// Step 6: Generate dashboard views
			const dashboardViews = await generateDashboardViews(
				targetCompany,
				competitiveData,
				realTimeInsights,
				executiveSummary,
				forecastingData,
				interactiveAnalysis,
				dashboardType,
				customViews
			);

			// Step 7: Generate key metrics and KPIs
			const keyMetrics = await generateKeyMetrics(
				targetCompany,
				competitiveData,
				realTimeInsights,
				timeRange
			);

			// Step 8: Generate alerts and notifications
			const alerts = await generateAlerts(
				targetCompany,
				competitiveData,
				realTimeInsights,
				keyMetrics
			);

			return {
				targetCompany,
				dashboardType,
				timeRange,
				refreshInterval,
				competitiveData,
				realTimeInsights,
				executiveSummary,
				forecastingData,
				interactiveAnalysis,
				dashboardViews,
				keyMetrics,
				alerts,
				dashboardMetadata: {
					dashboardType,
					includeRealTimeData,
					includeHistoricalData,
					includeForecasting,
					includeExecutiveSummary,
					includeInteractiveAnalysis,
					customViews: customViews || [],
					dataSources,
					lastUpdated: new Date().toISOString(),
					dataFreshness: calculateDataFreshness(competitiveData),
					confidenceScores: calculateConfidenceScores({
						competitiveData,
						realTimeInsights,
						executiveSummary,
						forecastingData,
						interactiveAnalysis,
					}),
				},
				metadata: {
					executionTime: Date.now(),
					category: "competitive-dashboard",
					dashboardType,
					timeRange,
					dataSourcesCount: dataSources.length,
					success: true,
				},
			};
		} catch (error) {
			throw new Error(
				`Competitive dashboard generation failed: ${error.message}`
			);
		}
	},
});
```

### Response Data Structure

```typescript
interface CompetitiveDashboardResult {
	targetCompany: {
		name: string;
		description: string;
		website: string;
		industry?: string;
		marketFocus?: "b2b" | "b2c" | "both";
		companySize?: "startup" | "sme" | "enterprise";
	};
	dashboardType:
		| "comprehensive"
		| "executive"
		| "analytical"
		| "trends"
		| "competitive"
		| "custom";
	timeRange: "day" | "week" | "month" | "quarter" | "year" | "all";
	refreshInterval?: number;
	competitiveData: {
		brandMonitoring: {
			brandMentions: Array<{
				source: string;
				mention: string;
				sentiment: "positive" | "negative" | "neutral";
				date: string;
				reach: number;
				engagement: number;
			}>;
			visibilityScore: number;
			shareOfVoice: number;
			competitivePositioning: Array<{
				competitor: string;
				position: number;
				strength: number;
				weakness: number;
			}>;
		};
		websiteMonitoring: {
			changes: Array<{
				url: string;
				changeType: string;
				severity: "low" | "medium" | "high" | "critical";
				date: string;
				description: string;
				impact: string;
			}>;
			performance: {
				loadTime: number;
				uptime: number;
				seoScore: number;
				accessibilityScore: number;
			};
			contentAnalysis: {
				wordCount: number;
				readabilityScore: number;
				keywordDensity: Record<string, number>;
			};
		};
		competitiveIntelligence: {
			competitors: Array<{
				name: string;
				website: string;
				strength: number;
				weakness: number;
				marketShare: number;
				recentActivity: string[];
			}>;
			marketAnalysis: {
				marketSize: number;
				growthRate: number;
				keyTrends: string[];
				opportunities: string[];
				threats: string[];
			};
			strategicInsights: Array<{
				insight: string;
				category: string;
				impact: "positive" | "negative" | "neutral";
				confidence: number;
			}>;
		};
		trendAnalysis: {
			marketTrends: Array<{
				trend: string;
				strength: number;
				growth: number;
				impact: "positive" | "negative" | "neutral";
			}>;
			emergingTrends: Array<{
				trend: string;
				emergence: number;
				potential: number;
				earlyAdopters: string[];
			}>;
			forecasting: {
				shortTerm: Array<{
					trend: string;
					prediction: string;
					probability: number;
				}>;
				mediumTerm: Array<{
					trend: string;
					prediction: string;
					probability: number;
				}>;
				longTerm: Array<{
					trend: string;
					prediction: string;
					probability: number;
				}>;
			};
		};
	};
	realTimeInsights?: {
		recentActivity: Array<{
			type: string;
			description: string;
			impact: "positive" | "negative" | "neutral";
			timestamp: string;
			urgency: "low" | "medium" | "high";
		}>;
		trendingTopics: Array<{
			topic: string;
			mentions: number;
			sentiment: "positive" | "negative" | "neutral";
			growth: number;
		}>;
		competitiveMoves: Array<{
			competitor: string;
			move: string;
			impact: "positive" | "negative" | "neutral";
			date: string;
			description: string;
		}>;
		marketChanges: Array<{
			change: string;
			impact: "positive" | "negative" | "neutral";
			date: string;
			description: string;
		}>;
	};
	executiveSummary?: {
		overview: string;
		keyHighlights: string[];
		criticalInsights: Array<{
			insight: string;
			category: string;
			impact: "positive" | "negative" | "neutral";
			priority: "low" | "medium" | "high";
		}>;
		recommendations: Array<{
			recommendation: string;
			category: string;
			priority: "low" | "medium" | "high";
			impact: number;
			effort: number;
			timeframe: string;
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
		performanceMetrics: {
			overallScore: number;
			trending: "up" | "down" | "stable";
			keyDrivers: string[];
			keyBarriers: string[];
		};
	};
	forecastingData?: {
		marketForecast: {
			shortTerm: Array<{
				metric: string;
				prediction: number;
				confidence: number;
				factors: string[];
			}>;
			mediumTerm: Array<{
				metric: string;
				prediction: number;
				confidence: number;
				factors: string[];
			}>;
			longTerm: Array<{
				metric: string;
				prediction: number;
				confidence: number;
				factors: string[];
			}>;
		};
		competitiveForecast: {
			competitorPredictions: Array<{
				competitor: string;
				predictedActions: string[];
				probability: number;
				impact: "positive" | "negative" | "neutral";
			}>;
			marketSharePredictions: Array<{
				competitor: string;
				currentShare: number;
				predictedShare: number;
				confidence: number;
			}>;
		};
		trendForecast: {
			trendPredictions: Array<{
				trend: string;
				prediction: string;
				probability: number;
				timeframe: string;
				impact: "positive" | "negative" | "neutral";
			}>;
			scenarioAnalysis: Array<{
				scenario: string;
				probability: number;
				description: string;
				implications: string[];
			}>;
		};
	};
	interactiveAnalysis?: {
		filters: Array<{
			name: string;
			type: "date" | "category" | "competitor" | "trend" | "metric";
			options: string[];
			defaultValue: string;
		}>;
		views: Array<{
			name: string;
			description: string;
			dataType: string;
			visualization: string;
			configurable: boolean;
		}>;
		drillDowns: Array<{
			level: string;
			description: string;
			availableMetrics: string[];
			availableFilters: string[];
		}>;
		comparisons: Array<{
			type: string;
			description: string;
			availableOptions: string[];
			metrics: string[];
		}>;
		customQueries: Array<{
			name: string;
			description: string;
			query: string;
			parameters: string[];
		}>;
	};
	dashboardViews: {
		overview: {
			summary: string;
			keyMetrics: Array<{
				name: string;
				value: number;
				change: number;
				trend: "up" | "down" | "stable";
			}>;
			highlights: string[];
		};
		competitive: {
			positioning: Array<{
				competitor: string;
				position: number;
				strength: number;
				weakness: number;
				recentActivity: string[];
			}>;
			marketShare: Array<{
				company: string;
				share: number;
				trend: "up" | "down" | "stable";
			}>;
			competitiveMoves: Array<{
				competitor: string;
				move: string;
				date: string;
				impact: "positive" | "negative" | "neutral";
			}>;
		};
		trends: {
			marketTrends: Array<{
				trend: string;
				strength: number;
				growth: number;
				impact: "positive" | "negative" | "neutral";
			}>;
			emergingTrends: Array<{
				trend: string;
				emergence: number;
				potential: number;
			}>;
			forecasting: Array<{
				trend: string;
				prediction: string;
				probability: number;
				timeframe: string;
			}>;
		};
		performance: {
			brandPerformance: {
				visibilityScore: number;
				shareOfVoice: number;
				sentimentScore: number;
				engagementRate: number;
			};
			websitePerformance: {
				loadTime: number;
				uptime: number;
				seoScore: number;
				accessibilityScore: number;
			};
			competitivePerformance: {
				marketPosition: number;
				competitiveAdvantage: number;
				threatLevel: number;
				opportunityLevel: number;
			};
		};
		alerts: {
			critical: Array<{
				alert: string;
				severity: "low" | "medium" | "high" | "critical";
				date: string;
				description: string;
				action: string;
			}>;
			warnings: Array<{
				alert: string;
				severity: "low" | "medium" | "high";
				date: string;
				description: string;
				action: string;
			}>;
			opportunities: Array<{
				alert: string;
				potential: number;
				date: string;
				description: string;
				action: string;
			}>;
		};
	};
	keyMetrics: {
		overallScore: number;
		trending: "up" | "down" | "stable";
		keyDrivers: string[];
		keyBarriers: string[];
		performanceIndicators: Array<{
			metric: string;
			value: number;
			target: number;
			status: "on_track" | "behind" | "ahead";
			trend: "up" | "down" | "stable";
		}>;
		competitiveIndicators: Array<{
			metric: string;
			value: number;
			competitorAverage: number;
			position: "leading" | "average" | "lagging";
			trend: "up" | "down" | "stable";
		}>;
		marketIndicators: Array<{
			metric: string;
			value: number;
			marketAverage: number;
			position: "leading" | "average" | "lagging";
			trend: "up" | "down" | "stable";
		}>;
	};
	alerts: {
		critical: Array<{
			alert: string;
			severity: "critical";
			date: string;
			description: string;
			impact: string;
			action: string;
			urgency: "immediate" | "high" | "medium";
		}>;
		high: Array<{
			alert: string;
			severity: "high";
			date: string;
			description: string;
			impact: string;
			action: string;
			urgency: "high" | "medium" | "low";
		}>;
		medium: Array<{
			alert: string;
			severity: "medium";
			date: string;
			description: string;
			impact: string;
			action: string;
			urgency: "medium" | "low";
		}>;
		low: Array<{
			alert: string;
			severity: "low";
			date: string;
			description: string;
			impact: string;
			action: string;
			urgency: "low";
		}>;
		opportunities: Array<{
			alert: string;
			potential: number;
			date: string;
			description: string;
			action: string;
			timeframe: string;
		}>;
	};
	dashboardMetadata: {
		dashboardType: string;
		includeRealTimeData: boolean;
		includeHistoricalData: boolean;
		includeForecasting: boolean;
		includeExecutiveSummary: boolean;
		includeInteractiveAnalysis: boolean;
		customViews: string[];
		dataSources: string[];
		lastUpdated: string;
		dataFreshness: number;
		confidenceScores: Record<string, number>;
	};
	metadata: {
		executionTime: number;
		category: "competitive-dashboard";
		dashboardType: string;
		timeRange: string;
		dataSourcesCount: number;
		success: boolean;
	};
}
```

### Dashboard Functions

```typescript
async function gatherCompetitiveData(
	targetCompany: any,
	dataSources: string[],
	timeRange: string,
	includeRealTimeData: boolean,
	includeHistoricalData: boolean
): Promise<CompetitiveData> {
	const data: CompetitiveData = {
		brandMonitoring: null,
		websiteMonitoring: null,
		competitiveIntelligence: null,
		trendAnalysis: null,
	};

	// Gather brand monitoring data
	if (dataSources.includes("brand_monitor") || dataSources.includes("all")) {
		data.brandMonitoring = await gatherBrandMonitoringData(
			targetCompany,
			timeRange,
			includeRealTimeData,
			includeHistoricalData
		);
	}

	// Gather website monitoring data
	if (dataSources.includes("website_monitor") || dataSources.includes("all")) {
		data.websiteMonitoring = await gatherWebsiteMonitoringData(
			targetCompany,
			timeRange,
			includeRealTimeData,
			includeHistoricalData
		);
	}

	// Gather competitive intelligence data
	if (
		dataSources.includes("competitive_intelligence") ||
		dataSources.includes("all")
	) {
		data.competitiveIntelligence = await gatherCompetitiveIntelligenceData(
			targetCompany,
			timeRange,
			includeRealTimeData,
			includeHistoricalData
		);
	}

	// Gather trend analysis data
	if (dataSources.includes("trend_analysis") || dataSources.includes("all")) {
		data.trendAnalysis = await gatherTrendAnalysisData(
			targetCompany,
			timeRange,
			includeRealTimeData,
			includeHistoricalData
		);
	}

	return data;
}

async function generateRealTimeInsights(
	targetCompany: any,
	competitiveData: any,
	timeRange: string
): Promise<RealTimeInsights> {
	// Generate recent activity insights
	const recentActivity = await generateRecentActivityInsights(
		targetCompany,
		competitiveData,
		timeRange
	);

	// Generate trending topics
	const trendingTopics = await generateTrendingTopicsInsights(
		targetCompany,
		competitiveData,
		timeRange
	);

	// Generate competitive moves
	const competitiveMoves = await generateCompetitiveMovesInsights(
		targetCompany,
		competitiveData,
		timeRange
	);

	// Generate market changes
	const marketChanges = await generateMarketChangesInsights(
		targetCompany,
		competitiveData,
		timeRange
	);

	return {
		recentActivity,
		trendingTopics,
		competitiveMoves,
		marketChanges,
	};
}

async function generateExecutiveSummary(
	targetCompany: any,
	competitiveData: any,
	realTimeInsights: any,
	dashboardType: string
): Promise<ExecutiveSummary> {
	// Generate overview
	const overview = await generateOverview(
		targetCompany,
		competitiveData,
		realTimeInsights,
		dashboardType
	);

	// Generate key highlights
	const keyHighlights = await generateKeyHighlights(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	// Generate critical insights
	const criticalInsights = await generateCriticalInsights(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	// Generate recommendations
	const recommendations = await generateRecommendations(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	// Generate risks
	const risks = await generateRisks(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	// Generate opportunities
	const opportunities = await generateOpportunities(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	// Generate performance metrics
	const performanceMetrics = await generatePerformanceMetrics(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	return {
		overview,
		keyHighlights,
		criticalInsights,
		recommendations,
		risks,
		opportunities,
		performanceMetrics,
	};
}

async function generateForecastingData(
	targetCompany: any,
	competitiveData: any,
	timeRange: string
): Promise<ForecastingData> {
	// Generate market forecast
	const marketForecast = await generateMarketForecast(
		targetCompany,
		competitiveData,
		timeRange
	);

	// Generate competitive forecast
	const competitiveForecast = await generateCompetitiveForecast(
		targetCompany,
		competitiveData,
		timeRange
	);

	// Generate trend forecast
	const trendForecast = await generateTrendForecast(
		targetCompany,
		competitiveData,
		timeRange
	);

	return {
		marketForecast,
		competitiveForecast,
		trendForecast,
	};
}

async function generateInteractiveAnalysis(
	targetCompany: any,
	competitiveData: any,
	realTimeInsights: any,
	forecastingData: any,
	customViews: string[]
): Promise<InteractiveAnalysis> {
	// Generate filters
	const filters = await generateFilters(
		targetCompany,
		competitiveData,
		realTimeInsights,
		forecastingData
	);

	// Generate views
	const views = await generateViews(
		targetCompany,
		competitiveData,
		realTimeInsights,
		forecastingData,
		customViews
	);

	// Generate drill-downs
	const drillDowns = await generateDrillDowns(
		targetCompany,
		competitiveData,
		realTimeInsights,
		forecastingData
	);

	// Generate comparisons
	const comparisons = await generateComparisons(
		targetCompany,
		competitiveData,
		realTimeInsights,
		forecastingData
	);

	// Generate custom queries
	const customQueries = await generateCustomQueries(
		targetCompany,
		competitiveData,
		realTimeInsights,
		forecastingData,
		customViews
	);

	return {
		filters,
		views,
		drillDowns,
		comparisons,
		customQueries,
	};
}

async function generateDashboardViews(
	targetCompany: any,
	competitiveData: any,
	realTimeInsights: any,
	executiveSummary: any,
	forecastingData: any,
	interactiveAnalysis: any,
	dashboardType: string,
	customViews: string[]
): Promise<DashboardViews> {
	// Generate overview view
	const overview = await generateOverviewView(
		targetCompany,
		competitiveData,
		realTimeInsights,
		executiveSummary
	);

	// Generate competitive view
	const competitive = await generateCompetitiveView(
		targetCompany,
		competitiveData,
		realTimeInsights,
		forecastingData
	);

	// Generate trends view
	const trends = await generateTrendsView(
		targetCompany,
		competitiveData,
		forecastingData
	);

	// Generate performance view
	const performance = await generatePerformanceView(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	// Generate alerts view
	const alerts = await generateAlertsView(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	return {
		overview,
		competitive,
		trends,
		performance,
		alerts,
	};
}

async function generateKeyMetrics(
	targetCompany: any,
	competitiveData: any,
	realTimeInsights: any,
	timeRange: string
): Promise<KeyMetrics> {
	// Calculate overall score
	const overallScore = await calculateOverallScore(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	// Determine trending
	const trending = await determineTrending(
		targetCompany,
		competitiveData,
		realTimeInsights,
		timeRange
	);

	// Identify key drivers
	const keyDrivers = await identifyKeyDrivers(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	// Identify key barriers
	const keyBarriers = await identifyKeyBarriers(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	// Generate performance indicators
	const performanceIndicators = await generatePerformanceIndicators(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	// Generate competitive indicators
	const competitiveIndicators = await generateCompetitiveIndicators(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	// Generate market indicators
	const marketIndicators = await generateMarketIndicators(
		targetCompany,
		competitiveData,
		realTimeInsights
	);

	return {
		overallScore,
		trending,
		keyDrivers,
		keyBarriers,
		performanceIndicators,
		competitiveIndicators,
		marketIndicators,
	};
}

async function generateAlerts(
	targetCompany: any,
	competitiveData: any,
	realTimeInsights: any,
	keyMetrics: any
): Promise<Alerts> {
	// Generate critical alerts
	const critical = await generateCriticalAlerts(
		targetCompany,
		competitiveData,
		realTimeInsights,
		keyMetrics
	);

	// Generate high priority alerts
	const high = await generateHighAlerts(
		targetCompany,
		competitiveData,
		realTimeInsights,
		keyMetrics
	);

	// Generate medium priority alerts
	const medium = await generateMediumAlerts(
		targetCompany,
		competitiveData,
		realTimeInsights,
		keyMetrics
	);

	// Generate low priority alerts
	const low = await generateLowAlerts(
		targetCompany,
		competitiveData,
		realTimeInsights,
		keyMetrics
	);

	// Generate opportunity alerts
	const opportunities = await generateOpportunityAlerts(
		targetCompany,
		competitiveData,
		realTimeInsights,
		keyMetrics
	);

	return {
		critical,
		high,
		medium,
		low,
		opportunities,
	};
}

function calculateDataFreshness(competitiveData: any): number {
	const timestamps = [];

	// Extract timestamps from all data sources
	if (competitiveData.brandMonitoring) {
		timestamps.push(...extractTimestamps(competitiveData.brandMonitoring));
	}
	if (competitiveData.websiteMonitoring) {
		timestamps.push(...extractTimestamps(competitiveData.websiteMonitoring));
	}
	if (competitiveData.competitiveIntelligence) {
		timestamps.push(
			...extractTimestamps(competitiveData.competitiveIntelligence)
		);
	}
	if (competitiveData.trendAnalysis) {
		timestamps.push(...extractTimestamps(competitiveData.trendAnalysis));
	}

	// Calculate average freshness
	if (timestamps.length === 0) return 0;

	const now = Date.now();
	const averageAge =
		timestamps.reduce((sum, timestamp) => {
			return sum + (now - new Date(timestamp).getTime());
		}, 0) / timestamps.length;

	// Convert to freshness score (0-100, higher is fresher)
	const maxAge = 24 * 60 * 60 * 1000; // 24 hours
	return Math.max(0, 100 - (averageAge / maxAge) * 100);
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
describe("competitiveDashboardTool", () => {
	test("should gather competitive data from all sources");
	test("should generate real-time insights");
	test("should create executive summary");
	test("should generate forecasting data");
	test("should provide interactive analysis capabilities");
	test("should create comprehensive dashboard views");
	test("should calculate key metrics accurately");
	test("should generate appropriate alerts");
	test("should validate input parameters correctly");
	test("should return properly structured response");
	test("should handle different dashboard types");
	test("should support custom views and filters");
	test("should provide data freshness scoring");
	test("should calculate confidence scores");
});
```

### Integration Tests

```typescript
describe("Competitive Dashboard Tool Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with all competitive intelligence tools");
	test("should handle external data source failures");
	test("should provide comprehensive dashboard insights");
	test("should support real-time data updates");
	test("should generate actionable executive summaries");
});
```

## 🔗 Dependencies

- **Requires**: GEO-218 (Trend Analysis Tool)
- **External**: All competitive intelligence data sources, real-time APIs,
  analytics services
- **Internal**: All competitive intelligence tools, dashboard generation
  functions

## 📊 Performance Requirements

- **Response Time**: < 60 seconds for basic dashboard, < 3 minutes for
  comprehensive dashboard
- **Data Size**: Response payload < 1 MB
- **Reliability**: > 95% dashboard generation success rate
- **Concurrent Usage**: Support 3+ simultaneous dashboard generations
- **Real-time Updates**: Support refresh intervals as low as 30 seconds

## 🔍 Definition of Ready

- [ ] Trend analysis tool is implemented
- [ ] All competitive intelligence tools are functional
- [ ] Dashboard generation functions are defined
- [ ] Real-time data sources are configured
- [ ] Test scenarios are defined
- [ ] Error handling strategies are planned

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] Real-time insights generation works accurately
- [ ] Executive summary generation is comprehensive
- [ ] Interactive analysis capabilities are functional
- [ ] Dashboard views are properly structured
- [ ] Key metrics calculation is accurate
- [ ] Alert generation works correctly
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Show me my competitive dashboard"
// Tool call with parameters:
{
	targetCompany: {
		name: "MyCompany",
		description: "Cloud-based project management software",
		website: "https://mycompany.com",
		industry: "SaaS",
		marketFocus: "b2b"
	},
	dashboardType: "comprehensive",
	includeRealTimeData: true,
	includeHistoricalData: true,
	includeForecasting: true,
	includeExecutiveSummary: true,
	includeInteractiveAnalysis: true,
	timeRange: "month"
}
```

### Advanced Usage

```typescript
// User query: "Create an executive dashboard with custom views"
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
	dashboardType: "executive",
	includeRealTimeData: true,
	includeHistoricalData: true,
	includeForecasting: true,
	includeExecutiveSummary: true,
	includeInteractiveAnalysis: true,
	customViews: ["market_share", "competitive_moves", "trend_analysis"],
	timeRange: "quarter",
	refreshInterval: 300, // 5 minutes
	dataSources: ["brand_monitor", "website_monitor", "competitive_intelligence", "trend_analysis"]
}
```

## 📝 Notes

- Focus on comprehensive data aggregation and visualization
- Implement robust real-time data handling
- Consider dashboard performance and scalability
- Design for extensibility (future dashboard types and views)
- Ensure high-quality insights and actionable recommendations
- Support both basic and advanced user needs

## 🔄 Follow-up Tasks

- Integration testing with all competitive intelligence tools
- Performance optimization for large datasets
- Additional dashboard customization options
