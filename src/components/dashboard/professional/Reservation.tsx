'use client'
import { useState, useEffect } from "react";
import { useUserContext } from "@/contexts/user";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { CircleDot } from "lucide-react";
import Image from "next/image";


type ReservationType = {
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
};
type ReservationProps = {
  status: string;
  typeClient: string;
  date: string;
  time: string;
  address: string;
  note: string;
  service: string;
  price: number;
  email: string;
  phone: string;
  image: string;
  dureeRDV: string;

};


export default function Reservation({
  status,
  typeClient,
  image,
  date,
  time,
  address,
  note,
  service,
  price,
  email,
  dureeRDV,
  phone,
}: ReservationProps) {


 
  const displayAddress = address && address.trim() !== "" ? address : "Sur le lieu de travail";

  return (
    <div className="bg-white flex md:justify-between justify-start md:flex-row flex-col gap-2 mb-4">
      {/* Profil du client */}
      <div className="shadow-md rounded-sm md:max-w-[16rem] w-full p-4 text-center border flex flex-col gap-3 justify-center items-center">
        <div
         className={`${
          status === "boutique"
          ? "text-[#4C40ED] bg-[#F7F7FF]" 
          : "text-[#FFA500] bg-[#FFF4E5]" 
        } py-2 px-3 rounded-md text-[.7rem]`}
        >
          Client {typeClient === "boutique" ? "en boutique" : "flair"}
        </div>
        <Image
          src={image}
          height={120}
          width={120}
          alt="client profile"
          className="rounded-full object-cover h-24 w-24"
        />
        <h3>Miss Kitty</h3>
        <ul className="my-2">
          <li>
            <span className="text-sm text-gray-500">Membre depuis 2024</span>
          </li>
          <li className="underline text-sm">{email}</li>
          <li className="underline text-sm">{phone}</li>
        </ul>
        <Button>Modifier</Button>
      </div>

      {/* Détails du profil */}
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
          {/* Affichage des boutons selon le statut */}
          {status === "en-cours" && (
            <Button variant="destructive">Annuler la réservation</Button>
          )}
          {status === "annule" && (
            <>
              <Button variant="secondary">Raison</Button>
              <Button variant="destructive">Supprimer</Button>
            </>
          )}
          {status === "termine" && (
            <Button variant="destructive">Supprimer</Button>
          )}
        </div>
      </div>
    </div>
  );
}

