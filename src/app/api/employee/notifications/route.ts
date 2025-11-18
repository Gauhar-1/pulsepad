
import { NextResponse } from 'next/server';
import { mockNotifications } from '@/lib/mock-data';

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return NextResponse.json(mockNotifications);
}
