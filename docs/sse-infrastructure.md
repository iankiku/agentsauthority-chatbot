# SSE Infrastructure Documentation

## Overview

The Server-Sent Events (SSE) infrastructure provides real-time progress updates
for long-running brand analysis tasks. This implementation supports multiple
concurrent connections, automatic reconnection, error handling, and
comprehensive monitoring.

## Architecture

### Core Components

1. **Progress Tracker** (`lib/sse/progress-tracker.ts`)
   - Manages task lifecycle and progress updates
   - Handles SSE connection lifecycle
   - Provides task management functions

2. **Connection Manager** (`lib/sse/connection-manager.ts`)
   - Monitors connection health and metrics
   - Provides connection statistics
   - Handles stale connection cleanup

3. **SSE Endpoint** (`app/api/brand-monitor/progress/[taskId]/route.ts`)
   - Establishes SSE connections
   - Handles connection lifecycle events
   - Provides health check endpoint

4. **Frontend Hook** (`hooks/use-sse-progress.ts`)
   - React hook for SSE integration
   - Automatic reconnection logic
   - Error handling and state management

## Usage

### Backend Task Management

```typescript
import {
	createTask,
	updateTask,
	completeTask,
	failTask,
} from "../lib/sse/progress-tracker";

// Create a new task
const task = createTask("task-123", "Initializing analysis");

// Update progress
updateTask("task-123", {
	status: "running",
	progress: 50,
	stage: "Processing data",
	message: "Analyzing brand mentions...",
});

// Complete task
completeTask("task-123", { results: "Analysis complete" });

// Fail task
failTask("task-123", "API rate limit exceeded");
```

### Frontend Integration

```typescript
import { useSSEProgress } from '../hooks/use-sse-progress';

function MyComponent() {
  const {
    progress,
    error,
    isConnected,
    reconnect,
    disconnect
  } = useSSEProgress('task-123', {
    autoReconnect: true,
    maxReconnectAttempts: 3,
    onProgress: (progress) => console.log('Progress:', progress),
    onError: (error) => console.error('Error:', error)
  });

  return (
    <div>
      {progress && (
        <div>
          <p>Status: {progress.status}</p>
          <p>Progress: {progress.progress}%</p>
          <p>Stage: {progress.stage}</p>
        </div>
      )}
    </div>
  );
}
```

## API Endpoints

### SSE Progress Stream

```
GET /api/brand-monitor/progress/{taskId}
```

**Headers:**

- `Content-Type: text/event-stream`
- `Cache-Control: no-cache, no-transform`
- `Connection: keep-alive`

**Events:**

- `connected`: Initial connection established
- `progress`: Task progress update
- `error`: Error message
- `heartbeat`: Connection keep-alive

### Health Check

```
GET /api/brand-monitor/health
```

Returns connection metrics and health status.

### Task Status Check

```
HEAD /api/brand-monitor/progress/{taskId}
```

Returns task status in headers.

## Features

### Real-time Progress Updates

- Live progress tracking with percentage completion
- Stage-by-stage status updates
- Estimated time remaining
- Detailed error messages

### Connection Management

- Automatic reconnection with exponential backoff
- Connection health monitoring
- Stale connection cleanup
- Heartbeat mechanism

### Error Handling

- Graceful error recovery
- User-friendly error messages
- Retry logic with configurable limits
- Connection failure detection

### Performance Optimizations

- Efficient task storage with Map
- Minimal memory footprint
- Connection pooling
- Automatic cleanup

## Configuration

### Frontend Options

```typescript
interface SSEProgressOptions {
	autoReconnect?: boolean; // Default: true
	maxReconnectAttempts?: number; // Default: 3
	reconnectDelay?: number; // Default: 2000ms
	onProgress?: (progress) => void; // Progress callback
	onError?: (error) => void; // Error callback
	onConnect?: () => void; // Connect callback
	onDisconnect?: () => void; // Disconnect callback
}
```

### Backend Configuration

- **Progress Check Interval**: 2 seconds
- **Heartbeat Interval**: 30 seconds
- **Health Check Interval**: 30 seconds
- **Stale Connection Timeout**: 2 minutes
- **Unhealthy Connection Timeout**: 30 seconds

## Monitoring

### Connection Metrics

```typescript
{
  totalConnections: number,
  activeConnections: number,
  connectionHealth: {
    healthy: number,
    unhealthy: number,
    stale: number
  },
  averageConnectionTime: number,
  connectionErrors: number
}
```

### Health Status

- **Healthy**: Active connections with recent activity
- **Unhealthy**: Connections with errors or timeouts
- **Stale**: Inactive connections requiring cleanup

## Testing

Run the SSE infrastructure tests:

```bash
npx vitest run tests/sse-infrastructure.test.ts
```

## Integration with Brand Monitoring

The SSE infrastructure integrates seamlessly with the brand monitoring workflow:

1. **Task Creation**: Brand monitor agent creates tasks
2. **Progress Updates**: Real-time updates during analysis
3. **Error Handling**: Graceful error reporting
4. **Completion**: Final results delivery

## Security Considerations

- Input validation for task IDs
- Rate limiting on connections
- Error message sanitization
- Connection timeout handling

## Performance Considerations

- Supports 50+ concurrent connections
- Minimal latency (<2s for updates)
- Efficient memory usage
- Automatic resource cleanup

## Troubleshooting

### Common Issues

1. **Connection Timeouts**
   - Check network connectivity
   - Verify server is running
   - Review connection limits

2. **Progress Not Updating**
   - Verify task exists
   - Check task status
   - Review error logs

3. **Reconnection Failures**
   - Check max retry attempts
   - Verify server availability
   - Review error handling

### Debug Information

Enable debug logging by setting environment variable:

```bash
DEBUG=sse:*
```

## Future Enhancements

- Persistent task storage
- WebSocket fallback
- Advanced metrics dashboard
- Load balancing support
- Rate limiting improvements
