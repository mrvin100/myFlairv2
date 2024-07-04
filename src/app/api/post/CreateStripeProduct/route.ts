// pages/api/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { title, weekPrice } = await req.body;

      const product = await stripe.products.create({
        name: title,
      });
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: weekPrice,
        currency: 'eur',
      });

      res.status(200).json({ product, price }); // Retourner une réponse avec succès
    } catch (error: any) {
      res.status(500).json({ error: error.message }); // Gérer les erreurs avec un statut 500
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`); // Gérer les méthodes non autorisées
  }
}

