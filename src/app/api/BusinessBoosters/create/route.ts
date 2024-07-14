import { NextRequest, NextResponse } from 'next/server';
import { htmlToText } from 'html-to-text';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, alt, title, description, price, quantity, dates } = body;

    console.log('Données reçues:', body);

    const descriptionWithoutHtml = htmlToText(description);

    const businessBooster = await prisma.businessBooster.create({
      data: {
        image,
        alt,
        title,
        description: descriptionWithoutHtml,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        dates,
      },
    });

    console.log('Business Booster créé:', businessBooster);

    return NextResponse.json(businessBooster, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la création du Business Booster:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du Business Booster.' }, { status: 500 });
  }
}

export const runtime = 'experimental-edge';
