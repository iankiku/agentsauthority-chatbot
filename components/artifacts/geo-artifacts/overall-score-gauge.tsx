import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { OverallScoreGaugeProps } from './types';

export function OverallScoreGauge({ score, maxScore = 100, className }: OverallScoreGaugeProps) {
  const percentage = (score / maxScore) * 100;
  
  // Determine color based on score
  const getColorClass = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Visibility Score</h3>
        <div className={cn(
          'inline-flex items-center justify-center w-24 h-24 rounded-full border-4 font-bold text-2xl',
          getColorClass(score)
        )}>
          {score}
        </div>
        <p className="text-sm text-gray-600 mt-2">out of {maxScore}</p>
      </div>
      
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Low</span>
          <span>High</span>
        </div>
        <Progress 
          value={percentage} 
          className={cn('h-3', getProgressColor(score))}
        />
      </div>
      
      <div className="text-center">
        <p className={cn(
          'text-sm font-medium',
          score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600'
        )}>
          {score >= 70 ? 'Excellent' : score >= 40 ? 'Good' : 'Needs Improvement'}
        </p>
      </div>
    </div>
  );
}
