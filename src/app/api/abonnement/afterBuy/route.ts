import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
import dayjs from 'dayjs'; 

export async function POST(req: NextRequest) {
  const { userId, subscriptionId } = await req.json(); 

  try {
    const purchaseDate = new Date();
    const nextBillingDate = dayjs(purchaseDate).add(1, 'month').toDate(); 

    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: subscriptionId, 
        purchaseDate: purchaseDate,
        nextBillingDate: nextBillingDate,
        subscriptionStatus: "inWork",
      },
    });

    return NextResponse.json({ message: 'Abonnement mis à jour avec succès', user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'abonnement :", error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de l\'abonnement' }, { status: 500 });
  }
}
