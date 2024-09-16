"use client";

import Image from "next/image";
import Link from "next/link";

import { getAllBusinessBoosters } from "@/data/business-booster";

import { Button } from "@/components/ui/button";
import Cart from "@/components/shop/steps/reservation/cart";
import CartGlobal from "../../Cart";
import { useEffect, useState } from "react";
import { BusinessBooster, Post, Reservation } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useUserContext } from "@/contexts/user";
import { getAllReservationsForUser, getPostById } from "@/lib/queries";

interface ReservationWithPost {
  reservation: Reservation;
  post: Post | null;
}

export default function BusinessBoostersPage() {
  const [businessBoosters, setBusinessBoosters] = useState<BusinessBooster[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [allSeleletedBusinessBoosters, setAllSeleletedBusinessBoosters] = useState<BusinessBooster[]>([]);
  const { user } = useUserContext();

  const defaultImage = "/nail-salon.webp"; // Remplacez par l'URL de l'image par défaut

  console.log(user);
  const [reservationsWithPosts, setReservationsWithPosts] = useState<
    ReservationWithPost[]
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const getReservationsAndPost = async () => {
      setIsLoading(true);
      try {
        const reservationsR = await getAllReservationsForUser(user?.id!);
        if (reservationsR) {
          const reservationsPostsPromises = reservationsR.map(
            async (reservation) => {
              const post = await getPostById(reservation.postId);

              return { reservation, post };
            }
          );

          const reservationsWithPosts = await Promise.all(
            reservationsPostsPromises
          );
          setReservationsWithPosts(reservationsWithPosts);
        }
      } catch (error) {
        console.log("Error fetching reservations:", error);
        setIsLoading(false);
      }
    };

    const getBusinessBoosters = async () => {
      try {
        const businessBoosters = await getAllBusinessBoosters();
        setBusinessBoosters(businessBoosters);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching business boosters:", error);
        setIsLoading(false);
      }
    };

    getReservationsAndPost();
    getBusinessBoosters();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-5 w-5 text-gray-900" />
      </div>
    );

  return (
    <main className="relative">
      {/* Fixed Cart Section */}
      <div className="fixed top-0 left-0 w-[600px] h-full bg-white shadow-lg p-4 overflow-y-auto z-10">
        <h2 className="font-bold text-2xl mb-4">Panier</h2>
        <CartGlobal
          reservationsWithPosts={reservationsWithPosts}
          setReservationsWithPosts={setReservationsWithPosts}
          selectedBooster={allSeleletedBusinessBoosters}
          setSelectedBooster={setAllSeleletedBusinessBoosters}
        />
        <div className="flex items-center justify-end mt-4">
          <Link href={"/shop/steps/reservation"}>
            <Button className="mr-4" variant="secondary">
              Annuler
            </Button>
          </Link>
          <Link href={"/shop/steps/additional-services"}>
            <Button>Continuer</Button>
          </Link>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="ml-[520px] grid grid-cols-1 gap-8 px-6 py-16 lg:px-24">
        {(businessBoosters && businessBoosters.length > 0 )? businessBoosters?.map((businessBooster) => (
          <div
            className="flex w-full flex-col md:flex-row md:max-w-[50rem] md:mx-auto"
            key={businessBooster.id}
          >
            <Image
              className="w-1/2"
              src={businessBooster.image || defaultImage}
              alt={businessBooster.alt}
              width={1000}
              height={1000}
            />
            <div className="w-1/2 bg-gray-100 p-4">
              <h4 className="text-[20px] font-bold">{businessBooster.title}</h4>
              <h3 className="text-[24px]">
                {Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(businessBooster.price)}
              </h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: businessBooster.description,
                }}
              ></p>

              <div className="space-y-2">
                <div className="align-end flex w-full justify-end">
                  <Button className="w-[200px]">Choisir une date</Button>
                </div>
                <div className="flex w-full justify-end">
                  <Button className="w-[200px]"
                    onClick={() => {
                      setAllSeleletedBusinessBoosters([...allSeleletedBusinessBoosters, businessBooster]);
                    }}
                  >
                    Réserver
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )): <div>No Data</div>
  
        }
      </div>
    </main>
  );
}