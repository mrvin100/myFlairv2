"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useParams } from 'next/navigation';
import { CircleCheckBig, User } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { fr } from 'date-fns/locale';
import { useToast } from "@/components/ui/use-toast";
import { Services } from "@/components/dashboard/professional";

interface Service {
  id: string;
  name: string;
  description: string;
  domicile: boolean;
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
  services: Service[]; // Changer ici pour services au lieu de service
}

interface User {
  id: string;
  stripeCustomerId?: string;
  image: string;
  gallery: string[];
  role: string;
  username: string;
  firstName: string;
  lastName: string;
  address: {
    city: string;
    street: string;
    country: string;
  };
  enterprise?: string;
  homeServiceOnly: boolean;
  services: Service[];
}

const RendezVous = ({ params }: { params: { id: string, slug: string } }) => {
  const { id, slug } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [addressComplement, setAddressComplement] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const { toast } = useToast();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    async function fetchClient() {
      if (!id) return;

      try {
        const response = await fetch(`/api/client/getClientId/${id}`);
        const data: Client = await response.json();
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
      if (!client?.proId || !slug) return;
  
      try {
        const response = await fetch(`/api/serviceProfessional/getByProId/${client.proId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const services: Service[] = Array.isArray(data) ? data : []; // Assure-toi que `services` est un tableau
  
        console.log('Fetched services:', services);
  
        const foundService = services.find((service) => service.id === slug);
  
        if (foundService) {
          setService(foundService);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
  
    fetchServices();
  }, [client, slug]);
  

  const timeSlots = [
    "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45",
    "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45",
    "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45",
    "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45",
    "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30"
  ];
  const unavailableSlots = ["13:30", "14:00", "18:30"];
  const indisponibilitySlots = ["21:00","21:15", "21:30","21:45", "22:00","22:15", "22:30","22:45", "23:00","23:15", "23:30"];

  const unavailableDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleReservation = async () => {
    if (!selectedTime || !date || (client && client.status === "boutique" && (!address || !city || !postalCode))) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs nécessaires.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/client/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date.toISOString(),
          time: selectedTime,
          address,
          city,
          postalCode,
          addressComplement,
          note,
          clientId: client?.id,
          userId: client?.proId,
        }),
      });

      if (response.ok) {
        toast({
          title: "Réservation confirmée",
          description: "Votre rendez-vous a été réservé avec succès."
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Erreur",
          description: errorData.error || "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue, veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div style={{ paddingRight: "5%", paddingLeft: "5%", width: "100%" }}>
        <br />
        <div className="w-full max-w-3xl mx-auto mt-8 space-y-8">
          <section>
            <h2 className="text-lg font-normal mb-4">
              Créer une réservation pour : {client?.clientUser.firstName} {client?.clientUser.lastName} {params.id}
            </h2>
            <div className="flex items-center mb-4 md:mb-0">
              <Avatar className="w-16 h-16 mr-4">
                <AvatarImage src={client?.clientUser.image} alt="Client Image" />
              </Avatar>
              <div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <div
                    className={`${
                      client?.status === "boutique"
                      ? "text-[#4C40ED] bg-[#F7F7FF]" 
                      : "text-[#FFA500] bg-[#FFF4E5]" 
                    } py-2 px-3 rounded-md text-[.7rem]`}
                  >
                    {client?.status === "boutique" ? "Client Boutique" : "Client Flair"}
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <User className="w-4 h-4 mr-1" />
                  <span>{client?.clientUser.firstName} {client?.clientUser.lastName}</span>
                </div>
                {service && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Détails du service</h3>
                    <p className="mt-2"><strong>Nom : </strong>{service.name}</p>
                    <p className="mt-1"><strong>Description : </strong>{service.description}</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h3 className="font-normal mb-4">
                  Sélectionner la date du rendez-vous
                </h3>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (selectedDate && !unavailableDates(selectedDate)) {
                      setDate(selectedDate);
                    }
                  }}
                  className="rounded-md border"
                  locale={fr}
                  disabled={date => unavailableDates(date)}
                />
              </div>
              <div className="md:col-span-2">
                <h3 className="font-normal mb-4">
                  Choisir l'heure du rendez-vous
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={
                        unavailableSlots.includes(time)
                          ? "destructive"
                          : indisponibilitySlots.includes(time)
                          ? "ghost"
                          : selectedTime === time
                          ? "default"
                          : "outline"
                      }
                      className={`w-full ${unavailableSlots.includes(time) ? "cursor-not-allowed" : ""}`}
                      onClick={() =>
                        !unavailableSlots.includes(time) &&
                        !indisponibilitySlots.includes(time) &&
                        setSelectedTime(time)
                      }
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {service?.domicile && (
            <section className="mt-8">
              <h3 className="font-normal mb-4">
                Informations supplémentaires
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Adresse"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Ville"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Code postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Complément d'adresse (optionnel)"
                  value={addressComplement}
                  onChange={(e) => setAddressComplement(e.target.value)}
                  className="p-2 border rounded-md"
                />
                <textarea
                  placeholder="Note (optionnel)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="p-2 border rounded-md"
                />
              </div>
            </section>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              disabled={!selectedTime || !date || (service?.domicile && (!address || !city || !postalCode))}
              onClick={handleReservation}
            >
              Réserver
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RendezVous;
