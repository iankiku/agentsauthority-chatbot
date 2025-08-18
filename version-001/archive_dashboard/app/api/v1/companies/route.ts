import { auth } from "@/lib/auth-utils";
import { CompanyService } from "@/lib/services/company-service";
import { 
  ValidationError, 
  AuthenticationError, 
  handleApiError,
  RateLimitError 
} from "@/lib/api-errors";
import { 
  successResponse, 
  createdResponse, 
  paginatedResponse,
  validationErrorResponse 
} from "@/lib/api-response";
import { extractQueryParams } from "@/lib/pagination";
import { standardRateLimit } from "@/lib/rate-limiter";
import { addVersionHeaders, API_VERSIONS } from "@/lib/api-versioning";
import { NextRequest } from "next/server";
import { z } from "zod";

// Input validation schemas
const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(100),
  url: z.string().url("Valid URL is required"),
  industry: z.string().optional(),
  description: z.string().max(500).optional(),
});

const updateCompanySchema = createCompanySchema.partial();

// GET /api/v1/companies - List companies with pagination, sorting, and filtering
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await standardRateLimit(request);
    if (rateLimitResult) return rateLimitResult;

    // Authentication
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError("Please log in to view companies");
    }

    const userId = sessionResponse.user.id;

    // Extract query parameters
    const queryParams = extractQueryParams(request, {
      defaultLimit: 10,
      maxLimit: 50,
      allowedSortFields: ['name', 'createdAt', 'industry'],
      allowedFilters: ['industry', 'status']
    });

    // Get companies with pagination
    const result = await CompanyService.getUserCompaniesPaginated(
      userId, 
      queryParams
    );

    const response = paginatedResponse(
      result.data,
      queryParams.pagination.page,
      queryParams.pagination.limit,
      result.total,
      {
        version: API_VERSIONS.V1,
        requestId: crypto.randomUUID()
      }
    );

    return addVersionHeaders(response, API_VERSIONS.V1);
    
  } catch (error) {
    console.error("Error fetching companies:", error);
    return handleApiError(error);
  }
}

// POST /api/v1/companies - Create a new company
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (stricter for create operations)
    const rateLimitResult = await standardRateLimit(request);
    if (rateLimitResult) return rateLimitResult;

    // Authentication
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError("Please log in to create a company");
    }

    const userId = sessionResponse.user.id;
    
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return validationErrorResponse({
        body: "Invalid JSON in request body"
      });
    }

    // Validate input using Zod
    const validationResult = createCompanySchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.errors.reduce(
        (acc, error) => {
          const field = error.path.join('.');
          acc[field] = error.message;
          return acc;
        },
        {} as Record<string, string>
      );
      
      return validationErrorResponse(fieldErrors);
    }

    const validatedData = validationResult.data;

    // Business logic validation
    const existingCompany = await CompanyService.findCompanyByUrl(
      userId, 
      validatedData.url
    );
    
    if (existingCompany) {
      return validationErrorResponse({
        url: "A company with this URL already exists"
      });
    }

    // Create company
    const company = await CompanyService.createCompany(userId, validatedData);

    // Return created response
    const response = createdResponse(company, {
      version: API_VERSIONS.V1,
      requestId: crypto.randomUUID()
    });

    return addVersionHeaders(response, API_VERSIONS.V1);
    
  } catch (error) {
    console.error("Error creating company:", error);
    return handleApiError(error);
  }
}

// PUT /api/v1/companies - Bulk update companies (optional)
export async function PUT(request: NextRequest) {
  try {
    // Apply stricter rate limiting for bulk operations
    const rateLimitResult = await standardRateLimit(request);
    if (rateLimitResult) return rateLimitResult;

    // Authentication
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError("Please log in to update companies");
    }

    // This endpoint could handle bulk updates
    // Implementation depends on business requirements
    
    return successResponse({ message: "Bulk update not implemented yet" });
    
  } catch (error) {
    console.error("Error bulk updating companies:", error);
    return handleApiError(error);
  }
}

// OPTIONS - Return available methods and CORS headers
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  });
}