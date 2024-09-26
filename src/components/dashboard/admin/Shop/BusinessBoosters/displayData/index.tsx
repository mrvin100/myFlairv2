
"use client";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
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
import { fr } from 'date-fns/locale'; 


interface BusinessBooster {
  id: string;
  image: string;
  alt?: string;
  title: string;
  description: string;
  quantity: number;
  price: number;
  dates: { date: string; available: number }[];
  createdAt: string;
  updatedAt: string;
  idStripe?: string;
}

interface DisplayBusinessBoostersProps {
  businessBoosters: BusinessBooster[];
  setBusinessBoosters: React.Dispatch<React.SetStateAction<BusinessBooster[]>>;
}




const DisplayBusinessBoosters: React.FC<DisplayBusinessBoostersProps> = ({
  businessBoosters,
  setBusinessBoosters,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBoosterId, setSelectedBoosterId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/businessBoosters/get", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: BusinessBooster[]) => {
        console.log("Business Boosters fetched:", data);
        data.forEach(booster => {
          console.log(`Booster ${booster.id} dates:`, booster.dates);
        });
        setBusinessBoosters(data);
      })
      .catch((error) => console.error("Error fetching business boosters", error));
  }, [setBusinessBoosters]);
  

  const handleDelete = async (id: string) => {
    try {
      await deleteBusinessBoosterById(id);
      setBusinessBoosters((prevBusinessBoosters) =>
        prevBusinessBoosters.filter((booster) => booster.id !== id)
      );
      setShowDialog(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du Business Booster:", error);
    }
  };

  async function deleteBusinessBoosterById(id: string) {
    const response = await fetch(`/api/businessBoosters/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    return response.json();
  }
  const formatDates = (dates: { date: string; available: number }[]) => {
        if (!Array.isArray(dates) || dates.length === 0) return 'Aucune date disponible';
  
    const sortedDates = dates
      .map(({ date }) => ({
        date: parseISO(date),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
      if (sortedDates.length === 0) return 'Aucune date disponible';
  
    const startDate = format(sortedDates[0].date, 'dd MMMM yyyy', { locale: fr });
    const endDate = format(sortedDates[sortedDates.length - 1].date, 'dd MMMM yyyy', { locale: fr });
  
    return `Du ${startDate} au ${endDate}`;
  };
  
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Business Booster</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Tarif</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businessBoosters.map((booster) => (
            <TableRow key={booster.id}>
              <TableCell>n° {booster.id}</TableCell>
              <TableCell>{booster.title}</TableCell>
              <TableCell>
                <img
                  src={booster.image || '/default-image.jpg'}
                  alt={booster.alt || booster.title}
                  style={{ width: '100px', height: 'auto', marginBottom: '5px' }}
                  className="rounded-lg"
                />
              </TableCell>
              <TableCell>{formatDates(booster.dates)}</TableCell>
              <TableCell>{booster.price} €</TableCell>
              <TableCell>{booster.quantity}</TableCell>
              <TableCell>
                <div className="flex">
                  <Link
                    href={`/dashboard/administrator/businessBooster/${encodeURIComponent(
                      booster.id
                    )}`}
                  >
                    <img src="/iconWorkPlace/edit.svg" alt="Edit" />
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <img
                        src="/iconWorkPlace/trash-2.svg"
                        alt="Delete"
                        onClick={() => {
                          setShowDialog(true);
                          setSelectedBoosterId(booster.id);
                        }}
                        style={{ marginLeft: '20px' }}
                      />
                    </AlertDialogTrigger>
                    {showDialog && selectedBoosterId === booster.id && (
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Voulez-vous vraiment supprimer ce Business Booster ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Voulez-vous vraiment le supprimer ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setShowDialog(false)}>
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDelete(booster.id);
                              setShowDialog(false);
                            }}
                          >
                            Valider
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    )}
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DisplayBusinessBoosters;
