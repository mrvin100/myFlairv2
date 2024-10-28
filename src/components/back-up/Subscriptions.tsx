"use client";

import { $Enums } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import clsx from "clsx";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionArgument {
  title: string;
  value: string;
}

interface Subscription {
  id: number;
  title: string;
  price: number;
  nbrEssaisGratuit: number;
  period: string;
  functions: string[];
  createdAt: Date;
  updatedAt: Date | null;
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/abonnement/get');
        if (!response.ok) throw new Error('Network response was not ok');

        const data: Subscription[] = await response.json();

        // Assuming functions are stored as JSON string; parsing them here
        const parsedData = data.map(sub => ({
          ...sub,
          functions: Array.isArray(sub.functions) ? sub.functions : JSON.parse(sub.functions) // Parse only if not already an array
        }));
        
        setSubscriptions(parsedData);
      } catch (err) {
        setError('Erreur lors de la récupération des abonnements');
        console.error(err);
      }
    };

    fetchSubscriptions();
  }, []);


  const handleCheckout = async (subscriptionId: number) => {
    try {
      const response = await fetch('/api/stripe/stripeAbonnement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: subscriptionId }),
      });

      const session = await response.json();

      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: session.id });
    } catch (err) {
      console.error('Error redirecting to checkout:', err);
    }
  };

  return (
    <section className="px-6 py-8 text-center lg:px-24">
      <h2 className="text-3xl font-bold tracking-tight">
        Nos abonnements <b className="italic">PRO</b>
      </h2>
      <p className="pb-16 pt-1 text-xs sm:text-sm">
        Découvrez l&apos;abonnement qui s&apos;aligne parfaitement sur votre
        profession
      </p>
      <div>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : subscriptions.length > 0 ? (
          <div className="grid justify-center grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id}>
               
                  <CardTitle className={clsx(subscription.period === "month" ? "bg-secondary-foreground text-secondary" : "", "text-xl p-4 uppercase border-b mb-4 rounded-tr-md rounded-tl-md")}>
                    {subscription.title}
                  </CardTitle>
                  <h2 className="text-3xl font-bold tracking-tight">
                    <b>
                      {subscription.price} € / Mois
                    </b>
                  </h2>
                 
          
                <span className="text-xs">{subscription.period === "month" && (
                        <b>{subscription.price} € facturés chaque mois</b>
                      ) || subscription.period === "year" && (
                        <span>{subscription.price * 12} € facturés à l'année</span>
                      )
                      }</span>
<div className="flex flex-col justify-between">
  <br />
                <CardContent>
                  <ul>
                    {subscription.functions.map((func: string) => (
                      <li
                        className="flex items-center gap-4 max-w-64 w-full mx-auto"
                        key={func}
                      >
                        <CheckIcon className="mr-2 h-6 w-6 text-black" />
                        {func} 
                      </li>
                    ))}
                  </ul>
                  <br />

                 
                </CardContent>

                <CardFooter className="flex flex-col space-y-2">
                  {subscription.nbrEssaisGratuit && (
                    <span>Vous avez le droit à 1 Mois de forfait offert</span>
                  )}
                  <Button onClick={() => handleCheckout(subscription.id)} className="w-full" role="link" size="lg">
                    {subscription.nbrEssaisGratuit ? "J'essaye Gratuitement" : "Acheter"}
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Abonnement sans engagement et résiliable sans frais
                  </div>
                </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center">
            Aucun abonnements PRO présent.
          </div>
        )}
      </div>
    </section>
  );
}
