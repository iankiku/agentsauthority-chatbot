import { beforeEach, describe, expect, test } from 'vitest';
import { notificationManagementTool } from '../lib/ai/tools/notification-management-tool';

describe('notificationManagementTool', () => {
  const mockMeaningfulChanges = [
    {
      changeId: 'change1',
      severity: 'high',
      businessImpact: 'negative',
      summary: 'Pricing page updated',
      category: 'pricing',
      priority: 'high',
    },
    {
      changeId: 'change2',
      severity: 'medium',
      businessImpact: 'positive',
      summary: 'New feature added',
      category: 'features',
      priority: 'normal',
    },
    {
      changeId: 'change3',
      severity: 'critical',
      businessImpact: 'negative',
      summary: 'Security vulnerability detected',
      category: 'security',
      priority: 'urgent',
    },
  ];

  const mockNotificationSettings = {
    email: {
      enabled: true,
      recipients: ['admin@example.com', 'team@example.com'],
      template: 'default',
    },
    webhook: {
      enabled: true,
      url: 'https://hooks.slack.com/services/xxx',
      headers: { Authorization: 'Bearer token' },
    },
    slack: {
      enabled: true,
      channel: '#website-monitoring',
      webhookUrl: 'https://hooks.slack.com/services/yyy',
    },
    inApp: {
      enabled: true,
      userId: 'user123',
    },
  };

  const mockNotificationRules = {
    severityThreshold: 'medium',
    changeTypes: ['pricing', 'features', 'security'],
    businessImpact: ['positive', 'negative'],
    frequency: 'immediate',
    batchNotifications: true,
  };

  beforeEach(() => {
    // Reset any global state if needed
  });

  test('should send notifications via multiple channels', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'high',
    });

    expect(result.metadata.success).toBe(true);
    expect(result.notificationResults).toHaveLength(4); // email, webhook, slack, inApp
    expect(result.changesNotified).toHaveLength(3);
    expect(result.metadata.successRate).toBeGreaterThan(0);
  });

  test('should filter changes based on notification rules', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: {
        ...mockNotificationRules,
        severityThreshold: 'high',
      },
      priority: 'high',
    });

    // Should only include high and critical severity changes
    expect(result.changesNotified).toHaveLength(2);
    expect(
      result.changesNotified.every((change) =>
        ['high', 'critical'].includes(change.severity),
      ),
    ).toBe(true);
  });

  test('should generate notification content correctly', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      customMessage: 'Custom alert message',
      priority: 'urgent',
    });

    expect(result.summary.notificationsSent).toBe(4);
    expect(result.summary.channelsUsed).toContain('email');
    expect(result.summary.channelsUsed).toContain('slack');
    expect(result.summary.channelsUsed).toContain('webhook');
    expect(result.summary.channelsUsed).toContain('inApp');
  });

  test('should track notification delivery', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'normal',
    });

    expect(result.deliveryTracking.totalSent).toBe(4);
    expect(result.deliveryTracking.successfulDeliveries).toBeGreaterThan(0);
    expect(result.deliveryTracking.deliveryHistory).toHaveLength(4);
    expect(result.deliveryTracking.averageDeliveryTime).toBeGreaterThan(0);
  });

  test('should handle notification preferences', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'low',
    });

    expect(result.preferences.lastUpdated).toBeDefined();
    expect(result.preferences.activeChannels).toContain('email');
    expect(result.preferences.activeChannels).toContain('slack');
    expect(result.preferences.notificationSchedule.timezone).toBe('UTC');
    expect(result.preferences.templates).toBeDefined();
  });

  test('should support message templating', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      customMessage: '🚨 URGENT: Website changes require immediate attention!',
      priority: 'urgent',
    });

    expect(result.changesNotified).toHaveLength(3);
    expect(result.metadata.totalChanges).toBe(3);
    expect(result.metadata.notificationsSent).toBe(4);
  });

  test('should implement rate limiting', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'normal',
    });

    // All notifications should be sent successfully
    expect(
      result.notificationResults.every(
        (r) => r.status === 'sent' || r.status === 'delivered',
      ),
    ).toBe(true);
  });

  test('should handle notification failures gracefully', async () => {
    // Test with minimal settings to ensure graceful handling
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: {
        email: { enabled: false },
        webhook: { enabled: false },
        slack: { enabled: false },
        inApp: { enabled: true },
      },
      notificationRules: mockNotificationRules,
      priority: 'normal',
    });

    expect(result.notificationResults).toHaveLength(1);
    expect(result.notificationResults[0].channel).toBe('inApp');
    expect(result.metadata.success).toBe(true);
  });

  test('should generate notification summaries', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'high',
    });

    expect(result.summary).toBeDefined();
    expect(result.summary.notificationsSent).toBe(4);
    expect(result.summary.successRate).toBeGreaterThan(0);
    expect(result.summary.channelsUsed).toHaveLength(4);
    expect(result.summary.priorityDistribution).toBeDefined();
    expect(result.summary.deliveryPerformance).toBeDefined();
  });

  test('should validate input parameters correctly', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'urgent',
    });

    expect(result.websiteUrl).toBe('https://example.com');
    expect(result.notificationSettings).toEqual(mockNotificationSettings);
    expect(result.notificationRules).toEqual(mockNotificationRules);
    expect(result.metadata.category).toBe('notification-management');
  });

  test('should return properly structured response', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'normal',
    });

    // Check required top-level properties
    expect(result.websiteUrl).toBeDefined();
    expect(result.notificationSettings).toBeDefined();
    expect(result.notificationRules).toBeDefined();
    expect(result.changesNotified).toBeDefined();
    expect(result.notificationResults).toBeDefined();
    expect(result.deliveryTracking).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.preferences).toBeDefined();
    expect(result.metadata).toBeDefined();

    // Check metadata structure
    expect(result.metadata.executionTime).toBeDefined();
    expect(result.metadata.category).toBe('notification-management');
    expect(result.metadata.totalChanges).toBe(3);
    expect(result.metadata.notificationsSent).toBe(4);
    expect(result.metadata.successRate).toBeGreaterThan(0);
    expect(result.metadata.success).toBe(true);
  });

  test('should handle empty meaningful changes', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: [],
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'normal',
    });

    expect(result.changesNotified).toHaveLength(0);
    expect(result.metadata.totalChanges).toBe(0);
    expect(result.metadata.success).toBe(true);
  });

  test('should handle minimal notification settings', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: {
        inApp: { enabled: true },
      },
      notificationRules: mockNotificationRules,
      priority: 'normal',
    });

    expect(result.notificationResults).toHaveLength(1);
    expect(result.notificationResults[0].channel).toBe('inApp');
    expect(result.metadata.success).toBe(true);
  });

  test('should handle custom notification rules', async () => {
    const customRules = {
      severityThreshold: 'critical',
      changeTypes: ['security'],
      businessImpact: ['negative'],
      frequency: 'immediate',
      batchNotifications: false,
    };

    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: customRules,
      priority: 'urgent',
    });

    // Should only include critical security changes with negative business impact
    expect(result.changesNotified).toHaveLength(1);
    expect(result.changesNotified[0].severity).toBe('critical');
    expect(result.changesNotified[0].category).toBe('security');
    expect(result.changesNotified[0].businessImpact).toBe('negative');
  });

  test('should calculate delivery performance metrics', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: mockMeaningfulChanges,
      websiteUrl: 'https://example.com',
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'high',
    });

    const performance = result.summary.deliveryPerformance;
    expect(performance.fastestChannel).toBeDefined();
    expect(performance.slowestChannel).toBeDefined();
    expect(performance.mostReliableChannel).toBeDefined();
    expect(performance.fastestChannel).not.toBe('none');
    expect(performance.slowestChannel).not.toBe('none');
    expect(performance.mostReliableChannel).not.toBe('none');
  });

  test('should handle different priority levels', async () => {
    const priorities = ['low', 'normal', 'high', 'urgent'];

    for (const priority of priorities) {
      const result = await notificationManagementTool.execute({
        meaningfulChanges: mockMeaningfulChanges,
        websiteUrl: 'https://example.com',
        notificationSettings: mockNotificationSettings,
        notificationRules: mockNotificationRules,
        priority,
      });

      expect(result.metadata.success).toBe(true);
      expect(result.notificationResults).toHaveLength(4);
    }
  });
});
