
import {
  mockDailyAssessments,
  mockAssessmentTemplates,
} from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, you would filter by the logged-in user's ID
  // For this mock, we'll return all assessments related to user 'emp-001'
  const userId = 'emp-001';
  const userAssessments = mockDailyAssessments.filter(
    (a) => a.employeeId === userId
  );

  const templateIds = new Set(userAssessments.map((a) => a.templateId));
  const relevantTemplates = mockAssessmentTemplates.filter((t) =>
    templateIds.has(t.id)
  );

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json({
    assessments: userAssessments,
    templates: relevantTemplates,
  });
}
