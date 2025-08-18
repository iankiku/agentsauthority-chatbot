# FRAG-003 – Real GEO Data Integration (UNBLOCKED) 🚧

_Created: 2025-01-19_ _Status: **✅ COMPLETED**_

---

### 🚨 **PREREQUISITE COMPLETE** 🚨

**Blocker:** The application's chat interface did not support client-side tool
calling, making it impossible to integrate complex, data-driven tools like the
one described in this ticket.

**Resolution:** The `UnifiedChatBlock` in the `fragment` application has been
re-architected to use the Vercel AI SDK's client-side tool-calling capabilities.
The `businessResearchTool` has already been successfully integrated using this
new pattern.

**Next Steps:** This ticket is now fully unblocked. The implementation can
proceed as described below, using the `businessResearchTool` integration as a
direct reference for how to add the `geoAnalysisTool` and its corresponding
`GeoScoreCard` artifact.

---

## 🎯 CLEAR PROMPT

**Replace the demo data in Fragment with real multi-LLM GEO scanning that uses
agents to analyze business visibility across ChatGPT, Claude, and Perplexity.**

Build a `/api/geo-scan` endpoint that takes business name + website, runs
agent-orchestrated research using PIPER-5 protocol (Probe → Ingest → Parse →
Evaluate → Recommend), and streams results through the existing UnifiedChatBlock
as a GeoScoreCard artifact.

The agent system should gather raw data, let LLMs compute provisional scores,
and generate actionable insights - no hardcoded scoring algorithms. This makes
the system more flexible and allows for rapid iteration based on customer
feedback.

---

## 🎯 EXECUTIVE SUMMARY

**THE PROBLEM**: We have a working conversational interface but it only shows
demo data. Users won't engage long-term with fake tables.

**THE SOLUTION**: Replace demo data with REAL multi-LLM GEO scanning that shows
actual business visibility across ChatGPT, Claude, and Perplexity.

**THE OUTCOME**: Immediate user value and engagement within hours of deployment.

---

## 🚀 PRESS RELEASE (Work Backwards)

**Fragment Ships First-to-Market Conversational GEO Analysis!**

_San Francisco, CA_ – Fragment today announced the industry's first
conversational GEO platform that lets marketers ask "How visible is my business
in AI search?" and get real-time insights across ChatGPT, Claude, and Perplexity
with actionable recommendations.

Unlike traditional SEO tools that ignore AI search, Fragment streams live
visibility scores, competitive analysis, and click-to-fix recommendations
through a ChatGPT-style interface.

"We're not just reporting on AI visibility – we're making it conversational and
actionable," said the Fragment team. "Marketers can now optimize for AI search
as easily as asking a question."

The platform launches with support for 1,000+ industries and immediate
competitive benchmarking across major AI platforms.

---

## 📊 SUCCESS METRICS (Revenue-Focused)

### Business Impact

- **Revenue**: First $2K MRR from 5 beta customers within 2 weeks
- **Product-Market Fit**: >8/10 "must-have" score from initial users
- **Conversion**: >20% of trial users convert to paid within 30 days
- **Retention**: >80% monthly retention for paying customers

### Technical Performance

- **Response Time**: <5 seconds for initial GEO scan
- **Accuracy**: >85% correlation with manual verification
- **Coverage**: Support 100+ business categories
- **Reliability**: >99% successful scans

---

## 🛠️ TECHNICAL IMPLEMENTATION

### Phase 1A: Agent-Orchestrated GEO Engine (Hours 1-4)

**New API Route: `/api/geo-scan`**

```typescript
// apps/fragment/app/api/geo-scan/route.ts
import { runPIPER5 } from "@/packages/agents/src/orchestration/agent-bus";

export async function POST(req: Request) {
	const { businessName, website, industry } = await req.json();

	// Run agent pipeline instead of hardcoded queries
	const agentContext = await runPIPER5({
		name: businessName,
		website: website,
		industry: industry || "general",
	});

	// Agents emit structured facts - no hardcoded scoring
	const geoScore = extractGeoScore(agentContext.facts);
	const recommendations = extractRecommendations(agentContext.facts);
	const competitorData = extractCompetitorData(agentContext.facts);

	return streamResponse({
		geoScore,
		platformBreakdown: geoScore.platformScores,
		recommendations,
		competitorAnalysis: competitorData,
		agentInsights: agentContext.facts,
	});
}
```

**Agent-Based Data Gathering**

- **Probe Agent**: Crawls website, queries multiple LLMs with strategic prompts
- **Ingest Agent**: Normalizes raw data into structured facts
- **Parse Agent**: Identifies mentions, competitors, content gaps
- **Evaluate Agent**: Uses LLM to compute provisional scores from facts
- **Recommend Agent**: Generates actionable insights based on analysis

**API Integration:**

```typescript
// Use service API calls instead of hardcoded Firecrawl calls
import { ResearchClient } from "@/lib/research-client";

// In Probe Agent
const researchClient = new ResearchClient();
const websiteData = await researchClient.scrapeWebsite({
	url: website,
});
```

### Phase 1B: LLM-Based Scoring (Hours 4-8)

**Agent-Computed Scores (No Hardcoded Algorithms):**

```typescript
// packages/agents/src/agents/evaluate-agent.ts
export class EvaluateAgent implements Agent {
	async execute(context: AgentContext): Promise<AgentContext> {
		const facts = context.facts;

		// Let LLM compute score based on gathered evidence
		const scorePrompt = `
			Analyze this business visibility data and compute a GEO score (0-10):
			
			Business: ${context.businessData.name}
			Website: ${context.businessData.website}
			
			Evidence:
			${JSON.stringify(
				facts.filter((f) => f.type.includes("mention")),
				null,
				2
			)}
			
			Consider:
			- Mention frequency across platforms
			- Context quality and sentiment
			- Competitive positioning
			- Content authority indicators
			
			Return JSON: {
				overall_score: number,
				platform_scores: { chatgpt: number, claude: number, perplexity: number },
				reasoning: string,
				confidence: number
			}
		`;

		const scoreResult = await this.callLLM(scorePrompt);

		context.facts.push({
			type: "geo_score_analysis",
			data: scoreResult,
			source: "evaluate_agent",
			confidence: scoreResult.confidence,
		});

		return context;
	}
}
```

### Phase 1C: Artifact & UI Integration (Hours 8-12)

**Checklist:**

- [ ] Create `/api/geo-scan` endpoint
- [ ] Implement PIPER-5 agent pipeline
- [ ] Build `geoAnalysisTool` for Fragment
- [ ] Create `GeoScoreCard` artifact component
- [ ] Test with 5+ real businesses
- [ ] Optimize response time to <5 seconds

### Phase 2: Refinement & Optimization (Hours 12-24)

**Checklist:**

- [ ] Add competitive benchmarking
- [ ] Implement real-time streaming
- [ ] Optimize LLM prompts for accuracy
- [ ] Add industry-specific analysis
- [ ] Implement schema validation for all API responses
- [ ] Add error handling and fallbacks

---

## 🎨 UI/UX IMPLEMENTATION

### New Artifact: GeoScoreCard

**Visual Layout:**

```
┌─────────────────────────────────────┐
│  🎯 GEO Score: 7.2/10               │
│  ▓▓▓▓▓▓▓░░░ (Improving +0.3)        │
│                                     │
│  Platform Breakdown:                │
│  ChatGPT     ██████░░░░ 6.1/10      │
│  Claude      ████████░░ 8.4/10      │
│  Perplexity  ██████░░░░ 6.9/10      │
│                                     │
│  🏆 vs Competitors:                 │
│  Microsoft: 9.1  You: 7.2  IBM: 6.8│
│                                     │
│  📈 Quick Wins:                     │
│  ▸ Add FAQ schema (+1.2 pts)        │
│  ▸ Create case studies (+0.8 pts)   │
│  ▸ Optimize for "CRM" (+1.5 pts)    │
└─────────────────────────────────────┘
```

**Component Structure:**

```tsx
// components/artifacts/geo-score-card.tsx
export function GeoScoreCard({ data }: { data: any }) {
	return (
		<div className="geo-score-card">
			<div className="score-header">
				<h2>{data.businessName}</h2>
				<div className="overall-score">{data.geoScore.overall}/10</div>
			</div>

			<Tabs defaultValue="overview">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="platforms">Platforms</TabsTrigger>
					<TabsTrigger value="competitors">Competitors</TabsTrigger>
					<TabsTrigger value="recommendations">Recommendations</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					{/* Overall score and summary */}
				</TabsContent>

				<TabsContent value="platforms">{/* Platform breakdown */}</TabsContent>

				<TabsContent value="competitors">
					{/* Competitor analysis */}
				</TabsContent>

				<TabsContent value="recommendations">
					{/* Actionable recommendations */}
				</TabsContent>
			</Tabs>
		</div>
	);
}
```

---

## 🧪 ACCEPTANCE CRITERIA

### Same-Day Deliverables (Hours 1-12)

- [ ] `/api/geo-scan` endpoint runs agent pipeline for 5 test businesses
- [ ] Agent-computed scores are reasonable and explainable (no hardcoded
      algorithms)
- [ ] UnifiedChatBlock renders GeoScoreCard artifact from agent facts
- [ ] Platform breakdown shows differentiated agent-computed scores across
      ChatGPT/Claude/Perplexity
- [ ] Agent insights provide actionable recommendations for test businesses
- [ ] PIPER-5 pipeline completes within 30 seconds for typical business scan

### Next-Day Deliverables (Hours 12-24)

- [ ] Competitive analysis shows 3-5 relevant competitors per industry
- [ ] Quick wins recommendations are specific and actionable
- [ ] Export functionality for GEO reports
- [ ] MCP tool discovery working for Firecrawl integration
- [ ] Context7 schema compliance for all agent tools

### Success Gates

- [ ] **Functionality Gate**: Real data replaces all demo data
- [ ] **Performance Gate**: <30 second analysis completion
- [ ] **Technical Gate**: <2% error rate on GEO scans
- [ ] **UX Gate**: >8.5/10 user satisfaction with real insights

---

## 🔧 TECHNICAL ARCHITECTURE

### Data Flow

```
User Query → AI Tool → GEO Scan API → PIPER-5 Agent Pipeline → Agent Facts → Artifact Response → UI Render
                                      ↓
                            Probe → Ingest → Parse → Evaluate → Recommend
                               ↓
                         MCP Tool Discovery (Firecrawl, etc)
```

### New API Endpoints

1. `POST /api/geo-scan` - Core GEO analysis with agent orchestration
2. `GET /api/geo-history/:businessId` - Historical scores (future)
3. `GET /api/competitors/:industry` - Competitor data
4. `POST /api/geo-recommendations` - Agent-generated optimization suggestions

### MCP Integration Points

- **Firecrawl**: Use MCP client instead of direct API calls
- **Research Data**: Expose via MCP for external tool discovery
- **Agent Tools**: Context7 schema compliance for all tools

---

## 🚦 RISK MITIGATION

### Technical Risks

- **API Rate Limits**: Implement intelligent query batching and caching
- **LLM Consistency**: Use multiple query variations for robustness
- **Response Time**: Parallelize API calls, show progressive loading
- **Accuracy**: Manual verification of scores for 20 test businesses

### Business Risks

- **Customer Expectations**: Set clear expectations about score methodology
- **Competitive Response**: Move fast, establish first-mover advantage
- **Pricing Pressure**: Focus on value demonstration over price competition

### Mitigation Strategies

- **Beta Customer Feedback Loop**: Weekly check-ins with all beta users
- **Technical Performance Monitoring**: Real-time alerting on API failures
- **Manual Override System**: Allow customer success to adjust scores if needed

---

## 📈 GO-TO-MARKET INTEGRATION

### Beta Customer Recruitment (Immediate)

- Target: 5 marketing managers at B2B SaaS companies
- Outreach: LinkedIn + cold email focusing on "AI search visibility gap"
- Offer: Free analysis + 1-month free if they provide feedback

### Demo Script (2-minute pitch)

1. "Let me show you something interesting about your business..."
2. Type business name → streaming GEO analysis begins
3. "Here's how visible you are in AI search compared to competitors"
4. Show quick wins: "These 3 changes could improve your score by 2.5 points"
5. "Want to track this over time and get automated recommendations?"

### Pricing Strategy

- Beta Phase: Free for feedback
- Launch: $49/month (10 scans/month)
- Upsell: $149/month (50 scans + competitive tracking)

---

## 🎯 MILESTONES & TIMELINE

### Hours 1-4: Agent Pipeline Core

- Multi-LLM query implementation with MCP discovery
- PIPER-5 agent orchestration setup
- Basic scoring via LLM analysis

### Hours 4-8: Score Computation

- Agent-based scoring (no hardcoded algorithms)
- Platform-specific analysis logic
- Confidence scoring and validation

### Hours 8-12: UI Integration

- GeoScoreCard artifact implementation
- UnifiedChatBlock streaming integration
- Real data displaying in Fragment

### Success Metrics Per Phase

- **Hours 1-4**: Agent pipeline executes successfully
- **Hours 4-8**: Reasonable scores generated for test businesses
- **Hours 8-12**: Real data visible in Fragment interface

---

## 🤝 TEAM RESPONSIBILITIES

### Engineering (Week 1 Focus)

- Build multi-LLM query system
- Implement GEO scoring algorithm
- Integrate with existing chat interface
- Performance optimization

### Product (Week 2 Focus)

- Beta customer recruitment
- User feedback collection
- Pricing strategy validation
- Feature prioritization

### Success Criteria

- **Commit**: Ship real GEO data within 1 week
- **Commit**: Acquire first paying customer within 2 weeks
- **Commit**: $2K MRR within 1 month

---

## 🔄 STATUS UPDATES

**Current Status**: 🚧 **ACTIVE SPRINT - HIGHEST PRIORITY**  
**Progress**: Same-day implementation - building agent-orchestrated GEO
scanning  
**Blockers**: None - full execution mode  
**Next Milestone**: Real GEO data working for test businesses within 12 hours  
**Success Definition**: Demo data completely replaced with agent-generated
insights  
**Review Cadence**: Hourly check-ins during implementation sprint

### Implementation Notes

- **Context7 Reference**: Use latest MCP patterns from Context7 docs
- **Agent Architecture**: Follow PIPER-5 protocol strictly
- **No Hardcoding**: All scoring via LLM analysis of facts
- **MCP First**: Tool discovery over direct API integration

### Recent Updates

- **Jan 19**: Ticket created, technical architecture defined
- **Target**: Multi-LLM query engine live by Jan 24
- **Risk**: API rate limits require intelligent batching strategy

## 🧪 TESTING PLAN

### Unit Tests

- **Agent Pipeline**: Test each agent in isolation
- **Tool Integration**: Verify tool registration and execution
- **Artifact Rendering**: Test component with mock data

### Integration Tests

- **End-to-End Flow**: From chat prompt to rendered artifact
- **Agent Tools**: Verify all tools function correctly
- **Error Handling**: Test recovery from API failures

### User Acceptance Testing

- **Real Businesses**: Test with 10+ real businesses
- **Response Time**: Verify <5 second response time
- **Accuracy**: Manual verification of scores

---

## 📚 IMPLEMENTATION GUIDE

### Architecture

- **Agent Pipeline**: PIPER-5 protocol with 5 specialized agents
- **API Layer**: `/api/geo-scan` endpoint with streaming response
- **UI Components**: GeoScoreCard artifact with tabs
- **Data Flow**: Chat → Tool → API → Agents → Artifact

### Key Dependencies

- **@workspace/agents**: PIPER-5 agent orchestration
- **@workspace/artifacts-ui**: Artifact rendering system
- **Vercel AI SDK**: Tool registration and execution

### Development Flow

1. Implement agent pipeline first
2. Build and test `/api/geo-scan` endpoint
3. Create and register the `geoAnalysisTool`
4. Build the `GeoScoreCard` artifact component
5. Test end-to-end flow with real businesses

---

## 🚀 DEPLOYMENT PLAN

### Rollout Strategy

- **Phase 1**: Internal testing (Hours 0-12)
- **Phase 2**: Beta customer access (Hours 12-24)
- **Phase 3**: Full production launch (Hour 24+)

### Monitoring

- **Performance**: Track response times
- **Usage**: Monitor scan frequency and user engagement
- **Accuracy**: Sample and verify scores manually

### Success Criteria

- **Technical**: <5 second response time, >99% reliability
- **Business**: First paying customer within 48 hours

---

## 📝 NOTES & REFERENCES

- **Research Data**: See competitive analysis in `/project-docs/research/`
- **Design Reference**: ArcGIS-style dashboard with clear metrics
- **Inspiration**: Basedash + Perplexity AI for UX patterns
