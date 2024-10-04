import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.length - 1];
  console.log(id)
  const body = await req.json()
  console.log(body)
  const  reason  = body;

  if (req.method === 'PUT') {
    try {
      const updatedReservation = await prisma.reservationServicePro.update({
        where: { id: String(id) },
        data: { 
          status: 'annule',
          reason: body.reason
        },
      });

      return NextResponse.json(updatedReservation);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
      return NextResponse.json({ error: 'Erreur interne du serveur' });
    }
  } else {
    return NextResponse.json({ error: 'Méthode non autorisée' });
  }
}

