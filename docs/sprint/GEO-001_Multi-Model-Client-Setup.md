# GEO-001: Multi-Model Client Setup

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P0 (Blocker) **Story Points**: 2
**Estimated Time**: 2 hours **Assignee**: [Developer Name] **Sprint**: Sprint 1,
Day 1

## 🎯 User Story

As a **GEO analyst**, I want to **query multiple AI models simultaneously** so
that I can **get comprehensive brand visibility analysis across all major AI
platforms**.

## 📝 Description

Create a robust multi-model client that can query ChatGPT, Claude, and Gemini in
parallel to analyze brand visibility. This foundational component will power all
multi-model analysis tools.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Client can query OpenAI GPT-4 successfully
- [ ] **AC2**: Client can query Anthropic Claude successfully
- [ ] **AC3**: Client can query Google Gemini successfully
- [ ] **AC4**: All three models are queried in parallel (not sequential)
- [ ] **AC5**: Brand mention counting algorithm works accurately
- [ ] **AC6**: Sentiment analysis provides correct positive/neutral/negative
      classification
- [ ] **AC7**: Visibility scoring algorithm returns scores between 0-100
- [ ] **AC8**: Error handling gracefully manages failed model requests
- [ ] **AC9**: Response aggregation combines all model results correctly

### Technical Requirements

- [ ] **AC10**: TypeScript interfaces defined for all data structures
- [ ] **AC11**: Proper error types and handling for API failures
- [ ] **AC12**: Rate limiting considerations implemented
- [ ] **AC13**: Response time under 10 seconds for 3-model query
- [ ] **AC14**: Memory usage stays under 50MB during execution

### Quality Requirements

- [ ] **AC15**: Unit tests cover all major functions (>80% coverage)
- [ ] **AC16**: Integration test with real API calls works
- [ ] **AC17**: Code follows existing project patterns and conventions
- [ ] **AC18**: No TypeScript errors or warnings
- [ ] **AC19**: Proper logging for debugging and monitoring

## 🛠️ Technical Implementation

### File Structure

```
lib/
├── data-sources/
│   ├── multi-model-client.ts          # Main client class
│   ├── types.ts                       # TypeScript interfaces
│   └── utils.ts                       # Helper functions
├── __tests__/
│   └── multi-model-client.test.ts     # Unit tests
```

### Key Components

#### 1. MultiModelClient Class

```typescript
export class MultiModelClient {
	async queryAllModels(
		brandName: string,
		queries: string[]
	): Promise<ModelResult[]>;
	private async queryModel(model: any, query: string): Promise<string>;
	private countBrandMentions(text: string, brandName: string): number;
	private analyzeSentiment(text: string, brandName: string): SentimentType;
	private calculateVisibilityScore(text: string, brandName: string): number;
}
```

#### 2. Data Interfaces

```typescript
interface ModelResult {
	model: string;
	response: string;
	mentions: number;
	context: string[];
	sentiment: "positive" | "neutral" | "negative";
	visibility_score: number;
	execution_time: number;
	success: boolean;
}
```

#### 3. Error Handling

```typescript
class ModelQueryError extends Error {
	constructor(
		public model: string,
		public cause: string
	) {
		super(`Failed to query ${model}: ${cause}`);
	}
}
```

## 🧪 Testing Strategy (skip all unit/integration/feature testing implementation)

### Unit Tests

```typescript
describe("MultiModelClient", () => {
	test("should query all models in parallel");
	test("should handle individual model failures gracefully");
	test("should calculate visibility scores correctly");
	test("should analyze sentiment accurately");
	test("should count brand mentions correctly");
});
```

### Integration Tests

```typescript
describe("MultiModelClient Integration", () => {
	test("should work with real OpenAI API");
	test("should work with real Anthropic API");
	test("should work with real Google API");
	test("should handle rate limiting appropriately");
});
```

### Test Data

```typescript
const testCases = [
	{
		brandName: "Tesla",
		expectedMentions: 2,
		expectedSentiment: "positive",
		expectedScoreRange: [70, 90],
	},
	{
		brandName: "Unknown Brand XYZ",
		expectedMentions: 0,
		expectedSentiment: "neutral",
		expectedScoreRange: [0, 20],
	},
];
```

## 🔗 Dependencies

- **External**: OpenAI SDK, Anthropic SDK, Google AI SDK
- **Internal**: Existing AI configuration and providers
- **Blockers**: API keys must be configured in environment

## 📊 Performance Requirements

- **Response Time**: < 10 seconds for 3-model parallel query
- **Memory Usage**: < 50MB during execution
- **Success Rate**: > 95% for individual model queries
- **Concurrent Requests**: Support 5+ simultaneous brand analyses

## 🔍 Definition of Ready

- [ ] API keys for all three providers are available
- [ ] Existing AI SDK setup is functional
- [ ] Development environment is configured
- [ ] Test brand names and scenarios are defined

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Code review completed and approved
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests with real APIs passing
- [ ] Performance benchmarks met
- [ ] Error handling tested with various failure scenarios
- [ ] TypeScript compilation successful with no errors
- [ ] Documentation updated with usage examples
- [ ] Code committed to feature branch

## 🚀 Deployment Checklist

- [ ] Environment variables configured for all API keys
- [ ] Rate limiting settings appropriate for API tiers
- [ ] Logging configured for monitoring and debugging
- [ ] Error tracking setup for production monitoring

## 📝 Notes

- Start with simple sentiment analysis (keyword-based)
- Focus on parallel execution to minimize response time
- Ensure graceful degradation if one model fails
- Consider caching for repeated queries (future enhancement)

## 🔄 Follow-up Tasks

- **GEO-002**: Integrate with Visibility Scanner Tool
- **GEO-015**: Add advanced sentiment analysis (future sprint)
- **GEO-016**: Implement intelligent caching (future sprint)
