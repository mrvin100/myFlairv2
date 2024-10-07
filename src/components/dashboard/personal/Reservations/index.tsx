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
      profession: string;
      title: string;
      price: number;
      dureeRDV: string;
    };
    status: "en-cours" | "annule" | "termine";
    dateOfRdv: string;
    time: string;
    address: string;
    note: string;
    user: {
      name: string;
      email: string;
      phone: string;
      image: string;  
      rating:number;
    };
  };

  // fakes reservations datas

  const initialReservations: ReservationType[] = [
    {
      id: '12345',
      service: {
        profession: 'Coiffeuse',
        title: 'Coupe de cheveux',
        price: 20000,
        dureeRDV: '1 heure',
      },
      status: 'en-cours',
      dateOfRdv: '2024-09-25',
      time: '10:00',
      address: '123 Rue principale, Yaoundé',
      note: 'Veuillez apporter votre propre peigne.',
      user: {
        name: "Melina Beauty",
        email: 'john.doe@example.com',
        phone: '678901234',
        image: 'https://example.com/user.jpg',
        rating: 4,
      },
    },
    {
      id: '67890',
      service: {
        profession: 'Coiffeuse',
        title: "Coiffure d'équipe",
        price: 500000,
        dureeRDV: '3 heures',
      },
      status: 'annule',
      dateOfRdv: '2024-10-01',
      time: '14:00',
      address: '456 Boulevard des États-Unis, Yaoundé',
      note: 'Veuillez fournir une liste des participants.',
      user: {
        name: 'Melina Beauty',
        email: 'jane.smith@example.com',
        phone: '567890123',
        image: 'https://example.com/user.jpg',
        rating: 4,
      },
    },
    {
      id: '11111',
      service: {
        profession: 'Coiffeuse',
        title: 'Coloration',
        price: 30000,
        dureeRDV: '2 heures',
      },
      status: 'termine',
      dateOfRdv: '2024-10-05',
      time: '16:00',
      address: '789 Avenue du Commerce, Yaoundé',
      note: 'Veuillez apporter une photo de la couleur désirée.',
      user: {
        name: 'Melina Beauty',
        email: 'michael.johnson@example.com',
        phone: '456789012',
        image: 'https://example.com/user.jpg',
        rating: 4,
      },
    },
    {
      id: '22222',
      service: {
        profession: 'Coiffeuse',
        title: 'Coiffure de mariage',
        price: 1000000,
        dureeRDV: '5 heures',
      },
      status: 'en-cours',
      dateOfRdv: '2024-10-15',
      time: '09:00',
      address: '901 Rue de la Paix, Yaoundé',
      note: 'Veuillez fournir une liste des participants et leurs préférences de coiffure.',
      user: {
        name: 'Melina Beauty',
        email: 'emily.brown@example.com',
        phone: '345678901',
        image: 'https://example.com/user.jpg',
        rating: 4,
      },
    },
    {
      id: '33333',
      service: {
        profession: 'Coiffeuse',
        title: 'Coupe de cheveux pour enfant',
        price: 15000,
        dureeRDV: '30 minutes',
      },
      status: 'annule',
      dateOfRdv: '2024-10-20',
      time: '17:00',
      address: '1012 Rue du Centre, Yaoundé',
      note: "Veuillez apporter un jouet pour distraire l'enfant.",
      user: {
        name: 'Melina Beauty',
        email: 'olivia.wilson@example.com',
        phone: '234567890',
        image: 'https://example.com/user.jpg',
        rating: 4,
      },
    },
  ];

  const { user } = useUserContext();
  const [reservations, setReservations] = useState<ReservationType[]>(initialReservations);

  
  return (
    <TabsContent value="reservations" className="space-y-4">
      <div className=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2 flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Réservations</h2>
          <section className="p-4 mx-auto">
            {(reservations && reservations.length > 0) ? (
              reservations.map((reservation) => (
                <Reservation
                  key={reservation.id}
                  profession={reservation.service.profession}
                  status={reservation.status}
                  date={reservation.dateOfRdv}
                  time={reservation.time}
                  address={reservation.address}
                  note={reservation.note}
                  service={reservation.service.title}
                  price={reservation.service.price}
                  name={reservation.user.name}
                  email={reservation.user.email}
                  phone={reservation.user.phone}
                  image={reservation.user.image}
                  rating={reservation.user.rating}
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
