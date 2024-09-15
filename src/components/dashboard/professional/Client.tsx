'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { Phone, Upload, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUserContext } from "@/contexts/user";

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

export default function Client() {
  const [clients, setClients] = useState<Client[]>([]);
  const { user } = useUserContext();

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

  return (
    <div>
      {clients.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          Aucun client trouvé pour cet utilisateur.
        </div>
      ) : (
        clients.map(client => (
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
                    : "text-black-500 bg-gray-300",
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
              <Button variant={"outline"}>Supprimer</Button>
              <Link href={`/dashboard/professional/Client/${client.clientUser.id}`}>
                <Button variant={"outline"}>Créer une réservation</Button>
              </Link>
              <Button variant={"outline"}>Consulter ses réservations</Button>
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
            </div>
          </div>
        ))
      )}
    </div>
  );
}
