
import { mockUpdates } from '@/lib/mock-data';
import { NextRequest, NextResponse } from 'next/server';
import type { Update } from '@/lib/definitions';

export async function POST(request: NextRequest) {
    try {
        const { update, isEdit } = await request.json();
        
        if (isEdit) {
            const index = mockUpdates.findIndex((u) => u.id === update.id);
            if (index !== -1) {
                mockUpdates[index] = update;
            }
        } else {
            mockUpdates.unshift(update);
        }
        return NextResponse.json(update, { status: 201 });
    } catch (error) {
        return new NextResponse('Failed to save update', { status: 500 });
    }
}
