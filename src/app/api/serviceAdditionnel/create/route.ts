import { NextRequest, NextResponse } from 'next/server';
import { htmlToText } from 'html-to-text';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { log } from 'console';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, type, alt, price, quantity, image } = body;

    let additionalService;
    let priceObj;
    additionalService = await stripe.products.create({
      name: `${title} - Service Additionnel`,
      description: description,
      images: [image],
    });
    console.log(type)
    if (type === 'day') {
      priceObj = await stripe.prices.create({
        unit_amount: parseInt(price) * 100,
        currency: 'eur',
        recurring: { 
          interval: 'day'
        },
        product: additionalService.id,
      });
    } else {
      priceObj = await stripe.prices.create({
        unit_amount: parseInt(price) * 100,
        currency: 'eur',
        product: additionalService.id,
      });
    }

    const createdProduct = await prisma.product.create({
      data: {
        stripeId: additionalService.id,
        prodType: 'ADDITIONAL_SERVICE',
      },
    });

    const descriptionWithoutHtml = htmlToText(description);

    const service = await prisma.additionalService.create({
      data: {
        image,
        alt,
        title,
        description: descriptionWithoutHtml,
        price: parseInt(price, 10),
        quantity: parseInt(quantity, 10),
        type,
        idStripe: createdProduct.stripeId,
      },
    });
    return NextResponse.json({
      additionalService,
      price: priceObj,
      service,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Error creating service.', details: error.message }, { status: 500 });
  }
}
