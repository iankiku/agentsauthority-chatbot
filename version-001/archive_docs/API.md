# API Documentation

## 🔌 Overview

Agents Authority provides comprehensive REST APIs across three main services. All APIs follow consistent patterns for authentication, error handling, and response formats.

## 🏗️ API Architecture

### Service Endpoints

| Service | Base URL | Purpose |
|---------|----------|---------|
| **Authentication** | `http://localhost:3003` | User authentication and session management |
| **Dashboard** | `http://localhost:3001/api` | Main application functionality |
| **Marketing** | `http://localhost:3000/api` | Early access and marketing features |

### Authentication

All dashboard APIs require authentication via Better Auth sessions:

```typescript
// Session-based authentication
const session = await auth.api.getSession({
  headers: request.headers
});

if (!session?.user) {
  return new Response("Unauthorized", { status: 401 });
}
```

## 📚 API Reference

### [Authentication API](#authentication-api)
- User registration and login
- Session management
- Password reset
- Cross-domain authentication

### [Dashboard API](#dashboard-api)
- Company management
- Brand analysis
- Competitor tracking
- Chat functionality

### [Company Management API](#company-management-api)
- CRUD operations for companies
- Competitor management
- Analysis results

### [Brand Analysis API](#brand-analysis-api)
- Visibility analysis
- Platform monitoring
- Competitor comparison
- Historical data

## 🔧 Common Patterns

### Request Format

```typescript
// Standard request headers
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <session-token>" // When required
}

// Request body (POST/PUT)
{
  "data": {
    // Request payload
  },
  "metadata": {
    // Optional metadata
  }
}
```

### Response Format

```typescript
// Success response
{
  "success": true,
  "data": {
    // Response payload
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_123456"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_123456"
  }
}
```

### Pagination

```typescript
// Paginated request
GET /api/companies?page=1&limit=20&sort=createdAt&order=desc

// Paginated response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🔒 Security

### Rate Limiting

```typescript
// Rate limits per endpoint
const rateLimits = {
  "/api/auth/*": "10 requests per minute",
  "/api/companies": "100 requests per hour",
  "/api/analysis": "50 requests per hour"
};
```

### Input Validation

```typescript
// Zod schema validation
const createCompanySchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  industry: z.string().optional(),
  description: z.string().max(500).optional()
});
```

### Error Handling

```typescript
// Standardized error responses
export class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
  }
}

// Common error codes
const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR"
};
```

## 🚀 Real-time Features

### Server-Sent Events (SSE)

```typescript
// Analysis streaming endpoint
GET /api/analysis/stream?companyId=123

// SSE response format
data: {"type": "progress", "step": "analyzing_chatgpt", "progress": 25}
data: {"type": "result", "platform": "chatgpt", "score": 87}
data: {"type": "complete", "analysisId": "analysis_456"}
```

### WebSocket Support (Future)

```typescript
// WebSocket connection for real-time updates
const ws = new WebSocket('ws://localhost:3001/api/ws');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Handle real-time updates
};
```

## 📊 Monitoring & Analytics

### Request Logging

```typescript
// Request/response logging
{
  "timestamp": "2024-01-01T00:00:00Z",
  "method": "POST",
  "path": "/api/companies",
  "userId": "user_123",
  "duration": 150,
  "statusCode": 201,
  "requestId": "req_123456"
}
```

### Performance Metrics

```typescript
// API performance tracking
{
  "endpoint": "/api/analysis",
  "avgResponseTime": 2500,
  "requestCount": 1000,
  "errorRate": 0.02,
  "p95ResponseTime": 4000
}
```

## 🧪 Testing

### API Testing

```typescript
// Example API test
describe('Companies API', () => {
  it('should create a new company', async () => {
    const response = await fetch('/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
      body: JSON.stringify({
        name: 'Test Company',
        url: 'https://test.com'
      })
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.name).toBe('Test Company');
  });
});
```

### Mock Data

```typescript
// Mock API responses for testing
export const mockCompany = {
  id: "company_123",
  name: "Test Company",
  url: "https://test.com",
  industry: "Technology",
  createdAt: "2024-01-01T00:00:00Z"
};
```

## 📖 Usage Examples

### JavaScript/TypeScript

```typescript
// Company creation
const createCompany = async (data: CompanyData) => {
  const response = await fetch('/api/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
```

### cURL Examples

```bash
# Create a company
curl -X POST http://localhost:3001/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example Company",
    "url": "https://example.com",
    "industry": "Technology"
  }'

# Get company analysis
curl -X GET http://localhost:3001/api/companies/123/analysis \
  -H "Authorization: Bearer <session-token>"
```

## 🔮 Future Enhancements

### Planned Features

- **GraphQL API**: Alternative to REST for complex queries
- **Webhook Support**: Event-driven integrations
- **Bulk Operations**: Batch processing endpoints
- **Advanced Filtering**: Complex query capabilities

### API Versioning

```typescript
// Version-aware routing
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

// Header-based versioning
const apiVersion = req.headers['api-version'] || 'v1';
```

---

For detailed endpoint documentation, see the individual API reference sections below.

## Authentication API

### POST /api/auth/sign-up

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "session": {
      "token": "session_token_here",
      "expiresAt": "2024-01-08T00:00:00Z"
    }
  }
}
```

### POST /api/auth/sign-in

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "session": {
      "token": "session_token_here",
      "expiresAt": "2024-01-08T00:00:00Z"
    }
  }
}
```

### POST /api/auth/sign-out

Sign out the current user.

**Response:**
```json
{
  "success": true,
  "message": "Successfully signed out"
}
```

### POST /api/auth/magic-link

Send a magic link for passwordless authentication.

**Request Body:**
```json
{
  "email": "user@example.com",
  "callbackURL": "/dashboard"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Magic link sent to email"
}
```

## Dashboard API

### GET /api/companies

Get all companies for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "company_123",
      "name": "ACME Corporation",
      "url": "https://acme.com",
      "industry": "Manufacturing",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### POST /api/companies

Create a new company.

**Request Body:**
```json
{
  "name": "ACME Corporation",
  "url": "https://acme.com",
  "industry": "Manufacturing",
  "description": "Leading manufacturer of innovative products"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "company_123",
    "name": "ACME Corporation",
    "url": "https://acme.com",
    "industry": "Manufacturing",
    "description": "Leading manufacturer of innovative products",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/companies/:id

Get a specific company by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "company_123",
    "name": "ACME Corporation",
    "url": "https://acme.com",
    "industry": "Manufacturing",
    "description": "Leading manufacturer of innovative products",
    "createdAt": "2024-01-01T00:00:00Z",
    "competitors": [
      {
        "id": "competitor_456",
        "name": "Competitor Corp",
        "url": "https://competitor.com"
      }
    ]
  }
}
```

### PUT /api/companies/:id

Update a company.

**Request Body:**
```json
{
  "name": "ACME Corporation Updated",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "company_123",
    "name": "ACME Corporation Updated",
    "url": "https://acme.com",
    "industry": "Manufacturing",
    "description": "Updated description",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

### DELETE /api/companies/:id

Delete a company.

**Response:**
```json
{
  "success": true,
  "message": "Company deleted successfully"
}
```

## Company Management API

### POST /api/companies/:id/competitors

Add a competitor to a company.

**Request Body:**
```json
{
  "name": "Competitor Corp",
  "url": "https://competitor.com",
  "industry": "Manufacturing"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "competitor_456",
    "companyId": "company_123",
    "name": "Competitor Corp",
    "url": "https://competitor.com",
    "industry": "Manufacturing",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### GET /api/companies/:id/competitors

Get all competitors for a company.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "competitor_456",
      "name": "Competitor Corp",
      "url": "https://competitor.com",
      "industry": "Manufacturing",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### DELETE /api/companies/:id/competitors/:competitorId

Remove a competitor from a company.

**Response:**
```json
{
  "success": true,
  "message": "Competitor removed successfully"
}
```

## Brand Analysis API

### POST /api/analysis/brand

Start a brand analysis for a company.

**Request Body:**
```json
{
  "companyId": "company_123",
  "platforms": ["chatgpt", "claude", "gemini", "perplexity"],
  "queries": [
    "best manufacturing companies",
    "top anvil manufacturers",
    "reliable industrial suppliers"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysisId": "analysis_789",
    "status": "started",
    "estimatedDuration": 300
  }
}
```

### GET /api/analysis/:id

Get analysis results by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "analysis_789",
    "companyId": "company_123",
    "status": "completed",
    "results": {
      "visibilityScore": 87,
      "sentimentScore": 82,
      "shareOfVoice": 15.3,
      "platformPerformance": [
        {
          "platform": "chatgpt",
          "score": 85,
          "mentions": 12,
          "sentiment": "positive"
        }
      ],
      "keyInsights": [
        "Strong presence in manufacturing queries",
        "Positive sentiment across all platforms"
      ]
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "completedAt": "2024-01-01T00:05:00Z"
  }
}
```

### GET /api/analysis/stream/:id

Stream real-time analysis updates via Server-Sent Events.

**Response (SSE):**
```
data: {"type": "progress", "step": "analyzing_chatgpt", "progress": 25}

data: {"type": "result", "platform": "chatgpt", "score": 85, "mentions": 12}

data: {"type": "progress", "step": "analyzing_claude", "progress": 50}

data: {"type": "result", "platform": "claude", "score": 89, "mentions": 8}

data: {"type": "complete", "analysisId": "analysis_789", "finalScore": 87}
```

### GET /api/analysis/history/:companyId

Get analysis history for a company.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "analysis_789",
      "status": "completed",
      "visibilityScore": 87,
      "sentimentScore": 82,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

This API documentation provides comprehensive coverage of all available endpoints with detailed request/response examples and usage patterns.
