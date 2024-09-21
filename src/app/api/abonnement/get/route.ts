import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const abonnements = await prisma.abonnement.findMany();
        return NextResponse.json(abonnements);
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la récupération des abonnements' }, { status: 500})
        }
    }
