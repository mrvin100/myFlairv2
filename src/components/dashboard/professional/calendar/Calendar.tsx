"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';
import { TabsContent } from "@/components/tabs";
import { fr } from "date-fns/locale";


const CalendarTab = () => {
  return (
    <TabsContent title="Calendar" value="calendar">
      <div className="calendar-container">
        <FullCalendar
          plugins={[resourceTimelinePlugin, dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay'
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
          // initialEvents={[
          //   { title: "event1", start: new Date(), resourceId: "a" },
          //   { title: "event2", start: new Date(), resourceId: "a" },
          //   { title: "event3", start: new Date(), resourceId: "a" },
          //   { title: "event4", start: new Date(), resourceId: "a" },
          //   { title: "event5", start: new Date(), resourceId: "a" },
          //   { title: 'nice event', start: new Date(), resourceId: 'a' }
          // ]}
          eventContent={(eventInfo) => {
            return (
              <>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
              </>
            );
          }}
        />
      </div>
    </TabsContent>
  );
};

export default CalendarTab;
