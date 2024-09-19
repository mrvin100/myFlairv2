import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const { title, price, nbrEssaisGratuit, period, functions } = data;

        if (!title || isNaN(Number(price)) || isNaN(Number(nbrEssaisGratuit)) || !period || !Array.isArray(functions)) {
            return NextResponse.json({ error: 'Des informations sont manquantes ou incorrectes' }, { status: 400 });
        }

        const numericPrice = Number(price);
        const numericNbrEssaisGratuit = Number(nbrEssaisGratuit);

        const newAbonnement = await prisma.abonnement.create({
            data: {
                title,
                price: numericPrice,
                nbrEssaisGratuit: numericNbrEssaisGratuit,
                period,
                functions,
            },
        });

        return NextResponse.json(newAbonnement, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la création de l\'abonnement :', error);
        return NextResponse.json({ error: 'Erreur lors de la création de l\'abonnement' }, { status: 500 });
    }
}
