'use client';
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch(`/api/dashboardPro/reservationAll/${user?.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          const updatedReservations = data.map((reservation: ReservationType) => ({
            ...reservation,
          
          }));
          console.log(data,"data a verif")
          setReservations(updatedReservations);
          setTotalPages(Math.ceil(updatedReservations.length / itemsPerPage)); 
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

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate the reservations to display based on current page
  const indexOfLastReservation = currentPage * itemsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - itemsPerPage;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);

  return (
    <TabsContent value="listes" className="space-y-4">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2 flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Réservations</h2>
          <section className="p-4 mx-auto">
          {currentReservations.length > 0 ? (
  currentReservations.map((reservation) => (
          <Reservation
            key={reservation.id} // key reste ici, mais c'est un prop React spécial
            id={reservation.id}  // Passez l'id explicitement comme prop
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
  
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index + 1} isActive={index + 1 === currentPage}>
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(index + 1)}
                      className={index + 1 === currentPage ? "bg-black text-white" : ""}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
               
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
