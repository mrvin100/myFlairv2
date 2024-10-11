import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    await prisma.cart.update({
      where: {
        userId: userId,
      },
      data: {
        items: {
          deleteMany: {}, 
        },
      },
    });

    return NextResponse.json({ message: 'Cart emptied successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error emptying cart:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
