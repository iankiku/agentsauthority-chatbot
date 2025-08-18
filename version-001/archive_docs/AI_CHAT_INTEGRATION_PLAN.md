# AI Chat Integration with Agents - Implementation Plan

## Architecture Decision: Hybrid Mastra + AI SDK Approach ✅

**DECISION**: Use **Mastra Agents + Vercel AI SDK** for optimal integration

### Why This Hybrid Approach:

1. **Mastra for Backend**: Leverage existing 8+ specialized agents (chatAgent,
   plannerAgent, brandAnalysisAgent, etc.)
2. **AI SDK for Frontend**: Use proven `@ai-sdk/react` hooks for streaming UI
   and state management
3. **Best of Both**: Mastra's agent orchestration + AI SDK's streaming UX
4. **Minimal Changes**: Both systems already exist and work - just need proper
   connection
5. **Future-Proof**: Mastra is built on AI SDK, ensuring compatibility

## Current State Analysis

### ✅ What's Already Working:

- **V2 Chat UI**: Complete interface using `useChat` hook from `@ai-sdk/react`
- **Mastra Agents**: 8+ specialized agents with tools and memory
- **Streaming Infrastructure**: Mastra client supports `stream` method
  (currently using `generate`)
- **Artifact System**: Defined schemas and rendering components
- **AI SDK Integration**: `@ai-sdk/react: 2.0.0-beta.6` validated and working

### 🚧 What Needs Enhancement:

- **API Route**: Switch from `method: "generate"` to `method: "stream"`
- **Stream Processing**: Convert Mastra stream to AI SDK compatible format
- **Artifact Detection**: Parse artifacts from agent responses
- **Multi-Agent Flow**: Enable chatAgent → plannerAgent → specialized agents

## Simplified Implementation Strategy

**Focus**: Get `/v2/chat` working with agent streaming first, then expand

## Implementation Plan - Simplified 2-Phase Approach

### 🎯 Phase 1: Basic Agent Streaming (Week 1)

**Goal**: Get `/v2/chat` working with Mastra agent streaming

#### 1.1 Enhanced API Route (`/api/chat/route.ts`)

- **Current**: `callAgentApi({ method: "generate" })` returns static text
- **Enhanced**: Switch to `callAgentApi({ method: "stream" })` for real-time
  streaming
- **Stream Format**: Convert Mastra stream to AI SDK compatible format
- **Fallback**: Keep `generate` method as backup for reliability

#### 1.2 Stream Processing & Response Handling

- **Mastra Stream → AI SDK**: Transform native Mastra stream to work with
  `useChat` hook
- **Progressive Text**: Enable real-time text streaming to UI
- **Error Handling**: Graceful fallback to non-streaming on failure
- **Conversation**: Maintain existing conversation/message saving

**Success Criteria**: Users can chat with Mastra agents in real-time streaming
mode

### 🚀 Phase 2: Artifacts & Multi-Agent (Week 2)

**Goal**: Add artifact rendering and agent orchestration

#### 2.1 Artifact Detection & Rendering

- **Parse Artifacts**: Detect artifact responses from agents using existing
  schemas
- **UI Integration**: Render artifacts using existing components (`data-table`,
  `geo-score-card`, etc.)
- **Stream Artifacts**: Support artifact streaming alongside text responses

#### 2.2 Multi-Agent Orchestration

- **Agent Flow**: Enable chatAgent → plannerAgent → specialized agents
- **Delegation UI**: Show users which agent is processing their request
- **Response Synthesis**: Combine multi-agent responses into coherent output

**Success Criteria**: Users can generate charts, tables, and reports through
natural language

## Technical Implementation Details

### Phase 1: API Route Enhancement

```typescript
// Current: apps/dashboard/app/api/chat/route.ts
const result = await callAgentApi({
	agentName: "chatAgent",
	messages: messagesForAgent,
	method: "generate", // ← Change this to "stream"
	resourceId: `user-${userId}`,
	threadId: currentConversation.id,
});

// Enhanced approach:
const stream = await callAgentApi({
	agentName: "chatAgent",
	messages: messagesForAgent,
	method: "stream", // ← Enable streaming
	resourceId: `user-${userId}`,
	threadId: currentConversation.id,
});

// Convert Mastra stream to AI SDK format
return toAIStreamResponse(stream);
```

### Phase 2: Artifact Integration

```typescript
// Detect artifacts in stream
function parseArtifacts(chunk: string) {
	// Look for artifact patterns in agent responses
	const artifactMatch = chunk.match(/<artifact type="(.+?)">(.+?)<\/artifact>/);
	if (artifactMatch) {
		return {
			type: "artifact",
			artifactType: artifactMatch[1],
			data: JSON.parse(artifactMatch[2]),
		};
	}
	return { type: "text", content: chunk };
}
```

### Frontend Integration (Already Working!)

```typescript
// V2 chat already uses this - no changes needed!
const { messages, input, handleSubmit, isLoading } = useV2Chat({
	api: "/api/chat", // Same endpoint, enhanced backend
	id: conversationId,
});
```

## Key Benefits of This Approach

1. **✅ Minimal Frontend Changes**: V2 chat UI works as-is with enhanced backend
2. **🚀 Fast Implementation**: Only need to modify API route streaming logic
3. **🔄 Backward Compatible**: Keep `generate` method as fallback
4. **🎯 Proven Architecture**: Both Mastra agents and AI SDK already work
5. **📈 Scalable**: Easy to add new agents and artifact types

## Implementation Timeline

### Week 1: Basic Streaming

- **Day 1-2**: Modify `/api/chat` route for streaming
- **Day 3-4**: Test with V2 chat UI
- **Day 5**: Polish and error handling

### Week 2: Artifacts & Multi-Agent

- **Day 1-2**: Add artifact detection and parsing
- **Day 3-4**: Implement agent orchestration UI
- **Day 5**: End-to-end testing and refinement

## Risk Mitigation

1. **✅ Low Risk**: Building on proven, working components
2. **🔒 Fallback**: Keep current `generate` method as backup
3. **🧪 Incremental**: Test each change before proceeding
4. **⚡ Fast Recovery**: Can revert to current system anytime

## Ready to Proceed ✅

**Recommendation**: Start with Phase 1 implementation on `/v2/chat` page. This
approach minimizes risk while maximizing the value of your existing Mastra agent
infrastructure.

**Next Step**: Confirm this simplified approach and begin Phase 1
implementation.
