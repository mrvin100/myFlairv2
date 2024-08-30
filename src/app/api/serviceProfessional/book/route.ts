import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { date, address, city, postalCode, addressComplement, note, serviceId, userId, time } = body;
      console.log(body);

      // Assurez-vous que tous les champs nécessaires sont présents
      if (!date || !time || !serviceId || !userId) {
        return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
      }

      // Formater la date
      const datePart = date.split('T')[0]; // Extrait 'YYYY-MM-DD'
      const timePart = time; // Assure que le format est 'HH:MM'

      // Combinez la date et l'heure dans le format requis
      const dateOfRdv = `${datePart}T${timePart}:00`;

      // Créez la réservation avec la date complète
      const reservation = await prisma.reservationServicePro.create({
        data: {
          date,
          time,
          address,
          city,
          postalCode,
          addressComplement,
          note,
          serviceId,
          userId,
          dateOfRdv, 
        },
      });

      return NextResponse.json(reservation, { status: 201 });
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: `Méthode ${req.method} non autorisée` }, { status: 405 });
  }
}

export const runtime = 'experimental-edge';
