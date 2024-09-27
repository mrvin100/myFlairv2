import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDateContext } from "@/contexts/dateContext";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useWorkplaceContext } from "@/contexts/WorkplaceContext";
import { Post } from "@prisma/client";
import { CURRENCY } from "@/lib/constant";

interface Reservation {
  id: number;
  date: string;
  horaireDebut: string;
  horaireFin: string;
  tarif: number;
}

interface Props {
  post: Post | null;
}

const Cart = ({ post }: Props) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { selectedWeekDays, selectedSaturdays, removeDate } = useDateContext();
  const { workplaces } = useWorkplaceContext();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  console.log("Selected week days:");
  console.log(selectedWeekDays);

  const selectedWorkplace = workplaces.find(
    (workplace) => workplace.id === parseInt(lastSegment, 10)
  );

  useEffect(() => {
    if (lastSegment) {
      const fetchReservations = async () => {
        try {
          const res = await fetch(`/api/post/get/${lastSegment}`);
          if (res.ok) {
            const data = await res.json();
            setReservations(data);
          } else {
            console.error("Error fetching reservations:", res.statusText);
          }
        } catch (error) {
          console.error("Error fetching reservations:", error);
        }
      };

      fetchReservations();
    }
  }, [lastSegment]);

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString); 
    return format(date, "dd MMMM yyyy", { locale: fr });
  };

  const [total, setTotal] = useState(0);

  useEffect(() => {
    console.log("Jours de semaine sélectionnés:", selectedWeekDays);
    console.log("Samedis sélectionnés:", selectedSaturdays);
    
    let newTotal = 0;

    selectedWeekDays.forEach(() => {
      newTotal += Number(post?.weekPrice) || 0;
    });

    selectedSaturdays.forEach(() => {
      newTotal += Number(post?.saturdayPrice) || 0;
    });

    setTotal(newTotal);
  }, [selectedWeekDays, selectedSaturdays, post]);

  const handleRemoveDate = (date: string, type: "week" | "saturday") => {
    if (type === "week") {
      removeDate(date, false);
    } else {
      removeDate(date, true);
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>Vos dates de réservations</TableCaption>
        <TableHeader className="bg-black">
          <TableRow className="text-lg bg-black">
            <TableHead className="text-center" style={{ color: "#FFFFFF" }}>
              Date
            </TableHead>
            <TableHead className="text-center" style={{ color: "#FFFFFF" }}>
              Horaires
            </TableHead>
            <TableHead className="text-center" style={{ color: "#FFFFFF" }}>
              Tarifs
            </TableHead>
            <TableHead className="text-right" style={{ color: "#FFFFFF" }}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedWeekDays.length === 0 && selectedSaturdays.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Aucune réservation
              </TableCell>
            </TableRow>
          ) : (
            <>
              {selectedWeekDays.map((date, index) => (
                <TableRow
                  key={date}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <TableCell className="text-center">
                    <span>{formatDate(date)}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    De {selectedWorkplace?.durationWeekStartHour}h
                    {selectedWorkplace?.durationWeekStartMinute} à{" "}
                    {selectedWorkplace?.durationWeekEndHour}h
                    {selectedWorkplace?.durationWeekEndMinute}
                  </TableCell>
                  <TableCell className="text-center">
                    {post?.weekPrice !== undefined ? (
                      `${Number(post.weekPrice).toFixed(2)} ${CURRENCY}`
                    ) : (
                      "Prix non disponible"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex justify-end">
                      <img
                        src={"/iconWorkPlace/trash-2.svg"}
                        alt="Supprimer"
                        onClick={() => handleRemoveDate(date, "week")}
                        className="cursor-pointer"
                      />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {selectedSaturdays.map((date, index) => (
                <TableRow
                  key={date}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <TableCell className="text-center">
                    <span>{formatDate(date)}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {selectedWorkplace?.durationSaturdayStartHour}h
                    {selectedWorkplace?.durationSaturdayStartMinute} à{" "}
                    {selectedWorkplace?.durationSaturdayEndHour}h
                    {selectedWorkplace?.durationSaturdayEndMinute}
                  </TableCell>
                  <TableCell className="text-center">
                    {post?.saturdayPrice !== undefined ? (
                      `${Number(post.saturdayPrice).toFixed(2)} ${CURRENCY}`
                    ) : (
                      "Prix non disponible"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="flex justify-end">
                      <img
                        src={"/iconWorkPlace/trash-2.svg"}
                        alt="Supprimer"
                        onClick={() => handleRemoveDate(date, "saturday")}
                        className="cursor-pointer"
                      />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
          <TableRow>
            <TableCell className="text-center font-bold">Total</TableCell>
            <TableCell className="text-center font-bold"></TableCell>
            <TableCell className="text-center  font-bold">
              {total.toFixed(2)} {CURRENCY}
            </TableCell>
            <TableCell className="text-center font-bold"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Cart;