import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient().$extends(withAccelerate());

export async function DELETE(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const itemId = segments[segments.length - 1];


    if (req.method === 'DELETE') {
        try {
            await prisma.cartItem.delete({
                where: {
                    id: String(itemId),
                },
            });
            return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
}
