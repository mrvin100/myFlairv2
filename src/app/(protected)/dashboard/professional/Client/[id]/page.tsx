'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Search, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  category: string;
  price: string;
  description: string;
  dureeRDV: string;
  domicile: boolean;
  image: string;
  [key: string]: string | boolean;
}

interface Client {
  id: string;
  status: string;
  image: string;
  firstName: string;
  proId: string;
  lastName: string;
  clientUser: {
    image: string;
    firstName: string;
    lastName: string;
  };
}

const AjouterUneReservation = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<{ [category: string]: Service[] }>({});

  useEffect(() => {
    async function fetchClient() {
      if (!id) return;

      try {
        const response = await fetch(`/api/client/getClientId/${id}`);
        const data = await response.json();
        setClient(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching client:', error);
      }
    }

    fetchClient();
  }, [id]);

  useEffect(() => {
    async function fetchServices() {
      if (!client?.proId) return;

      try {
        const response = await fetch(`/api/serviceProfessional/getByProId/${client.proId}`);

        if (!response.ok) {
          throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }

        const data = await response.json();

        // Vérifiez si 'data' est un tableau directement
        if (!Array.isArray(data)) {
          throw new Error('La réponse API ne contient pas un tableau de services valide');
        }

        const services = data; // Utilisez directement 'data'

        const groupedServices = services.reduce((acc: any, service: Service) => {
          acc[service.category] = acc[service.category] || [];
          acc[service.category].push(service);
          return acc;
        }, {});

        setServices(services);
        setFilteredServices(groupedServices);
      } catch (error) {
        console.error('Erreur lors de la récupération des services :', error);
      }
    }

    fetchServices();
  }, [client]);

  if (loading) {
    return (
      <div style={{ paddingRight: "5%", paddingLeft: '5%', width: '100%', textAlign: 'center', marginTop: '50px' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingRight: "5%", paddingLeft: '5%', width: '100%' }}>
      <br />
      <div className="w-full max-w-3xl mx-auto mt-8 space-y-8">
        <section>
          <h2 className="text-lg font-normal mb-4">Créer une Réservation pour :</h2>
          <div className="flex items-center mb-4 md:mb-0">
            <Avatar className="w-16 h-16 mr-4">
              <AvatarImage
                src={client?.clientUser.image || 'default-image-url'}
                alt={client?.clientUser.firstName || "Client"}
              />
            </Avatar>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <div
                  className={`${client?.status === "boutique"
                    ? "text-[#4C40ED] bg-[#F7F7FF]"
                    : "text-[#FFA500] bg-[#FFF4E5]"} py-2 px-3 rounded-md text-[.7rem]`}
                >
                  {client?.status === "boutique" ? "Client Boutique" : "Client Flair"}
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <User className="w-4 h-4 mr-1" />
                <span>{client?.clientUser.firstName} {client?.clientUser.lastName}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section>
          <h2 className="text-lg font-normal mb-4">Sélectionner une prestation :</h2>
          <form className="mr-auto flex-1 sm:flex-initial my-4">
            <div className="relative sm:w-[340px] md:w-[240px] lg:w-[340px]">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pr-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>

          {Object.keys(filteredServices).map((category) => (
            <div key={category} className="mb-6">
              <Badge variant="secondary" className="mb-4">Catégorie : {category}</Badge>

              {filteredServices[category].map((service, index) => (
                <Card key={service.id} className="mb-4"> {/* Utilisez service.id pour la clé */}
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">{category}</Badge>
                        <h3 className="text-xl font-normal mb-2">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        {service.domicile && (
                          <Badge className={`bg-[#EAF8ED] shadow-none  text-[#2DB742]`}>
                            Service à domicile
                          </Badge>
                        )}
                        <div className="text-right mt-4">
                          <p className="text-2xl font-semibold">{service.price} €</p>
                          <p className="text-sm text-muted-foreground">Durée : {service.dureeRDV}</p>
                        </div>
                        <Link href={`/dashboard/professional/Client/${id}/rendez-vous/${service.id}`}>
                          <Button className="mt-4">Réserver</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </section>
      </div>
      <br />
    </div>
  );
};

export default AjouterUneReservation;
