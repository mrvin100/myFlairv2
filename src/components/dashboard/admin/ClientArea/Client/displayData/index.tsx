"use client";
import { useEffect, useState } from "react";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface NewClient {
  id: string;
  lastName: string;
  firstName: string;
  nameOfSociety: string;
  image: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  password: string;
  role: string;
  homeServiceOnly: boolean;
  billingAddress?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  preferences: {};
  createdAt: string;
}

const DisplayClients = () => {
  const [clients, setClients] = useState<NewClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<NewClient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | "all">("all");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isPending, setIspending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIspending(true);
    fetch(`${window.location.origin}/api/utilisateur/getAll`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: NewClient[]) => {
        setClients(data);
        setFilteredClients(data);
        setIspending(false);
      })
      .catch((error) => console.error("Error fetching clients", error));
  }, []);

  useEffect(() => {
    const filtered = clients.filter((client) => {
      const searchTerms = searchTerm.toLowerCase().split(" ").filter(Boolean);

      const matchesSearchTerm = searchTerms.every(
        (term) =>
          client.firstName.toLowerCase().includes(term) ||
          client.lastName.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          (client.address.street + " " + client.address.city)
            .toLowerCase()
            .includes(term)
      );

      const matchesRole =
        selectedRole === "all" || client.role?.toUpperCase() === selectedRole;

      return matchesSearchTerm && matchesRole;
    });

    setFilteredClients(filtered);
  }, [searchTerm, selectedRole, clients]);

  const handleDelete = async (id: string) => {
    try {
      await deleteClientById(id);
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== id)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
    }
  };

  async function deleteClientById(id: string) {
    const response = await fetch(`/api/utilisateur/delete/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    return response.json();
  }

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Input
          type="text"
          placeholder="Rechercher par nom, prénom, adresse ou email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[300px]" // Ajoutez cette ligne pour définir la largeur
        />
        <div className="w-[300px]">
          <Select
            onValueChange={setSelectedRole}
            value={selectedRole}
            className="mt-2" // Ajoutez cette ligne pour définir la largeur
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="ADMINISTRATOR">Administrateur</SelectItem>
              <SelectItem value="PROFESSIONAL">Professionel</SelectItem>
              <SelectItem value="PERSONAL">Particulier</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table className="overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-min-[500px] whitespace-nowrap overflow-hidden text-ellipsis">
              Nom & Prénom
            </TableHead>
            <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">
              Adresse
            </TableHead>
            <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">
              Numéro de téléphone
            </TableHead>
            <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">
              Email
            </TableHead>
            <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">
              Rôle
            </TableHead>
            <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">
              Date d'inscription
            </TableHead>
            <TableHead className="whitespace-nowrap overflow-hidden text-ellipsis">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            <TableRow>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
            </TableRow>
          ) : filteredClients && filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="w-min-[300px] text-center whitespace-nowrap overflow-hidden text-ellipsis">{`${client.firstName} ${client.lastName}`}</TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">{`${client.address.street}, ${client.address.city}, ${client.address.postalCode}`}</TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {client.phone}
                </TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {client.email}
                </TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="flex justify-center">
                    {client.role || "-"}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {client.createdAt
                    ? format(parseISO(client.createdAt), "eeee d MMMM yyyy", {
                        locale: fr,
                      })
                    : "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                  <div className="flex">
                    <Link
                      href={`/dashboard/administrator/client/${encodeURIComponent(client.id)}`}
                    >
                      <img src="/iconWorkPlace/edit.svg" alt="Edit" />
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <img
                          className="ml-5"
                          src="/iconWorkPlace/trash-2.svg"
                          alt="Delete"
                          onClick={() => {
                            setSelectedClientId(client.id);
                          }}
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Voulez-vous vraiment supprimer ce client ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible, voulez-vous vraiment
                            le supprimer ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setSelectedClientId(null)}
                          >
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDelete(client.id);
                              setSelectedClientId(null);
                            }}
                          >
                            Valider
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center p-5">
                Aucun client présent
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DisplayClients;
