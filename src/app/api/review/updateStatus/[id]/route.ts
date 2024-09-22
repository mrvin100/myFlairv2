import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
export async function PUT(req: NextRequest, res: NextResponse) {
    const { method } = req;

    if (method === 'PUT') {
       
        try {
            const url = new URL(req.url);
            const segments = url.pathname.split('/');
            const reviewId = segments[segments.length - 1];
            const updatedReview = await prisma.review.update({
                where: { id: reviewId },
                data: { status: 'approved' },
            });

            return NextResponse.json(updatedReview, {status:200});
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'avis:", error);
            return NextResponse.json({ error: 'Erreur lors de la mise à jour de l\'avis' }, {status:500});
        }
    } else {
        return NextResponse.json(`Method ${method} Not Allowed`,{status:405});
    }
}
