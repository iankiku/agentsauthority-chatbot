# GEO-202: Competitor Identification Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Critical) **Story Points**: 8  
**Estimated Time**: 12 hours **Assignee**: [Developer Name] **Sprint**: Sprint
2, Phase 2A  
**Dependencies**: None

## 🎯 User Story

As a **GEO analyst**, I want **automatic competitor identification** so that I
can **analyze brand visibility against relevant competitors**.

## 📝 Description

Create an AI-powered competitor identification tool that analyzes company
descriptions and industry context to identify 6-9 relevant competitors for any
brand. This tool will filter out irrelevant competitors (retailers, platforms)
and provide structured competitor data with confidence scores and business model
information.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Tool can identify 6-9 relevant competitors for any brand
- [ ] **AC2**: Uses AI to analyze company description and industry context
- [ ] **AC3**: Filters out irrelevant competitors (retailers, platforms,
      aggregators)
- [ ] **AC4**: Provides competitor metadata (description, business model,
      industry)
- [ ] **AC5**: Handles edge cases (new companies, niche markets, startups)
- [ ] **AC6**: Returns structured competitor data with confidence scores

### Data Structure Requirements

- [ ] **AC7**: Returns array of competitor objects with name, description,
      confidence
- [ ] **AC8**: Includes business model classification for each competitor
- [ ] **AC9**: Tags competitors for industry categorization
- [ ] **AC10**: Provides relevance score (0-100) for each competitor
- [ ] **AC11**: Includes competitor website URLs when available
- [ ] **AC12**: Categorizes competitors by direct vs indirect competition

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
// lib/ai/tools/competitor-identification-tool.ts
export const competitorIdentificationTool = tool({
	description: "AI-powered competitor identification and analysis",
	inputSchema: z.object({
		companyName: z.string().min(1).max(100),
		companyDescription: z.string().min(10).max(1000),
		industry: z.string().optional(),
		keywords: z.array(z.string()).optional(),
		marketFocus: z.enum(["b2b", "b2c", "both"]).optional(),
		companySize: z.enum(["startup", "sme", "enterprise"]).optional(),
	}),
	handler: async (ctx, args) => {
		const {
			companyName,
			companyDescription,
			industry,
			keywords,
			marketFocus,
			companySize,
		} = args;

		try {
			// Step 1: Analyze company context
			const companyContext = await analyzeCompanyContext({
				name: companyName,
				description: companyDescription,
				industry,
				keywords,
				marketFocus,
				companySize,
			});

			// Step 2: Generate competitor search queries
			const searchQueries = await generateCompetitorQueries(companyContext);

			// Step 3: Search for potential competitors
			const potentialCompetitors =
				await searchPotentialCompetitors(searchQueries);

			// Step 4: AI-powered competitor analysis
			const analyzedCompetitors = await analyzeCompetitors(
				potentialCompetitors,
				companyContext
			);

			// Step 5: Filter and rank competitors
			const rankedCompetitors = await filterAndRankCompetitors(
				analyzedCompetitors,
				companyContext
			);

			// Step 6: Enrich competitor data
			const enrichedCompetitors = await enrichCompetitorData(rankedCompetitors);

			return {
				targetCompany: {
					name: companyName,
					description: companyDescription,
					industry: companyContext.industry,
					marketFocus: companyContext.marketFocus,
					companySize: companyContext.companySize,
				},
				competitors: enrichedCompetitors,
				analysisMetadata: {
					totalCandidates: potentialCompetitors.length,
					filteredCount: enrichedCompetitors.length,
					confidenceThreshold: 0.7,
					analysisTime: Date.now(),
					category: "competitor-identification",
				},
			};
		} catch (error) {
			throw new Error(`Competitor identification failed: ${error.message}`);
		}
	},
});
```

### Response Data Structure

```typescript
interface CompetitorIdentificationResult {
	targetCompany: {
		name: string;
		description: string;
		industry: string;
		marketFocus: "b2b" | "b2c" | "both";
		companySize: "startup" | "sme" | "enterprise";
	};
	competitors: Array<{
		name: string;
		description: string;
		confidence: number;
		businessModel: string;
		industry: string;
		marketFocus: "b2b" | "b2c" | "both";
		companySize: "startup" | "sme" | "enterprise";
		websiteUrl?: string;
		relevanceScore: number;
		competitionType: "direct" | "indirect" | "potential";
		strengths: string[];
		weaknesses: string[];
		marketPosition: string;
	}>;
	analysisMetadata: {
		totalCandidates: number;
		filteredCount: number;
		confidenceThreshold: number;
		analysisTime: number;
		category: "competitor-identification";
	};
}
```

### AI Analysis Functions

```typescript
async function analyzeCompanyContext(
	companyData: CompanyData
): Promise<CompanyContext> {
	// Use AI to analyze company context and extract key information
	const prompt = `Analyze this company and extract key information:
    Company: ${companyData.name}
    Description: ${companyData.description}
    Industry: ${companyData.industry || "Unknown"}
    
    Extract: industry, market focus, target audience, business model, key differentiators`;

	const analysis = await queryAI(prompt);
	return parseCompanyContext(analysis);
}

async function generateCompetitorQueries(
	context: CompanyContext
): Promise<string[]> {
	// Generate search queries to find potential competitors
	const prompt = `Generate search queries to find competitors for:
    Industry: ${context.industry}
    Market Focus: ${context.marketFocus}
    Business Model: ${context.businessModel}
    
    Generate 5-8 specific search queries to find relevant competitors.`;

	const queries = await queryAI(prompt);
	return parseSearchQueries(queries);
}

async function analyzeCompetitors(
	competitors: CompetitorData[],
	context: CompanyContext
): Promise<AnalyzedCompetitor[]> {
	// Use AI to analyze each potential competitor
	const analyzedCompetitors = await Promise.all(
		competitors.map(async (competitor) => {
			const prompt = `Analyze this potential competitor:
        Name: ${competitor.name}
        Description: ${competitor.description}
        
        Target Company Context:
        Industry: ${context.industry}
        Market Focus: ${context.marketFocus}
        
        Determine: relevance score (0-100), competition type, business model, strengths, weaknesses`;

			const analysis = await queryAI(prompt);
			return parseCompetitorAnalysis(analysis, competitor);
		})
	);

	return analyzedCompetitors;
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("competitorIdentificationTool", () => {
	test("should identify relevant competitors for established companies");
	test("should handle new companies and startups");
	test("should filter out irrelevant competitors (retailers, platforms)");
	test("should provide accurate confidence scores");
	test("should handle missing industry information");
	test("should work with custom keywords");
	test("should categorize competitors correctly");
	test("should return properly structured response");
	test("should handle edge cases gracefully");
	test("should validate input parameters correctly");
});
```

### Integration Tests

```typescript
describe("Competitor Identification Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with brand monitoring agent");
	test("should handle AI provider failures gracefully");
});
```

## 🔗 Dependencies

- **Requires**: None
- **External**: OpenAI API, Claude API, Gemini API, Perplexity API
- **Internal**: AI query functions, company data parsing utilities

## 📊 Performance Requirements

- **Response Time**: < 30 seconds for competitor identification
- **Data Size**: Response payload < 200 KB
- **Reliability**: > 90% success rate
- **Concurrent Usage**: Support 20+ simultaneous executions

## 🔍 Definition of Ready

- [ ] AI provider APIs are configured and accessible
- [ ] Company data parsing utilities are available
- [ ] Test scenarios are defined
- [ ] Competitor analysis prompts are optimized

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] AI analysis provides accurate competitor identification
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Identify competitors for Tesla"
// Tool call with parameters:
{
  companyName: "Tesla",
  companyDescription: "Tesla designs, develops, manufactures, leases, and sells electric vehicles, energy generation and storage systems, and offers services related to its products.",
  industry: "Automotive"
}
```

### Advanced Usage

```typescript
// User query: "Find competitors for a B2B SaaS startup"
// Tool call with parameters:
{
  companyName: "DataFlow Analytics",
  companyDescription: "Enterprise data analytics platform for manufacturing companies",
  industry: "Software",
  keywords: ["analytics", "manufacturing", "enterprise"],
  marketFocus: "b2b",
  companySize: "startup"
}
```

## 📝 Notes

- Focus on AI-powered analysis for accurate competitor identification
- Ensure filtering logic removes irrelevant competitors effectively
- Consider industry-specific competitor identification patterns
- Design for extensibility (future competitor analysis features)
- Implement proper error handling for AI provider failures

## 🔄 Follow-up Tasks

- **GEO-203**: Multi-Provider Analysis Tool
- **GEO-204**: Brand Detection Tool
- **GEO-206**: Visibility Scoring Tool
