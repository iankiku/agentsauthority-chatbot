interface PerformanceMetric {
  scenario: string;
  executionTime: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
  };
  success: boolean;
  error?: string;
  timestamp: string;
}

interface DemoPerformanceResult<T> {
  result: T;
  performance: PerformanceMetric;
  passed: boolean;
}

interface PerformanceReport {
  totalTests: number;
  passed: number;
  failed: number;
  averageExecutionTime: number;
  maxExecutionTime: number;
  memoryUsage: {
    average: number;
    max: number;
  };
  recommendations: string[];
}

class DemoExecutionError extends Error {
  constructor(
    public scenario: string,
    message: string,
    public metric: PerformanceMetric,
  ) {
    super(`Demo execution failed for ${scenario}: ${message}`);
    this.name = 'DemoExecutionError';
  }
}

export class DemoPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];

  async monitorDemoExecution<T>(
    scenario: string,
    operation: () => Promise<T>,
  ): Promise<DemoPerformanceResult<T>> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage();

    try {
      const result = await operation();
      const endTime = performance.now();
      const endMemory = process.memoryUsage();

      const metric: PerformanceMetric = {
        scenario,
        executionTime: endTime - startTime,
        memoryUsage: {
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          heapTotal: endMemory.heapTotal - startMemory.heapTotal,
        },
        success: true,
        timestamp: new Date().toISOString(),
      };

      this.metrics.push(metric);

      return {
        result,
        performance: metric,
        passed: this.validatePerformance(metric),
      };
    } catch (error) {
      const endTime = performance.now();

      const metric: PerformanceMetric = {
        scenario,
        executionTime: endTime - startTime,
        memoryUsage: { heapUsed: 0, heapTotal: 0 },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };

      this.metrics.push(metric);
      throw new DemoExecutionError(
        scenario,
        error instanceof Error ? error.message : 'Unknown error',
        metric,
      );
    }
  }

  private validatePerformance(metric: PerformanceMetric): boolean {
    const benchmarks = {
      'Multi-Model Visibility Analysis': {
        maxTime: 15000,
        maxMemory: 50 * 1024 * 1024, // 50MB
      },
      'Brand Mention Monitoring': {
        maxTime: 45000,
        maxMemory: 100 * 1024 * 1024, // 100MB
      },
      'Competitive Intelligence Analysis': {
        maxTime: 30000,
        maxMemory: 75 * 1024 * 1024, // 75MB
      },
      'Content Optimization Analysis': {
        maxTime: 20000,
        maxMemory: 60 * 1024 * 1024, // 60MB
      },
    };

    const benchmark = benchmarks[metric.scenario as keyof typeof benchmarks];
    if (!benchmark) return true;

    const timePassed = metric.executionTime <= benchmark.maxTime;
    const memoryPassed = metric.memoryUsage.heapUsed <= benchmark.maxMemory;

    if (!timePassed) {
      console.warn(
        `Performance warning: ${metric.scenario} took ${metric.executionTime}ms (limit: ${benchmark.maxTime}ms)`,
      );
    }

    if (!memoryPassed) {
      console.warn(
        `Memory warning: ${metric.scenario} used ${metric.memoryUsage.heapUsed / 1024 / 1024}MB (limit: ${benchmark.maxMemory / 1024 / 1024}MB)`,
      );
    }

    return timePassed && memoryPassed;
  }

  generatePerformanceReport(): PerformanceReport {
    if (this.metrics.length === 0) {
      return {
        totalTests: 0,
        passed: 0,
        failed: 0,
        averageExecutionTime: 0,
        maxExecutionTime: 0,
        memoryUsage: { average: 0, max: 0 },
        recommendations: ['No performance data available'],
      };
    }

    const successfulMetrics = this.metrics.filter((m) => m.success);
    const failedMetrics = this.metrics.filter((m) => !m.success);

    const averageExecutionTime =
      successfulMetrics.length > 0
        ? successfulMetrics.reduce((sum, m) => sum + m.executionTime, 0) /
          successfulMetrics.length
        : 0;

    const maxExecutionTime = Math.max(
      ...this.metrics.map((m) => m.executionTime),
    );

    const averageMemory =
      successfulMetrics.length > 0
        ? successfulMetrics.reduce(
            (sum, m) => sum + m.memoryUsage.heapUsed,
            0,
          ) / successfulMetrics.length
        : 0;

    const maxMemory = Math.max(
      ...this.metrics.map((m) => m.memoryUsage.heapUsed),
    );

    return {
      totalTests: this.metrics.length,
      passed: successfulMetrics.length,
      failed: failedMetrics.length,
      averageExecutionTime,
      maxExecutionTime,
      memoryUsage: {
        average: averageMemory,
        max: maxMemory,
      },
      recommendations: this.generateRecommendations(),
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.length === 0) {
      return ['Run performance tests to generate recommendations'];
    }

    const successfulMetrics = this.metrics.filter((m) => m.success);
    const failedMetrics = this.metrics.filter((m) => !m.success);

    // Success rate recommendations
    const successRate = (successfulMetrics.length / this.metrics.length) * 100;
    if (successRate < 95) {
      recommendations.push(
        `Improve reliability: ${successRate.toFixed(1)}% success rate (target: 95%+)`,
      );
    }

    // Performance recommendations
    const slowScenarios = successfulMetrics.filter(
      (m) => m.executionTime > 10000,
    );
    if (slowScenarios.length > 0) {
      recommendations.push(
        `Optimize slow scenarios: ${slowScenarios.length} scenarios exceed 10s execution time`,
      );
    }

    // Memory recommendations
    const highMemoryScenarios = successfulMetrics.filter(
      (m) => m.memoryUsage.heapUsed > 50 * 1024 * 1024,
    );
    if (highMemoryScenarios.length > 0) {
      recommendations.push(
        `Reduce memory usage: ${highMemoryScenarios.length} scenarios exceed 50MB memory usage`,
      );
    }

    // Specific scenario recommendations
    const scenarioPerformance = this.analyzeScenarioPerformance();
    scenarioPerformance.forEach(({ scenario, avgTime, avgMemory, issues }) => {
      if (issues.length > 0) {
        recommendations.push(`${scenario}: ${issues.join(', ')}`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Performance meets all benchmarks - ready for demo');
    }

    return recommendations;
  }

  private analyzeScenarioPerformance(): Array<{
    scenario: string;
    avgTime: number;
    avgMemory: number;
    issues: string[];
  }> {
    const scenarioGroups = new Map<string, PerformanceMetric[]>();

    this.metrics.forEach((metric) => {
      if (!scenarioGroups.has(metric.scenario)) {
        scenarioGroups.set(metric.scenario, []);
      }
      const group = scenarioGroups.get(metric.scenario);
      if (group) {
        group.push(metric);
      }
    });

    const analysis: Array<{
      scenario: string;
      avgTime: number;
      avgMemory: number;
      issues: string[];
    }> = [];

    scenarioGroups.forEach((metrics, scenario) => {
      const successfulMetrics = metrics.filter((m) => m.success);
      if (successfulMetrics.length === 0) {
        analysis.push({
          scenario,
          avgTime: 0,
          avgMemory: 0,
          issues: ['All executions failed'],
        });
        return;
      }

      const avgTime =
        successfulMetrics.reduce((sum, m) => sum + m.executionTime, 0) /
        successfulMetrics.length;
      const avgMemory =
        successfulMetrics.reduce((sum, m) => sum + m.memoryUsage.heapUsed, 0) /
        successfulMetrics.length;

      const issues: string[] = [];

      if (avgTime > 15000) {
        issues.push(`Slow execution (${avgTime.toFixed(0)}ms avg)`);
      }

      if (avgMemory > 50 * 1024 * 1024) {
        issues.push(
          `High memory usage (${(avgMemory / 1024 / 1024).toFixed(1)}MB avg)`,
        );
      }

      const failureRate =
        (metrics.length - successfulMetrics.length) / metrics.length;
      if (failureRate > 0.1) {
        issues.push(`High failure rate (${(failureRate * 100).toFixed(1)}%)`);
      }

      analysis.push({
        scenario,
        avgTime,
        avgMemory,
        issues,
      });
    });

    return analysis;
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  exportMetrics(): string {
    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        metrics: this.metrics,
        report: this.generatePerformanceReport(),
      },
      null,
      2,
    );
  }

  async runPerformanceSuite<T>(
    scenarios: Array<{ name: string; operation: () => Promise<T> }>,
  ): Promise<DemoPerformanceResult<T>[]> {
    const results: DemoPerformanceResult<T>[] = [];

    for (const scenario of scenarios) {
      try {
        const result = await this.monitorDemoExecution(
          scenario.name,
          scenario.operation,
        );
        results.push(result);
      } catch (error) {
        console.error(`Performance suite failed for ${scenario.name}:`, error);
        // Continue with other scenarios
      }
    }

    return results;
  }

  isDemoReady(): boolean {
    const report = this.generatePerformanceReport();

    // Demo is ready if:
    // 1. Success rate is high (95%+)
    // 2. Average execution time is reasonable (<15s)
    // 3. Memory usage is acceptable (<50MB avg)
    // 4. No critical failures

    const successRate =
      report.totalTests > 0 ? (report.passed / report.totalTests) * 100 : 0;
    const avgTimeAcceptable = report.averageExecutionTime < 15000;
    const avgMemoryAcceptable = report.memoryUsage.average < 50 * 1024 * 1024;
    const noCriticalFailures = report.failed === 0;

    return (
      successRate >= 95 &&
      avgTimeAcceptable &&
      avgMemoryAcceptable &&
      noCriticalFailures
    );
  }

  getDemoReadinessReport(): {
    ready: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const report = this.generatePerformanceReport();
    const issues: string[] = [];
    const recommendations: string[] = [];

    const successRate =
      report.totalTests > 0 ? (report.passed / report.totalTests) * 100 : 0;
    if (successRate < 95) {
      issues.push(`Low success rate: ${successRate.toFixed(1)}% (need 95%+)`);
      recommendations.push('Investigate and fix failing scenarios');
    }

    if (report.averageExecutionTime > 15000) {
      issues.push(
        `Slow execution: ${report.averageExecutionTime.toFixed(0)}ms avg (need <15s)`,
      );
      recommendations.push('Optimize slow scenarios or implement caching');
    }

    if (report.memoryUsage.average > 50 * 1024 * 1024) {
      issues.push(
        `High memory usage: ${(report.memoryUsage.average / 1024 / 1024).toFixed(1)}MB avg (need <50MB)`,
      );
      recommendations.push('Optimize memory usage and implement cleanup');
    }

    if (report.failed > 0) {
      issues.push(`${report.failed} failed executions`);
      recommendations.push('Fix all failing scenarios before demo');
    }

    const ready = issues.length === 0;

    if (ready) {
      recommendations.push('Demo is ready - proceed with confidence');
    }

    return {
      ready,
      issues,
      recommendations,
    };
  }
}
