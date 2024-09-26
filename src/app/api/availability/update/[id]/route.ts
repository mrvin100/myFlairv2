import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
    if (req.method === "PUT") {
        try {
            const body = await req.json();
            const { availabilities, availabilitiesPeriods } = body;
            const url = new URL(req.url);
            const segments = url.pathname.split('/');
            const userId = segments[segments.length - 1];
            const updatedUser = await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    preferencesProWeek: {
                        upsert: {

                            create: {
                                availabilities: availabilities,
                                availabilitiesPeriods: availabilitiesPeriods,
                            },
                            update: {
                                availabilities: availabilities,
                                availabilitiesPeriods: availabilitiesPeriods,
                            },
                        },
                    },
                },
            });

            return NextResponse.json({ message: "Disponibilités mises à jour", updatedUser }, { status: 200 });
        } catch (error) {
            console.error("Erreur lors de la mise à jour des disponibilités:", error);
            return NextResponse.json({ message: "Erreur lors de la mise à jour" }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Méthode non autorisée" }, { status: 405 });
    }
}
