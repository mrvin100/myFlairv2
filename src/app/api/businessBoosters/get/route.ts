import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  try {
    if (id) {
      const businessBooster = await prisma.businessBooster.findUnique({
        where: { id },
      });
      if (!businessBooster) {
        return NextResponse.json({ error: 'Business Booster not found' }, { status: 404 });
      }
      return NextResponse.json(businessBooster, { status: 200 });
    } else {
      const businessBoosters = await prisma.businessBooster.findMany();
      return NextResponse.json(businessBoosters, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching Business Boosters:', error);
    return NextResponse.json({ error: 'An error occurred while fetching Business Boosters' }, { status: 500 });
  }
}

export const runtime = 'experimental-edge';

