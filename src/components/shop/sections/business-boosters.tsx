'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shop/layout";

interface BusinessBooster {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  alt?: string;
  dates?: { date: string; available: number }[]; // Include dates if necessary
}

export default function BusinessBoosters() {
  const [businessBoostersOnline, setBusinessBoostersOnline] = useState<BusinessBooster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/businessBoosters/getAll", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Données reçues :', data); 
        setBusinessBoostersOnline(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des services :", error);
        setLoading(false);
      });
  }, []);
  
  return (
    <main>
      <HeaderSection title="Business Boosters" />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(24rem,28rem))] gap-8 justify-center px-4 py-16 mx-auto w-full">
        {loading ? (
          <p className="text-center">Chargement des business boosters...</p>
        ) : businessBoostersOnline.length === 0 ? (
          <div className="flex justify-center items-center w-full">
            <div className="bg-black text-white border border-gray-300 p-8 rounded-lg shadow-md max-w-md text-center">
              <h3 className="text-[1.5rem] font-bold mb-4">Aucun business booster</h3>
              <p className="text-[1rem]">Il n'y a pas de business boosters disponibles pour le moment. Revenez plus tard !</p>
            </div>
          </div>
        ) : (
          businessBoostersOnline.map((businessBooster) => (
            <div className="w-full" key={businessBooster.id}>
              <Image
                className="w-full max-w-md max-h-[15rem] h-full object-cover"
                src={businessBooster.image || "/default-image.webp"}
                alt={businessBooster.alt || "image alt"}
                width={1000}
                height={1000}
              />
              <div className="w-full bg-gray-100 p-4">
                <h4 className="text-[1.5rem] font-bold">
                  {businessBooster.title}
                </h4>
                <h3 className="text-[1.2rem] my-2 font-bold">
                  {Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(businessBooster.price)}
                </h3>
                <p
                  className="text-[1rem] my-4"
                  dangerouslySetInnerHTML={{
                    __html: businessBooster.description,
                  }}
                ></p>

                <div className="flex justify-between gap-3">
                  <Button className="w-full">Choisir une date</Button>
                  <Button className="w-full">Réserver</Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
