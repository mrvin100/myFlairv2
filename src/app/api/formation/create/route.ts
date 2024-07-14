import { NextRequest, NextResponse } from 'next/server';
import { htmlToText } from 'html-to-text';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, alt, title, description, price, type, sales, quantity, deposit } = body;

    console.log('Données reçues:', body);

    const descriptionWithoutHtml = htmlToText(description);

    const formation = await prisma.formation.create({
      data: {
        image,
        alt,
        title,
        description: descriptionWithoutHtml,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        deposit: parseFloat(deposit),
      },
    });

    console.log('Formation créée:', formation);

    return NextResponse.json(formation, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la création de la formation:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la formation.' }, { status: 500 });
  }
}

export const runtime = 'experimental-edge';
