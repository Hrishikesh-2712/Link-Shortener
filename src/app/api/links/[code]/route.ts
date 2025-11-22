import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const code = (await params).code;
    const link = await prisma.link.findUnique({
        where: { code },
    });

    if (!link) {
        return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json(link);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    const code = (await params).code;
    try {
        await prisma.link.delete({
            where: { code },
        });
        return NextResponse.json({ message: 'Link deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }
}
