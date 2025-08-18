import { NextRequest } from 'next/server';

/**
 * API versioning utilities for AgentsAuthority API
 * Implements URI-based versioning strategy with backwards compatibility
 */

export type ApiVersion = 'v1' | 'v2';

export const API_VERSIONS: ApiVersion[] = ['v1', 'v2'];
export const CURRENT_VERSION: ApiVersion = 'v1';
export const DEPRECATED_VERSIONS: ApiVersion[] = [];

/**
 * Version compatibility matrix
 * Defines which versions can handle specific features
 */
export const VERSION_FEATURES = {
  v1: {
    rateLimit: true,
    pagination: true,
    webhooks: false,
    batchOperations: false,
    graphql: false,
  },
  v2: {
    rateLimit: true,
    pagination: true,
    webhooks: true,
    batchOperations: true,
    graphql: true,
  },
} as const;

/**
 * Extract API version from request URL
 * Supports: /api/v1/endpoint, /api/v2/endpoint
 * Falls back to current version if not specified
 */
export function extractVersion(request: NextRequest): ApiVersion {
  const pathname = request.nextUrl.pathname;
  const versionMatch = pathname.match(/\/api\/(v\d+)\//i);
  
  if (versionMatch && versionMatch[1]) {
    const version = versionMatch[1].toLowerCase() as ApiVersion;
    if (API_VERSIONS.includes(version)) {
      return version;
    }
  }
  
  // Check version header as fallback
  const headerVersion = request.headers.get('api-version') as ApiVersion;
  if (headerVersion && API_VERSIONS.includes(headerVersion)) {
    return headerVersion;
  }
  
  return CURRENT_VERSION;
}

/**
 * Check if a version is deprecated
 */
export function isVersionDeprecated(version: ApiVersion): boolean {
  return DEPRECATED_VERSIONS.includes(version);
}

/**
 * Check if a version supports a specific feature
 */
export function supportsFeature(version: ApiVersion, feature: keyof typeof VERSION_FEATURES.v1): boolean {
  return VERSION_FEATURES[version]?.[feature] ?? false;
}

/**
 * Get version-specific configuration
 */
export function getVersionConfig(version: ApiVersion) {
  return {
    version,
    features: VERSION_FEATURES[version],
    isDeprecated: isVersionDeprecated(version),
    isCurrent: version === CURRENT_VERSION,
  };
}

/**
 * Version migration helpers
 */
export const VERSION_MIGRATIONS = {
  v1ToV2: {
    // Add migration logic here when v2 is implemented
    transformResponse: (data: any) => data,
    transformRequest: (data: any) => data,
  },
};

/**
 * Generate version-aware response headers
 */
export function getVersionHeaders(version: ApiVersion): Record<string, string> {
  const headers: Record<string, string> = {
    'api-version': version,
    'api-current-version': CURRENT_VERSION,
    'api-supported-versions': API_VERSIONS.join(','),
  };
  
  if (isVersionDeprecated(version)) {
    headers['api-deprecation-warning'] = `Version ${version} is deprecated. Please migrate to ${CURRENT_VERSION}.`;
    headers['sunset'] = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(); // 90 days from now
  }
  
  return headers;
}