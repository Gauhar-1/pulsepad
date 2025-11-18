
import { mockTrainingTasks } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(mockTrainingTasks);
}
