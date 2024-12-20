import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url);
      const idPro = url.pathname.split('/').pop();
      if (!idPro) {
        return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
      }

      const user = await prisma.service.findMany({
        where: { userId: idPro },

      });

      if (!user) {
        return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
      }

      return NextResponse.json(user);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération des services' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Méthode non autorisée' }, { status: 405 });
  }
}
