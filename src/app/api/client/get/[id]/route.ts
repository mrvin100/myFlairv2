import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const userId = segments[segments.length - 1];
  try {
    // Récupération des clients associés à un professionnel
    const clients = await prisma.client.findMany({
      where: { proId: userId },
      include: {
        clientUser: true, // Inclure les détails de l'utilisateur client
      },
    });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching clients' });
  }
}
