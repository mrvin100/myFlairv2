"use client"
import { useState, useEffect } from "react";
import { useUserContext } from "@/contexts/user";
import { signOut } from "next-auth/react";
import { TabsContent } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import Reservation from "./Reservation";

type ReservationType = {
  id: string;
  service: {
    typeClient: string;
    title: string;
    price: number;
    dureeRDV: string;
  };
  status: string;
  dateOfRdv: string;
  time: string;
  address: string;
  note: string;
  client?: {
    email?: string;
    phone?: string;
    image?: string;
    firstName?: string;
    lastName?: string;
    clientUser: {
      firstName:string;
      lastName:string;
      image:string;
      phone:string;
      email:string;

    }
  };
};

export default function OverviewTab() {
  const { user } = useUserContext();
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const handleDeleteReservation = (id: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== id))
  }

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch(`/api/dashboardPro/reservationRecente/${user?.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setReservations(data);
        } else {
          console.error("Data is not an array", data);
        }
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    }

    if (user?.id) {
      fetchReservations();
    }
  }, [user?.id]);

  return (
    <TabsContent title="Tableau de bord" value="overview">
      <div className="max-w-5xl w-full">
        <div>
          Bonjour <b>{user?.firstName}</b> !<br />
          (vous n&apos;êtes pas {user?.firstName} ?
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

          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <Reservation
                id={reservation.id}
                typeClient={reservation.service.typeClient}
                status={reservation.status}
                date={reservation.dateOfRdv}
                time={reservation.time}
                address={reservation.address}
                note={reservation.note}
                service={reservation.service.title}
                price={reservation.service.price}
                email={reservation.client?.clientUser.email || 'N/A'}
                phone={reservation.client?.clientUser.phone || 'N/A'}
                image={reservation.client?.clientUser.image || '/default-image.png'}
                firstName={reservation.client?.clientUser.firstName || 'Inconnu'}
                lastName={reservation.client?.clientUser?.lastName || 'Inconnu'}
                dureeRDV={reservation.service.dureeRDV}
                onDelete={handleDeleteReservation}
              />
            ))
          ) : (
            <p>Aucune réservation récente</p>
          )}

          
        </section>
      </div>
    </TabsContent>
  );
}
