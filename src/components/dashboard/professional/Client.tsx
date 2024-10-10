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
import Reservation from './Reservation';

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

interface Reservations {
  id: string;
  service: {
    typeClient: string;
    title: string;
    price: number;
    dureeRDV: string;
  };
  status: string;
  dateOfRdv: string;
  time: string;
  address: string;
  note: string;
  user: {
    email: string;
    phone: string;
    image: string;
  };
  client?: {
    email?: string;
    phone?: string;
    image?: string;
    firstName?: string;
    lastName?: string;
    clientUser: {
      firstName: string;
      lastName: string;
      image: string;
      phone: string;
      email: string;
    }
  }
}

interface ClientsListProps {
  searchTerm: string;
  statusFilter: string;
}

export default function ClientsList({ searchTerm, statusFilter }: ClientsListProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservations[]>([]);
  const { user } = useUserContext();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReservationsDialogOpen, setIsReservationsDialogOpen] = useState(false);
  const [updatedClient, setUpdatedClient] = useState<User | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const response = await fetch(`/api/client/get/${user?.id}`);
      const data = await response.json();
      setClients(data);
      console.log("Clients fetched:", data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }

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
      setIsReservationsDialogOpen(true);
      console.log('Client reservations:', data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const filteredClients = clients.filter(client => {
    const fullName = `${client.clientUser.firstName.toLowerCase()} ${client.clientUser.lastName.toLowerCase()}`;
    
    const matchesSearchTerm = client.clientUser.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fullName.includes(searchQuery.toLowerCase()) ||
      client.clientUser.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientUser.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientUser.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientUser.address.street.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.clientUser.address.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
      client.clientUser.address.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearchTerm && matchesStatus;
  });

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatedClient?.id) {
      try {
        const response = await fetch(`/api/client/update/${selectedClientId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedClient),
        });
        if (response.ok) {
          fetchClients();
          setShowDialog(false);
        } else {
          console.error('Erreur lors de la mise à jour du client');
        }
      } catch (error) {
        console.error('Erreur lors de la requête de mise à jour :', error);
      }
    }
  };

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
            onChange={(e) => setSearchQuery(e.target.value)}
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
                  client?.status === "boutique"
                    ? "text-[#4C40ED] bg-[#F7F7FF]"
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
              {client.status === "boutique" ? (
                <>
                  <Button variant={"outline"} onClick={() => openDeleteDialog(client.id)}>
                    Supprimer
                  </Button>
                  <Link href={`/dashboard/professional/Client/${client.clientUser.id}`}>
                    <Button variant={"outline"}>Créer une réservation</Button>
                  </Link>
                  <Button variant={"outline"} onClick={() => handleViewReservations(client.clientUser.id)}>
                    Consulter ses réservations
                  </Button>
                  {/* Dialog pour modifier le client */}
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
                          <form className="space-y-4" onSubmit={handleUpdateClient}>
                            <div>
                              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                Prénom
                              </label>
                              <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                defaultValue={updatedClient?.firstName || ""}
                                onChange={(e) => setUpdatedClient({ ...updatedClient, firstName: e.target.value } as User)}
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Nom
                              </label>
                              <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                defaultValue={updatedClient?.lastName || ""}
                                onChange={(e) => setUpdatedClient({ ...updatedClient, lastName: e.target.value } as User)}
                                required
                              />
                            </div>
                            {/* Autres champs à ajouter ici */}
                          </form>
                        </div>
                      </ScrollArea>
                      <div className="flex justify-end space-x-4 mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button type="submit">Ajouter</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <Button variant={"outline"} onClick={() => handleViewReservations(client.clientUser.id)}>
                  Consulter ses réservations
                </Button>
              )}
            </div>
          </div>
        ))
      )}

      {/* Dialog de confirmation pour supprimer le client */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDialog(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (selectedClientId) {
                handleDeleteClient(selectedClientId);
              }
            }}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog pour afficher les réservations du client */}
      <Dialog open={isReservationsDialogOpen} onOpenChange={setIsReservationsDialogOpen}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Réservations du client</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[28rem]">
            <div className="p-4">
              {reservations.length === 0 ? (
                <div>Aucune réservation trouvée.</div>
              ) : (
                Array.isArray(reservations) && reservations.map(reservation => (
                  <Reservation key={reservation.id}
                    id={reservation.id} 
                    typeClient={reservation.service.typeClient}
                    status={reservation.status}
                    date={reservation.dateOfRdv}
                    time={reservation.time}
                    address={reservation.address}
                    note={reservation.note}
                    service={reservation.service.title}
                    price={reservation.service.price}
                    email={reservation.user.email}
                    phone={reservation.user.phone}
                    image={reservation.user.image}
                    dureeRDV={reservation.service.dureeRDV} />
                ))
              )}
            </div>
          </ScrollArea>

          <DialogClose asChild className='flex items-start w-[80px]'>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
