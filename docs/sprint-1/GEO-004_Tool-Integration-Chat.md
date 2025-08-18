# GEO-004: Tool Integration with Chat System

## 📋 Ticket Overview

**Type**: Integration Development **Priority**: P0 (Blocker) **Story Points**: 2
**Estimated Time**: 2 hours **Assignee**: [Developer Name] **Sprint**: Sprint 1,
Day 1 **Dependencies**: GEO-002 (Visibility Scanner Tool), GEO-003 (Visibility
Matrix Artifact)

## 🎯 User Story

As a **user of the chat interface**, I want to **ask questions about brand
visibility and receive rich, interactive visualizations** so that I can **get
immediate insights without leaving the conversation**.

## 📝 Description

Integrate the Visibility Scanner Tool with the existing chat system to enable
seamless multi-model brand analysis. This includes tool registration, artifact
generation, and ensuring the user experience flows naturally from question to
insight.

## 🎨 Acceptance Criteria

### Chat Integration Requirements

- [ ] **AC1**: Tool is registered with the existing Vercel AI SDK setup
- [ ] **AC2**: Tool responds to natural language queries about brand visibility
- [ ] **AC3**: Tool integrates with existing chat message flow
- [ ] **AC4**: Tool execution shows appropriate loading states
- [ ] **AC5**: Tool errors are handled gracefully with user-friendly messages

### Artifact Integration Requirements

- [ ] **AC6**: Tool output automatically generates Visibility Matrix artifact
- [ ] **AC7**: Artifact renders correctly within chat interface
- [ ] **AC8**: Artifact persists in conversation history
- [ ] **AC9**: Artifact is responsive within chat container
- [ ] **AC10**: Multiple artifacts can be displayed in same conversation

### User Experience Requirements

- [ ] **AC11**: Natural language processing recognizes visibility-related
      queries
- [ ] **AC12**: Loading states are informative and not disruptive
- [ ] **AC13**: Error states provide helpful guidance to users
- [ ] **AC14**: Tool suggestions appear when appropriate
- [ ] **AC15**: Response time feels responsive (< 15 seconds total)

### Data Flow Requirements

- [ ] **AC16**: Tool parameters are extracted from user messages correctly
- [ ] **AC17**: Brand names are identified accurately from context
- [ ] **AC18**: Tool output creates persistent database records
- [ ] **AC19**: Conversation context is maintained throughout interaction
- [ ] **AC20**: Artifact metadata includes proper categorization tags

## 🛠️ Technical Implementation

### File Structure

```
lib/
├── ai/
│   ├── index.ts                           # Updated tool registry
│   └── tools/
│       └── visibility-across-models-tool.ts # Tool (from GEO-002)
├── artifacts/
│   ├── artifact-processor.ts             # Enhanced processor
│   └── types.ts                          # Updated types
├── __tests__/
│   └── chat-integration.test.ts          # Integration tests
```

### Tool Registration

```typescript
// lib/ai/index.ts
import { visibilityAcrossModelsTool } from "./tools/visibility-across-models-tool";

export const availableTools = {
	// ... existing tools
	visibility_across_models: visibilityAcrossModelsTool,
};

export const getToolsForContext = (context?: string) => {
	const coreTools = {
		visibility_across_models: visibilityAcrossModelsTool,
	};

	// Add context-specific tools if needed
	return coreTools;
};
```

### Enhanced Artifact Processing

```typescript
// lib/artifacts/artifact-processor.ts
export class ArtifactProcessor {
	async processToolResult(
		toolName: string,
		result: any,
		context: ConversationContext
	): Promise<Artifact> {
		switch (toolName) {
			case "visibility_across_models":
				return this.createVisibilityArtifact(result, context);

			default:
				return this.createGenericArtifact(result, context);
		}
	}

	private async createVisibilityArtifact(
		result: VisibilityAnalysisResult,
		context: ConversationContext
	): Promise<Artifact> {
		const artifact = {
			id: generateId(),
			type: "visibility-matrix",
			title: `Brand Visibility Analysis - ${result.brandName}`,
			content: result,
			metadata: {
				brandName: result.brandName,
				timestamp: result.timestamp,
				category: "visibility-analysis",
				tags: ["brand-visibility", "multi-model-analysis", "gfo"],
				generatedBy: "visibility_across_models",
				userId: context.userId,
				conversationId: context.conversationId,
			},
		};

		// Persist to database
		await this.saveArtifact(artifact);
		return artifact;
	}
}
```

### Chat API Enhancement

```typescript
// app/api/chat/route.ts (enhancement)
import { availableTools } from "@/lib/ai";
import { ArtifactProcessor } from "@/lib/artifacts/artifact-processor";

export async function POST(request: Request) {
	const { messages } = await request.json();
	const session = await auth();

	if (!session?.user?.id) {
		return new Response("Unauthorized", { status: 401 });
	}

	const artifactProcessor = new ArtifactProcessor();

	const result = await streamText({
		model: openai("gpt-4"),
		messages: [
			{
				role: "system",
				content: `You are a GEO intelligence assistant. You help users analyze their brand visibility across AI models.
        
Available tools:
- visibility_across_models: For analyzing brand visibility across ChatGPT, Claude, and Gemini
        
When users ask about brand visibility, use the appropriate tool to provide comprehensive analysis.`,
			},
			...messages,
		],
		tools: availableTools,
		onToolCall: async ({ toolCall }) => {
			console.log(`Executing tool: ${toolCall.toolName}`, toolCall.args);
		},
		onToolResult: async ({ toolCall, result }) => {
			// Process tool result into artifact
			if (toolCall.toolName === "visibility_across_models") {
				await artifactProcessor.processToolResult(toolCall.toolName, result, {
					userId: session.user.id,
					conversationId: messages[0]?.id || generateId(),
					timestamp: new Date().toISOString(),
				});
			}
		},
	});

	return result.toDataStreamResponse();
}
```

### Natural Language Recognition

```typescript
// System prompts for better tool usage
const GEO_SYSTEM_PROMPT = `You are a GEO (Generative Engine Optimization) intelligence assistant.

Recognize these types of queries and use appropriate tools:

BRAND VISIBILITY queries (use visibility_across_models tool):
- "Show my brand visibility across AI models"
- "How does [brand] appear in ChatGPT, Claude, and Gemini?"
- "Check [brand] visibility on AI platforms"
- "Analyze [brand] presence across AI models"
- "Compare [brand] visibility across different AI systems"

Extract brand names from context and use them as parameters.
Always provide comprehensive analysis with actionable insights.`;
```

## 🧪 Testing Strategy (skip all unit/integration/feature testing implementation)

### Integration Tests

```typescript
describe("Chat Integration with Visibility Tool", () => {
	test("tool responds to brand visibility queries", async () => {
		const response = await testChatAPI({
			messages: [
				{
					role: "user",
					content: "Show my Tesla brand visibility across AI models",
				},
			],
		});

		expect(response.toolCalls).toContain("visibility_across_models");
		expect(response.toolCalls[0].args.brandName).toBe("Tesla");
	});

	test("artifact is generated and persisted", async () => {
		const response = await testChatAPI({
			messages: [{ role: "user", content: "Analyze Apple brand visibility" }],
		});

		// Check artifact creation
		const artifacts = await getArtifacts(testUserId);
		expect(artifacts).toHaveLength(1);
		expect(artifacts[0].type).toBe("visibility-matrix");
		expect(artifacts[0].metadata.brandName).toBe("Apple");
	});

	test("handles tool errors gracefully", async () => {
		// Mock API failure
		jest
			.spyOn(MultiModelClient.prototype, "queryAllModels")
			.mockRejectedValue(new Error("API Error"));

		const response = await testChatAPI({
			messages: [
				{ role: "user", content: "Check brand visibility for TestBrand" },
			],
		});

		expect(response.content).toContain("unable to analyze");
		expect(response.artifacts).toHaveLength(0);
	});
});
```

### End-to-End Tests

```typescript
describe("Complete User Journey", () => {
	test("user can ask about brand visibility and see results", async () => {
		// Simulate user typing in chat
		const chatInput = screen.getByPlaceholderText("Message...");
		await user.type(
			chatInput,
			"Show my Nike brand visibility across AI models"
		);
		await user.click(screen.getByRole("button", { name: "Send" }));

		// Wait for loading and tool execution
		expect(
			screen.getByText("Analyzing brand visibility...")
		).toBeInTheDocument();

		// Wait for results
		await waitFor(() => {
			expect(
				screen.getByText("Brand Visibility Analysis - Nike")
			).toBeInTheDocument();
		});

		// Check artifact rendering
		expect(screen.getByText("Overall Visibility Score")).toBeInTheDocument();
		expect(screen.getByText("ChatGPT")).toBeInTheDocument();
		expect(screen.getByText("Claude")).toBeInTheDocument();
		expect(screen.getByText("Gemini")).toBeInTheDocument();
	});
});
```

### Error Handling Tests

```typescript
describe("Error Handling", () => {
	test("handles brand name extraction failure");
	test("handles partial model failures");
	test("handles tool timeout scenarios");
	test("handles artifact rendering errors");
	test("provides helpful error messages");
});
```

## 🔗 Dependencies

- **Requires**: GEO-002 (Tool), GEO-003 (Artifact Component)
- **External**: Existing chat API, Vercel AI SDK, database
- **Internal**: Artifact system, conversation management

## 📊 Performance Requirements

- **Total Response Time**: < 15 seconds (tool execution + rendering)
- **Artifact Render Time**: < 1 second after data received
- **Database Operations**: < 500ms for artifact persistence
- **Memory Usage**: < 20MB additional during tool execution

## 🔍 Definition of Ready

- [ ] GEO-002 (Visibility Scanner Tool) is completed and tested
- [ ] GEO-003 (Visibility Matrix Artifact) is completed and tested
- [ ] Existing chat system structure is understood
- [ ] Artifact registration process is documented

## ✅ Definition of Done

- [ ] Tool is registered and discoverable in chat
- [ ] Natural language queries trigger tool correctly
- [ ] Artifacts generate and display properly
- [ ] Conversation history includes persistent artifacts
- [ ] Error handling provides good user experience
- [ ] Loading states are informative and smooth
- [ ] Integration tests pass for all scenarios
- [ ] End-to-end user journey works flawlessly
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] Database artifact persistence working

## 🚀 Demo Preparation

```typescript
// Demo scenarios to test
const demoScenarios = [
	{
		query: "Show my Tesla brand visibility across AI models",
		expectedBrand: "Tesla",
		expectedArtifact: "visibility-matrix",
	},
	{
		query: "How does Apple appear in ChatGPT, Claude, and Gemini?",
		expectedBrand: "Apple",
		expectedArtifact: "visibility-matrix",
	},
	{
		query: "Analyze Nike's presence across AI platforms",
		expectedBrand: "Nike",
		expectedArtifact: "visibility-matrix",
	},
];
```

## 📝 Notes

- Focus on smooth user experience during demo
- Ensure error messages guide users toward successful queries
- Consider adding query suggestions for discoverability
- Test with various brand name formats and styles

## 🔄 Follow-up Tasks

- **GEO-005**: Add Firecrawl web monitoring integration
- **GEO-021**: Implement query suggestions (future sprint)
- **GEO-022**: Add conversation context awareness (future sprint)
