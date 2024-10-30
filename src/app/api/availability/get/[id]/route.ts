import { prisma } from '@/lib/prisma'; 
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
        const segments = url.pathname.split('/');
        const userId = segments[segments.length - 1];
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId as string },
        select: {
          preferencesProWeek: {
            select: {
              availabilities: true,
              availabilitiesPeriods: true,
            },
          },
        },
      });

     return NextResponse.json(user?.preferencesProWeek);
    } catch (error) {
      console.error('Erreur lors de la récupération des disponibilités', error);
      return NextResponse.json({ message: 'Erreur serveur' });
    }
  } else {
    return NextResponse.json(`Méthode ${req.method} non autorisée`);
  }
}