"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import { Globe, Download, TrendingUp, TrendingDown, MessageCircle, Heart, Share2, Filter, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

const brandData = {
  sentiment: {
    positive: 68,
    neutral: 24,
    negative: 8,
    overall: "positive",
    change: 5,
  },
  mentions: {
    total: 1247,
    change: 15.2,
    breakdown: [
      { source: "ChatGPT", count: 456, percentage: 36.6 },
      { source: "Claude", count: 312, percentage: 25.0 },
      { source: "Gemini", count: 289, percentage: 23.2 },
      { source: "Perplexity", count: 190, percentage: 15.2 },
    ],
  },
  topics: [
    { name: "Product Features", mentions: 342, sentiment: 72, trend: "up" },
    { name: "Customer Service", mentions: 298, sentiment: 85, trend: "up" },
    { name: "Pricing", mentions: 234, sentiment: 45, trend: "down" },
    { name: "Innovation", mentions: 189, sentiment: 78, trend: "up" },
    { name: "Reliability", mentions: 184, sentiment: 81, trend: "stable" },
  ],
  brandHealth: {
    awareness: 73,
    consideration: 68,
    preference: 62,
    loyalty: 71,
  },
  keyMentions: [
    {
      id: 1,
      platform: "ChatGPT",
      content: "YourBrand offers excellent customer service and innovative solutions...",
      sentiment: "positive",
      engagement: 89,
      date: "2024-01-15",
    },
    {
      id: 2,
      platform: "Claude",
      content: "When comparing alternatives, YourBrand stands out for reliability...",
      sentiment: "positive",
      engagement: 76,
      date: "2024-01-14",
    },
    {
      id: 3,
      platform: "Gemini",
      content: "YourBrand's pricing model could be more competitive compared to...",
      sentiment: "neutral",
      engagement: 54,
      date: "2024-01-13",
    },
  ],
}

export default function BrandReportsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <h1 className="text-lg font-semibold">Brand Reports</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h2 className="text-3xl font-bold">Brand Intelligence</h2>
              <p className="text-muted-foreground">
                Monitor brand mentions, sentiment, and perception across AI platforms
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

          {/* Brand Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    +{brandData.brandHealth.awareness - 68}%
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold">{brandData.brandHealth.awareness}%</p>
                  <p className="text-sm text-muted-foreground">Brand Awareness</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="w-8 h-8 text-red-500" />
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    +{brandData.brandHealth.consideration - 65}%
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold">{brandData.brandHealth.consideration}%</p>
                  <p className="text-sm text-muted-foreground">Consideration</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                    -{68 - brandData.brandHealth.preference}%
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold">{brandData.brandHealth.preference}%</p>
                  <p className="text-sm text-muted-foreground">Preference</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Share2 className="w-8 h-8 text-blue-500" />
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    +{brandData.brandHealth.loyalty - 68}%
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold">{brandData.brandHealth.loyalty}%</p>
                  <p className="text-sm text-muted-foreground">Loyalty</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl font-bold text-green-600">{brandData.sentiment.positive}%</span>
                      <TrendingUp className="w-6 h-6 text-green-500" />
                      <span className="text-lg text-green-500">+{brandData.sentiment.change}%</span>
                    </div>
                    <p className="text-muted-foreground">Overall Positive Sentiment</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-medium">Positive</span>
                      <span className="font-semibold">{brandData.sentiment.positive}%</span>
                    </div>
                    <Progress value={brandData.sentiment.positive} className="h-3 bg-green-100" />

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-medium">Neutral</span>
                      <span className="font-semibold">{brandData.sentiment.neutral}%</span>
                    </div>
                    <Progress value={brandData.sentiment.neutral} className="h-3 bg-gray-100" />

                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-medium">Negative</span>
                      <span className="font-semibold">{brandData.sentiment.negative}%</span>
                    </div>
                    <Progress value={brandData.sentiment.negative} className="h-3 bg-red-100" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mention Volume */}
            <Card>
              <CardHeader>
                <CardTitle>Mention Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl font-bold">{brandData.mentions.total.toLocaleString()}</span>
                      <TrendingUp className="w-6 h-6 text-green-500" />
                      <span className="text-lg text-green-500">+{brandData.mentions.change}%</span>
                    </div>
                    <p className="text-muted-foreground">Total Mentions This Month</p>
                  </div>

                  <div className="space-y-4">
                    {brandData.mentions.breakdown.map((source) => (
                      <div key={source.source} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MessageCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{source.source}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                          <span className="font-semibold">{source.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Topic Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brandData.topics.map((topic) => (
                  <div key={topic.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{topic.name}</h4>
                      <div className="flex items-center space-x-2">
                        {topic.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : topic.trend === "down" ? (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        ) : null}
                        <Badge
                          className={
                            topic.sentiment >= 70
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : topic.sentiment >= 50
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                          }
                        >
                          {topic.sentiment}% positive
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{topic.mentions} mentions</span>
                      <Progress value={topic.sentiment} className="w-32 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Mentions */}
          <Card>
            <CardHeader>
              <CardTitle>Key Mentions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brandData.keyMentions.map((mention) => (
                  <div key={mention.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{mention.platform}</Badge>
                        <Badge
                          className={
                            mention.sentiment === "positive"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : mention.sentiment === "neutral"
                                ? "bg-gray-500/10 text-gray-600 border-gray-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                          }
                        >
                          {mention.sentiment}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{mention.engagement}% engagement</p>
                        <p className="text-xs text-muted-foreground">{new Date(mention.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{mention.content}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
