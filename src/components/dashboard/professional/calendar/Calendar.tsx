"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
import { TabsContent } from "@/components/tabs";
import { fr } from "date-fns/locale";
import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import { useUserContext } from "@/contexts/user";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const CalendarTab = () => {
  interface Reservation {
    status: string;
    title: string;
    time: string;
  }

  interface DayReservation {
    day: string;
    reservations: Reservation[];
  }

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

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const { user } = useUserContext();

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch(`/api/dashboardPro/reservationAll/${user?.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(" reservations : ", data);
        
        
        if (Array.isArray(data)) {
          const updatedEvents = data.map((reservation: ReservationType) => ({
            id: reservation.id,
            title: reservation.service.title,
            start: reservation.dateOfRdv, // Utiliser seulement la date pour le début
            end: reservation.dateOfRdv, // Utiliser seulement la date pour la fin
            description: `Client: ${reservation.user.email}, Note: ${reservation.note}`, // Autres informations si nécessaire
            extendedProps: { // Ajoutez extendedProps ici
              status: reservation.status,
              email: reservation.user.email,
              note: reservation.note,
              user: reservation.user,
            },
          }));
          setEvents(updatedEvents);
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

  const handleEventClick = (clickInfo: any) => {
    const { event } = clickInfo;
    const { title, start, extendedProps, status } = event;
    
    setSelectedEvent({
      title,
      start: new Date(start).toLocaleString(),
      email: extendedProps.email,
      note: extendedProps.note,
      user: extendedProps.user,
    });

    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const renderEventContent = (info: any) => {
    const { title, extendedProps } = info.event;

    return (
      <div className={cn("w-full flex justify-between gap-4 items-center px-3 py-2 cursor-pointer", extendedProps.status === "annule" ? "bg-red-200 text-red-500" : extendedProps.status === "termine" ?  "bg-green-200 text-green-500" : "bg-blue-200 text-blue-500", "event-content")}>
       <Circle size={16} strokeWidth={2} absoluteStrokeWidth className="w-4 h-4 mr-2" /> <p>{title}</p>
      </div>
    );
  };

  return (
    <TabsContent title="Calendar" value="calendar">
      <div className="calendar-container">
        <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
          <h1 className="font-bold text-2xl text-gray-700">Calendrier</h1>
        </nav>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          locale={fr}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="dayGridMonth"
          events={events}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
        />

        {selectedEvent && (
          <Modal
            title="Détails de la Réservation"
            visible={isModalOpen}
            onCancel={handleOk}
            footer={null}
          >
            <div>
              <h3>{selectedEvent.title || <i>Aucun titre.</i>}</h3>
              <p>Date: {selectedEvent.start || <i>Aucune date.</i>}</p>
              <p>Email: {selectedEvent.email || <i>Aucun email.</i>}</p>
              <p>Note: {selectedEvent.note || <i>Aucune note.</i>}</p>
              {/* Ajoutez d'autres détails si nécessaire */}
            </div>
          </Modal>
        )}
      </div>
    </TabsContent>
  );
};

export default CalendarTab;
