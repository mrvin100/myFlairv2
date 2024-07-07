import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const allClients = await prisma.user.findMany();
        return NextResponse.json(allClients);
    } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        return NextResponse.json({ error: '500' });
    }
}