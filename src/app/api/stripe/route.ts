import { NextResponse } from 'next/server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Aucun article dans le panier' }, { status: 400 });
    }

    console.log('Items reçus :', items);

    const redirectURL =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://stripe-checkout-next-js-demo.vercel.app';

    const transformedItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: transformedItems,
      mode: 'payment',
      success_url: `${redirectURL}/success`,
      cancel_url: `${redirectURL}/cancel`,
    });

    console.log('ID de session Stripe créé :', session.id);

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}