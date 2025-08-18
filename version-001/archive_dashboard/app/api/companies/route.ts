import { auth } from "@/lib/auth-utils";
import { CompanyService } from "@/lib/services/company-service";
import { ValidationError, AuthenticationError, handleApiError } from "@/lib/api-errors";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError("Please log in to view companies");
    }

    const userId = sessionResponse.user.id;
    const companies = await CompanyService.getUserCompanies(userId);

    return Response.json({ companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError("Please log in to create a company");
    }

    const userId = sessionResponse.user.id;
    const body = await request.json();

    const { name, url, industry, description } = body;

    if (!name || !url) {
      throw new ValidationError("Company name and URL are required", {
        name: !name ? "Name is required" : undefined,
        url: !url ? "URL is required" : undefined,
      });
    }

    // Check if company with this URL already exists for this user
    const existingCompany = await CompanyService.findCompanyByUrl(userId, url);
    if (existingCompany) {
      throw new ValidationError("A company with this URL already exists", {
        url: "Company with this URL already exists",
      });
    }

    const company = await CompanyService.createCompany(userId, {
      name,
      url,
      industry,
      description,
    });

    return Response.json({ company }, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return handleApiError(error);
  }
}
