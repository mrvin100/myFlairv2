import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(req: NextRequest, res: NextResponse) {
  if (req.method === 'DELETE') {
    try {
        const url = new URL(req.url);
        const segments = url.pathname.split('/');
        const clientId = segments[segments.length - 1];

      
      await prisma.client.delete({
        where: { id: String(clientId) },
      });

      return NextResponse.json({ message: 'Client supprimé avec succès.' });
    } catch (error) {
        return NextResponse.json({ message: 'Erreur lors de la suppression du client.', error });
    }
  } else {
    return NextResponse.json(`Méthode ${req.method} non autorisée.`);
  }
}