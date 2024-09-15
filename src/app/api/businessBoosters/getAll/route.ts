import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const boosters = await prisma.businessBooster.findMany();
    return NextResponse.json(boosters);
  } catch (error) {
    console.error('Error fetching boosters:', error);
    return NextResponse.json({ error: 'Error fetching boosters' });
  }
}
