"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "@/contexts/user";

interface Formation {
  id: string;
  image: string;
  title: string;
  description: string;
  price: string;
  quantity: number;
  deposit: string;
  alt?: string;
  idStripe: string;
}

const Formations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [quantity, setQuantity] = useState<{ [id: string]: number }>({});
  const [buttonInvalid, setButtonInvalid] = useState<{ [id: string]: boolean }>(
    {}
  );
  const { user } = useUserContext();
  useEffect(() => {
    fetch("/api/formation/get", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Formation[]) => {
        setFormations(data);
      })
      .catch((error) => console.error("Error fetching formations:", error));
  }, []);
  console.log(formations)
  const handleFormationChange = (id: string, value: number) => {
    setQuantity((prevQuantities) => ({
      ...prevQuantities,
      [id]: value,
    }));
  };

  const handleAddToCart = async (formationId: string) => {
    try {
      const formation = formations.find(
        (formation) => formation.id === formationId
      );
      if (!formation) {
        throw new Error(`Formation with id ${formationId} not found.`);
      }

      const response = await fetch("/api/cart/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          productId: formationId,
          quantity: quantity[formationId] || 1,
          title: formation.title,
          price: parseFloat(formation.deposit),
          idStripe: formation.idStripe,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("La formation a été ajoutée au panier.");
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      toast.error("Erreur lors de l'ajout au panier.");
    }
  };

  useEffect(() => {
    const updatedButtonInvalid: { [id: string]: boolean } = {};
    formations.forEach((formation) => {
      updatedButtonInvalid[formation.id] =
        quantity[formation.id] > formation.quantity ||
        quantity[formation.id] < 0 ||
        quantity[formation.id] === 0;
    });
    setButtonInvalid(updatedButtonInvalid);
  }, [quantity, formations]);

  return (
    <div className="flex items-center justify-center w-full p-10">
      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 max-w-6xl">
        {formations.map((formation) => (
          <Dialog key={formation.id}>
            <Card className="flex flex-col rounded m-2">
              <CardHeader className="h-52 bg-none rounded-lg p-0">
                <Image
                  className="w-full rounded-md h-full object-cover"
                  src={formation.image}
                  alt={formation.alt ?? ""}
                  width={1000}
                  height={1000}
                />
              </CardHeader>

              <CardContent className="my-4 py-0">
                <CardTitle className="mb-4">{formation.title}</CardTitle>
                <CardDescription>
                  A partir de{" "}
                  {Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(parseFloat(formation.price))}
                  <div className="flex items-center gap-x-2 pt-2">
                    Quantité:
                    <Input
                      className="w-[100px]"
                      max={formation.quantity}
                      onChange={(e) =>
                        handleFormationChange(
                          formation.id,
                          Number(e.target.value)
                        )
                      }
                      defaultValue={1}
                      type="number"
                    />
                    {quantity[formation.id] === formation.quantity && (
                      <span style={{ color: "orange" }}>
                        Limite disponible atteinte
                      </span>
                    )}
                    {quantity[formation.id] > formation.quantity && (
                      <span style={{ color: "#d50000" }}>
                        Demande supérieure aux stocks
                      </span>
                    )}
                  </div>
                </CardDescription>
              </CardContent>

              <CardFooter className="flex justify-between pt-0 flex-wrap gap-3">
                <DialogTrigger className="w-full md:w-auto">
                  <Button variant="outline" className="w-full">
                    Détails
                  </Button>
                </DialogTrigger>
                <Button
                  onClick={() => handleAddToCart(formation.id)}
                  disabled={buttonInvalid[formation.id]}
                  className="w-full md:w-auto"
                >
                  Ajouter au Panier
                </Button>
              </CardFooter>
            </Card>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>{formation.title}</DialogTitle>
              </DialogHeader>

              <div
                dangerouslySetInnerHTML={{ __html: formation.description }}
              />

              <div>
                <span style={{ fontWeight: "700" }}>Tarifs :</span>
              </div>
              <div>
                <li>
                  Tarif de réservation :{" "}
                  <span style={{ fontWeight: "700" }}>
                    {formation.price} €
                  </span>
                </li>
                <li className="mt-4">
                  Tarif de l'accompte :{" "}
                  <span style={{ fontWeight: "700" }}>
                    {formation.deposit} €
                  </span>
                </li>
              </div>
              <div>
                <span>
                  1) Le paiement de l'acompte se fera via la réservation de cette
                  formation.
                </span>
                <br />
                <span>
                  2) Nous vous demandons d'apporter la suite du paiement en main
                  propre.
                </span>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Formations;
