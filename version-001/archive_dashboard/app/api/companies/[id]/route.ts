import { auth } from "@/lib/auth-utils";
import { CompanyService } from "@/lib/services/company-service";
import { ValidationError, AuthenticationError, NotFoundError, handleApiError } from "@/lib/api-errors";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError("Please log in to view company details");
    }

    const userId = sessionResponse.user.id;
    const companyId = params.id;

    const company = await CompanyService.getCompany(userId, companyId);

    if (!company) {
      throw new NotFoundError("Company not found");
    }

    return Response.json({ company });
  } catch (error) {
    console.error("Error fetching company:", error);
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError("Please log in to update company");
    }

    const userId = sessionResponse.user.id;
    const companyId = params.id;
    const body = await request.json();

    const { name, url, industry, description } = body;

    // Validate that company exists and belongs to user
    const existingCompany = await CompanyService.getCompany(userId, companyId);
    if (!existingCompany) {
      throw new NotFoundError("Company not found");
    }

    // If URL is being changed, check it doesn't conflict with another company
    if (url && url !== existingCompany.url) {
      const conflictingCompany = await CompanyService.findCompanyByUrl(userId, url);
      if (conflictingCompany && conflictingCompany.id !== companyId) {
        throw new ValidationError("A company with this URL already exists", {
          url: "Company with this URL already exists",
        });
      }
    }

    const updatedCompany = await CompanyService.updateCompany(userId, companyId, {
      name,
      url,
      industry,
      description,
    });

    return Response.json({ company: updatedCompany });
  } catch (error) {
    console.error("Error updating company:", error);
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError("Please log in to delete company");
    }

    const userId = sessionResponse.user.id;
    const companyId = params.id;

    // Validate that company exists and belongs to user
    const existingCompany = await CompanyService.getCompany(userId, companyId);
    if (!existingCompany) {
      throw new NotFoundError("Company not found");
    }

    await CompanyService.deleteCompany(userId, companyId);

    return Response.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    return handleApiError(error);
  }
}
