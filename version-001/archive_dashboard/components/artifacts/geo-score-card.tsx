"use client"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
import { TrendingUp, TrendingDown, ArrowRight, Sparkles, Brain, Search, MessageSquare } from "lucide-react"

export function GeoScoreCard() {
  const overallScore = 73
  const previousScore = 68
  const trend = overallScore > previousScore ? "up" : "down"
  const trendValue = Math.abs(overallScore - previousScore)

  const platformScores = [
    { name: "ChatGPT", score: 78, icon: Brain, color: "text-green-500" },
    { name: "Claude", score: 71, icon: MessageSquare, color: "text-blue-500" },
    { name: "Gemini", score: 69, icon: Search, color: "text-yellow-500" },
    { name: "Perplexity", score: 74, icon: Sparkles, color: "text-purple-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center py-8">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="text-6xl font-bold text-white">{overallScore}</div>
          <div className="text-left">
            <div className="text-sm text-zinc-400">GEO Score</div>
            <div className={`flex items-center text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {trend === "up" ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {trend === "up" ? "+" : "-"}
              {trendValue} from last week
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Progress value={overallScore} className="h-3 mb-2" />
          <p className="text-sm text-zinc-400">
            Your brand appears in <span className="text-orange-400 font-semibold">73%</span> of relevant AI search
            results
          </p>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Platform Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {platformScores.map((platform) => {
            const Icon = platform.icon
            return (
              <div key={platform.name} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${platform.color}`} />
                    <span className="text-white font-medium">{platform.name}</span>
                  </div>
                  <Badge variant="outline" className="border-zinc-600 text-zinc-300">
                    {platform.score}%
                  </Badge>
                </div>
                <Progress value={platform.score} className="h-2" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-medium">Strong Performance</p>
              <p className="text-sm text-zinc-300">ChatGPT mentions your brand 78% of the time for industry queries</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <ArrowRight className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-orange-400 font-medium">Opportunity</p>
              <p className="text-sm text-zinc-300">
                Gemini visibility is 9% below average - optimize your knowledge base content
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-1">
          View Detailed Report
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 flex-1 bg-transparent">
          Get Optimization Tips
        </Button>
      </div>
    </div>
  )
}
