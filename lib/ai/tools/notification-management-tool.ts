import { tool } from 'ai';
import { z } from 'zod';

// Types for notification management
interface NotificationContent {
  subject: string;
  body: string;
  summary: string;
  priority: string;
  channels: string[];
  metadata: {
    websiteUrl: string;
    timestamp: string;
    changeCount: number;
    severityLevel: string;
  };
}

interface NotificationResult {
  channel: 'email' | 'webhook' | 'slack' | 'inApp';
  status: 'sent' | 'failed' | 'pending' | 'delivered';
  messageId: string;
  recipient: string;
  timestamp: string;
  error?: string;
  deliveryTime?: number;
}

interface DeliveryTracking {
  totalSent: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  pendingDeliveries: number;
  averageDeliveryTime: number;
  deliveryHistory: Array<{
    messageId: string;
    channel: string;
    status: string;
    timestamp: string;
    deliveryTime?: number;
  }>;
}

export const notificationManagementTool = tool({
  description:
    'Comprehensive notification management for website monitoring alerts',
  inputSchema: z.object({
    meaningfulChanges: z.array(z.any()),
    websiteUrl: z.string().url(),
    notificationSettings: z.object({
      email: z
        .object({
          enabled: z.boolean().default(false),
          recipients: z.array(z.string().email()).optional(),
          template: z.string().optional(),
        })
        .optional(),
      webhook: z
        .object({
          enabled: z.boolean().default(false),
          url: z.string().url().optional(),
          headers: z.record(z.string()).optional(),
        })
        .optional(),
      slack: z
        .object({
          enabled: z.boolean().default(false),
          channel: z.string().optional(),
          webhookUrl: z.string().url().optional(),
        })
        .optional(),
      inApp: z
        .object({
          enabled: z.boolean().default(true),
          userId: z.string().optional(),
        })
        .optional(),
    }),
    notificationRules: z
      .object({
        severityThreshold: z
          .enum(['low', 'medium', 'high', 'critical'])
          .default('medium'),
        changeTypes: z.array(z.string()).optional(),
        businessImpact: z.array(z.string()).optional(),
        frequency: z
          .enum(['immediate', 'hourly', 'daily', 'weekly'])
          .default('immediate'),
        batchNotifications: z.boolean().default(true),
      })
      .optional(),
    customMessage: z.string().optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  }),
  execute: async (args: any) => {
    const {
      meaningfulChanges,
      websiteUrl,
      notificationSettings,
      notificationRules,
      customMessage,
      priority,
    } = args;

    try {
      // Step 1: Filter changes based on notification rules
      const filteredChanges = await filterChangesForNotification(
        meaningfulChanges,
        notificationRules || {},
      );

      // Step 2: Generate notification content
      const notificationContent = await generateNotificationContent(
        filteredChanges,
        websiteUrl,
        customMessage,
        notificationSettings || {},
      );

      // Step 3: Send notifications to enabled channels
      const notificationResults = await sendNotifications(
        notificationContent,
        notificationSettings || {},
        priority,
      );

      // Step 4: Track notification delivery
      const deliveryTracking = await trackNotificationDelivery(
        notificationResults,
        notificationSettings || {},
      );

      // Step 5: Update notification preferences
      const updatedPreferences = await updateNotificationPreferences(
        notificationSettings || {},
        deliveryTracking,
      );

      // Step 6: Generate notification summary
      const notificationSummary = await generateNotificationSummary(
        notificationResults,
        deliveryTracking,
      );

      return {
        websiteUrl,
        notificationSettings: notificationSettings || {},
        notificationRules: notificationRules || {},
        changesNotified: filteredChanges,
        notificationResults,
        deliveryTracking,
        summary: notificationSummary,
        preferences: updatedPreferences,
        metadata: {
          executionTime: Date.now(),
          category: 'notification-management',
          totalChanges: meaningfulChanges.length,
          notificationsSent: notificationResults.length,
          successRate: calculateSuccessRate(notificationResults),
          success: true,
        },
      };
    } catch (error) {
      throw new Error(`Notification management failed: ${error.message}`);
    }
  },
});

// Helper functions
async function filterChangesForNotification(
  changes: any[],
  rules: any,
): Promise<any[]> {
  const { severityThreshold, changeTypes, businessImpact } = rules;

  return changes.filter((change) => {
    // Filter by severity threshold
    const severityOrder = ['low', 'medium', 'high', 'critical'];
    const changeSeverityIndex = severityOrder.indexOf(change.severity || 'low');
    const thresholdIndex = severityOrder.indexOf(severityThreshold || 'medium');

    if (changeSeverityIndex < thresholdIndex) {
      return false;
    }

    // Filter by change types
    if (changeTypes && changeTypes.length > 0) {
      if (!changeTypes.includes(change.category)) {
        return false;
      }
    }

    // Filter by business impact
    if (businessImpact && businessImpact.length > 0) {
      if (!businessImpact.includes(change.businessImpact)) {
        return false;
      }
    }

    return true;
  });
}

async function generateNotificationContent(
  changes: any[],
  websiteUrl: string,
  customMessage: string,
  settings: any,
): Promise<NotificationContent> {
  const templates = await loadNotificationTemplates(settings);

  const content: NotificationContent = {
    subject: generateSubject(changes, websiteUrl),
    body: generateBody(changes, websiteUrl, customMessage, templates),
    summary: generateSummary(changes),
    priority: determinePriority(changes),
    channels: determineChannels(settings),
    metadata: {
      websiteUrl,
      timestamp: new Date().toISOString(),
      changeCount: changes.length,
      severityLevel: getHighestSeverity(changes),
    },
  };

  return content;
}

async function sendNotifications(
  content: NotificationContent,
  settings: any,
  priority: string,
): Promise<NotificationResult[]> {
  const results: NotificationResult[] = [];

  // Send email notifications
  if (settings.email?.enabled) {
    const emailResult = await sendEmailNotification(
      content,
      settings.email,
      priority,
    );
    results.push(emailResult);
  }

  // Send webhook notifications
  if (settings.webhook?.enabled) {
    const webhookResult = await sendWebhookNotification(
      content,
      settings.webhook,
      priority,
    );
    results.push(webhookResult);
  }

  // Send Slack notifications
  if (settings.slack?.enabled) {
    const slackResult = await sendSlackNotification(
      content,
      settings.slack,
      priority,
    );
    results.push(slackResult);
  }

  // Send in-app notifications
  if (settings.inApp?.enabled) {
    const inAppResult = await sendInAppNotification(
      content,
      settings.inApp,
      priority,
    );
    results.push(inAppResult);
  }

  return results;
}

async function trackNotificationDelivery(
  results: NotificationResult[],
  settings: any,
): Promise<DeliveryTracking> {
  const tracking: DeliveryTracking = {
    totalSent: results.length,
    successfulDeliveries: results.filter(
      (r) => r.status === 'sent' || r.status === 'delivered',
    ).length,
    failedDeliveries: results.filter((r) => r.status === 'failed').length,
    pendingDeliveries: results.filter((r) => r.status === 'pending').length,
    averageDeliveryTime: calculateAverageDeliveryTime(results),
    deliveryHistory: results.map((result) => ({
      messageId: result.messageId,
      channel: result.channel,
      status: result.status,
      timestamp: result.timestamp,
      deliveryTime: result.deliveryTime,
    })),
  };

  // Store delivery tracking in database
  await storeDeliveryTracking(tracking);

  return tracking;
}

async function updateNotificationPreferences(
  settings: any,
  deliveryTracking: DeliveryTracking,
): Promise<any> {
  const preferences = {
    lastUpdated: new Date().toISOString(),
    activeChannels: Object.keys(settings).filter(
      (key) => settings[key]?.enabled,
    ),
    notificationSchedule: {
      timezone: 'UTC',
      quietHours: {
        start: '22:00',
        end: '08:00',
      },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    },
    templates: await loadNotificationTemplates(settings),
  };

  return preferences;
}

async function generateNotificationSummary(
  results: NotificationResult[],
  tracking: DeliveryTracking,
): Promise<any> {
  const priorityDistribution = calculatePriorityDistribution(results);
  const deliveryPerformance = calculateDeliveryPerformance(results);

  return {
    notificationsSent: results.length,
    successRate: tracking.successfulDeliveries / tracking.totalSent,
    channelsUsed: [...new Set(results.map((r) => r.channel))],
    priorityDistribution,
    deliveryPerformance,
  };
}

// Utility functions
async function loadNotificationTemplates(
  settings: any,
): Promise<Record<string, string>> {
  // Mock implementation - in production, load from database or file system
  return {
    default:
      'Website monitoring alert: {changeCount} changes detected on {websiteUrl}',
    critical:
      '🚨 CRITICAL: {changeCount} high-impact changes detected on {websiteUrl}',
    summary:
      '📊 Summary: {changeCount} changes analyzed, {severityLevel} severity',
  };
}

function generateSubject(changes: any[], websiteUrl: string): string {
  const changeCount = changes.length;
  const highestSeverity = getHighestSeverity(changes);

  if (highestSeverity === 'critical') {
    return `🚨 CRITICAL: ${changeCount} changes detected on ${websiteUrl}`;
  } else if (highestSeverity === 'high') {
    return `⚠️ ALERT: ${changeCount} changes detected on ${websiteUrl}`;
  } else {
    return `📊 ${changeCount} changes detected on ${websiteUrl}`;
  }
}

function generateBody(
  changes: any[],
  websiteUrl: string,
  customMessage: string,
  templates: Record<string, string>,
): string {
  const template =
    templates.default ||
    'Website monitoring alert: {changeCount} changes detected on {websiteUrl}';

  let body = template
    .replace('{changeCount}', changes.length.toString())
    .replace('{websiteUrl}', websiteUrl)
    .replace('{severityLevel}', getHighestSeverity(changes));

  if (customMessage) {
    body += `\n\nCustom Message: ${customMessage}`;
  }

  body += '\n\nChange Summary:';
  changes.forEach((change, index) => {
    body += `\n${index + 1}. ${change.summary || 'Change detected'} (${change.severity || 'unknown'} severity)`;
  });

  return body;
}

function generateSummary(changes: any[]): string {
  const changeCount = changes.length;
  const severityCounts = changes.reduce(
    (acc, change) => {
      const severity = change.severity || 'unknown';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return `${changeCount} changes detected with severity distribution: ${Object.entries(
    severityCounts,
  )
    .map(([severity, count]) => `${severity}: ${count}`)
    .join(', ')}`;
}

function determinePriority(changes: any[]): string {
  const highestSeverity = getHighestSeverity(changes);

  switch (highestSeverity) {
    case 'critical':
      return 'urgent';
    case 'high':
      return 'high';
    case 'medium':
      return 'normal';
    case 'low':
      return 'low';
    default:
      return 'normal';
  }
}

function determineChannels(settings: any): string[] {
  const channels: string[] = [];

  if (settings.email?.enabled) channels.push('email');
  if (settings.webhook?.enabled) channels.push('webhook');
  if (settings.slack?.enabled) channels.push('slack');
  if (settings.inApp?.enabled) channels.push('inApp');

  return channels;
}

function getHighestSeverity(changes: any[]): string {
  const severityOrder = ['low', 'medium', 'high', 'critical'];
  let highestIndex = 0;

  changes.forEach((change) => {
    const severity = change.severity || 'low';
    const index = severityOrder.indexOf(severity);
    if (index > highestIndex) {
      highestIndex = index;
    }
  });

  return severityOrder[highestIndex] || 'low';
}

// Mock notification sending functions
async function sendEmailNotification(
  content: NotificationContent,
  emailSettings: any,
  priority: string,
): Promise<NotificationResult> {
  // Mock implementation - in production, integrate with email service
  const messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    channel: 'email',
    status: 'sent',
    messageId,
    recipient: emailSettings.recipients?.[0] || 'default@example.com',
    timestamp: new Date().toISOString(),
    deliveryTime: Math.random() * 1000 + 500, // 500-1500ms
  };
}

async function sendWebhookNotification(
  content: NotificationContent,
  webhookSettings: any,
  priority: string,
): Promise<NotificationResult> {
  // Mock implementation - in production, make HTTP POST request
  const messageId = `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    channel: 'webhook',
    status: 'sent',
    messageId,
    recipient: webhookSettings.url || 'default-webhook',
    timestamp: new Date().toISOString(),
    deliveryTime: Math.random() * 2000 + 1000, // 1000-3000ms
  };
}

async function sendSlackNotification(
  content: NotificationContent,
  slackSettings: any,
  priority: string,
): Promise<NotificationResult> {
  // Mock implementation - in production, use Slack Webhook API
  const messageId = `slack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    channel: 'slack',
    status: 'sent',
    messageId,
    recipient: slackSettings.channel || '#general',
    timestamp: new Date().toISOString(),
    deliveryTime: Math.random() * 1500 + 800, // 800-2300ms
  };
}

async function sendInAppNotification(
  content: NotificationContent,
  inAppSettings: any,
  priority: string,
): Promise<NotificationResult> {
  // Mock implementation - in production, store in database for in-app display
  const messageId = `inapp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    channel: 'inApp',
    status: 'delivered',
    messageId,
    recipient: inAppSettings.userId || 'default-user',
    timestamp: new Date().toISOString(),
    deliveryTime: Math.random() * 100 + 50, // 50-150ms
  };
}

async function storeDeliveryTracking(
  tracking: DeliveryTracking,
): Promise<void> {
  // Mock implementation - in production, store in database
  console.log('Storing delivery tracking:', tracking);
}

function calculateAverageDeliveryTime(results: NotificationResult[]): number {
  const deliveryTimes = results
    .map((r) => r.deliveryTime)
    .filter((time) => time !== undefined) as number[];

  if (deliveryTimes.length === 0) return 0;

  return (
    deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length
  );
}

function calculateSuccessRate(results: NotificationResult[]): number {
  if (results.length === 0) return 0;

  const successful = results.filter(
    (r) => r.status === 'sent' || r.status === 'delivered',
  ).length;

  return successful / results.length;
}

function calculatePriorityDistribution(
  results: NotificationResult[],
): Record<string, number> {
  return results.reduce(
    (acc, result) => {
      const priority = result.status;
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

function calculateDeliveryPerformance(results: NotificationResult[]): {
  fastestChannel: string;
  slowestChannel: string;
  mostReliableChannel: string;
} {
  if (results.length === 0) {
    return {
      fastestChannel: 'none',
      slowestChannel: 'none',
      mostReliableChannel: 'none',
    };
  }

  // Calculate fastest and slowest channels
  const channelTimes = results.reduce(
    (acc, result) => {
      if (result.deliveryTime !== undefined) {
        if (!acc[result.channel]) {
          acc[result.channel] = [];
        }
        acc[result.channel].push(result.deliveryTime);
      }
      return acc;
    },
    {} as Record<string, number[]>,
  );

  let fastestChannel = 'none';
  let slowestChannel = 'none';
  let fastestTime = Number.POSITIVE_INFINITY;
  let slowestTime = 0;

  Object.entries(channelTimes).forEach(([channel, times]) => {
    const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    if (avgTime < fastestTime) {
      fastestTime = avgTime;
      fastestChannel = channel;
    }
    if (avgTime > slowestTime) {
      slowestTime = avgTime;
      slowestChannel = channel;
    }
  });

  // Calculate most reliable channel
  const channelSuccessRates = Object.entries(channelTimes).map(
    ([channel, times]) => {
      const channelResults = results.filter((r) => r.channel === channel);
      const successRate =
        channelResults.filter(
          (r) => r.status === 'sent' || r.status === 'delivered',
        ).length / channelResults.length;
      return { channel, successRate };
    },
  );

  const mostReliableChannel = channelSuccessRates.reduce(
    (best, current) =>
      current.successRate > best.successRate ? current : best,
    { channel: 'none', successRate: 0 },
  ).channel;

  return {
    fastestChannel,
    slowestChannel,
    mostReliableChannel,
  };
}
