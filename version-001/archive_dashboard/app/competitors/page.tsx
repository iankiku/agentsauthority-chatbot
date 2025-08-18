"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { 
  Search, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Eye,
  AlertTriangle,
  Target,
  BarChart3,
  Users,
  Zap
} from "lucide-react";

interface Competitor {
  id: string;
  name: string;
  website: string;
  industry: string;
  overallScore: number;
  platformScores: {
    chatgpt: number;
    claude: number;
    gemini: number;
    perplexity: number;
  };
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  lastUpdated: string;
  keyStrengths: string[];
  vulnerabilities: string[];
  sharedQueries: number;
  mentionFrequency: number;
}

// Mock competitor data
const mockCompetitors: Competitor[] = [
  {
    id: "1",
    name: "CompetitorA",
    website: "competitora.com",
    industry: "SaaS",
    overallScore: 78,
    platformScores: {
      chatgpt: 82,
      claude: 75,
      gemini: 80,
      perplexity: 76
    },
    trend: 'up',
    trendValue: 12,
    lastUpdated: "2 hours ago",
    keyStrengths: ["Strong ChatGPT presence", "Excellent documentation", "Active community"],
    vulnerabilities: ["Weak Perplexity visibility", "Limited case studies"],
    sharedQueries: 23,
    mentionFrequency: 156
  },
  {
    id: "2",
    name: "CompetitorB",
    website: "competitorb.com",
    industry: "SaaS",
    overallScore: 65,
    platformScores: {
      chatgpt: 60,
      claude: 68,
      gemini: 67,
      perplexity: 65
    },
    trend: 'down',
    trendValue: -8,
    lastUpdated: "4 hours ago",
    keyStrengths: ["Balanced platform presence", "Good pricing visibility"],
    vulnerabilities: ["Low overall authority", "Inconsistent messaging"],
    sharedQueries: 18,
    mentionFrequency: 89
  },
  {
    id: "3",
    name: "CompetitorC",
    website: "competitorc.com",
    industry: "SaaS",
    overallScore: 72,
    platformScores: {
      chatgpt: 70,
      claude: 78,
      gemini: 69,
      perplexity: 71
    },
    trend: 'stable',
    trendValue: 2,
    lastUpdated: "1 hour ago",
    keyStrengths: ["Strong Claude presence", "Technical authority"],
    vulnerabilities: ["Limited ChatGPT visibility", "Narrow content focus"],
    sharedQueries: 31,
    mentionFrequency: 134
  }
];

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>(mockCompetitors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);

  const filteredCompetitors = competitors.filter(competitor =>
    competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    competitor.website.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-default-font">Competitor Intelligence</h1>
            <p className="text-subtext-color mt-2">
              Track and analyze your competitors' AI search performance
            </p>
          </div>
          <Button onClick={() => setIsAddingCompetitor(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Competitor
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search competitors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="matrix">Comparison Matrix</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="gaps">Opportunity Gaps</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tracked Competitors</p>
                      <p className="text-2xl font-bold">{competitors.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Competitor Score</p>
                      <p className="text-2xl font-bold">
                        {Math.round(competitors.reduce((acc, c) => acc + c.overallScore, 0) / competitors.length)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Threats Detected</p>
                      <p className="text-2xl font-bold">
                        {competitors.filter(c => c.trend === 'up').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Opportunities</p>
                      <p className="text-2xl font-bold">
                        {competitors.filter(c => c.trend === 'down').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Competitors List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCompetitors.map((competitor) => (
                <Card key={competitor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{competitor.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{competitor.website}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(competitor.trend, competitor.trendValue)}
                        <span className={`text-sm font-medium ${getTrendColor(competitor.trend)}`}>
                          {competitor.trend === 'stable' ? '±' : ''}{Math.abs(competitor.trendValue)}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Overall Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall GEO Score</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${getScoreColor(competitor.overallScore)}`}>
                          {competitor.overallScore}
                        </span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </div>

                    {/* Platform Scores */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Platform Breakdown</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(competitor.platformScores).map(([platform, score]) => (
                          <div key={platform} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{platform === 'chatgpt' ? 'ChatGPT' : platform}</span>
                            <span className={getScoreColor(score)}>{score}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Shared Queries</p>
                        <p className="text-sm font-medium">{competitor.sharedQueries}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Mention Frequency</p>
                        <p className="text-sm font-medium">{competitor.mentionFrequency}</p>
                      </div>
                    </div>

                    {/* Strengths & Vulnerabilities */}
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-green-700 mb-1">Key Strengths</p>
                        <div className="flex flex-wrap gap-1">
                          {competitor.keyStrengths.slice(0, 2).map((strength, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-red-700 mb-1">Vulnerabilities</p>
                        <div className="flex flex-wrap gap-1">
                          {competitor.vulnerabilities.slice(0, 2).map((vulnerability, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-red-100 text-red-700">
                              {vulnerability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Compare
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Last updated: {competitor.lastUpdated}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matrix">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Comparison Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed comparison matrix coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Trend analysis charts coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaps">
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gap analysis and opportunities coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
