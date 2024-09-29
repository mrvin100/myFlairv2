import * as React from "react";
import { TabsContent } from "@/components/ui/tabs";

import OrderList from "@/components/dashboard/admin/Product/Orders/table-datas";

export default function OrdersTab() {
  return (
    <TabsContent value="orders" className="space-y-4">
      <OrderList />
    </TabsContent>
  );
}
