import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { usePathname } from 'next/navigation';


export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const userId = segments[segments.length - 1];

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                stripeId: true,
                prodType: true,
                additionalService: {
                  select: {
                    title: true,
                    price: true,
                  },
                },
                formation: {
                  select: {
                    title: true,
                    price: true,
                  },
                },
                businessBooster: {
                  select: {
                    title: true,
                    price: true,
                  },
                },
              }
            },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' });
    }

    return NextResponse.json(cart.items);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export const runtime = 'experimental-edge';
