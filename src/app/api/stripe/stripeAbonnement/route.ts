// pages/api/stripeAbonnement.ts
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { getSession } from 'next-auth/react';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const subscriptionId: number = req.body.id;

    const subscription = await prisma.abonnement.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return res.status(404).send('User or Subscription not found');
    }

    // Ensure that the period is of the correct type
    const period: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring.Interval = subscription.period as 'month' | 'year';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: subscription.title,
            },
            unit_amount: subscription.price * 100, // Stripe expects the amount in cents
            recurring: {
              interval: period,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ id: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json('Internal Server Error');
  }
}
