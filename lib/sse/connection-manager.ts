import type { SSEConnection } from './progress-tracker';
import { getActiveConnections, getConnectionStats } from './progress-tracker';

export interface ConnectionMetrics {
  totalConnections: number;
  activeConnections: number;
  connectionHealth: {
    healthy: number;
    unhealthy: number;
    stale: number;
  };
  averageConnectionTime: number;
  connectionErrors: number;
}

export interface ConnectionHealth {
  taskId: string;
  isHealthy: boolean;
  connectionAge: number;
  lastActivity: number;
  errorCount: number;
  status: 'healthy' | 'unhealthy' | 'stale';
}

export class ConnectionManager {
  private static instance: ConnectionManager;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private metrics: ConnectionMetrics = {
    totalConnections: 0,
    activeConnections: 0,
    connectionHealth: {
      healthy: 0,
      unhealthy: 0,
      stale: 0,
    },
    averageConnectionTime: 0,
    connectionErrors: 0,
  };

  private constructor() {
    this.startHealthMonitoring();
  }

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  private startHealthMonitoring() {
    // Check connection health every 30 seconds
    this.healthCheckInterval = setInterval(() => {
      this.updateMetrics();
      this.cleanupStaleConnections();
    }, 30000);
  }

  private updateMetrics() {
    const stats = getConnectionStats();
    const connections = getActiveConnections();
    const now = Date.now();

    // Calculate connection health
    const healthStats = connections.map((conn) =>
      this.getConnectionHealth(conn, now),
    );

    this.metrics = {
      totalConnections: stats.totalTasks,
      activeConnections: connections.length,
      connectionHealth: {
        healthy: healthStats.filter((h) => h.status === 'healthy').length,
        unhealthy: healthStats.filter((h) => h.status === 'unhealthy').length,
        stale: healthStats.filter((h) => h.status === 'stale').length,
      },
      averageConnectionTime:
        connections.length > 0
          ? connections.reduce(
              (sum, conn) => sum + (now - conn.connectedAt),
              0,
            ) / connections.length
          : 0,
      connectionErrors: this.metrics.connectionErrors, // Preserve error count
    };

    // Log metrics for monitoring
    if (connections.length > 0) {
      console.log('SSE Connection Metrics:', {
        activeConnections: connections.length,
        healthDistribution: this.metrics.connectionHealth,
        averageConnectionTime: `${Math.round(this.metrics.averageConnectionTime / 1000)}s`,
      });
    }
  }

  private getConnectionHealth(
    connection: SSEConnection,
    now: number,
  ): ConnectionHealth {
    const connectionAge = now - connection.connectedAt;
    const timeSinceLastActivity = now - connection.lastActivity;

    // Consider connection stale if no activity for 2 minutes
    const isStale = timeSinceLastActivity > 120000;
    // Consider unhealthy if no activity for 30 seconds
    const isUnhealthy = timeSinceLastActivity > 30000;

    return {
      taskId: connection.taskId,
      isHealthy: !isStale && !isUnhealthy,
      connectionAge,
      lastActivity: connection.lastActivity,
      errorCount: 0, // Would be tracked in a real implementation
      status: isStale ? 'stale' : isUnhealthy ? 'unhealthy' : 'healthy',
    };
  }

  private cleanupStaleConnections() {
    const connections = getActiveConnections();
    const now = Date.now();

    connections.forEach((connection) => {
      const health = this.getConnectionHealth(connection, now);
      if (health.status === 'stale') {
        console.log(
          `Cleaning up stale connection for task: ${connection.taskId}`,
        );
        // In a real implementation, we would close the connection
        // For now, we just log it
      }
    });
  }

  getMetrics(): ConnectionMetrics {
    return { ...this.metrics };
  }

  getConnectionHealthForTask(taskId: string): ConnectionHealth | null {
    const connections = getActiveConnections();
    const connection = connections.find((conn) => conn.taskId === taskId);

    if (!connection) {
      return null;
    }

    return this.getConnectionHealth(connection, Date.now());
  }

  getAllConnectionHealth(): ConnectionHealth[] {
    const connections = getActiveConnections();
    const now = Date.now();

    return connections.map((conn) => this.getConnectionHealth(conn, now));
  }

  incrementErrorCount() {
    this.metrics.connectionErrors++;
  }

  // Cleanup method for graceful shutdown
  cleanup() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

// Export singleton instance
export const connectionManager = ConnectionManager.getInstance();
