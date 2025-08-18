# GEO-003: Visibility Matrix Artifact Component

## 📋 Ticket Overview

**Type**: Frontend Development **Priority**: P0 (Blocker) **Story Points**: 2
**Estimated Time**: 2 hours **Assignee**: [Developer Name] **Sprint**: Sprint 1,
Day 1 **Dependencies**: GEO-002 (Visibility Scanner Tool)

## 🎯 User Story

As a **business executive**, I want to **see a professional visualization of my
brand's visibility across AI models** so that I can **make informed strategic
decisions and present findings to stakeholders**.

## 📝 Description

Create a sophisticated React component that visualizes multi-model brand
visibility data in a professional, business-ready format. This artifact will be
the primary output of the visibility scanner tool and must be suitable for
presentations and strategic decision-making.

## 🎨 Acceptance Criteria

### Visual Requirements

- [ ] **AC1**: Displays brand name prominently at the top
- [ ] **AC2**: Shows overall visibility score with visual indicator
      (gauge/progress bar)
- [ ] **AC3**: Individual model scores displayed clearly (ChatGPT, Claude,
      Gemini)
- [ ] **AC4**: Color-coded performance indicators (green/yellow/red)
- [ ] **AC5**: Sentiment analysis visualization for each model
- [ ] **AC6**: Timestamp and timeframe clearly displayed
- [ ] **AC7**: Professional styling suitable for business presentations
- [ ] **AC8**: Responsive design works on desktop, tablet, and mobile

### Interactive Requirements

- [ ] **AC9**: Hover states show additional details
- [ ] **AC10**: Model names are clickable for expanded view
- [ ] **AC11**: Copy/export functionality available
- [ ] **AC12**: Smooth animations for data loading
- [ ] **AC13**: Loading states during data fetching

### Data Display Requirements

- [ ] **AC14**: Insights section with bullet points
- [ ] **AC15**: Recommendations section with actionable items
- [ ] **AC16**: Comparison indicators showing relative performance
- [ ] **AC17**: Handles edge cases (no data, errors, partial data)
- [ ] **AC18**: Graceful degradation for missing information

### Technical Requirements

- [ ] **AC19**: Uses existing design system components (Radix UI, Tailwind)
- [ ] **AC20**: TypeScript interfaces for all props
- [ ] **AC21**: Integrates with existing artifact rendering system
- [ ] **AC22**: Performance optimized (renders in <500ms)
- [ ] **AC23**: Accessibility compliant (WCAG 2.1 AA)

## 🛠️ Technical Implementation

### File Structure

```
components/
├── artifacts/
│   └── geo-artifacts/
│       ├── visibility-matrix.tsx           # Main component
│       ├── model-score-card.tsx           # Individual model display
│       ├── overall-score-gauge.tsx        # Overall score visualization
│       ├── insights-section.tsx           # Insights display
│       ├── recommendations-list.tsx       # Recommendations display
│       └── types.ts                       # TypeScript interfaces
├── __tests__/
│   └── visibility-matrix.test.tsx         # Unit tests
```

### Component Architecture

```typescript
interface VisibilityMatrixProps {
  data: VisibilityAnalysisResult;
  className?: string;
  showExportOptions?: boolean;
  onModelClick?: (model: string) => void;
}

export function VisibilityMatrix({ data, className, ...props }: VisibilityMatrixProps) {
  return (
    <Card className={cn("w-full max-w-5xl", className)}>
      <CardHeader>
        <VisibilityMatrixHeader data={data} />
      </CardHeader>
      <CardContent className="space-y-6">
        <OverallScoreSection data={data} />
        <ModelComparisonSection data={data} onModelClick={props.onModelClick} />
        <InsightsSection insights={data.insights} />
        <RecommendationsSection recommendations={data.recommendations} />
      </CardContent>
    </Card>
  );
}
```

### Visual Components

#### 1. Overall Score Gauge

```typescript
function OverallScoreGauge({ score, maxScore = 100 }: { score: number; maxScore?: number }) {
  const percentage = (score / maxScore) * 100;
  const color = percentage > 70 ? 'green' : percentage > 40 ? 'yellow' : 'red';

  return (
    <div className="relative w-32 h-32">
      {/* Circular progress indicator */}
      <Progress value={percentage} className={`text-${color}-500`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{score}</span>
      </div>
    </div>
  );
}
```

#### 2. Model Score Cards

```typescript
function ModelScoreCard({ result }: { result: ModelResult }) {
  const sentimentColor = {
    positive: 'text-green-600',
    neutral: 'text-gray-600',
    negative: 'text-red-600'
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">{result.model}</h4>
        <Badge variant={result.visibility_score > 50 ? 'default' : 'secondary'}>
          {result.visibility_score}/100
        </Badge>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mentions:</span>
          <span className="font-medium">{result.mentions}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sentiment:</span>
          <span className={sentimentColor[result.sentiment]}>{result.sentiment}</span>
        </div>
        <Progress value={result.visibility_score} className="h-2" />
      </div>
    </Card>
  );
}
```

#### 3. Insights Section

```typescript
function InsightsSection({ insights }: { insights: string[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <LightbulbIcon className="w-5 h-5 text-yellow-500" />
        Key Insights
      </h3>
      <ul className="space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### 4. Recommendations List

```typescript
function RecommendationsList({ recommendations }: { recommendations: string[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <TargetIcon className="w-5 h-5 text-blue-500" />
        Recommendations
      </h3>
      <div className="grid gap-2">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <ArrowRightIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{recommendation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🎨 Design Specifications

### Color Palette

```css
:root {
	--visibility-high: #10b981; /* Green for scores > 70 */
	--visibility-medium: #f59e0b; /* Yellow for scores 40-70 */
	--visibility-low: #ef4444; /* Red for scores < 40 */
	--sentiment-positive: #059669;
	--sentiment-neutral: #6b7280;
	--sentiment-negative: #dc2626;
}
```

### Typography

```css
.visibility-matrix {
	--font-heading: "Inter", sans-serif;
	--font-body: "Inter", sans-serif;
	--font-mono: "JetBrains Mono", monospace;
}
```

### Responsive Breakpoints

```css
/* Mobile: Single column layout */
@media (max-width: 768px) {
	.model-grid {
		grid-template-columns: 1fr;
	}
}

/* Tablet: Two column layout */
@media (min-width: 769px) and (max-width: 1024px) {
	.model-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

/* Desktop: Three column layout */
@media (min-width: 1025px) {
	.model-grid {
		grid-template-columns: repeat(3, 1fr);
	}
}
```

## 🧪 Testing Strategy (skip all unit/integration/feature testing implementation)

### Unit Tests

```typescript
describe("VisibilityMatrix", () => {
	test("renders with complete data");
	test("handles missing model results");
	test("displays correct score colors");
	test("shows proper sentiment indicators");
	test("renders insights and recommendations");
	test("handles click events correctly");
});
```

### Visual Regression Tests

```typescript
describe("VisibilityMatrix Visual", () => {
	test("matches snapshot for high visibility score");
	test("matches snapshot for low visibility score");
	test("matches snapshot for mobile layout");
	test("matches snapshot for error state");
});
```

### Accessibility Tests

```typescript
describe("VisibilityMatrix Accessibility", () => {
	test("has proper ARIA labels");
	test("supports keyboard navigation");
	test("has sufficient color contrast");
	test("works with screen readers");
});
```

## 🔗 Dependencies

- **Requires**: GEO-002 (Visibility Scanner Tool) for data structure
- **External**: Radix UI components, Tailwind CSS, Lucide icons
- **Internal**: Existing artifact rendering system, Card components

## 📊 Performance Requirements

- **Render Time**: < 500ms for complete visualization
- **Memory Usage**: < 10MB for component tree
- **Bundle Size**: < 50KB additional to existing artifacts
- **Animation Performance**: 60fps for all transitions

## 🔍 Definition of Ready

- [ ] GEO-002 (Visibility Scanner Tool) provides data structure
- [ ] Design system components available (Card, Badge, Progress)
- [ ] Icon library accessible (Lucide React)
- [ ] Responsive design patterns established

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Component renders correctly with real data
- [ ] Responsive design tested on all device sizes
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Unit tests defined (implementation backlogged)
- [ ] Visual regression tests passing
- [ ] Performance benchmarks met
- [ ] Integration with artifact system working
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful
- [ ] Storybook documentation added (if available)

## 🚀 Integration Checklist

- [ ] Component registered in artifact type mapping
- [ ] Props interface matches tool output structure
- [ ] Export functionality implemented
- [ ] Print styles optimized for presentations
- [ ] Error boundaries handle edge cases

## 📝 Notes

- Focus on business presentation quality
- Ensure charts are colorblind-friendly
- Consider data export options for Excel/PowerPoint
- Design for extensibility (future metrics additions)

## 🔄 Follow-up Tasks

- **GEO-004**: Integrate with chat system for display
- **GEO-019**: Add export to PDF functionality (future sprint)
- **GEO-020**: Add drill-down capabilities (future sprint)
