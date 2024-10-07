import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assurez-vous que vous importez correctement Prisma

export async function GET(request: Request) {
  try {
    // Récupérer toutes les catégories depuis la base de données avec Prisma
    const categories = await prisma.category.findMany();

    // Retourner les catégories en format JSON
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    return new NextResponse('Erreur lors de la récupération des catégories', { status: 500 });
  }
}
