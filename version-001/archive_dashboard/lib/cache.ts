import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL!);

// Cache key prefixes
export const CACHE_PREFIXES = {
  GEO_SCAN: 'geo:scan',
  VISIBILITY_ANALYSIS: 'visibility:analysis',
  COMPETITOR_DATA: 'competitor:data',
  USER_SESSION: 'session:user',
  RATE_LIMIT: 'rate:limit',
} as const;

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  GEO_SCAN: 3600, // 1 hour - GEO scans are expensive but data changes slowly
  VISIBILITY_ANALYSIS: 1800, // 30 minutes - Visibility data updates more frequently
  COMPETITOR_DATA: 7200, // 2 hours - Competitor data is relatively stable
  USER_SESSION: 86400, // 24 hours - User sessions
  RATE_LIMIT: 3600, // 1 hour - Rate limiting windows
} as const;

// Generic cache interface
export interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

// Cache utility functions
export class CacheManager {
  /**
   * Generate a cache key with prefix and hash for long keys
   */
  static generateKey(prefix: string, identifier: string): string {
    // For very long identifiers, use a hash to keep Redis keys manageable
    if (identifier.length > 200) {
      const hash = Buffer.from(identifier).toString('base64').slice(0, 32);
      return `${prefix}:${hash}`;
    }
    return `${prefix}:${identifier}`;
  }

  /**
   * Get cached data
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set cached data with TTL
   */
  static async set(key: string, data: any, ttl: number = CACHE_TTL.GEO_SCAN): Promise<boolean> {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete cached data
   */
  static async delete(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get TTL for a key
   */
  static async getTTL(key: string): Promise<number> {
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Increment a counter (useful for rate limiting)
   */
  static async increment(key: string, ttl: number = CACHE_TTL.RATE_LIMIT): Promise<number> {
    try {
      const count = await redis.incr(key);
      if (count === 1) {
        // Set TTL only on first increment
        await redis.expire(key, ttl);
      }
      return count;
    } catch (error) {
      console.error(`Cache increment error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Get multiple keys at once
   */
  static async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const results = await redis.mget(...keys);
      return results.map(result => result as T);
    } catch (error) {
      console.error(`Cache mget error for keys ${keys.join(', ')}:`, error);
      return keys.map(() => null);
    }
  }

  /**
   * Set multiple keys at once
   */
  static async mset(keyValuePairs: Record<string, any>, ttl: number = CACHE_TTL.GEO_SCAN): Promise<boolean> {
    try {
      const pipeline = redis.pipeline();
      
      Object.entries(keyValuePairs).forEach(([key, value]) => {
        pipeline.setex(key, ttl, JSON.stringify(value));
      });
      
      await pipeline.exec();
      return true;
    } catch (error) {
      console.error(`Cache mset error:`, error);
      return false;
    }
  }

  /**
   * Clear all keys with a specific prefix
   */
  static async clearPrefix(prefix: string): Promise<number> {
    try {
      const keys = await redis.keys(`${prefix}:*`);
      if (keys.length === 0) return 0;
      
      await redis.del(...keys);
      return keys.length;
    } catch (error) {
      console.error(`Cache clear prefix error for ${prefix}:`, error);
      return 0;
    }
  }
}

// Specialized cache functions for GEO scanning
export class GeoCacheManager {
  /**
   * Generate cache key for GEO scan results
   */
  static generateGeoScanKey(businessName: string, website: string, industry?: string): string {
    const identifier = `${businessName.toLowerCase()}:${website.toLowerCase()}${industry ? `:${industry.toLowerCase()}` : ''}`;
    return CacheManager.generateKey(CACHE_PREFIXES.GEO_SCAN, identifier);
  }

  /**
   * Get cached GEO scan results
   */
  static async getGeoScan(businessName: string, website: string, industry?: string): Promise<any | null> {
    const key = this.generateGeoScanKey(businessName, website, industry);
    return CacheManager.get(key);
  }

  /**
   * Cache GEO scan results
   */
  static async setGeoScan(
    businessName: string, 
    website: string, 
    data: any, 
    industry?: string,
    ttl: number = CACHE_TTL.GEO_SCAN
  ): Promise<boolean> {
    const key = this.generateGeoScanKey(businessName, website, industry);
    return CacheManager.set(key, {
      ...data,
      cached_at: new Date().toISOString(),
      cache_key: key,
    }, ttl);
  }

  /**
   * Check if GEO scan is cached and fresh
   */
  static async isGeoScanCached(businessName: string, website: string, industry?: string): Promise<boolean> {
    const key = this.generateGeoScanKey(businessName, website, industry);
    return CacheManager.exists(key);
  }

  /**
   * Get cache info for GEO scan
   */
  static async getGeoScanCacheInfo(businessName: string, website: string, industry?: string): Promise<{
    exists: boolean;
    ttl: number;
    key: string;
  }> {
    const key = this.generateGeoScanKey(businessName, website, industry);
    const [exists, ttl] = await Promise.all([
      CacheManager.exists(key),
      CacheManager.getTTL(key)
    ]);
    
    return { exists, ttl, key };
  }
}

// Rate limiting utilities
export class RateLimitManager {
  /**
   * Check and increment rate limit for a user/IP
   */
  static async checkRateLimit(
    identifier: string, 
    limit: number = 10, 
    window: number = CACHE_TTL.RATE_LIMIT
  ): Promise<{
    allowed: boolean;
    count: number;
    remaining: number;
    resetTime: number;
  }> {
    const key = CacheManager.generateKey(CACHE_PREFIXES.RATE_LIMIT, identifier);
    const count = await CacheManager.increment(key, window);
    const ttl = await CacheManager.getTTL(key);
    
    return {
      allowed: count <= limit,
      count,
      remaining: Math.max(0, limit - count),
      resetTime: Date.now() + (ttl * 1000),
    };
  }
}

export { redis };
