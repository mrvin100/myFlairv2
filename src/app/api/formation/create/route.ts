// app/api/formation/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { htmlToText } from 'html-to-text';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, alt, title, description, price, quantity, deposit, type, dates } = body;
    const descriptionWithoutHtml = htmlToText(description);
    
    // Create the Stripe product
    const formationProduct = await stripe.products.create({
      name: title,
      description: description,
      images: [image],
    });

    // Create the Stripe price
    let priceObj;
    if (type === 'day') {
      priceObj = await stripe.prices.create({
        unit_amount: parseInt(price) * 100,
        currency: 'eur',
        recurring: { interval: 'day' },
        product: formationProduct.id,
      });
    } else {
      priceObj = await stripe.prices.create({
        unit_amount: parseInt(price) * 100,
        currency: 'eur',
        product: formationProduct.id,
      });
    }

    const createdProduct = await prisma.product.create({
      data: {
        stripeId: formationProduct.id,
        prodType: 'FORMATION',
      },
    });
    
    const formation = await prisma.formation.create({
      data: {
        image,
        alt,
        title,
        description: descriptionWithoutHtml,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        deposit: parseFloat(deposit),
        dates,
        idStripe: createdProduct.stripeId,
      },
    });

    return NextResponse.json({
      formationProduct,
      price: priceObj,
      formation,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Erreur lors de la création de la formation:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la formation.', details: error.message }, { status: 500 });
  }
}

export const runtime = 'experimental-edge';
