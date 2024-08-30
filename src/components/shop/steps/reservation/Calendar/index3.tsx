import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fr } from "date-fns/locale";
import { startOfToday, addDays, addMonths } from "date-fns";
import { useDateContext } from "@/contexts/dateContext";
import "../Calendar/style.css";
import { error } from "@/components/toast";
import { useWorkplaceContext } from "@/contexts/WorkplaceContext";
import { usePathname } from "next/navigation";

const Home3: React.FC = () => {
  const { addDate, removeDate, selectedWeekDays, selectedSaturdays } =
    useDateContext();
  const { workplaces } = useWorkplaceContext();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const lastsegment = segments[segments.length - 1];
  
  const selectedWorkplace = workplaces.find(
    (workplace) => workplace.id === parseInt(lastsegment, 10)
  );
  
  const [reservedDates, setReservedDates] = useState<string[]>([]);
  const initialStock = selectedWorkplace ? selectedWorkplace.stock : 0;

  const calendarRef = useRef<FullCalendar>(null);
  const calendarApiRef = useRef<any>(null);

  const [stock, setStock] = useState<number>(
    selectedWorkplace ? selectedWorkplace.stock : 0
  );
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  
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
  
  const availableDates = generateAvailableDates()
  
  const [individualStock, setIndividualStock] = useState<Record<string, number>>(
    availableDates.reduce((acc, key) => {
      acc[key] = stock
      return acc;
  }, {} as Record<string, number>)
  );


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
  }, [
    selectedWeekDays,
    selectedSaturdays,
    stock,
    selectedDates,
    reservedDates,
  ]);



  const updateCalendarDates = () => {
    const calendarApi = calendarApiRef.current;
    if (calendarApi) {
      calendarApi.removeAllEventSources();

      const today = startOfToday();
      // const availableDates = generateAvailableDates();
      console.log("avalaibles Dates :", availableDates);
      

      const events = selectedDates.map((date) => ({
        id: date,
        title: individualStock[date]?.toString() || "Disponible",
        start: date,
        backgroundColor: "#00E02E",
        borderColor: "#00E02E",
        className: "",
        editable: true,
        extendedProps: {
          description: "Disponible",
        },
      }));

      const reservedEvents = reservedDates.map((date) => ({
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

      calendarApi.addEventSource([...events, ...reservedEvents]);
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
    const currentStock = individualStock[dateString] || stock;

    if ((dayOfWeek >= 1 && dayOfWeek <= 5) || isSaturday) {
        if (selectedDates.includes(dateString)) {
            removeDate(dateString, isSaturday);
            const updatedSelectedDates = selectedDates.filter(
                (date) => date !== dateString
            );
            setSelectedDates(updatedSelectedDates);
            
            setIndividualStock((prevStock) => ({
                ...prevStock,
                [dateString]: Math.min((prevStock[dateString] || 0) + 1, stock), // Augmenter le stock individuel
            }));
            updateEventStock(dateString, (prevStock[dateString] || 0) + 1); // Mettre à jour l'événement
        } else {
            if (currentStock <= 0) {
                error((props) => {}, {
                    title: "Erreur",
                    description: "Le stock pour cette date est épuisé.",
                });
                return;
            }
            addDate(dateString, isSaturday);
            setSelectedDates([...selectedDates, dateString]);
            setIndividualStock((prevStock) => ({
                ...prevStock,
                [dateString]: Math.max((prevStock[dateString] || 0) - 1, 0),
            }));
            updateEventStock(dateString, (prevStock[dateString] || 0) - 1);
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
                    : event.extendedProps.description === "Passée"
                      ? "bg-gray-500"
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
                  : event.extendedProps.description === "Passée"
                    ? "bg-gray-500"
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

export default Home3;
