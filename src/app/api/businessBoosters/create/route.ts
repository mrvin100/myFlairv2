import { NextRequest, NextResponse } from 'next/server';
import { htmlToText } from 'html-to-text';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
   
    const body = await req.json();
    const { image, alt, title, description, price, quantity, dates } = body;

    if (!image || !title || !description || !price || !quantity || !dates) {
      return NextResponse.json({ error: 'Tous les champs doivent être fournis.' }, { status: 400 });
    }
    const descriptionWithoutHtml = htmlToText(description);
    const formattedDates = typeof dates === 'string' ? JSON.parse(dates) : dates;

    
    const stripeProduct = await stripe.products.create({
      name: title,
      description: descriptionWithoutHtml,  
      images: [image],
    });

    const priceObj = await stripe.prices.create({
      unit_amount: parseInt(price) * 100, 
      currency: 'eur',
      product: stripeProduct.id,
    });

    const createdProduct = await prisma.product.create({
      data: {
        stripeId: stripeProduct.id,
        prodType: 'BUSINESS_BOOSTER',
      },
    });

    const businessBooster = await prisma.businessBooster.create({
      data: {
        image,
        alt,
        title,
        description: descriptionWithoutHtml,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        dates: formattedDates,
        idStripe: createdProduct.stripeId,
      },
    });

    return NextResponse.json({
      stripeProduct,
      price: priceObj,
      businessBooster,
    })

  } catch (error: any) {
    console.error('Erreur lors de la création du Business Booster:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la création du Business Booster.', 
      details: error.message 
    }, { status: 500 });
  }
}
