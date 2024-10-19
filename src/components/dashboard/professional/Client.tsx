"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import clsx from 'clsx';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Reservation from './Reservation';
import { useUserContext } from "@/contexts/user";

interface Address {
  street: string;
  city: string;
  country: string;
}

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image?: string;
  address: Address;
  notes?: string;
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
    };
  };
}

interface ClientsListProps {
  searchTerm: string;
  statusFilter: string;
}

export default function ClientsList({ searchTerm, statusFilter }: ClientsListProps) {
  const { user } = useUserContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [reservations, setReservations] = useState<Reservations[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReservationsDialogOpen, setIsReservationsDialogOpen] = useState(false);
  const [updatedClient, setUpdatedClient] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchClients();
    }
  }, [user]);

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
    const matchesSearchTerm = client.clientUser.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientUser.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientUser.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearchTerm && matchesStatus;
  });

  const handleOpenEditDialog = (client: Client) => {
    setSelectedClientId(client.id);
    setUpdatedClient({
      ...client.clientUser,
      address: client.clientUser.address || { street: "", city: "", country: "" }
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedClient) return;

    try {
      const response = await fetch(`/api/client/update/${selectedClientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      });
      if (response.ok) {
        await fetchClients();
        setIsEditDialogOpen(false);
      } else {
        console.error('Error updating client');
      }
    } catch (error) {
      console.error('Error during update request:', error);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setImages(Array.from(e.dataTransfer.files));
    }
  };

  const handleDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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
            {client.status === 'flair' ? (
                <Button variant="outline" onClick={() => handleViewReservations(client.clientUser.id)}>
                  Consulter ses réservations
                </Button>
              ) : (
                <>
                  {/* Sinon, pour le statut 'boutique', afficher tous les boutons */}
                  <Button variant="outline" onClick={() => openDeleteDialog(client.id)}>
                    Supprimer
                  </Button>

                  <Link href={`/dashboard/professional/Client/${client.clientUser.id}`}>
                    <Button variant="outline">Créer une réservation</Button>
                  </Link>

                  <Button variant="outline" onClick={() => handleViewReservations(client.clientUser.id)}>
                    Consulter ses réservations
                  </Button>

                  <Button onClick={() => handleOpenEditDialog(client)}>
                    Modifier
                  </Button>
                </>
              )}

              <Dialog open={isReservationsDialogOpen} onOpenChange={setIsReservationsDialogOpen}>
                <DialogContent className="max-w-5xl max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Réservations du client</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-full w-full">
                  {reservations.map(reservation => (
                    <Reservation
                      key={reservation.id}
                      id={reservation.id}
                      typeClient={reservation.service.typeClient}
                      status={reservation.status}
                      date={reservation.dateOfRdv}
                      time={reservation.time}
                      address={reservation.address}
                      note={reservation.note}
                      service={reservation.service.title}
                      price={reservation.service.price}
                      email={reservation.client?.clientUser?.email || 'N/A'}
                      phone={reservation.client?.clientUser?.phone || 'N/A'}
                      image={reservation.client?.clientUser?.image || '/default-image.png'}
                      firstName={reservation.client?.clientUser?.firstName || 'Inconnu'}
                      lastName={reservation.client?.clientUser?.lastName || 'Inconnu'}
                      dureeRDV={reservation.service.dureeRDV}
                    />
                  ))}
                </ScrollArea>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Modifier le client</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-6" onSubmit={handleUpdateClient}>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Informations générales</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="Prénom du client"
                            value={updatedClient?.firstName || ''}
                            onChange={(e) => setUpdatedClient({...updatedClient!, firstName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Nom du client"
                            value={updatedClient?.lastName || ''}
                            onChange={(e) => setUpdatedClient({...updatedClient!, lastName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            placeholder="Email du client"
                            value={updatedClient?.email || ''}
                            onChange={(e) => setUpdatedClient({...updatedClient!, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="Téléphone du client"
                            value={updatedClient?.phone || ''}
                            onChange={(e) => setUpdatedClient({...updatedClient!, phone: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="street">Adresse</Label>
                          <Input
                            id="street"
                            name="street"
                            placeholder="Rue"
                            value={updatedClient?.address?.street || ''}
                            onChange={(e) => setUpdatedClient({...updatedClient!, address: {...updatedClient!.address, street: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">Ville</Label>
                          <Input
                            id="city"
                            name="city"
                            placeholder="Ville du client"
                            value={updatedClient?.address?.city || ''}
                            onChange={(e) => setUpdatedClient({...updatedClient!, address: {...updatedClient!.address, city: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Pays</Label>
                          <Input
                            id="country"
                            name="country"
                            placeholder="Pays du client"
                            value={updatedClient?.address?.country || ''}
                            onChange={(e) => setUpdatedClient({...updatedClient!, address: {...updatedClient!.address, country: e.target.value}})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Remarques</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          placeholder="Remarques"
                          value={updatedClient?.notes || ''}
                          onChange={(e) => setUpdatedClient({...updatedClient!, notes: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image">Image du client</Label>
                        <div
                          className="border-dashed border-2 p-4 cursor-pointer"
                          onDrop={handleDrop}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <input
                            type="file"
                            id="image"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                          <label htmlFor="image" className="cursor-pointer">
                            {images.length === 0 ? (
                              <p>Glissez ou cliquez pour ajouter une image</p>
                            ) : (
                              <div className="relative">
                                <img src={URL.createObjectURL(images[0])} alt="Client Image" className="object-cover h-32 w-32" />
                                <button
                                  type="button"
                                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                  onClick={() => handleDelete(0)}
                                >
                                  X
                                </button>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <Button type="submit">
                      Enregistrer les modifications
                    </Button>
                  </form>
                  <DialogClose>Fermer</DialogClose>
                </DialogContent>
              </Dialog>

            </div>
          </div>
        ))
      )}

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce client ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Tous les fichiers et données associés à ce client seront supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDialog(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteClient(selectedClientId!)}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}