import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fr } from "date-fns/locale";
import { startOfToday, addDays, addMonths, isSunday, isPast, isSameDay } from "date-fns";
import { useDateContext } from "@/contexts/dateContext";
import "../Calendar/style.css";
import { error } from "@/components/toast";
import { useWorkplaceContext } from "@/contexts/WorkplaceContext";
import { usePathname } from "next/navigation";

const Home: React.FC = () => {
  const { addDate, removeDate } = useDateContext();
  const { workplaces } = useWorkplaceContext();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const lastsegment = segments[segments.length - 1];

  const selectedWorkplace = workplaces.find(
    (workplace) => workplace.id === parseInt(lastsegment, 10)
  );

  const initialStock = selectedWorkplace ? selectedWorkplace.stock : 0;
  const [individualStock, setIndividualStock] = useState<Record<string, number>>({});
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const calendarRef = useRef<FullCalendar>(null);
  const calendarApiRef = useRef<any>(null);

  useEffect(() => {
    if (selectedWorkplace) {
      const availableDates = generateAvailableDates();
      const initialIndividualStock = availableDates.reduce((acc, date) => {
        acc[date] = initialStock;
        return acc;
      }, {} as Record<string, number>);
      setIndividualStock(initialIndividualStock);
    }
  }, [selectedWorkplace]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApiRef.current = calendarApi;
    if (calendarApi) {
      updateCalendarDates();
    }
  }, [individualStock]);

  const generateAvailableDates = () => {
    const availableDates: string[] = [];
    const today = startOfToday();
    const threeMonthsLater = addMonths(today, 3);
    let date = today;

    while (date <= threeMonthsLater) {
      availableDates.push(date.toISOString().split("T")[0]);
      date = addDays(date, 1);
    }

    return availableDates;
  };

  const updateCalendarDates = () => {
    const calendarApi = calendarApiRef.current;
    if (calendarApi) {
      calendarApi.removeAllEventSources();

      const events = Object.keys(individualStock).map((dateStr) => {
        const date = new Date(dateStr);
        const isPastDate = isPast(date) && !isSameDay(date, new Date());
        const isInactive = isSunday(date) || isPastDate;

        if (isInactive) {
          return {
            id: dateStr,
            start: dateStr,
            display: 'background',
            backgroundColor: '#f0f0f0', // Couleur de fond pour les dates inactives
            classNames: ['inactive-date'],
          };
        } else {
          return {
            id: dateStr,
            title: individualStock[dateStr].toString(),
            start: dateStr,
            backgroundColor: "#00E02E",
            borderColor: "#00E02E",
            extendedProps: {
              description: "Disponible",
            },
          };
        }
      });

      calendarApi.addEventSource(events);
      calendarApi.render();
    }
  };

  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.dateStr);
    const today = startOfToday();

    if (isPast(clickedDate) || isSunday(clickedDate)) {
      // Ne rien faire pour les dates passées ou les dimanches
      return;
    }

    const dateString = info.dateStr;

    if (selectedDates.includes(dateString)) {
      removeDate(dateString, clickedDate.getDay() === 6);
      setSelectedDates(selectedDates.filter((date) => date !== dateString));
      setIndividualStock((prevStock) => ({
        ...prevStock,
        [dateString]: prevStock[dateString] + 1,
      }));
    } else {
      if (individualStock[dateString] <= 0) {
        error((props) => {}, {
          title: "Erreur",
          description: "Le stock est épuisé pour cette date.",
        });
        return;
      }

      addDate(dateString, clickedDate.getDay() === 6);
      setSelectedDates([...selectedDates, dateString]);
      setIndividualStock((prevStock) => ({
        ...prevStock,
        [dateString]: prevStock[dateString] - 1,
      }));
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
        eventContent={({ event }) => {
          if (event.display === 'background') {
            return null; // Ne rien afficher pour les dates inactives
          }
          return (
            <div className="min-h-14 border-0">
              <div className="text-right p-2">
                <span className="rounded-full inline-block px-2 py-1 bg-green-500">
                  {event.title}
                </span>
              </div>
              <div className="p-2 text-center bg-green-500">
                {event.extendedProps.description}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default Home;
