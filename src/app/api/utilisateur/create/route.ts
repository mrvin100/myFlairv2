import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      
      // Création du nouveau client
      const newClient = await prisma.user.create({
        data: {
          lastName: body.lastName,
          firstName: body.firstName,
          username: body.email,
          nameOfSociety: body.nameOfSociety,
          image: body.image,
          address: {
            street: body.address.street,
            city: body.address.city,
            postalCode: body.address.postalCode,
            country: body.address.country,
          },
          phone: body.phone,
          email: body.email,
          password: body.password,
          role: body.role,
          homeServiceOnly: body.homeServiceOnly,
          billingAddress: body.billingAddress ? {
            street: body.billingAddress.street,
            city: body.billingAddress.city,
            postalCode: body.billingAddress.postalCode,
            country: body.billingAddress.country,
          } : undefined,
        },
      });

      // Réponse en cas de succès
      return NextResponse.json(newClient, { status: 200 });

    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du client:', error);

      // Vérification de l'erreur Prisma P2002 (Unique constraint failed)
      if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
        return NextResponse.json({
          error: 'Un utilisateur avec ce nom d\'utilisateur (email) existe déjà.'
        }, { status: 400 });
      }

      // Réponse générique pour autres erreurs
      return NextResponse.json({ 
        error: 'Erreur serveur lors de l\'ajout du client.' 
      }, { status: 500 });
    }
  } else {
    return NextResponse.json({ 
      error: `Méthode ${req.method} non autorisée.` 
    }, { status: 405 });
  }
}
