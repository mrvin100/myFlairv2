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


export default function ReservationsTab() {
  interface Reservation {
    typeClient: string
    status: string
  }

  const reservations : Reservation[] = [
    { typeClient: "boutique", status: "en-cours" },
    { typeClient: "boutique", status: "annule" },
    { typeClient: "flair", status: "complete" },
  ];
  return (
    <TabsContent value="reservations" className="space-y-4">
      <div className=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2 flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Réservations</h2>
          {reservations.map((reservation) => (
            <Reservation
              typeClient={reservation.typeClient}
              status={reservation.status}
            />
          ))}
                  <div>
          {/* pagination part */}
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
