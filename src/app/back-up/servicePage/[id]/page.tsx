"use client";

import { Calendar } from "@/components/ui/calendar";
import { fr } from 'date-fns/locale';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { AvatarImage, Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from '@/contexts/user';
import { format, parse } from 'date-fns';


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
    preferencesProWeek: {
      availabilities: {
        [key: string]: Availability[];
      };
      availabilitiesPeriods: any;
    };
  };
}

interface Availability {
  from: string;
  to: string;
}

const DateChoice = ({ params }: { params: { id: string } }) => {
  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [addressComplement, setAddressComplement] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUserContext();
  const availabilitiesPeriods = service?.user.preferencesProWeek.availabilitiesPeriods;
  const [unavailableSlots, setUnavailableSlots] = useState<{ [key: string]: Availability[] }>({});
  const [unavailableDates, setUnavailableDates] = useState([]);
const normalizeDateString = (dateString) => {
  return dateString
  .replace(/janvier/gi, 'janvier')
  .replace(/février|fevrier/gi, 'février') 
  .replace(/mars/gi, 'mars') 
  .replace(/avril/gi, 'avril')
  .replace(/mai/gi, 'mai') 
  .replace(/juin/gi, 'juin') 
  .replace(/juillet|juil/gi, 'juillet')
  .replace(/août|aout/gi, 'août') 
  .replace(/septembre/gi, 'septembre') 
  .replace(/octobre/gi, 'octobre') 
  .replace(/novembre/gi, 'novembre') 
  .replace(/décembre|decembre/gi, 'décembre'); 
};

  const timeSlots = [
    "08:00","08:15","08:30","08:45",
    "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45",
    "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45",
    "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45",
    "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30"
  ];

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/serviceProfessional/getById/${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Service = await response.json();
        setService(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);


  useEffect(() => {
    if (availabilitiesPeriods && availabilitiesPeriods.length > 0) {
      const allUnavailableDates = [];
  
      availabilitiesPeriods.forEach((availability) => {
        const startDate = normalizeDateString(availability.from);
        const endDate = normalizeDateString(availability.to);
  
        const parsedStartDate = parse(startDate, 'dd MMMM yyyy', new Date(), { locale: fr });
        const parsedEndDate = parse(endDate, 'dd MMMM yyyy', new Date(), { locale: fr });
  
        // Créer un tableau des dates indisponibles pour chaque période
        const datesToMarkAsUnavailable = [];
        const currentDate = new Date(parsedStartDate);
  
        // Remplir le tableau avec les dates entre startDate et endDate
        while (currentDate <= parsedEndDate) {
          datesToMarkAsUnavailable.push(format(currentDate, 'yyyy-MM-dd'));
          currentDate.setDate(currentDate.getDate() + 1); // Incrémenter d'un jour
        }
  
        // Ajouter les dates de cette période au tableau total
        allUnavailableDates.push(...datesToMarkAsUnavailable);
      });
  
      // Mettre à jour l'état avec toutes les dates indisponibles
      setUnavailableDates(allUnavailableDates);
      console.log('Unavailable Dates:', allUnavailableDates);
    }
  }, [availabilitiesPeriods]);
  useEffect(() => {
    if (service?.user.preferencesProWeek) {
      const allUnavailableSlots: { [key: string]: Availability[] } = {};

      // Collect all unavailable time slots for each day
      Object.keys(service.user.preferencesProWeek.availabilities).forEach((day) => {
        const availabilities = service.user.preferencesProWeek.availabilities[day];

        if (day === 'Tous les jours') {
          availabilities.forEach(slot => {
            allUnavailableSlots[day] = allUnavailableSlots[day] || [];
            allUnavailableSlots[day].push(slot);
          });
        } else {
          
          if (availabilities.length > 0) {
            allUnavailableSlots[day] = availabilities;
          }
        }
      });

      setUnavailableSlots(allUnavailableSlots);
    }
  }, [service]);

  const getDisabledTimeSlots = (day: string) => {
    const slotsForDay = unavailableSlots[day] || [];
    return slotsForDay.reduce<string[]>((disabled, slot) => {
      const startIdx = timeSlots.indexOf(slot.from);
      const endIdx = timeSlots.indexOf(slot.to);
      if (startIdx !== -1 && endIdx !== -1) {
        return [
          ...disabled,
          ...timeSlots.slice(startIdx, endIdx + 1)
        ];
      }
      return disabled;
    }, []);
  };
  if (!service) {
    return (
      <div className='flex flex-col justify-center items-center'>
        Chargement en cours...
      </div>
    );
  }
  
 
  const handleReservation = async () => {
    if (!selectedTime || !selectedDate) {
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
          date: selectedDate,
          time: selectedTime,
          address,
          city,
          postalCode,
          addressComplement,
          note,
          serviceId: service.id,
          userId: service.user.id,
          clientId: user?.id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Réservation confirmée",
          description: "Votre rendez-vous a été réservé avec succès."
        });
        router.push('/');
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
      }).catch(() => { });
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

 
  const disableDays = (date) => {
    return unavailableDates.includes(format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 pl-8 pr-2 pt-8 pb-8 md:flex">
      <Card className="w-full max-w-4xl mx-auto border-hidden shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Link href={`/back-up/Profil/${service.user.id}`}>
                <Avatar className="w-16 h-16 mr-4">
                  <AvatarImage src={service.user.image} alt="Profil Image" />
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
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleCall}>
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Sélectionnez une date</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={fr}
          disabled={disableDays}
/>

      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Sélectionnez une heure</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {timeSlots.map((time) => {
          const isDisabled = getDisabledTimeSlots(selectedDate ? format(selectedDate, 'EEEE') : '')?.includes(time);
          return (
            <Button key={time} disabled={isDisabled} onClick={() => !isDisabled && setSelectedTime(time)}>
              {time}
            </Button>
          );
        })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Adresse</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              placeholder="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                placeholder="Ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Code Postal</Label>
              <Input
                id="postalCode"
                placeholder="Code Postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="addressComplement">Complément d'adresse</Label>
            <Input
              id="addressComplement"
              placeholder="Complément d'adresse"
              value={addressComplement}
              onChange={(e) => setAddressComplement(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="note">Note (optionnel)</Label>
            <Textarea
              id="note"
              placeholder="Ajouter une note (optionnel)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button className="mt-8" onClick={handleReservation}>Réserver</Button>
    </div>
  );
};

export default DateChoice;
