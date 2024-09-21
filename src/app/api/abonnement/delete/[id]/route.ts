import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
        return NextResponse.json({ error: 'ID non fourni' }, { status: 400 });
    }

    const idForPrisma = parseInt(id);

    try {
        await prisma.abonnement.delete({
            where: { id: idForPrisma },
        });

        return NextResponse.json({ message: 'Abonnement supprimé avec succès' });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur lors de la suppression de l\'abonnement' }, { status: 500 });
    }
}
