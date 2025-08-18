// Service discovery and registry for microservices communication

type ServiceName = 'auth' | 'agents' | 'dashboard' | 'web';

interface ServiceConfig {
  url: string;
  port: number;
  health?: string;
}

class ServiceRegistry {
  private static services: Record<ServiceName, ServiceConfig> = {
    auth: {
      url: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3003',
      port: 3003,
      health: '/api/health'
    },
    agents: {
      url: process.env.MASTRA_BASE_URL || 'http://localhost:4111',
      port: 4111,
      health: '/health'
    },
    dashboard: {
      url: process.env.NEXT_PUBLIC_FRAGMENT_URL || 'http://localhost:3001',
      port: 3001,
    },
    web: {
      url: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',
      port: 3000,
    }
  };

  static getServiceUrl(serviceName: ServiceName): string {
    const service = this.services[serviceName];
    if (!service) {
      throw new Error(`Service ${serviceName} not found in registry`);
    }
    return service.url;
  }

  static getServiceConfig(serviceName: ServiceName): ServiceConfig {
    const service = this.services[serviceName];
    if (!service) {
      throw new Error(`Service ${serviceName} not found in registry`);
    }
    return service;
  }

  static async checkServiceHealth(serviceName: ServiceName): Promise<boolean> {
    const service = this.services[serviceName];
    if (!service.health) return true; // Assume healthy if no health check

    try {
      const response = await fetch(`${service.url}${service.health}`, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  static async validateAllServices(): Promise<Record<ServiceName, boolean>> {
    const results: Record<ServiceName, boolean> = {} as Record<ServiceName, boolean>;
    
    for (const [name, _] of Object.entries(this.services)) {
      results[name as ServiceName] = await this.checkServiceHealth(name as ServiceName);
    }
    
    return results;
  }
}

export default ServiceRegistry;

// Utility functions
export const getAuthServiceUrl = () => ServiceRegistry.getServiceUrl('auth');
export const getAgentsServiceUrl = () => ServiceRegistry.getServiceUrl('agents');
export const getDashboardServiceUrl = () => ServiceRegistry.getServiceUrl('dashboard');
export const getWebServiceUrl = () => ServiceRegistry.getServiceUrl('web');