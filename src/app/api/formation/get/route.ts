import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  try {
    if (id) {
      const formation = await prisma.formation.findUnique({
        where: { id },
      });
      if (!formation) {
        return NextResponse.json({ error: 'Formation not found' }, { status: 404 });
      }
      return NextResponse.json(formation, { status: 200 });
    } else {
      const formations = await prisma.formation.findMany();
      return NextResponse.json(formations, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching formations:', error);
    return NextResponse.json({ error: 'An error occurred while fetching formations' }, { status: 500 });
  }
}

export const runtime = 'experimental-edge';
