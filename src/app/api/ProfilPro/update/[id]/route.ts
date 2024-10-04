import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest)  {
  const method = req.method;

  switch (method) {
    case "PUT": 
      const body = await req.json();
      const url = new URL(req.url);
      const segments = url.pathname.split('/');
      const id = segments[segments.length - 1];

      try {
        const updatedUser = await prisma.user.update({
          where: { id: String(id) },
          data: {
            ...body,
          },
        });
        return NextResponse.json(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
      }

    default:
      return NextResponse.json({ error: `Method ${method} Not Allowed` }, { status: 405 });
  }
};


