"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction'
import { TabsContent } from "@/components/tabs";
import { fr } from "date-fns/locale";


const CalendarTab = () => {
  return (
    <TabsContent title="Calendar" value="calendar">
      <div className="calendar-container">
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
            { id: "b", title: "Auditorium B", eventColor: "green" },
            { id: "c", title: "Auditorium C", eventColor: "orange" },
          ]}
          initialEvents={[
            { title: "event1", start: new Date(), resourceId: "a" },
            { title: "event2", start: new Date(), resourceId: "a" },
            { title: "event3", start: new Date(), resourceId: "a" },
            { title: "event4", start: new Date(), resourceId: "a" },
            { title: "event5", start: new Date(), resourceId: "a" },
            { title: 'nice event', start: new Date(), resourceId: 'a' }
          ]}
          eventContent={(eventInfo) => {
            return (
              <span className="text-center border p-2 w-full bg-gray-100/50">
                <b className="mr-2">{eventInfo.timeText}</b>
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


const Home2: React.FC = () => {

  return (
    <div>
      <FullCalendar
        // ref={'calendarRef'}
        selectable={true}
        nowIndicator={true}
        editable={true}
        selectMirror={true}
        plugins={[interactionPlugin,  timeGridPlugin, dayGridPlugin]}
        locale={fr}
        themeSystem={"standard"}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        height={"auto"}
        dateClick={() => 'handleDateClick'}
        
        eventContent={({ event }) => (
          <div className="min-h-14 border-0">
            <div className="text-right p-2">
              <span
                className={`rounded-full inline-block px-2 py-1 ${
                  event.extendedProps.description === "Indisponible"
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              >
                {event.title}
              </span>
            </div>
            <div
              className={`p-2 text-center ${
                event.extendedProps.description === "Indisponible"
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            >
              {event.extendedProps.description}
            </div>
          </div>
        )}
      />
    </div>
  );
};
