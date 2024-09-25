import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const categories = await prisma.category.findMany();
                return NextResponse.json(categories, { status: 200 });
            } catch (error) {
                console.error('Erreur lors de la récupération des catégories:', error);
                return NextResponse.json({ message: 'Erreur lors de la récupération des catégories.' }, { status: 500 });
            }
    }
}