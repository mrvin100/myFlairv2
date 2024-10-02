"use client";

import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { useCart } from "@/contexts/cart-global";
import axios from "axios";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutButton() {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    reservationsWithPosts,
    selectedBoosters,
    selectedAdditionalServices,
    totalPrice,
  } = useCart();

  const createCheckOutSession = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe.js failed to load.");
      setLoading(false);
      return;
    }

    try {
      const items = [
        ...reservationsWithPosts.map((rwp) => ({
          title: rwp.post?.title || "Réservation",
          price: rwp.reservation.price,
          quantity: 1,
        })),
        ...selectedBoosters.map((booster) => ({
          title: booster.title,
          price: booster.price,
          quantity: 1,
        })),
        ...selectedAdditionalServices.map((service) => ({
          title: service.title,
          price: service.price,
          quantity: service.quantity,
        })),
      ];

      const checkoutSession = await axios.post("/api/stripe", {
        items: items,
        totalAmount: totalPrice,
      });

      const orderSummary = {
        reservations: reservationsWithPosts.map((item) => ({
          title: item.post?.title || "Réservation",
          price: item.reservation.price,
        })),
        boosters: selectedBoosters,
        additionalServices: selectedAdditionalServices,
        totalReservationPrice: reservationsWithPosts.reduce(
          (total, item) => total + item.reservation.price,
          0
        ),
        totalBoosterPrice: selectedBoosters.reduce(
          (total, booster) => total + booster.price,
          0
        ),
        totalAdditionalPrice: selectedAdditionalServices.reduce(
          (total, service) => total + service.price * service.quantity,
          0
        ),
        totalPrice,
      };

      localStorage.setItem("orderSummary", JSON.stringify(orderSummary));

      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={createCheckOutSession}>
      {loading ? (
        <Loader2 className="animate-spin h-5 w-5 text-white" />
      ) : (
        "Acheter"
      )}
    </Button>
  );
}
