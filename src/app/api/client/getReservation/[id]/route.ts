import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const clientId = segments[segments.length - 1];

    console.log(clientId,"ClientID")
    const reservations = await prisma.reservationServicePro.findMany({
      where: {
        clientIdTest:clientId
      },
      include: {
        service: true,  
        user: true,    
        client: true,   
      },
    });

    if (!reservations || reservations.length === 0) {
      return NextResponse.json({ message: 'Aucune réservation trouvée pour ce client.' }, { status: 404 });
    }
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return NextResponse.json({ message: 'Erreur lors de la récupération des réservations.' }, { status: 500 });
  }
}
