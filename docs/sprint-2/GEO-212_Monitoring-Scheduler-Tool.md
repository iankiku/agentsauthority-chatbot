# GEO-212: Monitoring Scheduler Tool

## 📋 Ticket Overview

**Type**: Backend Development **Priority**: P1 (Important) **Story Points**: 4  
**Estimated Time**: 6 hours **Assignee**: [Developer Name] **Sprint**: Sprint 2,
Phase 2B  
**Dependencies**: GEO-211 (Notification Management Tool)

## 🎯 User Story

As a **GEO analyst**, I want **automated monitoring scheduling** so that I can
**set up and manage recurring website monitoring tasks**.

## 📝 Description

Create a monitoring scheduler tool that manages recurring website monitoring
tasks, handles scheduling, pause/resume functionality, and provides monitoring
status and configuration management. This tool will integrate with the website
monitoring agent and notification system.

## 🎨 Acceptance Criteria

### Functional Requirements

- [ ] **AC1**: Creates and manages recurring monitoring schedules
- [ ] **AC2**: Supports pause/resume functionality for monitoring tasks
- [ ] **AC3**: Provides monitoring status and configuration management
- [ ] **AC4**: Handles different monitoring intervals and frequencies
- [ ] **AC5**: Integrates with notification system for alerts
- [ ] **AC6**: Provides monitoring history and performance metrics

### Data Structure Requirements

- [ ] **AC7**: Returns monitoring schedule configuration and status
- [ ] **AC8**: Includes monitoring history and performance data
- [ ] **AC9**: Provides monitoring statistics and metrics
- [ ] **AC10**: Supports monitoring configuration updates
- [ ] **AC11**: Includes monitoring task management features
- [ ] **AC12**: Handles monitoring schedule conflicts and optimization

### Integration Requirements

- [ ] **AC13**: Works seamlessly with existing chat interface
- [ ] **AC14**: Tool description is clear and discoverable
- [ ] **AC15**: Parameter validation using Zod schemas
- [ ] **AC16**: Error responses are user-friendly and actionable
- [ ] **AC17**: Response format supports artifact generation
- [ ] **AC18**: Integrates with website monitoring agent workflow

## 🛠️ Technical Implementation

### Tool Implementation

```typescript
// lib/ai/tools/monitoring-scheduler-tool.ts
export const monitoringSchedulerTool = tool({
	description: "Automated monitoring scheduling and task management",
	inputSchema: z.object({
		websiteUrl: z.string().url(),
		monitoringConfig: z.object({
			interval: z.number().min(300).max(86400), // 5 minutes to 24 hours
			frequency: z
				.enum(["continuous", "hourly", "daily", "weekly", "custom"])
				.default("hourly"),
			startTime: z.string().optional(),
			endTime: z.string().optional(),
			timezone: z.string().default("UTC"),
			enabled: z.boolean().default(true),
		}),
		monitorType: z
			.enum(["content", "structure", "performance", "comprehensive"])
			.default("comprehensive"),
		notificationSettings: z
			.object({
				enabled: z.boolean().default(true),
				channels: z
					.array(z.enum(["email", "webhook", "slack", "inApp"]))
					.default(["inApp"]),
				severityThreshold: z
					.enum(["low", "medium", "high", "critical"])
					.default("medium"),
			})
			.optional(),
		action: z
			.enum(["create", "update", "pause", "resume", "delete", "status"])
			.default("create"),
		scheduleId: z.string().optional(),
	}),
	handler: async (ctx, args) => {
		const {
			websiteUrl,
			monitoringConfig,
			monitorType,
			notificationSettings,
			action,
			scheduleId,
		} = args;

		try {
			let result;

			switch (action) {
				case "create":
					result = await createMonitoringSchedule(
						websiteUrl,
						monitoringConfig,
						monitorType,
						notificationSettings
					);
					break;
				case "update":
					result = await updateMonitoringSchedule(
						scheduleId!,
						monitoringConfig,
						monitorType,
						notificationSettings
					);
					break;
				case "pause":
					result = await pauseMonitoringSchedule(scheduleId!);
					break;
				case "resume":
					result = await resumeMonitoringSchedule(scheduleId!);
					break;
				case "delete":
					result = await deleteMonitoringSchedule(scheduleId!);
					break;
				case "status":
					result = await getMonitoringStatus(scheduleId!);
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
					category: "monitoring-scheduler",
					action,
					success: true,
				},
			};
		} catch (error) {
			throw new Error(`Monitoring scheduler failed: ${error.message}`);
		}
	},
});
```

### Response Data Structure

```typescript
interface MonitoringSchedulerResult {
	websiteUrl: string;
	action: "create" | "update" | "pause" | "resume" | "delete" | "status";
	scheduleId: string;
	monitoringConfig: {
		interval: number;
		frequency: "continuous" | "hourly" | "daily" | "weekly" | "custom";
		startTime?: string;
		endTime?: string;
		timezone: string;
		enabled: boolean;
	};
	monitorType: "content" | "structure" | "performance" | "comprehensive";
	notificationSettings: {
		enabled: boolean;
		channels: string[];
		severityThreshold: string;
	};
	status: {
		active: boolean;
		lastRun: string;
		nextRun: string;
		totalRuns: number;
		successfulRuns: number;
		failedRuns: number;
		lastError?: string;
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
		status: "success" | "failed" | "skipped";
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
	metadata: {
		executionTime: number;
		category: "monitoring-scheduler";
		action: string;
		success: boolean;
	};
}
```

### Scheduler Functions

```typescript
async function createMonitoringSchedule(
	websiteUrl: string,
	config: any,
	monitorType: string,
	notificationSettings: any
): Promise<ScheduleResult> {
	// Generate unique schedule ID
	const scheduleId = generateScheduleId(websiteUrl);

	// Create cron expression based on frequency
	const cronExpression = generateCronExpression(config);

	// Store monitoring schedule in database
	const schedule = await storeMonitoringSchedule({
		scheduleId,
		websiteUrl,
		config,
		monitorType,
		notificationSettings,
		cronExpression,
		status: "active",
	});

	// Set up recurring job
	await setupRecurringJob(scheduleId, cronExpression, async () => {
		await executeMonitoringTask(
			scheduleId,
			websiteUrl,
			monitorType,
			notificationSettings
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
	notificationSettings: any
): Promise<void> {
	const startTime = Date.now();

	try {
		// Execute website monitoring
		const monitoringResult = await executeWebsiteMonitoring(
			websiteUrl,
			monitorType
		);

		// Process results and send notifications if needed
		if (monitoringResult.changes && monitoringResult.changes.length > 0) {
			await sendNotifications(monitoringResult.changes, notificationSettings);
		}

		// Update monitoring history
		await updateMonitoringHistory(scheduleId, {
			status: "success",
			duration: Date.now() - startTime,
			changesDetected: monitoringResult.changes?.length || 0,
			notificationsSent: monitoringResult.notifications?.length || 0,
		});
	} catch (error) {
		// Update monitoring history with error
		await updateMonitoringHistory(scheduleId, {
			status: "failed",
			duration: Date.now() - startTime,
			error: error.message,
		});

		// Send error notification if configured
		if (notificationSettings.enabled) {
			await sendErrorNotification(
				scheduleId,
				error.message,
				notificationSettings
			);
		}
	}
}

async function getMonitoringStatus(
	scheduleId: string
): Promise<ScheduleResult> {
	// Retrieve monitoring schedule from database
	const schedule = await getMonitoringSchedule(scheduleId);

	if (!schedule) {
		throw new Error(`Monitoring schedule not found: ${scheduleId}`);
	}

	// Get monitoring history
	const history = await getMonitoringHistory(scheduleId);

	// Calculate metrics
	const metrics = calculateMonitoringMetrics(history);

	// Get current status
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
	scheduleId: string
): Promise<ScheduleResult> {
	// Pause the recurring job
	await pauseRecurringJob(scheduleId);

	// Update schedule status in database
	await updateScheduleStatus(scheduleId, "paused");

	// Return updated status
	return await getMonitoringStatus(scheduleId);
}

async function resumeMonitoringSchedule(
	scheduleId: string
): Promise<ScheduleResult> {
	// Resume the recurring job
	await resumeRecurringJob(scheduleId);

	// Update schedule status in database
	await updateScheduleStatus(scheduleId, "active");

	// Return updated status
	return await getMonitoringStatus(scheduleId);
}

function generateCronExpression(config: any): string {
	const { frequency, interval, startTime, endTime } = config;

	switch (frequency) {
		case "continuous":
			// Every 5 minutes
			return "*/5 * * * *";
		case "hourly":
			return "0 * * * *";
		case "daily":
			return "0 0 * * *";
		case "weekly":
			return "0 0 * * 0";
		case "custom":
			// Convert interval to cron expression
			return convertIntervalToCron(interval);
		default:
			return "0 * * * *"; // Default to hourly
	}
}

function calculateMonitoringMetrics(history: any[]): MonitoringMetrics {
	const totalRuns = history.length;
	const successfulRuns = history.filter((h) => h.status === "success").length;
	const failedRuns = history.filter((h) => h.status === "failed").length;

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
```

## 🧪 Testing Strategy

> **⚠️ BACKLOG ITEM**: Unit tests are defined for planning purposes but should
> be **SKIPPED** during implementation. Focus on core functionality first.

### Unit Tests

```typescript
describe("monitoringSchedulerTool", () => {
	test("should create monitoring schedules");
	test("should update monitoring configurations");
	test("should pause and resume monitoring");
	test("should delete monitoring schedules");
	test("should provide monitoring status");
	test("should handle different monitoring frequencies");
	test("should integrate with notification system");
	test("should track monitoring history");
	test("should calculate monitoring metrics");
	test("should handle schedule conflicts");
	test("should validate input parameters correctly");
	test("should return properly structured response");
});
```

### Integration Tests

```typescript
describe("Monitoring Scheduler Integration", () => {
	test("should work with Vercel AI SDK");
	test("should create artifacts correctly");
	test("should work with existing chat interface");
	test("should integrate with website monitoring agent");
	test("should work with notification management tool");
	test("should handle recurring job execution");
});
```

## 🔗 Dependencies

- **Requires**: GEO-211 (Notification Management Tool)
- **External**: Cron job scheduler (node-cron), database for schedule storage
- **Internal**: Monitoring task execution utilities, schedule management
  functions

## 📊 Performance Requirements

- **Response Time**: < 10 seconds for schedule management
- **Data Size**: Response payload < 150 KB
- **Reliability**: > 99% schedule execution success rate
- **Concurrent Usage**: Support 50+ simultaneous monitoring schedules

## 🔍 Definition of Ready

- [ ] Notification management tool is implemented
- [ ] Cron job scheduler is configured
- [ ] Database schema for schedules is designed
- [ ] Test scenarios are defined
- [ ] Monitoring task execution is planned

## ✅ Definition of Done

- [ ] All acceptance criteria met and verified
- [ ] Tool integrates successfully with chat interface
- [ ] Parameter validation works correctly
- [ ] Response structure supports artifact generation
- [ ] Error handling provides user-friendly messages
- [ ] Schedule execution reliability meets requirements (>99%)
- [ ] Unit tests defined (implementation backlogged)
- [ ] Integration tests with system passing
- [ ] Performance benchmarks met
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful

## 🚀 Usage Examples

### Basic Usage

```typescript
// User query: "Create hourly monitoring for example.com"
// Tool call with parameters:
{
	websiteUrl: "https://example.com",
	monitoringConfig: {
		interval: 3600,
		frequency: "hourly",
		enabled: true
	},
	monitorType: "comprehensive",
	action: "create"
}
```

### Advanced Usage

```typescript
// User query: "Set up custom monitoring with notifications"
// Tool call with parameters:
{
	websiteUrl: "https://example.com",
	monitoringConfig: {
		interval: 1800,
		frequency: "custom",
		startTime: "09:00",
		endTime: "18:00",
		timezone: "America/New_York",
		enabled: true
	},
	monitorType: "comprehensive",
	notificationSettings: {
		enabled: true,
		channels: ["email", "slack"],
		severityThreshold: "high"
	},
	action: "create"
}
```

## 📝 Notes

- Focus on reliable schedule execution and management
- Implement robust error handling and recovery
- Consider timezone handling and schedule conflicts
- Design for extensibility (future scheduling features)
- Ensure comprehensive monitoring metrics and reporting

## 🔄 Follow-up Tasks

- Phase 2C: Competitive Intelligence Agent tickets
