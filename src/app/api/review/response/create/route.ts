import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import notifier from 'node-notifier';

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    const body = await req.json();
    const { reviewId, response, userId } = body;

    try {
      const newResponse = await prisma.reviewResponse.create({
        data: {
          reviewId,
          response,
        },
        include: {
          review: {
            include: {
              author: true, 
              professional: true, 
            },
          },
        },
      });
      const review = newResponse.review;
      const isProResponding = review.professionalId === userId; 
      const recipient = isProResponding ? review.author : review.professional;

      await prisma.notification.create({
        data: {
          title: `Nouvelle réponse à votre ${isProResponding ? 'avis' : 'réponse'}!`,
          userId: recipient.id,
        },
      });
      notifier.notify({
        title: 'Nouvelle réponse',
        message: `Vous avez une nouvelle réponse sur votre ${!isProResponding ? 'avis' : 'réponse'}`,
      });

      return NextResponse.json(newResponse, { status: 200 });
    } catch (error) {
      console.error('Error creating response:', error);
      return NextResponse.json({ error: 'Failed to create response' }, { status: 405 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 500 });
  }
}
