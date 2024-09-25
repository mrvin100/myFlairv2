import { prisma } from '@/lib/prisma'; 
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    if (req.method === 'GET') {
        try {
            const reviews = await prisma.review.findMany({
                where: {
                    archived: false,
                },
                include: {
                    author: true,
                    professional: true,
                },
            });
            return NextResponse.json(reviews, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: "Unable to fetch reviews" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }
}
