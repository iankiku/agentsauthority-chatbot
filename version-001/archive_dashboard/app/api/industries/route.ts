import { NextRequest, NextResponse } from "next/server";
import { getAvailableIndustries, getIndustryConfig } from "@/lib/geo-scoring/industry-weights";

// GET /api/industries - Get available industries and their configurations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeConfig = searchParams.get("includeConfig") === "true";

    const industries = getAvailableIndustries();

    if (includeConfig) {
      // Return industries with their full configurations
      const industriesWithConfig = industries.map(industry => ({
        id: industry,
        name: industry.charAt(0).toUpperCase() + industry.slice(1),
        config: getIndustryConfig(industry)
      }));

      return NextResponse.json({
        success: true,
        data: industriesWithConfig,
        total: industries.length,
      });
    } else {
      // Return just the industry names
      const industriesList = industries.map(industry => ({
        id: industry,
        name: industry.charAt(0).toUpperCase() + industry.slice(1),
        description: getIndustryConfig(industry).description
      }));

      return NextResponse.json({
        success: true,
        data: industriesList,
        total: industries.length,
      });
    }

  } catch (error) {
    console.error("Industries API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch industries",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
