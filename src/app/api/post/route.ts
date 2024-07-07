import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const postData = await req.json();
    console.log('Données reçues:', postData);

    const { title, description, weekPrice, saturdayPrice,stock, image, durationWeekStartHour, durationWeekStartMinute, durationWeekEndHour, durationWeekEndMinute, durationSaturdayStartHour, durationSaturdayStartMinute, durationSaturdayEndHour, durationSaturdayEndMinute } = postData;

    try {
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

      const weekendProduct = await stripe.products.create({
        name: `${title} - Weekend`,
        description: description,
        images: [image],
      });

      const weekendPriceObj = await stripe.prices.create({
        unit_amount: parseInt(saturdayPrice) * 100,
        currency: 'eur',
        product: weekendProduct.id,
      });

      const createdProduct = await prisma.product.create({
        data: {
          stripeId: weekProduct.id,
          
        },
      });
      console.log('Product créé:', createdProduct);
      const idWeekStripe = weekProduct.id
      console.log(idWeekStripe)

      console.log('Stripe products and prices created successfully.');
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
          idStripe:idWeekStripe,
        },
      });

      console.log('Post créé:', createdPost);
      return NextResponse.json({ 
        weekProduct, 
        weekPrice: weekPriceObj, 
        weekendProduct, 
        weekendPrice: weekendPriceObj,
        message: 'Post créé avec succès',
        postData: createdPost 
      }, { status: 201 });
      
    } catch (error) {
      console.error('Erreur lors de la création des produits Stripe:', error);
      return NextResponse.json({ error: 'Erreur lors de la création des produits Stripe' }, { status: 500 });
    }
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du post' }, { status: 500 });
  }
}
