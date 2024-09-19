import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch all users and all available fields
    const users = await prisma.user.findMany({
      select: {
        id: true,
        stripeCustomerId: true,
        image: true,
        gallery: true,
        role: true,
        username: true,
        firstName: true,
        lastName: true,
        address: true,
        billingAddress: true,
        enterprise: true,
        homeServiceOnly: true,
        email: true,
        password: true,
        forgotPassword: true,
        phone: true,
        website: true,
        nameOfSociety: true,
        services: true,
        orders: true,
        reviewsWritten: true,
        reviewsReceived: true,
        cart: true,
        preferences: true,
        preferencesProWeek: true,
        mark: true,
        numberOfRate: true,
        socialMedia: true,
        biography: true,
        subscription: true,
        createdAt: true,
        updatedAt: true,
        reservations: true,
        clients: true,
        clientUsers: true,
      },
    });

    // Return the users as JSON
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Error fetching users', { status: 500 });
  }
}
