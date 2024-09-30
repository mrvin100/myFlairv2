import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, res: NextResponse) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (request.method === 'PUT') {
    try {
      if (!id) {
        return NextResponse.json({ error: 'Missing ID in the request' });
      }

      const parsedId = parseInt(id); 
      if (isNaN(parsedId)) {
        return NextResponse.json({ error: 'Invalid ID format' });
      }

      const data = await request.json();
      const { title, price, nbrEssaisGratuit, period, functions } = data;

      const updatedAbonnement = await prisma.abonnement.update({
        where: {
          id: parsedId, 
        },
        data: {
          title,
          price,
          nbrEssaisGratuit,
          period,
          functions: JSON.stringify(functions), 
        },
      });

      return NextResponse.json(updatedAbonnement);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
      return NextResponse.json({ error: 'Internal Server Error' });
    }
  } else {
    return NextResponse.json({ error: `Method ${request.method} Not Allowed` });
  }
}
