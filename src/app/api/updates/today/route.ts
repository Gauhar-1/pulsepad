
import { mockUpdates } from '@/lib/mock-data';
import { isToday } from 'date-fns';
import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, this would be filtered by userId
  const todaysUpdates = mockUpdates.filter((u) => isToday(new Date(u.createdAt)));
  return NextResponse.json(todaysUpdates);
}
