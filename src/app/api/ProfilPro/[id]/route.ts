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
      const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include:{ services: true}
      });
      console.log(user)
      return NextResponse.json(user);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching services' });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' });
  }
}