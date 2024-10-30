// File: /api/stripe/stripeAbonnement.ts
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { id } = await req.json();
    const subscription = await prisma.abonnement.findUnique({
      where: { id: parseInt(id) },
    });
    console.log(id)
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' });
    }

    const period: 'month' | 'year' = subscription.period as 'month' | 'year';
    const redirectURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://stripe-checkout-next-js-demo.vercel.app';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: subscription.title },
            unit_amount: subscription.price * 100,
            recurring: { interval: period },
          },
          quantity: 1,
        },
      ],
      success_url: `${redirectURL}/success/abonnement/{CHECKOUT_SESSION_ID}/${subscription.id}`,
      cancel_url: `${redirectURL}/cancel`,
    });

    return NextResponse.json({ id: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' });
  }
}


