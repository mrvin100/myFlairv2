import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const url = req.url;
  const segments = url.split('/');

  // Récupère le dernier et avant-dernier éléments
  const subscriptionId = segments[segments.length - 1];
  const userId = segments[segments.length - 2];

  const purchaseDate = new Date(); 
  let nextBillingDate: Date;
  const subscriptionStatus = 'active';

  try {
    const abonnement = await prisma.abonnement.findUnique({
      where: { id: Number(subscriptionId) },
      select: { period: true }
    });


    if (!abonnement) {
      return NextResponse.json({ error: "Abonnement non trouvé" }, { status: 404 });
    }
    if (abonnement.period === '') {
      nextBillingDate = dayjs(purchaseDate).add(1, 'month').toDate(); 
    } else if (abonnement.period === 'year') {
      nextBillingDate = dayjs(purchaseDate).add(1, 'year').toDate(); 
    } else {
      return NextResponse.json({ error: "Type d'abonnement non valide" }, { status: 400 });
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: abonnement.period, 
        purchaseDate,
        nextBillingDate, 
        subscriptionStatus, 
        updatedAt: new Date(), 
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des détails de l'abonnement:", error);
    return NextResponse.json({ error: "Échec de la mise à jour des détails de l'abonnement" }, { status: 500 });
  }
}
