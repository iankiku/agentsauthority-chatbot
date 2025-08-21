import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import type { TaskProgress } from '../lib/sse/progress-tracker';
import {
  cleanupTask,
  completeTask,
  createTask,
  failTask,
  getConnectionStats,
  getTask,
  updateTask,
} from '../lib/sse/progress-tracker';

describe('SSE Infrastructure', () => {
  const testTaskId = 'test-task-123';

  beforeEach(() => {
    // Clean up any existing test tasks
    cleanupTask(testTaskId);
  });

  afterEach(() => {
    // Clean up after each test
    cleanupTask(testTaskId);
  });

  describe('Task Management', () => {
    test('should create a new task', () => {
      const task = createTask(testTaskId, 'Test Stage');

      expect(task.taskId).toBe(testTaskId);
      expect(task.status).toBe('pending');
      expect(task.stage).toBe('Test Stage');
      expect(task.progress).toBe(0);
      expect(task.startTime).toBeDefined();
    });

    test('should update task progress', () => {
      createTask(testTaskId);

      const updatedTask = updateTask(testTaskId, {
        status: 'running',
        progress: 50,
        stage: 'Processing',
        message: 'Halfway done',
      });

      expect(updatedTask.status).toBe('running');
      expect(updatedTask.progress).toBe(50);
      expect(updatedTask.stage).toBe('Processing');
      expect(updatedTask.message).toBe('Halfway done');
    });

    test('should complete a task', () => {
      createTask(testTaskId);
      const results = { data: 'test results' };

      const completedTask = completeTask(testTaskId, results);

      expect(completedTask.status).toBe('completed');
      expect(completedTask.progress).toBe(100);
      expect(completedTask.results).toEqual(results);
      expect(completedTask.endTime).toBeDefined();
    });

    test('should fail a task', () => {
      createTask(testTaskId);
      const errorMessage = 'Test error occurred';

      const failedTask = failTask(testTaskId, errorMessage);

      expect(failedTask.status).toBe('failed');
      expect(failedTask.progress).toBe(0);
      expect(failedTask.error).toBe(errorMessage);
      expect(failedTask.endTime).toBeDefined();
    });

    test('should get task by ID', () => {
      const originalTask = createTask(testTaskId);
      const retrievedTask = getTask(testTaskId);

      expect(retrievedTask).toEqual(originalTask);
    });

    test('should return undefined for non-existent task', () => {
      const task = getTask('non-existent-task');
      expect(task).toBeUndefined();
    });

    test('should cleanup task', () => {
      createTask(testTaskId);
      cleanupTask(testTaskId);

      const task = getTask(testTaskId);
      expect(task).toBeUndefined();
    });
  });

  describe('Connection Statistics', () => {
    test('should return connection stats', () => {
      const stats = getConnectionStats();

      expect(stats).toHaveProperty('totalTasks');
      expect(stats).toHaveProperty('activeConnections');
      expect(stats).toHaveProperty('tasksByStatus');
      expect(stats.tasksByStatus).toHaveProperty('pending');
      expect(stats.tasksByStatus).toHaveProperty('running');
      expect(stats.tasksByStatus).toHaveProperty('completed');
      expect(stats.tasksByStatus).toHaveProperty('failed');
    });

    test('should track task status distribution', () => {
      // Create tasks in different states
      createTask('task-1');
      createTask('task-2');
      updateTask('task-2', { status: 'running', progress: 25 });
      createTask('task-3');
      completeTask('task-3', { result: 'success' });
      createTask('task-4');
      failTask('task-4', 'Test failure');

      const stats = getConnectionStats();

      expect(stats.tasksByStatus.pending).toBeGreaterThanOrEqual(1);
      expect(stats.tasksByStatus.running).toBeGreaterThanOrEqual(1);
      expect(stats.tasksByStatus.completed).toBeGreaterThanOrEqual(1);
      expect(stats.tasksByStatus.failed).toBeGreaterThanOrEqual(1);

      // Clean up
      cleanupTask('task-1');
      cleanupTask('task-2');
      cleanupTask('task-3');
      cleanupTask('task-4');
    });
  });

  describe('Error Handling', () => {
    test('should throw error when updating non-existent task', () => {
      expect(() => {
        updateTask('non-existent-task', { status: 'running' });
      }).toThrow('Task non-existent-task not found');
    });

    test('should handle task creation with default stage', () => {
      const task = createTask(testTaskId);
      expect(task.stage).toBe('Initializing');
    });
  });

  describe('Task Progress Interface', () => {
    test('should have correct TaskProgress interface', () => {
      const task: TaskProgress = {
        taskId: 'test',
        status: 'pending',
        stage: 'Test',
        progress: 0,
        message: 'Test message',
        startTime: Date.now(),
      };

      expect(task.taskId).toBe('test');
      expect(task.status).toBe('pending');
      expect(task.progress).toBe(0);
      expect(task.startTime).toBeDefined();
    });
  });
});
