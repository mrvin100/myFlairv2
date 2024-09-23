import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest, res:NextResponse) {
    try {
        const data = await request.json();
        const { title, price, nbrEssaisGratuit, period, functions } = data;


        if (!title || isNaN(Number(price)) || isNaN(Number(nbrEssaisGratuit)) || !period || !Array.isArray(functions)) {
            return NextResponse.json({ error: 'Des informations sont manquantes ou incorrectes' }, { status: 400 });
        }

        const numericPrice = Math.abs(Number(price));
        const numericNbrEssaisGratuit = Math.abs(Number(nbrEssaisGratuit));


        const product = await stripe.products.create({
            name: title,
            description: `Abonnement ${period} avec ${numericNbrEssaisGratuit} essai(s) gratuit(s)`,
        });
        const intervalMap = {
            day: 'day',
            week: 'week',
            month: 'month',
            year: 'year',
        };

        const interval = intervalMap[period] || 'month';
        const unitAmount = period === 'year' ? numericPrice * 12 : numericPrice;
        const priceData = await stripe.prices.create({
            unit_amount: unitAmount * 100,
            currency: 'eur',
            recurring: {
                interval,
            },
            product: product.id,
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
