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
        <div>
          Bonjour <b>{user?.firstName}</b> !<br />
          (vous n&apos;êtes pas {user?.firstName} ?
          <button
            onClick={() =>
              signOut({ redirect: true, callbackUrl: "/auth/sign-in" })
            }
          >
            <u>Déconnexion</u>
          </button>
          )<br />
          Bienvenue chez Flair !
          <br />
          Vous pouvez dès à présent réserver votre poste de travail, vous
          inscrire à votre future formation et souscrire à notre outil de
          gestion de planning !
        </div>

        <h2 className="font-normal text-lg my-8">Informations Public</h2>
        <div>
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
        <div>
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

        <div className="flex gap-3 flex-col md:flex-row">
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
        <div className="flex flex-col">
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
        <div>
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

        <div className="flex gap-3 flex-col md:flex-row">
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
        <div className="w-full md:w-[calc(50%-.5rem)]">
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
        <div>
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

        <div>
          <p>
            Glisser-déposer des fichiers ou 
            <strong className="underline">Parcourir</strong>
            <span className="text-xs text-black/80">
              Formats pris en charge : JPEG, PNG
            </span>
          </p>
          <div>
            <h3>Sélectionner une image par défaut</h3>
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
