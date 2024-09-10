"use client";
import { useState, useEffect } from "react";
import { useUserContext } from "@/contexts/user";
import { signOut } from "next-auth/react";
import { TabsContent } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import clsx from "clsx";
import Reservation from "./Reservation";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ReactQuill from "react-quill";
import { SubmitButton } from "@/components/button";
import { Trash } from "lucide-react";

type ReservationType = {
  id: string;
  service: {
    typeClient: string;
    title: string;
    price: number;
  };
  status: string;
  dateOfRdv: string;
  time: string;
  address: string;
  note: string;
  user: {
    email: string;
    phone: string;
  };
};

export default function ProfileTab() {
  const { user } = useUserContext();
  const [reservations, setReservations] = useState<ReservationType[]>([]);

  useEffect(() => {
    async function fetchReservations() {
      const response = await fetch(
        `/api/dashboardPro/reservationRecente/${user?.id}`
      );
      const data = await response.json();
      setReservations(data);
    }
    if (user) {
      fetchReservations();
    }
  }, [user]);

  return (
    <TabsContent title="Mon Profile" value="profile">
      <div className="max-w-5xl w-full">
        <h2 className="font-normal text-lg my-4">Image profil</h2>
        <div className="flex gap-3 justify-center items-center flex-col md:flex-row md:justify-start ">
          <Image
            src={"/nail-salon.webp"}
            height={120}
            width={120}
            alt="client profile"
            className="rounded-full object-cover h-24 w-24"
          />
          <div className="">
            <div className="flex gap-4 my-3 justify-center md:justify-start">
              <Button>Télécharger</Button>
              <Button variant={"outline"}>Supprimer</Button>
            </div>
            <p className="text-sm text-gray-500">
              *La taille de l'image doit être d'au moins 320px . Fichiers
              autorisés : .png ou .jpg.
            </p>
          </div>
        </div>

        <h2 className="font-normal text-lg my-8">Informations Public</h2>
        <div className="px-1">
          <label htmlFor="entreprise" className="mb-3 inline-block">
            Nom de votre entreprise
          </label>
          <Input
            type="text"
            onChange={(e) => "fallback function"}
            placeholder="Ex: Milana Beauty"
            required
            id="entreprise"
          />
        </div>
        <br />
        <div className="px-1">
          <label htmlFor="profession" className="mb-3 inline-block">
            Profession
          </label>
          <div className="flex items-end">
            <Input
              type="text"
              onChange={() => "lorem"}
              required
              placeholder="Ex: Coiffeuse"
              id="profession"
            />
          </div>
        </div>
        <br />
        <div
          style={{ width: "100%", height: "1px", background: "#EAEAEA" }}
        ></div>
        <br />
        <div>
          <div>Description</div>
          <br />
          <ReactQuill
            value={"lorem ipsum dolor sit amet consetur ita est..."}
            onChange={() => "lorem onchange"}
            placeholder="Décrivez votre entreprise ici..."
          />
        </div>
        <br />

        <h2 className="font-normal text-lg my-8">Contact public</h2>

        <div className="flex gap-3 flex-col md:flex-row px-1">
          <div className="w-full">
            <label className="mb-3 inline-block">Email</label>
            <div className="flex items-end">
              <Input
                type="text"
                onChange={() => "lorem"}
                placeholder="Ex: myname@myFlair.fr"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="mb-3 inline-block">Numéros de téléphone</label>
            <div className="flex items-end">
              <Input
                type="text"
                onChange={() => "lorem"}
                required
                placeholder="Ex: Coiffeuse"
              />
            </div>
          </div>
        </div>
        <br />
        <div className="flex flex-col px-1">
          <div className="flex flex-col">
            <span style={{ fontSize: "70%" }}>
              Mes services sont uniquement à domicile
            </span>
            <div style={{ marginTop: "5px" }}>
              <Switch onCheckedChange={() => "nothing"} />
            </div>
          </div>
        </div>
        <br />
        <div className="px-1">
          <label htmlFor="entreprise" className="mb-3 inline-block">
            Adresse
          </label>
          <Input
            type="text"
            onChange={(e) => "fallback function"}
            placeholder="Ex: Milana Beauty"
            required
            id="entreprise"
          />
        </div>
        <br />

        <div className="flex gap-3 flex-col md:flex-row px-1">
          <div className="w-full">
            <label className="mb-3 inline-block">Ville *</label>
            <div className="flex items-end">
              <Input
                type="text"
                onChange={() => "lorem"}
                placeholder="Ex: Rue de Compiege"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="mb-3 inline-block">Code postal *</label>
            <div className="flex items-end">
              <Input
                type="text"
                onChange={() => "lorem"}
                required
                placeholder="Ex: 1240 av."
              />
            </div>
          </div>
        </div>
        <br />
        <div className="w-full md:w-[calc(50%-.5rem)] px-1">
          <label className="mb-3 inline-block">Pays *</label>
          <div className="flex items-end">
            <Input
              type="text"
              onChange={() => "lorem"}
              placeholder="Ex: France"
              required
            />
          </div>
        </div>
        <br />
        <div className="px-1">
          <label htmlFor="entreprise" className="mb-3 inline-block">
            Complément d&apos;adresse
          </label>
          <Input
            type="text"
            onChange={(e) => "fallback function"}
            placeholder="Ex: Plus d'infos complementaires sur votre addresse..."
            id="entreprise"
          />
        </div>
        <br />
        <h2 className="font-normal text-lg my-8">Galerie d&apos;image</h2>

        <div className="">
          <div className="px-1 border rounded-md grid justify-center items-center h-32 w-full p-6">
            <p>
              Glisser-déposer des fichiers &nbsp; ou &nbsp;
              <strong className="underline cursor-pointer">Parcourir</strong>
              <span className="text-xs text-black/80 block text-center">
                Formats pris en charge : JPEG, PNG
              </span>
            </p>
          </div>
          <div>
            <h3 className="my-4">Sélectionner une image par défaut</h3>
            <div className="flex gap-3">
              <div className="relative">
                <Trash className="h-6 w-6 absolute top-1 right-1 bg-red-500 text-white rounded-sm p-1 cursor-pointer" />
                <Image
                  src={"/nail-salon.webp"}
                  height={120}
                  width={120}
                  alt="client profile"
                  className="rounded-md object-cover h-16 w-16"
                />
              </div>
              <div className="relative border-red-600 border rounded-sm">
              <Trash className="h-6 w-6 absolute top-1 right-1 bg-red-500 text-white rounded-sm p-1 cursor-pointer" />
                <Image
                  src={"/nail-salon.webp"}
                  height={120}
                  width={120}
                  alt="client profile"
                  className="rounded-md object-cover h-16 w-16"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <SubmitButton pending={false} onClick={() => "handleSubmit"}>
            Mettre a jour
          </SubmitButton>
        </div>
      </div>
    </TabsContent>
  );
}
