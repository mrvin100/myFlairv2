import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient().$extends(withAccelerate());

export async function DELETE(req: NextRequest, res: NextResponse) {
    if (req.method === 'DELETE') {
        const url = new URL(req.url);
        const segments = url.pathname.split('/');
        const reviewId = segments[segments.length - 1];

        try {
            const deleteReview = await prisma.review.delete({
                where: { id: reviewId }, 
            });

            return NextResponse.json(deleteReview, {status: 200});
        } catch (error) {
            console.error('Failed to delete', error);
            return NextResponse.json({ message: 'Failed to delete' });
        }
    } else {
        return NextResponse.json({ message: 'Method not allowed' });
    }
}