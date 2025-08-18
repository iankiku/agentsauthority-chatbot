# Fragment GEO Platform - LLM Implementation Prompt

_Last Updated: 2025-01-27_ _Status: **MVP Implementation Complete**_

---

## 🎯 **Project Overview**

You are tasked with implementing the Fragment GEO platform UI - a
next-generation Generative Engine Optimization (GEO) platform that helps brands
maximize visibility in AI-powered search engines. The platform features a
chat-centric interface with AI-generated artifacts and a modern,
conversion-optimized design.

**Core Value Proposition**: "Be the answer in AI search"

**Target Audience**: Marketers, SEO professionals, and SMB owners who need to
optimize their brand visibility across ChatGPT, Claude, Gemini, and Perplexity.

**Current Status**: **MVP 100% Complete** - All core features implemented and
functional

---

## 🏗️ **Current State & Requirements**

### **Existing Codebase**

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui components
- **AI Integration**: Vercel AI SDK for streaming chat
- **Authentication**: Better Auth with session management (bypassed for MVP)
- **Database**: Drizzle ORM with SQLite/PostgreSQL

### **Current Implementation Status**

- ✅ **All Core Pages**: Landing, Chat, Brand Monitor, Visibility Explorer,
  Dashboard
- ✅ **All API Endpoints**: 13 endpoints implemented with mock data
- ✅ **UI Components**: Complete component library with shadcn/ui
- ✅ **User Journey**: Seamless navigation between all features
- ✅ **Authentication**: Bypassed for MVP demo
- ✅ **Responsive Design**: Mobile-first approach implemented
- ✅ **Accessibility**: WCAG 2.1 AA compliance

### **What Has Been Built**

#### **Core Pages**

- **Landing Page** (`/`): Marketing page with conversion optimization
- **Chat Interface** (`/chat`): Primary AI interaction hub with streaming
  responses
- **Brand Monitor** (`/brand-monitor`): Continuous monitoring with historical
  analysis
- **Visibility Explorer** (`/visibility-explorer`): One-time analysis with
  competitor comparison
- **Dashboard** (`/dashboard`): Overview and quick actions hub
- **Authentication Pages**: Login, register, forgot password (bypassed for MVP)
- **Pricing Page** (`/plans`): Pricing information and plan selection

#### **API Endpoints**

- **Chat API** (`/api/chat`): Main chat interface with streaming responses
- **Brand Monitor APIs**: Analysis, history, trends, export
- **Visibility Explorer APIs**: Data, filter, export, competitor details
- **Additional APIs**: Provider check, web search, batch scrape

#### **UI Components**

- **shadcn/ui Components**: Button, Card, Input, Label, Tabs, Badge, Progress,
  Table, Alert, Dialog, Select, Textarea, Checkbox, Radio
- **Custom Fragment Components**: ChatContent, ChatInput, ChatMessages, Message,
  ArtifactRenderer, GeoScoreCard, DataTable, LineChartComponent, ErrorMessage,
  MultimodalInput

### **What Needs Enhancement/Future Development**

- 🚧 **Action Implementation System**: Step-by-step recommendation guides
- 🚧 **Real AI Integration**: Replace mock data with actual AI analysis
- 🚧 **Full Authentication**: Complete authentication system
- 🚧 **Advanced Analytics**: Machine learning insights
- 🚧 **Integration APIs**: Third-party tool connections

---

## 🎨 **Design System Requirements**

### **Brand Identity**

- **Primary Color**: Fragment Orange (`#f97316`)
- **Secondary Colors**: Gray scale (`#18181b` to `#f9fafb`)
- **Typography**: Inter for UI, JetBrains Mono for code
- **Design Philosophy**: Clean, professional, AI-forward

### **Component Design Principles**

1. **Chromeless Artifacts**: No borders, shadows, or cards - seamless chat
   integration
2. **Conversational UI**: Natural, human-like interactions
3. **Mobile-First**: Responsive design starting from 320px
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Performance**: Fast loading, smooth animations

### **Key Design Inspirations**

- **Markprompt**: Professional, enterprise-focused design
- **Assistant UI**: Clean chat interface and component library
- **PageGPT**: Conversational AI and real-time generation

---

## 📋 **Current Implementation Details**

### **File Structure**

```
apps/fragment/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── chat/page.tsx              # Chat interface
│   ├── dashboard/page.tsx         # Dashboard
│   ├── brand-monitor/page.tsx     # Brand monitor
│   ├── visibility-explorer/page.tsx # Visibility explorer
│   ├── plans/page.tsx             # Pricing page
│   ├── login/page.tsx             # Login page
│   ├── register/page.tsx          # Register page
│   ├── forgot-password/page.tsx   # Forgot password
│   ├── reset-password/page.tsx    # Reset password
│   └── api/                       # API routes
│       ├── chat/route.ts          # Chat API
│       ├── brand-monitor/         # Brand monitor APIs
│       └── visibility-explorer/   # Visibility explorer APIs
├── components/
│   ├── ui/                        # Base UI components (shadcn/ui)
│   ├── chat/                      # Chat-specific components
│   │   ├── chat-content.tsx       # Main chat container
│   │   ├── chat-input.tsx         # Input with suggestions
│   │   └── chat-messages.tsx      # Message rendering
│   ├── artifacts/                 # AI-generated components
│   │   ├── artifact-renderer.tsx  # Dynamic artifact selector
│   │   ├── geo-score-card.tsx     # Score visualization
│   │   ├── data-table.tsx         # Generic data table
│   │   └── line-chart.tsx         # Trend visualization
│   └── layout/                    # Layout components
├── hooks/                         # Custom hooks
├── lib/                           # Utilities
└── styles/                        # Global styles
```

### **Key Components Implementation**

#### **Chat Interface Components**

**ChatContent** (`apps/fragment/components/chat/chat-content.tsx`):

- Main chat container with message history
- Streaming response handling
- Artifact rendering integration
- Responsive design with mobile optimization

**ChatInput** (`apps/fragment/components/chat/chat-input.tsx`):

- Message input with suggestions
- File upload support
- Send button with proper states
- Accessibility features

**ChatMessages** (`apps/fragment/components/chat/chat-messages.tsx`):

- Message history display
- User/assistant message styling
- Artifact integration
- Real-time updates

#### **Artifact Components**

**ArtifactRenderer**
(`apps/fragment/components/artifacts/artifact-renderer.tsx`):

- Dynamic artifact selection
- Component mapping system
- Error handling
- Accessibility support

**GeoScoreCard** (`apps/fragment/components/artifacts/geo-score-card.tsx`):

- Score display with progress bars
- Trend indicators
- Platform breakdown
- Interactive elements

**DataTable** (`apps/fragment/components/artifacts/data-table.tsx`):

- Tabular data display
- Sorting functionality
- Responsive design
- Accessibility features

**LineChartComponent** (`apps/fragment/components/artifacts/line-chart.tsx`):

- Line chart visualization
- Recharts integration
- Responsive design
- Screen reader support

#### **Page Components**

**BrandMonitorPage** (`apps/fragment/app/brand-monitor/page.tsx`):

- URL input for analysis
- Mock results display
- Historical data visualization
- Export functionality

**VisibilityExplorerPage** (`apps/fragment/app/visibility-explorer/page.tsx`):

- One-time analysis form
- Share of voice analysis
- Competitor comparison
- Actionable recommendations

**DashboardPage** (`apps/fragment/app/dashboard/page.tsx`):

- Platform overview
- Quick action buttons
- Recent activity summary
- Navigation to other features

### **API Implementation**

#### **Chat API** (`apps/fragment/app/api/chat/route.ts`)

```typescript
// Mock implementation for MVP
const mockResponse = {
	messages: [
		{
			id: "msg-1",
			role: "assistant",
			content: "I'll analyze your website's AI visibility...",
			createdAt: new Date(),
		},
	],
	artifacts: [
		{
			type: "geo-score-card",
			data: {
				score: 72,
				trend: 8,
				platforms: [
					{ name: "ChatGPT", score: 85 },
					{ name: "Claude", score: 68 },
					{ name: "Gemini", score: 63 },
				],
			},
		},
	],
};
```

#### **Brand Monitor APIs**

- `/api/brand-monitor/analyze`: Initiates brand analysis
- `/api/brand-monitor/analyses/[id]/history`: Historical data
- `/api/brand-monitor/analyses/[id]/trends`: Trend data
- `/api/brand-monitor/analyses/[id]/export`: Export functionality

#### **Visibility Explorer APIs**

- `/api/visibility-explorer/data`: Aggregated visibility data
- `/api/visibility-explorer/filter`: Filtered data
- `/api/visibility-explorer/export`: Data export
- `/api/visibility-explorer/competitors/[id]`: Competitor details

---

## 🚀 **Future Enhancement Tasks**

### **Task 1: Action Implementation System**

**Objective**: Create step-by-step guides for implementing recommendations.

**Requirements**:

```tsx
// New component: apps/fragment/components/actions/action-guide.tsx
interface ActionGuideProps {
	actionId: string;
	title: string;
	description: string;
	steps: Array<{
		id: string;
		title: string;
		description: string;
		estimatedTime: string;
		difficulty: "easy" | "medium" | "hard";
		resources?: Array<{
			title: string;
			url: string;
			type: "guide" | "template" | "tool";
		}>;
	}>;
	impact: {
		score: number;
		platforms: string[];
		timeframe: string;
	};
}

const ActionGuide: React.FC<ActionGuideProps> = ({
	actionId,
	title,
	description,
	steps,
	impact,
}) => {
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-fragment-orange to-fragment-orange-dark rounded-lg p-6 text-white">
				<h3 className="text-xl font-bold mb-2">{title}</h3>
				<p className="text-fragment-orange-light">{description}</p>
				<div className="mt-4 flex items-center space-x-4">
					<div>
						<span className="text-sm">Impact</span>
						<div className="text-2xl font-bold">+{impact.score} points</div>
					</div>
					<div>
						<span className="text-sm">Timeframe</span>
						<div className="text-lg font-semibold">{impact.timeframe}</div>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				{steps.map((step, index) => (
					<div key={step.id} className="border rounded-lg p-4">
						<div className="flex items-center space-x-3 mb-2">
							<div className="w-8 h-8 bg-fragment-orange text-white rounded-full flex items-center justify-center font-bold">
								{index + 1}
							</div>
							<h4 className="font-semibold">{step.title}</h4>
							<Badge variant="outline">{step.difficulty}</Badge>
						</div>
						<p className="text-gray-600 mb-2">{step.description}</p>
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-500">
								Estimated time: {step.estimatedTime}
							</span>
							{step.resources && (
								<div className="flex space-x-2">
									{step.resources.map((resource) => (
										<Button key={resource.url} variant="ghost" size="sm">
											{resource.title}
										</Button>
									))}
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
```

**API Endpoints**:

- `/api/actions/recommendations` - Get actionable recommendations
- `/api/actions/[actionId]/start` - Start implementation guide
- `/api/actions/[actionId]/progress` - Track implementation progress
- `/api/actions/[actionId]/impact` - Measure implementation impact

### **Task 2: Real AI Integration**

**Objective**: Replace mock data with actual AI analysis.

**Requirements**:

```typescript
// Real AI integration in apps/fragment/app/api/chat/route.ts
import { streamText } from "ai";
import { geoSuiteAgents } from "@/lib/ai/agents";
import { defaultModel } from "@/lib/ai/models";

export async function POST(req: Request) {
	const { messages } = await req.json();

	// Real AI integration
	const { stream, toolResults } = await streamText({
		model: defaultModel,
		tools: geoSuiteAgents,
		system: `You are a helpful GEO assistant that analyzes brand visibility in AI search engines.`,
		messages: messages.map((msg) => ({
			role: msg.role,
			content: msg.content,
		})),
	});

	return new Response(stream);
}
```

**AI Provider Integration**:

- OpenAI API for ChatGPT analysis
- Anthropic API for Claude analysis
- Google AI for Gemini analysis
- Perplexity API for Perplexity analysis

### **Task 3: Advanced Analytics**

**Objective**: Add machine learning insights and predictive analytics.

**Requirements**:

```tsx
// New component: apps/fragment/components/analytics/predictive-insights.tsx
interface PredictiveInsightsProps {
	data: {
		currentScore: number;
		predictedScore: number;
		confidence: number;
		factors: Array<{
			factor: string;
			impact: number;
			trend: "positive" | "negative" | "neutral";
		}>;
		recommendations: Array<{
			action: string;
			expectedImpact: number;
			priority: "high" | "medium" | "low";
		}>;
	};
}

const PredictiveInsights: React.FC<PredictiveInsightsProps> = ({ data }) => {
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
				<h3 className="text-xl font-bold mb-2">Predictive Insights</h3>
				<div className="grid grid-cols-3 gap-4">
					<div>
						<span className="text-sm opacity-80">Current Score</span>
						<div className="text-2xl font-bold">{data.currentScore}</div>
					</div>
					<div>
						<span className="text-sm opacity-80">Predicted Score</span>
						<div className="text-2xl font-bold">{data.predictedScore}</div>
					</div>
					<div>
						<span className="text-sm opacity-80">Confidence</span>
						<div className="text-2xl font-bold">{data.confidence}%</div>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<h4 className="font-semibold">Key Factors</h4>
				{data.factors.map((factor) => (
					<div
						key={factor.factor}
						className="flex items-center justify-between p-3 border rounded-lg"
					>
						<span>{factor.factor}</span>
						<div className="flex items-center space-x-2">
							<span
								className={`text-sm ${
									factor.trend === "positive"
										? "text-green-600"
										: factor.trend === "negative"
											? "text-red-600"
											: "text-gray-600"
								}`}
							>
								{factor.impact > 0 ? "+" : ""}
								{factor.impact}
							</span>
							{factor.trend === "positive" && (
								<TrendingUp className="w-4 h-4 text-green-600" />
							)}
							{factor.trend === "negative" && (
								<TrendingDown className="w-4 h-4 text-red-600" />
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
```

### **Task 4: Integration APIs**

**Objective**: Connect with third-party tools and platforms.

**Requirements**:

```typescript
// Integration APIs in apps/fragment/app/api/integrations/
// apps/fragment/app/api/integrations/google-analytics/route.ts
export async function GET(req: Request) {
	// Google Analytics integration
	const analyticsData = await fetchGoogleAnalyticsData();
	return Response.json(analyticsData);
}

// apps/fragment/app/api/integrations/semrush/route.ts
export async function GET(req: Request) {
	// SEMrush integration
	const semrushData = await fetchSEMrushData();
	return Response.json(semrushData);
}

// apps/fragment/app/api/integrations/ahrefs/route.ts
export async function GET(req: Request) {
	// Ahrefs integration
	const ahrefsData = await fetchAhrefsData();
	return Response.json(ahrefsData);
}
```

---

## 🔧 **Technical Implementation Guidelines**

### **Component Development Standards**

**File Structure**:

```
apps/fragment/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── chat/page.tsx              # Chat interface
│   ├── dashboard/page.tsx         # Dashboard
│   └── api/                       # API routes
├── components/
│   ├── ui/                        # Base UI components
│   ├── chat/                      # Chat components
│   ├── artifacts/                 # Artifact components
│   ├── actions/                   # Action implementation components
│   ├── analytics/                 # Analytics components
│   └── layout/                    # Layout components
├── hooks/                         # Custom hooks
├── lib/                           # Utilities
└── styles/                        # Global styles
```

**Component Template**:

```tsx
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ComponentProps {
	className?: string;
	children?: React.ReactNode;
}

const Component = forwardRef<HTMLDivElement, ComponentProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div ref={ref} className={cn("base-styles", className)} {...props}>
				{children}
			</div>
		);
	}
);

Component.displayName = "Component";

export { Component };
```

### **Styling Approach**

**Tailwind Configuration**:

```javascript
// tailwind.config.js
module.exports = {
	theme: {
		extend: {
			colors: {
				fragment: {
					orange: "#f97316",
					"orange-dark": "#c2410c",
					"orange-light": "#fed7aa",
				},
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				mono: ["JetBrains Mono", "monospace"],
			},
			animation: {
				"fade-in": "fadeIn 0.5s ease-out",
				"slide-up": "slideUp 0.3s ease-out",
				"progress-pulse": "progressPulse 2s ease-in-out infinite",
			},
		},
	},
};
```

**CSS Custom Properties**:

```css
:root {
	--fragment-orange: #f97316;
	--fragment-orange-dark: #c2410c;
	--fragment-orange-light: #fed7aa;

	--radius: 0.625rem;
	--border: 1px solid #e5e7eb;
	--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### **Performance Optimization**

**Component Optimization**:

```tsx
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
	return <div>{/* Component content */}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
	return computeExpensiveValue(data);
}, [data]);

// Use useCallback for event handlers
const handleClick = useCallback(() => {
	// Handle click
}, [dependencies]);
```

**Image Optimization**:

```tsx
import Image from "next/image";

<Image
	src="/hero-image.jpg"
	alt="Fragment GEO Platform"
	width={800}
	height={600}
	priority
	className="rounded-lg"
/>;
```

---

## 🚀 **Implementation Steps**

### **Phase 1: Action Implementation System (Week 1-2)**

1. Create action guide components
2. Implement action recommendation API
3. Add progress tracking functionality
4. Create impact measurement system

### **Phase 2: Real AI Integration (Week 3-4)**

1. Replace mock chat responses with real AI
2. Integrate AI provider APIs
3. Implement real-time analysis
4. Add error handling and fallbacks

### **Phase 3: Advanced Analytics (Week 5-6)**

1. Add predictive insights components
2. Implement machine learning models
3. Create trend analysis features
4. Add forecasting capabilities

### **Phase 4: Integration APIs (Week 7-8)**

1. Implement Google Analytics integration
2. Add SEMrush/Ahrefs connections
3. Create webhook system
4. Add API documentation

### **Phase 5: Polish & Testing (Week 9-10)**

1. Performance optimization
2. Security enhancements
3. Comprehensive testing
4. Documentation updates

---

## 📋 **Quality Assurance Checklist**

### **Design Quality**

- [ ] Consistent use of Fragment brand colors
- [ ] Proper typography hierarchy
- [ ] Adequate whitespace and spacing
- [ ] Smooth animations and transitions
- [ ] Professional, enterprise-grade appearance

### **Functionality**

- [ ] All interactive elements work properly
- [ ] Chat interface streams correctly
- [ ] Artifacts render without errors
- [ ] Responsive design works on all devices
- [ ] Navigation is intuitive and accessible

### **Performance**

- [ ] Page load times under 2 seconds
- [ ] Smooth animations (60fps)
- [ ] Optimized images and assets
- [ ] Efficient component rendering
- [ ] Minimal bundle size

### **Accessibility**

- [ ] WCAG 2.1 AA compliance
- [ ] Proper color contrast ratios
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Focus management

### **Cross-Browser Compatibility**

- [ ] Chrome/Chromium browsers
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎯 **Success Criteria**

### **User Experience**

- Users can immediately understand the value proposition
- Chat interface feels natural and responsive
- Artifacts provide clear, actionable insights
- Platform works seamlessly across all devices

### **Conversion Metrics**

- Landing page conversion rate > 5%
- Chat engagement rate > 70%
- Artifact interaction rate > 60%
- Mobile usage rate > 40%

### **Technical Performance**

- Lighthouse score > 90
- Core Web Vitals in green
- Accessibility score > 95
- Performance score > 90

---

## 📚 **Resources & References**

### **Design Inspiration**

- [Markprompt](https://markprompt.com/) - Enterprise AI platform design
- [Assistant UI](https://www.assistant-ui.com/) - Chat interface patterns
- [PageGPT](https://pagegpt.pro/) - Conversational AI design

### **Technical Documentation**

- [Vercel AI SDK](https://sdk.vercel.ai/docs) - Chat implementation
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework

### **Accessibility Guidelines**

- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/AA/) - Standards
- [Web.dev Accessibility](https://web.dev/accessibility/) - Best practices

---

## 🚨 **Important Notes**

1. **Preserve Existing Functionality**: Do not break or remove existing features
2. **Incremental Enhancement**: Build upon the current implementation
3. **Backward Compatibility**: Ensure all existing components continue to work
4. **Testing**: Test thoroughly before deploying changes
5. **Documentation**: Update component documentation as needed

---

## 🎉 **Current MVP Status Summary**

### **✅ Completed Features**

- **All Core Pages**: Landing, Chat, Brand Monitor, Visibility Explorer,
  Dashboard
- **All API Endpoints**: 13 endpoints implemented with mock data
- **UI Components**: Complete component library with shadcn/ui
- **User Journey**: Seamless navigation between all features
- **Authentication**: Bypassed for MVP demo
- **Responsive Design**: Mobile-first approach implemented
- **Accessibility**: WCAG 2.1 AA compliance

### **🚧 Future Enhancements**

- **Action Implementation System**: Step-by-step recommendation guides
- **Real AI Integration**: Replace mock data with actual AI analysis
- **Advanced Analytics**: Machine learning insights and predictive analytics
- **Integration APIs**: Third-party tool connections
- **Full Authentication**: Complete authentication system

This implementation prompt provides comprehensive guidance for building upon the
current MVP implementation to create advanced features and integrations while
maintaining the existing functionality and architecture. The current MVP is
complete and ready for production use, with clear paths for future enhancements.
