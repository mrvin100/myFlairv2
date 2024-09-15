// pages/api/review/response/create.js

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export  async function POST(req:NextRequest, res:NextResponse) {
  if (req.method === 'POST') {
    const body = await req.json();
    const { reviewId, response, userId } = body;

    try {
      const newResponse = await prisma.reviewResponse.create({
        data: {
          reviewId,
          response,
          userId,
        },
      });

      return NextResponse.json(newResponse, {status:200});
    } catch (error) {
      console.error('Error creating response:', error);
      return NextResponse.json({ error: 'Failed to create response' }, {status:405});
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, {status:500});
  }
}
