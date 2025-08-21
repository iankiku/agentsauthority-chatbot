import { useCallback, useEffect, useRef, useState } from 'react';

export interface TaskProgress {
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  stage: string;
  progress: number; // 0-100
  message: string;
  estimatedTimeRemaining?: number;
  results?: any;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export interface SSEProgressState {
  progress: TaskProgress | null;
  error: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionTime: number | null;
  lastUpdate: number | null;
}

export interface SSEProgressOptions {
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  onProgress?: (progress: TaskProgress) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useSSEProgress(
  taskId: string | null,
  options: SSEProgressOptions = {},
): SSEProgressState & {
  reconnect: () => void;
  disconnect: () => void;
} {
  const {
    autoReconnect = true,
    maxReconnectAttempts = 3,
    reconnectDelay = 2000,
    onProgress,
    onError,
    onConnect,
    onDisconnect,
  } = options;

  const [state, setState] = useState<SSEProgressState>({
    progress: null,
    error: null,
    isConnected: false,
    isConnecting: false,
    connectionTime: null,
    lastUpdate: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    cleanup();
    setState((prev) => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      error: 'Disconnected by user',
    }));
    onDisconnect?.();
  }, [cleanup, onDisconnect]);

  const connect = useCallback(() => {
    if (!taskId) return;

    cleanup();
    setState((prev) => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      const eventSource = new EventSource(
        `/api/brand-monitor/progress/${taskId}`,
      );
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          connectionTime: Date.now(),
          error: null,
        }));
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'connected':
              console.log('SSE connected for task:', data.taskId);
              break;
            case 'progress':
              setState((prev) => ({
                ...prev,
                progress: data.progress,
                lastUpdate: Date.now(),
                error: null,
              }));
              onProgress?.(data.progress);
              break;
            case 'error':
              setState((prev) => ({
                ...prev,
                error: data.message,
                lastUpdate: Date.now(),
              }));
              onError?.(data.message);
              break;
            case 'heartbeat':
              // Update last activity without changing progress
              setState((prev) => ({
                ...prev,
                lastUpdate: Date.now(),
              }));
              break;
            default:
              console.warn('Unknown SSE message type:', data.type);
          }
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
          setState((prev) => ({
            ...prev,
            error: 'Failed to parse server message',
          }));
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: 'Connection failed',
          lastUpdate: Date.now(),
        }));
        onError?.('Connection failed');

        // Auto-reconnect logic
        if (
          autoReconnect &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(
            () => {
              console.log(
                `Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`,
              );
              connect();
            },
            reconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1),
          );
        }
      };
    } catch (error) {
      console.error('Failed to create EventSource:', error);
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: 'Failed to establish connection',
      }));
      onError?.('Failed to establish connection');
    }
  }, [
    taskId,
    autoReconnect,
    maxReconnectAttempts,
    reconnectDelay,
    cleanup,
    onConnect,
    onProgress,
    onError,
  ]);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  useEffect(() => {
    if (taskId) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      cleanup();
    };
  }, [taskId, connect, disconnect, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    ...state,
    reconnect,
    disconnect,
  };
}
