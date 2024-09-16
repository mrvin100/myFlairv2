"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserContext } from "@/contexts/user";
import { CURRENCY } from "@/lib/constant";
import { getAllReservationsForUser, getPostById } from "@/lib/queries";
import { Tab } from "@mui/material";
import { BusinessBooster, Post, Reservation } from "@prisma/client";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ReservationWithPost {
  reservation: Reservation;
  post: Post | null;
}

// CartGlobalProps interface
interface CartGlobalProps {
  reservationsWithPosts: ReservationWithPost[];
  setReservationsWithPosts: React.Dispatch<React.SetStateAction<ReservationWithPost[]>>;
  selectedBooster: BusinessBooster[];
  setSelectedBooster: React.Dispatch<React.SetStateAction<BusinessBooster[]>>;
}

const CartGlobal = ({
  reservationsWithPosts,
  setReservationsWithPosts,
  selectedBooster,
  setSelectedBooster,
}: CartGlobalProps) => {
  const { user } = useUserContext();
  console.log(user);
  console.log(reservationsWithPosts);
  
  const totalReservationPrice = 11

  const totalBoosterPrice = selectedBooster ? selectedBooster.reduce((total, booster) =>
    total + booster.price,
    0
  ) : 0;

  const totalPrice = totalReservationPrice + totalBoosterPrice;

  return (
    <div className="container mx-auto px-4 py-6 w-[580px]"> {/* Adjusted width */}
      <div className="shadow-md rounded-xl overflow-hidden border border-gray-300">
        <Table className="min-w-full">
          <TableCaption className="bg-gray-100 font-bold">Vos dates de réservations</TableCaption>
          <TableHeader className="bg-black text-white">
            <TableRow className="text-md">
              <TableHead className="px-2 py-1">Salle</TableHead>
              <TableHead className="px-2 py-1 text-center">Date reservée</TableHead>
              <TableHead className="px-2 py-1 text-center">Prix</TableHead>
              <TableHead className="px-2 py-1 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* Reservation Section */}
          {reservationsWithPosts.map((reservationPost) => (
            <TableBody key={reservationPost.reservation.id} className="bg-white">
              <TableRow className="border-b border-gray-300">
                <TableCell className="px-2 py-1">{reservationPost.post?.title || ""}</TableCell>
                <TableCell className="px-2 py-1 text-center">
                  {reservationPost.reservation.date.toDateString()}
                </TableCell>
                <TableCell className="px-2 py-1 text-center">
                  {reservationPost.reservation.price} {CURRENCY}
                </TableCell>
                <TableCell className="px-2 py-1 text-right">
                  <span className="flex justify-end">
                    <Trash2 className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700 duration-150" />
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          ))}
          <TableBody className="bg-gray-200">
            <TableRow>
              <TableCell className="px-2 py-1 font-semibold">Total</TableCell>
              <TableCell className="px-2 py-1"></TableCell>
              <TableCell className="px-2 py-1 text-center font-semibold">{totalReservationPrice} {CURRENCY}</TableCell>
              <TableCell className="px-2 py-1"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* New Section for Business Boosters */}
      {selectedBooster && (
        <div className="shadow-md rounded-xl overflow-hidden border border-gray-300 mt-6">
          <Table className="min-w-full">
            <TableCaption className="bg-gray-100 font-bold">Vos Business Boosters</TableCaption>
            <TableHeader className="bg-black text-white">
              <TableRow>
                <TableHead className="px-2 py-1">Booster</TableHead>
                <TableHead className="px-2 py-1 text-center">Description</TableHead>
                <TableHead className="px-2 py-1 text-center">Prix</TableHead>
                <TableHead className="px-2 py-1 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {selectedBooster.map((booster, index) => (
              <TableBody key={index} className="bg-white">
                <TableRow className="border-b border-gray-300">
                  <TableCell className="px-2 py-1">{booster.title}</TableCell>
                  <TableCell className="px-2 py-1 text-center">{booster.description}</TableCell>
                  <TableCell className="px-2 py-1 text-center">{booster.price} {CURRENCY}</TableCell>
                  <TableCell className="px-2 py-1 text-right">
                    <span 
                        className="flex justify-end"
                        onClick={() => {
                            setSelectedBooster((prevSelectedBooster) => prevSelectedBooster.filter(b => b.id !== booster.id));
                        }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700 duration-150" />
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
            <TableBody className="bg-gray-200">
              <TableRow>
                <TableCell className="px-2 py-1 font-semibold">Total</TableCell>
                <TableCell className="px-2 py-1"></TableCell>
                <TableCell className="px-2 py-1 text-center font-semibold">{totalBoosterPrice} {CURRENCY}</TableCell>
                <TableCell className="px-2 py-1"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {/* Combined Total Section */}
      <div className="shadow-md rounded-xl overflow-hidden border border-gray-300 mt-6">
        <Table>
          <TableBody className="bg-gray-200">
            <TableRow>
              <TableCell className="px-2 py-1 font-semibold">Total Général</TableCell>
              <TableCell className="px-2 py-1"></TableCell>
              <TableCell className="px-2 py-1 text-center font-semibold">{totalPrice} {CURRENCY}</TableCell>
              <TableCell className="px-2 py-1"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CartGlobal;