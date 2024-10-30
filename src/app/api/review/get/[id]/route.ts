import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const userId = segments[segments.length - 1];

  if (req.method === 'GET') {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          professionalId: userId as string,
          status: { not: 'await' }
        },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Une erreur est survenue lors de la récupération des avis.' }, { status: 405 });
    }
  } else {
    return NextResponse.json(`Method ${req.method} Not Allowed`, { status: 500 });
  }
}
