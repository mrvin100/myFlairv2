import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';



export async function PUT(req: NextRequest, { params }: { params: { workPlaceId: string } }) {
  try {
    const body = await req.json();

    const {
      id,
      title,
      description,
      image,
      durationWeekStartHour,
      durationWeekStartMinute,
      durationWeekEndHour,
      durationWeekEndMinute,
      durationSaturdayStartHour,
      durationSaturdayStartMinute,
      durationSaturdayEndHour,
      durationSaturdayEndMinute,
      weekPrice,
      saturdayPrice,
      stock,
      valide,
      alt
    } = body;

    const updatedWorkPlace = await prisma.post.update({
      where: { id: id },
      data: {
        id,
        title,
        description,
        image,
        durationWeekStartHour,
        durationWeekStartMinute,
        durationWeekEndHour,
        durationWeekEndMinute,
        durationSaturdayStartHour,
        durationSaturdayStartMinute,
        durationSaturdayEndHour,
        durationSaturdayEndMinute,
        weekPrice,
        saturdayPrice,
        stock,
        valide,
        alt,
      },
    });

    return NextResponse.json(updatedWorkPlace);
  } catch (error) {
    console.error('Error updating workplace:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du poste de travail' }, { status: 500 });
  }
}
