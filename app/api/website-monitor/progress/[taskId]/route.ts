import type { NextRequest } from 'next/server';
import {
  ProgressTracker,
  createTask,
  getTask,
  registerConnection,
  unregisterConnection,
} from '../../../../../lib/sse/progress-tracker';

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } },
) {
  const taskId = params.taskId;

  // Validate taskId
  if (!taskId || taskId.length < 1) {
    return new Response('Invalid task ID', { status: 400 });
  }

  // Set up SSE headers
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
    'X-Accel-Buffering': 'no', // Disable nginx buffering
  };

  try {
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        controller.enqueue(
          `data: ${JSON.stringify({
            type: 'connected',
            taskId,
            timestamp: Date.now(),
          })}\n\n`,
        );

        // Ensure task exists
        const existingTask = getTask(taskId);
        if (!existingTask) {
          createTask(taskId, 'Waiting for task initialization');
        }

        // Set up progress tracking
        const progressTracker = new ProgressTracker(taskId, controller);

        // Register connection for management
        registerConnection({
          taskId,
          controller,
          connectedAt: Date.now(),
          lastActivity: Date.now(),
          isActive: true,
        });

        // Clean up on connection close
        request.signal.addEventListener('abort', () => {
          console.log(
            `Website monitoring SSE connection closed for task: ${taskId}`,
          );
          progressTracker.cleanup();
          unregisterConnection(taskId);
        });

        // Handle connection errors
        request.signal.addEventListener('error', (error) => {
          console.error(
            `Website monitoring SSE connection error for task ${taskId}:`,
            error,
          );
          progressTracker.cleanup();
          unregisterConnection(taskId);
        });
      },
    });

    return new Response(stream, { headers });
  } catch (error) {
    console.error(
      `Failed to establish website monitoring SSE connection for task ${taskId}:`,
      error,
    );
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Health check endpoint for website monitoring SSE infrastructure
export async function HEAD(
  request: NextRequest,
  { params }: { params: { taskId: string } },
) {
  const taskId = params.taskId;

  if (!taskId) {
    return new Response('Invalid task ID', { status: 400 });
  }

  const task = getTask(taskId);
  if (!task) {
    return new Response('Task not found', { status: 404 });
  }

  return new Response(null, {
    status: 200,
    headers: {
      'X-Task-Status': task.status,
      'X-Task-Progress': task.progress.toString(),
      'X-Task-Stage': task.stage,
    },
  });
}
