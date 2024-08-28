import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fr } from "date-fns/locale";
import { startOfToday, addDays, addMonths, isSunday, isBefore, isSaturday } from "date-fns";
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

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [individualStock, setIndividualStock] = useState<Record<string, number>>({});

  const calendarRef = useRef<FullCalendar>(null);
  const calendarApiRef = useRef<any>(null);

  useEffect(() => {
    if (selectedWorkplace) {
      setIndividualStock(
        selectedDates.reduce((acc, date) => {
          acc[date] = initialStock;
          return acc;
        }, {} as Record<string, number>)
      );
    }
  }, [selectedWorkplace]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApiRef.current = calendarApi;
    if (calendarApi) {
      updateCalendarDates();
    }
  }, [selectedDates, individualStock]);

  const generateAvailableDates = () => {
    const availableDates: string[] = [];
    const today = startOfToday();
    const threeMonthsLater = addMonths(today, 3);
    let date = today;

    while (date <= threeMonthsLater) {
      if (!isSunday(date) && !isBefore(date, today)) {
        availableDates.push(date.toISOString().split("T")[0]);
      }
      date = addDays(date, 1);
    }

    return availableDates;
  };

  const updateCalendarDates = () => {
    const calendarApi = calendarApiRef.current;
    if (calendarApi) {
      calendarApi.removeAllEventSources();

      const today = startOfToday();
      const availableDates = generateAvailableDates();

      const events = availableDates.map((date) => {
        const stock = individualStock[date] ?? initialStock;
        return {
          id: date,
          title: stock.toString(),
          start: date,
          backgroundColor: stock > 0 ? "#00E02E" : "#FF0000",
          borderColor: stock > 0 ? "#00E02E" : "#FF0000",
          className: "",
          editable: true,
          extendedProps: {
            description: stock > 0 ? "Disponible" : "Indisponible",
          },
        };
      });

      const reservedDates = selectedDates.filter((date) =>
        isBefore(new Date(date), today)
      ).map((date) => ({
        id: date,
        title: "Indisponible",
        start: date,
        backgroundColor: "#FF0000",
        borderColor: "#FF0000",
        className: "",
        editable: false,
        extendedProps: {
          description: "Indisponible",
        },
      }));

      const filteredEvents = events.filter(
        (event) => !isSunday(new Date(event.start)) && !isBefore(new Date(event.start), today)
      );

      calendarApi.addEventSource([...filteredEvents, ...reservedDates]);
      calendarApi.render();
    }
  };

  const updateEventStock = (dateString: string, newStock: number) => {
    const calendarApi = calendarApiRef.current;
    const event = calendarApi.getEventById(dateString);
    if (event) {
      event.setProp("title", newStock.toString());
      event.setExtendedProp(
        "description",
        newStock > 0 ? "Disponible" : "Indisponible"
      );
      event.setProp("backgroundColor", newStock > 0 ? "#00E02E" : "#FF0000");
      event.setProp("borderColor", newStock > 0 ? "#00E02E" : "#FF0000");
    }
  };

  const handleDateClick = (info: any) => {
    const dateString = info.dateStr;
    const today = new Date().setHours(0, 0, 0, 0);
    const clickedDate = new Date(dateString).setHours(0, 0, 0, 0);

    if (isSunday(clickedDate) || clickedDate < today) {
      error((props) => {}, {
        title: "Erreur",
        description: isSunday(clickedDate)
          ? "Les dimanches ne peuvent pas être réservés."
          : "Vous ne pouvez pas sélectionner une date passée.",
      });
      return;
    }

    const currentStock = individualStock[dateString] || initialStock;

    if (selectedDates.includes(dateString)) {
      removeDate(dateString);
      setSelectedDates(selectedDates.filter((date) => date !== dateString));
      setIndividualStock((prevStock) => {
        const newStock = { ...prevStock };
        delete newStock[dateString];
        updateEventStock(dateString, initialStock);
        return newStock;
      });
    } else {
      if (currentStock <= 0) {
        error((props) => {}, {
          title: "Erreur",
          description: "Le stock pour cette date est épuisé.",
        });
        return;
      }

      addDate(dateString);
      setSelectedDates([...selectedDates, dateString]);
      setIndividualStock((prevStock) => {
        const newStock = {
          ...prevStock,
          [dateString]: currentStock - 1,
        };
        updateEventStock(dateString, newStock[dateString]);
        return newStock;
      });
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

export default Home;
