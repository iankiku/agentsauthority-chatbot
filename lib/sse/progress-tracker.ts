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

export interface SSEConnection {
  taskId: string;
  controller: ReadableStreamDefaultController;
  connectedAt: number;
  lastActivity: number;
  isActive: boolean;
}

export class ProgressTracker {
  private taskId: string;
  private controller: ReadableStreamDefaultController;
  private interval: NodeJS.Timeout | null = null;
  private connection: SSEConnection;
  private retryCount = 0;
  private maxRetries = 3;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(taskId: string, controller: ReadableStreamDefaultController) {
    this.taskId = taskId;
    this.controller = controller;
    this.connection = {
      taskId,
      controller,
      connectedAt: Date.now(),
      lastActivity: Date.now(),
      isActive: true,
    };
    this.startTracking();
    this.startHeartbeat();
  }

  async startTracking() {
    // Check for task progress every 2 seconds
    this.interval = setInterval(async () => {
      try {
        if (!this.connection.isActive) {
          this.cleanup();
          return;
        }

        const progress = await this.getTaskProgress(this.taskId);
        this.sendProgress(progress);
        this.connection.lastActivity = Date.now();

        if (progress.status === 'completed' || progress.status === 'failed') {
          this.cleanup();
        }
      } catch (error) {
        this.retryCount++;
        if (this.retryCount >= this.maxRetries) {
          this.sendError(
            error instanceof Error ? error.message : 'Unknown error',
          );
          this.cleanup();
        } else {
          // Retry with exponential backoff
          setTimeout(
            () => this.startTracking(),
            Math.pow(2, this.retryCount) * 1000,
          );
        }
      }
    }, 2000);
  }

  startHeartbeat() {
    // Send heartbeat every 30 seconds to keep connection alive
    this.heartbeatInterval = setInterval(() => {
      if (this.connection.isActive) {
        this.sendHeartbeat();
      }
    }, 30000);
  }

  sendProgress(progress: TaskProgress) {
    try {
      this.controller.enqueue(
        `data: ${JSON.stringify({
          type: 'progress',
          taskId: this.taskId,
          progress,
          timestamp: Date.now(),
        })}\n\n`,
      );
    } catch (error) {
      console.error('Failed to send progress update:', error);
      this.connection.isActive = false;
    }
  }

  sendError(message: string) {
    try {
      this.controller.enqueue(
        `data: ${JSON.stringify({
          type: 'error',
          taskId: this.taskId,
          message,
          timestamp: Date.now(),
        })}\n\n`,
      );
    } catch (error) {
      console.error('Failed to send error message:', error);
    }
  }

  sendHeartbeat() {
    try {
      this.controller.enqueue(
        `data: ${JSON.stringify({
          type: 'heartbeat',
          taskId: this.taskId,
          timestamp: Date.now(),
        })}\n\n`,
      );
    } catch (error) {
      console.error('Failed to send heartbeat:', error);
      this.connection.isActive = false;
    }
  }

  cleanup() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.connection.isActive = false;

    // Clean up task after a delay to allow final messages to be sent
    setTimeout(() => {
      cleanupTask(this.taskId);
    }, 5000);
  }

  private async getTaskProgress(taskId: string): Promise<TaskProgress> {
    // Implementation to get task progress from database/cache
    return (
      (await getTask(taskId)) || {
        taskId,
        status: 'failed',
        stage: 'Unknown',
        progress: 0,
        message: 'Task not found',
      }
    );
  }
}

// Enhanced task management functions
const tasks = new Map<string, TaskProgress>();
const activeConnections = new Map<string, SSEConnection>();

export function createTask(
  taskId: string,
  initialStage?: string,
): TaskProgress {
  const task: TaskProgress = {
    taskId,
    status: 'pending',
    stage: initialStage || 'Initializing',
    progress: 0,
    message: 'Task created',
    startTime: Date.now(),
  };

  tasks.set(taskId, task);
  return task;
}

export function updateTask(
  taskId: string,
  updates: Partial<TaskProgress>,
): TaskProgress {
  const task = tasks.get(taskId);
  if (!task) {
    throw new Error(`Task ${taskId} not found`);
  }

  const updatedTask = { ...task, ...updates };
  tasks.set(taskId, updatedTask);
  return updatedTask;
}

export function getTask(taskId: string): TaskProgress | undefined {
  return tasks.get(taskId);
}

export function completeTask(taskId: string, results: any): TaskProgress {
  return updateTask(taskId, {
    status: 'completed',
    stage: 'Completed',
    progress: 100,
    message: 'Analysis completed successfully',
    results,
    endTime: Date.now(),
  });
}

export function failTask(taskId: string, error: string): TaskProgress {
  return updateTask(taskId, {
    status: 'failed',
    stage: 'Failed',
    progress: 0,
    message: 'Analysis failed',
    error,
    endTime: Date.now(),
  });
}

export function cleanupTask(taskId: string): void {
  tasks.delete(taskId);
  activeConnections.delete(taskId);
}

// Connection management functions
export function registerConnection(connection: SSEConnection): void {
  activeConnections.set(connection.taskId, connection);
}

export function unregisterConnection(taskId: string): void {
  activeConnections.delete(taskId);
}

export function getActiveConnections(): SSEConnection[] {
  return Array.from(activeConnections.values());
}

export function getConnectionStats() {
  return {
    totalTasks: tasks.size,
    activeConnections: activeConnections.size,
    tasksByStatus: {
      pending: Array.from(tasks.values()).filter((t) => t.status === 'pending')
        .length,
      running: Array.from(tasks.values()).filter((t) => t.status === 'running')
        .length,
      completed: Array.from(tasks.values()).filter(
        (t) => t.status === 'completed',
      ).length,
      failed: Array.from(tasks.values()).filter((t) => t.status === 'failed')
        .length,
    },
  };
}
