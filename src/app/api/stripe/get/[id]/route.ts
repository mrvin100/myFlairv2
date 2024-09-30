import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Utilisation d'un export nommé pour la méthode GET
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const session_id = segments[segments.length - 1];
  console.log(session_id)

  try {
    const order = await prisma.order.findUnique({
      where: { sessionId: session_id },
      include: { cartItems: true },
    });

    if (!order) {
      return NextResponse.json({ message: 'Commande non trouvée' }, { status: 400 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la commande :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
