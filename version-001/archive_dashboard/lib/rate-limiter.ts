import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// In-memory store for rate limiting (use Redis in production)
class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  get(key: string): { count: number; resetTime: number } | null {
    const record = this.store.get(key);
    if (!record) return null;

    // Clean up expired records
    if (record.resetTime < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return record;
  }

  set(key: string, count: number, resetTime: number): void {
    this.store.set(key, { count, resetTime });
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const record = this.get(key);

    if (!record) {
      const resetTime = now + windowMs;
      this.set(key, 1, resetTime);
      return { count: 1, resetTime };
    }

    const newCount = record.count + 1;
    this.set(key, newCount, record.resetTime);
    return { count: newCount, resetTime: record.resetTime };
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (record.resetTime < now) {
        this.store.delete(key);
      }
    }
  }
}

const store = new MemoryStore();

// Clean up expired entries every 5 minutes
setInterval(() => store.cleanup(), 5 * 60 * 1000);

export function createRateLimiter(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (req) => getClientIdentifier(req),
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = config;

  return async (request: NextRequest): Promise<NextResponse | null> => {
    const key = keyGenerator(request);
    const { count, resetTime } = store.increment(key, windowMs);

    // Check if limit exceeded
    if (count > maxRequests) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
            details: {
              limit: maxRequests,
              windowMs,
              retryAfter
            }
          },
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetTime.toString(),
            'Retry-After': retryAfter.toString()
          }
        }
      );
    }

    // Add rate limit headers to successful requests
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', (maxRequests - count).toString());
    response.headers.set('X-RateLimit-Reset', resetTime.toString());

    return null; // Continue to next middleware/handler
  };
}

// Get client identifier for rate limiting
function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from session first
  const userId = request.headers.get('x-user-id');
  if (userId) return `user:${userId}`;

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return `ip:${ip}`;
}

// Predefined rate limiters
export const strictRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10 // 10 requests per 15 minutes
});

export const standardRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // 100 requests per 15 minutes
});

export const generousRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000 // 1000 requests per 15 minutes
});

// API-specific rate limiters
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20, // 20 auth attempts per 15 minutes
  keyGenerator: (req) => {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    return `auth:${ip}`;
  }
});

export const aiRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 AI requests per minute
  keyGenerator: (req) => {
    const userId = req.headers.get('x-user-id') || 'anonymous';
    return `ai:${userId}`;
  }
});