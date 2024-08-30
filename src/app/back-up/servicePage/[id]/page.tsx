"use client";

import { Calendar } from "@/components/ui/calendar";
import { fr } from 'date-fns/locale';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  MessageCircle,
  Phone,
  Scissors,
  Share2,
  Star,
  Youtube,
} from "lucide-react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface Service {
  id: string;
  title: string;
  description: string;
  imageProfil: string;
  ville: string;
  pays: string;
  price: string;
  category: string;
  domicile: boolean;
  dureeRDV: string;
  user: {
    id: string;
    image: string;
    address: {
      city: string;
      country: string;
      street: string;
    };
    firstName: string;
    lastName: string;
    phone: string;
    numberOfRate: number;
  };
}

const DateChoice = ({ params }: { params: { id: string } }) => {
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [addressComplement, setAddressComplement] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/serviceProfessional/getById/${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Service = await response.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  if (!service) {
    return (
      <div className='flex flex-col justify-center items-center'>
        Chargement en cours...
      </div>
    );
  }

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
  ];
  const unavailableSlots = ["13:30", "14:00", "18:30"];
  const indisponibilitySlots = ["21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];

  const handleReservation = async () => {
    if (!selectedTime || !date) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date et une heure.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/serviceProfessional/book', {
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
          serviceId: service.id,
          userId: service.user.id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Réservation confirmée",
          description: "Votre rendez-vous a été réservé avec succès."
        });
        router.push('/confirmation'); 
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(() => {
       
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Lien copié",
          description: "Lien copié dans le presse-papiers !",
        });
      }).catch(() => {
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien.",
          variant: "destructive",
        });
      });
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${service.user.phone}`;
  };

  // Fonction pour désactiver les dates avant aujourd'hui
  const unavailableDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 pl-8 pr-2 pt-8 pb-8 md:flex">
      <Card className="w-full max-w-4xl mx-auto border-hidden shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Link href={`/back-up/Profil/${service.user.id}`}>
                <Avatar className="w-16 h-16 mr-4">
                  <AvatarImage src={service.user.image} alt="Melina Beauty" />
                </Avatar>
              </Link>
              <div>
                <Link href={`/back-up/Profil/${service.user.id}`}>
                  <h2 className="text-2xl font-bold">
                    {service.user.firstName} {service.user.lastName}
                  </h2>
                </Link>
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({service.user.numberOfRate} avis)
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Scissors className="w-4 h-4 mr-1" />
                  <span>Coiffeuse</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>
                    {service.user.address.street}, {service.user.address.city}, {service.user.address.country}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="flex space-x-2 mb-2">
                <Button variant="outline" size="icon">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Youtube className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                {service.user.phone && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        window.location.href = `sms:${service.user.phone}`;
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCall}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl my-4">Prestation :</h2>
            {[1].map((index) => (
              <Card key={index} className="mb-4">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {service.category}
                      </Badge>
                      <h3 className="text-xl font-semibold mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      {service.domicile && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Service à domicile
                        </Badge>
                      )}
                      <div className="text-right mt-4">
                        <p className="text-2xl font-bold">{service.price} €</p>
                        <p className="text-sm text-muted-foreground">
                          Durée : {service.dureeRDV}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-xl my-6">Réservation :</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold mb-4">
                Sélectionner la date du rendez-vous
              </h3>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  
                  if (!unavailableDates(selectedDate)) {
                    setDate(selectedDate);
                  }
                }}
                className="rounded-md border"
                locale={fr}
                disabled={date => unavailableDates(date)}
              />
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold mb-4">
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
                      setSelectedTime(time)
                    }
                    disabled={unavailableSlots.includes(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          {service.domicile && (
            <div className="mt-6">
            <h2 className="text-xl mb-4">Adresse :</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Adresse"
                />
              </div>
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ville"
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Code Postal</Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Code Postal"
                />
              </div>
              <div>
                <Label htmlFor="addressComplement">Complément d'adresse</Label>
                <Input
                  id="addressComplement"
                  value={addressComplement}
                  onChange={(e) => setAddressComplement(e.target.value)}
                  placeholder="Complément d'adresse"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note"
              />
            </div>
          </div>
          )}
          {service.domicile ? (
            <div className="mt-6 flex justify-end">
            <Button disabled={!selectedTime || !date || !address || !city || !postalCode} onClick={handleReservation}>Réserver</Button>
          </div>
          ) : (
            <div className="mt-6 flex justify-end">
            <Button disabled={!selectedTime || !date} onClick={handleReservation}>Réserver</Button>
          </div>
          )}
          
        </CardContent>
      </Card>
      
    </div>
  );
};

export default DateChoice;