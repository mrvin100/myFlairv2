import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fr } from "date-fns/locale";
import { format, isBefore, startOfToday } from "date-fns";
import { useDateContext } from "@/contexts/dateContext";
import "../Calendar/style.css";
import { error } from "@/components/toast";

const Home: React.FC = () => {
  const { addDate, removeDate, selectedWeekDays, selectedSaturdays } =
    useDateContext();
  const calendarRef = useRef<FullCalendar>(null);
  const calendarApiRef = useRef<any>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApiRef.current = calendarApi;
    if (calendarApi) {
      updateCalendarDates();
    }
  }, [selectedWeekDays, selectedSaturdays]);

  const updateCalendarDates = () => {
    const calendarApi = calendarApiRef.current;
    if (calendarApi) {
      calendarApi.removeAllEventSources();

      const today = startOfToday();

      const events = [
        ...selectedWeekDays.map((date) => ({
          title: format(new Date(date), "dd MMMM yyyy", { locale: fr }),
          start: date,
          backgroundColor: isBefore(new Date(date), today)
            ? "#E0E0E0"
            : "#00E02E",
          border: isBefore(new Date(date), today)
            ? "2px solid #B0B0B0"
            : "2px solid #00E02E",
          className: isBefore(new Date(date), today) ? "past-date" : "",
          editable: !isBefore(new Date(date), today),
          extendedProps: {
            description: "Disponible",
          },
        })),
        ...selectedSaturdays.map((date) => ({
          title: format(new Date(date), "dd MMMM yyyy", { locale: fr }),
          start: date,
          backgroundColor: isBefore(new Date(date), today)
            ? "#E0E0E0"
            : "#00E02E",
          border: isBefore(new Date(date), today)
            ? "2px solid #B0B0B0"
            : "2px solid #00E02E",
          className: isBefore(new Date(date), today) ? "past-date" : "",
          editable: !isBefore(new Date(date), today),
          extendedProps: {
            description: "Disponible",
          },
        })),
      ];

      calendarApi.addEventSource(events);
      calendarApi.render();
    }
  };

  const handlePrevNextClick = (arg: any) => {
    const { view } = arg;
    const newDate = view.activeStart;
    const formattedNewDate = newDate.toISOString().split("T")[0];
    console.log("Changing month to: ", formattedNewDate);
    if (arg.type === "prev") {
      calendarApiRef.current.prev();
    } else if (arg.type === "next") {
      calendarApiRef.current.next();
    }
    updateCalendarDates();
  };

  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    clickedDate.setHours(0, 0, 0, 0);

    if (clickedDate < today) {
      error((props) => {}, {
        title: "Erreur",
        description: "Vous ne pouvez pas sélectionner une date passée.",
      });
      return;
    }

    const dayOfWeek = clickedDate.getDay();
    const isSaturday = dayOfWeek === 6;
    const dateString = info.dateStr;

    if ((dayOfWeek >= 1 && dayOfWeek <= 5) || isSaturday) {
      if (selectedDates.includes(dateString)) {
        removeDate(dateString, isSaturday);
        setSelectedDates(selectedDates.filter((date) => date !== dateString));
      } else {
        addDate(dateString, isSaturday);
        setSelectedDates([...selectedDates, dateString]);
      }
    }
  };

  return (
    <div>
      <FullCalendar
        ref={calendarRef}
        selectable={true}
        plugins={[interactionPlugin, dayGridPlugin]}
        locale={fr}
        themeSystem={"standard"}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        initialView="dayGridMonth"
        height={"auto"}
        dateClick={handleDateClick}
        datesSet={handlePrevNextClick}
        eventContent={({ event }) => (
          <div>
            <div>{event.title}</div>
            <div>{event.extendedProps.description}</div>
          </div>
        )}
      />
    </div>
  );
};

export default Home;
