import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID not provided' }, { status: 400 });
  }

  try {
    await prisma.formation.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Formation deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting formation:', error);
    return NextResponse.json({ error: 'An error occurred while deleting formation' }, { status: 500 });
  }
}

export const runtime = 'experimental-edge';
