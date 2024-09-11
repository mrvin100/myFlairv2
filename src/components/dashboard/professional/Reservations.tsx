import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

import {
  Calendar,
  Notifications,
} from '@/components/dashboard/professional/calendar';


export default function ReservationsTab({typeClient='flair', status='en-cours'}) {
  interface Reservation {
    typeClient: string
    status: string
  }

  const reservations : Reservation[] = [
    { typeClient: "boutique", status: "en-cours" },
    { typeClient: "boutique", status: "annule" },
    { typeClient: "flair", status: "complete" },
  ];

  const tabs = [
    {
      title: 'Calendrier',
      value: 'calendar',
      component: <Calendar />,
    },
    {
      title: 'Notifications',
      value: 'notifications',
      component: <Notifications />,
    },
  ];

  

  return (
    <TabsContent value="reservations" className="space-y-4">
            <Tabs defaultValue={tabs[0].value}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => tab.component)}
      </Tabs>
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
