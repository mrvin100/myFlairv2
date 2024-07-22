import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const postData = await req.json();
    const { 
      title, 
      description, 
      weekPrice, 
      saturdayPrice, 
      stock, 
      image, 
      durationWeekStartHour, 
      durationWeekStartMinute, 
      durationWeekEndHour, 
      durationWeekEndMinute, 
      durationSaturdayStartHour, 
      durationSaturdayStartMinute, 
      durationSaturdayEndHour, 
      durationSaturdayEndMinute, 
      valide
    } = postData;


    const createdRoom = await prisma.room.create({
      data: {
        name: title,
        stock,
        post: { connect: { id: createdPost.id } }
      },
    });

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
        valide,
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
        product: { connect: { stripeId: weekProduct.id } } 
      },
      include: {
        room: true
      }
    });
    return NextResponse.json({ 
      weekProduct, 
      weekPrice: weekPriceObj, 
      message: 'Post et salle créés avec succès',
      postData: createdPost 
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du post et de la salle:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du post et de la salle' }, { status: 500 });
  }
}
