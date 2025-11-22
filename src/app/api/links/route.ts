import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCode, isValidCode, isValidUrl } from '@/lib/utils';

export async function GET() {
    const links = await prisma.link.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(links);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url, code } = body;

        if (!url || !isValidUrl(url)) {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        let finalCode = code;

        if (finalCode) {
            // Validate custom code format
            if (!isValidCode(finalCode)) {
                // Allow "docs" as a special exception for testing if needed, or strict?
                // The prompt says "docs -> ...", which is 4 chars.
                // But rules say "Codes follow [A-Za-z0-9]{6,8}".
                // I will enforce the rule but maybe allow 4 chars if the user really wants it?
                // "Custom codes are globally unique... if a code already exists, show an error."
                // "Codes follow [A-Za-z0-9]{6,8}" is listed under "Rules".
                // I will stick to the regex I defined in utils (6-8).
                // If the user tries "docs", it will fail validation.
                // I'll update the error message to be clear.
                return NextResponse.json({ error: 'Code must be 6-8 alphanumeric characters' }, { status: 400 });
            }

            // Check uniqueness
            const existing = await prisma.link.findUnique({ where: { code: finalCode } });
            if (existing) {
                return NextResponse.json({ error: 'Code already exists' }, { status: 409 });
            }
        } else {
            // Generate unique code
            let isUnique = false;
            while (!isUnique) {
                finalCode = generateCode();
                const existing = await prisma.link.findUnique({ where: { code: finalCode } });
                if (!existing) isUnique = true;
            }
        }

        const link = await prisma.link.create({
            data: {
                originalUrl: url,
                code: finalCode,
            },
        });

        return NextResponse.json(link, { status: 201 });
    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
