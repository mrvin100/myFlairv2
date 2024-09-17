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
import {
  PlusCircle,
  Trash,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  FacebookIcon,
  LucideIcon,
  ChevronsUpDown,
  Bell,
} from "lucide-react";

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
          <div>
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

        <h2 className="font-normal text-lg my-8">Informations Public</h2>
        <h3 className="text-sm mb-3">Réseaux sociaux</h3>
        <SocialsProfiles />
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
              <Switch
                onCheckedChange={() => "nothing"}
                className="data-[state=checked]:bg-green-500"
              />
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

import { Calendar, MoreHorizontal, Tags, User } from "lucide-react";
import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type Social = {
  value: string;
  label: string;
  icon: LucideIcon;
};

const socials: Social[] = [
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "youtube", label: "Youtube", icon: Youtube },
  { value: "linkedin", label: "Linkedin", icon: Linkedin },
];

type SocialNetwork = {
  name: string;
  link: string;
};

function SocialsProfiles() {
  const [open, setOpen] = React.useState(false);
  const [selectedSocial, setSelectedSocial] = React.useState<Social>(
    socials[0]
  );
  const [socialLink, setSocialLink] = React.useState<string>("");
  const [socialsNetworks, setSocialsNetworks] = useState<SocialNetwork[]>([]);
  const handleInputAddSocial = (social: string, value: string) => {
    console.log("social name : ", social);
    console.log("social input value : ", value);
    const updatedSocialsNetworks = [
      ...socialsNetworks,
      { name: social, link: value },
    ];
    setSocialsNetworks(updatedSocialsNetworks);
  };
  return (
    <div>
      <div className="flex w-full gap-4 flex-col items-start justify-between sm:flex-row sm:items-center px-1">
        <div className="w-full">
          <Input
            type="text-muted-foreground"
            onChange={(e) => setSocialLink(e.target.value)}
            placeholder="Ex: https://www.instagram.com/itsabiconnick/"
          />
        </div>
        <div className="flex justify-between md:justify-center gap-4">
          <div className="text-sm font-medium leading-none">
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <selectedSocial.icon className="h-4 w-4 text-black" />
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Filter label..."
                    autoFocus={true}
                  />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {socials.map((social) => (
                        <CommandItem
                          key={social.label}
                          value={social.value}
                          onSelect={(value) => {
                            setSelectedSocial(() => {
                              const foundedSocial = socials.find(
                                (social) => social.value === value
                              );
                              if (foundedSocial) {
                                return foundedSocial;
                              }
                              return socials[0];
                            });
                            setOpen(false);
                          }}
                        >
                          {social.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              handleInputAddSocial(selectedSocial.value, socialLink)
            }
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <PlusCircle className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ajouter un réseau social</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </div>
      </div>
      <div>
        {socialsNetworks && socialsNetworks.length > 0 ? (
          socialsNetworks.map((socialNetwork, index) => (
            <div className="my-4 mx-1 flex gap-4 justify-between items-center">
              <Badge className="inline-block">{socialNetwork.name}</Badge>
              <Input
                type="text-muted-foreground"
                // onChange={(e) => setSocialLink(e.target.value)}
                placeholder="Ex: https://www.instagram.com/itsabiconnick/"
                value={socialNetwork.link}
              />
            </div>
          ))
        ) : (
          <div>
            <Alert className="text-center my-4">
              <Bell className="h-6 w-6 text-muted" />
              <AlertTitle className="ml-4 mb-2">Oups!</AlertTitle>
              <AlertDescription className="ml-4">
                Veuillez configurer vos réseaux soiaux.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
