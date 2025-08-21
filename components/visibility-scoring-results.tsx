'use client';

import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Lightbulb,
  Loader2,
  Target,
  TrendingUp,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useSSEProgress } from '../hooks/use-sse-progress';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface BrandScore {
  brandName: string;
  visibilityScore: number;
  mentionCount: number;
  sentimentScore: number;
  contextRelevance: number;
  reachScore: number;
  confidence: number;
  breakdown: {
    mentions: number;
    sentiment: number;
    context: number;
    reach: number;
  };
}

interface CompetitivePositioning {
  targetBrandRank: number;
  marketPosition: 'leader' | 'challenger' | 'follower' | 'niche';
  competitiveAdvantage: string[];
  competitiveDisadvantage: string[];
  marketShare: number;
  growthPotential: number;
}

interface ShareOfVoice {
  total: number;
  breakdown: Record<string, number>;
  channelDistribution: Record<string, number>;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface CompetitiveRanking {
  rank: number;
  brandName: string;
  visibilityScore: number;
  change: number;
  confidence: number;
}

interface Insight {
  keyFindings: string[];
  opportunities: string[];
  threats: string[];
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    impact: number;
    effort: number;
  }>;
}

interface VisibilityScoringResult {
  brandName: string;
  competitors: string[];
  brandScores: BrandScore[];
  competitivePositioning: CompetitivePositioning;
  shareOfVoice: ShareOfVoice;
  competitiveRankings: CompetitiveRanking[];
  trendAnalysis?: any;
  insights: Insight;
  metadata: {
    scoringWeights: Record<string, number>;
    totalBrands: number;
    analysisTime: number;
    category: 'visibility-scoring';
  };
}

interface VisibilityScoringResultsProps {
  taskId: string;
  onComplete?: (results: VisibilityScoringResult) => void;
}

export function VisibilityScoringResults({
  taskId,
  onComplete,
}: VisibilityScoringResultsProps) {
  const [results, setResults] = useState<VisibilityScoringResult | null>(null);

  const {
    progress,
    error,
    isConnected,
    isConnecting,
    connectionTime,
    lastUpdate,
  } = useSSEProgress(taskId, {
    autoReconnect: true,
    maxReconnectAttempts: 3,
    onProgress: (progressData) => {
      if (progressData.results) {
        setResults(progressData.results as VisibilityScoringResult);
        if (onComplete) {
          onComplete(progressData.results as VisibilityScoringResult);
        }
      }
    },
    onError: (error) => {
      console.error('SSE Error:', error);
    },
  });

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'leader':
        return 'bg-green-100 text-green-800';
      case 'challenger':
        return 'bg-blue-100 text-blue-800';
      case 'follower':
        return 'bg-yellow-100 text-yellow-800';
      case 'niche':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading visibility scoring results: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!results && !progress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Initializing Visibility Scoring Analysis
          </CardTitle>
          <CardDescription>Setting up competitive analysis...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!results && progress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            {progress.stage}
          </CardTitle>
          <CardDescription>{progress.message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress.progress} className="w-full" />
          <div className="mt-2 text-sm text-muted-foreground">
            {progress.progress}% complete
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Visibility Scoring Results: {results.brandName}
          </CardTitle>
          <CardDescription>
            Competitive analysis completed at{' '}
            {new Date(results.metadata.analysisTime).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {results.competitivePositioning.targetBrandRank}
              </div>
              <div className="text-sm text-muted-foreground">Market Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.competitivePositioning.marketShare.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Market Share</div>
            </div>
            <div className="text-center">
              <Badge
                className={getPositionColor(
                  results.competitivePositioning.marketPosition,
                )}
              >
                {results.competitivePositioning.marketPosition}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Position</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Results */}
      <Tabs defaultValue="scores" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scores">Brand Scores</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="voice">Share of Voice</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Visibility Scores</CardTitle>
              <CardDescription>
                Detailed scoring breakdown for all analyzed brands
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.brandScores.map((score, index) => (
                  <div key={score.brandName} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{score.brandName}</h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {score.visibilityScore.toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Score
                        </div>
                      </div>
                    </div>
                    <Progress value={score.visibilityScore} className="mb-3" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <div className="font-medium">Mentions</div>
                        <div className="text-muted-foreground">
                          {score.mentionCount}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Sentiment</div>
                        <div className="text-muted-foreground">
                          {score.sentimentScore.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Context</div>
                        <div className="text-muted-foreground">
                          {score.contextRelevance.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Reach</div>
                        <div className="text-muted-foreground">
                          {score.reachScore.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Rankings</CardTitle>
              <CardDescription>
                Market position and competitive landscape
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.competitiveRankings.map((ranking) => (
                  <div
                    key={ranking.brandName}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">
                        {ranking.rank}
                      </div>
                      <div>
                        <div className="font-medium">{ranking.brandName}</div>
                        <div className="text-sm text-muted-foreground">
                          Confidence: {(ranking.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {ranking.visibilityScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Share of Voice
                {getTrendIcon(results.shareOfVoice.trend)}
              </CardTitle>
              <CardDescription>
                Market share distribution and channel analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {results.shareOfVoice.total.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {results.brandName} Share of Voice
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Brand Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(results.shareOfVoice.breakdown).map(
                      ([brand, share]) => (
                        <div
                          key={brand}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{brand}</span>
                          <span className="font-medium">
                            {share.toFixed(1)}%
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Channel Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(
                      results.shareOfVoice.channelDistribution,
                    ).map(([channel, share]) => (
                      <div
                        key={channel}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm capitalize">{channel}</span>
                        <span className="font-medium">{share.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Insights & Recommendations
              </CardTitle>
              <CardDescription>
                Actionable insights and strategic recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Findings */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Key Findings
                </h4>
                <ul className="space-y-1">
                  {results.insights.keyFindings.map((finding, index) => (
                    <li
                      key={`finding-${index}-${finding.substring(0, 20)}`}
                      className="text-sm text-muted-foreground"
                    >
                      • {finding}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              {results.insights.opportunities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Opportunities
                  </h4>
                  <ul className="space-y-1">
                    {results.insights.opportunities.map(
                      (opportunity, index) => (
                        <li
                          key={`opportunity-${index}-${opportunity.substring(0, 20)}`}
                          className="text-sm text-muted-foreground"
                        >
                          • {opportunity}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              {/* Threats */}
              {results.insights.threats.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Threats
                  </h4>
                  <ul className="space-y-1">
                    {results.insights.threats.map((threat, index) => (
                      <li
                        key={`threat-${index}-${threat.substring(0, 20)}`}
                        className="text-sm text-muted-foreground"
                      >
                        • {threat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <div className="space-y-3">
                  {results.insights.recommendations.map((rec, index) => (
                    <div
                      key={`rec-${index}-${rec.category}-${rec.description.substring(0, 20)}`}
                      className="border rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority} priority
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          Impact: {rec.impact}/10 | Effort: {rec.effort}/10
                        </div>
                      </div>
                      <div className="font-medium mb-1">{rec.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {rec.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
