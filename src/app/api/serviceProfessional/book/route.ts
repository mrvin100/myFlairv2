import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      console.log(body);
      const { date, address, city, postalCode, addressComplement, note, serviceId, userId, clientId, time } = body;

      if (!date || !time || !serviceId || !userId || !clientId) {
        return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
      }

      const datePart = date.split('T')[0];
      const timePart = time;
      const dateOfRdv = `${datePart}T${timePart}:00`;

      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: { user: true },
      });

      if (!service || !service.user) {
        return NextResponse.json({ error: 'Service ou professionnel non trouvé' }, { status: 404 });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
      }

      let existingClient = await prisma.client.findFirst({
        where: {
          clientId,
          proId: service.user.id,
        },
      });

      if (!existingClient) {
        existingClient = await prisma.client.create({
          data: {
            proId: service.user.id,
            status: "flair",
            user: {
              connect: { id: userId },
            },
            clientUser: {
              connect: { id: clientId },
            },
          },
        });
        
      }

      const currentDate = new Date();
      const reservationDate = new Date(dateOfRdv);
      let status = "en-cours"; 
      if (reservationDate < currentDate) {
        status = "termine";
      } else if (status === "annule") {
        status = "annule";
      }

      const reservation = await prisma.reservationServicePro.create({
        data: {
          date: new Date(date).toISOString(),
          time,
          address,
          city,
          postalCode,
          addressComplement,
          note,
          service: {
            connect: { id: serviceId },
          },
          user: {
            connect: { id: userId },
          },
          client: {
            connect: { id: existingClient.id },
          },
          dateOfRdv: new Date(dateOfRdv).toISOString(),
          status,
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
