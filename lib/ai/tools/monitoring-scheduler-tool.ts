import { tool } from 'ai';
import { z } from 'zod';

// Types for monitoring scheduler
interface MonitoringConfig {
  interval: number; // seconds
  frequency: 'continuous' | 'hourly' | 'daily' | 'weekly' | 'custom';
  startTime?: string;
  endTime?: string;
  timezone: string;
  enabled: boolean;
}

interface NotificationSettings {
  enabled: boolean;
  channels: string[];
  severityThreshold: string;
}

interface ScheduleResult {
  scheduleId: string;
  monitoringConfig: MonitoringConfig;
  monitorType: string;
  notificationSettings: NotificationSettings;
  status: {
    active: boolean;
    lastRun: string | null;
    nextRun: string;
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    uptime: number;
  };
  schedule: {
    cronExpression: string;
    humanReadable: string;
    timezone: string;
    nextExecutions: string[];
  };
  history: Array<{
    runId: string;
    timestamp: string;
    status: 'success' | 'failed' | 'skipped';
    duration: number;
    changesDetected: number;
    notificationsSent: number;
    error?: string;
  }>;
  metrics: {
    averageRunTime: number;
    successRate: number;
    changesPerRun: number;
    notificationsPerRun: number;
    uptimePercentage: number;
    performance: {
      fastestRun: number;
      slowestRun: number;
      averageResponseTime: number;
    };
  };
}

interface MonitoringMetrics {
  averageRunTime: number;
  successRate: number;
  changesPerRun: number;
  notificationsPerRun: number;
  uptimePercentage: number;
  performance: {
    fastestRun: number;
    slowestRun: number;
    averageResponseTime: number;
  };
}

export const monitoringSchedulerTool = tool({
  description: 'Automated monitoring scheduling and task management',
  inputSchema: z.object({
    websiteUrl: z.string().url(),
    monitoringConfig: z.object({
      interval: z.number().min(300).max(86400), // 5 minutes to 24 hours
      frequency: z
        .enum(['continuous', 'hourly', 'daily', 'weekly', 'custom'])
        .default('hourly'),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      timezone: z.string().default('UTC'),
      enabled: z.boolean().default(true),
    }),
    monitorType: z
      .enum(['content', 'structure', 'performance', 'comprehensive'])
      .default('comprehensive'),
    notificationSettings: z
      .object({
        enabled: z.boolean().default(true),
        channels: z
          .array(z.enum(['email', 'webhook', 'slack', 'inApp']))
          .default(['inApp']),
        severityThreshold: z
          .enum(['low', 'medium', 'high', 'critical'])
          .default('medium'),
      })
      .optional(),
    action: z
      .enum(['create', 'update', 'pause', 'resume', 'delete', 'status'])
      .default('create'),
    scheduleId: z.string().optional(),
  }),
  execute: async (args: any) => {
    const {
      websiteUrl,
      monitoringConfig,
      monitorType,
      notificationSettings,
      action,
      scheduleId,
    } = args;

    try {
      let result: ScheduleResult;

      switch (action) {
        case 'create':
          result = await createMonitoringSchedule(
            websiteUrl,
            monitoringConfig,
            monitorType,
            notificationSettings,
          );
          break;
        case 'update':
          if (!scheduleId) {
            throw new Error('Schedule ID is required for update action');
          }
          result = await updateMonitoringSchedule(
            scheduleId,
            monitoringConfig,
            monitorType,
            notificationSettings,
          );
          break;
        case 'pause':
          if (!scheduleId) {
            throw new Error('Schedule ID is required for pause action');
          }
          result = await pauseMonitoringSchedule(scheduleId);
          break;
        case 'resume':
          if (!scheduleId) {
            throw new Error('Schedule ID is required for resume action');
          }
          result = await resumeMonitoringSchedule(scheduleId);
          break;
        case 'delete':
          if (!scheduleId) {
            throw new Error('Schedule ID is required for delete action');
          }
          result = await deleteMonitoringSchedule(scheduleId);
          break;
        case 'status':
          if (!scheduleId) {
            throw new Error('Schedule ID is required for status action');
          }
          result = await getMonitoringStatus(scheduleId);
          break;
        default:
          throw new Error(`Invalid action: ${action}`);
      }

      return {
        websiteUrl,
        action,
        scheduleId: result.scheduleId,
        monitoringConfig: result.monitoringConfig,
        monitorType: result.monitorType,
        notificationSettings: result.notificationSettings,
        status: result.status,
        schedule: result.schedule,
        history: result.history,
        metrics: result.metrics,
        metadata: {
          executionTime: Date.now(),
          category: 'monitoring-scheduler',
          action,
          success: true,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Monitoring scheduler failed: ${errorMessage}`);
    }
  },
});

// Helper functions
async function createMonitoringSchedule(
  websiteUrl: string,
  config: MonitoringConfig,
  monitorType: string,
  notificationSettings: NotificationSettings,
): Promise<ScheduleResult> {
  // Generate unique schedule ID
  const scheduleId = generateScheduleId(websiteUrl);

  // Create cron expression based on frequency
  const cronExpression = generateCronExpression(config);

  // Store monitoring schedule in database (mock implementation)
  const schedule = await storeMonitoringSchedule({
    scheduleId,
    websiteUrl,
    config,
    monitorType,
    notificationSettings,
    cronExpression,
    status: 'active',
  });

  // Set up recurring job (mock implementation)
  await setupRecurringJob(scheduleId, cronExpression, async () => {
    await executeMonitoringTask(
      scheduleId,
      websiteUrl,
      monitorType,
      notificationSettings,
    );
  });

  return {
    scheduleId,
    monitoringConfig: config,
    monitorType,
    notificationSettings,
    status: {
      active: true,
      lastRun: null,
      nextRun: getNextRunTime(cronExpression),
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      uptime: 0,
    },
    schedule: {
      cronExpression,
      humanReadable: getHumanReadableSchedule(cronExpression),
      timezone: config.timezone,
      nextExecutions: getNextExecutions(cronExpression),
    },
    history: [],
    metrics: {
      averageRunTime: 0,
      successRate: 0,
      changesPerRun: 0,
      notificationsPerRun: 0,
      uptimePercentage: 0,
      performance: { fastestRun: 0, slowestRun: 0, averageResponseTime: 0 },
    },
  };
}

async function executeMonitoringTask(
  scheduleId: string,
  websiteUrl: string,
  monitorType: string,
  notificationSettings: NotificationSettings,
): Promise<void> {
  const startTime = Date.now();

  try {
    // Execute website monitoring (mock implementation)
    const monitoringResult = await executeWebsiteMonitoring(
      websiteUrl,
      monitorType,
    );

    // Process results and send notifications if needed
    if (monitoringResult.changes && monitoringResult.changes.length > 0) {
      await sendNotifications(monitoringResult.changes, notificationSettings);
    }

    // Update monitoring history
    await updateMonitoringHistory(scheduleId, {
      status: 'success',
      duration: Date.now() - startTime,
      changesDetected: monitoringResult.changes?.length || 0,
      notificationsSent: monitoringResult.notifications?.length || 0,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Update monitoring history with error
    await updateMonitoringHistory(scheduleId, {
      status: 'failed',
      duration: Date.now() - startTime,
      error: errorMessage,
    });

    // Send error notification if configured
    if (notificationSettings.enabled) {
      await sendErrorNotification(
        scheduleId,
        errorMessage,
        notificationSettings,
      );
    }
  }
}

async function getMonitoringStatus(
  scheduleId: string,
): Promise<ScheduleResult> {
  // Retrieve monitoring schedule from database (mock implementation)
  const schedule = await getMonitoringSchedule(scheduleId);

  if (!schedule) {
    throw new Error(`Monitoring schedule not found: ${scheduleId}`);
  }

  // Get monitoring history (mock implementation)
  const history = await getMonitoringHistory(scheduleId);

  // Calculate metrics
  const metrics = calculateMonitoringMetrics(history);

  // Get current status (mock implementation)
  const status = await getCurrentStatus(scheduleId);

  return {
    scheduleId,
    monitoringConfig: schedule.config,
    monitorType: schedule.monitorType,
    notificationSettings: schedule.notificationSettings,
    status,
    schedule: {
      cronExpression: schedule.cronExpression,
      humanReadable: getHumanReadableSchedule(schedule.cronExpression),
      timezone: schedule.config.timezone,
      nextExecutions: getNextExecutions(schedule.cronExpression),
    },
    history,
    metrics,
  };
}

async function pauseMonitoringSchedule(
  scheduleId: string,
): Promise<ScheduleResult> {
  // Pause the recurring job (mock implementation)
  await pauseRecurringJob(scheduleId);

  // Update schedule status in database (mock implementation)
  await updateScheduleStatus(scheduleId, 'paused');

  // Return updated status
  return await getMonitoringStatus(scheduleId);
}

async function resumeMonitoringSchedule(
  scheduleId: string,
): Promise<ScheduleResult> {
  // Resume the recurring job (mock implementation)
  await resumeRecurringJob(scheduleId);

  // Update schedule status in database (mock implementation)
  await updateScheduleStatus(scheduleId, 'active');

  // Return updated status
  return await getMonitoringStatus(scheduleId);
}

async function updateMonitoringSchedule(
  scheduleId: string,
  config: MonitoringConfig,
  monitorType: string,
  notificationSettings: NotificationSettings,
): Promise<ScheduleResult> {
  // Update the monitoring schedule (mock implementation)
  await updateScheduleConfig(
    scheduleId,
    config,
    monitorType,
    notificationSettings,
  );

  // Return updated status
  return await getMonitoringStatus(scheduleId);
}

async function deleteMonitoringSchedule(
  scheduleId: string,
): Promise<ScheduleResult> {
  // Delete the recurring job (mock implementation)
  await deleteRecurringJob(scheduleId);

  // Delete schedule from database (mock implementation)
  await deleteScheduleFromDatabase(scheduleId);

  // Return final status before deletion
  return await getMonitoringStatus(scheduleId);
}

function generateCronExpression(config: MonitoringConfig): string {
  const { frequency, interval, startTime, endTime } = config;

  switch (frequency) {
    case 'continuous':
      // Every 5 minutes
      return '*/5 * * * *';
    case 'hourly':
      return '0 * * * *';
    case 'daily':
      return '0 0 * * *';
    case 'weekly':
      return '0 0 * * 0';
    case 'custom':
      // Convert interval to cron expression
      return convertIntervalToCron(interval);
    default:
      return '0 * * * *'; // Default to hourly
  }
}

function calculateMonitoringMetrics(history: any[]): MonitoringMetrics {
  const totalRuns = history.length;
  const successfulRuns = history.filter((h) => h.status === 'success').length;
  const failedRuns = history.filter((h) => h.status === 'failed').length;

  const runTimes = history.map((h) => h.duration).filter((d) => d > 0);
  const averageRunTime =
    runTimes.length > 0
      ? runTimes.reduce((a, b) => a + b, 0) / runTimes.length
      : 0;

  const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

  const changesPerRun =
    history.length > 0
      ? history.reduce((sum, h) => sum + (h.changesDetected || 0), 0) /
        history.length
      : 0;
  const notificationsPerRun =
    history.length > 0
      ? history.reduce((sum, h) => sum + (h.notificationsSent || 0), 0) /
        history.length
      : 0;

  return {
    averageRunTime,
    successRate,
    changesPerRun,
    notificationsPerRun,
    uptimePercentage: successRate,
    performance: {
      fastestRun: runTimes.length > 0 ? Math.min(...runTimes) : 0,
      slowestRun: runTimes.length > 0 ? Math.max(...runTimes) : 0,
      averageResponseTime: averageRunTime,
    },
  };
}

// Mock helper functions for database and job management
function generateScheduleId(websiteUrl: string): string {
  return `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getNextRunTime(cronExpression: string): string {
  // Mock implementation - in production, use a cron parser
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return now.toISOString();
}

function getHumanReadableSchedule(cronExpression: string): string {
  // Mock implementation - in production, use a cron parser
  switch (cronExpression) {
    case '*/5 * * * *':
      return 'Every 5 minutes';
    case '0 * * * *':
      return 'Every hour';
    case '0 0 * * *':
      return 'Every day at midnight';
    case '0 0 * * 0':
      return 'Every week on Sunday';
    default:
      return 'Custom schedule';
  }
}

function getNextExecutions(cronExpression: string): string[] {
  // Mock implementation - return next 5 execution times
  const executions: string[] = [];
  const now = new Date();

  for (let i = 1; i <= 5; i++) {
    const next = new Date(now.getTime() + i * 60 * 60 * 1000); // Add i hours
    executions.push(next.toISOString());
  }

  return executions;
}

function convertIntervalToCron(interval: number): string {
  // Convert seconds to cron expression
  if (interval < 3600) {
    // Less than 1 hour - every X minutes
    const minutes = Math.floor(interval / 60);
    return `*/${minutes} * * * *`;
  } else if (interval < 86400) {
    // Less than 1 day - every X hours
    const hours = Math.floor(interval / 3600);
    return `0 */${hours} * * *`;
  } else {
    // Daily or more
    return '0 0 * * *';
  }
}

// Mock database operations
async function storeMonitoringSchedule(schedule: any): Promise<void> {
  // Mock implementation
  console.log('Storing monitoring schedule:', schedule);
}

async function setupRecurringJob(
  scheduleId: string,
  cronExpression: string,
  task: () => Promise<void>,
): Promise<void> {
  // Mock implementation
  console.log('Setting up recurring job:', scheduleId, cronExpression);
}

// Store updated configs for testing
const updatedConfigs: Record<string, any> = {};

async function getMonitoringSchedule(scheduleId: string): Promise<any> {
  // Mock implementation - return updated config if available, otherwise default
  const updatedConfig = updatedConfigs[scheduleId];
  return {
    scheduleId,
    config: updatedConfig || {
      interval: 3600,
      frequency: 'hourly',
      timezone: 'UTC',
      enabled: true,
    },
    monitorType: updatedConfig?.monitorType || 'comprehensive',
    notificationSettings: updatedConfig?.notificationSettings || {
      enabled: true,
      channels: ['inApp'],
      severityThreshold: 'medium',
    },
    cronExpression: updatedConfig?.cronExpression || '0 * * * *',
  };
}

async function getMonitoringHistory(scheduleId: string): Promise<any[]> {
  // Mock implementation
  return [
    {
      runId: 'run_1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'success',
      duration: 45000,
      changesDetected: 2,
      notificationsSent: 1,
    },
    {
      runId: 'run_2',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'success',
      duration: 38000,
      changesDetected: 0,
      notificationsSent: 0,
    },
  ];
}

async function getCurrentStatus(scheduleId: string): Promise<any> {
  // Mock implementation
  return {
    active: true,
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    nextRun: new Date(Date.now() + 3600000).toISOString(),
    totalRuns: 2,
    successfulRuns: 2,
    failedRuns: 0,
    uptime: 100,
  };
}

async function updateMonitoringHistory(
  scheduleId: string,
  data: any,
): Promise<void> {
  // Mock implementation
  console.log('Updating monitoring history:', scheduleId, data);
}

async function pauseRecurringJob(scheduleId: string): Promise<void> {
  // Mock implementation
  console.log('Pausing recurring job:', scheduleId);
}

async function resumeRecurringJob(scheduleId: string): Promise<void> {
  // Mock implementation
  console.log('Resuming recurring job:', scheduleId);
}

async function updateScheduleStatus(
  scheduleId: string,
  status: string,
): Promise<void> {
  // Mock implementation
  console.log('Updating schedule status:', scheduleId, status);
}

async function updateScheduleConfig(
  scheduleId: string,
  config: MonitoringConfig,
  monitorType: string,
  notificationSettings: NotificationSettings,
): Promise<void> {
  // Mock implementation - store updated config for testing
  updatedConfigs[scheduleId] = {
    ...config,
    monitorType,
    notificationSettings,
    cronExpression: generateCronExpression(config),
  };
  console.log(
    'Updating schedule config:',
    scheduleId,
    config,
    monitorType,
    notificationSettings,
  );
}

async function deleteRecurringJob(scheduleId: string): Promise<void> {
  // Mock implementation
  console.log('Deleting recurring job:', scheduleId);
}

async function deleteScheduleFromDatabase(scheduleId: string): Promise<void> {
  // Mock implementation
  console.log('Deleting schedule from database:', scheduleId);
}

async function executeWebsiteMonitoring(
  websiteUrl: string,
  monitorType: string,
): Promise<any> {
  // Mock implementation
  return {
    changes: [
      {
        type: 'content',
        severity: 'medium',
        description: 'Updated pricing information',
      },
    ],
    notifications: [
      {
        type: 'email',
        status: 'sent',
      },
    ],
  };
}

async function sendNotifications(
  changes: any[],
  notificationSettings: NotificationSettings,
): Promise<void> {
  // Mock implementation
  console.log('Sending notifications:', changes, notificationSettings);
}

async function sendErrorNotification(
  scheduleId: string,
  error: string,
  notificationSettings: NotificationSettings,
): Promise<void> {
  // Mock implementation
  console.log(
    'Sending error notification:',
    scheduleId,
    error,
    notificationSettings,
  );
}
