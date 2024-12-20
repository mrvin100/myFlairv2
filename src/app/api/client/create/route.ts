import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    nom,
    prenom,
    email,
    telephone,
    adresse,
    ville,
    codePostal,
    complement,
    remarque,
    image,
    proId, 
  } = await req.json(); 

  console.log(proId, "fetchProId")
  try {
    const clientUser = await prisma.user.create({
        data: {
          firstName: nom,
          lastName: prenom,
          email,
          phone: telephone,
          address: {
            street: adresse,
            city: ville,
            postalCode: codePostal,
            complement,
          },
          role: 'PERSONAL', 
          username: email, 
          image,
         
        },
      });
    const newClient = await prisma.client.create({
      data: {
        proId, 
        clientId: clientUser.id, 
        userId: clientUser.id,
        status: "boutique", 
      },
    });

    return NextResponse.json(newClient);
  } catch (error) {
    console.error("Erreur lors de l'ajout du client:", error);
    return NextResponse.json({ error: "Erreur lors de l'ajout du client" });
  }
}
