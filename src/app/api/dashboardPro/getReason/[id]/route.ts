// /app/api/dashboardPro/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {

    const reservation = await prisma.reservationServicePro.findUnique({
      where: {
        id: id,
      },
      select: {
        reason: true,
      },
    });

    if (!reservation) {
      return NextResponse.json({ message: 'Réservation non trouvée' }, { status: 404 });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    return NextResponse.json({ message: 'Erreur lors de la récupération de la réservation' }, { status: 500 });
  }
}
