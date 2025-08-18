"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { BarChart3, Download, TrendingUp, TrendingDown, Clock, Target, Zap, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

const performanceData = {
  metrics: [
    {
      name: "Response Time",
      value: "1.2s",
      change: -0.3,
      trend: "up",
      description: "Average AI response time",
      icon: Clock,
    },
    {
      name: "Accuracy Rate",
      value: "94.5%",
      change: 2.1,
      trend: "up",
      description: "Correct brand mentions",
      icon: Target,
    },
    {
      name: "Query Volume",
      value: "12.4K",
      change: 15.2,
      trend: "up",
      description: "Monthly AI queries",
      icon: Zap,
    },
    {
      name: "Conversion Rate",
      value: "8.7%",
      change: 1.3,
      trend: "up",
      description: "Query to action rate",
      icon: TrendingUp,
    },
  ],
  categories: [
    { name: "Brand Awareness", score: 85, target: 90, change: 5 },
    { name: "Product Knowledge", score: 78, target: 85, change: 3 },
    { name: "Customer Support", score: 92, target: 95, change: 7 },
    { name: "Technical Specs", score: 71, target: 80, change: -2 },
    { name: "Pricing Info", score: 88, target: 90, change: 4 },
  ],
  timePerformance: [
    { time: "00:00", queries: 45, accuracy: 92 },
    { time: "04:00", queries: 23, accuracy: 94 },
    { time: "08:00", queries: 156, accuracy: 95 },
    { time: "12:00", queries: 234, accuracy: 93 },
    { time: "16:00", queries: 189, accuracy: 96 },
    { time: "20:00", queries: 98, accuracy: 94 },
  ],
}

export default function PerformanceReportsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <h1 className="text-lg font-semibold">Performance Reports</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-3xl font-bold">Performance Analytics</h2>
              <p className="text-muted-foreground">
                Monitor your AI platform performance metrics and optimization opportunities
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

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceData.metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <Card key={metric.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8 text-muted-foreground" />
                      <div className="flex items-center space-x-1">
                        {metric.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}
                        >
                          {metric.change > 0 ? "+" : ""}
                          {metric.change}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Performance by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {performanceData.categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{category.name}</h4>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">Target: {category.target}%</span>
                      <span className="font-semibold">{category.score}%</span>
                      <span className={`text-sm ${category.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {category.change >= 0 ? "+" : ""}
                        {category.change}%
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={category.score} className="h-3" />
                    <div
                      className="absolute top-0 h-3 w-1 bg-orange-500 rounded-full"
                      style={{ left: `${category.target}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Current: {category.score}%</span>
                    <span>Gap: {category.target - category.score}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Performance */}
            <Card>
              <CardHeader>
                <CardTitle>24-Hour Performance Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.timePerformance.map((period) => (
                    <div key={period.time} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="font-mono text-sm font-medium w-12">{period.time}</span>
                        <div>
                          <p className="text-sm font-medium">{period.queries} queries</p>
                          <p className="text-xs text-muted-foreground">{period.accuracy}% accuracy</p>
                        </div>
                      </div>
                      <div className="w-24">
                        <Progress value={period.accuracy} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">Excellent Customer Support</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        92% accuracy in customer support queries, exceeding industry benchmarks.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start space-x-3">
                    <Target className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Technical Specs Gap</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Technical specifications accuracy is 9% below target. Consider updating product documentation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">Peak Performance Hours</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Best performance between 4-8 PM with 96% accuracy and high query volume.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800 dark:text-orange-200">Query Volume Growth</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        15.2% increase in monthly queries indicates growing AI platform adoption.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🎯 Improve Technical Specs</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Update product documentation to improve technical specification accuracy by 9%.
                  </p>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">📈 Optimize Peak Hours</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Leverage 4-8 PM peak performance window for important announcements.
                  </p>
                  <Button size="sm" variant="outline">
                    Schedule Content
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🚀 Scale Customer Support</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Expand successful customer support model to other categories.
                  </p>
                  <Button size="sm" variant="outline">
                    Learn More
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">⚡ Response Time Optimization</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Further reduce 1.2s response time to improve user experience.
                  </p>
                  <Button size="sm" variant="outline">
                    Optimize Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
