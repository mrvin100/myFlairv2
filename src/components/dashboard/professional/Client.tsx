"use client";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useUserContext } from "@/contexts/user";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface User {
  id: string;
  image: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
}

interface Client {
  id: string;
  status: string;
  clientUser: User;
}

interface Reservation {
  id: string;
  date: string;
  status: string;
  service: {
    title: string;
  };
}

interface ClientsListProps {
  searchTerm: string;
  statusFilter: string;
}

export default function ClientsList({ searchTerm, statusFilter }: ClientsListProps) {  // Corrected the component name here
  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { user } = useUserContext();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    if (!user) return;

    async function fetchClients() {
      try {
        const response = await fetch(`/api/client/get/${user?.id}`);
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }

    fetchClients();
  }, [user]);

  const handleDeleteClient = async (clientId: string) => {
    try {
      const response = await fetch(`/api/client/delete/${clientId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClients(prevClients => prevClients.filter(client => client.id !== clientId));
        setShowDialog(false);
      } else {
        console.error('Erreur lors de la suppression du client.');
      }
    } catch (error) {
      console.error('Erreur lors de la requête de suppression:', error);
    }
  };

  const openDeleteDialog = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowDialog(true);
  };

  const handleViewReservations = async (clientId: string) => {
    try {
      const response = await fetch(`/api/client/getReservation/${clientId}`);
      const data = await response.json();
      setReservations(data);
      console.log('Client reservations:', data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearchTerm = client.clientUser.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientUser.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientUser.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearchTerm && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des clients..."
            className="pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
          />
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          Aucun client trouvé.
        </div>
      ) : (
        filteredClients.map(client => (
          <div key={client.id} className="bg-white w-full border rounded-sm p-4 max-w-4xl mx-auto mb-4">
            <div>
              <Image
                src={client.clientUser.image || "/default-avatar.png"}
                height={120}
                width={120}
                alt="client profile"
                className="rounded-full object-cover h-24 w-24 inline-block mr-4"
              />
              <div
                className={clsx(
                  client.status === "boutique"
                    ? "bg-blue-100 text-blue-600"
                    : "text-[#FFA500] bg-[#FFF4E5]",
                  "rounded-sm py-2 px-3 text-[.7rem] w-auto inline-block"
                )}
              >
                Client {client.status === "boutique" ? "en boutique" : "flair"}
              </div>
            </div>
            <div className="flex flex-auto">
              <ul className="text-sm text-gray-500 my-4 mx-auto flex flex-col gap-3">
                <li>
                  <strong>Nom :</strong> {client.clientUser.firstName}
                </li>
                <li>
                  <strong>Prénom :</strong> {client.clientUser.lastName}
                </li>
                <li>
                  <strong>Email :</strong> {client.clientUser.email}
                </li>
                <li>
                  <strong>Téléphone :</strong> {client.clientUser.phone}
                </li>
                <li>
                  <strong>Adresse :</strong> {client.clientUser.address.street}, {client.clientUser.address.city}, {client.clientUser.address.country}
                </li>
              </ul>
            </div>
            <div className="flex gap-4 items-center flex-wrap justify-end">
              <Button variant={"outline"} onClick={() => openDeleteDialog(client.id)}>
                Supprimer
              </Button>

              <Link href={`/dashboard/professional/Client/${client.clientUser.id}`}>
                <Button variant={"outline"}>Créer une réservation</Button>
              </Link>
              <Button variant={"outline"} onClick={() => handleViewReservations(client.clientUser.id)}>
                Consulter ses réservations
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>Modifier</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-normal">Modifier un client</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[28rem]">
                    <div className="p-4">
                      <form className="space-y-8">
                        {/* Form content here */}
                      </form>
                    </div>
                  </ScrollArea>
                  <div className="flex justify-end space-x-4 mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button>Ajouter</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <AlertDialog open={showDialog && selectedClientId === client.id} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Voulez-vous vraiment supprimer ce client ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible, voulez-vous vraiment supprimer ce client ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setShowDialog(false)}>
                      Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>
                      Valider
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
