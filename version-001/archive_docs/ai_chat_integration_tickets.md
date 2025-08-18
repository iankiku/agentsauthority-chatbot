# AI Chat Integration with Agents - Implementation Tickets

## Engineering Rules & Guidelines

**CRITICAL RULES - READ BEFORE STARTING ANY TICKET:**

1. **Working Directory**: All work must be done in `/apps/dashboard`
2. **UI Components**: Use ONLY shadcn components from `packages/ui` - NO
   subframe imports
3. **Mastra Client**: Use existing Mastra client at `/lib/mastra-client.ts` for
   all agent interactions
4. **API Enhancement**: Enhance existing `/api/chat` route - NO new API
   endpoints needed
5. **Agent Integration**: Use existing agents in `/apps/agents/mastra/agents/`
   directory
6. **Authentication**: Use existing auth patterns - NO new authentication logic
7. **Component Strategy**: Build reusable streaming components once, reuse
   everywhere
8. **Page Preservation**: Do NOT delete current `/v2/chat` page during
   enhancement
9. **Error Handling**: If engineer deviates or becomes confused, STOP and ask
   human
10. **Dependencies**: List all dependencies clearly in each ticket
11. **Status Updates**: Update completion status after each ticket
    implementation
12. **Progressive Implementation**: Start with TICKET-001 as foundation, test
    thoroughly before proceeding

## Ticket Status Legend

- `[ ]` = Not Started
- `[/]` = In Progress
- `[-]` = Cancelled
- `[x]` = Complete

## Implementation Strategy - Simplified 2-Phase Approach ✅

**NEW APPROACH**: Focus on `/v2/chat` implementation with minimal changes for
maximum reliability:

1. **PHASE 1 (TICKET-001)**: Basic agent streaming - modify only the API route
   for streaming
2. **PHASE 2 (TICKET-002)**: Add artifacts and multi-agent orchestration
3. **Test After Each Phase**: Validate functionality before proceeding
4. **Minimal Frontend Changes**: V2 chat UI already works with `useChat` hook
5. **Backward Compatibility**: Keep `generate` method as fallback

**Key Insight**: The V2 chat UI already uses AI SDK hooks correctly - we just
need to enhance the backend to stream properly!

---

## TICKET-001: Enable Basic Agent Streaming on /v2/chat

**Status**: `[/]`

### Description

Transform the existing `/api/chat` route to stream responses from Mastra agents
instead of returning static text. This enables real-time agent responses while
maintaining all existing functionality.

### Detailed Prompt for LLM Engineer

**TASK**: Modify the `/api/chat` route to use Mastra agent streaming while
keeping the exact same API interface that the V2 chat UI expects.

**CURRENT STATE**:

- `/apps/dashboard/app/api/chat/route.ts` uses
  `callAgentApi({ method: "generate" })`
- V2 chat UI already uses `useV2Chat` hook (wrapper around
  `@ai-sdk/react useChat`)
- Mastra client supports streaming via `method: "stream"`
- No frontend changes needed!

**IMPLEMENTATION STEPS**:

1. **Analyze Current Implementation**:
   - Review `/apps/dashboard/app/api/chat/route.ts` (lines 121-127)
   - Note current `callAgentApi` usage with `method: "generate"`
   - Understand response handling and conversation saving
   - Preserve all auth, credit tracking, and database operations

2. **Switch to Streaming**:
   - Change `method: "generate"` to `method: "stream"` in `callAgentApi`
   - Handle the streaming response from Mastra client
   - Convert Mastra stream to AI SDK compatible format
   - Maintain conversation context and message saving

3. **Stream Processing**:
   - Process Mastra stream chunks in real-time
   - Ensure stream format works with existing `useV2Chat` hook
   - Handle stream completion and error cases
   - Preserve fallback to `generate` method on stream failure

4. **Test & Validate**:
   - Test with existing V2 chat UI at `/v2/chat`
   - Verify real-time streaming works smoothly
   - Ensure conversation saving still works
   - Validate error handling and fallbacks

### Key Code References

**Files to Modify:**

```typescript
// apps/dashboard/app/api/chat/route.ts (lines 121-127)
const result = await callAgentApi({
	agentName: "chatAgent",
	messages: [...messagesForAgent, { role: "user", content: message }],
	method: "generate", // ← Change to "stream"
	resourceId: `user-${userId}`,
	threadId: currentConversation.id,
});
```

**Mastra Client Reference:**

```typescript
// apps/dashboard/lib/mastra-client.ts (lines 46-52)
// The stream method already exists - just need to use it!
} else if (method === "stream") {
  const streamResult = await agent.stream({
    messages,
    resourceId,
    threadId,
  });
  result = streamResult; // This returns a stream
}
```

**V2 Chat Hook (No Changes Needed):**

```typescript
// apps/dashboard/lib/v2/sdk-validation.ts
// Already uses useChat from @ai-sdk/react - will work with streaming!
const chatResult = useChat({
	api: "/api/chat", // Same endpoint, enhanced backend
	// ... other options
});
```

### Acceptance Criteria

1. ✅ Modify existing `/api/chat` route to use `method: "stream"`
2. ✅ Convert Mastra stream to AI SDK compatible format
3. ✅ Maintain all existing functionality (auth, conversation saving, etc.)
4. ✅ Test real-time streaming with V2 chat UI
5. ✅ Implement fallback to `generate` method on stream failure
6. ✅ Preserve conversation context and thread management
7. ✅ Ensure stream works with existing `useV2Chat` hook
8. ✅ Handle streaming errors gracefully

### Success Metrics

- **Real-time streaming**: Text appears as agent generates it
- **Reliability**: Fallback to non-streaming works on errors
- **Compatibility**: V2 chat UI works without changes
- **Performance**: First token appears within 2 seconds

---

## TICKET-002: Add Artifacts & Multi-Agent Orchestration

**Status**: `[/]`

### Description

Enhance the streaming chat system with artifact detection/rendering and
multi-agent orchestration. Once basic streaming works (TICKET-001), add support
for agents to generate charts, tables, reports and orchestrate multiple
specialized agents.

### Detailed Prompt for LLM Engineer

**TASK**: Build on TICKET-001's streaming foundation to add artifact parsing and
multi-agent workflows while maintaining the simple, reliable approach.

**CURRENT STATE AFTER TICKET-001**:

- `/api/chat` route streams Mastra agent responses
- V2 chat UI displays real-time streaming text
- Single chatAgent responds to user queries

**IMPLEMENTATION STEPS**:

1. **Add Artifact Detection to Stream**:
   - Parse Mastra agent responses for artifact patterns (e.g.,
     `<artifact type="geo-score-card">...</artifact>`)
   - Use existing artifact schemas from
     `/apps/agents/mastra/lib/artifacts/artifactSchemas.ts`
   - Stream artifacts alongside text to the V2 chat UI
   - Handle artifact errors gracefully

2. **Enhance Message Rendering**:
   - Update V2 message components to render artifacts using existing renderers
   - Support existing artifact types: `data-table`, `line-chart`,
     `geo-score-card`, etc.
   - Add artifact interactions (expand, export functionality)
   - Maintain smooth streaming experience

3. **Enable Multi-Agent Orchestration**:
   - Allow chatAgent to delegate to plannerAgent and specialized agents
   - Support agent delegation patterns (chatAgent → plannerAgent →
     brandAnalysisAgent)
   - Show delegation progress in UI ("Routing to Brand Analysis Agent...")
   - Handle multi-agent response synthesis

4. **Test Complex Workflows**:
   - Test brand analysis queries that generate artifacts
   - Validate multi-agent workflows work with streaming
   - Ensure error handling for agent failures
   - Verify artifact export and interaction features

### Key Integration Points

**Existing Artifact System:**

```typescript
// apps/dashboard/components/artifacts/artifact-renderer.tsx
// Already supports: geo_score_card, competitor_matrix, data_table, line_chart
```

**Artifact Schemas (Already Defined):**

```typescript
// apps/agents/mastra/lib/artifacts/artifactSchemas.ts
// Schemas for: DataTable, LineChart, GeoScoreCard, etc.
```

**Agent Delegation Pattern:**

```typescript
// Enable chatAgent to call other agents:
// chatAgent → plannerAgent → [brandAnalysisAgent, visibilityAnalysisAgent, etc.]
```

### Acceptance Criteria

1. ✅ Parse and stream artifacts from agent responses
2. ✅ Render artifacts in V2 chat using existing components
3. ✅ Support multi-agent delegation and orchestration
4. ✅ Show agent delegation progress in UI
5. ✅ Handle streaming errors for artifacts and agents
6. ✅ Enable artifact interactions (expand, export)
7. ✅ Test complex queries that generate charts/reports
8. ✅ Maintain performance and reliability from TICKET-001

### Success Metrics

- **Artifact Generation**: Users can generate charts and reports through chat
- **Multi-Agent Workflows**: Complex queries delegate to specialized agents
- **Streaming Reliability**: Artifacts stream smoothly alongside text
- **User Experience**: Clear feedback during multi-agent processing

## Implementation Timeline - Simplified ⚡

### Week 1: Basic Agent Streaming (TICKET-001)

- **Day 1-2**: Modify `/api/chat` to use `method: "stream"`
- **Day 3-4**: Test streaming with V2 chat UI
- **Day 5**: Error handling and polish

### Week 2: Artifacts & Multi-Agent (TICKET-002)

- **Day 1-2**: Add artifact detection and parsing
- **Day 3-4**: Enable multi-agent orchestration
- **Day 5**: End-to-end testing and refinement

**Total: 2 weeks to working AI agent streaming system** 🎯

## Success Metrics

- **✅ Basic Functionality**: Real-time agent streaming on `/v2/chat`
- **📊 Artifacts**: Users can generate charts/reports through chat
- **🤖 Multi-Agent**: Complex queries route to specialized agents
- **⚡ Performance**: First token appears < 2 seconds
- **🛡️ Reliability**: Fallback to non-streaming on errors

## Risk Mitigation

1. **✅ Low Risk**: Building on proven, working components
2. **🔒 Fallback**: Maintain current `generate` method as backup
3. **🧪 Incremental**: Test each phase thoroughly
4. **⚡ Fast Recovery**: Can revert anytime

## Next Steps

1. **✅ Confirm Plan**: Review this simplified approach
2. **🚀 Start TICKET-001**: Begin API route streaming enhancement
3. **🧪 Test Early**: Validate basic streaming before proceeding
4. **📈 Iterate**: Add artifacts and multi-agent after core streaming works

---

**✅ RECOMMENDATION**: This simplified 2-ticket approach minimizes risk while
maximizing value from your existing Mastra agent infrastructure. Start with
TICKET-001 to get basic streaming working, then expand with TICKET-002 for
artifacts and orchestration.
