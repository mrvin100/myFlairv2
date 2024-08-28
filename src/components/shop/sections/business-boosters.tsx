"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shop/layout";
// import { getAllBusinessBoosters } from "@/data/business-booster";

interface BusinessBooster {
  id: number;
  image: string;
  title: string;
  description: string;
  price: bigint;
  alt?: string;
}

export default function BusinessBoosters() {
  // const businessBoosters = (await getAllBusinessBoosters()) || [];
  const [businessBoostersOnline, setBusinessBoostersOnline] = useState<
    BusinessBooster[]
  >([]);

  useEffect(() => {
    fetch(
      "https://dummyjson.com/products?limit=10&skip=10&select=id,title,price,description,images",
      {
        method: "GET",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Services fetched:", data);
        setBusinessBoostersOnline(data.products); // Assurez-vous que 'data.products' contient la structure de données attendue
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  console.log(businessBoostersOnline);

  return (
    <main>
      <HeaderSection title="Business Boosters" />
      {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(24rem,28rem))] gap-8 justify-center  px-4 py-16 mx-auto w-full">
        {businessBoostersOnline?.map((businessBooster) => (
          <div className="w-full" key={businessBooster.id}>
            <Image
              className="w-full max-w-md max-h-[15rem] h-full object-cover"
              src={"/nail-salon.webp"}
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
        ))}
      </div> */}

      <div className="flex items-center justify-center w-full min-h-screen p-10">
        <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2 max-w-6xl">
          <div className="flex flex-col bg-gray-200 rounded-lg p-4 m-2">
            <div className="h-40 bg-gray-400 rounded-lg"></div>
            <div className="flex flex-col items-start mt-4">
              <h4 className="text-xl font-semibold">Heading</h4>
              <p className="text-sm">
                Some text about the thing that goes over a few lines.
              </p>
              <a
                className="p-2 leading-none rounded font-medium mt-3 bg-gray-400 text-xs uppercase"
                href="#"
              >
                Click Here
              </a>
            </div>
          </div>
          <div className="flex flex-col bg-gray-200 rounded-lg p-4 m-2">
            <div className="h-40 bg-gray-400 rounded-lg"></div>
            <div className="flex flex-col items-start mt-4">
              <h4 className="text-xl font-semibold">Heading</h4>
              <p className="text-sm">
                Some text about the thing that goes over a few lines.
              </p>
              <a
                className="p-2 leading-none rounded font-medium mt-3 bg-gray-400 text-xs uppercase"
                href="#"
              >
                Click Here
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
