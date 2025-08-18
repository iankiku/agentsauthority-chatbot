# Chat API Streaming Implementation

This document explains the implementation of streaming responses from Mastra
agents in the chat API.

## Implementation Overview

The implementation enhances the existing `/api/chat` route to support streaming
responses from Mastra agents using Server-Sent Events (SSE). This allows
real-time text generation and progressive display of agent responses in the UI.

### Key Changes

1. **Changed method from "generate" to "stream"**
   - Previously: `method: "generate"` returned a complete response all at once
   - Now: `method: "stream"` returns a streaming response chunk by chunk

2. **Message Handling**
   - Before: Save complete message after receiving full response
   - Now: Save placeholder message first, update with complete content when
     stream ends

3. **Streaming Implementation**
   - Use TransformStream to process and collect stream chunks
   - Forwards chunks to client immediately
   - Collects full content for database persistence

4. **Fallback Mechanism**
   - If streaming fails, automatically falls back to "generate" method
   - Ensures reliability even if streaming encounters issues

## Code Changes

```typescript
// Main change: Switch from generate to stream
const streamResponse = await callAgentApi({
	agentName: "chatAgent",
	messages: [...messagesForAgent, { role: "user", content: message }],
	method: "stream", // Changed from "generate"
	resourceId: `user-${userId}`,
	threadId: currentConversation.id,
});
```

## Advantages

1. **Real-time Responses**: Users see responses as they are generated
2. **Improved Perceived Performance**: First text appears quickly
3. **Better User Experience**: More interactive feeling
4. **Reliability**: Fallback to "generate" if streaming fails

## Testing

Tests have been added to verify the streaming functionality:

1. **Manual Testing**: Use the V2 chat interface and observe streaming behavior
2. **Unit Tests**: Test the API route to ensure it correctly uses stream method
3. **Integration Test**: Test the integration between Mastra agents and chat UI

## Next Steps

After verifying this implementation works, the next phase will be to add support
for:

1. Artifact detection in stream responses
2. Multi-agent orchestration
3. Advanced error handling
