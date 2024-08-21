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

const Home: React.FC = () => {
  const { addDate, removeDate, selectedWeekDays, selectedSaturdays } =
    useDateContext();
  const { workplaces } = useWorkplaceContext();
  const pathname = usePathname();
  
  
  const segments = pathname.split("/");
  const lastsegment = segments[segments.length - 1];
  
  console.log('pathname: ', pathname);  
  console.log('segments: ', segments);
  console.log('lastsegment: ', lastsegment);

  const selectedWorkplace = workplaces.find(
    (workplace) => workplace.id === parseInt(lastsegment, 10)
  );

  console.log('selectedWorkplace: ', selectedWorkplace);


  const [stock, setStock] = useState<number>(
    selectedWorkplace ? selectedWorkplace.stock : 0
  );
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [individualStock, setIndividualStock] = useState<
    Record<string, number>
  >({});
  const [reservedDates, setReservedDates] = useState<string[]>([]);
  const initialStock = selectedWorkplace ? selectedWorkplace.stock : 0;

  const calendarRef = useRef<FullCalendar>(null);
  const calendarApiRef = useRef<any>(null);

  useEffect(() => {
    if (selectedWorkplace) {
      setStock(selectedWorkplace.stock);
      // setIndividualStock(prevIndividualStock =>  {
      //   const newIndividualStock:Record <string, number> = {
      //     ...prevIndividualStock
      //   }
      //   newIndividualStock[''] = selectedWorkplace.stock
      //   return newIndividualStock;
      // });
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

  
  const availableDates = generateAvailableDates();
  console.log('avalaible dates: ', availableDates);
  

  const updateCalendarDates = () => {
    const calendarApi = calendarApiRef.current;
    if (calendarApi) {
      calendarApi.removeAllEventSources();

      const today = startOfToday();
      const availableDates = generateAvailableDates();
      console.log('avalaible dates: ', availableDates);
      
      
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

    if ((dayOfWeek >= 1 && dayOfWeek <= 5) || isSaturday) {
      const currentStock = individualStock[dateString] || stock;

      if (selectedDates.includes(dateString)) {
        removeDate(dateString, isSaturday);
        const updatedSelectedDates = selectedDates.filter(
          (date) => date !== dateString
        );
        setSelectedDates(updatedSelectedDates);
        setIndividualStock((prevIndividualStock) => {
          const newIndividualStock:Record<string, number> = {
            ...prevIndividualStock
          };
          // delete newIndividualStock[dateString]
  
          // Access the current value for dateString, default to 0 if it doesn't exist
  
          const currentStockValue = individualStock[dateString] || 0
          newIndividualStock[dateString] = Math.min(currentStockValue + 1, initialStock) // insure stock is not greather than initial stock
          updateEventStock(dateString, newIndividualStock[dateString])
          return newIndividualStock
        })
       
      } else {
        if (stock <= 0) {
          error((props) => {}, {
            title: "Erreur",
            description: "Le stock est épuisé pour cette date.",
          });
          return;
        }

        // Vérifiez le stock pour cette date spécifique
        if (currentStock <= 0) {
          error((props) => {}, {
            title: "Erreur",
            description: "Le stock pour cette date est épuisé.",
          });
          return;
        }

        addDate(dateString, isSaturday);
        setSelectedDates([...selectedDates, dateString]);
        setIndividualStock((prevIndividualStock) => {
          const newIndividualStock: Record<string, number> = {
            ...prevIndividualStock
          };

          const currentIndividualStock = prevIndividualStock[dateString] || 0
          newIndividualStock[dateString] = Math.max(currentIndividualStock - 1, 0); // Ensure stock is not negative

          setIndividualStock(newIndividualStock);
          updateEventStock(dateString, newIndividualStock[dateString]);

          return newIndividualStock;
        });
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

export default Home;
