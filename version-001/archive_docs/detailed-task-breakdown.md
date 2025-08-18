# Detailed Task Breakdown
## GEO Dashboard Transformation - Specific File Modifications & Deliverables

### Overview
This document provides granular task breakdowns for each agent, including specific files to create/modify, exact code changes needed, and detailed acceptance criteria.

---

## Phase 1: Foundation (Days 1-2)

### **frontend-developer Tasks**

#### **Task 1.1: Brand Color Integration** (6 hours)
**Priority**: HIGH | **Dependencies**: None

**Files to Modify**:
```
apps/geo-dashboard/
├── styles/globals.css                   # CREATE - Global styles with AgentsAuthority theme
├── tailwind.config.js                   # CREATE - Tailwind config with brand colors
├── lib/constants/brand.ts               # CREATE - Brand color constants
└── components/ui/theme-provider.tsx     # CREATE - Theme context provider
```

**Specific Changes**:

**`styles/globals.css`**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* AgentsAuthority Brand Colors */
:root {
  /* Primary Colors */
  --aa-primary: #1a73e8;           /* AgentsAuthority Blue */
  --aa-primary-hover: #1557b0;
  --aa-primary-light: #e8f0fe;
  
  /* Secondary Colors */
  --aa-secondary: #34a853;         /* Success Green */
  --aa-warning: #fbbc04;           /* Warning Amber */
  --aa-danger: #ea4335;            /* Error Red */
  
  /* Neutral Colors */
  --aa-gray-50: #f8f9fa;
  --aa-gray-100: #f1f3f4;
  --aa-gray-200: #e8eaed;
  --aa-gray-300: #dadce0;
  --aa-gray-400: #bdc1c6;
  --aa-gray-500: #9aa0a6;
  --aa-gray-600: #80868b;
  --aa-gray-700: #5f6368;
  --aa-gray-800: #3c4043;
  --aa-gray-900: #202124;
  
  /* Semantic Colors */
  --background: #ffffff;
  --foreground: var(--aa-gray-900);
  --card: #ffffff;
  --card-foreground: var(--aa-gray-900);
  --popover: #ffffff;
  --popover-foreground: var(--aa-gray-900);
  --primary: var(--aa-primary);
  --primary-foreground: #ffffff;
  --secondary: var(--aa-gray-100);
  --secondary-foreground: var(--aa-gray-900);
  --muted: var(--aa-gray-100);
  --muted-foreground: var(--aa-gray-600);
  --accent: var(--aa-gray-100);
  --accent-foreground: var(--aa-gray-900);
  --destructive: var(--aa-danger);
  --destructive-foreground: #ffffff;
  --border: var(--aa-gray-200);
  --input: var(--aa-gray-200);
  --ring: var(--aa-primary);
  --radius: 0.5rem;
}

.dark {
  --background: var(--aa-gray-900);
  --foreground: var(--aa-gray-100);
  --card: var(--aa-gray-800);
  --card-foreground: var(--aa-gray-100);
  --popover: var(--aa-gray-800);
  --popover-foreground: var(--aa-gray-100);
  --primary: var(--aa-primary);
  --primary-foreground: #ffffff;
  --secondary: var(--aa-gray-800);
  --secondary-foreground: var(--aa-gray-100);
  --muted: var(--aa-gray-800);
  --muted-foreground: var(--aa-gray-400);
  --accent: var(--aa-gray-800);
  --accent-foreground: var(--aa-gray-100);
  --destructive: var(--aa-danger);
  --destructive-foreground: #ffffff;
  --border: var(--aa-gray-700);
  --input: var(--aa-gray-700);
  --ring: var(--aa-primary);
}

/* GEO Dashboard Specific Styles */
.geo-gradient {
  background: linear-gradient(135deg, var(--aa-primary) 0%, var(--aa-secondary) 100%);
}

.geo-card {
  @apply bg-card border border-border rounded-lg shadow-sm;
}

.geo-button-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium transition-colors;
}

.geo-button-secondary {
  @apply bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-4 py-2 font-medium transition-colors;
}
```

**`tailwind.config.js`**:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // AgentsAuthority Brand Colors
        'aa-primary': {
          DEFAULT: '#1a73e8',
          50: '#e8f0fe',
          100: '#d2e3fc', 
          200: '#aecbfa',
          300: '#8ab4f8',
          400: '#669df6',
          500: '#4285f4',
          600: '#1a73e8',
          700: '#1557b0',
          800: '#103c78',
          900: '#0b2140',
        },
        'aa-secondary': {
          DEFAULT: '#34a853',
          50: '#e6f4ea',
          100: '#ceead6',
          200: '#a8dab5',
          300: '#81c995',
          400: '#5bb974',
          500: '#34a853',
          600: '#2d8e47',
          700: '#26743c',
          800: '#1e5a30',
          900: '#174024',
        },
        'aa-warning': {
          DEFAULT: '#fbbc04',
          50: '#fef7e0',
          100: '#feefc3',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#fbbc04',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'aa-danger': {
          DEFAULT: '#ea4335',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ea4335',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Existing shadcn colors with AA overrides
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**Acceptance Criteria**:
- [ ] All color variables properly defined and accessible
- [ ] Dark mode theme working correctly
- [ ] Tailwind config includes all brand colors
- [ ] CSS classes follow naming conventions
- [ ] No hardcoded colors remain in components

#### **Task 1.2: Logo and Asset Updates** (4 hours)
**Priority**: HIGH | **Dependencies**: Task 1.1

**Files to Create**:
```
apps/geo-dashboard/
├── public/
│   ├── logo-light.svg              # CREATE - Light theme logo
│   ├── logo-dark.svg               # CREATE - Dark theme logo
│   ├── favicon.ico                 # CREATE - Brand favicon
│   ├── apple-touch-icon.png        # CREATE - iOS icon
│   └── manifest.json               # CREATE - PWA manifest
├── components/ui/
│   ├── logo.tsx                    # CREATE - Logo component
│   └── brand-icon.tsx              # CREATE - Brand icon component
└── lib/constants/assets.ts         # CREATE - Asset path constants
```

**Specific Changes**:

**`components/ui/logo.tsx`**:
```typescript
"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-auto",
  md: "h-8 w-auto", 
  lg: "h-10 w-auto",
  xl: "h-12 w-auto",
};

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const { theme } = useTheme();
  
  const logoSrc = theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg";
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src={logoSrc}
        alt="AgentsAuthority"
        width={40}
        height={40}
        className={cn(sizeClasses[size])}
        priority
      />
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-none text-foreground">
            AgentsAuthority
          </span>
          <span className="text-xs text-muted-foreground leading-none">
            GEO Dashboard
          </span>
        </div>
      )}
    </div>
  );
}
```

**`public/manifest.json`**:
```json
{
  "name": "AgentsAuthority GEO Dashboard",
  "short_name": "GEO Dashboard",
  "description": "Generative Engine Optimization Dashboard for Brand Visibility Analysis",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1a73e8",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "32x32",
      "type": "image/x-icon"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ]
}
```

**Acceptance Criteria**:
- [ ] Logo component works in light and dark themes
- [ ] All asset files properly optimized (< 50KB each)
- [ ] Favicon displays correctly in browser tabs
- [ ] PWA manifest configured properly
- [ ] Logo responsive across all breakpoints

#### **Task 1.3: Responsive Design System** (8 hours)
**Priority**: MEDIUM | **Dependencies**: Task 1.1, 1.2

**Files to Create/Modify**:
```
apps/geo-dashboard/
├── components/ui/
│   ├── responsive-container.tsx     # CREATE - Responsive wrapper
│   ├── breakpoint-indicator.tsx    # CREATE - Development helper
│   └── grid-system.tsx             # CREATE - Responsive grid
├── hooks/
│   ├── use-breakpoint.ts           # CREATE - Breakpoint hook
│   └── use-responsive.ts           # CREATE - Responsive utilities
└── lib/utils/responsive.ts         # CREATE - Responsive helper functions
```

**Specific Changes**:

**`hooks/use-breakpoint.ts`**:
```typescript
"use client";

import { useEffect, useState } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("lg");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width >= breakpoints["2xl"]) {
        setBreakpoint("2xl");
      } else if (width >= breakpoints.xl) {
        setBreakpoint("xl");
      } else if (width >= breakpoints.lg) {
        setBreakpoint("lg");
      } else if (width >= breakpoints.md) {
        setBreakpoint("md");
      } else {
        setBreakpoint("sm");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}

export function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === "sm";
}

export function useIsTablet(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === "md";
}

export function useIsDesktop(): boolean {
  const breakpoint = useBreakpoint();
  return ["lg", "xl", "2xl"].includes(breakpoint);
}
```

**`components/ui/responsive-container.tsx`**:
```typescript
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl", 
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

const paddingClasses = {
  none: "px-0",
  sm: "px-4 sm:px-6",
  md: "px-4 sm:px-6 lg:px-8",
  lg: "px-4 sm:px-6 lg:px-8 xl:px-12",
};

export function ResponsiveContainer({
  children,
  className,
  size = "xl",
  padding = "md",
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
```

**Acceptance Criteria**:
- [ ] Responsive design works 320px-2560px
- [ ] Breakpoint hooks function correctly
- [ ] Grid system adapts to all screen sizes
- [ ] Touch targets meet accessibility guidelines (44px minimum)
- [ ] No horizontal scrolling on any device

---

### **backend-developer Tasks**

#### **Task 2.1: Better Auth Integration** (8 hours)
**Priority**: CRITICAL | **Dependencies**: None

**Files to Create**:
```
apps/geo-dashboard/
├── lib/
│   ├── auth.ts                     # CREATE - Better Auth client
│   ├── auth-config.ts              # CREATE - Auth configuration
│   └── session-utils.ts            # CREATE - Session utilities
├── app/api/auth/
│   ├── [...auth]/route.ts          # CREATE - Auth endpoints
│   └── session/route.ts            # CREATE - Session endpoint
└── middleware.ts                   # CREATE - Auth middleware
```

**Specific Changes**:

**`lib/auth.ts`**:
```typescript
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3003",
  trustedOrigins: [
    "http://localhost:3001",
    "http://localhost:3003", 
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
    process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003",
  ],
  database: {
    provider: "postgres",
    url: process.env.DATABASE_URL!,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // For development
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
      organizationId: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;
```

**`lib/session-utils.ts`**:
```typescript
import { auth } from "./auth";
import { cache } from "react";
import { headers } from "next/headers";

export const getSession = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    });
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
});

export const requireAuth = async () => {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  return session;
};

export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user || null;
};

export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();
  return !!session?.user;
};

export const hasRole = async (role: string): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === role;
};

export const isAdmin = async (): Promise<boolean> => {
  return await hasRole("admin");
};
```

**`middleware.ts`**:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/geo",
  "/analysis",
  "/settings",
  "/api/geo",
  "/api/chat",
];

// Define public routes that should redirect if authenticated
const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  const isPublicRoute = publicRoutes.includes(pathname);

  try {
    // Get session using Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const isAuthenticated = !!session?.user;

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from public routes to dashboard
    if (isPublicRoute && isAuthenticated && pathname !== "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Add user info to headers for downstream use
    if (isAuthenticated && session?.user) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", session.user.id);
      requestHeaders.set("x-user-email", session.user.email);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    
    // On auth error, redirect to login for protected routes
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
```

**Acceptance Criteria**:
- [ ] Better Auth client properly configured
- [ ] Session persistence works across browser restarts
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Cross-domain sessions work with auth service
- [ ] Session utilities provide correct user information

#### **Task 2.2: API Infrastructure** (6 hours)
**Priority**: HIGH | **Dependencies**: Task 2.1

**Files to Create**:
```
apps/geo-dashboard/
├── lib/
│   ├── api-errors.ts               # CREATE - Error handling
│   ├── api-response.ts             # CREATE - Response utilities
│   ├── rate-limit.ts               # CREATE - Rate limiting
│   └── validation.ts               # CREATE - Input validation
├── app/api/
│   ├── middleware.ts               # CREATE - API middleware
│   └── utils/
│       ├── auth.ts                 # CREATE - API auth helpers
│       └── response.ts             # CREATE - Response helpers
```

**Specific Changes**:

**`lib/api-errors.ts`**:
```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class ValidationError extends APIError {
  constructor(message: string, public errors?: Record<string, string[]>) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
  }
}

export class ExternalServiceError extends APIError {
  constructor(message: string, public service: string) {
    super(message, 502, "EXTERNAL_SERVICE_ERROR");
    this.name = "ExternalServiceError";
  }
}

export function handleAPIError(error: unknown): Response {
  console.error("API Error:", error);

  if (error instanceof APIError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code,
        statusCode: error.statusCode,
        ...(error instanceof ValidationError && { errors: error.errors }),
      }),
      {
        status: error.statusCode,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Unknown error
  return new Response(
    JSON.stringify({
      error: "Internal server error",
      code: "INTERNAL_ERROR",
      statusCode: 500,
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}
```

**`lib/rate-limit.ts`**:
```typescript
import { NextRequest } from "next/server";

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (request: NextRequest) => string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (consider Redis for production)
const store: RateLimitStore = {};

export function createRateLimit(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyGenerator = getDefaultKey } = config;

  return async (request: NextRequest) => {
    const key = keyGenerator(request);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up expired entries
    for (const storeKey in store) {
      if (store[storeKey].resetTime < now) {
        delete store[storeKey];
      }
    }

    // Get current count for this key
    const current = store[key];
    
    if (!current || current.resetTime < now) {
      // First request in window or window expired
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return true;
    }

    if (current.count >= maxRequests) {
      return false; // Rate limit exceeded
    }

    current.count++;
    return true;
  };
}

function getDefaultKey(request: NextRequest): string {
  // Use IP address as default key
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";
  return `rate_limit:${ip}`;
}

// Pre-configured rate limiters
export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
});

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 auth attempts per 15 minutes
});

export const chatRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 messages per minute
});
```

**Acceptance Criteria**:
- [ ] Error handling covers all common scenarios
- [ ] Rate limiting prevents abuse
- [ ] API responses follow consistent format
- [ ] Input validation catches malformed requests
- [ ] Middleware properly chains with auth

---

### **database-administrator Tasks**

#### **Task 3.1: GEO Schema Design** (8 hours)
**Priority**: CRITICAL | **Dependencies**: None

**Files to Modify/Create**:
```
packages/database/
├── src/
│   ├── schema.ts                   # MODIFY - Add GEO tables
│   ├── services/geo.ts             # CREATE - GEO data services
│   └── queries/geo.ts              # CREATE - GEO queries
├── migrations/
│   └── add-geo-tables.sql          # CREATE - Migration script
└── scripts/
    └── seed-geo-data.ts            # CREATE - Seed script
```

**Specific Changes**:

**`packages/database/src/schema.ts`** (additions):
```typescript
// Add to existing schema.ts file

// Brand Analysis Tables
export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  name: text("name").notNull(),
  domain: text("domain"),
  industry: text("industry"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const brandAnalyses = pgTable("brand_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  brandId: uuid("brand_id").notNull(),
  analysisType: text("analysis_type").notNull(), // 'visibility', 'sentiment', 'ranking'
  platform: text("platform").notNull(), // 'chatgpt', 'claude', 'gemini', 'perplexity'
  query: text("query").notNull(),
  response: jsonb("response"),
  analysisData: jsonb("analysis_data"),
  visibilityScore: integer("visibility_score"),
  sentimentScore: integer("sentiment_score"),
  rankingPosition: integer("ranking_position"),
  creditsUsed: integer("credits_used").default(1),
  status: text("status").notNull().default("pending"), // 'pending', 'running', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const competitors = pgTable("competitors", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  brandId: uuid("brand_id").notNull(),
  name: text("name").notNull(),
  domain: text("domain"),
  industry: text("industry"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const competitorAnalyses = pgTable("competitor_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  brandId: uuid("brand_id").notNull(),
  competitorId: uuid("competitor_id").notNull(),
  platform: text("platform").notNull(),
  query: text("query").notNull(),
  response: jsonb("response"),
  comparisonData: jsonb("comparison_data"),
  relativeScore: integer("relative_score"), // How brand compares to competitor
  creditsUsed: integer("credits_used").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const geoScores = pgTable("geo_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  brandId: uuid("brand_id").notNull(),
  platform: text("platform").notNull(),
  overallScore: integer("overall_score").notNull(),
  visibilityScore: integer("visibility_score").notNull(),
  sentimentScore: integer("sentiment_score").notNull(),
  rankingScore: integer("ranking_score").notNull(),
  trendDirection: text("trend_direction"), // 'up', 'down', 'stable'
  scoreDetails: jsonb("score_details"),
  calculatedAt: timestamp("calculated_at").defaultNow(),
  validUntil: timestamp("valid_until"), // Score expiration
});

export const optimizationSuggestions = pgTable("optimization_suggestions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  brandId: uuid("brand_id").notNull(),
  type: text("type").notNull(), // 'content', 'seo', 'social', 'pr'
  priority: text("priority").notNull(), // 'low', 'medium', 'high', 'critical'
  title: text("title").notNull(),
  description: text("description").notNull(),
  actionItems: jsonb("action_items"),
  expectedImpact: text("expected_impact"),
  effort: text("effort"), // 'low', 'medium', 'high'
  timeframe: text("timeframe"), // 'immediate', 'short', 'medium', 'long'
  status: text("status").default("open"), // 'open', 'in_progress', 'completed', 'dismissed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const geoReports = pgTable("geo_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  brandId: uuid("brand_id").notNull(),
  title: text("title").notNull(),
  reportType: text("report_type").notNull(), // 'weekly', 'monthly', 'custom'
  reportData: jsonb("report_data"),
  dateRange: jsonb("date_range"), // { start: Date, end: Date }
  isScheduled: boolean("is_scheduled").default(false),
  status: text("status").default("draft"), // 'draft', 'generated', 'sent'
  createdAt: timestamp("created_at").defaultNow(),
  generatedAt: timestamp("generated_at"),
});

// Add to existing schema export
export const db = drizzle(pool, {
  schema: {
    // ... existing tables
    brands,
    brandAnalyses,
    competitors,
    competitorAnalyses,
    geoScores,
    optimizationSuggestions,
    geoReports,
  },
});

// Export types
export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;

export type BrandAnalysis = typeof brandAnalyses.$inferSelect;
export type NewBrandAnalysis = typeof brandAnalyses.$inferInsert;

export type Competitor = typeof competitors.$inferSelect;
export type NewCompetitor = typeof competitors.$inferInsert;

export type GEOScore = typeof geoScores.$inferSelect;
export type NewGEOScore = typeof geoScores.$inferInsert;

export type OptimizationSuggestion = typeof optimizationSuggestions.$inferSelect;
export type NewOptimizationSuggestion = typeof optimizationSuggestions.$inferInsert;
```

**`packages/database/src/services/geo.ts`**:
```typescript
import { db } from "../schema";
import { 
  brands, 
  brandAnalyses, 
  competitors, 
  competitorAnalyses,
  geoScores,
  optimizationSuggestions,
  type Brand,
  type NewBrand,
  type BrandAnalysis,
  type NewBrandAnalysis,
  type GEOScore,
  type NewGEOScore,
} from "../schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

// Brand Services
export class BrandService {
  async create(data: NewBrand): Promise<Brand> {
    const [brand] = await db.insert(brands).values(data).returning();
    return brand;
  }

  async findById(id: string): Promise<Brand | null> {
    const [brand] = await db
      .select()
      .from(brands)
      .where(eq(brands.id, id))
      .limit(1);
    return brand || null;
  }

  async findByOrganization(organizationId: string): Promise<Brand[]> {
    return await db
      .select()
      .from(brands)
      .where(
        and(
          eq(brands.organizationId, organizationId),
          eq(brands.isActive, true)
        )
      )
      .orderBy(desc(brands.createdAt));
  }

  async update(id: string, data: Partial<NewBrand>): Promise<Brand | null> {
    const [brand] = await db
      .update(brands)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(brands.id, id))
      .returning();
    return brand || null;
  }

  async delete(id: string): Promise<boolean> {
    const [brand] = await db
      .update(brands)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(brands.id, id))
      .returning();
    return !!brand;
  }
}

// Brand Analysis Services
export class BrandAnalysisService {
  async create(data: NewBrandAnalysis): Promise<BrandAnalysis> {
    const [analysis] = await db.insert(brandAnalyses).values(data).returning();
    return analysis;
  }

  async findById(id: string): Promise<BrandAnalysis | null> {
    const [analysis] = await db
      .select()
      .from(brandAnalyses)
      .where(eq(brandAnalyses.id, id))
      .limit(1);
    return analysis || null;
  }

  async findByBrand(
    brandId: string,
    limit: number = 50
  ): Promise<BrandAnalysis[]> {
    return await db
      .select()
      .from(brandAnalyses)
      .where(eq(brandAnalyses.brandId, brandId))
      .orderBy(desc(brandAnalyses.createdAt))
      .limit(limit);
  }

  async findRecentByPlatform(
    brandId: string,
    platform: string,
    days: number = 30
  ): Promise<BrandAnalysis[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return await db
      .select()
      .from(brandAnalyses)
      .where(
        and(
          eq(brandAnalyses.brandId, brandId),
          eq(brandAnalyses.platform, platform),
          gte(brandAnalyses.createdAt, since),
          eq(brandAnalyses.status, "completed")
        )
      )
      .orderBy(desc(brandAnalyses.createdAt));
  }

  async updateStatus(
    id: string,
    status: string,
    completedAt?: Date
  ): Promise<BrandAnalysis | null> {
    const updateData: any = { status };
    if (completedAt) {
      updateData.completedAt = completedAt;
    }

    const [analysis] = await db
      .update(brandAnalyses)
      .set(updateData)
      .where(eq(brandAnalyses.id, id))
      .returning();
    return analysis || null;
  }
}

// GEO Score Services
export class GEOScoreService {
  async create(data: NewGEOScore): Promise<GEOScore> {
    const [score] = await db.insert(geoScores).values(data).returning();
    return score;
  }

  async getLatestScore(
    brandId: string,
    platform: string
  ): Promise<GEOScore | null> {
    const [score] = await db
      .select()
      .from(geoScores)
      .where(
        and(
          eq(geoScores.brandId, brandId),
          eq(geoScores.platform, platform)
        )
      )
      .orderBy(desc(geoScores.calculatedAt))
      .limit(1);
    return score || null;
  }

  async getScoreHistory(
    brandId: string,
    platform?: string,
    days: number = 30
  ): Promise<GEOScore[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const whereConditions = [
      eq(geoScores.brandId, brandId),
      gte(geoScores.calculatedAt, since),
    ];

    if (platform) {
      whereConditions.push(eq(geoScores.platform, platform));
    }

    return await db
      .select()
      .from(geoScores)
      .where(and(...whereConditions))
      .orderBy(desc(geoScores.calculatedAt));
  }

  async calculateAverageScore(
    brandId: string,
    days: number = 7
  ): Promise<{ platform: string; avgScore: number }[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const result = await db
      .select({
        platform: geoScores.platform,
        avgScore: sql<number>`AVG(${geoScores.overallScore})`,
      })
      .from(geoScores)
      .where(
        and(
          eq(geoScores.brandId, brandId),
          gte(geoScores.calculatedAt, since)
        )
      )
      .groupBy(geoScores.platform);

    return result.map(r => ({
      platform: r.platform,
      avgScore: Math.round(r.avgScore),
    }));
  }
}

// Export service instances
export const brandService = new BrandService();
export const brandAnalysisService = new BrandAnalysisService();
export const geoScoreService = new GEOScoreService();
```

**Acceptance Criteria**:
- [ ] All GEO tables created with proper relationships
- [ ] Indexes created for optimal query performance
- [ ] Data services provide type-safe operations
- [ ] Migration scripts handle schema changes safely
- [ ] Seed data available for testing

---

## Phase 2: Core Features (Days 3-5)

### **api-designer Tasks**

#### **Task 4.1: GEO Analysis Endpoints** (10 hours)
**Priority**: CRITICAL | **Dependencies**: database-administrator.schema, backend-developer.auth

**Files to Create**:
```
apps/geo-dashboard/
├── app/api/geo/
│   ├── analyze/route.ts            # CREATE - Brand analysis endpoint
│   ├── competitors/route.ts        # CREATE - Competitor research
│   ├── visibility/route.ts         # CREATE - Visibility scoring
│   ├── suggestions/route.ts        # CREATE - Optimization suggestions
│   └── reports/route.ts            # CREATE - Report generation
├── lib/types/
│   ├── geo.ts                      # CREATE - GEO type definitions
│   └── api.ts                      # CREATE - API type definitions
└── lib/validation/
    ├── geo-schemas.ts              # CREATE - Zod validation schemas
    └── api-schemas.ts              # CREATE - API validation schemas
```

**Specific Changes**:

**`lib/types/geo.ts`**:
```typescript
// Platform Types
export type Platform = "chatgpt" | "claude" | "gemini" | "perplexity";

export interface PlatformConfig {
  name: string;
  displayName: string;
  apiEndpoint: string;
  enabled: boolean;
  maxConcurrency: number;
}

// Analysis Types
export type AnalysisType = "visibility" | "sentiment" | "ranking" | "competitive";

export interface AnalysisRequest {
  brandId: string;
  type: AnalysisType;
  platforms: Platform[];
  queries: string[];
  competitors?: string[];
  options?: AnalysisOptions;
}

export interface AnalysisOptions {
  includeCompetitors?: boolean;
  includeHistorical?: boolean;
  generateSuggestions?: boolean;
  customPrompts?: Record<string, string>;
}

// Brand Analysis
export interface BrandAnalysisRequest {
  brand: string;
  industry?: string;
  competitors?: string[];
  platforms: Platform[];
  analysisType?: AnalysisType[];
  queries?: string[];
}

export interface BrandAnalysisResponse {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  brand: string;
  platforms: Platform[];
  results: PlatformAnalysisResult[];
  overallScore: number;
  suggestions: OptimizationSuggestion[];
  estimatedCredits: number;
  createdAt: string;
  completedAt?: string;
}

export interface PlatformAnalysisResult {
  platform: Platform;
  queries: QueryResult[];
  overallScore: number;
  visibilityScore: number;
  sentimentScore: number;
  rankingScore: number;
  details: AnalysisDetails;
}

export interface QueryResult {
  query: string;
  response: string;
  analysis: {
    mentions: BrandMention[];
    sentiment: SentimentAnalysis;
    ranking: RankingAnalysis;
    entities: ExtractedEntity[];
  };
  score: number;
  processingTime: number;
}

export interface BrandMention {
  text: string;
  context: string;
  sentiment: "positive" | "neutral" | "negative";
  confidence: number;
  position: number;
}

export interface SentimentAnalysis {
  overall: "positive" | "neutral" | "negative";
  score: number; // -100 to 100
  confidence: number;
  aspects: {
    quality: number;
    service: number;
    value: number;
    innovation: number;
  };
}

export interface RankingAnalysis {
  position: number;
  totalResults: number;
  featured: boolean;
  context: string;
}

export interface ExtractedEntity {
  text: string;
  type: "brand" | "product" | "service" | "competitor";
  confidence: number;
}

// Competitor Analysis
export interface CompetitorAnalysisRequest {
  brandId: string;
  competitors?: string[];
  platforms: Platform[];
  includeMarketShare?: boolean;
}

export interface CompetitorAnalysisResponse {
  brand: string;
  competitors: CompetitorProfile[];
  comparison: CompetitorComparison;
  marketInsights: MarketInsights;
}

export interface CompetitorProfile {
  name: string;
  domain?: string;
  industry: string;
  scores: Record<Platform, number>;
  strengths: string[];
  weaknesses: string[];
  marketPosition: "leader" | "challenger" | "follower" | "niche";
}

export interface CompetitorComparison {
  brandRanking: number;
  totalCompetitors: number;
  platformLeadership: Record<Platform, string>;
  gapAnalysis: {
    platform: Platform;
    gap: number;
    recommendation: string;
  }[];
}

export interface MarketInsights {
  industryTrends: string[];
  opportunityAreas: string[];
  threatAssessment: string[];
  recommendedActions: string[];
}

// Visibility Analysis
export interface VisibilityAnalysisRequest {
  brandId: string;
  platforms: Platform[];
  timeframe?: "1d" | "7d" | "30d" | "90d";
  includeCompetitors?: boolean;
}

export interface VisibilityAnalysisResponse {
  brand: string;
  platforms: PlatformVisibility[];
  trends: VisibilityTrend[];
  benchmarks: VisibilityBenchmark[];
  insights: VisibilityInsight[];
}

export interface PlatformVisibility {
  platform: Platform;
  currentScore: number;
  change: number;
  trend: "increasing" | "decreasing" | "stable";
  lastUpdated: string;
}

export interface VisibilityTrend {
  date: string;
  platform: Platform;
  score: number;
  events?: VisibilityEvent[];
}

export interface VisibilityEvent {
  type: "mention" | "ranking_change" | "sentiment_shift";
  description: string;
  impact: "positive" | "negative" | "neutral";
}

export interface VisibilityBenchmark {
  platform: Platform;
  brandScore: number;
  industryAverage: number;
  topCompetitor: {
    name: string;
    score: number;
  };
  percentile: number;
}

export interface VisibilityInsight {
  type: "opportunity" | "threat" | "trend";
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  actionable: boolean;
  estimatedImpact: number;
}

// Optimization Suggestions
export interface OptimizationSuggestion {
  id: string;
  type: "content" | "seo" | "social" | "pr" | "technical";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  actionItems: ActionItem[];
  expectedImpact: {
    score: number;
    timeframe: string;
    confidence: number;
  };
  effort: "low" | "medium" | "high";
  platforms: Platform[];
}

export interface ActionItem {
  task: string;
  description: string;
  effort: "low" | "medium" | "high";
  timeframe: "immediate" | "short" | "medium" | "long";
  resources: string[];
}

// Analysis Status
export interface AnalysisStatus {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  currentStep: string;
  estimatedCompletion?: string;
  error?: string;
}

// Historical Data
export interface HistoricalData {
  brandId: string;
  platform: Platform;
  scores: {
    date: string;
    overall: number;
    visibility: number;
    sentiment: number;
    ranking: number;
  }[];
  events: HistoricalEvent[];
}

export interface HistoricalEvent {
  date: string;
  type: "campaign" | "news" | "product_launch" | "crisis";
  description: string;
  impact: number;
}
```

**`app/api/geo/analyze/route.ts`**:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session-utils";
import { handleAPIError, ValidationError } from "@/lib/api-errors";
import { chatRateLimit } from "@/lib/rate-limit";
import { brandAnalysisRequestSchema } from "@/lib/validation/geo-schemas";
import { brandService, brandAnalysisService } from "@workspace/database";
import type { BrandAnalysisRequest, BrandAnalysisResponse } from "@/lib/types/geo";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitPassed = await chatRateLimit(request);
    if (!rateLimitPassed) {
      return new Response("Rate limit exceeded", { status: 429 });
    }

    // Authentication
    const session = await requireAuth();
    const userId = session.user.id;

    // Parse and validate request
    const body = await request.json();
    const validatedData = brandAnalysisRequestSchema.parse(body);

    // Start analysis process
    const analysisId = await startBrandAnalysis({
      ...validatedData,
      userId,
      organizationId: session.user.organizationId,
    });

    // Return analysis ID and initial status
    const response: BrandAnalysisResponse = {
      id: analysisId,
      status: "pending",
      brand: validatedData.brand,
      platforms: validatedData.platforms,
      results: [],
      overallScore: 0,
      suggestions: [],
      estimatedCredits: calculateEstimatedCredits(validatedData),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Brand analysis error:", error);
    return handleAPIError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get("id");

    if (!analysisId) {
      throw new ValidationError("Analysis ID required");
    }

    // Get analysis status and results
    const analysis = await brandAnalysisService.findById(analysisId);
    if (!analysis) {
      return new Response("Analysis not found", { status: 404 });
    }

    // Check ownership
    if (analysis.organizationId !== session.user.organizationId) {
      return new Response("Unauthorized", { status: 403 });
    }

    // Format response
    const response: BrandAnalysisResponse = {
      id: analysis.id,
      status: analysis.status as any,
      brand: analysis.brandId,
      platforms: extractPlatformsFromAnalysis(analysis),
      results: formatAnalysisResults(analysis),
      overallScore: analysis.visibilityScore || 0,
      suggestions: await getOptimizationSuggestions(analysis.id),
      estimatedCredits: analysis.creditsUsed || 0,
      createdAt: analysis.createdAt.toISOString(),
      completedAt: analysis.completedAt?.toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get analysis error:", error);
    return handleAPIError(error);
  }
}

async function startBrandAnalysis(data: BrandAnalysisRequest & { 
  userId: string; 
  organizationId: string; 
}): Promise<string> {
  // Implementation for starting background analysis
  // This would typically queue a job for processing
  
  // For now, create a pending analysis record
  const analysis = await brandAnalysisService.create({
    organizationId: data.organizationId,
    brandId: data.brand, // This should be a brand ID, not name
    analysisType: "visibility",
    platform: data.platforms[0], // Store first platform, full data in JSON
    query: data.queries?.[0] || `Tell me about ${data.brand}`,
    status: "pending",
    analysisData: {
      request: data,
      platforms: data.platforms,
      queries: data.queries || [],
      competitors: data.competitors || [],
    },
  });

  // TODO: Queue background job for actual analysis
  // await queueAnalysisJob(analysis.id, data);

  return analysis.id;
}

function calculateEstimatedCredits(data: BrandAnalysisRequest): number {
  const baseCost = 1;
  const platformMultiplier = data.platforms.length;
  const queryMultiplier = (data.queries?.length || 1);
  const competitorMultiplier = data.competitors ? data.competitors.length * 0.5 : 0;
  
  return Math.ceil(baseCost * platformMultiplier * queryMultiplier + competitorMultiplier);
}

function extractPlatformsFromAnalysis(analysis: any): Platform[] {
  return analysis.analysisData?.platforms || [analysis.platform];
}

function formatAnalysisResults(analysis: any): any[] {
  // Format the analysis results for response
  if (analysis.status !== "completed") {
    return [];
  }
  
  // Transform database results to API format
  return analysis.analysisData?.results || [];
}

async function getOptimizationSuggestions(analysisId: string): Promise<any[]> {
  // Fetch related optimization suggestions
  // This would be implemented based on the suggestions table
  return [];
}
```

**`lib/validation/geo-schemas.ts`**:
```typescript
import { z } from "zod";

// Platform validation
export const platformSchema = z.enum(["chatgpt", "claude", "gemini", "perplexity"]);

// Brand Analysis Request Schema
export const brandAnalysisRequestSchema = z.object({
  brand: z.string().min(1, "Brand name is required").max(100),
  industry: z.string().optional(),
  competitors: z.array(z.string()).max(5, "Maximum 5 competitors allowed").optional(),
  platforms: z.array(platformSchema).min(1, "At least one platform required").max(4),
  analysisType: z.array(z.enum(["visibility", "sentiment", "ranking", "competitive"])).optional(),
  queries: z.array(z.string()).max(10, "Maximum 10 queries allowed").optional(),
  options: z.object({
    includeCompetitors: z.boolean().optional(),
    includeHistorical: z.boolean().optional(),
    generateSuggestions: z.boolean().optional(),
    customPrompts: z.record(z.string()).optional(),
  }).optional(),
});

// Competitor Analysis Request Schema
export const competitorAnalysisRequestSchema = z.object({
  brandId: z.string().uuid("Invalid brand ID"),
  competitors: z.array(z.string()).max(10, "Maximum 10 competitors allowed").optional(),
  platforms: z.array(platformSchema).min(1, "At least one platform required"),
  includeMarketShare: z.boolean().optional().default(false),
});

// Visibility Analysis Request Schema
export const visibilityAnalysisRequestSchema = z.object({
  brandId: z.string().uuid("Invalid brand ID"),
  platforms: z.array(platformSchema).min(1, "At least one platform required"),
  timeframe: z.enum(["1d", "7d", "30d", "90d"]).optional().default("30d"),
  includeCompetitors: z.boolean().optional().default(false),
});

// Optimization Request Schema
export const optimizationRequestSchema = z.object({
  analysisId: z.string().uuid("Invalid analysis ID"),
  focusAreas: z.array(z.enum(["visibility", "sentiment", "ranking", "competitive"])).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  timeframe: z.enum(["immediate", "short", "medium", "long"]).optional(),
});

// Generic Query Schema
export const geoQuerySchema = z.object({
  query: z.string().min(1, "Query cannot be empty").max(500),
  platform: platformSchema,
  options: z.object({
    includeAnalysis: z.boolean().optional().default(true),
    maxResults: z.number().min(1).max(20).optional().default(10),
  }).optional(),
});

// Batch Analysis Schema
export const batchAnalysisRequestSchema = z.object({
  brands: z.array(z.string()).min(1, "At least one brand required").max(5),
  platforms: z.array(platformSchema).min(1, "At least one platform required"),
  analysisType: z.enum(["visibility", "sentiment", "ranking", "competitive"]),
  queries: z.array(z.string()).max(5, "Maximum 5 queries per brand").optional(),
});

// Report Generation Schema
export const reportRequestSchema = z.object({
  brandId: z.string().uuid("Invalid brand ID"),
  reportType: z.enum(["summary", "detailed", "competitive", "trends"]),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  includeCharts: z.boolean().optional().default(true),
  format: z.enum(["json", "pdf", "excel"]).optional().default("json"),
});

// Analysis Status Schema
export const analysisStatusSchema = z.object({
  id: z.string().uuid("Invalid analysis ID"),
  status: z.enum(["pending", "running", "completed", "failed"]),
  progress: z.number().min(0).max(100),
  currentStep: z.string(),
  estimatedCompletion: z.string().datetime().optional(),
  error: z.string().optional(),
});

// Export all schemas
export const geoSchemas = {
  brandAnalysisRequest: brandAnalysisRequestSchema,
  competitorAnalysisRequest: competitorAnalysisRequestSchema,
  visibilityAnalysisRequest: visibilityAnalysisRequestSchema,
  optimizationRequest: optimizationRequestSchema,
  geoQuery: geoQuerySchema,
  batchAnalysisRequest: batchAnalysisRequestSchema,
  reportRequest: reportRequestSchema,
  analysisStatus: analysisStatusSchema,
};

// Type exports
export type BrandAnalysisRequestInput = z.infer<typeof brandAnalysisRequestSchema>;
export type CompetitorAnalysisRequestInput = z.infer<typeof competitorAnalysisRequestSchema>;
export type VisibilityAnalysisRequestInput = z.infer<typeof visibilityAnalysisRequestSchema>;
export type OptimizationRequestInput = z.infer<typeof optimizationRequestSchema>;
export type GeoQueryInput = z.infer<typeof geoQuerySchema>;
export type BatchAnalysisRequestInput = z.infer<typeof batchAnalysisRequestSchema>;
export type ReportRequestInput = z.infer<typeof reportRequestSchema>;
export type AnalysisStatusInput = z.infer<typeof analysisStatusSchema>;
```

**Acceptance Criteria**:
- [ ] All GEO endpoints properly implemented and tested
- [ ] Request/response validation with Zod schemas working
- [ ] Type safety maintained throughout API layer
- [ ] Authentication and authorization properly enforced
- [ ] Rate limiting prevents API abuse
- [ ] Error handling provides meaningful feedback
- [ ] API documentation complete and accurate

This detailed breakdown provides specific file modifications, code implementations, and acceptance criteria for each agent. The documentation shows exact changes needed, dependencies between tasks, and measurable success criteria. Each agent has clear ownership of specific files and deliverables, enabling true parallel execution while maintaining system integration.

The plan ensures that all agents understand their specific responsibilities, file ownership, and coordination requirements for successful completion of the GEO dashboard transformation within the 8-day timeline.