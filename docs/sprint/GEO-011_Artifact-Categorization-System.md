# GEO-011: Artifact Categorization System

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P1 (Important) **Story Points**: 1
**Estimated Time**: 1 hour **Assignee**: [Developer Name] **Sprint**: Sprint 1,
Day 3 **Dependencies**: GEO-009 (Competitive Intelligence Tool), GEO-010
(Content Optimization Tool)

## 🎯 User Story

As a **user**, I want my **artifacts to be automatically categorized and
organized** so that I can **easily find and reference my GEO intelligence
insights later**.

## 📝 Description

Create an intelligent artifact categorization system that automatically tags
artifacts based on their content, type, and context. This system will enable
future dashboard organization and improve the user experience by making
artifacts easily discoverable and searchable.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Automatically categorizes artifacts by type (visibility,
      competitive, content, etc.)
- [ ] **AC2**: Tags artifacts with relevant keywords and topics
- [ ] **AC3**: Assigns priority levels based on content importance
- [ ] **AC4**: Links related artifacts together
- [ ] **AC5**: Stores categorization metadata in database
- [ ] **AC6**: Handles edge cases (unknown types, missing data, etc.)
- [ ] **AC7**: Provides search and filter capabilities
- [ ] **AC8**: Integrates with existing artifact creation process

### Data Structure Requirements

- [ ] **AC9**: Extends artifact schema with categorization fields
- [ ] **AC10**: Stores tags, categories, and metadata
- [ ] **AC11**: Maintains artifact relationships
- [ ] **AC12**: Tracks categorization confidence scores
- [ ] **AC13**: Supports future dashboard organization
- [ ] **AC14**: Enables advanced search functionality

### Integration Requirements

- [ ] **AC15**: Works with all existing artifact types
- [ ] **AC16**: Integrates with artifact creation pipeline
- [ ] **AC17**: Supports real-time categorization
- [ ] **AC18**: Maintains backward compatibility
- [ ] **AC19**: Provides API for categorization queries
- [ ] **AC20**: Enables future dashboard integration

## 🛠️ Technical Implementation

### File Structure

```
lib/
├── artifacts/
│   ├── categorization/
│   │   ├── artifact-categorizer.ts    # Main categorization logic
│   │   ├── category-mapper.ts         # Category mapping rules
│   │   ├── tag-extractor.ts           # Tag extraction logic
│   │   └── relationship-detector.ts   # Artifact relationship detection
│   └── types.ts                       # Updated artifact types
├── db/
│   └── schema.ts                      # Extended schema
├── __tests__/
│   └── artifact-categorization.test.ts # Unit tests
```

### Database Schema Extension

```sql
-- Extend existing artifacts table
ALTER TABLE artifacts ADD COLUMN category VARCHAR(50);
ALTER TABLE artifacts ADD COLUMN tags TEXT[];
ALTER TABLE artifacts ADD COLUMN priority INTEGER DEFAULT 3;
ALTER TABLE artifacts ADD COLUMN related_artifacts UUID[];
ALTER TABLE artifacts ADD COLUMN categorization_confidence DECIMAL(3,2);

-- Add indexes for categorization
CREATE INDEX idx_artifacts_category ON artifacts(user_id, category);
CREATE INDEX idx_artifacts_tags ON artifacts USING GIN(tags);
CREATE INDEX idx_artifacts_priority ON artifacts(user_id, priority DESC);
```

### Categorization System

```typescript
export class ArtifactCategorizer {
	async categorizeArtifact(artifact: Artifact): Promise<CategorizedArtifact> {
		const category = this.determineCategory(artifact);
		const tags = await this.extractTags(artifact);
		const priority = this.calculatePriority(artifact);
		const relatedArtifacts = await this.findRelatedArtifacts(artifact);
		const confidence = this.calculateConfidence(artifact, category);

		return {
			...artifact,
			category,
			tags,
			priority,
			relatedArtifacts,
			categorizationConfidence: confidence,
		};
	}

	private determineCategory(artifact: Artifact): string {
		const categoryMap = {
			"visibility-matrix": "brand-visibility",
			"competitive-analysis": "competitive-intelligence",
			"content-optimization": "content-strategy",
			"brand-monitor-report": "brand-monitoring",
			"keyword-strategy-report": "keyword-research",
		};

		return categoryMap[artifact.type] || "general";
	}

	private async extractTags(artifact: Artifact): Promise<string[]> {
		const tags = new Set<string>();

		// Extract brand names
		if (artifact.content.brandName) {
			tags.add(artifact.content.brandName.toLowerCase());
		}

		// Extract platforms
		if (artifact.content.platformResults) {
			artifact.content.platformResults.forEach((result) => {
				tags.add(result.model.toLowerCase());
			});
		}

		// Extract keywords
		if (artifact.content.targetKeywords) {
			artifact.content.targetKeywords.forEach((keyword) => {
				tags.add(keyword.toLowerCase());
			});
		}

		// Extract industry
		if (artifact.content.industry) {
			tags.add(artifact.content.industry.toLowerCase());
		}

		return Array.from(tags);
	}

	private calculatePriority(artifact: Artifact): number {
		let priority = 3; // Default medium priority

		// High priority for competitive analysis
		if (artifact.type === "competitive-analysis") priority = 1;

		// High priority for visibility reports
		if (artifact.type === "visibility-matrix") priority = 1;

		// Medium priority for content optimization
		if (artifact.type === "content-optimization") priority = 2;

		// Adjust based on content importance
		if (artifact.content.overallScore > 80)
			priority = Math.max(1, priority - 1);
		if (artifact.content.overallScore < 40)
			priority = Math.min(5, priority + 1);

		return priority;
	}

	private async findRelatedArtifacts(artifact: Artifact): Promise<string[]> {
		const relatedArtifacts: string[] = [];

		// Find artifacts with same brand
		if (artifact.content.brandName) {
			const brandArtifacts = await this.findArtifactsByBrand(
				artifact.content.brandName
			);
			relatedArtifacts.push(...brandArtifacts.map((a) => a.id));
		}

		// Find artifacts with same category
		const categoryArtifacts = await this.findArtifactsByCategory(
			artifact.category
		);
		relatedArtifacts.push(...categoryArtifacts.map((a) => a.id));

		return [...new Set(relatedArtifacts)]; // Remove duplicates
	}

	private calculateConfidence(artifact: Artifact, category: string): number {
		let confidence = 0.8; // Base confidence

		// Higher confidence for well-structured data
		if (
			artifact.content.brandName &&
			artifact.content.overallScore !== undefined
		) {
			confidence += 0.1;
		}

		// Lower confidence for unknown categories
		if (category === "general") {
			confidence -= 0.2;
		}

		return Math.min(1.0, Math.max(0.0, confidence));
	}
}
```

### Integration with Artifact Creation

```typescript
// lib/artifacts/artifact-processor.ts (enhancement)
export class ArtifactProcessor {
	private categorizer = new ArtifactCategorizer();

	async processToolResult(
		toolName: string,
		result: any,
		context: ConversationContext
	): Promise<Artifact> {
		// Create base artifact
		const artifact = await this.createBaseArtifact(toolName, result, context);

		// Categorize artifact
		const categorizedArtifact =
			await this.categorizer.categorizeArtifact(artifact);

		// Save to database with categorization
		await this.saveCategorizedArtifact(categorizedArtifact);

		return categorizedArtifact;
	}
}
```

## 🧪 Testing Strategy (skip all unit/integration/feature testing implementation)

### Unit Tests

```typescript
describe("ArtifactCategorizer", () => {
	test("should categorize visibility artifacts correctly");
	test("should extract relevant tags from artifacts");
	test("should calculate appropriate priority levels");
	test("should find related artifacts");
	test("should calculate confidence scores");
	test("should handle edge cases gracefully");
	test("should maintain data integrity");
});
```

### Integration Tests

```typescript
describe("Artifact Categorization Integration", () => {
	test("should integrate with artifact creation pipeline");
	test("should store categorization data in database");
	test("should support search and filtering");
	test("should maintain backward compatibility");
});
```

### Test Scenarios

```typescript
const testScenarios = [
	{
		name: "Visibility artifact categorization",
		artifact: {
			type: "visibility-matrix",
			content: { brandName: "Tesla", overallScore: 85 },
		},
		expectedCategory: "brand-visibility",
		expectedTags: ["tesla", "chatgpt", "claude", "gemini"],
		expectedPriority: 1,
	},
	{
		name: "Competitive analysis categorization",
		artifact: {
			type: "competitive-analysis",
			content: { primaryBrand: "Apple", competitors: ["Samsung", "Google"] },
		},
		expectedCategory: "competitive-intelligence",
		expectedTags: ["apple", "samsung", "google"],
		expectedPriority: 1,
	},
	{
		name: "Content optimization categorization",
		artifact: {
			type: "content-optimization",
			content: { targetKeywords: ["AI", "automation"], contentType: "blog" },
		},
		expectedCategory: "content-strategy",
		expectedTags: ["ai", "automation", "blog"],
		expectedPriority: 2,
	},
];
```

## 🔗 Dependencies

- **Requires**: GEO-009 (Competitive Intelligence Tool), GEO-010 (Content
  Optimization Tool)
- **External**: Database schema updates
- **Internal**: Existing artifact system, database queries

## 📊 Performance Requirements

- **Categorization Time**: < 500ms per artifact
- **Database Operations**: < 200ms for categorization queries
- **Memory Usage**: < 10MB for categorization processing
- **Concurrent Usage**: Support 50+ simultaneous categorizations

## 🔍 Definition of Ready

- [ ] GEO-009 (Competitive Intelligence Tool) is completed and tested
- [ ] GEO-010 (Content Optimization Tool) is completed and tested
- [ ] Database schema extension is planned
- [ ] Categorization rules are defined

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Categorization system integrates with artifact creation
- [ ] Database schema updated and migrated
- [ ] Search and filter functionality working
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests with artifact pipeline passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful
- [ ] Documentation includes usage examples

## 🚀 Usage Examples

### Automatic Categorization

```typescript
// Artifact is automatically categorized during creation
const artifact = await artifactProcessor.processToolResult(
	"visibility_across_models",
	visibilityResult,
	context
);

// Result includes categorization data
console.log(artifact.category); // 'brand-visibility'
console.log(artifact.tags); // ['tesla', 'chatgpt', 'claude', 'gemini']
console.log(artifact.priority); // 1
```

### Search and Filter

```typescript
// Find all visibility artifacts for Tesla
const teslaArtifacts = await findArtifacts({
	tags: ["tesla"],
	category: "brand-visibility",
});

// Find high-priority competitive analysis
const highPriorityCompetitive = await findArtifacts({
	category: "competitive-intelligence",
	priority: 1,
});
```

## 📝 Notes

- Focus on automatic categorization without user intervention
- Ensure categorization is accurate and consistent
- Design for extensibility (future artifact types)
- Consider performance implications for large artifact collections

## 🔄 Follow-up Tasks

- **GEO-012**: Demo Preparation & QA
- **GEO-027**: Add advanced search functionality (future sprint)
- **GEO-028**: Implement artifact recommendations (future sprint)
