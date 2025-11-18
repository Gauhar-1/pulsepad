
import { mockProjectData } from '@/lib/mock-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    const project = mockProjectData.find((p) => p.id === id);
    if (project) {
      return NextResponse.json(project);
    } else {
      return new NextResponse('Project not found', { status: 404 });
    }
  }

  return NextResponse.json(mockProjectData);
}
