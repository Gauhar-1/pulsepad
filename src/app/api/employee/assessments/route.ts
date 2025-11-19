
import {
  mockDailyAssessments,
  mockAssessmentTemplates,
} from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, you would filter by the logged-in user's ID.
  // For this mock, we return everything and let the client filter.
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json({
    assessments: mockDailyAssessments,
    templates: mockAssessmentTemplates,
  });
}
