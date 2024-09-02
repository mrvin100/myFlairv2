"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  CircleCheckBig,
  Image as ImageIcon,
  User,
} from "lucide-react";
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
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { fr } from 'date-fns/locale';


const RendezVous = ({ params }: { params: { id: string, slug: string } }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const timeSlots = [
    "09:00","09:15", "09:30","09:45", "10:00","10:15", "10:30","10:45", "11:00","11:15", "11:30","11:45", "12:00","12:15", "12:30","12:45",
    "13:00","13:15", "13:30","13:45", "14:00","14:15", "14:30","14:45", "15:00","15:15", "15:30","15:45", "16:00","16:15", "16:30","16:45",
    "17:00","17:15", "17:30","17:45", "18:00","18:15", "18:30","18:45", "19:00","19:15", "19:30","19:45", "20:00","20:15", "20:30","20:45",
    "21:00","21:15", "21:30","21:45", "22:00","22:15", "22:30","22:45", "23:00","23:15", "23:30"
  ];
  const unavailableSlots = ["13:30", "14:00", "18:30"];
  const indisponibilitySlots = ["21:00","21:15", "21:30","21:45", "22:00","22:15", "22:30","22:45", "23:00","23:15", "23:30"];

  // Fonction pour désactiver les dates avant aujourd'hui
  const unavailableDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  return (
    <div>
      <div style={{ paddingRight: "5%", paddingLeft: "5%", width: "100%" }}>
        <br />
        <div className="w-full max-w-3xl mx-auto mt-8  space-y-8">
          <section>
            <h2 className="text-lg font-normal mb-4">
              Creer une Reservation pour : {params.slug} {params.id}
            </h2>
            <div className="flex items-center mb-4 md:mb-0">
              <Avatar className="w-16 h-16 mr-4">
                <AvatarImage
                  src="https://randomuser.me/api/portraits/women/84.jpg"
                  alt="Melina Beauty"
                />
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <div className="text-[#4C40ED] bg-[#F7F7FF] py-2 px-3 rounded-md text-[.7rem]">
                    Client hors Flair
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <User className="w-4 h-4 mr-1" />
                  <span>Miss Kity</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-normal mb-4">
              Sélectionnez la date et l'heure de la réservation :
            </h2>
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
                      setSelectedTime(time)
                    }
                    disabled={unavailableSlots.includes(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <Button variant={'outline'}>Précédent</Button>
                <AlertDialog>
                <AlertDialogTrigger>
                <Button>Réserver</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center  font-normal"><CircleCheckBig className="text-green-500 inline-block" /> <br/> Félicitations</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      Votre réservation a bien été enregistrée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Faire d&apos;autre réservations</AlertDialogCancel>
                    <AlertDialogAction>Voir mes réservations</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              </div>
            </div>
          </div>
          </section>
        </div>
        <br />
      </div>
    </div>
  );
};

export default RendezVous;
