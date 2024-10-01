"use client";

import { useCart } from "@/contexts/cart-global";
import { useUserContext } from "@/contexts/user";
import { CURRENCY } from "@/lib/constant";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

export { Skeleton };

const CartGlobal = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { user } = useUserContext();
  const {
    reservationsWithPosts,
    selectedBoosters,
    handleDeleteReservation,
    removeBooster,
    totalReservationPrice,
    totalBoosterPrice,
    totalPrice,
    selectedAdditionalServices,
    totalAdditionalPrice,
    addAdditionalService,
    removeAdditionalService,
  } = useCart();

  if (!user) return null;

  return (
    <div className={cn("", className)} {...props}>
      <h2 className="text-2xl font-bold mb-4">Votre panier</h2>
      <Table>
        <TableCaption>Liste de vos réservations et boosters</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead className="text-right">Prix</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservationsWithPosts.map((reservationWithPost) => (
            <TableRow key={reservationWithPost.reservation.id}>
              <TableCell className="font-medium">Réservation</TableCell>
              <TableCell>{reservationWithPost.post?.title}</TableCell>
              <TableCell className="text-right">
                {reservationWithPost.reservation.price} {CURRENCY}
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() =>
                    handleDeleteReservation(reservationWithPost.reservation.id)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </TableCell>
            </TableRow>
          ))}
          {selectedBoosters.map((booster) => (
            <TableRow key={booster.id}>
              <TableCell className="font-medium">Booster</TableCell>
              <TableCell>{booster.title}</TableCell>
              <TableCell className="text-right">
                {booster.price} {CURRENCY}
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => removeBooster(booster.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </TableCell>
            </TableRow>
          ))}
          {selectedAdditionalServices.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">Service Additionnel</TableCell>
              <TableCell>{service.title}</TableCell>
              <TableCell className="text-right">
                {service.price * service.quantity} {CURRENCY}
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => removeAdditionalService(service.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total Réservations</TableCell>
            <TableCell className="text-right">
              {totalReservationPrice} {CURRENCY}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total Boosters</TableCell>
            <TableCell className="text-right">
              {totalBoosterPrice} {CURRENCY}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total Services Additionnels</TableCell>
            <TableCell className="text-right">
              {totalAdditionalPrice} {CURRENCY}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              {totalPrice} {CURRENCY}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CartGlobal;
