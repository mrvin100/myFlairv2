import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient().$extends(withAccelerate());

export async function PUT(req: NextRequest, res: NextResponse) {
    if (req.method === 'PUT') {
        const url = new URL(req.url);
        const segments = url.pathname.split('/');
        const reviewId = segments[segments.length - 1];

        try {
            const updatedReview = await prisma.review.update({
                where: { id: reviewId },
                data: { archived: true }, 
            });

            return NextResponse.json(updatedReview, {status: 200});
        } catch (error) {
            console.error('Failed to update review', error);
            return NextResponse.json({ message: 'Failed to update review' });
        }
    } else {
        return NextResponse.json({ message: 'Method not allowed' });
    }
}
