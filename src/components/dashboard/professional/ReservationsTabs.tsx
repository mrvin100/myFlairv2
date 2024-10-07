"use client"
import {
    Calendar,
  } from '@/components/dashboard/professional/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Reservations from './Reservations';

const tabs = [

    {
      title: 'Listes',
      value: 'listes',
      component: <Reservations />,
    },
    {
      title: 'Calendrier',
      value: 'calendar',
      component: <Calendar />,
    },
  ];

const ReservationsTabs = () => {
    return ( 
        <TabsContent value="reservations" className="space-y-4">
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
 
export default ReservationsTabs;