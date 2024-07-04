import { TabsContent } from '@/components/ui/tabs';

export default function SubscriptionsTab() {
  return (
    <TabsContent value="subscriptions" className="space-y-4">
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Abonnements</h2>
        </div>
      </div>
    </TabsContent>
  );
}
