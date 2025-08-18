# FRAG-006 – Agent Orchestrator & Memory Bus

_Created: 2025-01-19_ _Status: **READY** - Waiting for FRAG-003 completion_

---

## 🎯 CLEAR PROMPT

**Replace the monolithic `/api/geo-scan` logic with PIPER-5 agent pipeline that
uses multiple specialized agents to process business analysis data.**

Build a `lib/agent-bus.ts` orchestrator that runs Probe → Ingest → Parse →
Evaluate → Recommend agents in sequence, where each agent has memory sharing and
can emit structured facts for the next agent to consume.

Implement this behind a `?agents=true` flag so we can test agent-based scoring
alongside the current hardcoded scoring system.

---

## 🛠️ TECHNICAL IMPLEMENTATION

### Core Agent Bus Architecture

```typescript
// packages/agents/src/orchestration/agent-bus.ts
export interface AgentContext {
	facts: Fact[];
	memory: Map<string, any>;
	businessData: {
		name: string;
		industry: string;
		website: string;
	};
}

export interface Agent {
	name: string;
	execute(context: AgentContext): Promise<AgentContext>;
}

export async function runPIPER5(
	initialData: BusinessInput
): Promise<AgentContext> {
	let context: AgentContext = {
		facts: [],
		memory: new Map(),
		businessData: initialData,
	};

	const agents = [
		new ProbeAgent(),
		new IngestAgent(),
		new ParseAgent(),
		new EvaluateAgent(),
		new RecommendAgent(),
	];

	for (const agent of agents) {
		console.log(`Running agent: ${agent.name}`);
		context = await agent.execute(context);
	}

	return context;
}
```

### Individual Agent Implementation

```typescript
// packages/agents/src/agents/probe-agent.ts
export class ProbeAgent implements Agent {
	name = "probe";

	async execute(context: AgentContext): Promise<AgentContext> {
		const { businessData } = context;

		// Crawl website, call LLMs, scrape competitor data
		const webData = await this.crawlWebsite(businessData.website);
		const llmResponses = await this.queryMultipleLLMs(businessData.name);

		// Add raw facts to context
		context.facts.push(
			{ type: "web_content", data: webData, source: "probe" },
			{ type: "llm_mentions", data: llmResponses, source: "probe" }
		);

		return context;
	}
}

// packages/agents/src/agents/evaluate-agent.ts
export class EvaluateAgent implements Agent {
	name = "evaluate";

	async execute(context: AgentContext): Promise<AgentContext> {
		// Use LLM to compute provisional scores from facts
		const facts = context.facts;
		const scorePrompt = `
      Based on these facts about ${context.businessData.name}:
      ${JSON.stringify(facts, null, 2)}
      
      Calculate a GEO visibility score from 0-10 and explain reasoning.
      Return JSON: { score: number, reasoning: string, deltas: object }
    `;

		const scoreResult = await this.callLLM(scorePrompt);

		context.facts.push({
			type: "geo_score",
			data: scoreResult,
			source: "evaluate",
		});

		return context;
	}
}
```

---

## 🧪 ACCEPTANCE CRITERIA

### Sprint Tasks (3 days)

- [ ] **Day 1: Scaffold agent bus infrastructure**
  - [ ] Create `packages/agents/src/orchestration/agent-bus.ts`
  - [ ] Define `AgentContext`, `Agent` interface, `runPIPER5` orchestrator
  - [ ] Add unit tests for orchestrator with mocked agents

- [ ] **Day 2: Implement core agents**
  - [ ] Build `ProbeAgent` (crawl + multi-LLM calls)
  - [ ] Build `IngestAgent` (normalize & store facts)
  - [ ] Build `EvaluateAgent` (LLM-based scoring)

- [ ] **Day 3: Integration & testing**
  - [ ] Wire orchestrator into `/api/geo-scan` behind `?agents=true` flag
  - [ ] Test agent pipeline returns valid facts array
  - [ ] Verify Pulse Email can consume agent output

### Success Criteria

- [ ] API returns `facts` array with at least 3 fact types (mention, price,
      prompt_gap)
- [ ] Response time ≤ 8s for 3-query scan (OK to optimize later)
- [ ] Pulse Email consumes new output without changes to UI
- [ ] Agent failures don't crash the main API (graceful degradation)
- [ ] Agents share context through memory bus successfully

---

## 🔄 STATUS UPDATES

**Current Status**: READY - Blocked by FRAG-003 completion **Blockers**: Need
working geo-scan API first **Next Action**: Begin agent bus scaffolding once
FRAG-003 ships **Target Start**: Week 6 (after Phase 1.5 completion)
