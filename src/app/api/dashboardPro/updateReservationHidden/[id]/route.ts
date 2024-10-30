// api/dashboardPro/updateReservationHidden/[id].ts
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.length - 1];

  if (req.method === 'PUT') {

    try {

      await prisma.reservationServicePro.update({
        where: { id },
        data: {
          hiddenForPro: true, 
        },
      });
      const reservation = await prisma.reservationServicePro.findUnique({
        where: { id },
      });

      if (reservation?.hiddenForPro && reservation?.hiddenForUser) {
        await prisma.reservationServicePro.delete({
          where: { id },
        });
      }

      return NextResponse.json({ message: 'Réservation annulée avec succès' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Erreur interne du serveur' });
    }
  }

  return NextResponse.json({ error: 'Méthode non autorisée' });
}
