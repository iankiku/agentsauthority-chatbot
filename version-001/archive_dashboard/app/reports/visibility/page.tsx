"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import {
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
  Brain,
  MessageSquare,
  Search,
  Sparkles,
  Filter,
  ArrowRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

const visibilityData = {
  overall: {
    score: 73,
    change: 5,
    trend: "up",
    lastUpdated: "2024-01-15",
  },
  platforms: [
    {
      name: "ChatGPT",
      score: 78,
      change: 3,
      trend: "up",
      icon: Brain,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Claude",
      score: 71,
      change: 2,
      trend: "up",
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Gemini",
      score: 69,
      change: -1,
      trend: "down",
      icon: Search,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      name: "Perplexity",
      score: 74,
      change: 4,
      trend: "up",
      icon: Sparkles,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ],
  categories: [
    { name: "Product Queries", score: 82, change: 6 },
    { name: "Brand Mentions", score: 75, change: 3 },
    { name: "Industry Topics", score: 68, change: -2 },
    { name: "Comparison Queries", score: 71, change: 8 },
  ],
  timeframes: [
    { period: "Last 7 days", score: 73, change: 2 },
    { period: "Last 30 days", score: 71, change: 5 },
    { period: "Last 90 days", score: 68, change: 12 },
  ],
}

export default function VisibilityReportsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <h1 className="text-lg font-semibold">Visibility Reports</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-3xl font-bold">AI Visibility Analysis</h2>
              <p className="text-muted-foreground">
                Track your brand's visibility across AI platforms and search engines
              </p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="30">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Overall Score */}
          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Overall Visibility Score</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-5xl font-bold text-orange-600">{visibilityData.overall.score}</span>
                    <div className="flex items-center space-x-2">
                      {visibilityData.overall.trend === "up" ? (
                        <TrendingUp className="w-6 h-6 text-green-500" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-500" />
                      )}
                      <span
                        className={`text-lg font-semibold ${
                          visibilityData.overall.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {visibilityData.overall.trend === "up" ? "+" : ""}
                        {visibilityData.overall.change}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Last updated: {new Date(visibilityData.overall.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-32 h-32 relative">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${visibilityData.overall.score}, 100`}
                        className="text-orange-500"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted-foreground opacity-20"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-orange-600">{visibilityData.overall.score}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibilityData.platforms.map((platform) => {
                  const Icon = platform.icon
                  return (
                    <div key={platform.name} className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${platform.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${platform.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{platform.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold">{platform.score}%</span>
                            <div className="flex items-center">
                              {platform.trend === "up" ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                              <span
                                className={`text-sm ${platform.trend === "up" ? "text-green-500" : "text-red-500"}`}
                              >
                                {platform.trend === "up" ? "+" : ""}
                                {platform.change}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Progress value={platform.score} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {visibilityData.categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{category.score}%</span>
                          <span className={`text-sm ${category.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {category.change >= 0 ? "+" : ""}
                            {category.change}%
                          </span>
                        </div>
                      </div>
                      <Progress value={category.score} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Time-based Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Historical Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {visibilityData.timeframes.map((timeframe) => (
                  <div key={timeframe.period} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{timeframe.period}</h4>
                      <p className="text-sm text-muted-foreground">Average visibility score</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{timeframe.score}%</span>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">+{timeframe.change}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Insights and Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-200">Strong ChatGPT Performance</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your brand appears in 78% of relevant ChatGPT responses, showing excellent optimization for this
                      platform.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Gemini Optimization Needed</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Gemini visibility is 9% below average. Consider optimizing your knowledge base content and
                      structured data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Product Query Excellence</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your brand dominates product-related queries with 82% visibility. This is your strongest category.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
