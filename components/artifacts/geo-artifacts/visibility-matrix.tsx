import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { InsightsSection } from './insights-section';
import { ModelScoreCard } from './model-score-card';
import { OverallScoreGauge } from './overall-score-gauge';
import { RecommendationsList } from './recommendations-list';
import type { VisibilityMatrixProps } from './types';

export function VisibilityMatrix({ data, className, showExportOptions = false, onModelClick }: VisibilityMatrixProps) {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className={cn('w-full max-w-6xl mx-auto', className)}>
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Brand Visibility Analysis: {data.brandName}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatTimestamp(data.timestamp)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{data.timeframe} analysis</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{data.metadata.modelsQueried.length} models analyzed</span>
              </div>
            </div>
          </div>
          
          {showExportOptions && (
            <div className="flex gap-2">
              <button type="button" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export PDF
              </button>
              <button type="button" className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Copy Data
              </button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Overall Score Section */}
        <div className="flex justify-center">
          <OverallScoreGauge score={data.overallVisibility} />
        </div>
        
        {/* Model Comparison Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Model Performance Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.modelResults.map((result) => (
              <ModelScoreCard
                key={result.model}
                model={result.model}
                score={result.visibility_score}
                mentions={result.mentions}
                sentiment={result.sentiment}
                executionTime={result.execution_time}
                success={result.success}
                onClick={onModelClick ? () => onModelClick(result.model) : undefined}
              />
            ))}
          </div>
        </div>
        
        {/* Insights and Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InsightsSection insights={data.insights} />
          <RecommendationsList recommendations={data.recommendations} />
        </div>
        
        {/* Metadata Footer */}
        <div className="border-t pt-4">
          <div className="flex flex-wrap justify-between text-xs text-gray-500">
            <span>Analysis completed in {data.metadata.executionTime}ms</span>
            <span>Category: {data.metadata.category}</span>
            <span>Queries used: {data.metadata.queriesUsed.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
