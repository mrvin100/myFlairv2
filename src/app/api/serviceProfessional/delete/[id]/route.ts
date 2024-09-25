import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, res: NextResponse) {
    if (req.method === 'DELETE') {
        const url = new URL(req.url);
        const segments = url.pathname.split('/');
        const id = segments[segments.length - 1];

        if (!id) {
            return NextResponse.json({ error: 'ID de publication manquant' }, { status: 401 });
        }

        try {
            await prisma.service.delete({
                where: {
                    id: String(id),
                },
            });
            return NextResponse.json({ message: 'Publication supprimée avec succès' }, { status: 200 });
        } catch (error) {
            console.error('Erreur lors de la suppression de la publication :', error);
            return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Méthode non autorisée' }, { status: 405 });
    }
}