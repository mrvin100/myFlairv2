import { NextResponse } from 'next/server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = body.item;

    // Correcting the ternary operator logic for redirectURL
    const redirectURL =
      process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:3001'
        : 'https://your-production-url.com';

    const transformedItems = [];
    for (let i = 0; i < items.length; i++) {
      const element = items[i];
      const transformedItem = {
        price_data: {
          currency: 'eur',
          product_data: {
            name: element.title,
          },
          unit_amount: element.price * 100, // Stripe expects the price in cents
        },
        quantity: element.quantity,
      };
      transformedItems.push(transformedItem);
    }

    console.log('Transformed Items:', transformedItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: transformedItems,
      mode: 'payment',
      success_url: `${redirectURL}/dashboard`,
      cancel_url: `${redirectURL}/cancel`,
    });

    console.log('Stripe session ID created:', session.id);

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
