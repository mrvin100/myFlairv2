import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    const { email, username } = await request.json();

    const userExists = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { username: username },
            ],
        },
    });

    if (userExists) {
        return NextResponse.json({ exists: true }, { status: 409 });
    }

    return NextResponse.json({ exists: false });
}
