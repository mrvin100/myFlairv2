// pages/api/subscriptions/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET() {
  try {
    const subscriptions = await prisma.user.findMany({

    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des abonnements' }, { status: 500 });
  }
}
