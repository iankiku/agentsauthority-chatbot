'use client';

import { Loader2, Wifi, WifiOff, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useSSEProgress } from '../hooks/use-sse-progress';
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
import { Progress } from './ui/progress';

export function SSEProgressDemo() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [demoTaskId, setDemoTaskId] = useState<string | null>(null);

  const {
    progress,
    error,
    isConnected,
    isConnecting,
    connectionTime,
    lastUpdate,
    reconnect,
    disconnect,
  } = useSSEProgress(taskId, {
    autoReconnect: true,
    maxReconnectAttempts: 3,
    reconnectDelay: 2000,
    onProgress: (progress) => {
      console.log('Progress update:', progress);
    },
    onError: (error) => {
      console.error('SSE Error:', error);
    },
    onConnect: () => {
      console.log('SSE Connected');
    },
    onDisconnect: () => {
      console.log('SSE Disconnected');
    },
  });

  const startDemo = () => {
    const newTaskId = `demo-${Date.now()}`;
    setDemoTaskId(newTaskId);
    setTaskId(newTaskId);
  };

  const stopDemo = () => {
    disconnect();
    setTaskId(null);
    setDemoTaskId(null);
  };

  const getStatusIcon = () => {
    if (isConnecting) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isConnected) return <Wifi className="h-4 w-4 text-green-500" />;
    return <WifiOff className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = () => {
    if (!progress) return 'bg-gray-100';
    switch (progress.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            SSE Progress Demo
            {getStatusIcon()}
          </CardTitle>
          <CardDescription>
            Demonstrates real-time progress tracking with Server-Sent Events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={startDemo} disabled={isConnected}>
              Start Demo
            </Button>
            <Button
              onClick={stopDemo}
              disabled={!isConnected}
              variant="outline"
            >
              Stop Demo
            </Button>
            {error && (
              <Button onClick={reconnect} variant="secondary">
                Reconnect
              </Button>
            )}
          </div>

          {error && (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Connection Status:</strong>
              <Badge
                variant={isConnected ? 'default' : 'secondary'}
                className="ml-2"
              >
                {isConnected
                  ? 'Connected'
                  : isConnecting
                    ? 'Connecting'
                    : 'Disconnected'}
              </Badge>
            </div>
            <div>
              <strong>Task ID:</strong> {demoTaskId || 'None'}
            </div>
            <div>
              <strong>Connected:</strong> {formatTime(connectionTime)}
            </div>
            <div>
              <strong>Last Update:</strong> {formatTime(lastUpdate)}
            </div>
          </div>

          {progress && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <Badge className={getStatusColor()}>
                  {progress.status.toUpperCase()}
                </Badge>
              </div>

              <Progress value={progress.progress} className="w-full" />

              <div className="text-sm space-y-1">
                <div>
                  <strong>Stage:</strong> {progress.stage}
                </div>
                <div>
                  <strong>Message:</strong> {progress.message}
                </div>
                {progress.estimatedTimeRemaining && (
                  <div>
                    <strong>ETA:</strong>{' '}
                    {Math.round(progress.estimatedTimeRemaining / 1000)}s
                  </div>
                )}
                {progress.startTime && (
                  <div>
                    <strong>Started:</strong> {formatTime(progress.startTime)}
                  </div>
                )}
                {progress.endTime && (
                  <div>
                    <strong>Completed:</strong> {formatTime(progress.endTime)}
                  </div>
                )}
              </div>

              {progress.results && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <strong>Results:</strong>
                  <pre className="text-xs mt-1 overflow-auto">
                    {JSON.stringify(progress.results, null, 2)}
                  </pre>
                </div>
              )}

              {progress.error && (
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{progress.error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {!progress && isConnected && (
            <div className="text-center text-gray-500 py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Waiting for progress updates...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
