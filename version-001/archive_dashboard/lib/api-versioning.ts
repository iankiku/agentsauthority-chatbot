import { NextRequest, NextResponse } from 'next/server';

// API versioning utilities
export const API_VERSIONS = {
  V1: 'v1',
  V2: 'v2',
} as const;

export type ApiVersion = typeof API_VERSIONS[keyof typeof API_VERSIONS];

// Extract version from URL path
export function extractApiVersion(pathname: string): ApiVersion | null {
  const match = pathname.match(/\/api\/(v\d+)\//)
  if (match) {
    return match[1] as ApiVersion
  }
  // Default to v1 for backward compatibility
  return API_VERSIONS.V1
}

// Version-aware route wrapper
export function withVersioning(handlers: Record<ApiVersion, Function>) {
  return async (request: NextRequest) => {
    const version = extractApiVersion(request.nextUrl.pathname) || API_VERSIONS.V1
    
    if (!handlers[version]) {
      return NextResponse.json(
        { error: `API version ${version} not supported` },
        { status: 400 }
      )
    }
    
    return handlers[version](request)
  }
}

// Response headers for API versioning
export function addVersionHeaders(response: NextResponse, version: ApiVersion) {
  response.headers.set('API-Version', version)
  response.headers.set('Supported-Versions', Object.values(API_VERSIONS).join(', '))
  return response
}