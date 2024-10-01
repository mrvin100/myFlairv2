// pages/api/stripeAbonnement.ts
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Stripe from 'stripe';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const session = await getSession({ req });
    const { subscriptionId } = req.body;

    if (!session) {
      return res.status(401).send('Unauthorized');
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email },
    });

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!user || !subscription) {
      return res.status(404).send('User or Subscription not found');
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: user.stripeCustomerId, 
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: subscription.title,
            },
            unit_amount: subscription.price * 100,
            recurring: {
              interval: subscription.period,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    res.status(200).json({ id: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Internal Server Error');
  }
}
