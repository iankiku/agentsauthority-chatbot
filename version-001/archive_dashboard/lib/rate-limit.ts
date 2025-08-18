import { NextRequest } from 'next/server';
import Redis from 'ioredis';
import { RateLimitError } from './api-errors';

/**
 * Enhanced rate limiting implementation with Redis backend
 * Supports different limits per user tier and endpoint type
 */

// Initialize Redis client (optional - falls back to in-memory if not configured)
const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL!)
  : null;

// In-memory fallback for development
const memoryStore = new Map<string, { count: number; resetTime: number }>();

export type UserTier = 'free' | 'pro' | 'enterprise';
export type EndpointType = 'standard' | 'ai' | 'export' | 'upload';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

/**
 * Rate limit configurations by user tier and endpoint type
 */
export const RATE_LIMITS = {
  free: {
    standard: { requests: 100, window: 3600 }, // 100/hour
    ai: { requests: 20, window: 3600 },       // 20/hour
    export: { requests: 5, window: 3600 },     // 5/hour
    upload: { requests: 10, window: 3600 },    // 10/hour
  },
  pro: {
    standard: { requests: 1000, window: 3600 }, // 1000/hour
    ai: { requests: 200, window: 3600 },       // 200/hour
    export: { requests: 50, window: 3600 },     // 50/hour
    upload: { requests: 100, window: 3600 },    // 100/hour
  },
  enterprise: {
    standard: { requests: 10000, window: 3600 }, // 10000/hour
    ai: { requests: 2000, window: 3600 },       // 2000/hour
    export: { requests: 500, window: 3600 },     // 500/hour
    upload: { requests: 1000, window: 3600 },    // 1000/hour
  },
} as const;

/**
 * Determine endpoint type based on request path
 */
export function getEndpointType(pathname: string): EndpointType {
  if (pathname.includes('/ai/') || pathname.includes('/chat') || pathname.includes('/brand-monitor/analyze')) {
    return 'ai';
  }
  if (pathname.includes('/export')) {
    return 'export';
  }
  if (pathname.includes('/upload') || pathname.includes('/import')) {
    return 'upload';
  }
  return 'standard';
}

/**
 * Get user tier (placeholder - should be replaced with actual user tier lookup)
 */
export function getUserTier(userId: string): Promise<UserTier> {
  // TODO: Implement actual user tier lookup from database
  // For now, default to 'free'
  return Promise.resolve('free');
}

/**
 * Generate rate limit key
 */
function getRateLimitKey(userId: string, endpointType: EndpointType, tier: UserTier): string {
  return `rate_limit:${tier}:${endpointType}:${userId}`;
}

/**
 * Check and update rate limit using Redis
 */
async function checkRateLimitRedis(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  if (!redis) {
    throw new Error('Redis not configured for rate limiting');
  }

  const pipeline = redis.pipeline();
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - windowSeconds;

  // Use sliding window log approach
  pipeline.zremrangebyscore(key, '-inf', windowStart);
  pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });
  pipeline.zcard(key);
  pipeline.expire(key, windowSeconds);

  const results = await pipeline.exec();
  const count = results[2] as number;

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetTime: now + windowSeconds,
  };
}

/**
 * Check and update rate limit using in-memory store (fallback)
 */
function checkRateLimitMemory(
  key: string,
  limit: number,
  windowSeconds: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetTime) {
    // New window
    const newEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    memoryStore.set(key, newEntry);
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: Math.floor(newEntry.resetTime / 1000),
    };
  }

  // Existing window
  entry.count++;
  memoryStore.set(key, entry);

  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetTime: Math.floor(entry.resetTime / 1000),
  };
}

/**
 * Rate limiting result interface
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
  tier: UserTier;
  endpointType: EndpointType;
}

/**
 * Check rate limit for a user and endpoint
 */
export async function checkRateLimit(
  userId: string,
  pathname: string
): Promise<RateLimitResult> {
  const tier = await getUserTier(userId);
  const endpointType = getEndpointType(pathname);
  const config = RATE_LIMITS[tier][endpointType];
  const key = getRateLimitKey(userId, endpointType, tier);

  let result;
  try {
    if (redis) {
      result = await checkRateLimitRedis(key, config.requests, config.window);
    } else {
      result = checkRateLimitMemory(key, config.requests, config.window);
    }
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fallback to memory store
    result = checkRateLimitMemory(key, config.requests, config.window);
  }

  return {
    ...result,
    limit: config.requests,
    tier,
    endpointType,
  };
}

/**
 * Rate limiting middleware function
 */
export async function rateLimitMiddleware(
  request: NextRequest,
  userId: string
): Promise<void> {
  const result = await checkRateLimit(userId, request.nextUrl.pathname);

  if (!result.allowed) {
    const retryAfter = result.resetTime - Math.floor(Date.now() / 1000);
    throw new RateLimitError(
      `Rate limit exceeded. Limit: ${result.limit} requests per hour for ${result.tier} tier.`,
      retryAfter
    );
  }
}

/**
 * Generate rate limit headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
    'X-RateLimit-Tier': result.tier,
    'X-RateLimit-Type': result.endpointType,
  };
}

/**
 * Get rate limit info without consuming quota (for status endpoints)
 */
export async function getRateLimitInfo(
  userId: string,
  pathname: string
): Promise<RateLimitResult> {
  const tier = await getUserTier(userId);
  const endpointType = getEndpointType(pathname);
  const config = RATE_LIMITS[tier][endpointType];
  const key = getRateLimitKey(userId, endpointType, tier);

  let count = 0;
  let resetTime = Math.floor(Date.now() / 1000) + config.window;

  if (redis) {
    try {
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - config.window;
      await redis.zremrangebyscore(key, '-inf', windowStart);
      count = await redis.zcard(key) || 0;
    } catch (error) {
      console.error('Rate limit info check failed:', error);
    }
  } else {
    const entry = memoryStore.get(key);
    if (entry && Date.now() <= entry.resetTime) {
      count = entry.count;
      resetTime = Math.floor(entry.resetTime / 1000);
    }
  }

  return {
    allowed: count < config.requests,
    remaining: Math.max(0, config.requests - count),
    resetTime,
    limit: config.requests,
    tier,
    endpointType,
  };
}

// Legacy exports for backward compatibility
export function createRateLimit(config: RateLimitConfig) {
  return async (request: NextRequest, identifier: string) => {
    const now = Date.now();
    
    // Clean up expired entries
    for (const [key, value] of memoryStore.entries()) {
      if (value.resetTime < now) {
        memoryStore.delete(key);
      }
    }
    
    const current = memoryStore.get(identifier);
    
    if (!current || current.resetTime < now) {
      memoryStore.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return;
    }
    
    if (current.count >= config.maxRequests) {
      const retryAfter = Math.ceil((current.resetTime - now) / 1000);
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter
      );
    }
    
    current.count++;
    memoryStore.set(identifier, current);
  };
}

export const apiRateLimit = createRateLimit({ windowMs: 60000, maxRequests: 100 });
export const authRateLimit = createRateLimit({ windowMs: 900000, maxRequests: 5 });