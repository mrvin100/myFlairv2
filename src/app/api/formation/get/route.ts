import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const formations = await prisma.formation.findMany();
    if (formations.length === 0) {
      return NextResponse.json({ message: 'No formations found' }, { status: 404 });
    }
    return NextResponse.json(formations, { status: 200 });
  } catch (error) {
    console.error('Error fetching formations:', error);
    return NextResponse.json({ error: 'An error occurred while fetching formations' }, { status: 500 });
  }
}

export const runtime = 'experimental-edge';
