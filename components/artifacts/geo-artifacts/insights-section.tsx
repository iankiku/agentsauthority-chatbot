import { cn } from '@/lib/utils';
import { CheckCircle, Lightbulb } from 'lucide-react';
import type { InsightsSectionProps } from './types';

export function InsightsSection({ insights, className }: InsightsSectionProps) {
  if (!insights || insights.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p>No insights available</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={`insight-${index}-${insight.slice(0, 20)}`}
            className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
          >
            <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
