import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const userId = segments[segments.length - 1];

  try {
    const client = await prisma.client.findFirst({
      where: { clientId: userId },
      include: {
        clientUser: true,
      },
    });
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching client' });
  }
}
