import { NextRequest, NextResponse } from 'next/server';
import { htmlToText } from 'html-to-text';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, price, description, dureeRDV, domicile, userId } = body;
    console.log('Données reçues:', body);

    const descriptionWithoutHtml = htmlToText(description);

    const servicePro = await prisma.service.create({
      data: {
        title,
        description: descriptionWithoutHtml,
        price: price.toString(), 
        category,
        dureeRDV: dureeRDV.toString(), 
        domicile,
        userId
      },
    });

    console.log('Service créée:', servicePro);

    return NextResponse.json(servicePro, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la création du service:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du service.' }, { status: 500 });
  }
}

export const runtime = 'experimental-edge';
