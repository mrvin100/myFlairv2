import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const url = req.url;
  const segments = url.split('/');

  // Récupère le dernier et avant-dernier éléments
  const subscriptionId = segments[segments.length - 1];
  const userId = segments[segments.length - 2];

  const purchaseDate = new Date(); // Date actuelle
  let nextBillingDate: Date;
  const subscriptionStatus = 'active'; // Statut par défaut

  try {
    // Étape 1: Recherche de l'abonnement pour obtenir son period
    const abonnement = await prisma.abonnement.findUnique({
      where: { id: Number(subscriptionId) }, // Assurez-vous que l'ID est de type numérique
      select: { period: true }, // Sélectionne uniquement le period de l'abonnement
    });

    // Vérifiez si l'abonnement existe
    if (!abonnement) {
      return NextResponse.json({ error: "Abonnement non trouvé" }, { status: 404 });
    }
    if (abonnement.period === 'MONTH') {
      nextBillingDate = dayjs(purchaseDate).add(1, 'month').toDate(); // Ajoute un mois
    } else if (abonnement.period === 'YEAR') {
      nextBillingDate = dayjs(purchaseDate).add(1, 'year').toDate(); // Ajoute un an
    } else {
      return NextResponse.json({ error: "Type d'abonnement non valide" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: abonnement.period, // Mettez à jour avec le period récupéré
        purchaseDate, // Date d'achat
        nextBillingDate, // Date du prochain prélèvement
        subscriptionStatus, // Statut de l'abonnement
        updatedAt: new Date(), // Met à jour le champ updatedAt
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des détails de l'abonnement:", error);
    return NextResponse.json({ error: "Échec de la mise à jour des détails de l'abonnement" }, { status: 500 });
  }
}
