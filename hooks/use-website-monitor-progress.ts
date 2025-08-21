import { useEffect, useState } from 'react';
import type { TaskProgress } from '../lib/sse/progress-tracker';

export function useWebsiteMonitorProgress(taskId: string) {
  const [progress, setProgress] = useState<TaskProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    const eventSource = new EventSource(
      `/api/website-monitor/progress/${taskId}`,
    );

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'connected':
          console.log(
            'Website monitoring SSE connected for task:',
            data.taskId,
          );
          break;
        case 'progress':
          setProgress(data.progress);
          break;
        case 'error':
          setError(data.message);
          break;
        case 'heartbeat':
          // Keep connection alive
          break;
      }
    };

    eventSource.onerror = (error) => {
      setError('Website monitoring connection failed');
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [taskId]);

  return { progress, error, isConnected };
}
