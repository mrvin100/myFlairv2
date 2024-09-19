import { NextResponse } from 'next/server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = body.item;

    // Log les items pour déboguer leur structure
    console.log('Items reçus :', items);

    const redirectURL =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://stripe-checkout-next-js-demo.vercel.app';

    const transformedItems = [];
    for (let i = 0; i < items.length; i++) {
      const element = items[i];
      const transformedItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: element.title,
          },
          unit_amount: element.price * 100, 
        },
        quantity: element.quantity,
      };
      transformedItems.push(transformedItem);
    }

    console.log('Items transformés :', transformedItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: transformedItems,
      mode: 'payment',
      success_url: 'dashboard',
      cancel_url: `${redirectURL}/cancel`,
    });

    // Log l'ID de la session
    console.log('ID de session Stripe créé :', session.id);

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
