import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDateContext } from "../../../../../../dateContext";

interface Reservation {
  id: number;
  date: string;
  horaireDebut: string;
  horaireFin: string;
  tarif: number;
}

const Cart = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { selectedWeekDays, selectedSaturdays } = useDateContext();
  const pathname = usePathname();
  const segments = pathname.split('/');
  const lastSegment = segments[segments.length - 1];

  useEffect(() => {
    if (lastSegment) {
      const fetchReservations = async () => {
        try {
          const res = await fetch(`/api/post/get/${lastSegment}`);
          if (res.ok) {
            const data = await res.json();
            console.log(data)
          } else {
            console.error('Error fetching reservations:', res.statusText);
          }
        } catch (error) {
          console.error('Error fetching reservations:', error);
        }
      };

      fetchReservations();
    }
  }, [lastSegment]);

  return (
    <div>
      <Table>
        <TableCaption>Vos dates de réservations</TableCaption>
        <TableHeader className="bg-black">
          <TableRow className="text-lg bg-black">
            <TableHead className="text-center" style={{ color: '#FFFFFF' }}>Date</TableHead>
            <TableHead className="text-center" style={{ color: '#FFFFFF' }}>Horaires</TableHead>
            <TableHead className="text-center" style={{ color: '#FFFFFF' }}>Tarifs</TableHead>
            <TableHead className="text-right" style={{ color: '#FFFFFF' }}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <TableBody key={reservation.id}>
              <TableRow>
                <TableCell><span className="flex justify-center">{}</span></TableCell>
                <TableCell><span className="flex justify-center">{reservation.horaireDebut} à {reservation.horaireFin}</span></TableCell>
                <TableCell><span className="flex justify-center">{reservation.tarif} €</span></TableCell>
                <TableCell className="text-right"><span className="flex justify-end"><img src={'/iconWorkPlace/trash-2.svg'} alt="" /></span></TableCell>
              </TableRow>
            </TableBody>
          ))
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="text-center">Aucune réservation</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
      <br />
      <div>
        <h3>Dates sélectionnées (Lundi à Vendredi) :</h3>
        <ul>
          {selectedWeekDays.map(date => (
            <li key={date}>{date}</li>
          ))}
        </ul>
        <h3>Dates sélectionnées (Samedi) :</h3>
        <ul>
          {selectedSaturdays.map(date => (
            <li key={date}>{date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Cart;
