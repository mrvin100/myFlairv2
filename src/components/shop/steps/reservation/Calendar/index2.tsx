import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fr } from "date-fns/locale";
import { isBefore, startOfToday } from "date-fns";
import { useDateContext } from "@/contexts/dateContext";
import "../Calendar/style.css";
import { error } from "@/components/toast";
import { useWorkplaceContext } from "@/contexts/WorkplaceContext";
import { usePathname } from "next/navigation";

const Home: React.FC = () => {
  const { addDate, removeDate, selectedWeekDays, selectedSaturdays } =
    useDateContext();
  const { workplaces } = useWorkplaceContext();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const lastsegment = segments[segments.length - 1];

  const selectedWorkplace = workplaces.find(
    (workplace) => workplace.id === parseInt(lastsegment, 10)
  );

  const [stock, setStock] = useState<number>(
    selectedWorkplace ? selectedWorkplace.stock : 0
  );
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [individualStock, setIndividualStock] = useState<{
    [key: string]: number;
  }>({});

  const calendarRef = useRef<FullCalendar>(null);
  const calendarApiRef = useRef<any>(null);

  // Mettre à jour le stock lorsque selectedWorkplace change
  useEffect(() => {
    if (selectedWorkplace) {
      setStock(selectedWorkplace.stock);
    }
  }, [selectedWorkplace]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApiRef.current = calendarApi;
    if (calendarApi) {
      updateCalendarDates();
    }
  }, [selectedWeekDays, selectedSaturdays, stock, selectedDates]);

  const generateAvailableDates = (stock: number) => {
    const availableDates: string[] = [];
    const today = startOfToday();
    let date = today;

    for (let i = 0; i < stock; i++) {
      availableDates.push(date.toISOString().split("T")[0]);
      date = new Date(date);
      date.setDate(date.getDate() + 1); // Passez au jour suivant
    }

    return availableDates;
  };

  const updateCalendarDates = () => {
    const calendarApi = calendarApiRef.current;
    if (calendarApi) {
      calendarApi.removeAllEventSources();

      const today = startOfToday();
      const availableDates = generateAvailableDates(stock);

      const events = [
        ...selectedWeekDays.map((date) => ({
          id: date,
          title:
            individualStock[date] !== undefined
              ? individualStock[date].toString()
              : stock > 0
                ? stock.toString()
                : "0",
          start: date,
          backgroundColor: isBefore(new Date(date), today)
            ? "#E0E0E0"
            : selectedDates.includes(date) || stock <= 0
              ? "#FF0000"
              : "#00E02E",
          borderColor: isBefore(new Date(date), today)
            ? "#B0B0B0"
            : selectedDates.includes(date) || stock <= 0
              ? "#FF0000"
              : "#00E02E",
          className: isBefore(new Date(date), today) ? "past-date" : "",
          editable: !isBefore(new Date(date), today),
          extendedProps: {
            description:
              selectedDates.includes(date) || stock <= 0
                ? "Indisponible"
                : "Disponible",
          },
        })),
        ...selectedSaturdays.map((date) => ({
          id: date,
          title:
            individualStock[date] !== undefined
              ? individualStock[date].toString()
              : stock > 0
                ? stock.toString()
                : "0",
          start: date,
          backgroundColor: isBefore(new Date(date), today)
            ? "#E0E0E0"
            : selectedDates.includes(date) || stock <= 0
              ? "#FF0000"
              : "#00E02E",
          borderColor: isBefore(new Date(date), today)
            ? "#B0B0B0"
            : selectedDates.includes(date) || stock <= 0
              ? "#FF0000"
              : "#00E02E",
          className: isBefore(new Date(date), today) ? "past-date" : "",
          editable: !isBefore(new Date(date), today),
          extendedProps: {
            description:
              selectedDates.includes(date) || stock <= 0
                ? "Indisponible"
                : "Disponible",
          },
        })),
      ];

      calendarApi.addEventSource(events);
      calendarApi.render();
    }
  };

  const updateEventStock = (dateString: string, newStock: number) => {
    const calendarApi = calendarApiRef.current;
    const event = calendarApi.getEventById(dateString);
    if (event) {
      event.setProp("title", newStock > 0 ? newStock.toString() : "0");
      event.setExtendedProp(
        "description",
        newStock > 0 ? "Disponible" : "Indisponible"
      );
      event.setProp("backgroundColor", newStock > 0 ? "#00E02E" : "#FF0000");
      event.setProp("borderColor", newStock > 0 ? "#00E02E" : "#FF0000");
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
        setStock((prevStock) => {
          const newStock = prevStock + 1;
          updateEventStock(dateString, newStock);
          const newIndividualStock = { ...individualStock };
          delete newIndividualStock[dateString];
          setIndividualStock(newIndividualStock);
          return newStock;
        });
        console.log("ajout stock", stock + 1);
      } else {
        addDate(dateString, isSaturday);
        setSelectedDates([...selectedDates, dateString]);
        setStock((prevStock) => {
          const newStock = prevStock - 1;
          updateEventStock(dateString, newStock);
          const newIndividualStock = {
            ...individualStock,
            [dateString]: newStock,
          };
          setIndividualStock(newIndividualStock);
          return newStock;
        });
        console.log("réduction stock", stock - 1);
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
