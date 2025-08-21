import { describe, expect, test } from 'vitest';
import { notificationManagementTool } from '../lib/ai/tools/notification-management-tool';

describe('Notification Management Integration', () => {
  const mockWebsiteUrl = 'https://example.com';
  const mockCurrentSnapshot = {
    url: mockWebsiteUrl,
    timestamp: new Date().toISOString(),
    content: {
      text: 'Welcome to our website. We offer great products.',
      html: '<html><body><h1>Welcome</h1><p>We offer great products.</p></body></html>',
      metadata: {
        title: 'Example Website',
        description: 'A great website with amazing products',
      },
      performance: {
        loadTime: 1200,
        size: 15000,
      },
    },
    hash: 'abc123',
  };

  const mockPreviousSnapshot = {
    url: mockWebsiteUrl,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    content: {
      text: 'Welcome to our website. We offer products.',
      html: '<html><body><h1>Welcome</h1><p>We offer products.</p></body></html>',
      metadata: {
        title: 'Example Website',
        description: 'A website with products',
      },
      performance: {
        loadTime: 1000,
        size: 12000,
      },
    },
    hash: 'def456',
  };

  const mockNotificationSettings = {
    email: {
      enabled: true,
      recipients: ['admin@example.com'],
      template: 'default',
    },
    slack: {
      enabled: true,
      channel: '#website-monitoring',
      webhookUrl: 'https://hooks.slack.com/services/xxx',
    },
    inApp: {
      enabled: true,
      userId: 'user123',
    },
  };

  const mockNotificationRules = {
    severityThreshold: 'low',
    changeTypes: [
      'content',
      'metadata',
      'performance',
      'features',
      'security',
      'workflow',
      'ui',
      'monitoring',
      'test',
    ],
    businessImpact: ['positive', 'negative', 'neutral'],
    frequency: 'immediate',
    batchNotifications: true,
  };

  test('should work with Vercel AI SDK', async () => {
    // Test that the tool can be called through the AI SDK interface
    const result = await notificationManagementTool.execute({
      meaningfulChanges: [
        {
          changeId: 'test1',
          severity: 'high',
          businessImpact: 'negative',
          summary: 'Test change',
          category: 'content',
          priority: 'high',
        },
      ],
      websiteUrl: mockWebsiteUrl,
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'high',
    });

    expect(result.metadata.success).toBe(true);
    expect(result.metadata.category).toBe('notification-management');
  });

  test('should create artifacts correctly', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: [
        {
          changeId: 'test1',
          severity: 'critical',
          businessImpact: 'negative',
          summary: 'Critical change detected',
          category: 'security',
          priority: 'urgent',
        },
      ],
      websiteUrl: mockWebsiteUrl,
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'urgent',
    });

    // Verify the response structure supports artifact generation
    expect(result.websiteUrl).toBeDefined();
    expect(result.changesNotified).toBeDefined();
    expect(result.notificationResults).toBeDefined();
    expect(result.deliveryTracking).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.preferences).toBeDefined();
    expect(result.metadata).toBeDefined();
  });

  test('should work with existing chat interface', async () => {
    // Test that the tool returns data in a format suitable for chat display
    const result = await notificationManagementTool.execute({
      meaningfulChanges: [
        {
          changeId: 'test1',
          severity: 'medium',
          businessImpact: 'positive',
          summary: 'Feature update',
          category: 'features',
          priority: 'normal',
        },
      ],
      websiteUrl: mockWebsiteUrl,
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'normal',
    });

    // Verify chat-friendly response structure
    expect(result.summary.notificationsSent).toBeGreaterThan(0);
    expect(result.summary.successRate).toBeGreaterThan(0);
    expect(result.summary.channelsUsed).toBeDefined();
    expect(result.metadata.success).toBe(true);
  });

  test('should integrate with website monitoring agent', async () => {
    // Test that the tool can handle the output from the monitoring workflow
    const result = await notificationManagementTool.execute({
      meaningfulChanges: [
        {
          changeId: 'monitor1',
          severity: 'high',
          businessImpact: 'negative',
          summary: 'Website performance degraded',
          category: 'performance',
          priority: 'high',
        },
        {
          changeId: 'monitor2',
          severity: 'medium',
          businessImpact: 'positive',
          summary: 'New content added',
          category: 'content',
          priority: 'normal',
        },
      ],
      websiteUrl: mockWebsiteUrl,
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'high',
    });

    expect(result.changesNotified).toHaveLength(2);
    expect(result.notificationResults).toHaveLength(3); // email, slack, inApp
    expect(result.metadata.totalChanges).toBe(2);
  });

  test('should work with meaningful change analysis results', async () => {
    // Test that the tool can handle meaningful change analysis output
    const meaningfulChanges = [
      {
        changeId: 'analysis1',
        severity: 'critical',
        businessImpact: 'negative',
        summary: 'Security vulnerability detected',
        category: 'security',
        priority: 'urgent',
        aiAnalysis: {
          confidence: 0.95,
          reasoning: 'Critical security issue requiring immediate attention',
          recommendations: ['Patch immediately', 'Notify security team'],
        },
      },
      {
        changeId: 'analysis2',
        severity: 'medium',
        businessImpact: 'positive',
        summary: 'UI improvements implemented',
        category: 'ui',
        priority: 'normal',
        aiAnalysis: {
          confidence: 0.87,
          reasoning: 'Positive user experience improvements',
          recommendations: [
            'Monitor user feedback',
            'Track engagement metrics',
          ],
        },
      },
    ];

    const result = await notificationManagementTool.execute({
      meaningfulChanges,
      websiteUrl: mockWebsiteUrl,
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'urgent',
    });

    expect(result.changesNotified).toHaveLength(2);
    expect(result.changesNotified[0].aiAnalysis).toBeDefined();
    expect(result.changesNotified[1].aiAnalysis).toBeDefined();
    expect(result.metadata.success).toBe(true);
  });

  test('should handle various notification channels', async () => {
    // Test different channel combinations
    const channelTests = [
      {
        settings: {
          email: { enabled: true, recipients: ['test@example.com'] },
        },
        expectedChannels: 1,
      },
      {
        settings: {
          email: { enabled: true, recipients: ['test@example.com'] },
          slack: { enabled: true, channel: '#test' },
        },
        expectedChannels: 2,
      },
      {
        settings: {
          email: { enabled: true, recipients: ['test@example.com'] },
          webhook: { enabled: true, url: 'https://test.com/webhook' },
          slack: { enabled: true, channel: '#test' },
          inApp: { enabled: true, userId: 'testuser' },
        },
        expectedChannels: 4,
      },
    ];

    for (const testCase of channelTests) {
      const result = await notificationManagementTool.execute({
        meaningfulChanges: [
          {
            changeId: 'channel-test',
            severity: 'medium',
            businessImpact: 'neutral',
            summary: 'Channel test change',
            category: 'test',
            priority: 'normal',
          },
        ],
        websiteUrl: mockWebsiteUrl,
        notificationSettings: testCase.settings,
        notificationRules: mockNotificationRules,
        priority: 'normal',
      });

      expect(result.notificationResults).toHaveLength(
        testCase.expectedChannels,
      );
      expect(result.summary.channelsUsed).toHaveLength(
        testCase.expectedChannels,
      );
    }
  });

  test('should demonstrate complete monitoring workflow', async () => {
    // Simulate the complete workflow: change detection -> analysis -> notification
    const changes = [
      {
        changeId: 'workflow1',
        severity: 'high',
        businessImpact: 'negative',
        summary: 'Critical workflow change',
        category: 'workflow',
        priority: 'high',
      },
    ];

    const result = await notificationManagementTool.execute({
      meaningfulChanges: changes,
      websiteUrl: mockWebsiteUrl,
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'high',
    });

    // Verify complete workflow integration
    expect(result.metadata.success).toBe(true);
    expect(result.changesNotified).toHaveLength(1);
    expect(result.notificationResults).toHaveLength(3);
    expect(result.deliveryTracking.totalSent).toBe(3);
    expect(result.summary.successRate).toBeGreaterThan(0);
    expect(result.preferences.activeChannels).toContain('email');
    expect(result.preferences.activeChannels).toContain('slack');
    expect(result.preferences.activeChannels).toContain('inApp');
  });

  test('should handle notification failures gracefully', async () => {
    // Test with settings that might cause failures
    const result = await notificationManagementTool.execute({
      meaningfulChanges: [
        {
          changeId: 'failure-test',
          severity: 'medium',
          businessImpact: 'neutral',
          summary: 'Failure test change',
          category: 'test',
          priority: 'normal',
        },
      ],
      websiteUrl: mockWebsiteUrl,
      notificationSettings: {
        email: { enabled: false },
        webhook: { enabled: false },
        slack: { enabled: false },
        inApp: { enabled: true },
      },
      notificationRules: mockNotificationRules,
      priority: 'normal',
    });

    // Should still succeed with at least one channel
    expect(result.metadata.success).toBe(true);
    expect(result.notificationResults).toHaveLength(1);
    expect(result.notificationResults[0].channel).toBe('inApp');
    expect(result.metadata.notificationsSent).toBe(1);
  });

  test('should support custom notification rules', async () => {
    const customRules = {
      severityThreshold: 'critical',
      changeTypes: ['security', 'performance'],
      businessImpact: ['negative'],
      frequency: 'immediate',
      batchNotifications: false,
    };

    const result = await notificationManagementTool.execute({
      meaningfulChanges: [
        {
          changeId: 'custom-rules-test',
          severity: 'critical',
          businessImpact: 'negative',
          summary: 'Custom rules test change',
          category: 'security',
          priority: 'urgent',
        },
        {
          changeId: 'custom-rules-test2',
          severity: 'medium',
          businessImpact: 'positive',
          summary: 'Should be filtered out',
          category: 'content',
          priority: 'normal',
        },
      ],
      websiteUrl: mockWebsiteUrl,
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

  test('should provide comprehensive delivery tracking', async () => {
    const result = await notificationManagementTool.execute({
      meaningfulChanges: [
        {
          changeId: 'tracking-test',
          severity: 'high',
          businessImpact: 'negative',
          summary: 'Tracking test change',
          category: 'monitoring',
          priority: 'high',
        },
      ],
      websiteUrl: mockWebsiteUrl,
      notificationSettings: mockNotificationSettings,
      notificationRules: mockNotificationRules,
      priority: 'high',
    });

    // Verify comprehensive tracking
    expect(result.deliveryTracking.totalSent).toBe(3);
    expect(result.deliveryTracking.successfulDeliveries).toBeGreaterThan(0);
    expect(result.deliveryTracking.deliveryHistory).toHaveLength(3);
    expect(result.deliveryTracking.averageDeliveryTime).toBeGreaterThan(0);

    // Verify delivery history structure
    result.deliveryTracking.deliveryHistory.forEach((delivery) => {
      expect(delivery.messageId).toBeDefined();
      expect(delivery.channel).toBeDefined();
      expect(delivery.status).toBeDefined();
      expect(delivery.timestamp).toBeDefined();
    });
  });
});
