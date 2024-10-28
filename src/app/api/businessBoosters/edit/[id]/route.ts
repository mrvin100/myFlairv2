import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { businessBoosterId: string } }) {
  try {
    const body = await req.json();

    const {
      id,
      title,
      description,
      image,
      quantity,
      price,
      alt,
      dates 
    } = body;

    const updatedBusinessBooster = await prisma.businessBooster.update({
      where: { id: id },
      data: {
        title,
        description,
        image,
        quantity,
        price,
        alt,
        dates, 
        updatedAt: new Date()
      },
    });

    return NextResponse.json(updatedBusinessBooster);
  } catch (error) {
    console.error('Error updating business booster:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du Business Booster' }, { status: 500 });
  }
}
