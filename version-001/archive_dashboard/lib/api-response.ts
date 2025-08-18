import { NextResponse } from 'next/server';
import { ApiVersion, getVersionHeaders } from './api-version';
import { getRateLimitHeaders, RateLimitResult } from './rate-limit';

/**
 * Enhanced API response wrapper for consistent formatting
 * Includes metadata, pagination, version info, and rate limiting
 */

export interface ApiResponseMeta {
  timestamp: string;
  version: ApiVersion;
  requestId?: string;
  processingTime?: number;
  deprecationWarning?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  meta: ApiResponseMeta;
  pagination?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    timestamp: string;
    fields?: Record<string, string>;
    metadata?: Record<string, any>;
  };
  meta: ApiResponseMeta;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Response builder options
 */
export interface ResponseOptions {
  version: ApiVersion;
  rateLimitResult?: RateLimitResult;
  requestId?: string;
  processingTime?: number;
  pagination?: PaginationMeta;
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  options: ResponseOptions,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: options.version,
      requestId: options.requestId,
      processingTime: options.processingTime,
    },
  };

  if (options.pagination) {
    response.pagination = options.pagination;
  }

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getVersionHeaders(options.version),
  };

  if (options.rateLimitResult) {
    Object.assign(headers, getRateLimitHeaders(options.rateLimitResult));
  }

  if (options.requestId) {
    headers['X-Request-ID'] = options.requestId;
  }

  return NextResponse.json(response, {
    status,
    headers,
  });
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  error: {
    message: string;
    code: string;
    statusCode: number;
    fields?: Record<string, string>;
    metadata?: Record<string, any>;
  },
  options: ResponseOptions
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      ...error,
      timestamp: new Date().toISOString(),
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: options.version,
      requestId: options.requestId,
      processingTime: options.processingTime,
    },
  };

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getVersionHeaders(options.version),
  };

  if (options.rateLimitResult) {
    Object.assign(headers, getRateLimitHeaders(options.rateLimitResult));
  }

  if (options.requestId) {
    headers['X-Request-ID'] = options.requestId;
  }

  return NextResponse.json(response, {
    status: error.statusCode,
    headers,
  });
}

/**
 * Create pagination metadata
 */
export function createPagination(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Enhanced API response builder with versioning and rate limiting
 */
export class ApiResponseBuilder {
  static success<T>(
    data: T,
    options: ResponseOptions
  ): NextResponse<ApiSuccessResponse<T>> {
    return createSuccessResponse(data, options);
  }

  static created<T>(
    data: T,
    options: ResponseOptions
  ): NextResponse<ApiSuccessResponse<T>> {
    return createSuccessResponse(data, options, 201);
  }

  static error(
    error: {
      message: string;
      code: string;
      statusCode: number;
      fields?: Record<string, string>;
      metadata?: Record<string, any>;
    },
    options: ResponseOptions
  ): NextResponse<ApiErrorResponse> {
    return createErrorResponse(error, options);
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    options: ResponseOptions
  ): NextResponse<ApiSuccessResponse<T[]>> {
    const pagination = createPagination(page, limit, total);
    return createSuccessResponse(data, {
      ...options,
      pagination,
    });
  }

  static noContent(options: ResponseOptions): NextResponse {
    const headers: Record<string, string> = {
      ...getVersionHeaders(options.version),
    };

    if (options.rateLimitResult) {
      Object.assign(headers, getRateLimitHeaders(options.rateLimitResult));
    }

    if (options.requestId) {
      headers['X-Request-ID'] = options.requestId;
    }

    return new NextResponse(null, { 
      status: 204,
      headers,
    });
  }
}

/**
 * Helper for transforming database results with pagination
 */
export interface PaginatedQuery {
  page?: number;
  limit?: number;
  offset?: number;
}

export function parsePaginationQuery(
  searchParams: URLSearchParams,
  defaultLimit = 20,
  maxLimit = 100
): PaginatedQuery {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(searchParams.get('limit') || defaultLimit.toString())));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Response time tracking middleware helper
 */
export function createResponseTimer(): {
  start: () => void;
  end: () => number;
} {
  let startTime: number;

  return {
    start: () => {
      startTime = Date.now();
    },
    end: () => {
      return Date.now() - startTime;
    },
  };
}

// Legacy compatibility - gradually migrate existing code to use the new builder
export const successResponse = <T>(data: T, version: ApiVersion = 'v1') => 
  createSuccessResponse(data, { 
    version, 
    requestId: generateRequestId(),
    processingTime: 0 
  });

export const errorResponse = (
  message: string,
  statusCode: number = 400,
  code?: string,
  details?: Record<string, any>
) => 
  createErrorResponse({
    message,
    code: code || 'BAD_REQUEST',
    statusCode,
    metadata: details,
  }, {
    version: 'v1',
    requestId: generateRequestId(),
    processingTime: 0,
  });

export const paginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  version: ApiVersion = 'v1'
) => 
  ApiResponseBuilder.paginated(data, page, limit, total, {
    version,
    requestId: generateRequestId(),
    processingTime: 0,
  });

export const createdResponse = <T>(data: T, version: ApiVersion = 'v1') =>
  ApiResponseBuilder.created(data, {
    version,
    requestId: generateRequestId(),
    processingTime: 0,
  });

export const noContentResponse = (version: ApiVersion = 'v1') =>
  ApiResponseBuilder.noContent({
    version,
    requestId: generateRequestId(),
    processingTime: 0,
  });

// Common error responses with versioning
export const unauthorizedResponse = (version: ApiVersion = 'v1') => 
  errorResponse('Authentication required', 401, 'UNAUTHORIZED');

export const forbiddenResponse = (message = 'Access denied', version: ApiVersion = 'v1') => 
  errorResponse(message, 403, 'FORBIDDEN');

export const notFoundResponse = (resource = 'Resource', version: ApiVersion = 'v1') => 
  errorResponse(`${resource} not found`, 404, 'NOT_FOUND');

export const validationErrorResponse = (details: Record<string, any>, version: ApiVersion = 'v1') => 
  errorResponse('Validation failed', 400, 'VALIDATION_ERROR', details);

export const rateLimitResponse = (retryAfter?: number, version: ApiVersion = 'v1') => 
  errorResponse(
    'Rate limit exceeded', 
    429, 
    'RATE_LIMIT_EXCEEDED', 
    { retryAfter }
  );