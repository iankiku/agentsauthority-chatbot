import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// Input sanitization utilities to prevent XSS and injection attacks

// HTML sanitization
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
}

// SQL injection prevention for search queries
export function sanitizeSearchQuery(query: string): string {
  // Remove SQL keywords and special characters
  return query
    .replace(/[%;\-\-]/g, '') // Remove common SQL injection patterns
    .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR|AND)\b/gi, '') // Remove SQL keywords
    .trim()
    .substring(0, 100); // Limit length
}

// URL sanitization
export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsedUrl.toString();
  } catch {
    throw new Error('Invalid URL format');
  }
}

// File name sanitization
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, '_') // Replace invalid characters with underscore
    .replace(/\.{2,}/g, '.') // Remove multiple consecutive dots
    .substring(0, 255); // Limit filename length
}

// Email sanitization
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Phone number sanitization
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^+\d\s\-()]/g, '').trim();
}

// Generic text sanitization
export function sanitizeText(text: string, maxLength: number = 1000): string {
  return text
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[\u0000-\u001F\u007F]/g, '') // Remove control characters
    .trim()
    .substring(0, maxLength);
}

// Company name sanitization
export function sanitizeCompanyName(name: string): string {
  return name
    .replace(/[<>"'&]/g, '') // Remove potentially dangerous characters
    .trim()
    .substring(0, 100);
}

// JSON sanitization
export function sanitizeJson(data: any): any {
  if (typeof data === 'string') {
    return sanitizeText(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeJson(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const sanitizedKey = sanitizeText(key, 50);
      sanitized[sanitizedKey] = sanitizeJson(value);
    }
    return sanitized;
  }
  
  return data;
}

// Zod schema for common sanitization
export const sanitizedStringSchema = z.string().transform((val) => sanitizeText(val));
export const sanitizedHtmlSchema = z.string().transform((val) => sanitizeHtml(val));
export const sanitizedUrlSchema = z.string().transform((val) => sanitizeUrl(val));
export const sanitizedEmailSchema = z.string().email().transform((val) => sanitizeEmail(val));

// Validation + sanitization helpers
export function createSanitizedSchema<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape).transform((data) => sanitizeJson(data));
}

// Middleware for automatic input sanitization
export function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }
  
  return sanitizeJson(body);
}

// Content Security Policy helpers
export function generateCSPNonce(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');
}

export function getCSPDirectives(nonce?: string): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'" + (nonce ? ` 'nonce-${nonce}'` : ''),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ];
  
  return directives.join('; ');
}