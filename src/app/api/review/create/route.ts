import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, professionalId, rating, comment } = body; 

    if (typeof userId !== 'string' || 
        typeof professionalId !== 'string' ||
        typeof rating !== 'number' || 
        (comment !== undefined && typeof comment !== 'string')) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        professionalId,
        rating,
        comment,
        archived:false,
        status: 'await',
      },
    });

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Error creating review' }, { status: 500 });
  }
}
