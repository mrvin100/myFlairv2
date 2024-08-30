import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, rating, comment } = body;

    // Validation des données
    if (typeof userId !== 'string' || typeof rating !== 'number' || typeof comment !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Création de la review
    const review = await prisma.review.create({
      data: {
        userId,
        rating,
        comment,
      },
    });

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Error creating review' }, { status: 500 });
  }
}
