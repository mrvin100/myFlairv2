import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Récupérer toutes les formations depuis la base de données
    const formations = await prisma.formation.findMany();

    // Vérifiez si aucune formation n'a été trouvée
    if (formations.length === 0) {
      return NextResponse.json({ message: 'No formations found' }, { status: 404 });
    }

    // Retourner les formations avec un statut 200 (OK)
    return NextResponse.json(formations, { status: 200 });
  } catch (error) {
    // En cas d'erreur, loguer l'erreur et retourner un message d'erreur
    console.error('Error fetching formations:', error);
    return NextResponse.json({ error: 'An error occurred while fetching formations' }, { status: 500 });
  }
}

export const runtime = 'experimental-edge';
