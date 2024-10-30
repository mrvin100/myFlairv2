"use client";

import { useEffect, useState } from "react";
import { ArrowRightLeftIcon } from "lucide-react";

import { getTransactionCountByDateRange } from "@/data/dashboard/admin";
import { useUserContext } from "@/contexts/user";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsCount() {
  const { user } = useUserContext();

  const [transactionsCount, setTransactionsCount] = useState(0);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      setIsPending(true);
      const count = await getTransactionCountByDateRange(
        user?.preferences?.dateRange
      );
      setTransactionsCount(count);
      setIsPending(false);
    };
    fetchCount();
  }, [user?.preferences?.dateRange]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Nombre de transactions
        </CardTitle>
        <ArrowRightLeftIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-6 w-16 rounded-sm" />
        ) : (
          <div className="text-2xl font-bold">{transactionsCount}</div>
        )}
      </CardContent>
    </Card>
  );
}
