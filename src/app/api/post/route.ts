import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const postData = await req.json();
    const { title, description, weekPrice, saturdayPrice, stock, image, durationWeekStartHour, durationWeekStartMinute, durationWeekEndHour, durationWeekEndMinute, durationSaturdayStartHour, durationSaturdayStartMinute, durationSaturdayEndHour, durationSaturdayEndMinute } = postData;

    const weekProduct = await stripe.products.create({
      name: `${title} - Week`,
      description: description,
      images: [image]
    });

    const weekPriceObj = await stripe.prices.create({
      unit_amount: parseInt(weekPrice) * 100,
      currency: 'eur',
      product: weekProduct.id,
    });

    const createdProduct = await prisma.product.create({
      data: {
        stripeId: weekProduct.id,
        prodType: 'POST'
      },
    });

    const createdPost = await prisma.post.create({
      data: {
        title,
        weekPrice,
        saturdayPrice,
        stock,
        valide: postData.valide,
        description,
        durationWeekStartHour,
        durationWeekStartMinute,
        durationWeekEndHour,
        durationWeekEndMinute,
        durationSaturdayStartHour,
        durationSaturdayStartMinute,
        durationSaturdayEndHour,
        durationSaturdayEndMinute,
        image,
        idStripe: createdProduct.stripeId,
      },
    });

    return NextResponse.json({ 
      weekProduct, 
      weekPrice: weekPriceObj, 
      message: 'Post créé avec succès',
      postData: createdPost 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création du post' }, { status: 500 });
  }
}
