import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AssessmentTemplate from '@/models/AssessmentTemplate';

export async function GET() {
  await dbConnect();
  try {
    const templates = await AssessmentTemplate.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(JSON.parse(JSON.stringify(templates)));
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newTemplate = await AssessmentTemplate.create(body);
    return NextResponse.json(JSON.parse(JSON.stringify(newTemplate)), { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to create template', { status: 500 });
  }
}
