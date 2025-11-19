
import {
  mockDailyAssessments,
  mockAssessmentTemplates,
} from '@/lib/mock-data';
import { NextResponse } from 'next/server';
import { isToday, parseISO } from 'date-fns';

export async function GET() {
  // In a real app, you would filter by the logged-in user's ID
  // For this mock, we'll return the assessment for user 'emp-001' for today
  const userId = 'emp-001';
  
  // Find an assessment for the correct user that is dated for today.
  const todaysAssessment = mockDailyAssessments.find(
    (a) => a.employeeId === userId && isToday(parseISO(a.date))
  );

  const assessments = todaysAssessment ? [todaysAssessment] : [];
  
  const templateIds = new Set(assessments.map((a) => a.templateId));
  const relevantTemplates = mockAssessmentTemplates.filter((t) =>
    templateIds.has(t.id)
  );

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json({
    assessments: assessments,
    templates: relevantTemplates,
  });
}
