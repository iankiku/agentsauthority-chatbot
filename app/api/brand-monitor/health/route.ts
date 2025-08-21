import type { NextRequest } from 'next/server';
import { connectionManager } from '../../../../lib/sse/connection-manager';
import { getConnectionStats } from '../../../../lib/sse/progress-tracker';

export async function GET(request: NextRequest) {
  try {
    const stats = getConnectionStats();
    const metrics = connectionManager.getMetrics();
    const healthStatus = connectionManager.getAllConnectionHealth();

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      infrastructure: {
        totalTasks: stats.totalTasks,
        activeConnections: stats.activeConnections,
        tasksByStatus: stats.tasksByStatus,
      },
      connections: {
        total: metrics.totalConnections,
        active: metrics.activeConnections,
        health: metrics.connectionHealth,
        averageConnectionTime: Math.round(metrics.averageConnectionTime / 1000),
        errorCount: metrics.connectionErrors,
      },
      connectionDetails: healthStatus.map((health) => ({
        taskId: health.taskId,
        status: health.status,
        connectionAge: Math.round(health.connectionAge / 1000),
        lastActivity: Math.round((Date.now() - health.lastActivity) / 1000),
      })),
    };

    // Determine overall health status
    const hasUnhealthyConnections = healthStatus.some(
      (h) => h.status === 'unhealthy',
    );
    const hasStaleConnections = healthStatus.some((h) => h.status === 'stale');

    if (hasStaleConnections) {
      healthData.status = 'degraded';
    }
    if (hasUnhealthyConnections && metrics.connectionErrors > 5) {
      healthData.status = 'unhealthy';
    }

    return new Response(JSON.stringify(healthData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}

export async function HEAD(request: NextRequest) {
  // Simple health check for load balancers
  try {
    const stats = getConnectionStats();
    const isHealthy = stats.activeConnections >= 0; // Basic check

    return new Response(null, {
      status: isHealthy ? 200 : 503,
      headers: {
        'X-Health-Status': isHealthy ? 'healthy' : 'unhealthy',
        'X-Active-Connections': stats.activeConnections.toString(),
      },
    });
  } catch (error) {
    return new Response(null, {
      status: 503,
      headers: {
        'X-Health-Status': 'unhealthy',
        'X-Error': 'Health check failed',
      },
    });
  }
}
