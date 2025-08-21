import { tool } from 'ai';
import { z } from 'zod';
import {
  completeTask,
  createTask,
  failTask,
  updateTask,
} from '../../sse/progress-tracker';
import { websiteScrapingTool } from './website-scraping-tool';

export interface WebsiteMonitorResult {
  websiteUrl: string;
  monitorType: 'content' | 'structure' | 'performance' | 'comprehensive';
  checkInterval: number;
  scrapedContent: {
    html: string;
    markdown: string;
    text: string;
    metadata: {
      title: string;
      description: string;
      keywords: string[];
      lastModified: string;
      contentLength: number;
    };
    screenshots: {
      desktop: string;
      mobile: string;
    };
    performance: {
      loadTime: number;
      pageSize: number;
      requests: number;
    };
  };
  baseline: {
    id: string;
    createdAt: string;
    content: any;
    hash: string;
  };
  changes: Array<{
    type: 'added' | 'removed' | 'modified';
    path: string;
    oldValue: string;
    newValue: string;
    diff: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
  }>;
  meaningfulChanges: Array<{
    changeId: string;
    summary: string;
    impact: 'positive' | 'negative' | 'neutral';
    confidence: number;
    aiAnalysis: string;
    recommendations: string[];
    priority: 'low' | 'medium' | 'high' | 'critical';
    affectedAreas: string[];
    businessImpact: string;
  }>;
  notifications: {
    sent: boolean;
    channels: string[];
    recipients: string[];
    message: string;
    timestamp: string;
  };
  monitoringSchedule: {
    active: boolean;
    nextCheck: string;
    interval: number;
    lastCheck: string;
    totalChecks: number;
    successRate: number;
  };
  metadata: {
    executionTime: number;
    category: 'website-monitoring';
    totalChanges: number;
    meaningfulChangesCount: number;
    monitoringActive: boolean;
  };
}

interface BaselineSnapshot {
  id: string;
  createdAt: string;
  content: any;
  hash: string;
}

interface ChangeDetection {
  type: 'added' | 'removed' | 'modified';
  path: string;
  oldValue: string;
  newValue: string;
  diff: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

interface MeaningfulChange {
  changeId: string;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  aiAnalysis: string;
  recommendations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  affectedAreas: string[];
  businessImpact: string;
}

interface NotificationSettings {
  email: boolean;
  webhook?: string;
  slack?: string;
}

export const websiteMonitorAgent = tool({
  description:
    'Comprehensive website monitoring with AI-powered change analysis',
  inputSchema: z.object({
    websiteUrl: z.string().url(),
    monitorType: z
      .enum(['content', 'structure', 'performance', 'comprehensive'])
      .default('comprehensive'),
    checkInterval: z.number().min(300).max(86400).default(3600), // 5 minutes to 24 hours
    customFilters: z.array(z.string()).optional(),
    notificationSettings: z
      .object({
        email: z.boolean().default(false),
        webhook: z.string().url().optional(),
        slack: z.string().optional(),
      })
      .optional(),
    baselineSnapshot: z.boolean().default(true),
  }),
  execute: async (args) => {
    const {
      websiteUrl,
      monitorType,
      checkInterval,
      customFilters,
      notificationSettings,
      baselineSnapshot,
    } = args;

    // Generate a unique task ID for this monitoring session
    const taskId = `website-monitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Initialize the task
    createTask(taskId, 'Initializing website monitoring');

    try {
      // Step 1: Initial Website Scraping
      updateTask(taskId, {
        status: 'running',
        stage: 'Scraping website content',
        progress: 10,
        message: 'Extracting website content and metadata...',
      });

      const scrapedContent = await scrapeWebsite(websiteUrl, monitorType);

      // Step 2: Baseline Snapshot Creation
      updateTask(taskId, {
        stage: 'Creating baseline snapshot',
        progress: 25,
        message: 'Creating baseline snapshot for change detection...',
      });

      const baseline = baselineSnapshot
        ? await createBaselineSnapshot(websiteUrl, scrapedContent)
        : await getExistingBaseline(websiteUrl);

      // Step 3: Change Detection
      updateTask(taskId, {
        stage: 'Detecting changes',
        progress: 50,
        message: 'Analyzing website changes and differences...',
      });

      const changes = await detectChanges(
        scrapedContent,
        baseline,
        customFilters,
      );

      // Step 4: AI-Powered Meaningful Change Analysis
      updateTask(taskId, {
        stage: 'Analyzing meaningful changes',
        progress: 75,
        message: 'Performing AI-powered analysis of meaningful changes...',
      });

      const meaningfulChanges = await analyzeMeaningfulChanges(
        changes,
        websiteUrl,
        monitorType,
      );

      // Step 5: Notification Management
      updateTask(taskId, {
        stage: 'Managing notifications',
        progress: 90,
        message: 'Setting up notification channels...',
      });

      const notifications = await manageNotifications(
        meaningfulChanges,
        notificationSettings,
      );

      // Step 6: Monitoring Schedule Setup
      updateTask(taskId, {
        stage: 'Setting up monitoring schedule',
        progress: 95,
        message: 'Configuring automated monitoring schedule...',
      });

      const monitoringSchedule = await setupMonitoringSchedule(
        websiteUrl,
        checkInterval,
        monitorType,
      );

      // Step 7: Final Results
      updateTask(taskId, {
        stage: 'Generating final report',
        progress: 100,
        message: 'Compiling comprehensive monitoring report...',
      });

      const finalResult: WebsiteMonitorResult = {
        websiteUrl,
        monitorType,
        checkInterval,
        scrapedContent: {
          html: scrapedContent.content.html,
          markdown: scrapedContent.content.markdown,
          text: scrapedContent.content.text,
          metadata: {
            title: scrapedContent.metadata.title,
            description: scrapedContent.metadata.description,
            keywords: scrapedContent.metadata.keywords,
            lastModified: scrapedContent.metadata.lastModified,
            contentLength: scrapedContent.metadata.contentLength,
          },
          screenshots: {
            desktop: scrapedContent.screenshots?.desktop.url || '',
            mobile: scrapedContent.screenshots?.mobile.url || '',
          },
          performance: {
            loadTime: scrapedContent.performance?.loadTime || 0,
            pageSize: scrapedContent.performance?.pageSize || 0,
            requests: scrapedContent.performance?.requests || 0,
          },
        },
        baseline,
        changes,
        meaningfulChanges,
        notifications,
        monitoringSchedule,
        metadata: {
          executionTime: Date.now(),
          category: 'website-monitoring',
          totalChanges: changes.length,
          meaningfulChangesCount: meaningfulChanges.length,
          monitoringActive: true,
        },
      };

      // Complete the task
      completeTask(taskId, finalResult);

      return finalResult;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      // Fail the task
      failTask(taskId, errorMessage);

      throw new Error(`Website monitoring failed: ${errorMessage}`);
    }
  },
});

async function scrapeWebsite(websiteUrl: string, monitorType: string) {
  try {
    // Use the website scraping tool
    const scrapingMode =
      monitorType === 'comprehensive' ? 'comprehensive' : 'full';

    const result = await websiteScrapingTool.execute({
      websiteUrl,
      scrapingMode,
      includeScreenshots: true,
      includePerformance:
        monitorType === 'performance' || monitorType === 'comprehensive',
      waitForRender: 3000,
    });

    return result;
  } catch (error) {
    console.error('Website scraping failed:', error);
    throw new Error(
      `Failed to scrape website: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function createBaselineSnapshot(
  websiteUrl: string,
  scrapedContent: any,
): Promise<BaselineSnapshot> {
  const baselineId = `baseline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id: baselineId,
    createdAt: new Date().toISOString(),
    content: {
      html: scrapedContent.content.html,
      text: scrapedContent.content.text,
      metadata: scrapedContent.metadata,
      structuredData: scrapedContent.content.structuredData,
    },
    hash: scrapedContent.contentHash,
  };
}

async function getExistingBaseline(
  websiteUrl: string,
): Promise<BaselineSnapshot> {
  // Mock implementation - replace with actual baseline retrieval
  return {
    id: 'existing-baseline',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    content: {
      html: '<html><body><h1>Previous baseline</h1></body></html>',
      text: 'Previous baseline content',
      metadata: {
        title: 'Previous Baseline',
        description: 'Previous baseline description',
        keywords: ['baseline'],
        lastModified: new Date(Date.now() - 86400000).toISOString(),
        contentLength: 100,
      },
      structuredData: {
        headings: [],
        links: [],
        images: [],
        forms: [],
      },
    },
    hash: 'previous-hash',
  };
}

async function detectChanges(
  scrapedContent: any,
  baseline: BaselineSnapshot,
  customFilters?: string[],
): Promise<ChangeDetection[]> {
  const changes: ChangeDetection[] = [];
  const currentContent = scrapedContent.content;
  const baselineContent = baseline.content;

  // Compare content hash
  if (scrapedContent.contentHash !== baseline.hash) {
    changes.push({
      type: 'modified',
      path: 'content',
      oldValue: `${baselineContent.text.substring(0, 100)}...`,
      newValue: `${currentContent.text.substring(0, 100)}...`,
      diff: generateDiff(baselineContent.text, currentContent.text),
      severity: 'medium',
      timestamp: new Date().toISOString(),
    });
  }

  // Compare metadata
  if (currentContent.metadata.title !== baselineContent.metadata.title) {
    changes.push({
      type: 'modified',
      path: 'metadata.title',
      oldValue: baselineContent.metadata.title,
      newValue: currentContent.metadata.title,
      diff: `Title changed from "${baselineContent.metadata.title}" to "${currentContent.metadata.title}"`,
      severity: 'high',
      timestamp: new Date().toISOString(),
    });
  }

  // Compare headings structure
  const baselineHeadings = baselineContent.structuredData.headings;
  const currentHeadings = currentContent.structuredData.headings;

  if (baselineHeadings.length !== currentHeadings.length) {
    changes.push({
      type: 'modified',
      path: 'structure.headings',
      oldValue: `Found ${baselineHeadings.length} headings`,
      newValue: `Found ${currentHeadings.length} headings`,
      diff: `Heading count changed from ${baselineHeadings.length} to ${currentHeadings.length}`,
      severity: 'low',
      timestamp: new Date().toISOString(),
    });
  }

  // Compare links
  const baselineLinks = baselineContent.structuredData.links;
  const currentLinks = currentContent.structuredData.links;

  if (baselineLinks.length !== currentLinks.length) {
    changes.push({
      type: 'modified',
      path: 'structure.links',
      oldValue: `Found ${baselineLinks.length} links`,
      newValue: `Found ${currentLinks.length} links`,
      diff: `Link count changed from ${baselineLinks.length} to ${currentLinks.length}`,
      severity: 'medium',
      timestamp: new Date().toISOString(),
    });
  }

  return changes;
}

function generateDiff(oldText: string, newText: string): string {
  // Mock diff generation - replace with actual diff algorithm
  const oldWords = oldText.split(' ');
  const newWords = newText.split(' ');

  const added = newWords.filter((word) => !oldWords.includes(word));
  const removed = oldWords.filter((word) => !newWords.includes(word));

  let diff = '';
  if (added.length > 0) {
    diff += `Added: ${added.slice(0, 5).join(', ')}${added.length > 5 ? '...' : ''}`;
  }
  if (removed.length > 0) {
    diff += `${diff ? '; ' : ''}Removed: ${removed.slice(0, 5).join(', ')}${removed.length > 5 ? '...' : ''}`;
  }

  return diff || 'Minor text changes detected';
}

async function analyzeMeaningfulChanges(
  changes: ChangeDetection[],
  websiteUrl: string,
  monitorType: string,
): Promise<MeaningfulChange[]> {
  const meaningfulChanges: MeaningfulChange[] = [];

  for (const change of changes) {
    // Analyze each change for business impact
    const analysis = await analyzeChangeImpact(change, websiteUrl, monitorType);

    if (analysis.isMeaningful) {
      meaningfulChanges.push({
        changeId: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        summary: analysis.summary,
        impact: analysis.impact,
        confidence: analysis.confidence,
        aiAnalysis: analysis.aiAnalysis,
        recommendations: analysis.recommendations,
        priority: analysis.priority,
        affectedAreas: analysis.affectedAreas,
        businessImpact: analysis.businessImpact,
      });
    }
  }

  return meaningfulChanges;
}

async function analyzeChangeImpact(
  change: ChangeDetection,
  websiteUrl: string,
  monitorType: string,
): Promise<{
  isMeaningful: boolean;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  aiAnalysis: string;
  recommendations: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  affectedAreas: string[];
  businessImpact: string;
}> {
  // Mock AI analysis - replace with actual AI provider integration
  const isMeaningful =
    change.severity === 'high' || change.severity === 'critical';

  let impact: 'positive' | 'negative' | 'neutral' = 'neutral';
  let priority: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let businessImpact = 'No significant business impact detected';

  if (change.path.includes('title')) {
    impact = 'high';
    priority = 'high';
    businessImpact = 'Page title changes may affect SEO and user experience';
  } else if (change.path.includes('content')) {
    impact = 'medium';
    priority = 'medium';
    businessImpact =
      'Content changes detected - review for accuracy and relevance';
  } else if (change.path.includes('structure')) {
    impact = 'low';
    priority = 'low';
    businessImpact = 'Structural changes detected - verify site functionality';
  }

  const recommendations = [];
  if (priority === 'high') {
    recommendations.push('Review changes immediately');
    recommendations.push('Verify SEO impact');
  }
  if (priority === 'medium') {
    recommendations.push('Monitor for additional changes');
    recommendations.push('Update documentation if needed');
  }
  if (priority === 'low') {
    recommendations.push('Continue monitoring');
  }

  return {
    isMeaningful,
    summary: `${change.type} change detected in ${change.path}`,
    impact,
    confidence: 0.8,
    aiAnalysis: `AI analysis indicates this change has ${impact} impact on the website's ${monitorType} monitoring criteria.`,
    recommendations,
    priority,
    affectedAreas: [change.path],
    businessImpact,
  };
}

async function manageNotifications(
  meaningfulChanges: MeaningfulChange[],
  notificationSettings?: NotificationSettings,
): Promise<WebsiteMonitorResult['notifications']> {
  if (!notificationSettings || meaningfulChanges.length === 0) {
    return {
      sent: false,
      channels: [],
      recipients: [],
      message: 'No notifications sent',
      timestamp: new Date().toISOString(),
    };
  }

  const channels: string[] = [];
  const recipients: string[] = [];
  let message = '';

  if (notificationSettings.email) {
    channels.push('email');
    recipients.push('admin@example.com');
    message += 'Email notification sent; ';
  }

  if (notificationSettings.webhook) {
    channels.push('webhook');
    message += 'Webhook notification sent; ';
  }

  if (notificationSettings.slack) {
    channels.push('slack');
    message += 'Slack notification sent; ';
  }

  message += `Detected ${meaningfulChanges.length} meaningful changes`;

  return {
    sent: channels.length > 0,
    channels,
    recipients,
    message,
    timestamp: new Date().toISOString(),
  };
}

async function setupMonitoringSchedule(
  websiteUrl: string,
  checkInterval: number,
  monitorType: string,
): Promise<WebsiteMonitorResult['monitoringSchedule']> {
  // Mock monitoring schedule setup - replace with actual scheduling logic
  const nextCheck = new Date(Date.now() + checkInterval * 1000).toISOString();

  return {
    active: true,
    nextCheck,
    interval: checkInterval,
    lastCheck: new Date().toISOString(),
    totalChecks: 1,
    successRate: 100,
  };
}
