import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { brandAnalyses } from '@workspace/database';
import { eq, desc } from 'drizzle-orm';
import { handleApiError, AuthenticationError, ValidationError } from '@/lib/api-errors';

// GET /api/brand-monitor/analyses - Get user's brand analyses
export async function GET(request: NextRequest) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError('Please log in to view your analyses');
    }

    const analyses = await db.query.brandAnalyses.findMany({
      where: eq(brandAnalyses.user_id, sessionResponse.user.id),
      orderBy: desc(brandAnalyses.created_at),
    });

    return NextResponse.json(analyses);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/brand-monitor/analyses - Save a new brand analysis
export async function POST(request: NextRequest) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError('Please log in to save analyses');
    }

    const body = await request.json();
    
    if (!body.url || !body.analysisData) {
      throw new ValidationError('Invalid request', {
        url: body.url ? undefined : 'URL is required',
        analysisData: body.analysisData ? undefined : 'Analysis data is required',
      });
    }

    const [analysis] = await db.insert(brandAnalyses).values({
      user_id: sessionResponse.user.id,
      url: body.url,
      company_name: body.companyName,
      industry: body.industry,
      analysis_data: body.analysisData,
      competitors: body.competitors,
      prompts: body.prompts,
      credits_used: body.creditsUsed || 10,
    }).returning();

    return NextResponse.json(analysis);
  } catch (error) {
    return handleApiError(error);
  }
}