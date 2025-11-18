
import { mockProjectData } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, this would be filtered by the logged-in user
  const activeProjects = mockProjectData.filter(p => p.status === 'Active');
  return NextResponse.json(activeProjects);
}
