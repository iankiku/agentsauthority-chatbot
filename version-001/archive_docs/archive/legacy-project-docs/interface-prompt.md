# UI Generation Prompt: Fragment GEO Dashboard

_Last Updated: 2025-01-27_ _Target: **AI Coding Agent**_

---

## 🎨 Design Vision

Our goal is to create a clean, data-rich, and intuitive dashboard inspired by
the best elements of modern analytics platforms like **SEMrush**, **Mixpanel**,
and **Vercel**, and drawing inspiration from shadcn/ui dashboard examples (e.g.,
Dashboard 01, 07). The UI should be modular, responsive, and visually appealing,
with a strong emphasis on clarity and actionable insights.

**Core Principles**:

- **Clarity Over Clutter**: Every component should serve a clear purpose. Avoid
  unnecessary decorations.
- **Data-First**: The data is the star. Use charts and tables to make it easy to
  understand.
- **Responsive & Accessible**: The dashboard must be usable on all screen sizes
  and accessible to all users.
- **shadcn/ui Foundation**: All components built using shadcn/ui for consistency
  and accessibility.
- **Real-time Updates**: SSE integration for live data streaming and progress
  updates.

---

## 🏗️ Dashboard Architecture

### 1. Main Dashboard Layout Structure

#### **URL-Driven Navigation System**

- **Route Structure**: `/dashboard/[dashboardId]?tab=overview` to support deep
  linking and shareable URLs.
- **Tab Navigation**: Implement primary dashboard navigation using shadcn/ui
  `Tabs` component. Each tab corresponds to a major section (e.g., Brand
  Monitor, Visibility Explorer) and dynamically changes the content area.
- **Breadcrumb Navigation**: Use shadcn/ui `Breadcrumb` component for clear path
  visualization, especially when navigating into specific analysis details.
- **Responsive Sidebar**: A fixed-width navigation sidebar on desktop,
  transitioning to a collapsible sidebar or drawer (`Drawer` from shadcn/ui) on
  mobile. This sidebar should contain links to main dashboard sections and
  historical analysis entries.

#### **Layout Components**

```tsx
// Main dashboard shell structure, similar to shadcn/ui Dashboard 01 example
// This component should wrap all specific dashboard views (e.g., Brand Monitor, Visibility Explorer)
<DashboardShell>
	{/* Header Section */}
	<DashboardHeader className="border-b">
		<DashboardTitle /> {/* Current page title */}
		<DashboardActions /> {/* Contains date range filter, export button, etc. */}
	</DashboardHeader>

	{/* Main Content Area with Tabs for Sub-navigation */}
	<DashboardTabs defaultValue="overview">
		<TabList className="grid w-full grid-cols-4 md:grid-cols-auto gap-1 p-1 bg-muted rounded-md">
			{" "}
			{/* Example: grid for equal tab distribution */}
			<Tab value="overview">Overview</Tab>
			<Tab value="trends">Trends</Tab>
			<Tab value="competitors">Competitors</Tab>
			<Tab value="providers">Providers</Tab>
		</TabList>
		<TabContent value="overview" className="mt-4">
			<OverviewGrid /> {/* This grid will contain cards with data */}
		</TabContent>
		{/* Other tab contents */}
	</DashboardTabs>
</DashboardShell>
```

#### **Responsive Grid System**

- **Desktop (lg+)**: Three-column grid layout for main content areas
  (`grid-cols-3`).
- **Tablet (md)**: Two-column grid layout (`grid-cols-2`).
- **Mobile (sm)**: Single-column layout (`grid-cols-1`) with stacked cards.
- **Gap**: Consistent 6-unit gap (`gap-6`) between grid items and `Card`
  components.
- **Container**: Max-width container (`max-w-7xl mx-auto`) with responsive
  padding (`px-4 sm:px-6 lg:px-8`).

---

## 🧩 Core Components (using `shadcn/ui`)

### 2.1. Card Components

#### **Data Cards (`<Card />`)**

All charts, tables, metrics, and informational blocks should be contained within
`Card` components from `shadcn/ui` to ensure modularity and consistent visual
presentation.

```tsx
// Standard card structure for all dashboard components
<Card className="h-full border shadow-sm rounded-lg">
	{" "}
	{/* Added border, shadow, rounded-lg for consistent design */}
	<CardHeader className="pb-3 border-b">
		{" "}
		{/* Added border-b for visual separation */}
		<div className="flex items-center justify-between">
			<div>
				<CardTitle className="text-lg font-semibold">Component Title</CardTitle>
				<CardDescription className="text-sm text-muted-foreground">
					Component description or subtitle
				</CardDescription>
			</div>
			<CardActions>
				{/* Action buttons, filters, etc., typically `Button` or `DropdownMenu` */}
			</CardActions>
		</div>
	</CardHeader>
	<CardContent className="pt-4">
		{" "}
		{/* Adjusted padding-top for better spacing */}
		{/* Main component content: Charts, Tables, Metric values */}
	</CardContent>
	<CardFooter>
		{" "}
		{/* Optional: For footers, legends, or action buttons */}
		{/* Footer content */}
	</CardFooter>
</Card>
```

#### **Metric Cards**

For displaying key performance indicators (KPIs) like "Total Visibility," "New
Subscriptions," etc., inspired by shadcn/ui Dashboard examples.

```tsx
// Metric card with trend indicator, similar to shadcn/ui Dashboard 01 revenue card
<Card className="border shadow-sm rounded-lg">
	<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
		<CardTitle className="text-sm font-medium">Total Visibility</CardTitle>
		<TrendIndicator trend="up" value={12} />{" "}
		{/* Custom component for trend icon and percentage */}
	</CardHeader>
	<CardContent>
		<div className="text-2xl font-bold">85.2%</div>
		<p className="text-xs text-muted-foreground">+12% from last month</p>
	</CardContent>
</Card>
```

### 2.2. Chart Components

#### **Chart Container (`<ChartContainer />`)**

All charts must use shadcn/ui's `ChartContainer` to ensure consistent theming,
responsiveness, and accessibility, integrating with Recharts for plotting.

```tsx
// Standard chart structure, wrapping Recharts components
<ChartContainer
	config={{
		score: { label: "Visibility Score", color: "hsl(var(--chart-1))" },
		shareOfVoice: { label: "Share of Voice", color: "hsl(var(--chart-2))" },
	}}
	className="h-[300px] w-full"
>
	{/* Recharts components (LineChart, BarChart, PieChart, etc.) */}
	{/* Ensure `ChartTooltip` and `ChartTooltipContent` are used for interactive tooltips */}
</ChartContainer>
```

#### **Line Charts**

For historical trends and time-series data (e.g., `HistoricalTrendChart` for
Visibility Trend).

```tsx
// Line chart for trend visualization, integrating with API data
<LineChart data={data}>
  <CartesianGrid vertical={false} strokeDasharray="3 3" /> {/* Subtle grid lines */}
  <XAxis
    dataKey="date"
    tickLine={false}
    axisLine={false}
    tickFormatter={(value) => format(new Date(value), 'MMM dd')} {/* Format dates for display */}
  />
  <YAxis
    tickLine={false}
    axisLine={false}
    tickFormatter={(value) => `${value}%`} {/* Format scores as percentages */}
  />
  <ChartTooltip content={<ChartTooltipContent />} />
  <Line
    dataKey="score"
    type="natural"
    stroke="var(--color-score)"
    strokeWidth={2}
    dot={{ fill: "var(--color-score)", strokeWidth: 2, r: 4 }}
    activeDot={{ r: 6, stroke: "var(--color-score)", strokeWidth: 2 }}
  />
  {/* Add a second Line for 'shareOfVoice' trend */}
  <Line
    dataKey="shareOfVoice"
    type="natural"
    stroke="var(--color-shareOfVoice)"
    strokeWidth={2}
    dot={{ fill: "var(--color-shareOfVoice)", strokeWidth: 2, r: 4 }}
    activeDot={{ r: 6, stroke: "var(--color-shareOfVoice)", strokeWidth: 2 }}
  />
</LineChart>
```

#### **Bar Charts**

For comparisons and rankings (e.g., `CompetitorBarChart` for Competitor
Visibility Scores).

```tsx
// Bar chart for competitor comparison, data from /api/visibility-explorer/data
<BarChart data={data} layout="horizontal">
  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
  <XAxis type="number" tickLine={false} axisLine={false} />
  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
  <ChartTooltip content={<ChartTooltipContent />} />
  <Bar
    dataKey="score"
    fill="var(--color-score)"
    radius={[0, 4, 4, 0]} {/* Rounded corners for bars */}
    onClick={(data) => onBarClick(data.name)} {/* Clickable bars for drill-down */}
    style={{ cursor: 'pointer' }}
  />
</BarChart>
```

#### **Pie/Donut Charts**

For share of voice and distribution data (e.g., `ShareOfVoicePieChart`).

```tsx
// Pie chart for share of voice, data from /api/visibility-explorer/data
<PieChart>
  <Pie
    data={data}
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={120}
    paddingAngle={2}
    dataKey="value"
  >
    {data.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={entry.isOwn ? "hsl(var(--primary))" : `hsl(var(--chart-${index + 2}))`} // Dynamic colors, primary for own brand
        onClick={() => onSliceClick(entry.name)} {/* Clickable slices */}
        style={{ cursor: 'pointer' }}
      />
    ))}
  </Pie>
  <ChartTooltip content={<ChartTooltipContent />} />
</PieChart>
```

### 2.3. Table Components

#### **Data Tables (`<Table />`)**

For displaying detailed, tabular data (e.g., `CompetitorComparisonTable`, Recent
Sales table from shadcn/ui dashboard example).

```tsx
// Standard table structure with sorting, filtering, and row click
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">
        <Button variant="ghost" onClick={() => handleSort('rank')}>
          Rank
          <ArrowUpDown className="ml-2 h-4 w-4" /> {/* Icon for sortable columns */}
        </Button>
      </TableHead>
      <TableHead>Brand</TableHead>
      <TableHead className="text-right">
        <Button variant="ghost" onClick={() => handleSort('score')}>
          Visibility Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </TableHead>
      <TableHead className="text-right">Share of Voice</TableHead>
      <TableHead className="text-right">Trend</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow
        key={item.id}
        className={item.isOwn ? "bg-muted/50" : ""} {/* Highlight own brand row */}
        onClick={() => onRowClick(item)}
        style={{ cursor: 'pointer' }}
      >
        <TableCell className="font-medium">{item.rank}</TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <span>{item.name}</span>
            {item.isOwn && <Badge variant="secondary">Your Brand</Badge>} {/* Badge for own brand */}
          </div>
        </TableCell>
        <TableCell className="text-right">{item.score}%</TableCell>
        <TableCell className="text-right">{item.shareOfVoice}%</TableCell>
        <TableCell className="text-right">
          <TrendIndicator trend={item.trend} value={item.trendValue} /> {/* Custom component for trend icon and value */}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 2.4. Filter Components

#### **Provider Filter (`<Select />`)**

For filtering data by AI provider (e.g., ChatGPT, Gemini). This component should
reflect data from `/api/brand-monitor/check-providers`.

```tsx
// Multi-select provider filter, data from /api/brand-monitor/check-providers
<Select value={selectedProviders} onValueChange={onProviderChange} multiple>
	{" "}
	{/* `multiple` prop for multi-select */}
	<SelectTrigger className="w-[200px]">
		<SelectValue placeholder="All Providers" />
	</SelectTrigger>
	<SelectContent>
		<SelectItem value="all">All Providers</SelectItem>
		<SelectSeparator />
		{providers.map((provider) => (
			<SelectItem key={provider.id} value={provider.id}>
				<div className="flex items-center space-x-2">
					<span>{provider.name}</span>
					{!provider.isEnabled && (
						<Badge variant="outline" className="text-xs">
							Disabled
						</Badge>
					)}
				</div>
			</SelectItem>
		))}
	</SelectContent>
</Select>
```

#### **Date Range Filter**

For selecting time periods (e.g., "Last 30 days", "Custom range"). This will be
used in `DashboardActions`.

```tsx
// Date range filter with preset options and calendar popover
<Popover>
	<PopoverTrigger asChild>
		<Button
			variant="outline"
			className="w-[200px] justify-start text-left font-normal"
		>
			<CalendarIcon className="mr-2 h-4 w-4" />
			{dateRange ? (
				<>
					{format(dateRange.from, "LLL dd, yyyy")} -{" "}
					{format(dateRange.to, "LLL dd, yyyy")}
				</>
			) : (
				<span>Pick a date range</span>
			)}
		</Button>
	</PopoverTrigger>
	<PopoverContent className="w-auto p-0" align="start">
		<Calendar
			initialFocus
			mode="range"
			defaultMonth={dateRange?.from}
			selected={dateRange}
			onSelect={setDateRange}
			numberOfMonths={2}
		/>
	</PopoverContent>
</Popover>
```

### 2.5. Navigation Components

#### **Dashboard Tabs**

For main dashboard navigation, as part of the `DashboardShell`.

```tsx
// Main dashboard tabs, similar to shadcn/ui Dashboard 01 example
<Tabs defaultValue="overview" className="w-full">
	<TabList className="grid w-full grid-cols-4 bg-muted rounded-md p-1 gap-1">
		{" "}
		{/* Grid for evenly spaced tabs */}
		<TabTrigger
			value="overview"
			className="flex items-center space-x-2 data-[state=active]:bg-background"
		>
			{" "}
			{/* Highlight active tab */}
			<BarChart3 className="h-4 w-4" />
			<span>Overview</span>
		</TabTrigger>
		<TabTrigger
			value="trends"
			className="flex items-center space-x-2 data-[state=active]:bg-background"
		>
			<TrendingUp className="h-4 w-4" />
			<span>Trends</span>
		</TabTrigger>
		<TabTrigger
			value="competitors"
			className="flex items-center space-x-2 data-[state=active]:bg-background"
		>
			<Users className="h-4 w-4" />
			<span>Competitors</span>
		</TabTrigger>
		<TabTrigger
			value="providers"
			className="flex items-center space-x-2 data-[state=active]:bg-background"
		>
			<Cpu className="h-4 w-4" />
			<span>Providers</span>
		</TabTrigger>
	</TabList>
	<TabContent value="overview" className="space-y-4 pt-4">
		{" "}
		{/* Padding top for content separation */}
		<OverviewGrid />
	</TabContent>
	{/* Other tab contents */}
</Tabs>
```

---

## 🔄 API-UI Integration & Data Flow

### 3.1. Data Fetching Strategy

All UI components will consume data passed as `props`, which will originate from
backend API endpoints. Data fetching will be managed by `SWR` or `React Query`
hooks at the page/container level (e.g., `BrandMonitorPage`,
`VisibilityExplorerPage`).

#### **Enhanced Brand Monitor APIs**

- **`/api/brand-monitor/analyze` (POST)**: Initiates a new brand analysis. This
  is an SSE (Server-Sent Events) endpoint, providing real-time progress updates.
  The UI (`AnalysisProgressSection`, `UnifiedChatBlock`) should display progress
  messages and update analysis results dynamically as events are received.
  - **UI Consumption**: `useSSEHandler` hook for real-time updates of progress,
    credits, and final `analysis` object.
- **`/api/brand-monitor/analyses` (GET)**: Fetches a list of historical brand
  analyses for the authenticated user. This populates the sidebar navigation
  with past analysis entries and the `AnalysisSnapshotCard` list.
  - **UI Consumption**: `useBrandAnalyses` hook (or similar) to populate a list
    of selectable analyses.
- **`/api/brand-monitor/analyses/[analysisId]` (GET)**: Fetches the detailed
  results of a specific historical brand analysis. This data will be used to
  render `VisibilityScoreTab`, `ProviderComparisonMatrix`, and
  `PromptsResponsesTab`.
  - **UI Consumption**: `useBrandAnalysis` hook to populate
    `HistoricalTrendChart`, `CompetitorComparisonTable`,
    `ProviderBreakdownCard`, etc.
- **`/api/brand-monitor/analyses/[analysisId]/history` (GET)**: New endpoint for
  fetching historical data optimized for trend charts.
  - **UI Consumption**: `useHistoricalData` hook to populate
    `HistoricalTrendChart`.
- **`/api/brand-monitor/analyses/[analysisId]/trends` (GET)**: New endpoint for
  getting specific trend data for charts.
  - **UI Consumption**: `useHistoricalData` to extract `visibilityTrend` and
    `shareOfVoiceTrend`.
- **`/api/brand-monitor/check-providers` (POST)**: Checks which AI providers are
  currently configured and available.
  - **UI Consumption**: `ProviderFilter` consumes this data to display
    selectable AI providers.
- **`/api/brand-monitor/scrape` (POST)**: Used to initially scrape company
  information from a given URL.
  - **UI Consumption**: Triggered by user input in a form, updates `CompanyCard`
    with scraped data.

#### **Visibility Explorer APIs**

- **`/api/visibility-explorer/data` (GET)**: Fetches aggregated visibility data
  for the entire Visibility Explorer dashboard.
  - **UI Consumption**: `useVisibilityExplorerData` to populate
    `ShareOfVoicePieChart`, `CompetitorBarChart`, and `VisibilityMetricsCard`.
- **`/api/visibility-explorer/filter` (POST)**: Applies filters (e.g., provider,
  date range) to the visibility data.
  - **UI Consumption**: `ProviderFilter`, `DateRangeFilter` trigger this API to
    update dashboard content.
- **`/api/visibility-explorer/export` (GET)**: Exports filtered dashboard data.
  - **UI Consumption**: Triggered by an `ExportButton` to initiate a download.
- **`/api/visibility-explorer/competitors/[id]` (GET)**: Gets detailed
  competitor data for drill-down views.
  - **UI Consumption**: Triggered by `onCompetitorClick` or `onBarClick` from
    charts/tables to open a `CompetitorDetailModal`.

### 3.2. Real-time Updates with SSE

#### **SSE Integration Pattern**

```tsx
// Example of SSE hook usage for real-time updates from /api/brand-monitor/analyze
import { useSSEHandler } from "@/hooks/useSSEHandler"; // Assuming this hook is implemented

const { data, error, isConnected } = useSSEHandler(
	"/api/brand-monitor/analyze",
	{
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(analysisRequest), // The request payload for analysis
	}
);

// Use useEffect to react to incoming SSE events
useEffect(() => {
	if (data) {
		switch (data.type) {
			case "progress":
				// Update UI with progress stage, message, and current provider/prompt
				console.log(
					`Analysis Progress: ${data.data.stage} - ${data.data.message}`
				);
				// Example: dispatch({ type: 'UPDATE_PROGRESS', payload: data.data });
				break;
			case "credits":
				// Update remaining and used credits display
				console.log(
					`Credits: Remaining - ${data.data.remainingCredits}, Used - ${data.data.creditsUsed}`
				);
				// Example: setCredits(data.data.remainingCredits);
				break;
			case "complete":
				// Handle completion, display final analysis object
				console.log("Analysis Complete:", data.data.analysis);
				// Example: setAnalysisComplete(data.data.analysis);
				break;
			case "error":
				// Display error message to user
				console.error("Analysis Error:", data.data.message);
				// Example: setError(data.data.message);
				break;
		}
	}
}, [data]);
```

### 3.3. Data Flow Architecture

1.  **User Input**: Forms, buttons, filters trigger API requests.
2.  **API Request**: Frontend sends requests to backend Next.js API routes
    (e.g., `/api/brand-monitor/analyze`).
3.  **Mastra Agent Processing**: Backend routes delegate complex analysis and
    data processing to Mastra Agents (e.g., `brandAnalysisAgent`,
    `visibilityAnalysisAgent`) residing in `apps/agents-mastra`.
4.  **Database Storage**: Processed results and historical snapshots are stored
    in the PostgreSQL/Supabase database (`brand_analysis_snapshots`,
    `brand_analyses`).
5.  **UI Update**: Frontend components re-fetch data via SWR/React Query hooks
    or receive real-time updates via SSE, re-rendering the UI.
6.  **Real-time Feedback**: SSE events (progress, credits, completion) provide
    live feedback to the user during long-running operations.
7.  **Caching Strategy**: SWR/React Query ensures efficient data fetching,
    caching, and revalidation for a responsive user experience.
8.  **Error Handling**: Comprehensive error boundaries
    (`DashboardErrorBoundary`) and user-friendly error messages display
    gracefully.

---

## 📱 Responsive Design Specifications

### 4.1. Breakpoint Strategy

#### **Mobile First Approach**

- **Base (sm)**: For screen widths 640px and up, layout defaults to a
  single-column stack of cards.
- **Medium (md)**: For screen widths 768px and up, layout transitions to a
  two-column grid (`md:grid-cols-2`).
- **Large (lg)**: For screen widths 1024px and up, layout transitions to a
  three-column grid (`lg:grid-cols-3`).
- **Extra Large (xl)**: For screen widths 1280px and up, fine-tune spacing and
  element sizes for optimal large-screen viewing.

#### **Grid System**

```tsx
// Responsive grid container for cards within dashboard sections
<div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
	{/* Grid items (shadcn/ui Card components) */}
</div>
```

### 4.2. Mobile Optimizations

#### **Touch-Friendly Interactions**

- Minimum 44px touch targets for all interactive elements (buttons, dropdowns,
  chart points).
- Implement swipe gestures for tab navigation where appropriate.
- Ensure the sidebar collapses into a `Sheet` or `Drawer` component on mobile
  for easy access.

#### **Mobile-Specific Components**

```tsx
// Mobile-optimized chart container, adjusting height for smaller screens
<ChartContainer
	config={chartConfig}
	className="h-[250px] w-full sm:h-[300px] md:h-[350px]" // Responsive height adjustments
>
	{/* Chart content */}
</ChartContainer>
```

- Use `shadcn/ui` `Sheet` or `Drawer` for mobile sidebars or modals that take up
  full screen height.

---

## 🎨 Visual Design System

### 5.1. Color Palette

All colors should primarily use the `hsl(var(--<color-name>))` convention
defined in `globals.css` and `tailwind.config.ts` for consistent theming
(light/dark mode support).

#### **Primary Colors**

- **Primary**: `hsl(var(--primary))` - The main brand color, used for primary
  actions, active states, and key data points.
- **Secondary**: `hsl(var(--secondary))` - A subtle background or text color for
  secondary elements.
- **Accent**: `hsl(var(--accent))` - A contrasting color for highlights or
  important call-to-actions.
- **Destructive**: `hsl(var(--destructive))` - For error states or critical
  actions.

#### **Chart Colors**

- **Chart 1**: `hsl(var(--chart-1))` - Default color for the first data series
  in charts.
- **Chart 2**: `hsl(var(--chart-2))` - Color for the second data series.
- **Chart 3**: `hsl(var(--chart-3))` - Color for the third data series.
- **Chart 4**: `hsl(var(--chart-4))` - Color for the fourth data series, and so
  on, extending as needed.
- Ensure sufficient contrast for accessibility.

### 5.2. Typography

Maintain a clear and consistent typographic hierarchy using Tailwind CSS
classes.

#### **Text Hierarchy**

- **Dashboard Title**: `text-3xl font-bold tracking-tight` (e.g., "Brand
  Monitor")
- **Card Title**: `text-lg font-semibold` (e.g., "Visibility Trend")
- **Card Description/Subtitle**: `text-sm text-muted-foreground`
- **Body Text**: `text-base` or `text-sm` for content, `text-muted-foreground`
  for secondary information.
- **Metric Values**: `text-2xl font-bold` for large, prominent numbers.

### 5.3. Spacing System

Adhere to a consistent spacing scale using Tailwind CSS utility classes.

#### **Consistent Spacing**

- **Container Padding**: `p-4 pt-6` for the main dashboard content area.
- **Card Padding**: `p-6` for internal card content, or `p-4` for denser cards.
- **Grid Gap**: `gap-6` between grid items.
- **Component Spacing**: `space-y-4` for vertical spacing between major sections
  or `space-x-2` for horizontal spacing between inline elements.

---

## 📝 Code Snippets & Examples

### 6.1. Complete Dashboard Page Example

This example demonstrates how a full dashboard page might integrate various
components and data hooks.

```tsx
// pages/dashboard/brand-monitor.tsx
"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Corrected Tabs components
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HistoricalTrendChart } from "@/components/dashboards/brand-monitor/HistoricalTrendChart";
import { CompetitorComparisonTable } from "@/components/dashboards/brand-monitor/CompetitorComparisonTable";
import { ProviderBreakdownCard } from "@/components/dashboards/brand-monitor/ProviderBreakdownCard";
import { useHistoricalData } from "@/hooks/useHistoricalData";
import { useVisibilityExplorerData } from "@/hooks/useVisibilityExplorerData";
import { DashboardLayout } from "@/components/shared/DashboardLayout"; // Assuming shared layout component
import { DateRangeFilter } from "@/components/shared/DateRangeFilter"; // Assuming shared filter component
import { ExportButton } from "@/components/shared/ExportButton"; // Assuming shared export component
import { AlertCircle } from "lucide-react"; // For error display

// Placeholder for a generic ErrorBoundary component
const ErrorBoundary = ({ error }: { error: Error }) => (
	<Card className="p-6 text-center">
		<AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
		<h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
		<p className="text-muted-foreground mb-4">
			{error.message || "An unexpected error occurred."}
		</p>
		<Button onClick={() => window.location.reload()}>Retry</Button>
	</Card>
);

export default function BrandMonitorDashboard() {
	const [timeframe, setTimeframe] = useState("30d");
	const [selectedProviders, setSelectedProviders] = useState<string[]>(["all"]); // Example: 'all' or specific provider IDs
	const [activeTab, setActiveTab] = useState("overview"); // State to manage active tab

	// Fetch historical data for trends
	const {
		data: historicalData,
		error: historicalError,
		isLoading: historicalLoading,
	} = useHistoricalData("current-analysis-id", timeframe);
	// Fetch visibility explorer data
	const {
		data: visibilityData,
		error: visibilityError,
		isLoading: visibilityLoading,
	} = useVisibilityExplorerData({
		providers: selectedProviders,
		timeframe,
	});

	if (historicalError || visibilityError) {
		return <ErrorBoundary error={historicalError || visibilityError} />;
	}

	return (
		<DashboardLayout
			title="Brand Monitor"
			description="Track your brand's AI visibility and competitive position"
			actions={
				<>
					<DateRangeFilter value={timeframe} onChange={setTimeframe} />
					<ExportButton onExport={() => console.log("Exporting data...")} />
				</>
			}
		>
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-4 md:grid-cols-auto gap-1 p-1 bg-muted rounded-md">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="trends">Trends</TabsTrigger>
					<TabsTrigger value="competitors">Competitors</TabsTrigger>
					<TabsTrigger value="providers">Providers</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6 pt-4">
					{" "}
					{/* Increased spacing */}
					{historicalLoading || visibilityLoading ? (
						<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							<ChartSkeleton />
							<TableSkeleton />
							<ChartSkeleton />
						</div>
					) : (
						<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{historicalData?.trends && (
								<HistoricalTrendChart
									data={historicalData.trends.visibilityTrend}
									timeframe={timeframe}
									onTimeframeChange={setTimeframe}
								/>
							)}
							{visibilityData?.competitorScores && (
								<CompetitorComparisonTable
									competitors={visibilityData.competitorScores.map((c) => ({
										id: c.name, // Assuming name can act as an ID for this example
										name: c.name,
										score: c.score,
										shareOfVoice: c.shareOfVoice || 0, // Placeholder if not directly in competitorScores
										rank: c.rank,
										isOwn: c.isOwn,
										trend: "stable", // Placeholder trend
										trendValue: 0, // Placeholder trend value
									}))}
									onCompetitorClick={(id) =>
										console.log("Competitor clicked:", id)
									}
								/>
							)}
							{historicalData?.providerBreakdown && (
								<ProviderBreakdownCard
									providers={Object.entries(
										historicalData.providerBreakdown
									).map(([name, data]) => ({
										name,
										score: data.ownScore,
										confidence: 0, // Placeholder
										responseTime: 0, // Placeholder
									}))}
								/>
							)}
						</div>
					)}
				</TabsContent>

				<TabsContent value="trends" className="space-y-6 pt-4">
					{/* Content for Trends tab, e.g., more detailed trend charts */}
					{historicalLoading ? (
						<ChartSkeleton />
					) : (
						<HistoricalTrendChart
							data={historicalData?.trends.visibilityTrend || []}
							timeframe={timeframe}
							onTimeframeChange={setTimeframe}
						/>
					)}
				</TabsContent>

				<TabsContent value="competitors" className="space-y-6 pt-4">
					{/* Content for Competitors tab, e.g., detailed competitor analysis table/charts */}
					{visibilityLoading ? (
						<TableSkeleton />
					) : (
						<CompetitorComparisonTable
							competitors={
								visibilityData?.competitorScores.map((c) => ({
									id: c.name,
									name: c.name,
									score: c.score,
									shareOfVoice: c.shareOfVoice || 0,
									rank: c.rank,
									isOwn: c.isOwn,
									trend: "stable",
									trendValue: 0,
								})) || []
							}
							onCompetitorClick={(id) => console.log("Competitor clicked:", id)}
						/>
					)}
				</TabsContent>

				<TabsContent value="providers" className="space-y-6 pt-4">
					{/* Content for Providers tab, e.g., provider-specific performance */}
					{historicalLoading ? (
						<ChartSkeleton />
					) : (
						<ProviderBreakdownCard
							providers={Object.entries(
								historicalData?.providerBreakdown || {}
							).map(([name, data]) => ({
								name,
								score: data.ownScore,
								confidence: 0,
								responseTime: 0,
							}))}
						/>
					)}
					<ProviderFilter
						providers={[
							{ id: "openai", name: "OpenAI", isEnabled: true },
							{ id: "anthropic", name: "Anthropic", isEnabled: true },
						]} // Example data
						selectedProviders={selectedProviders}
						onProviderChange={setSelectedProviders}
					/>
				</TabsContent>
			</Tabs>
		</DashboardLayout>
	);
}

// Placeholder Skeleton components for loading states
function ChartSkeleton() {
	return (
		<Card className="h-full">
			<CardHeader>
				<div className="h-6 w-32 bg-muted rounded animate-pulse" />
				<div className="h-4 w-48 bg-muted rounded animate-pulse" />
			</CardHeader>
			<CardContent>
				<div className="h-[300px] bg-muted rounded animate-pulse" />
			</CardContent>
		</Card>
	);
}

function TableSkeleton() {
	return (
		<Card className="h-full">
			<CardHeader>
				<div className="h-6 w-40 bg-muted rounded animate-pulse" />
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="h-12 bg-muted rounded animate-pulse" />
					))}
				</div>
			</CardContent>
		</Card>
	);
}
```

### 6.2. Chart Component Example

```tsx
// components/dashboards/brand-monitor/HistoricalTrendChart.tsx
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

interface HistoricalTrendChartProps {
	data: Array<{
		date: string;
		score: number;
		shareOfVoice: number;
	}>;
	timeframe: string;
	onTimeframeChange: (timeframe: string) => void;
}

export function HistoricalTrendChart({
	data,
	timeframe,
	onTimeframeChange,
}: HistoricalTrendChartProps) {
	return (
		<Card className="h-full">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-lg font-semibold">
							Visibility Trend
						</CardTitle>
						<CardDescription className="text-sm text-muted-foreground">
							Your brand's visibility score over time
						</CardDescription>
					</div>
					<Select value={timeframe} onValueChange={onTimeframeChange}>
						<SelectTrigger className="w-[100px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="7d">7 days</SelectItem>
							<SelectItem value="30d">30 days</SelectItem>
							<SelectItem value="60d">60 days</SelectItem>
							<SelectItem value="90d">90 days</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<ChartContainer
					config={{
						score: { label: "Visibility Score", color: "hsl(var(--chart-1))" },
						shareOfVoice: {
							label: "Share of Voice",
							color: "hsl(var(--chart-2))",
						},
					}}
					className="h-[300px] w-full"
				>
					<LineChart data={data}>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => format(new Date(value), "MMM dd")}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => `${value}%`}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Line
							dataKey="score"
							type="natural"
							stroke="var(--color-score)"
							strokeWidth={2}
							dot={{ fill: "var(--color-score)", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 6, stroke: "var(--color-score)", strokeWidth: 2 }}
						/>
						<Line
							dataKey="shareOfVoice"
							type="natural"
							stroke="var(--color-shareOfVoice)"
							strokeWidth={2}
							dot={{ fill: "var(--color-shareOfVoice)", strokeWidth: 2, r: 4 }}
							activeDot={{
								r: 6,
								stroke: "var(--color-shareOfVoice)",
								strokeWidth: 2,
							}}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
```

### 6.3. Table Component Example

```tsx
// components/dashboards/brand-monitor/CompetitorComparisonTable.tsx
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CompetitorComparisonTableProps {
	competitors: Array<{
		id: string;
		name: string;
		score: number;
		shareOfVoice: number;
		rank: number;
		isOwn: boolean;
		trend: "up" | "down" | "stable";
		trendValue: number;
	}>;
	onCompetitorClick: (competitorId: string) => void;
}

export function CompetitorComparisonTable({
	competitors,
	onCompetitorClick,
}: CompetitorComparisonTableProps) {
	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case "up":
				return <TrendingUp className="h-4 w-4 text-green-500" />;
			case "down":
				return <TrendingDown className="h-4 w-4 text-red-500" />;
			default:
				return <Minus className="h-4 w-4 text-gray-500" />;
		}
	};

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle>Competitor Comparison</CardTitle>
				<CardDescription>Your brand vs. competitors over time</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[80px]">
								<Button variant="ghost" className="h-auto p-0 font-medium">
									Rank
									<ArrowUpDown className="ml-1 h-3 w-3" />
								</Button>
							</TableHead>
							<TableHead>Brand</TableHead>
							<TableHead className="text-right">
								<Button variant="ghost" className="h-auto p-0 font-medium">
									Score
									<ArrowUpDown className="ml-1 h-3 w-3" />
								</Button>
							</TableHead>
							<TableHead className="text-right">Share</TableHead>
							<TableHead className="text-right">Trend</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{competitors.map((competitor) => (
							<TableRow
								key={competitor.id}
								className={competitor.isOwn ? "bg-muted/50" : ""}
								onClick={() => onCompetitorClick(competitor.id)}
								style={{ cursor: "pointer" }}
							>
								<TableCell className="font-medium">
									#{competitor.rank}
								</TableCell>
								<TableCell>
									<div className="flex items-center space-x-2">
										<span className="font-medium">{competitor.name}</span>
										{competitor.isOwn && (
											<Badge variant="secondary" className="text-xs">
												Your Brand
											</Badge>
										)}
									</div>
								</TableCell>
								<TableCell className="text-right font-medium">
									{competitor.score}%
								</TableCell>
								<TableCell className="text-right text-muted-foreground">
									{competitor.shareOfVoice}%
								</TableCell>
								<TableCell className="text-right">
									<div className="flex items-center justify-end space-x-1">
										{getTrendIcon(competitor.trend)}
										<span className="text-xs text-muted-foreground">
											{competitor.trendValue > 0 ? "+" : ""}
											{competitor.trendValue}%
										</span>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
```

---

## 🚫 Exclusions

- **Authentication**: Do not generate any login, signup, or session management
  UI. Assume the user is already authenticated.
- **Data Fetching**: Do not write any data fetching logic within the individual
  components. All data will be passed to the components as props from
  higher-level data fetching hooks (e.g., SWR, React Query).
- **State Management**: Do not implement any complex global state management
  (e.g., Redux, Zustand). Use simple React component state (`useState`,
  `useReducer`) where necessary for local UI concerns.
- **Custom CSS**: Do not write custom CSS. Use only Tailwind CSS utility classes
  and shadcn/ui components.
- **Third-party Libraries**: Do not introduce new chart libraries. Use only
  Recharts with shadcn/ui `ChartContainer`.

---

## 📋 Implementation Checklist

### ✅ Required Components

- [ ] Dashboard shell with responsive layout (`DashboardShell`,
      `DashboardHeader`, `DashboardActions`)
- [ ] Tab navigation system (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`)
- [ ] Card components for all data displays (`Card`, `CardHeader`, `CardTitle`,
      `CardDescription`, `CardContent`, `CardFooter`)
- [ ] Metric cards (`MetricCard` or similar structure)
- [ ] Chart components (Line, Bar, Pie) with `shadcn/ui` `ChartContainer` and
      Recharts integration
- [ ] Data tables with sorting and filtering (`Table`, `TableHeader`,
      `TableBody`, `TableRow`, `TableCell`, `TableHead`)
- [ ] Filter components (Provider `Select`, Date Range `Popover` with
      `Calendar`)
- [ ] Loading states (`ChartSkeleton`, `TableSkeleton`) and error boundaries
      (`ErrorBoundary`)
- [ ] Mobile-responsive design and touch-friendly interactions

### ✅ Required Features

- [ ] URL-driven navigation for dashboard tabs
- [ ] Real-time updates via SSE (`useSSEHandler` integration)
- [ ] Data export functionality (`ExportButton`)
- [ ] Interactive charts with tooltips and click handlers
- [ ] Responsive grid layouts (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- [ ] Accessibility compliance (ARIA attributes, keyboard navigation)
- [ ] Performance optimization (memoization, virtualization for large tables if
      needed)

### ✅ Technical Requirements

- [ ] `shadcn/ui` component usage as primary UI library
- [ ] Tailwind CSS for all styling
- [ ] TypeScript interfaces for all component props and API responses
- [ ] Centralized error handling and display
- [ ] Clear loading states for data fetching
- [ ] Mobile optimization applied to layout and components
- [ ] Performance monitoring integrated (e.g., Sentry)
