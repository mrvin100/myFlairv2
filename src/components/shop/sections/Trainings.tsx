"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
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

interface Formation {
  id: string;
  image: string;
  title: string;
  description: string;
  price: string; // Assuming price is a string from your API
  quantity: number;
  deposit: number;
  alt?: string;
}

const Formations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    // Fetch the formations from the API
    fetch("/api/formation/get", { // Update this API endpoint to match your actual endpoint
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Formation[]) => {
        console.log("Formations fetched:", data);
        setFormations(data);
      })
      .catch((error) => console.error("Error fetching formations:", error));
  }, []);

  return (
    <div className="flex items-center justify-center w-full p-10">
      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 max-w-6xl">
        {formations.map((formation) => (
          <Dialog key={formation.id}>
            <Card style={{ margin: 0 }} className="flex flex-col rounded-lg m-2">
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
            
                </CardDescription>
              </CardContent>

              <CardFooter className="flex justify-between pt-0 flex-wrap gap-3">
                <DialogTrigger className="w-full md:w-auto">
                  <Button variant="outline" className="w-full">
                    Détails
                  </Button>
                </DialogTrigger>
                <Link
                  href={`/reservation/${formation.id}`} // Adjust the link as needed
                  className="w-full md:w-auto"
                >
                  <Button className="w-full">Réserver</Button>
                </Link>
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
                    {formation.price} € / JOUR
                  </span>
                </li>
              </div>
              <div>
                <span style={{ fontWeight: "700" }}>Dépot :</span>{" "}
                <span style={{ fontWeight: "700" }}>{formation.deposit} €</span>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default Formations;
