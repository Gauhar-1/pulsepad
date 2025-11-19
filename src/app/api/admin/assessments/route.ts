import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AssessmentTemplate from '@/models/AssessmentTemplate';
import DailyAssessment from '@/models/DailyAssessment';
import { formatISO } from 'date-fns';

export async function GET() {
  await dbConnect();
  try {
    const today = formatISO(new Date(), { representation: 'date' });
    const assessments = await DailyAssessment.find({ date: today }).populate('templateId').lean();
    const templates = await AssessmentTemplate.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      assessments: JSON.parse(JSON.stringify(assessments)),
      templates: JSON.parse(JSON.stringify(templates)),
    });
  } catch (error) {
    console.error('Failed to fetch assessment data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { employeeIds, templateIds } = await request.json();
    if (!employeeIds || !templateIds || employeeIds.length === 0 || templateIds.length === 0) {
      return new NextResponse('Missing employeeIds or templateIds', { status: 400 });
    }

    const today = formatISO(new Date(), { representation: 'date' });
    const assignments = [];

    for (const employeeId of employeeIds) {
      for (const templateId of templateIds) {
        // Check if an assignment for this user and template already exists today
        const existingAssignment = await DailyAssessment.findOne({
          employeeId,
          templateId,
          date: today,
        });

        if (!existingAssignment) {
          assignments.push({
            employeeId,
            templateId,
            date: today,
            status: 'ASSIGNED',
            responses: [],
          });
        }
      }
    }

    if (assignments.length > 0) {
      await DailyAssessment.insertMany(assignments);
    }
    
    return NextResponse.json({ message: `${assignments.length} assignments created successfully.` }, { status: 201 });
  } catch (error) {
    console.error('Failed to create assignments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
