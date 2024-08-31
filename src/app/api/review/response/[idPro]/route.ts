// pages/api/reviews/[professionalId].js

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req:NextRequest) {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const professionalId = segments[segments.length - 1];

  try {
    const reviews = await prisma.review.findMany({
      where: { professionalId },
      include: {
        author: true,
        responses: true,
      },
    });

    return NextResponse.json(reviews, {status:200});
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, {status:500});
  }
}
