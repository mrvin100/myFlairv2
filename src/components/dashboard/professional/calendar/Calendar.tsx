"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction'
import { TabsContent } from "@/components/tabs";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";


const CalendarTab = () => {
interface Reservation{
  status: string,
  title: string,
  time: string,
}
interface DayReservation{
  day: string,
  reservations:Reservation[],
}

// status :  'complete' | 'annule' | 'en-cours'

const singleReservation:DayReservation = {
  day: 'September 15 2024',
  reservations: [
    {status: 'complete', title: 'nom du service', time: '11:00' },
    {status: 'annule', title: 'nom du service', time: '12:00' },
    {status: 'en-cours', title: 'nom du service', time: '13:00' },
  ]
}


const todayDate = new Date('September 20 2024 11:30')
console.log('date of today : ',todayDate);
console.log('time of today : ',todayDate.getHours());

const allReservations = [
  { title: "event1", start: new Date('September 14 2024 11:30'), resourceId: "a" },
  { title: "event2", start: new Date('September 15 2024 12:30'), resourceId: "a" },
  { title: "event3", start: new Date('September 15 2024 13:30'), resourceId: "c" },
  { title: "event4", start: new Date('September 17 2024 11:30'), resourceId: "b" },
  { title: "event5", start: new Date('September 18 2024 12:30'), resourceId: "c" },
  { title: 'nice event', start: new Date('September 18 2024 13:30'), resourceId: 'b' }
]


  return (
    <TabsContent title="Calendar" value="calendar">
      <div className="calendar-container">
        
      <div className="flex justify-end gap-2 items-center my-4">
        <Badge className="bg-green-100 text-green-600 hover:bg-transparent">Terminé</Badge>
        <Badge className="bg-red-100 text-red-600 hover:bg-transparent">Annulé</Badge>
        <Badge className="bg-blue-100 text-blue-600 hover:bg-transparent">En cours</Badge>
      </div>
        <FullCalendar
          plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale={fr}
          themeSystem={"standard"}
          initialView="dayGridMonth"
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}
          resources={[
            { id: "a", title: "Auditorium A" },
            { id: "b", title: "Auditorium B", eventColor: "green", },
            { id: "c", title: "Auditorium C", eventColor: "orange", },
          ]}
          initialEvents={allReservations}
          eventContent={(eventInfo) => {
            return (
              <span className={clsx(`${ eventInfo.event.textColor}`, "text-center border p-2 w-full bg-gray-100/50 block whitespace-nowrap overflow-hidden text-ellipsis")}>
                <b className="mr-1">{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
              </span>
            );
          }}
        />
      </div>
    </TabsContent>
  );
};


export default CalendarTab;
