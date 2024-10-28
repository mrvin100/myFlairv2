import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "L'ID est manquant" }, { status: 400 });
  }

  try {
    const deletedWorkplace = await prisma.post.delete({
      where: { id: Number(id) }, 
    });

    return NextResponse.json({ message: "Poste de travail supprimé", deletedWorkplace });
  } catch (error) {
    console.error("Erreur lors de la suppression du poste de travail :", error);
    return NextResponse.json({ message: "Erreur lors de la suppression du poste de travail" }, { status: 500 });
  }
}
