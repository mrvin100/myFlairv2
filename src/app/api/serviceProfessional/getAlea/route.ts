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

      const ratedServices = services
        .filter(service => (service.user?.numberOfRate ?? 0) > 0)
        .sort((a, b) => (b.user?.mark ?? 0) - (a.user?.mark ?? 0));

      let topServices = ratedServices.slice(0, 3);
      if (topServices.length < 3) {
        const remainingCount = 3 - topServices.length;

        const remainingServices = services
          .filter(service => !topServices.includes(service))
          .sort((a, b) => a.title.localeCompare(b.title))
          .slice(0, remainingCount);

        topServices = [...topServices, ...remainingServices];
      }

      return NextResponse.json(topServices);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching services' });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' });
  }
}
