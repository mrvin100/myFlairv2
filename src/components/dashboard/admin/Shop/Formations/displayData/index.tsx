import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { fr } from 'date-fns/locale';  
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Formation {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  alt?: string;
  dates: { date: string; available: string; quantity: number }[]; 
}

const formatDates = (dates: { date: string; available: string }[]) => {
  if (!dates || dates.length === 0) return 'Aucune date disponible';

  try {
    const sortedDates = dates
      .map(({ date }) => parseISO(date))
      .sort((a, b) => a.getTime() - b.getTime());

    const startDate = format(sortedDates[0], 'dd MMMM yyyy', { locale: fr });
    const endDate = format(sortedDates[sortedDates.length - 1], 'dd MMMM yyyy', { locale: fr });

    return `Du ${startDate} au ${endDate}`;
  } catch (error) {
    console.error('Erreur lors du formatage des dates:', error);
    return 'Date invalide';
  }
};

const DisplayFormations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/formation/get`, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Formation[]) => {
        setFormations(data);
      })
      .catch(error => console.error('Error fetching formations', error));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteFormationById(id);
      // Update the state by filtering out the deleted formation
      setFormations(prevFormations => prevFormations.filter(formation => formation.id !== id));
      setShowDialog(false); // Close the dialog
    } catch (error) {
      console.error('Erreur lors de la suppression de la formation:', error);
    }
  };

  async function deleteFormationById(id: string) {
    const response = await fetch(`/api/formation/delete/${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    return response.json();
  }

  return (
    <div>
      <AlertDialog>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Formation</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Tarif</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formations.map((formation, index) => (
              <TableRow key={formation.id}>
                <TableCell>n° {index+1}</TableCell>
                <TableCell>{formation.title}</TableCell>
                <TableCell>{formatDates(formation.dates)}</TableCell>
                <TableCell>
                  <img
                    src={formation.image}
                    alt={formation.alt || formation.title}
                    style={{ width: '100px', height: 'auto', marginBottom: '5px' }}
                    className="rounded-lg"
                  />
                </TableCell>
                <TableCell>{formation.price} €</TableCell>
                <TableCell>{formation.quantity}</TableCell>
                <TableCell>
                  <div className="flex">
                    <Link href={`/dashboard/administrator/formation/${encodeURIComponent(formation.id)}`}>
                      <img src="/iconWorkPlace/edit.svg" alt="" />
                    </Link>
                    <AlertDialogTrigger asChild style={{ marginLeft: '20px' }}>
                      <img
                        src="/iconWorkPlace/trash-2.svg"
                        alt=""
                        onClick={() => {
                          setShowDialog(true);
                          setSelectedFormationId(formation.id);
                        }}
                      />
                    </AlertDialogTrigger>
                    {showDialog && selectedFormationId === formation.id && (
                      <AlertDialogContent key={formation.id}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Voulez-vous vraiment supprimer cette formation ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible, voulez-vous vraiment la supprimer ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setShowDialog(false)}>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(formation.id)}>
                            Valider
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AlertDialog>
    </div>
  );
};

export default DisplayFormations;
