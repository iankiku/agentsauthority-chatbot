
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { brandAnalyses } from '@workspace/database';
import { eq, and } from 'drizzle-orm';
import { handleApiError, AuthenticationError, NotFoundError } from '@/lib/api-errors';

// POST /api/brand-monitor/analyses/[analysisId]/export - Export analysis data
export async function POST(
  request: NextRequest,
  { params }: { params: { analysisId: string } }
) {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionResponse?.user) {
      throw new AuthenticationError('Please log in to export analysis data');
    }

    const { analysisId } = params;
    const { format } = await request.json(); // format can be 'csv' or 'pdf'

    const analysis = await db.query.brandAnalyses.findFirst({
      where: and(
        eq(brandAnalyses.id, analysisId),
        eq(brandAnalyses.user_id, sessionResponse.user.id)
      ),
    });

    if (!analysis) {
      throw new NotFoundError('Analysis not found');
    }

    if (format === 'csv') {
      // Generate CSV content
      const csvContent = 'header1,header2\nvalue1,value2'; // Placeholder
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analysis-${analysisId}.csv"`,
        },
      });
    } else if (format === 'pdf') {
      // PDF generation logic would go here
      return new NextResponse('PDF content', { // Placeholder
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="analysis-${analysisId}.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
