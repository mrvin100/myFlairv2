import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET(request: Request) {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    return new NextResponse('Erreur lors de la récupération des catégories', { status: 500 });
  }
}
