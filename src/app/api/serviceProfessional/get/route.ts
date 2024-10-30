import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: NextResponse) {
  if (req.method === 'GET') {
    try {
      const services = await prisma.service.findMany({
        include: {
          user: true,
        },
      });
      return NextResponse.json(services);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching services' });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' });
  }
}