import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export  async function DELETE(req: NextRequest, res: NextResponse) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const id = segments[segments.length - 1];

  
      try {
        const deletedReservation = await prisma.reservationServicePro.delete({
          where: { id: String(id) },
        });
        return NextResponse.json(deletedReservation);
      } catch (error) {
        console.error("Error deleting reservation:", error);
        return NextResponse.json({ error: "Unable to delete reservation." });
      }
    
  }

