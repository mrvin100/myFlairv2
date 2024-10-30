import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(req: Request, res: NextResponse) {
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url);
      const segments = url.pathname.split('/');
      const serviceId = segments[segments.length - 1];
      if (!serviceId) {
        return NextResponse.json({ error: 'Unauthorized' });
      }

      const service = await prisma.service.findUnique({
        where: {
          id: serviceId,
        },
        include: {
          user: {
            include: {
              preferencesProWeek: true,
            },
          },
        },
      });

  return NextResponse.json(service);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching service data' });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' });
  }
}
