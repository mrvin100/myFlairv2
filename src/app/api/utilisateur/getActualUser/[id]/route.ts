import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: NextResponse) {
    if (req.method === 'GET') {
        try {
            const url = new URL(req.url);
            const segments = url.pathname.split('/');
            const userId = segments[segments.length - 1];
            if (!userId) {
                return NextResponse.json({ error: 'Unauthorized' });
            }
            const users = await prisma.user.findUnique({
                where: {
                    id: userId
                },
            });
            console.log(users)
            return NextResponse.json(users);
        } catch (error) {
            return NextResponse.json({ error: 'Error fetching User' });
        }
    } else {
        return NextResponse.json({ error: 'Method not allowed' });
    }
}