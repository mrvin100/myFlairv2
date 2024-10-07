import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    // Lire et loguer le corps de la requête
    const body = await req.json();
    console.log('Body reçu :', body);

    const items = body.item;
    const userId = body.userId;

    console.log('Body reçu :', body);

    // Vérifier si les articles sont valides
    if (!Array.isArray(items) || items.length === 0) {
      console.warn('Aucun article dans le panier pour l’utilisateur:', userId);
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
    console.log('Articles transformés :', transformedItems);

    // Créer une session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: transformedItems,
      mode: 'payment',
      success_url: `${redirectURL}/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirectURL}/cancel`,
    });

    console.log('ID de session Stripe créé :', session.id);

    const successUrl = `${redirectURL}/success/${session.id}`;

    // Enregistrer la commande dans la base de données
    const order = await prisma.order.create({
      data: {
        userId: userId,
        sessionId: session.id,
        cartItems: {
          create: items.map(item => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            cart: { connect: { id: item.cartId } },
            product: { connect: { stripeId: item.product.stripeId } },
          })),
        },
      },
    });

    console.log('Commande enregistrée avec succès:', order);
    return NextResponse.json({ id: session.id, successUrl });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe :', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
