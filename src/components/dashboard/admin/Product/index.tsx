"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SuscribeTab from './Suscribe';
import OrdersTab from './Orders';


const tabs = [
{
    title:'Abonnements',
    value:'suscribe',
    component:<SuscribeTab/>
  },
{
  title:'Commandes',
  value:'orders',
  component:<OrdersTab />
}
];

export default function ProductTab() {
  return (
    <TabsContent value="product" className="space-y-4">
      <Tabs defaultValue={tabs[0].value}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => tab.component)}
      </Tabs>
    </TabsContent>
  );
}
