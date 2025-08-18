# Mastra Agents Migration to Vercel AI SDK Tools

## Executive Summary

This document outlines the strategy for migrating the sophisticated Mastra
agents from the `version-001/agents/mastra/` directory into Vercel AI SDK tools
that can be integrated into the current chat application. The focus is on
preserving functionality while adapting to the Vercel AI SDK architecture.

## Current Mastra Agents Analysis
comments: We need to add a ADS analysis agent that tracks ads for thier brand and brand of competitors ad 
### Core GEO Suite Agents

#### 1. Brand Monitor Agent

**Current Implementation**: `version-001/agents/mastra/agents/geoSuiteAgents.ts`

- **Purpose**: Track brand mentions across all channels
- **Tools**: `brandMentionTool`
- **Key Features**: Sentiment analysis, AI-generated content detection

#### 2. Keyword Cluster Agent

**Current Implementation**: `version-001/agents/mastra/agents/geoSuiteAgents.ts`

- **Purpose**: Semantic clustering of keywords for content mapping
- **Tools**: `keywordClusterTool`
- **Key Features**: SEO/geo topic identification, content hub planning

#### 3. Prompt Simulator Agent

**Current Implementation**: `version-001/agents/mastra/agents/geoSuiteAgents.ts`

- **Purpose**: Simulate user queries as prompts for content generation
- **Tools**: `promptSimTool`
- **Key Features**: Query optimization, content strategy insights

#### 4. AI Copywriter Agent

**Current Implementation**: `version-001/agents/mastra/agents/geoSuiteAgents.ts`

- **Purpose**: Transform content into different formats (Twitter, LinkedIn,
  blog)
- **Tools**: `aiCopywritingTool`
- **Key Features**: Content reformatting, voice preservation

### Advanced Analysis Agents

#### 5. Brand Analysis Agent

**Current Implementation**:
`version-001/agents/mastra/agents/brandAnalysisAgent.ts`

- **Purpose**: Comprehensive brand analysis with historical data processing
- **Tools**: `brandMentionTool`, `keywordClusterTool`
- **Key Features**: Enhanced scoring algorithms, provider performance tracking

#### 6. Visibility Analysis Agent

**Current Implementation**:
`version-001/agents/mastra/agents/visibilityAnalysisAgent.ts`

- **Purpose**: Analyze brand visibility and competitive position
- **Tools**: `brandMentionTool`
- **Key Features**: Share of voice calculation, competitor rankings

#### 7. Analysis Expert Agent

**Current Implementation**: `version-001/agents/mastra/agents/analysisAgent.ts`

- **Purpose**: Orchestrate multiple agents for comprehensive analysis
- **Tools**: All GEO suite tools
- **Key Features**: Multi-agent coordination, comprehensive reporting

### Assistant Agents

#### 8. Chat Agent

**Current Implementation**: `version-001/agents/mastra/agents/assistants.ts`

- **Purpose**: Front-line assistant for user interaction
- **Tools**: None (delegation only)
- **Key Features**: Request clarification, delegation to Master Planner

#### 9. Planner Agent

**Current Implementation**: `version-001/agents/mastra/agents/assistants.ts`

- **Purpose**: Break down user goals into actionable steps
- **Tools**: None (planning only)
- **Key Features**: Task decomposition, conditional logic

## Migration Strategy

### Phase 1: Core GEO Tools Migration (Week 1)

#### Priority 1: Brand Monitor Tool

**Migration Approach**: Convert to Vercel AI SDK tool with enhanced
functionality

```typescript
// lib/ai/tools/enhanced-brand-monitor.ts
export const enhancedBrandMonitorTool = tool({
	description:
		"Comprehensive brand monitoring with sentiment analysis and AI detection",
	inputSchema: z.object({
		brandName: z.string().describe("Name of the brand to monitor"),
		platforms: z
			.array(z.enum(["chatgpt", "claude", "gemini", "perplexity"]))
			.default(["chatgpt", "claude", "gemini", "perplexity"])
			.describe("AI platforms to check"),
		timeframe: z
			.object({
				start: z.string().describe("Start date (ISO format)"),
				end: z.string().describe("End date (ISO format)"),
			})
			.optional()
			.describe("Time range for analysis"),
		includeSentiment: z
			.boolean()
			.default(true)
			.describe("Include sentiment analysis"),
		includeAIDetection: z
			.boolean()
			.default(true)
			.describe("Detect AI-generated content"),
	}),
	execute: async ({
		brandName,
		platforms,
		timeframe,
		includeSentiment,
		includeAIDetection,
	}) => {
		// Enhanced implementation combining Mastra logic with real data sources
		const results = await Promise.all(
			platforms.map(async (platform) => {
				// Implement actual brand monitoring logic here
				// This would replace the mock data in current implementation

				const platformData = await fetchBrandMentions(
					brandName,
					platform,
					timeframe
				);

				return {
					platform,
					visibility: calculateVisibilityScore(platformData),
					score: calculateOverallScore(platformData),
					mentions: platformData.mentions.length,
					sentiment: includeSentiment
						? analyzeSentiment(platformData.mentions)
						: "neutral",
					aiGenerated: includeAIDetection
						? detectAIGeneratedContent(platformData.mentions)
						: false,
					topMentions: platformData.mentions.slice(0, 5),
					trends: analyzeTrends(platformData, timeframe),
				};
			})
		);

		const averageScore = Math.floor(
			results.reduce((sum, r) => sum + r.score, 0) / results.length
		);

		return {
			brandName,
			overallScore: averageScore,
			platformResults: results,
			recommendations: generateRecommendations(results),
			nextSteps: generateNextSteps(results),
			metadata: {
				analysisDate: new Date().toISOString(),
				platformsAnalyzed: platforms,
				timeframe: timeframe,
				sentimentAnalysis: includeSentiment,
				aiDetection: includeAIDetection,
			},
		};
	},
});
```

#### Priority 2: Keyword Cluster Tool

**Migration Approach**: Enhanced semantic clustering with AI relevance scoring

```typescript
// lib/ai/tools/enhanced-keyword-cluster.ts
export const enhancedKeywordClusterTool = tool({
	description:
		"Advanced keyword clustering with AI relevance and content strategy insights",
	inputSchema: z.object({
		keywords: z
			.array(
				z.object({
					term: z.string().describe("Keyword term"),
					volume: z.number().describe("Search volume"),
					difficulty: z
						.number()
						.optional()
						.describe("Keyword difficulty score"),
					cpc: z.number().optional().describe("Cost per click"),
					competition: z.number().optional().describe("Competition level"),
				})
			)
			.describe("List of keywords to cluster"),
		maxClusters: z.number().default(10).describe("Maximum number of clusters"),
		industry: z
			.string()
			.optional()
			.describe("Industry context for better clustering"),
		targetAudience: z
			.string()
			.optional()
			.describe("Target audience for content strategy"),
		includeContentStrategy: z
			.boolean()
			.default(true)
			.describe("Include content strategy recommendations"),
	}),
	execute: async ({
		keywords,
		maxClusters,
		industry,
		targetAudience,
		includeContentStrategy,
	}) => {
		// Enhanced clustering logic with industry context
		const clusters = await performSemanticClustering(
			keywords,
			maxClusters,
			industry
		);

		const enhancedClusters = clusters.map((cluster) => ({
			name: cluster.name,
			keywords: cluster.keywords,
			totalVolume: cluster.totalVolume,
			avgDifficulty: cluster.avgDifficulty,
			aiRelevance: calculateAIRelevance(cluster.keywords, targetAudience),
			contentOpportunities: includeContentStrategy
				? generateContentOpportunities(cluster, targetAudience)
				: [],
			competitiveAnalysis: analyzeClusterCompetition(cluster),
			priorityScore: calculatePriorityScore(cluster),
		}));

		return {
			clusters: enhancedClusters,
			summary: {
				totalKeywords: keywords.length,
				totalVolume: keywords.reduce((sum, k) => sum + k.volume, 0),
				averageDifficulty:
					keywords.reduce((sum, k) => sum + (k.difficulty || 0), 0) /
					keywords.length,
				highValueClusters: enhancedClusters.filter((c) => c.priorityScore > 0.7)
					.length,
			},
			contentStrategy: includeContentStrategy
				? {
						recommendedTopics: generateRecommendedTopics(enhancedClusters),
						contentCalendar: generateContentCalendar(enhancedClusters),
						seoOpportunities: identifySEOOpportunities(enhancedClusters),
					}
				: null,
		};
	},
});
```

### Phase 2: Advanced Analysis Tools (Week 2)

#### Priority 3: Visibility Analysis Tool

**Migration Approach**: Comprehensive visibility analysis with competitive
intelligence

```typescript
// lib/ai/tools/visibility-analysis.ts
export const visibilityAnalysisTool = tool({
	description:
		"Comprehensive brand visibility analysis with competitive intelligence",
	inputSchema: z.object({
		brandName: z.string().describe("Brand name to analyze"),
		competitors: z
			.array(z.string())
			.optional()
			.describe("Competitor brands to compare"),
		platforms: z
			.array(z.enum(["chatgpt", "claude", "gemini", "perplexity"]))
			.default(["chatgpt", "claude", "gemini", "perplexity"]),
		timeframe: z
			.object({
				start: z.string().describe("Start date (ISO format)"),
				end: z.string().describe("End date (ISO format)"),
			})
			.optional(),
		includeHistorical: z
			.boolean()
			.default(true)
			.describe("Include historical trend analysis"),
		includePredictions: z
			.boolean()
			.default(false)
			.describe("Include predictive insights"),
	}),
	execute: async ({
		brandName,
		competitors,
		platforms,
		timeframe,
		includeHistorical,
		includePredictions,
	}) => {
		// Comprehensive visibility analysis
		const brandData = await analyzeBrandVisibility(
			brandName,
			platforms,
			timeframe
		);
		const competitorData = competitors
			? await Promise.all(
					competitors.map((c) =>
						analyzeBrandVisibility(c, platforms, timeframe)
					)
				)
			: [];

		const analysis = {
			brandVisibility: {
				overallScore: calculateOverallVisibility(brandData),
				platformBreakdown: brandData.platforms,
				shareOfVoice: calculateShareOfVoice(brandData, competitorData),
				trendAnalysis: includeHistorical
					? analyzeTrends(brandData, timeframe)
					: null,
				predictions: includePredictions ? generatePredictions(brandData) : null,
			},
			competitiveAnalysis:
				competitorData.length > 0
					? {
							competitorRankings: rankCompetitors([
								brandData,
								...competitorData,
							]),
							competitiveGaps: identifyCompetitiveGaps(
								brandData,
								competitorData
							),
							opportunities: identifyOpportunities(brandData, competitorData),
						}
					: null,
			recommendations: generateVisibilityRecommendations(
				brandData,
				competitorData
			),
			nextSteps: generateActionableNextSteps(brandData, competitorData),
		};

		return analysis;
	},
});
```

#### Priority 4: Content Strategy Tool

**Migration Approach**: AI-powered content strategy and optimization

```typescript
// lib/ai/tools/content-strategy.ts
export const contentStrategyTool = tool({
	description: "AI-powered content strategy and optimization for GEO/SEO",
	inputSchema: z.object({
		brandName: z.string().describe("Brand name"),
		industry: z.string().describe("Industry or niche"),
		targetKeywords: z.array(z.string()).describe("Target keywords"),
		currentContent: z
			.array(
				z.object({
					title: z.string(),
					url: z.string(),
					type: z.enum(["blog", "page", "social", "other"]),
					performance: z
						.object({
							traffic: z.number().optional(),
							conversions: z.number().optional(),
							engagement: z.number().optional(),
						})
						.optional(),
				})
			)
			.optional()
			.describe("Current content inventory"),
		goals: z
			.array(
				z.enum(["traffic", "conversions", "brand_awareness", "lead_generation"])
			)
			.describe("Content goals"),
		budget: z
			.enum(["low", "medium", "high"])
			.optional()
			.describe("Content creation budget"),
	}),
	execute: async ({
		brandName,
		industry,
		targetKeywords,
		currentContent,
		goals,
		budget,
	}) => {
		// AI-powered content strategy generation
		const keywordAnalysis = await analyzeKeywords(targetKeywords, industry);
		const contentGaps = await identifyContentGaps(
			keywordAnalysis,
			currentContent
		);
		const contentStrategy = await generateContentStrategy({
			brandName,
			industry,
			keywordAnalysis,
			contentGaps,
			goals,
			budget,
		});

		return {
			keywordAnalysis,
			contentGaps,
			contentStrategy: {
				recommendedTopics: contentStrategy.topics,
				contentCalendar: contentStrategy.calendar,
				contentTypes: contentStrategy.types,
				optimizationRecommendations: contentStrategy.optimizations,
			},
			performanceProjections: contentStrategy.projections,
			implementationPlan: contentStrategy.implementation,
		};
	},
});
```

### Phase 3: Integration and Enhancement (Week 3)

#### Priority 5: Dashboard Integration

**Migration Approach**: Integrate tools with dashboard persistence

```typescript
// lib/ai/tools/dashboard-integrated-tools.ts
export const dashboardBrandMonitorTool = tool({
	description: "Brand monitoring with automatic dashboard persistence",
	inputSchema: z.object({
		brandName: z.string(),
		platforms: z.array(z.enum(["chatgpt", "claude", "gemini", "perplexity"])),
		saveToDashboard: z
			.boolean()
			.default(true)
			.describe("Save results to dashboard"),
		dashboardPage: z
			.enum(["overview", "competitors", "platforms"])
			.default("overview")
			.describe("Dashboard page to save to"),
	}),
	execute: async ({ brandName, platforms, saveToDashboard, dashboardPage }) => {
		// Use enhanced brand monitor logic
		const result = await enhancedBrandMonitorTool.execute({
			brandName,
			platforms,
			includeSentiment: true,
			includeAIDetection: true,
		});

		// Save to dashboard if requested
		if (saveToDashboard) {
			const artifact = {
				type: "brand-monitor-report",
				title: `Brand Monitor: ${brandName}`,
				content: result,
				metadata: {
					brandName,
					platforms,
					dashboardPage,
					timestamp: new Date().toISOString(),
					tool: "dashboardBrandMonitorTool",
				},
			};

			await saveArtifactToDashboard(artifact);
		}

		return result;
	},
});
```

## Implementation Priority

### Week 1: Core Tools

1. **Enhanced Brand Monitor Tool** - Replace current mock implementation
2. **Enhanced Keyword Cluster Tool** - Add AI relevance scoring
3. **Basic Dashboard Integration** - Save results to database

### Week 2: Advanced Tools

1. **Visibility Analysis Tool** - Competitive intelligence
2. **Content Strategy Tool** - AI-powered content planning
3. **Enhanced Dashboard Integration** - Full persistence system

### Week 3: Integration & Polish

1. **Tool Orchestration** - Combine tools for comprehensive analysis
2. **Performance Optimization** - Caching and efficiency improvements
3. **User Experience** - Seamless tool integration with chat interface

## Key Benefits of Migration

### 1. Enhanced Functionality

- **Real Data Sources**: Replace mock data with actual brand monitoring
- **Advanced Analytics**: Add sentiment analysis, AI detection, trend analysis
- **Competitive Intelligence**: Comprehensive competitor analysis
- **Content Strategy**: AI-powered content planning and optimization

### 2. Better Integration

- **Dashboard Persistence**: All results automatically saved to dashboard
- **Conversational Interface**: Natural language interaction with tools
- **Context Awareness**: Tools understand user's current dashboard context
- **Cross-Tool Coordination**: Tools can work together for comprehensive
  analysis

### 3. Improved User Experience

- **Streaming Responses**: Real-time tool execution feedback
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Progress Indicators**: Show tool execution progress
- **Result Visualization**: Rich artifact generation for all tool outputs

## Technical Considerations

### 1. Data Sources

- **Brand Monitoring**: Integrate with real brand monitoring APIs
- **Keyword Research**: Connect to keyword research tools
- **Competitive Analysis**: Access competitive intelligence data
- **Content Performance**: Track content performance metrics

### 2. Performance Optimization

- **Caching**: Cache frequently requested data
- **Parallel Execution**: Run multiple tool operations in parallel
- **Progressive Loading**: Load results incrementally
- **Background Processing**: Handle long-running operations

### 3. Error Handling

- **Graceful Degradation**: Provide fallback data when APIs fail
- **User Feedback**: Clear error messages and recovery options
- **Retry Logic**: Automatic retry for transient failures
- **Monitoring**: Track tool performance and error rates

## Success Metrics

### Week 1 Success

- [ ] Enhanced brand monitor tool working with real data
- [ ] Keyword cluster tool with AI relevance scoring
- [ ] Basic dashboard persistence implemented
- [ ] 50% improvement in tool response quality

### Week 2 Success

- [ ] Visibility analysis tool with competitive intelligence
- [ ] Content strategy tool with AI-powered recommendations
- [ ] Full dashboard integration working
- [ ] 80% user satisfaction with tool outputs

### Week 3 Success

- [ ] All tools working together seamlessly
- [ ] Performance optimized for production use
- [ ] Comprehensive error handling implemented
- [ ] 90% user satisfaction with overall experience

## Conclusion

This migration strategy transforms the sophisticated Mastra agents into powerful
Vercel AI SDK tools that provide immediate value while building toward a
comprehensive GEO/SEO analytics platform. The focus on real data sources,
enhanced functionality, and seamless dashboard integration positions the product
for rapid user adoption and market success.

The key to success is maintaining the sophisticated analysis capabilities of the
Mastra agents while adapting them to the conversational, persistent dashboard
experience that users expect.
