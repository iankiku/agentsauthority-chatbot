import { NextRequest } from 'next/server';

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

// Extract pagination parameters from request
export function extractPaginationParams(
  request: NextRequest,
  defaultLimit: number = 10,
  maxLimit: number = 100
): PaginationParams {
  const { searchParams } = new URL(request.url);
  
  let page = parseInt(searchParams.get('page') || '1', 10);
  let limit = parseInt(searchParams.get('limit') || defaultLimit.toString(), 10);
  
  // Validate and constrain parameters
  page = Math.max(1, page);
  limit = Math.min(Math.max(1, limit), maxLimit);
  
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
}

// Create pagination metadata
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrevious
  };
}

// Helper for database queries with pagination
export function applyPagination<T>(
  query: any, // Drizzle query object
  params: PaginationParams
) {
  return query.limit(params.limit).offset(params.offset);
}

// Cursor-based pagination for large datasets
export interface CursorPaginationParams {
  limit: number;
  cursor?: string;
  direction?: 'forward' | 'backward';
}

export function extractCursorPaginationParams(
  request: NextRequest,
  defaultLimit: number = 10,
  maxLimit: number = 100
): CursorPaginationParams {
  const { searchParams } = new URL(request.url);
  
  let limit = parseInt(searchParams.get('limit') || defaultLimit.toString(), 10);
  const cursor = searchParams.get('cursor') || undefined;
  const direction = (searchParams.get('direction') as 'forward' | 'backward') || 'forward';
  
  // Validate and constrain limit
  limit = Math.min(Math.max(1, limit), maxLimit);
  
  return { limit, cursor, direction };
}

export interface CursorPaginatedResult<T> {
  data: T[];
  meta: {
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextCursor?: string;
    previousCursor?: string;
  };
}

// Sort and filter utilities
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function extractSortParams(
  request: NextRequest,
  allowedFields: string[] = []
): SortParams {
  const { searchParams } = new URL(request.url);
  
  let sortBy = searchParams.get('sortBy') || undefined;
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';
  
  // Validate sortBy field
  if (sortBy && allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
    sortBy = undefined; // Ignore invalid sort field
  }
  
  return { sortBy, sortOrder };
}

export interface FilterParams {
  search?: string;
  filters: Record<string, any>;
}

export function extractFilterParams(
  request: NextRequest,
  allowedFilters: string[] = []
): FilterParams {
  const { searchParams } = new URL(request.url);
  
  const search = searchParams.get('search') || undefined;
  const filters: Record<string, any> = {};
  
  // Extract allowed filter parameters
  for (const filter of allowedFilters) {
    const value = searchParams.get(filter);
    if (value !== null) {
      // Try to parse as JSON for complex filters
      try {
        filters[filter] = JSON.parse(value);
      } catch {
        filters[filter] = value;
      }
    }
  }
  
  return { search, filters };
}

// Complete query parameters extraction
export interface QueryParams {
  pagination: PaginationParams;
  sort: SortParams;
  filter: FilterParams;
}

export function extractQueryParams(
  request: NextRequest,
  options: {
    defaultLimit?: number;
    maxLimit?: number;
    allowedSortFields?: string[];
    allowedFilters?: string[];
  } = {}
): QueryParams {
  const {
    defaultLimit = 10,
    maxLimit = 100,
    allowedSortFields = [],
    allowedFilters = []
  } = options;
  
  return {
    pagination: extractPaginationParams(request, defaultLimit, maxLimit),
    sort: extractSortParams(request, allowedSortFields),
    filter: extractFilterParams(request, allowedFilters)
  };
}