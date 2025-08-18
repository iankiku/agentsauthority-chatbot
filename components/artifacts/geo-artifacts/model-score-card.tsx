import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import type { ModelScoreCardProps } from './types';

export function ModelScoreCard({ 
  model, 
  score, 
  mentions, 
  sentiment, 
  executionTime, 
  success, 
  onClick, 
  className 
}: ModelScoreCardProps) {
  const sentimentColor = {
    positive: 'text-green-600 bg-green-50',
    neutral: 'text-gray-600 bg-gray-50',
    negative: 'text-red-600 bg-red-50'
  };

  const sentimentIcon = {
    positive: '😊',
    neutral: '😐',
    negative: '😞'
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md cursor-pointer',
        onClick && 'hover:scale-105',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{model}</CardTitle>
          <div className="flex items-center gap-2">
            {success ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <Badge variant={score > 50 ? 'default' : 'secondary'}>
              {score}/100
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Mentions:</span>
          <span className="font-medium">{mentions}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Sentiment:</span>
          <div className="flex items-center gap-1">
            <span className="text-lg">{sentimentIcon[sentiment]}</span>
            <span className={cn('px-2 py-1 rounded text-xs font-medium', sentimentColor[sentiment])}>
              {sentiment}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Response Time:</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="font-medium">{executionTime}ms</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Visibility</span>
            <span className={cn('font-medium', getScoreColor(score))}>{score}%</span>
          </div>
          <Progress 
            value={score} 
            className={cn('h-2', getScoreColor(score) === 'text-green-600' ? 'bg-green-500' : 
              getScoreColor(score) === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-red-500')}
          />
        </div>
      </CardContent>
    </Card>
  );
}
