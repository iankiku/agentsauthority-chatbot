# GEO-204: Brand Detection Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P1 (Important) **Story Points**: 6  
**Estimated Time**: 10 hours **Assignee**: [Developer Name] **Sprint**: Sprint
2, Phase 2A  
**Dependencies**: None

## 🎯 User Story

As a **GEO analyst**, I want **advanced brand mention detection** so that I can
**accurately identify brand references in AI responses**.

## 📝 Description

Create an advanced brand mention detection tool that accurately identifies brand
references in text with high precision (>95%). This tool will handle brand name
variations, aliases, provide context around mentions, calculate confidence
scores, and support multiple languages and formats.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Detects brand mentions with high accuracy (>95%)
- [ ] **AC2**: Handles brand name variations and aliases
- [ ] **AC3**: Provides context around brand mentions
- [ ] **AC4**: Calculates mention confidence scores
- [ ] **AC5**: Supports multiple languages and formats
- [ ] **AC6**: Integrates with sentiment analysis

### Data Structure Requirements

- [ ] **AC7**: Returns array of brand mentions with text, confidence, context
- [ ] **AC8**: Includes sentiment analysis for each mention
- [ ] **AC9**: Provides mention type classification (direct, indirect,
      reference)
- [ ] **AC10**: Includes position and frequency information
- [ ] **AC11**: Tags mentions for categorization and analysis
- [ ] **AC12**: Handles edge cases (abbreviations, misspellings, variations)

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
// lib/ai/tools/brand-detection-tool.ts
export const brandDetectionTool = tool({
	description: "Advanced brand mention detection with context analysis",
	inputSchema: z.object({
		text: z.string().min(1).max(10000),
		brandName: z.string().min(1).max(100),
		brandAliases: z.array(z.string()).optional(),
		language: z.enum(["en", "es", "fr", "de", "auto"]).default("auto"),
		detectionMode: z
			.enum(["exact", "fuzzy", "semantic", "comprehensive"])
			.default("comprehensive"),
		includeContext: z.boolean().default(true),
		minConfidence: z.number().min(0).max(1).default(0.7),
	}),
	handler: async (ctx, args) => {
		const {
			text,
			brandName,
			brandAliases,
			language,
			detectionMode,
			includeContext,
			minConfidence,
		} = args;

		try {
			// Step 1: Preprocess text and normalize brand names
			const normalizedText = await preprocessText(text, language);
			const normalizedBrandNames = await normalizeBrandNames(
				brandName,
				brandAliases
			);

			// Step 2: Perform brand detection based on mode
			const detectedMentions = await detectBrandMentions(
				normalizedText,
				normalizedBrandNames,
				detectionMode
			);

			// Step 3: Extract context for each mention
			const mentionsWithContext = includeContext
				? await extractMentionContext(detectedMentions, normalizedText)
				: detectedMentions;

			// Step 4: Analyze sentiment for each mention
			const mentionsWithSentiment =
				await analyzeMentionSentiment(mentionsWithContext);

			// Step 5: Calculate confidence scores
			const scoredMentions = await calculateMentionConfidence(
				mentionsWithSentiment
			);

			// Step 6: Filter by confidence threshold
			const filteredMentions = scoredMentions.filter(
				(mention) => mention.confidence >= minConfidence
			);

			// Step 7: Categorize and classify mentions
			const categorizedMentions = await categorizeMentions(filteredMentions);

			return {
				brandName,
				originalText: text,
				detectionMode,
				mentions: categorizedMentions,
				summary: {
					totalMentions: categorizedMentions.length,
					uniqueMentions: new Set(categorizedMentions.map((m) => m.text)).size,
					averageConfidence:
						categorizedMentions.reduce((sum, m) => sum + m.confidence, 0) /
						categorizedMentions.length,
					sentimentDistribution:
						calculateSentimentDistribution(categorizedMentions),
					mentionTypes: calculateMentionTypeDistribution(categorizedMentions),
				},
				metadata: {
					language: language,
					textLength: text.length,
					processingTime: Date.now(),
					category: "brand-detection",
				},
			};
		} catch (error) {
			throw new Error(`Brand detection failed: ${error.message}`);
		}
	},
});
```

### Response Data Structure

```typescript
interface BrandDetectionResult {
	brandName: string;
	originalText: string;
	detectionMode: "exact" | "fuzzy" | "semantic" | "comprehensive";
	mentions: Array<{
		text: string;
		brandName: string;
		confidence: number;
		context: string;
		sentiment: "positive" | "neutral" | "negative";
		mentionType: "direct" | "indirect" | "reference" | "comparison";
		position: {
			start: number;
			end: number;
			line: number;
		};
		frequency: number;
		variations: string[];
		category: string;
		keyPhrases: string[];
	}>;
	summary: {
		totalMentions: number;
		uniqueMentions: number;
		averageConfidence: number;
		sentimentDistribution: {
			positive: number;
			neutral: number;
			negative: number;
		};
		mentionTypes: {
			direct: number;
			indirect: number;
			reference: number;
			comparison: number;
		};
	};
	metadata: {
		language: string;
		textLength: number;
		processingTime: number;
		category: "brand-detection";
	};
}
```

### Detection Functions

```typescript
async function detectBrandMentions(
	text: string,
	brandNames: string[],
	mode: string
): Promise<BrandMention[]> {
	const mentions: BrandMention[] = [];

	switch (mode) {
		case "exact":
			mentions.push(...(await exactMatchDetection(text, brandNames)));
			break;
		case "fuzzy":
			mentions.push(...(await fuzzyMatchDetection(text, brandNames)));
			break;
		case "semantic":
			mentions.push(...(await semanticDetection(text, brandNames)));
			break;
		case "comprehensive":
			mentions.push(...(await exactMatchDetection(text, brandNames)));
			mentions.push(...(await fuzzyMatchDetection(text, brandNames)));
			mentions.push(...(await semanticDetection(text, brandNames)));
			break;
	}

	return deduplicateMentions(mentions);
}

async function extractMentionContext(
	mentions: BrandMention[],
	text: string
): Promise<BrandMention[]> {
	return mentions.map((mention) => {
		const contextWindow = 200; // characters before and after
		const start = Math.max(0, mention.position.start - contextWindow);
		const end = Math.min(text.length, mention.position.end + contextWindow);
		const context = text.substring(start, end);

		return {
			...mention,
			context: context.trim(),
		};
	});
}

async function analyzeMentionSentiment(
	mentions: BrandMention[]
): Promise<BrandMention[]> {
	return Promise.all(
		mentions.map(async (mention) => {
			const sentiment = await analyzeTextSentiment(
				mention.context || mention.text
			);
			return {
				...mention,
				sentiment,
			};
		})
	);
}

async function calculateMentionConfidence(
	mentions: BrandMention[]
): Promise<BrandMention[]> {
	return mentions.map((mention) => {
		let confidence = 0;

		// Base confidence from detection method
		if (mention.detectionMethod === "exact") confidence += 0.8;
		else if (mention.detectionMethod === "fuzzy") confidence += 0.6;
		else if (mention.detectionMethod === "semantic") confidence += 0.7;

		// Adjust based on context quality
		if (mention.context && mention.context.length > 50) confidence += 0.1;

		// Adjust based on mention frequency
		if (mention.frequency > 1) confidence += 0.05;

		// Adjust based on text quality
		if (mention.text.length > 2) confidence += 0.05;

		return {
			...mention,
			confidence: Math.min(confidence, 1.0),
		};
	});
}
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("brandDetectionTool", () => {
	test("should detect exact brand mentions with high accuracy");
	test("should handle brand name variations and aliases");
	test("should provide context around brand mentions");
	test("should calculate accurate confidence scores");
	test("should support multiple languages");
	test("should integrate with sentiment analysis");
	test("should handle edge cases (abbreviations, misspellings)");
	test("should filter by confidence threshold");
	test("should categorize mentions correctly");
	test("should return properly structured response");
	test("should validate input parameters correctly");
});
```

### Integration Tests

```typescript
describe("Brand Detection Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with brand monitoring agent");
	test("should handle large text inputs");
	test("should process multiple brand names efficiently");
});
```

## 🔗 Dependencies

- **Requires**: None
- **External**: OpenAI API (for semantic detection), language detection
  libraries
- **Internal**: Text preprocessing utilities, sentiment analysis functions

## 📊 Performance Requirements

- **Response Time**: < 15 seconds for brand detection
- **Data Size**: Response payload < 150 KB
- **Reliability**: > 95% accuracy in brand mention detection
- **Concurrent Usage**: Support 25+ simultaneous executions

## 🔍 Definition of Ready

- [ ] Text preprocessing utilities are available
- [ ] Sentiment analysis functions are implemented
- [ ] Language detection is configured
- [ ] Test scenarios are defined
- [ ] Brand name normalization logic is planned

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] Brand detection accuracy meets requirements (>95%)
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Detect Tesla mentions in this text"
// Tool call with parameters:
{
  text: "Tesla is leading the electric vehicle market. The company's innovative approach has revolutionized the industry.",
  brandName: "Tesla",
  detectionMode: "comprehensive"
}
```

### Advanced Usage

```typescript
// User query: "Find all brand mentions with context and sentiment"
// Tool call with parameters:
{
  text: "Tesla and Ford are competing in the EV space. While Tesla leads in innovation, Ford has strong manufacturing capabilities.",
  brandName: "Tesla",
  brandAliases: ["Tesla Motors", "TSLA"],
  language: "en",
  detectionMode: "comprehensive",
  includeContext: true,
  minConfidence: 0.8
}
```

## 📝 Notes

- Focus on accuracy and precision in brand mention detection
- Implement robust handling of brand name variations
- Consider multilingual support for global brands
- Design for extensibility (future detection methods)
- Ensure efficient processing of large text inputs

## 🔄 Follow-up Tasks

- **GEO-205**: SSE Infrastructure Setup
- **GEO-206**: Visibility Scoring Tool
