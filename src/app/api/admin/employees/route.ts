
import { mockEmployeeData } from '@/lib/mock-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const employee = mockEmployeeData.find((p) => p.id === id);
    if (employee) {
      return NextResponse.json(employee);
    } else {
      return new NextResponse('Employee not found', { status: 404 });
    }
  }
  
  return NextResponse.json(mockEmployeeData);
}
