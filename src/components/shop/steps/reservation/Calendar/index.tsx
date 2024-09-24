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
import { Post } from "@prisma/client";
import { useUserContext } from "@/contexts/user";
import { getReservationsForPost } from "@/lib/queries";

interface Props {
  postId: string;
  post: Post | null;
}

const Home: React.FC<Props> = ({ postId, post }: Props) => {
  const { addDate, removeDate, selectedWeekDays, selectedSaturdays } = useDateContext();
  const { workplaces } = useWorkplaceContext();
  const pathname = usePathname();

  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  const { user } = useUserContext();

  const selectedWorkplace = workplaces.find(
    (workplace) => workplace.id === parseInt(lastSegment, 10)
  );

  const [stock, setStock] = useState<number>(selectedWorkplace ? selectedWorkplace.stock : 0);
  const [individualStock, setIndividualStock] = useState<Record<string, number>>({});
  const [reservedDates, setReservedDates] = useState<string[]>([]);
  const initialStock = selectedWorkplace ? selectedWorkplace.stock : 0;

  const calendarRef = useRef<FullCalendar>(null);
  const calendarApiRef = useRef<any>(null);

  useEffect(() => {
    if (selectedWorkplace) {
      setStock(selectedWorkplace.stock);
    }
  }, [selectedWorkplace]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (postId) {
        const reservations = await getReservationsForPost(parseInt(postId, 10));
        const reservedDatesSet = new Set<string>();
        const individualStockCopy = { ...individualStock };
        reservations.forEach((reservation) => {
          const dateString = reservation.date.toISOString().split("T")[0];
          reservedDatesSet.add(dateString);
          individualStockCopy[dateString] = Math.max(
            (individualStockCopy[dateString] || initialStock) - 1,
            0
          );
        });
        setReservedDates(Array.from(reservedDatesSet));
        setIndividualStock(individualStockCopy);
      }
    };

    fetchReservations();
  }, [postId, initialStock]);

  useEffect(() => {
    const calculateAvailability = () => {
      const availableDates = generateAvailableDates();
      console.log(" avalaibles dates : ", availableDates);

      const individualStockCopy = { ...individualStock };

      availableDates.forEach((dateString) => {
        const reservationCount = reservedDates.filter((date) => date === dateString).length;
        individualStockCopy[dateString] = Math.max(initialStock - reservationCount, 0);
      });

      setIndividualStock(individualStockCopy);
    };

    calculateAvailability();
  }, [reservedDates, initialStock]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApiRef.current = calendarApi;
    if (calendarApi) {
      setTimeout(() => {
        updateCalendarDates();
      }, 0);
    }
  }, [individualStock, reservedDates, selectedWeekDays, selectedSaturdays]);

  const generateAvailableDates = () => {
    const availableDates: string[] = [];
    const today = startOfToday();
    const threeMonthsLater = addMonths(today, 3);
    let date = addDays(today, 1);

    while (date <= threeMonthsLater) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 1 && date >= new Date()) availableDates.push(date.toISOString().split("T")[0]);
      date = addDays(date, 1);
    }

    return availableDates;
  };

  const updateCalendarDates = () => {
    const calendarApi = calendarApiRef.current;
    if (calendarApi) {
      calendarApi.removeAllEventSources();

      const events = Object.keys(individualStock).map((date) => {
        const isSelected = [...selectedWeekDays, ...selectedSaturdays].includes(date);
        return {
          id: date,
          title: individualStock[date]?.toString() || "0",
          start: date,
          backgroundColor: isSelected ? "#15803d" : individualStock[date] > 0 || new Date(date) < new Date() ? "#22c55e" : "#FF0000",
          borderColor: isSelected ? "#15803d" : individualStock[date] > 0 || new Date(date) < new Date() ? "#22c55e" : "#FF0000",
          className: "",
          editable: true,
          extendedProps: {
            description: individualStock[date] > 0 ? "Disponible" : "Indisponible",
          },
        };
      });

      calendarApi.addEventSource(events);
      calendarApi.render();
    }
  };

  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.dateStr);
    clickedDate.setHours(0, 0, 0, 0);

    if (clickedDate < new Date()) {
      error((props) => { }, {
        title: "Erreur",
        description: "Vous ne pouvez pas sélectionner une date passée.",
      });
      return;
    }

    const dayOfWeek = clickedDate.getDay();
    const isSaturday = dayOfWeek === 6;
    const dateString = info.dateStr;

    if ((dayOfWeek >= 1 && dayOfWeek <= 5) || isSaturday) {
      if ([...selectedWeekDays, ...selectedSaturdays].includes(dateString)) {
        removeDate(dateString, isSaturday);
        console.log("Date supprimée:", dateString, "Est samedi:", isSaturday);
      } else {
        if (stock <= 0 || individualStock[dateString] <= 0) return
        addDate(dateString, isSaturday);
        console.log("Date ajoutée:", dateString, "Est samedi:", isSaturday);
      }
    }
    updateCalendarDates();
  };

  const handlePrevNextClick = (arg: any) => {
    const { view } = arg;
    const newDate = view.activeStart;
    const formattedNewDate = newDate.toISOString().split("T")[0];
    if (arg.type === "prev") {
      calendarApiRef.current.prev();
    } else if (arg.type === "next") {
      calendarApiRef.current.next();
    }
    updateCalendarDates();
  };

  console.log("reseved Dates : ", reservedDates);

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
        validRange={{
          start: new Date().setHours(18, 0, 0, 0),
          end: addMonths(new Date(), 3)
        }}
        hiddenDays={[0]}
        dateClick={handleDateClick}
        datesSet={handlePrevNextClick}
        eventContent={({ event }) => (
          <div className="min-h-14 border-0 relative">
            <div className="absolute top-0 left-0 p-1">
              <span className="rounded-full inline-block px-2 py-1 bg-white text-black">
                {event.title}
              </span>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Home;