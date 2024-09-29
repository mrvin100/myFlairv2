import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; 

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const data = await req.json();

        const updatedService = await prisma.service.update({
            where: { id },
            data: {
                title: data.title,
                price: data.price,
                category: data.category,
                domicile: data.domicile,
                dureeRDV: data.dureeRDV,
                valueDureeRDV: data.valueDureeRDV,
                description: data.description,
            },
        });

        return NextResponse.json(updatedService);
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}
