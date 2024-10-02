import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextRequest) {
  try {
    const currentDate = new Date();

    const reservations = await prisma.reservationServicePro.findMany({
      where: {
        status: 'en-cours',
        dateOfRdv: {
          lt: currentDate.toISOString(),
        },
      },
    });

    const updatePromises = reservations.map((reservation) =>
      prisma.reservationServicePro.update({
        where: { id: reservation.id },
        data: {
          status: 'termine', 
          dateOfRdv: reservation.dateOfRdv, 
        },
      })
    );
    await Promise.all(updatePromises);

    return NextResponse.json({ message: `${reservations.length} réservations mises à jour.` }, {status:200});
  } catch (error) {
    console.error('Erreur lors de la mise à jour des réservations:', error);
    return NextResponse.json({ error: 'Erreur serveur.' });
  }
}
