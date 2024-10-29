"use client";

import { useEffect, useState } from "react";
import { EuroIcon } from "lucide-react";

import { getTurnoverExcludingTaxByDateRange } from "@/data/dashboard/admin";
import { useUserContext } from "@/contexts/user";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TurnoverExcludingTax() {
  const { user } = useUserContext();

  const [turnoverExcludingTax, setTurnoverExcludingTax] = useState(0);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      setIsPending(true);
      const count = await getTurnoverExcludingTaxByDateRange(
        user?.preferences?.dateRange
      );
      setTurnoverExcludingTax(count);
      setIsPending(false);
    };
    fetchCount();
  }, [user?.preferences?.dateRange]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Chiffre d&apos;affaire (HT)
        </CardTitle>
        <EuroIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-6 w-16 rounded-sm" />
        ) : (
          <div className="text-2xl font-bold">
            {Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(turnoverExcludingTax)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
