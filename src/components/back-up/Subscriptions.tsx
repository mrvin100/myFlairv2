"use client";

import { $Enums, type Subscription } from "@prisma/client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

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

const types = {
  MONTHLY: "mois",
  YEARLY: "an",
};

const initialSubscriptions: Subscription[] = [
  {
      id: 'sub_monthly_1',
      title: 'Mensuel',
      description: "19 € facturés chaque mois",
      price: 19,
      arguments: [
          { title: 'Espace de stockage', value: '10 Go', type: "POSITIVE" },
          { title: "Nombre d'utilisateurs", value: '1', type: "POSITIVE" },
      ],
      type: $Enums.SubscriptionType.MONTHLY,
      createdAt: new Date('2023-11-22'),
      updatedAt: new Date('2023-12-05'),
  },
  {
      id: 'sub_annual_1',
      title: 'Annuel',
      description: '200 € facturés à l’année',
      price: 16,
      arguments: [
          { title: 'Espace de stockage', value: '100 Go', type: "POSITIVE" },
          { title: "Nombre d'utilisateurs", value: '5', type: "POSITIVE" },
          { title: 'Support prioritaire', value: 'Oui', type: "POSITIVE" },
      ],
      type: $Enums.SubscriptionType.YEARLY,
      createdAt: new Date('2023-09-15'),
      updatedAt: null,
  },
];

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);

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
        {subscriptions && subscriptions.length > 0 ? (
          <div className="grid justify-center grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardHeader>
                  <CardTitle className={clsx(`${subscription.type === "MONTHLY" ? "bg-secondary-foreground text-secondary" : ""}`,"text-xl p-4 uppercase border-b mb-4 rounded-md")}>
                    {subscription.title}
                    
                  </CardTitle>
                  <h2 className="text-3xl font-bold tracking-tight">
                    <b>
                      {subscription.price}/Mois
                    </b>
                  </h2>
                  <CardDescription>{subscription.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul>
                    {subscription.arguments &&
                      subscription.arguments.map((argument: any) => (
                        <li
                          className="flex items-center gap-4 max-w-64 w-full mx-auto"
                          key={argument.title}
                        >
                          {argument.type === "POSITIVE" ? (
                            <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                          ) : (
                            <Cross2Icon className="mr-2 h-4 w-4 text-red-500" />
                          )}
                          {argument.title}
                        </li>
                      ))}
                  </ul>
                </CardContent>

                <CardFooter className="flex flex-col space-y-2">
                  <Link
                    className="w-full"
                    href={`/back-up/subscriptions/payment?type=${subscription.type.toLowerCase()}`}
                  >
                    <Button className="w-full" role="link" size="lg">
                    J'essaye Gratuitement
                    </Button>
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    Abonnement sans engagement et résiliable sans frais
                  </div>
                </CardFooter>
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
