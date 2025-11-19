import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AssessmentTemplate from '@/models/AssessmentTemplate';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    const updatedTemplate = await AssessmentTemplate.findByIdAndUpdate(params.id, body, { new: true, runValidators: true }).lean();
    if (!updatedTemplate) {
      return new NextResponse('Template not found', { status: 404 });
    }
    return NextResponse.json(JSON.parse(JSON.stringify(updatedTemplate)));
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to update template', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const deletedTemplate = await AssessmentTemplate.findByIdAndDelete(params.id);
    if (!deletedTemplate) {
      return new NextResponse('Template not found', { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to delete template', { status: 500 });
  }
}
