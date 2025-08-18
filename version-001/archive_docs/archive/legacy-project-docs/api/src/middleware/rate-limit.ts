const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Window in milliseconds
  maxRequests: number; // Max requests per window
}

export function createRateLimit(config: RateLimitConfig) {
  return async (identifier: string) => {
    const now = Date.now();
    
    // Clean up expired entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
    
    const current = rateLimitStore.get(identifier);
    
    if (!current || current.resetTime < now) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return;
    }
    
    if (current.count >= config.maxRequests) {
      const retryAfter = Math.ceil((current.resetTime - now) / 1000);
      throw new Error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
    }
    
    current.count++;
    rateLimitStore.set(identifier, current);
  };
}

export const apiRateLimit = createRateLimit({ windowMs: 60000, maxRequests: 100 }); // 100 requests per minute
export const authRateLimit = createRateLimit({ windowMs: 900000, maxRequests: 5 }); // 5 requests per 15 minutes
