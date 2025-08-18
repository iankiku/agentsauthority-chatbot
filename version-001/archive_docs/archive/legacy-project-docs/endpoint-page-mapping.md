# Fragment GEO Platform - Comprehensive Endpoint & Page Mapping

_Last Updated: 2025-01-27_ _Status: **MVP Implementation Complete**_

---

## 🎯 **Overview**

This document provides a comprehensive mapping of all endpoints, pages, data
structures, and implementation details for the Fragment GEO Platform MVP. It
serves as the single source of truth for understanding the current
implementation and planning future enhancements.

---

## 📋 **Page Structure & Navigation**

### **Core Application Pages**

#### **1. Landing Page** (`/`)

- **Purpose**: Main entry point and marketing page
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: None required
- **Content**:
  - Hero section with value proposition
  - Feature overview
  - Pricing information
  - Call-to-action buttons
- **Navigation**: Links to `/chat`, `/register`, `/login`

#### **2. Chat Interface** (`/chat`)

- **Purpose**: Primary AI interaction hub with inline artifacts
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Bypassed for MVP (mock session)
- **Key Features**:
  - Full-width chat interface
  - Streaming AI responses
  - Inline artifact rendering (charts, tables, score cards)
  - Real-time progress indicators
- **Data Sources**:
  - `/api/chat` - Main chat endpoint
  - Artifact components for data visualization
- **User Journey**: Entry point for all analysis requests

#### **3. Brand Monitor** (`/brand-monitor`)

- **Purpose**: Continuous brand monitoring and historical analysis
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Bypassed for MVP
- **Key Features**:
  - URL input for brand analysis
  - Historical trend visualization
  - Competitor comparison
  - AI provider breakdown
- **Data Sources**:
  - `/api/brand-monitor/analyze` - Initiate analysis
  - `/api/brand-monitor/analyses/[id]/history` - Historical data
  - `/api/brand-monitor/analyses/[id]/trends` - Trend data
- **Mock Data**: Demo results with sample scores and trends

#### **4. Visibility Explorer** (`/visibility-explorer`)

- **Purpose**: One-time AI search visibility analysis
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Bypassed for MVP
- **Key Features**:
  - One-time analysis form
  - Share of voice analysis
  - Competitor comparison with rankings
  - AI provider breakdown (ChatGPT, Claude, Gemini)
  - Actionable recommendations
- **Data Sources**:
  - `/api/visibility-explorer/data` - Aggregated visibility data
  - `/api/visibility-explorer/filter` - Filtered data
  - `/api/visibility-explorer/export` - Data export
- **Mock Data**: Sample visibility scores and competitor data

#### **5. Dashboard** (`/dashboard`)

- **Purpose**: Overview and quick actions hub
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Bypassed for MVP
- **Key Features**:
  - Platform overview
  - Quick action buttons
  - Recent activity summary
  - Navigation to other features
- **Data Sources**: Mock data for demo purposes
- **Navigation**: Links to all major features

#### **6. Authentication Pages**

- **Login** (`/login`): ✅ **IMPLEMENTED** - Simplified for MVP
- **Register** (`/register`): ✅ **IMPLEMENTED** - Simplified for MVP
- **Forgot Password** (`/forgot-password`): ✅ **IMPLEMENTED**
- **Reset Password** (`/reset-password`): ✅ **IMPLEMENTED**
- **Status**: All bypassed for MVP demo

#### **7. Pricing & Plans** (`/plans`)

- **Purpose**: Pricing information and plan selection
- **Status**: ✅ **IMPLEMENTED**
- **Content**: Pricing tiers and feature comparison

---

## 🔌 **API Endpoints - Complete Mapping**

### **Chat & AI Interaction Endpoints**

#### **1. Chat API** (`/api/chat`)

- **Method**: POST
- **Purpose**: Main chat interface endpoint
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session (bypassed for MVP)
- **Request Body**:
  ```typescript
  {
    messages: Array<{
      id: string;
      role: 'user' | 'assistant';
      content: string;
      createdAt: Date;
    }>;
    conversationId?: string;
  }
  ```
- **Response**: Streaming response with AI messages and tool calls
- **Tool Calls**: Generates artifacts (GeoScoreCard, DataTable, LineChart)
- **Mock Implementation**: Returns predefined responses for demo

#### **2. Brand Monitor Analysis** (`/api/brand-monitor/analyze`)

- **Method**: POST
- **Purpose**: Initiate brand analysis
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Request Body**:
  ```typescript
  {
    url: string;
    competitors?: string[];
    analysisType: 'quick' | 'comprehensive';
  }
  ```
- **Response**: Analysis results with scores and trends
- **Mock Data**: Sample brand analysis results

#### **3. Brand Monitor Scrape** (`/api/brand-monitor/scrape`)

- **Method**: POST
- **Purpose**: Scrape company information
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Request Body**:
  ```typescript
  {
    url: string;
    selectors?: Record<string, string>;
  }
  ```
- **Response**: Scraped company data
- **Mock Data**: Sample company information

### **Historical Data Endpoints**

#### **4. Analysis History** (`/api/brand-monitor/analyses/[analysisId]/history`)

- **Method**: GET
- **Purpose**: Fetch historical analysis data
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Response**:
  ```typescript
  {
  	snapshots: Array<{
  		id: string;
  		createdAt: string;
  		visibilityScore: number;
  		shareOfVoice: number;
  		competitorData: CompetitorData[];
  		providerBreakdown: Record<string, number>;
  	}>;
  	trends: {
  		visibilityTrend: Array<{ date: string; score: number }>;
  		shareOfVoiceTrend: Array<{ date: string; percentage: number }>;
  	}
  }
  ```
- **Mock Data**: 30-day historical data with trends

#### **5. Analysis Trends** (`/api/brand-monitor/analyses/[analysisId]/trends`)

- **Method**: GET
- **Purpose**: Get trend data for charts
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Response**: Trend data formatted for chart components
- **Mock Data**: Sample trend data over time

#### **6. Analysis Export** (`/api/brand-monitor/analyses/[analysisId]/export`)

- **Method**: POST
- **Purpose**: Export analysis data
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Response**: CSV/PDF export of analysis data
- **Mock Data**: Sample export data

### **Visibility Explorer Endpoints**

#### **7. Visibility Data** (`/api/visibility-explorer/data`)

- **Method**: GET
- **Purpose**: Fetch aggregated visibility data
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Query Parameters**:
  ```typescript
  {
    url?: string;
    dateRange?: string;
    providers?: string[];
  }
  ```
- **Response**:
  ```typescript
  {
  	shareOfVoice: Array<{
  		name: string;
  		value: number;
  		isOwn: boolean;
  	}>;
  	competitorScores: Array<{
  		name: string;
  		score: number;
  		rank: number;
  		isOwn: boolean;
  	}>;
  	providerBreakdown: Record<
  		string,
  		{
  			ownScore: number;
  			competitorScores: Array<{ name: string; score: number }>;
  		}
  	>;
  }
  ```
- **Mock Data**: Sample visibility analysis results

#### **8. Visibility Filter** (`/api/visibility-explorer/filter`)

- **Method**: POST
- **Purpose**: Apply filters to visibility data
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Request Body**:
  ```typescript
  {
    filters: {
      dateRange: string;
      providers: string[];
      competitors: string[];
    };
  }
  ```
- **Response**: Filtered visibility data
- **Mock Data**: Filtered sample data

#### **9. Visibility Export** (`/api/visibility-explorer/export`)

- **Method**: GET
- **Purpose**: Export filtered visibility data
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Response**: CSV/PDF export
- **Mock Data**: Sample export data

#### **10. Competitor Details** (`/api/visibility-explorer/competitors/[id]`)

- **Method**: GET
- **Purpose**: Get detailed competitor data
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Response**: Detailed competitor analysis
- **Mock Data**: Sample competitor information

### **Additional Endpoints**

#### **11. Provider Check** (`/api/brand-monitor/check-providers`)

- **Method**: GET
- **Purpose**: Check configured AI providers
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Response**: Available AI providers and status
- **Mock Data**: Provider availability status

#### **12. Web Search** (`/api/brand-monitor/web-search`)

- **Method**: POST
- **Purpose**: Perform web searches
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Response**: Search results
- **Mock Data**: Sample search results

#### **13. Batch Scrape** (`/api/brand-monitor/batch-scrape`)

- **Method**: POST
- **Purpose**: Handle batch scraping
- **Status**: ✅ **IMPLEMENTED**
- **Authentication**: Mock session
- **Response**: Batch scraping results
- **Mock Data**: Sample batch results

---

## 📊 **Data Structures & Mock Data**

### **Core Data Types**

#### **Brand Analysis Data**

```typescript
interface BrandAnalysis {
	id: string;
	url: string;
	createdAt: Date;
	visibilityScore: number;
	shareOfVoice: number;
	competitorData: CompetitorData[];
	providerBreakdown: Record<string, number>;
	analysisMetadata: Record<string, any>;
}

interface CompetitorData {
	name: string;
	url: string;
	score: number;
	rank: number;
	marketShare: number;
	trend: number;
}
```

#### **Visibility Explorer Data**

```typescript
interface VisibilityData {
	shareOfVoice: Array<{
		name: string;
		value: number;
		isOwn: boolean;
	}>;
	competitorScores: Array<{
		name: string;
		score: number;
		rank: number;
		isOwn: boolean;
	}>;
	providerBreakdown: Record<
		string,
		{
			ownScore: number;
			competitorScores: Array<{ name: string; score: number }>;
		}
	>;
}
```

#### **Chat Message Data**

```typescript
interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	createdAt: Date;
	toolInvocations?: Array<{
		toolName: string;
		result: any;
	}>;
}
```

### **Mock Data Examples**

#### **Sample Brand Analysis**

```typescript
const mockBrandAnalysis = {
	id: "analysis-123",
	url: "https://example.com",
	createdAt: new Date(),
	visibilityScore: 85,
	shareOfVoice: 35,
	competitorData: [
		{
			name: "Competitor A",
			url: "https://competitor-a.com",
			score: 78,
			rank: 2,
			marketShare: 28,
			trend: 5,
		},
		{
			name: "Competitor B",
			url: "https://competitor-b.com",
			score: 72,
			rank: 3,
			marketShare: 22,
			trend: -2,
		},
	],
	providerBreakdown: {
		ChatGPT: 88,
		Claude: 82,
		Gemini: 85,
	},
};
```

#### **Sample Visibility Data**

```typescript
const mockVisibilityData = {
	shareOfVoice: [
		{ name: "Your Brand", value: 35, isOwn: true },
		{ name: "Competitor A", value: 28, isOwn: false },
		{ name: "Competitor B", value: 22, isOwn: false },
		{ name: "Competitor C", value: 15, isOwn: false },
	],
	competitorScores: [
		{ name: "Your Brand", score: 85, rank: 1, isOwn: true },
		{ name: "Competitor A", score: 78, rank: 2, isOwn: false },
		{ name: "Competitor B", score: 72, rank: 3, isOwn: false },
		{ name: "Competitor C", score: 65, rank: 4, isOwn: false },
	],
	providerBreakdown: {
		ChatGPT: {
			ownScore: 88,
			competitorScores: [
				{ name: "Competitor A", score: 82 },
				{ name: "Competitor B", score: 75 },
				{ name: "Competitor C", score: 68 },
			],
		},
		Claude: {
			ownScore: 82,
			competitorScores: [
				{ name: "Competitor A", score: 76 },
				{ name: "Competitor B", score: 70 },
				{ name: "Competitor C", score: 62 },
			],
		},
		Gemini: {
			ownScore: 85,
			competitorScores: [
				{ name: "Competitor A", score: 79 },
				{ name: "Competitor B", score: 73 },
				{ name: "Competitor C", score: 66 },
			],
		},
	},
};
```

---

## 🎨 **UI Component Mapping**

### **Core UI Components**

#### **Chat Components**

- `ChatContent` (`/chat`): Main chat interface
- `ChatInput`: Message input with suggestions
- `ChatMessages`: Message history display
- `Message`: Individual message component
- `ArtifactRenderer`: Dynamic artifact rendering

#### **Artifact Components**

- `GeoScoreCard`: Score display with progress
- `DataTable`: Tabular data display
- `LineChartComponent`: Line chart for trends
- `CompetitorMatrix`: Competitor comparison table
- `ProgressBar`: Progress indicator

#### **Page Components**

- `BrandMonitorPage`: Brand monitoring interface
- `VisibilityExplorerPage`: Visibility analysis interface
- `DashboardPage`: Overview dashboard
- `LandingPage`: Marketing landing page

#### **Shared Components**

- `Navbar`: Navigation header
- `Footer`: Page footer
- `Button`: Reusable button component
- `Card`: Card container component
- `Input`: Form input component

---

## 🔄 **User Journey Flow**

### **Primary User Journey**

1. **Landing** (`/`) → User discovers platform
2. **Chat** (`/chat`) → User starts analysis
3. **Analysis** → AI processes request via `/api/chat`
4. **Results** → Artifacts rendered inline in chat
5. **Deep Dive** → User navigates to specific pages:
   - `/brand-monitor` for continuous monitoring
   - `/visibility-explorer` for one-time analysis
   - `/dashboard` for overview

### **Secondary User Journeys**

- **Direct Access**: Users can go directly to specific pages
- **Navigation**: Seamless movement between all features
- **Export**: Data export from any analysis page

---

## 🚀 **Implementation Status Summary**

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
- **Authentication**: Full authentication system
- **Advanced Analytics**: Machine learning insights
- **Integration APIs**: Third-party tool connections

---

This comprehensive mapping provides the foundation for understanding the current
MVP implementation and planning future enhancements. All endpoints and pages are
fully functional with mock data, ready for production integration.
