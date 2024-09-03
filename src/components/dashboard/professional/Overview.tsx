"use client"
import { useState, useEffect } from "react";
import { useUserContext } from "@/contexts/user";
import { signOut } from "next-auth/react";
import { TabsContent } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import clsx from "clsx";
import Reservation from "./Reservation";

type ReservationType = {
  id: string;
  service: {
    typeClient: string;
    title: string;
    price: number;
  };
  status: string;
  dateOfRdv: string;
  time: string;
  address: string;
  note: string;
  user: {
    email: string;
    phone: string;
  };
};

export default function OverviewTab() {
  const { user } = useUserContext();
  const [reservations, setReservations] = useState<ReservationType[]>([]);

  useEffect(() => {
    async function fetchReservations() {
      const response = await fetch(`/api/dashboardPro/reservationRecente/${user?.id}`);
      const data = await response.json();
      setReservations(data);
    }
    if (user) {
      fetchReservations();
    }
  }, [user]);

  return (
    <TabsContent title="Tableau de bord" value="overview">
      <div className="max-w-5xl w-full">
        <div>
          Bonjour <b>{user?.firstName}</b> !<br />
          (vous n’êtes pas {user?.firstName} ?{" "}
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
          Vous pouvez dès à présent réserver votre poste de travail, vous
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

        {/* Section des réservations récentes */}
        <section className="p-4 mx-auto ">
          {reservations.map((reservation) => (
            <Reservation
              key={reservation.id}
              typeClient={reservation.service.typeClient}
              status={reservation.status}
              date={reservation.dateOfRdv}
              time={reservation.time}
              address={reservation.address}
              note={reservation.note}
              service={reservation.service.title} // Utiliser le titre du service
              price={reservation.service.price}
              email={reservation.user.email} // Ajouter l'email de l'utilisateur
              phone={reservation.user.phone} // Ajouter le numéro de téléphone de l'utilisateur
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
