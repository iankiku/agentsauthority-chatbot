"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
import { TrendingUp, TrendingDown, ArrowRight, Crown, Target } from "lucide-react"

interface Competitor {
  name: string
  score: number
  trend: "up" | "down" | "stable"
  trendValue: number
  isYou?: boolean
  platforms: {
    chatgpt: number
    claude: number
    gemini: number
    perplexity: number
  }
}

export function CompetitorMatrix() {
  const competitors: Competitor[] = [
    {
      name: "Your Brand",
      score: 73,
      trend: "up",
      trendValue: 5,
      isYou: true,
      platforms: { chatgpt: 78, claude: 71, gemini: 69, perplexity: 74 },
    },
    {
      name: "Competitor A",
      score: 81,
      trend: "up",
      trendValue: 3,
      platforms: { chatgpt: 85, claude: 79, gemini: 78, perplexity: 82 },
    },
    {
      name: "Competitor B",
      score: 69,
      trend: "down",
      trendValue: 2,
      platforms: { chatgpt: 72, claude: 68, gemini: 65, perplexity: 71 },
    },
    {
      name: "Competitor C",
      score: 76,
      trend: "stable",
      trendValue: 0,
      platforms: { chatgpt: 74, claude: 77, gemini: 75, perplexity: 78 },
    },
    {
      name: "Competitor D",
      score: 64,
      trend: "down",
      trendValue: 4,
      platforms: { chatgpt: 67, claude: 62, gemini: 61, perplexity: 66 },
    },
  ]

  const sortedCompetitors = competitors.sort((a, b) => b.score - a.score)
  const yourRank = sortedCompetitors.findIndex((c) => c.isYou) + 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Crown className="w-5 h-5 text-orange-500" />
          <span className="text-lg font-semibold text-white">Market Position</span>
        </div>
        <p className="text-sm text-zinc-400">
          You rank <span className="text-orange-400 font-semibold">#{yourRank}</span> out of 5 competitors in AI search
          visibility
        </p>
      </div>

      {/* Competitor List */}
      <div className="space-y-3">
        {sortedCompetitors.map((competitor, index) => (
          <div
            key={competitor.name}
            className={`p-4 rounded-lg border transition-all ${
              competitor.isYou
                ? "bg-orange-500/10 border-orange-500/30"
                : "bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0
                      ? "bg-yellow-500 text-black"
                      : index === 1
                        ? "bg-zinc-400 text-black"
                        : index === 2
                          ? "bg-orange-600 text-white"
                          : "bg-zinc-600 text-white"
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${competitor.isYou ? "text-orange-400" : "text-white"}`}>
                      {competitor.name}
                    </span>
                    {competitor.isYou && (
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">You</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-white">{competitor.score}%</span>
                    <div
                      className={`flex items-center text-sm ${
                        competitor.trend === "up"
                          ? "text-green-500"
                          : competitor.trend === "down"
                            ? "text-red-500"
                            : "text-zinc-400"
                      }`}
                    >
                      {competitor.trend === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
                      {competitor.trend === "down" && <TrendingDown className="w-3 h-3 mr-1" />}
                      {competitor.trendValue > 0 && (
                        <span>
                          {competitor.trend === "up" ? "+" : "-"}
                          {competitor.trendValue}%
                        </span>
                      )}
                      {competitor.trend === "stable" && <span>No change</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Progress value={competitor.score} className="w-24 h-2 mb-1" />
                <span className="text-xs text-zinc-400">Overall Score</span>
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              <div className="text-center">
                <div className="text-sm font-medium text-zinc-300 mb-1">ChatGPT</div>
                <div className="text-lg font-bold text-white">{competitor.platforms.chatgpt}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-zinc-300 mb-1">Claude</div>
                <div className="text-lg font-bold text-white">{competitor.platforms.claude}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-zinc-300 mb-1">Gemini</div>
                <div className="text-lg font-bold text-white">{competitor.platforms.gemini}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-zinc-300 mb-1">Perplexity</div>
                <div className="text-lg font-bold text-white">{competitor.platforms.perplexity}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
        <div className="flex items-start space-x-3">
          <Target className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-white font-medium mb-2">Key Opportunity</h4>
            <p className="text-sm text-zinc-300 mb-3">
              Competitor A leads by 8 points. Focus on improving your ChatGPT and Gemini visibility to close the gap.
            </p>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              View Competitor Strategy
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
