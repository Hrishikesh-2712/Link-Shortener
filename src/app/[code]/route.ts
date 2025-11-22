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
        return new NextResponse('Not Found', { status: 404 });
    }

    // Update stats asynchronously (or await it if we want strict consistency)
    // For better performance, we could fire and forget, but Vercel serverless might kill it.
    // So we await.
    await prisma.link.update({
        where: { id: link.id },
        data: {
            clicks: { increment: 1 },
            lastClickedAt: new Date(),
        },
    });

    return NextResponse.redirect(link.originalUrl);
}
