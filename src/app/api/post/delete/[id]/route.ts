import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Instanciation de Prisma
const prisma = new PrismaClient();

// Fonction pour supprimer un workplace
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  // Vérifiez si l'ID est présent
  if (!id) {
    return NextResponse.json({ message: "L'ID est manquant" }, { status: 400 });
  }

  try {
    // Suppression du workplace par ID
    const deletedWorkplace = await prisma.post.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Poste de travail supprimé", deletedWorkplace });
  } catch (error) {
    console.error("Erreur lors de la suppression du poste de travail :", error);
    return NextResponse.json({ message: "Erreur lors de la suppression du poste de travail" }, { status: 500 });
  }
}
