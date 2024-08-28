"use client";

import { useUserContext } from "@/contexts/user";
import { signOut } from "next-auth/react";
import { TabsContent } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Circle, CircleDot, Dot } from "lucide-react";
import clsx from "clsx";
import Reservation from "./Reservation";

export default function OverviewTab() {
  const { user } = useUserContext();

  // declaration of variables to change after linked with backend

  const reservations = [
    { typeClient: "boutique", status: "en-cours" },
    { typeClient: "boutique", status: "annule" },
    { typeClient: "flair", status: "complete" },
  ];

  return (
    <TabsContent title="Tableau de bord" value="overview">
      <div className="max-w-5xl w-full">
        <div>
          Bonjour <b>{user?.firstName}</b> !<br />
          (vous n’êtes pas {user?.firstName} ? 
          <button
            onClick={() =>
              signOut({ redirect: true, callbackUrl: "/auth/sign-in" })
            }
          >
            <u>Déconnexion</u>
          </button>
          )<br />
          Bienvenue chez Flair !
          <br />
          Vous pouvez dès à présent réserver votre poste de travail , vous
          inscrire à votre future formation et souscrire à notre outil de
          gestion de planning !
        </div>

        <h2 className="font-normal text-lg my-8">Abonnement actuel</h2>

        <div className="border rounded-sm p-4 ">
          <div className="flex items-center justify-between gap-4">
            <h3>Abonnement gestion planning mensuel</h3>
            <div>
              19 €<span className="text-gray-500 text-sm block">/Mois</span>
            </div>
          </div>
          <div className="my-3">
            Date de renouvellement: &nbsp;
            <span className="text-gray-500">17 Mars 2024</span>
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <Button variant={"destructive"} className="">
              Annuler l'abonnement
            </Button>
            <Button variant={"outline"}>Mettre à niveau</Button>
          </div>
        </div>

        <h2 className="font-normal text-lg my-8">Réservations récentes</h2>

        {/* section of recents resservations */}

        <section className="p-4 mx-auto ">
        {reservations.map((reservation) => (
            <Reservation
              typeClient={reservation.typeClient}
              status={reservation.status}
            />
          ))}
          <div className="my-6 p-4 text-center">
          <Button>Voir toutes les réservations</Button>
          </div>
        </section>
      </div>
    </TabsContent>
  );
}
