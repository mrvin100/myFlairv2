"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartGlobal from "../../Cart";
import { useEffect, useState } from "react";
import { BusinessBooster, Post, Reservation } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useUserContext } from "@/contexts/user";
import { getAllReservationsForUser, getPostById } from "@/lib/queries";
import { getAllBusinessBoosters } from "@/data/business-booster";
import { Calendar } from "@/components/calendar";
import { useCart } from "@/contexts/cart-global";

interface ReservationWithPost {
  reservation: Reservation;
  post: Post | null;
}

export default function BusinessBoostersPage() {
  const [businessBoosters, setBusinessBoosters] = useState<BusinessBooster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<{ [boosterId: string]: Date | undefined }>({});
  const { user } = useUserContext();
  const { setReservationsWithPosts, selectedBoosters, addBooster } = useCart();
  const defaultImage = "/nail-salon.webp";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (user?.id) {
          const reservationsR = await getAllReservationsForUser(user.id);
          if (reservationsR) {
            const reservationsPostsPromises = reservationsR.map(async (reservation) => {
              const post = await getPostById(reservation.postId);
              return { reservation, post };
            });

            const reservationsWithPosts = await Promise.all(reservationsPostsPromises);
            setReservationsWithPosts(reservationsWithPosts);
          }
        }

        const businessBoosters = await getAllBusinessBoosters();
        setBusinessBoosters(businessBoosters as BusinessBooster[]);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, setReservationsWithPosts]);

  function handleDateSelection(date: Date | undefined, boosterId: string) {
    setSelectedDates(prev => ({
      ...prev,
      [boosterId]: date
    }));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-5 w-5 text-gray-900" />
      </div>
    );
  }

  return (
    <main className="relative">
      {/* Section du panier fixe */}
      <div className="fixed top-0 left-0 w-[600px] h-full bg-white shadow-lg p-4 overflow-y-auto z-10">
        <h2 className="font-bold text-2xl mb-4">Panier</h2>
        <CartGlobal />
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

      {/* Section du contenu principal */}
      <div className="ml-[520px] grid grid-cols-1 gap-8 px-6 py-16 lg:px-24">
        {businessBoosters.length > 0 ? (
          businessBoosters.map((businessBooster) => (
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
                  <div className="align-end flex w-full">
                    <Calendar
                      mode="single"
                      selected={selectedDates[businessBooster.id]}
                      fromDate={new Date()}
                      toDate={(() => {
                        const dates = Array.isArray(businessBooster.dates)
                          ? businessBooster.dates
                          : JSON.parse(businessBooster.dates || '[]');
                        return dates.length
                          ? new Date(dates[dates.length - 1].date)
                          : undefined;
                      })()}
                      disabled={(date) => {
                        const isBoosterSelected = selectedBoosters.some(booster => booster.id === businessBooster.id);
                        if (isBoosterSelected) return true;

                        const dates = Array.isArray(businessBooster.dates)
                          ? businessBooster.dates
                          : JSON.parse(businessBooster.dates || '[]');
                        return !dates.length || !dates.some(boosterDate => {
                          return boosterDate.date === date.toISOString().split('T')[0] && boosterDate.available > 0;
                        });
                      }}
                      onSelect={(date) => {
                        if (!selectedBoosters.some(booster => booster.id === businessBooster.id)) {
                          handleDateSelection(date, businessBooster.id);
                        }
                      }}
                    />
                  </div>
                  <div className="flex w-full justify-end">
                    <Button
                      className="w-[200px]"
                      disabled={!selectedDates[businessBooster.id] || selectedBoosters.some(booster => booster.id === businessBooster.id)}
                      onClick={() => {
                        const date = selectedDates[businessBooster.id];
                        if (date && !selectedBoosters.some(booster => booster.id === businessBooster.id)) {
                          addBooster(businessBooster);
                        }
                      }}
                    >
                      {selectedBoosters.some(booster => booster.id === businessBooster.id) ? "Déjà réservé" : "Réserver"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Aucune donnée</div>
        )}
      </div>
    </main>
  );
}