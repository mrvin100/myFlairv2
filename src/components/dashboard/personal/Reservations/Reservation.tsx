"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import {
  CircleDot,
  Facebook,
  Instagram,
  Linkedin,
  Star,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type ReservationProps = {
  status: "en-cours" | "annule" | "termine";
  profession: string;
  date: string;
  time: string;
  address: string;
  note: string;
  service: string;
  price: number;
  name: string;
  email: string;
  phone: string;
  image: string;
  rating: number;
  dureeRDV: string;
};

export default function Reservation({
  status,
  profession,
  image,
  date,
  time,
  address,
  note,
  service,
  price,
  name,
  email,
  rating,
  dureeRDV,
  phone,
}: ReservationProps) {
  const displayAddress =
    address && address.trim() !== "" ? address : "Sur le lieu de travail";

  return (
    <div className="bg-white flex md:justify-between justify-start md:flex-row flex-col gap-2 mb-4">
      <div className="shadow-md rounded-sm md:max-w-[16rem] w-full p-4 text-center border flex flex-col gap-3 justify-center items-center">
        <div className="py-2 px-3 rounded-md text-[.7rem] bg-muted capitalize">
          {profession}
        </div>
        <Image
          //   src={image}
          src={"/nail-salon.webp"}
          height={120}
          width={120}
          alt="client profile"
          className="rounded-full object-cover h-16 w-16"
        />
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <ul className="my-2">
          <li className="text-sm">{name}</li>
          <li>
            <span className="text-sm text-gray-500">Membre depuis 2024</span>
          </li>
          <li className="underline text-sm">{phone}</li>
        </ul>
        <div className="flex justify-center gap-3 items-center">
          <Facebook className="h-8 w-8 bg-muted rounded-full p-2" />
          <Instagram className="h-8 w-8 bg-muted rounded-full p-2" />
          <Linkedin className="h-8 w-8 bg-muted rounded-full p-2" />
          <Youtube className="h-8 w-8 bg-muted rounded-full p-2" />
        </div>
      </div>
      <div className="p-8 shadow-md w-full rounded-sm border">
        <div
          className={clsx(
            status === "en-cours"
              ? "text-blue-600 bg-blue-100"
              : status === "annule"
                ? "text-red-600 bg-red-100"
                : "text-green-600 bg-green-100",
            "rounded-sm text-[.7rem] py-2 px-3 text-center inline-block"
          )}
        >
          <CircleDot className="h-4 w-4 inline-block mr-2" />
          {status === "en-cours"
            ? "En cours"
            : status === "annule"
              ? "Annulée"
              : "Terminé"}
        </div>
        <ul className="text-sm text-gray-500 my-4">
          <li>
            <strong>Service réservé :</strong> {service}
          </li>
          <li>
            <strong>Date de réservation :</strong> {date} à partir de {time}
          </li>
          <li>
            <strong>Durée :</strong> {dureeRDV}
          </li>
          <li>
            <strong>Lieu :</strong> {displayAddress}
          </li>
          <li>
            <strong>Tarifs :</strong> {price} €
          </li>
          <li>
            <strong>Note client :</strong> {note}
          </li>
        </ul>
        <div className="flex gap-4 items-center flex-wrap">
          {status === "en-cours" && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Annuler la réservation</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Annuler cette réservation</DialogTitle>
                    <DialogDescription>
                      Vous souhaitez annuler cette réservation ?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="">
                    <Label
                      htmlFor="raison"
                      className="text-right mb-4 inline-block"
                    >
                      Indiquez la raison * :
                    </Label>
                    <Textarea id="raison" rows={4} />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={"secondary"}>Retour</Button>
                    </DialogClose>
                    <Button type="submit">Valider</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button>Supprimer</Button>
            </>
          )}
          {status === "annule" && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Raison</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Cette réservation a été annulée</DialogTitle>
                    <DialogDescription>
                      La réservation a ete annuler par :&nbsp;
                      <span className="underline">{name}</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <h3 className="text-right mb-4 inline-block">
                      Voici la raison :
                    </h3>
                    <p className="text-sm">
                      Malheureusement, je ne suis pas disponible, car j'ai eu un
                      empêchement de dernière minute...
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
              <Button>Supprimer</Button>
            </>
          )}
          {status === "termine" && <Button>Supprimer</Button>}
        </div>
      </div>
    </div>
  );
}
