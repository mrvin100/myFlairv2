import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const data = await request.json();

    // Validate the incoming data
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        enterprise: data.enterprise,
        biography: data.biography,
        email: data.email,
        phone: data.phone,
        homeServiceOnly: data.homeServiceOnly,
        gallery: data.gallery,
        socialMedia: data.socialMedia,
        address: {
            street: data.address.street,
            city: data.address.city,
            postalCode: data.address.postalCode,
            country: data.address.country,
            complementAddress: data.address.complementAddress,
          
        },
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}