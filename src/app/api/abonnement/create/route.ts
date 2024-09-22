import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';


export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { title, price, nbrEssaisGratuit, period, functions } = data;

        if (!title || isNaN(Number(price)) || isNaN(Number(nbrEssaisGratuit)) || !period || !Array.isArray(functions)) {
            return NextResponse.json({ error: 'Des informations sont manquantes ou incorrectes' }, { status: 400 });
        }

        const numericPrice = Number(price);
        const numericNbrEssaisGratuit = Number(nbrEssaisGratuit);

        // Create a Stripe product
        const product = await stripe.products.create({
            name: title,
            description: `Abonnement ${period} avec ${numericNbrEssaisGratuit} essai(s) gratuit(s)`,
        });

        // Define the price based on the period
        let interval: Stripe.PriceCreateParams.Recurring.Interval = 'month'; // Default interval

        if (period === 'day') {
            interval = 'day';
        } else if (period === 'week') {
            interval = 'week';
        } else if (period === 'year') {
            interval = 'year';
        }

        // If it's a yearly subscription, charge 12 times the price at the beginning
        const unitAmount = period === 'year' ? numericPrice * 12 : numericPrice;

        // Create a price for the product
        const priceData = await stripe.prices.create({
            unit_amount: unitAmount * 100, // Stripe requires amounts in cents
            currency: 'eur',
            recurring: {
                interval: interval,
            },
            product: product.id,
            trial_period_days: numericNbrEssaisGratuit * (period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365),
        });
        const newAbonnement = await prisma.abonnement.create({
            data: {
                title,
                price: numericPrice,
                nbrEssaisGratuit: numericNbrEssaisGratuit,
                period,
                functions,
                stripeProductId: product.id, 
                stripePriceId: priceData.id,  
            },
        });

        return NextResponse.json(newAbonnement, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la création de l\'abonnement avec Stripe:', error);
        return NextResponse.json({ error: 'Erreur lors de la création de l\'abonnement' }, { status: 500 });
    }
}
