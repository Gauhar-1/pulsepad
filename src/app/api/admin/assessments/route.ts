
import { mockDailyAssessments, mockAssessmentTemplates } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return NextResponse.json({
    assessments: mockDailyAssessments,
    templates: mockAssessmentTemplates,
  });
}
