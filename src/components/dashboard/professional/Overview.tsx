"use client";

import { useUserContext } from "@/contexts/user";
import { signOut } from "next-auth/react";
import { TabsContent } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Circle, CircleDot, Dot } from "lucide-react";
import clsx from "clsx";

export default function OverviewTab() {
  const { user } = useUserContext();

  // declaration of variables to change after linked with backend

  const status = "en-cours";
  // const status = 'annuler'
  const typeClient = "boutique";

  return (
    <TabsContent title="Tableau de bord" value="overview">
      <div className="max-w-5xl w-full">
        <div>
          Bonjour <b>{user?.firstName}</b> !<br />
          (vous n’êtes pas {user?.firstName} ? 
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
          Vous pouvez dès à présent réserver votre poste de travail , vous
          inscrire à votre future formation et souscrire à notre outil de
          gestion de planning !
        </div>

        <h2 className="font-normal text-lg my-8">Abonnement actuel</h2>

        <div className="border rounded-sm p-4 ">
          <div className="flex items-center justify-between gap-4">
            <h3>Abonnement gestion planning mensuel</h3>
            <div>
              19 €<span className="text-gray-500 text-sm block">/Mois</span>
            </div>
          </div>
          <div className="my-3">
            Date de renouvellement: &nbsp;
            <span className="text-gray-500">17 Mars 2024</span>
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <Button variant={"destructive"} className="">
              Annuler l'abonnement
            </Button>
            <Button variant={"outline"}>Mettre à niveau</Button>
          </div>
        </div>

        <h2 className="font-normal text-lg my-8">Réservations récentes</h2>

        {/* section of recents resservations */}

        <section className="p-4 mx-auto ">
          {/* reservation en cours */}
          <div className="bg-white flex md:justify-between justify-start md:flex-row flex-col gap-2">
            {/* client profile */}
            <div className="shadow-md  rounded-sm md:max-w-[16rem] w-full p-4 text-center border flex flex-col gap-3 justify-center items-center">
              <div
                className={clsx(
                  typeClient == "boutique"
                    ? "bg-blue-100 text-blue-600"
                    : "text-black-500 bg-gray-300",
                  "rounded-sm py-2 px-3 text-[.7rem] "
                )}
              >
                Client {typeClient == "boutique" ? "en boutique" : "flair"}
              </div>
              <Image
                src={"/nail-salon.webp"}
                height={120}
                width={120}
                alt="client profile"
                className="rounded-full object-cover h-24 w-24"
              />
              <h3>Miss Kitty</h3>
              <ul className="my-2">
                <li>
                  <span className="text-sm text-gray-500">
                    Membre depuis 2024
                  </span>
                </li>
                <li className="underline text-sm">missKity@gmail.com</li>
                <li className="underline text-sm">0033(0)6 02 03 03 05</li>
              </ul>
              <Button>Modifier</Button>
            </div>
            {/* profile details */}
            <div className="p-8 shadow-md w-full rounded-sm border">
              <div
                className={clsx(
                  status == "en-cours"
                    ? "text-blue-600 bg-blue-100"
                    : status == "annule"
                      ? "text-red-600 bg-red-100"
                      : "text-green-600 bg-green-100",
                  "rounded-sm text-[.7rem] py-2 px-3  text-center inline-block"
                )}
              >
                <CircleDot className="h-4 w-4 inline-block mr-2" />
                {status == "en-cours"
                  ? "En cours"
                  : status == "annule"
                    ? "Annulée"
                    : "Terminé"}
              </div>
              <ul className="text-sm text-gray-500 my-4">
                <li>
                  <strong>Service réservé :</strong> Lissage Brésilien
                </li>
                <li>
                  <strong>Date de reservations :</strong> 09.10.2024 de 17:00 à
                  18:00
                </li>
                <li>
                  <strong>Lieu :</strong> 02 rue des Alpes, 75000 Paris, France
                </li>
                <li>
                  <strong>Tarifs :</strong> 100 €
                </li>
                <li>
                  <strong>Note client :</strong> Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Duis ex dui, lacinia ut fringilla
                  in.
                </li>
              </ul>
              <div className="flex gap-4 items-center flex-wrap">
                <Button
                  variant={status == "en-cours" ? "destructive" : "secondary"}
                  className={clsx(
                    status != "en-cours" && status != "annule" ? "hidden" : ""
                  )}
                >
                  {status == "en-cours"
                    ? "Annuler la réservation"
                    : status == "annule"
                      ? "Raison"
                      : ""}
                </Button>
                <Button>Supprimer</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </TabsContent>
  );
}
