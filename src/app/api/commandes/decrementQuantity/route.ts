import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    const body = await req.json();
    const { cartItems } = body;

    try {
      for (const item of cartItems) {
        const product = await prisma.formation.findUnique({
          where: { id: item.id },
        });
        if (product && (product.prodType === 'ADDITIONAL_SERVICE' || product.prodType === 'FORMATION')) {
          await prisma.formation.updateMany({
            where: { id: item.id },
            data: { quantity: { decrement: item.quantity } },
          });
        }
      }

      return NextResponse.json({ message: 'Commande traitée avec succès' }, { status: 200 });
    } catch (error) {
      console.error("Erreur lors du traitement de la commande :", error);
      return NextResponse.json({ error: 'Erreur lors du traitement de la commande' }, { status: 500 });
    }
  } else {
    return NextResponse.json(`Method ${req.method} Not Allowed`, { status: 405 });
  }
}
