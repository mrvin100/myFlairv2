import { NextRequest, NextResponse } from 'next/server';
import { htmlToText } from 'html-to-text';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    // Récupération des données JSON du corps de la requête
    const body = await req.json();
    const { image, alt, title, description, price, quantity, dates } = body;

    // Validation des données d'entrée
    if (!image || !title || !description || !price || !quantity || !dates) {
      return NextResponse.json({ error: 'Tous les champs doivent être fournis.' }, { status: 400 });
    }

    // Conversion de la description HTML en texte brut
    const descriptionWithoutHtml = htmlToText(description);

    // Formatage des dates
    const formattedDates = typeof dates === 'string' ? JSON.parse(dates) : dates;

    // Création du produit Stripe
    const stripeProduct = await stripe.products.create({
      name: title,
      description: descriptionWithoutHtml,  // Utilisez la description sans HTML
      images: [image],
    });

    // Création du prix Stripe
    const priceObj = await stripe.prices.create({
      unit_amount: parseInt(price) * 100, 
      currency: 'eur',
      product: stripeProduct.id,
    });

    // Création du produit dans la base de données
    const createdProduct = await prisma.product.create({
      data: {
        stripeId: stripeProduct.id,
        prodType: 'BUSINESS_BOOSTER',
      },
    });

    // Création du Business Booster dans la base de données
    const businessBooster = await prisma.businessBooster.create({
      data: {
        image,
        alt,
        title,
        description: descriptionWithoutHtml,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        dates: formattedDates,
        idStripe: createdProduct.stripeId,
      },
    });

    // Retourner une réponse JSON formatée
    return NextResponse.json({
      stripeProduct,
      price: priceObj,
      businessBooster,
    })

  } catch (error: any) {
    console.error('Erreur lors de la création du Business Booster:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la création du Business Booster.', 
      details: error.message 
    }, { status: 500 });
  }
}
