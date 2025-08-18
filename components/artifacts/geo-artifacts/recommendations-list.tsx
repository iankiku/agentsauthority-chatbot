import { cn } from '@/lib/utils';
import { ArrowRight, Target } from 'lucide-react';
import type { RecommendationsSectionProps } from './types';

export function RecommendationsList({
  recommendations,
  className,
}: RecommendationsSectionProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p>No recommendations available</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Actionable Recommendations
        </h3>
      </div>

      <div className="grid gap-3">
        {recommendations.map((recommendation, index) => (
          <div
            key={`recommendation-${index}-${recommendation.slice(0, 20)}`}
            className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed">
              {recommendation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
