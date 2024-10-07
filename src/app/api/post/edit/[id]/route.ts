import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }) {
  const { workPlaceId } = params; 
  const body = await req.json();

  try {
    const updatedPost = await prisma.post.update({
      where: { id: Number(workPlaceId) }, 
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du poste' }, { status: 500 });
  }
}