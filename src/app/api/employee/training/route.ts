
import { mockTrainingTasks } from '@/lib/mock-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  if (id) {
    const task = mockTrainingTasks.find((t) => t.id === Number(id));
    if (task) {
      return NextResponse.json(task);
    } else {
      return new NextResponse('Training task not found', { status: 404 });
    }
  }

  // In a real app, you would filter tasks assigned to the logged-in user
  return NextResponse.json(mockTrainingTasks);
}
