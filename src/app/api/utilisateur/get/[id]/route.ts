import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: NextResponse) {
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url);
      const segments = url.pathname.split('/');
      const userId = segments[segments.length - 1];
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' });
      }
      const users = await prisma.client.findUnique({
        where: {
            id: userId
        },
        include: {
          user: true
        },
      });
      console.log(users)
      return NextResponse.json(users);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching services' });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' });
  }
}