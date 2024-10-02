"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartGlobal from "../../Cart";
import { useEffect, useState } from "react";
import { BusinessBooster, Post, Reservation } from "@prisma/client";
import { CalendarDaysIcon, Loader } from "lucide-react";
import { useUserContext } from "@/contexts/user";
import { getAllReservationsForUser, getPostById } from "@/lib/queries";
import { getAllBusinessBoosters } from "@/data/business-booster";
import { Calendar } from "@/components/calendar";
import { useCart } from "@/contexts/cart-global";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReservationWithPost {
  reservation: Reservation;
  post: Post | null;
}

export default function BusinessBoostersPage() {
  const [businessBoosters, setBusinessBoosters] = useState<BusinessBooster[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<{
    [boosterId: string]: Date | undefined;
  }>({});
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
    setSelectedDates((prev) => ({
      ...prev,
      [boosterId]: date,
    }));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin h-5 w-5 text-gray-900" />
      </div>
    );
  }

  return (
    <main className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:min-h-screen">
      <div className="min-w-[26rem] w-full bg-white shadow-lg p-4 order-last xl:order-first">
        <CartGlobal className="mx-auto xl:h-[calc(100%-4rem)]" />
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
      <div className="w-full grid grid-cols-1 gap-8 px-6 py-16 lg:px-24 md:col-span-2 space-y-6">
        {businessBoosters && businessBoosters.length > 0 ? (
          businessBoosters.map((businessBooster) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto h-80 md:h-72 drop-shadow-lg"
              key={businessBooster.id}
            >
              <Image
                className="object-cover w-full h-full rounded-md sm:rounded-l-md"
                src={businessBooster.image || defaultImage}
                alt={businessBooster.alt}
                width={300}
                height={300}
              />
              <div className=" bg-gray-100 p-4 grid items-center">
                <h4 className="text-[20px] font-bold">
                  {businessBooster.title}
                </h4>
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

                <div className="flex justify-between items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <DialogCalendar
                          selectedDates={selectedDates}
                          businessBooster={businessBooster}
                          selectedBoosters={selectedBoosters}
                          handleDateSelection={handleDateSelection}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Choisir une date</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex w-full justify-end">
                    <Button
                      className="w-full"
                      disabled={
                        !selectedDates[businessBooster.id] ||
                        selectedBoosters.some(
                          (booster) => booster.id === businessBooster.id
                        )
                      }
                      onClick={() => {
                        const date = selectedDates[businessBooster.id];
                        if (
                          date &&
                          !selectedBoosters.some(
                            (booster) => booster.id === businessBooster.id
                          )
                        ) {
                          addBooster(businessBooster);
                        }
                      }}
                    >
                      {selectedBoosters.some(
                        (booster) => booster.id === businessBooster.id
                      )
                        ? "Déjà réservé"
                        : "Réserver"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Aucun élement ajouté au panier</div>
        )}
      </div>
    </main>
  );
}
// Business booster 2 h pour changer de vie
// 100 €
// Vous vous sentez perdue face à la multitude de formations esthétique existantes ?
// Notre session de coaching intensif est conçue pour vous orienter vers la formation en esthétique la plus adaptée à vos ambitions.
// En deux heures, nous explorerons ensemble vos passions, vos compétences et déterminerons la voie qui vous correspond le mieux
// CHOISIR UNE DATE
// Ajouter au panier

type DialogCalendarProps = {
  selectedDates: { [boosterId: string]: Date | undefined };
  businessBooster?: BusinessBooster;
  selectedBoosters: BusinessBooster[];
  handleDateSelection(date: Date | undefined, boosterId: string): void;
};

export function DialogCalendar({
  selectedDates,
  businessBooster,
  selectedBoosters,
  handleDateSelection,
}: DialogCalendarProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <CalendarDaysIcon className="h-6 w-6 mx-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>choisir une date</DialogTitle>
          <DialogDescription>
            Ajouter ce booster a votre business.
          </DialogDescription>
        </DialogHeader>
        <div className="align-end flex w-full">
          <Calendar
            mode="single"
            selected={selectedDates[businessBooster?.id]}
            fromDate={new Date()}
            toDate={(() => {
              const dates = Array.isArray(businessBooster?.dates)
                ? businessBooster?.dates
                : JSON.parse(businessBooster?.dates || "[]");
              return dates.length
                ? new Date(dates[dates.length - 1].date)
                : undefined;
            })()}
            disabled={(date) => {
              const isBoosterSelected = selectedBoosters.some(
                (booster) => booster.id === businessBooster?.id
              );
              if (isBoosterSelected) return true;

              const dates = Array.isArray(businessBooster?.dates)
                ? businessBooster?.dates
                : JSON.parse(businessBooster?.dates || "[]");
              return (
                !dates.length ||
                !dates.some((boosterDate) => {
                  return (
                    boosterDate.date === date.toISOString().split("T")[0] &&
                    boosterDate.available > 0
                  );
                })
              );
            }}
            onSelect={(date) => {
              if (
                !selectedBoosters.some(
                  (booster) => booster.id === businessBooster?.id
                )
              ) {
                handleDateSelection(date, businessBooster?.id);
              }
            }}
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Annuler
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
