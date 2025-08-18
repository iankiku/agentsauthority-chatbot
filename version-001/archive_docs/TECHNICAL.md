# Technical Documentation

This document consolidates all technical documentation for Agents Authority.

## Table of Contents

- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Authentication Architecture](#authentication-architecture)
- [Supabase Decision](#supabase-decision)

---

# System Architecture

## 🏗️ Overview

Agents Authority is built as a modern, scalable platform using a microservices architecture with three core applications and shared packages. The system is designed for high availability, scalability, and maintainability.

## 🎯 Architecture Principles

### 1. **Separation of Concerns**
- Each application has a specific responsibility
- Clear boundaries between marketing, application, and authentication
- Shared packages for common functionality

### 2. **Scalability**
- Microservices can scale independently
- Database designed for high-volume operations
- Stateless services for horizontal scaling

### 3. **Security**
- Centralized authentication service
- Cross-domain session management
- Secure API communication

### 4. **Developer Experience**
- Consistent development patterns
- Shared tooling and components
- Clear documentation and standards

## 🏢 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Load Balancer                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
┌───────────────▼───┐  ┌────────▼────────┐  ┌──▼──────────────┐
│   Marketing       │  │   Dashboard     │  │ Authentication  │
│   Website         │  │   Application   │  │   Service       │
│   (apps/web)      │  │ (apps/dashboard)│  │   (apps/auth)   │
│   Port 3000       │  │   Port 3001     │  │   Port 3003     │
└───────────────────┘  └─────────────────┘  └─────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Centralized        │
                    │   Database           │
                    │ (packages/database)  │
                    │   PostgreSQL         │
                    └─────────────────────┘
```

## 🔧 Application Architecture

### Marketing Website (`apps/web`)

**Purpose**: Public-facing marketing site with early access functionality

**Technology Stack**:
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase (for early access signups)
- **Authentication**: Better Auth integration
- **Deployment**: Vercel (recommended)

**Key Features**:
- Landing page and marketing content
- Early access signup with email validation
- Pricing and feature information
- Blog and documentation
- SEO optimization

**Architecture Patterns**:
- Server-side rendering (SSR) for SEO
- Static generation for performance
- Edge functions for email validation
- Progressive enhancement

### Dashboard Application (`apps/dashboard`)

**Purpose**: Main SaaS application for AI visibility analysis

**Technology Stack**:
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Centralized PostgreSQL via packages/database
- **Authentication**: Better Auth with cross-domain sessions
- **AI Integration**: Multiple LLM providers (OpenAI, Anthropic, etc.)
- **Real-time**: Server-Sent Events (SSE) for live updates

**Key Features**:
- Brand visibility analysis
- Competitor tracking and comparison
- AI platform monitoring
- Real-time analysis with streaming updates
- Interactive dashboards and reports
- Company and competitor management

**Architecture Patterns**:
- API routes for backend functionality
- React Server Components for performance
- Streaming responses for real-time updates
- Optimistic updates for better UX

### Authentication Service (`apps/auth`)

**Purpose**: Centralized authentication for cross-domain sessions

**Technology Stack**:
- **Framework**: Next.js 15 (minimal setup)
- **Authentication**: Better Auth
- **Database**: Shared PostgreSQL connection
- **Session Management**: Cross-domain cookies

**Key Features**:
- User registration and login
- Magic link authentication
- Cross-domain session management
- Password reset functionality
- User profile management

**Architecture Patterns**:
- Stateless authentication
- JWT tokens for session management
- Secure cookie handling
- CORS configuration for cross-domain

## 📦 Shared Packages

### Database Package (`packages/database`)

**Purpose**: Centralized database schema and operations

**Technology Stack**:
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Migrations**: Drizzle Kit
- **Connection**: Node.js pg pool

**Key Components**:
- **Schema**: Complete database schema definition
- **Services**: Business logic and data operations
- **Migrations**: Database version control
- **Seed Data**: Demo data and testing fixtures

**Architecture Patterns**:
- Single source of truth for schema
- Service layer for business logic
- Connection pooling for performance
- Type-safe database operations

### UI Package (`packages/ui`)

**Purpose**: Shared component library and design system

**Technology Stack**:
- **Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Theming**: CSS variables

**Key Components**:
- **Primitives**: Basic UI components
- **Composite**: Complex composed components
- **Layouts**: Page and section layouts
- **Themes**: Light/dark mode support

## 🔄 Data Flow

### User Authentication Flow

```
1. User visits apps/web
2. Clicks login/signup
3. Redirected to apps/auth
4. Authentication processed
5. Session created with cross-domain cookies
6. Redirected to apps/dashboard
7. Dashboard validates session with apps/auth
8. User gains access to application
```

### Brand Analysis Flow

```
1. User initiates analysis in apps/dashboard
2. Request sent to API route
3. Analysis job queued
4. Multiple AI platforms queried
5. Results processed and stored in database
6. Real-time updates sent via SSE
7. Dashboard updates with results
8. User views comprehensive analysis
```

### Data Synchronization

```
1. All apps use packages/database
2. Schema changes propagated automatically
3. Services provide consistent business logic
4. Real-time updates via database triggers
5. Caching layer for performance
```

## 🔒 Security Architecture

### Authentication & Authorization
- **Centralized Auth**: Single auth service for all applications
- **Cross-Domain Sessions**: Secure cookie-based sessions
- **JWT Tokens**: Stateless authentication tokens
- **Role-Based Access**: User roles and permissions

### Data Security
- **Database Security**: Row-level security (RLS) where applicable
- **API Security**: Rate limiting and input validation
- **Encryption**: Data encryption at rest and in transit
- **Audit Logging**: Comprehensive audit trails

### Network Security
- **HTTPS Only**: All communication over HTTPS
- **CORS Configuration**: Proper cross-origin resource sharing
- **CSP Headers**: Content Security Policy implementation
- **Rate Limiting**: API rate limiting and DDoS protection

## 📊 Performance Architecture

### Caching Strategy
- **Database Caching**: Query result caching
- **API Caching**: Response caching for static data
- **CDN Caching**: Static asset caching
- **Browser Caching**: Client-side caching

### Optimization Techniques
- **Database Optimization**: Proper indexing and query optimization
- **Code Splitting**: Dynamic imports and lazy loading
- **Image Optimization**: Next.js image optimization
- **Bundle Optimization**: Tree shaking and minification

### Monitoring & Observability
- **Application Monitoring**: Performance and error tracking
- **Database Monitoring**: Query performance and health
- **Infrastructure Monitoring**: Server and network monitoring
- **User Analytics**: User behavior and feature usage

## 🚀 Deployment Architecture

### Development Environment
- **Local Development**: All services running locally
- **Database**: Local PostgreSQL or Docker
- **Hot Reloading**: Fast development iteration
- **Testing**: Comprehensive test suite

### Staging Environment
- **Mirror Production**: Identical to production setup
- **Integration Testing**: End-to-end testing
- **Performance Testing**: Load and stress testing
- **Security Testing**: Vulnerability scanning

### Production Environment
- **High Availability**: Multi-region deployment
- **Auto Scaling**: Automatic scaling based on load
- **Load Balancing**: Traffic distribution
- **Backup & Recovery**: Automated backup systems

## 🔮 Future Architecture Considerations

### Scalability Improvements
- **Microservices**: Further service decomposition
- **Event-Driven**: Event sourcing and CQRS patterns
- **Caching**: Advanced caching strategies
- **Database Sharding**: Horizontal database scaling

### Technology Evolution
- **Edge Computing**: Edge function deployment
- **Real-time**: WebSocket and real-time features
- **AI Integration**: Enhanced AI and ML capabilities
- **API Gateway**: Centralized API management

---

This architecture provides a solid foundation for current needs while maintaining flexibility for future growth and evolution.

---

# Database Design

## 🗄️ Overview

Agents Authority uses a centralized database architecture with PostgreSQL and Drizzle ORM. The database is designed to support multi-tenant SaaS operations with comprehensive AI visibility tracking and analysis.

## 🏗️ Architecture

### Centralized Database Package

The database is managed through `packages/database` which provides:

- **Single Source of Truth**: All applications use the same schema
- **Type Safety**: Full TypeScript integration with Drizzle ORM
- **Migration Management**: Version-controlled schema changes
- **Business Logic**: Centralized services for data operations
- **Seed Data**: Comprehensive demo data for development and testing

### Technology Stack

- **Database**: PostgreSQL 15+
- **ORM**: Drizzle ORM
- **Migration Tool**: Drizzle Kit
- **Connection**: Node.js pg with connection pooling
- **Type Safety**: Full TypeScript integration

### Directory Structure

```
packages/database/
├── src/
│   ├── schema.ts              # Single source of truth for schema
│   ├── index.ts               # Main exports and connection
│   ├── seed.ts                # Comprehensive seed data
│   └── services/              # Business logic services
│       ├── company-service.ts # Company and competitor operations
│       └── chat-service.ts    # Chat and conversation operations
├── drizzle.config.ts          # Drizzle configuration
└── package.json               # Dependencies
```

### Centralized Services

All database operations are handled through centralized services:

#### **ChatService** (`chat-service.ts`)
- `saveConversation()` - Create/update conversations
- `saveMessage()` - Save chat messages
- `getConversationMessages()` - Retrieve conversation history
- `getUserConversations()` - Get user's conversations
- `deleteConversation()` - Remove conversations
- `searchConversations()` - Search functionality

#### **CompanyService** (`company-service.ts`)
- `saveBrandAnalysisResult()` - Legacy brand analysis storage
- `getRecentBrandAnalysis()` - Retrieve recent analysis
- `saveVisibilityScanResult()` - Visibility scan storage
- `getRecentVisibilityScan()` - Retrieve visibility scans
- `saveCompetitorAnalysisResult()` - Competitor analysis storage
- `getRecentCompetitorAnalysis()` - Retrieve competitor analysis

## 📊 Schema Overview

### Core Entity Relationships

```
Users (Better Auth)
├── UserProfile (Extended user data)
├── Companies (User's companies)
│   ├── Competitors (Company competitors)
│   └── BrandAnalysisResults (Analysis data)
├── Conversations (Chat history)
│   └── Messages (Chat messages)
└── Projects (Legacy - for compatibility)
```

### Database Tables

#### User Management
- **users**: Core user data (managed by Better Auth)
- **userProfile**: Extended user information and preferences
- **account**: Authentication accounts (Better Auth)
- **session**: User sessions (Better Auth)

#### Company & Competitor Management
- **companies**: Company information and metadata
- **competitors**: Competitor relationships and data
- **brandAnalysisResults**: AI visibility analysis results

#### Analysis & Monitoring
- **visibilityExplorerScans**: Visibility analysis sessions
- **competitorAnalyses**: Competitor analysis results
- **pulseSnapshots**: Historical analysis snapshots

#### Communication
- **conversations**: Chat conversation threads
- **messages**: Individual chat messages

#### Legacy Support
- **projects**: Legacy project structure (maintained for compatibility)
- **dashboards**: Dashboard configurations
- **widgets**: Dashboard widgets

## 🔧 Key Features

### 1. **Multi-Tenant Architecture**

```sql
-- All user data is properly isolated
SELECT * FROM companies WHERE user_id = $1;
SELECT * FROM brand_analysis_results WHERE user_id = $1;
```

### 2. **Comprehensive Analysis Storage**

```typescript
// Brand analysis with rich metadata
interface BrandAnalysisResult {
	visibilityScore: number;
	sentimentScore: number;
	shareOfVoice: number;
	platformPerformance: PlatformData[];
	competitorData: CompetitorAnalysis;
	keyInsights: Insight[];
}
```

### 3. **Real-time Data Support**
- Optimized for real-time analysis updates
- Efficient querying for dashboard displays
- Proper indexing for performance

### 4. **Audit Trail**
- Created/updated timestamps on all entities
- Soft deletes where appropriate
- Historical data preservation

## 🚀 Database Operations

### Connection Management

```typescript
// Connection pooling for performance
const pool = new Pool({
	connectionString: process.env.DATABASE_URL!,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
	maxUses: 7500,
});

export const db = drizzle(pool, { schema });
```

### Service Layer

```typescript
// Business logic in service classes
export class CompanyService {
	static async createCompany(userId: string, data: CompanyData) {
		return await db
			.insert(companies)
			.values({
				userId,
				...data,
			})
			.returning();
	}

	static async addCompetitor(companyId: string, data: CompetitorData) {
		return await db
			.insert(competitors)
			.values({
				companyId,
				...data,
			})
			.returning();
	}
}
```

### Type Safety

```typescript
// Full type safety with Drizzle
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type BrandAnalysis = typeof brandAnalysisResults.$inferSelect;
```

## 📈 Performance Optimization

### Indexing Strategy

```sql
-- Key indexes for performance
CREATE INDEX companies_user_id_idx ON companies(user_id);
CREATE INDEX brand_analysis_company_id_idx ON brand_analysis_results(company_id);
CREATE INDEX competitors_company_id_idx ON competitors(company_id);
CREATE INDEX conversations_user_id_idx ON conversations(user_id);
```

### Query Optimization
- **Proper Relations**: Efficient joins using Drizzle relations
- **Selective Loading**: Only load required fields
- **Pagination**: Proper pagination for large datasets
- **Caching**: Query result caching where appropriate

### Connection Pooling
- **Pool Size**: Optimized for concurrent users
- **Connection Reuse**: Efficient connection management
- **Timeout Handling**: Proper timeout configuration
- **Health Monitoring**: Connection health checks

## 🔒 Security

### Row-Level Security

```sql
-- User data isolation
CREATE POLICY user_companies_policy ON companies
  FOR ALL USING (user_id = current_user_id());
```

### Data Protection
- **Encryption**: Sensitive data encryption at rest
- **Access Control**: Proper user access controls
- **Audit Logging**: Comprehensive audit trails
- **Backup Security**: Encrypted backups

### Input Validation
- **Schema Validation**: Drizzle schema validation
- **Type Safety**: TypeScript type checking
- **Sanitization**: Input sanitization and validation
- **SQL Injection**: Protection through parameterized queries

## 🌱 Seed Data

### Demo Data Structure

The database includes comprehensive seed data for development and testing:

```typescript
// ACME Corporation demo company
const demoCompany = {
  name: "ACME Corporation",
  url: "https://acme.com",
  industry: "Manufacturing & Innovation",
  description: "Leading manufacturer of anvils, dynamite, road runner traps..."
};

// Comprehensive competitor data
const competitors = [
  "Wile E. Coyote Industries",
  "Warner Bros. Manufacturing",
  "Looney Tunes Corp",
  "Cartoon Network Industries"
];

// Rich analysis data
const analysisData = {
  visibilityScore: 87,
  sentimentScore: 82,
  platformPerformance: [...],
  competitorData: {...},
  keyInsights: [...]
};
```

### Seeding Process

```bash
# Run comprehensive seed data
make db-seed

# Individual seed operations
pnpm --filter @workspace/database db:seed
```

## 🔄 Migration Management

### Schema Changes

```bash
# Generate migration
pnpm --filter @workspace/database db:generate

# Apply migration
pnpm --filter @workspace/database db:push

# View in studio
pnpm --filter @workspace/database db:studio
```

### Migration Best Practices
1. **Backward Compatibility**: Ensure migrations don't break existing data
2. **Data Migration**: Include data migration scripts when needed
3. **Testing**: Test migrations on staging before production
4. **Rollback Plan**: Always have a rollback strategy

## 🔮 Future Considerations

### Scalability
- **Read Replicas**: For read-heavy workloads
- **Sharding**: Horizontal scaling strategies
- **Caching**: Advanced caching layers
- **Archive Strategy**: Historical data archiving

### Advanced Features
- **Full-Text Search**: PostgreSQL full-text search
- **JSON Queries**: Advanced JSONB operations
- **Time-Series**: Time-series data optimization
- **Analytics**: OLAP capabilities for reporting

### Monitoring
- **Query Performance**: Slow query monitoring
- **Connection Monitoring**: Pool health monitoring
- **Data Growth**: Storage growth tracking
- **Backup Verification**: Backup integrity checks

---

This database design provides a solid foundation for current needs while maintaining flexibility for future growth and feature expansion.

---

# Authentication Architecture

## 🔐 Overview

Agents Authority uses a centralized authentication architecture with Better Auth to provide seamless cross-domain authentication between the marketing website and dashboard application.

## 🏗️ Architecture

### Centralized Authentication Service

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Marketing     │    │   Dashboard     │    │ Authentication  │
│   Website       │    │   Application   │    │   Service       │
│   (port 3000)   │    │   (port 3001)   │    │   (port 3003)   │
│                 │    │                 │    │                 │
│ Login/Signup    │───▶│ Protected       │───▶│ Better Auth     │
│ Magic Links     │    │ Dashboard       │    │ Session Mgmt    │
│ Early Access    │    │ User Profile    │    │ Cross-domain    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Shared        │
                    │   Database      │
                    │                 │
                    │ • User Tables   │
                    │ • Sessions      │
                    │ • Accounts      │
                    └─────────────────┘
```

## 🔧 Better Auth Configuration

### Core Setup

```typescript
// apps/auth/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@workspace/database";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.COOKIE_DOMAIN, // .agentsauthority.com
    },
  },
});
```

### API Routes

```typescript
// apps/auth/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/nextjs";

export const { POST, GET } = toNextJsHandler(auth);
```

## 🌐 Cross-Domain Authentication

### Cookie Configuration

```typescript
// Cross-domain cookie settings
const cookieConfig = {
  domain: ".agentsauthority.com", // Shared across subdomains
  secure: true, // HTTPS only
  sameSite: "lax", // Cross-site requests allowed
  httpOnly: true, // Prevent XSS
  path: "/", // Available site-wide
};
```

### Session Validation

```typescript
// Middleware for protected routes
export async function validateSession(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  return session;
}
```

## 🔑 Authentication Flows

### 1. **Email/Password Authentication**

```typescript
// Sign up flow
const signUp = async (email: string, password: string) => {
  const response = await authClient.signUp.email({
    email,
    password,
    callbackURL: "/dashboard",
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};

// Sign in flow
const signIn = async (email: string, password: string) => {
  const response = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/dashboard",
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};
```

### 2. **Magic Link Authentication**

```typescript
// Send magic link
const sendMagicLink = async (email: string) => {
  const response = await authClient.signIn.magicLink({
    email,
    callbackURL: "/dashboard",
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};
```

### 3. **Cross-Domain Session Transfer**

```typescript
// Marketing site to dashboard transfer
const transferSession = async () => {
  // Session cookie is automatically shared
  // Redirect to dashboard with session intact
  window.location.href = "https://app.agentsauthority.com/dashboard";
};
```

## 👤 User Management

### User Profile Extension

```typescript
// Extended user profile in centralized database
export const userProfile = pgTable("user_profile", {
  userId: text("user_id").primaryKey(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatar: text("avatar"),
  preferences: jsonb("preferences").$type<UserPreferences>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

### Profile Management

```typescript
// Get user profile
export async function getUserProfile(userId: string) {
  return await db.query.userProfile.findFirst({
    where: eq(userProfile.userId, userId),
  });
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfileData>
) {
  return await db
    .update(userProfile)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(userProfile.userId, userId))
    .returning();
}
```

## 🔒 Security Features

### Password Security

```typescript
// Password requirements
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(/[A-Z]/, "Password must contain uppercase letter")
  .regex(/[a-z]/, "Password must contain lowercase letter")
  .regex(/[0-9]/, "Password must contain number")
  .regex(/[^A-Za-z0-9]/, "Password must contain special character");
```

### Rate Limiting

```typescript
// Authentication rate limiting
const authRateLimit = {
  signIn: "5 attempts per 15 minutes",
  signUp: "3 attempts per hour",
  passwordReset: "3 attempts per hour",
  magicLink: "5 attempts per hour",
};
```

### Session Security

```typescript
// Session validation middleware
export async function sessionMiddleware(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Check session validity
  if (!session?.user) {
    throw new Error("Invalid session");
  }

  // Check session expiration
  if (session.expiresAt < new Date()) {
    await auth.api.signOut({
      headers: request.headers,
    });
    throw new Error("Session expired");
  }

  return session;
}
```

## 🧪 Demo User Setup

### Development Demo User

```typescript
// Demo user for development and testing
export const DEMO_USER = {
  email: "investor@agentsauthority.ai",
  username: "investor",
  password: "password25",
  displayName: "Demo Investor",
  bio: "Demo user for testing the Agents Authority platform",
};
```

### Demo User Creation

```typescript
// Seed demo user
export async function seedDemoUser() {
  const hashedPassword = await bcrypt.hash(DEMO_USER.password, 12);

  // Create user in Better Auth tables
  const user = await db.insert(users).values({
    email: DEMO_USER.email,
    name: DEMO_USER.username,
    emailVerified: true,
  }).returning();

  // Create account for password authentication
  await db.insert(accounts).values({
    userId: user[0].id,
    accountId: user[0].id,
    providerId: "credential",
    password: hashedPassword,
  });

  // Create extended profile
  await db.insert(userProfile).values({
    userId: user[0].id,
    displayName: DEMO_USER.displayName,
    bio: DEMO_USER.bio,
  });

  return user[0];
}
```

## 🔧 Client Integration

### React Client Setup

```typescript
// apps/web/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL, // http://localhost:3003
});

// apps/dashboard/lib/auth-client.ts
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL, // http://localhost:3003
});
```

### React Hooks

```typescript
// Use authentication in components
import { useSession } from "better-auth/react";

export function ProfileComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

## 🚀 Production Considerations

### Environment Configuration

```bash
# Production environment variables
AUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://...
COOKIE_DOMAIN=.agentsauthority.com
NEXTAUTH_URL=https://auth.agentsauthority.com
```

### SSL/TLS Configuration

```typescript
// Production cookie settings
const productionCookies = {
  secure: true, // HTTPS only
  sameSite: "lax",
  domain: ".agentsauthority.com",
  httpOnly: true,
};
```

### Monitoring

```typescript
// Authentication monitoring
const authMetrics = {
  signInAttempts: "Track sign-in attempts and failures",
  sessionDuration: "Monitor average session length",
  crossDomainTransfers: "Track cross-domain session transfers",
  securityEvents: "Log security-related events",
};
```

## 🔮 Future Enhancements

### Planned Features
- **OAuth Providers**: Google, GitHub, LinkedIn integration
- **Two-Factor Authentication**: TOTP and SMS-based 2FA
- **Single Sign-On**: Enterprise SSO integration
- **Advanced Security**: Device fingerprinting and anomaly detection

### OAuth Integration

```typescript
// Future OAuth configuration
export const authWithOAuth = betterAuth({
  // ... existing config
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```

---

This authentication architecture provides secure, scalable user management while maintaining excellent developer and user experience across all applications.

---

# Supabase Decision

## Current State

The `apps/web/supabase` folder is **actively being used** for:

1. **Early Access Signups**: Stores user email and website data for early access requests
2. **Email Validation**: Supabase Edge Function for real-time email validation
3. **Database Table**: `early_access_signups` table with RLS policies
4. **Active Integration**: Used in `start-analysis-modal.tsx` component

## Files in Use

- `apps/web/supabase/migrations/001_early_access_signups.sql` - Database schema
- `apps/web/supabase/functions/validate-email/index.ts` - Edge function for email validation
- `apps/web/lib/supabase.ts` - Supabase client and service functions
- `apps/web/components/start-analysis-modal.tsx` - Uses Supabase functions

## Decision: KEEP FOR NOW

**Recommendation**: Keep the `apps/web/supabase` folder and functionality for now because:

1. **Active Feature**: The early access signup is a working feature that's actively used
2. **Separate Concern**: Early access signups are marketing-related, separate from the main app database
3. **Edge Function Value**: The email validation edge function provides real-time validation
4. **Migration Complexity**: Moving this to the centralized database would require significant refactoring

## Future Migration Path

If we decide to migrate this to the centralized database later:

1. **Add Early Access Table**: Add `early_access_signups` table to `packages/database/src/schema.ts`
2. **Migrate Email Validation**: Move email validation logic to a server-side API route
3. **Update Components**: Update `start-analysis-modal.tsx` to use the new API
4. **Data Migration**: Migrate existing early access data from Supabase to PostgreSQL
5. **Remove Supabase**: Remove Supabase dependencies and files

## Current Dependencies

The web app currently depends on:
- `@supabase/supabase-js`: ^2.53.0 (in package.json)
- Supabase environment variables in `.env.local`

## Conclusion

The `apps/web/supabase` folder should be **KEPT** as it provides active functionality for the marketing website that is separate from the main application database concerns.
