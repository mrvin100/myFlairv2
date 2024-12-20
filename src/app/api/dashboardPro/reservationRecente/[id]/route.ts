import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const userId = segments[segments.length - 1];

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
  }

  try {
    const reservations = await prisma.reservationServicePro.findMany({
      where: { userId, hiddenForPro: false,},
      include: {
        service: true,
        client: {
          include: {
            clientUser:true
          }
        }
      },
      orderBy: {
        dateOfRdv: 'desc',
      },
      take: 3,
    });

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
