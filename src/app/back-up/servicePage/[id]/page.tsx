"use client";
import { Calendar } from "@/components/ui/calendar";
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

interface Service {
  id: number;
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
    };
    firstName: string;
    lastName: string;
  };
}

const DateChoice = ({ params }: { params: { id: string } }) => {
  // const [service, setService] = useState<Service | null>(null);
  // const [date, setDate] = useState<Date | undefined>(new Date())
  // useEffect(() => {
  //   const fetchService = async () => {
  //     try {
  //       const response = await fetch(`/api/serviceProfessional/getById/${params.id}`, {
  //         headers: {
  //           'Cache-Control': 'no-cache',
  //           'Pragma': 'no-cache',
  //           'Expires': '0',
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data: Service = await response.json();
  //       setService(data);
  //     } catch (error) {
  //       console.error('Error fetching service:', error);
  //     }
  //   };
  //   if (params.id) {
  //     fetchService();
  //   }
  // }, [params.id]);

  // if (!service) {
  //   return <div className='flex flex-col justify-center items-center'>Chargement en cours...</div>;
  // }

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  // Définir la durée souhaitée pour la réservation en minutes
  const duration = 30; // exemple: 30 minutes

  // Calculer l'intervalle en minutes
  const interval = 15;

  const timeSlots = [
    "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45",
    "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45",
    "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45",
    "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45",
    "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45",
    "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45",
    "23:00", "23:15", "23:30",
  ];

  const unavailableSlots = ["13:30", "14:00", "18:30"];

  const getNextSlots = (startTime: string) => {
    const startMinutes = timeToMinutes(startTime);
    const slots = [];
    let currentMinutes = startMinutes;

    while (currentMinutes < startMinutes + duration) {
      const nextSlot = minutesToTime(currentMinutes);
      if (timeSlots.includes(nextSlot)) {
        slots.push(nextSlot);
      }
      currentMinutes += interval;
    }
    return slots;
  };


  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const selectedSlots = selectedTime ? getNextSlots(selectedTime) : [];

  console.log("Selected time : ", selectedTime);
  console.log("Selected Slots : ", selectedSlots);

  return (
    <>
      {/* <div className="h-full flex-1 flex-col space-y-8 pl-[10%] pr-[10%] pt-8 md:flex">
      <div className="">
        <div className="flex flex-row">
          <Image
          alt="image Of Professional"
          src={service.user.image}
          />
          <h1 className="flex flex-row items-center text-2xl">
            {service.user.firstName} {service.user.lastName}
          </h1>
        </div>
        <div className="flex flex-row items-center text-lg" style={{ marginTop: '20px' }}>
          <div className="flex flex-row items-center text-sm text-slategray">
            <img src="/iconService/map-pin-3.svg" alt="" className="flex items-center" />
            <div className="flex items-center" style={{ marginLeft: '10px' }}>
            <p className="text-[#E5E5E5]">{`${service.user.address.city}, ${service.user.address.country}`}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700' }} className="text-2xl">Prestation :</span>
        <div style={{ border: 'solid 2px #ECECEC', padding: '25px', marginTop: '5%' }} className="flex justify-between items-start rounded">
          <div className="flex flex-col justify-start items-start" style={{ width: '70%' }}>
            <div className='flex'>
              <button style={{ background: '#ECECEC' }} className="text-lg rounded py-2 px-4">{service.category}</button>
              {service.domicile && (
                <button style={{ color: '#2DB742', background: '#ABEAB5' }}>Service à domicile</button>
              )}
            </div>
            <br />
            <h1>{service.title}</h1>
            <br />
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum delectus fuga nemo nesciunt, laborum amet labore dolore, accusamus fugit repudiandae ipsum fugiat suscipit dignissimos consectetur, vero doloribus. Soluta, ratione exercitationem!</p>
          </div>
          <div className="flex flex-col items-end justify-between p-4">
            <h1 style={{ fontSize: '250%' }} className="font-bold">{service.price} €</h1>
            <span style={{ color: '#EAEAEA' }}>Durée {service.dureeRDV}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-9">

        
        <div className="col-span-2">
        <span>Choisissez la date du rendez-vous</span>
          <Calendar
          disabled={(date) =>
            date < new Date()}
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mt-4"
            initialFocus
           />
      
        </div>
        <div className="col-span-7">
        </div>
      </div>
    </div> */}
      <div className="h-full flex-1 flex-col space-y-8 pl-8 pr-2 pt-8 pb-8 md:flex">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <Avatar className="w-16 h-16 mr-4">
                  <AvatarImage src="/placeholder.svg" alt="Melina Beauty" />
                  <AvatarFallback>MB</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">Melina Beauty</h2>
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
                      (255 avis)
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Scissors className="w-4 h-4 mr-1" />
                    <span>Coiffeuse</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>02 rue des alpes, Paris, France</span>
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
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
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
                          Coupe femme
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">
                          Lissage brésilien
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat.
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800"
                        >
                          Service à domicile
                        </Badge>
                        <div className="text-right mt-4">
                          <p className="text-2xl font-bold">25 €</p>
                          <p className="text-sm text-muted-foreground">
                            Durée : 30 min
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <h2 className="text-xl my-6">Reservation :</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h3 className="text-sm font-semibold mb-4">
                  Sélectionner la date du rendez-vous
                </h3>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
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
                          : selectedSlots.includes(time)
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
            <div className="mt-6">
              <Separator className="my-3" />
              <h3 className="text-sm font-semibold my-6 items-center">
                Veuillez fournir l'adresse de votre lieu de rendez-vous, et le
                prestataire vous appellera pour confirmer :
              </h3>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" placeholder="Numéro et nom de rue" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" placeholder="Nom de la ville" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input id="postalCode" placeholder="Code postal" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressComplement">
                    Complément d'adresse
                  </Label>
                  <Input
                    id="addressComplement"
                    placeholder="Appartement, étage, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">
                    Une note pour cette réservation ?
                  </Label>
                  <Textarea
                    id="note"
                    placeholder="Ajoutez des informations supplémentaires si nécessaire"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end items-center gap-4">
                  <Button variant={"outline"}>Annuler</Button>
                  <Button>Réserver</Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DateChoice;
