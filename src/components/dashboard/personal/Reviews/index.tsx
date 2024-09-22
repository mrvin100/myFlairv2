"use client";
import type { Review } from "@prisma/client";

import { TabsContent } from "@/components/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Info, LocateIcon, Star } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ReservationsTab() {
  const [reviews, setReviews] = useState<Review[]>([{},{}]);
  const rating = 4;
  return (
    <TabsContent title="Mes avis" value="reviews">
      {reviews && reviews.length > 0 ? (
        <>
          <div className="grid gap-6 justify-center">
            {[...Array(3)].map((_, i) => (
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <div className="flex flex-wrap gap-3 items-center mb-2">
                    <Image
                      src={"/nail-salon.webp"}
                      alt="user image"
                      width={200}
                      height={200}
                      className="rounded-full object-cover h-12 w-12"
                    />
                    <h2>Melina Beauty</h2>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm">(255 avis)</p>
                  </div>
                  <div>
                    <span className="bg-muted text-sm inline-block px-2 py-1 rounded-xl">
                      Coiffeuse
                    </span>
                    &nbsp;
                    <span className=" text-muted-foreground text-sm">
                      <LocateIcon className="h-4 w-4 mr-2 inline-block" />
                      02 rue des alpes, Paris, France.
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between gap-4 mb-4">
                    <div className="flex flex-wrap gap-3">
                      <Image
                        src={"/nail-salon.webp"}
                        alt="user image"
                        width={200}
                        height={200}
                        className="rounded-full object-cover h-10 w-10"
                      />
                      <h3 className="">
                        Miss kitty <br />
                        <span className="text-sm text-muted-foreground">
                          il y a 1h
                        </span>
                      </h3>
                    </div>
                    <div className="ml-auto flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm ">
                    Lorem ipsum dolor sit amet, consectetur adipicing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqa. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                  <Button variant={"secondary"}>Supprimer</Button>
                  <Button>Voir</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="my-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Oups!</AlertTitle>
          <AlertDescription>
            Vous n'avez pas encore d'avis déposé...
          </AlertDescription>
        </Alert>
      )}
    </TabsContent>
  );
}
