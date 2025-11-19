import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DailyAssessment from '@/models/DailyAssessment';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    const { status, adminCorrections, finalScore } = body;

    const updatedAssessment = await DailyAssessment.findByIdAndUpdate(
      params.id,
      { status, adminCorrections, finalScore },
      { new: true, runValidators: true }
    ).populate('templateId').lean();

    if (!updatedAssessment) {
      return new NextResponse('Assessment not found', { status: 404 });
    }
    return NextResponse.json(JSON.parse(JSON.stringify(updatedAssessment)));
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to validate assessment', { status: 500 });
  }
}
