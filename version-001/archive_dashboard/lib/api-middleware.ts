import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth-utils';
import { extractVersion, ApiVersion } from './api-version';
import { rateLimitMiddleware, checkRateLimit } from './rate-limit';
import { AuthenticationError, ValidationError } from './api-errors';
import { generateRequestId, createResponseTimer } from './api-response';
import { z } from 'zod';

/**
 * Comprehensive API middleware stack
 * Provides authentication, rate limiting, validation, logging, and security
 */

export interface MiddlewareContext {
  userId?: string;
  version: ApiVersion;
  requestId: string;
  startTime: number;
  rateLimitResult?: any;
  user?: any;
}

/**
 * Security headers configuration
 */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
};

/**
 * Input sanitization middleware
 * Sanitizes request body and query parameters
 */
export function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    // Basic XSS prevention
    return data
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[sanitizeInput(key)] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return data;
}

/**
 * Request validation middleware
 */
export async function validateRequest(
  request: NextRequest,
  schema?: z.ZodSchema
): Promise<{ body?: any; query: Record<string, string> }> {
  const url = new URL(request.url);
  const query: Record<string, string> = {};
  
  // Extract and sanitize query parameters
  url.searchParams.forEach((value, key) => {
    query[sanitizeInput(key)] = sanitizeInput(value);
  });
  
  let body = null;
  
  // Parse and sanitize request body for non-GET requests
  if (request.method !== 'GET' && request.method !== 'DELETE') {
    try {
      const rawBody = await request.json();
      body = sanitizeInput(rawBody);
      
      // Validate against schema if provided
      if (schema && body) {
        const result = schema.safeParse(body);
        if (!result.success) {
          throw new ValidationError(
            'Request validation failed',
            result.error.flatten().fieldErrors
          );
        }
        body = result.data;
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      // Invalid JSON
      throw new ValidationError('Invalid JSON in request body');
    }
  }
  
  return { body, query };
}

/**
 * Authentication middleware
 * Extracts and validates user session
 */
export async function authenticateRequest(
  request: NextRequest,
  required = true
): Promise<{ user?: any; userId?: string }> {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });
    
    if (!sessionResponse?.user && required) {
      throw new AuthenticationError('Authentication required');
    }
    
    return {
      user: sessionResponse?.user,
      userId: sessionResponse?.user?.id,
    };
  } catch (error) {
    if (required) {
      throw new AuthenticationError('Invalid or expired session');
    }
    return {};
  }
}

/**
 * Audit logging middleware
 * Logs API access for security and debugging
 */
export function logApiAccess(
  request: NextRequest,
  context: MiddlewareContext,
  responseStatus?: number,
  error?: any
) {
  const logData = {
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || 'unknown',
    userId: context.userId,
    version: context.version,
    responseStatus,
    processingTime: Date.now() - context.startTime,
    error: error ? {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    } : undefined,
  };
  
  // In production, send to logging service (e.g., Winston, DataDog)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with external logging service
    console.log('[API_ACCESS]', JSON.stringify(logData));
  } else {
    console.log('[API_ACCESS]', logData);
  }
}

/**
 * Main middleware orchestrator
 * Combines all middleware functions in proper order
 */
export class ApiMiddleware {
  private static async runMiddleware(
    request: NextRequest,
    options: {
      requireAuth?: boolean;
      validationSchema?: z.ZodSchema;
      rateLimitEnabled?: boolean;
    } = {}
  ): Promise<MiddlewareContext & { body?: any; query: Record<string, string> }> {
    const timer = createResponseTimer();
    timer.start();
    
    // Initialize context
    const context: MiddlewareContext = {
      version: extractVersion(request),
      requestId: generateRequestId(),
      startTime: Date.now(),
    };
    
    // 1. Authentication
    if (options.requireAuth !== false) {
      const authResult = await authenticateRequest(request, options.requireAuth);
      context.userId = authResult.userId;
      context.user = authResult.user;
    }
    
    // 2. Rate limiting (if user is authenticated)
    if (options.rateLimitEnabled !== false && context.userId) {
      try {
        await rateLimitMiddleware(request, context.userId);
        context.rateLimitResult = await checkRateLimit(context.userId, request.nextUrl.pathname);
      } catch (error) {
        logApiAccess(request, context, 429, error);
        throw error;
      }
    }
    
    // 3. Request validation and sanitization
    const { body, query } = await validateRequest(request, options.validationSchema);
    
    // Log successful middleware execution
    logApiAccess(request, context);
    
    return {
      ...context,
      body,
      query,
    };
  }
  
  /**
   * Create middleware for protected routes (requires authentication)
   */
  static protected(validationSchema?: z.ZodSchema) {
    return async (request: NextRequest) => {
      return this.runMiddleware(request, {
        requireAuth: true,
        validationSchema,
        rateLimitEnabled: true,
      });
    };
  }
  
  /**
   * Create middleware for public routes (no authentication required)
   */
  static public(validationSchema?: z.ZodSchema) {
    return async (request: NextRequest) => {
      return this.runMiddleware(request, {
        requireAuth: false,
        validationSchema,
        rateLimitEnabled: false, // Public routes have lighter rate limiting
      });
    };
  }
  
  /**
   * Create middleware for admin routes (requires authentication + admin role)
   */
  static admin(validationSchema?: z.ZodSchema) {
    return async (request: NextRequest) => {
      const context = await this.runMiddleware(request, {
        requireAuth: true,
        validationSchema,
        rateLimitEnabled: true,
      });
      
      // TODO: Add role-based access control
      // if (!context.user?.isAdmin) {
      //   throw new AuthorizationError('Admin access required');
      // }
      
      return context;
    };
  }
  
  /**
   * Create middleware for API endpoints with custom options
   */
  static custom(options: {
    requireAuth?: boolean;
    validationSchema?: z.ZodSchema;
    rateLimitEnabled?: boolean;
    customValidation?: (context: any) => Promise<void>;
  }) {
    return async (request: NextRequest) => {
      const context = await this.runMiddleware(request, options);
      
      // Run custom validation if provided
      if (options.customValidation) {
        await options.customValidation(context);
      }
      
      return context;
    };
  }
}

/**
 * Security middleware wrapper
 * Adds security headers to all responses
 */
export function withSecurityHeaders<T extends Response>(response: T): T {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * CORS middleware for cross-origin requests
 */
export function corsMiddleware(
  request: NextRequest,
  allowedOrigins: string[] = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003']
) {
  const origin = request.headers.get('origin');
  const corsHeaders: Record<string, string> = {};
  
  if (origin && allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
    corsHeaders['Access-Control-Allow-Credentials'] = 'true';
  }
  
  if (request.method === 'OPTIONS') {
    corsHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    corsHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, api-version';
    corsHeaders['Access-Control-Max-Age'] = '86400';
  }
  
  return corsHeaders;
}

/**
 * Utility function to wrap API route handlers with middleware
 */
export function withMiddleware<T>(
  handler: (context: MiddlewareContext & { body?: any; query: Record<string, string> }) => Promise<T>,
  middleware: (request: NextRequest) => Promise<MiddlewareContext & { body?: any; query: Record<string, string> }>
) {
  return async (request: NextRequest) => {
    try {
      const context = await middleware(request);
      const result = await handler(context);
      
      // Add CORS headers if needed
      const corsHeaders = corsMiddleware(request);
      
      if (result instanceof Response) {
        Object.entries(corsHeaders).forEach(([key, value]) => {
          result.headers.set(key, value);
        });
        return withSecurityHeaders(result);
      }
      
      return result;
    } catch (error) {
      // Error is handled by the error handling middleware
      throw error;
    }
  };
}