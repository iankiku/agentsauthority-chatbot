'use client';

import { AlertTriangle, Loader2, Play, Target } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { VisibilityScoringResults } from './visibility-scoring-results';

export function VisibilityScoringDemo() {
  const [brandName, setBrandName] = useState('Tesla');
  const [competitors, setCompetitors] = useState('Ford, GM, Volkswagen, BMW');
  const [isRunning, setIsRunning] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartAnalysis = async () => {
    setIsRunning(true);
    setError(null);

    const competitorsList = competitors
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (competitorsList.length === 0) {
      setError('Please enter at least one competitor');
      setIsRunning(false);
      return;
    }

    try {
      // Generate a unique task ID
      const newTaskId = `visibility-demo-${Date.now()}`;
      setTaskId(newTaskId);

      // Simulate the analysis process
      // In a real implementation, this would call the actual tool
      await simulateVisibilityAnalysis(newTaskId, brandName, competitorsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsRunning(false);
    }
  };

  const simulateVisibilityAnalysis = async (
    taskId: string,
    brandName: string,
    competitors: string[],
  ) => {
    // This is a simulation - in real implementation, this would call the actual tool
    // For demo purposes, we'll just show the progress and results

    // Simulate analysis steps
    const steps = [
      {
        progress: 10,
        stage: 'Initializing',
        message: 'Setting up competitive analysis...',
      },
      {
        progress: 25,
        stage: 'Calculating brand scores',
        message: 'Analyzing brand visibility metrics...',
      },
      {
        progress: 40,
        stage: 'Analyzing competitive positioning',
        message: 'Determining market position and competitive landscape...',
      },
      {
        progress: 60,
        stage: 'Calculating share of voice',
        message: 'Computing market share and voice distribution...',
      },
      {
        progress: 80,
        stage: 'Generating competitive rankings',
        message: 'Creating competitive rankings and analysis...',
      },
      {
        progress: 95,
        stage: 'Analyzing trends and generating insights',
        message: 'Processing trends and creating actionable insights...',
      },
      {
        progress: 100,
        stage: 'Completed',
        message: 'Visibility scoring analysis completed successfully',
      },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing time
    }

    setIsRunning(false);
  };

  const handleReset = () => {
    setTaskId(null);
    setError(null);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Visibility Scoring Demo
          </CardTitle>
          <CardDescription>
            Test the competitive visibility scoring tool with real-time progress
            tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!taskId ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Target Brand</Label>
                  <Input
                    id="brandName"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter brand name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitors">
                    Competitors (comma-separated)
                  </Label>
                  <Input
                    id="competitors"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    placeholder="Ford, GM, Volkswagen"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleStartAnalysis}
                  disabled={isRunning || !brandName.trim()}
                  className="flex items-center gap-2"
                >
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isRunning
                    ? 'Starting Analysis...'
                    : 'Start Visibility Analysis'}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  This demo will simulate a visibility scoring analysis with:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Real-time progress tracking via SSE</li>
                  <li>Competitive positioning analysis</li>
                  <li>Share of voice calculations</li>
                  <li>Actionable insights and recommendations</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Analysis in Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Task ID: {taskId}
                  </p>
                </div>
                <Button variant="outline" onClick={handleReset}>
                  Reset Demo
                </Button>
              </div>

              <VisibilityScoringResults
                taskId={taskId}
                onComplete={(results) => {
                  console.log('Analysis completed:', results);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Information */}
      <Card>
        <CardHeader>
          <CardTitle>About Visibility Scoring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">What it does:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Calculates visibility scores (0-100) for all brands</li>
                <li>• Provides competitive positioning analysis</li>
                <li>• Calculates share of voice metrics</li>
                <li>• Generates competitive rankings</li>
                <li>• Provides actionable insights and recommendations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Key Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time progress tracking</li>
                <li>• Customizable scoring weights</li>
                <li>• Historical trend analysis</li>
                <li>• Multi-channel distribution</li>
                <li>• Confidence scoring</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Scoring Factors:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="secondary">Mentions (30%)</Badge>
              <Badge variant="secondary">Sentiment (20%)</Badge>
              <Badge variant="secondary">Context (20%)</Badge>
              <Badge variant="secondary">Reach (30%)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

