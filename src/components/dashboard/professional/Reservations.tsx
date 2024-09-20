'use client'
import { useState, useEffect } from "react";
import { useUserContext } from "@/contexts/user";
import { TabsContent } from "@/components/ui/tabs";
import Reservation from "./Reservation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function getReservationStatus(dateOfRdv: string): string {
  const reservationDate = new Date(dateOfRdv);
  const currentDate = new Date();
  
  if (reservationDate < currentDate) {
    return "termine";
  } else {
    return "en-cours";
  }
}

export default function Reservations() {
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
    user: {
      email: string;
      phone: string;
      image: string;
    };
  };

  const { user } = useUserContext();
  const [reservations, setReservations] = useState<ReservationType[]>([]);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch(`/api/dashboardPro/reservationAll/${user?.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          // Mettre à jour le statut pour chaque réservation
          const updatedReservations = data.map((reservation: ReservationType) => ({
            ...reservation,
            status: getReservationStatus(reservation.dateOfRdv),
          }));
          setReservations(updatedReservations);
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
    <TabsContent value="listes" className="space-y-4">
      <div className=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2 flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Réservations</h2>
          <section className="p-4 mx-auto">
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <Reservation
                  key={reservation.id}
                  typeClient={reservation.service.typeClient}
                  status={reservation.status}
                  date={reservation.dateOfRdv}
                  time={reservation.time}
                  address={reservation.address}
                  note={reservation.note}
                  service={reservation.service.title}
                  price={reservation.service.price}
                  email={reservation.user.email}
                  phone={reservation.user.phone}
                  image={reservation.user.image}
                  dureeRDV={reservation.service.dureeRDV}
                />
              ))
            ) : (
              <p>Aucune réservation récente</p>
            )}
          </section>
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
