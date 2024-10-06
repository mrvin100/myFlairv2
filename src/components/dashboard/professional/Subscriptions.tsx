import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';

export default function SubscriptionsTab() {
  const isSubcribed = false
  return (
    <TabsContent value="subscriptions" className="space-y-4">
      <h2 className="text-xl font-normal tracking-tight">Abonnements</h2>
      {
        isSubcribed ? <Subscribed /> : <NotSubscribed />
      }
    </TabsContent>
  );
}


function Subscribed() {
  const subscriptions = [
    {
      title: "Abonnement gestion planning mensuel",
      price: "19 €/Mois",
      status: "En cours",
      features: [
        "Date de début: 17 Février 2024 ",
        "Date de renouvellement: 17 Mars 2024",
      ]
    },
    {
      title: "Abonnement Trimestriel",
      price: "49 €/Trimestre",
      status: "En cours",
      features: [
        "Abonnement gestion planning trimestriel",
        "Essai gratuit pendant 2 mois",
        "Économisez 15% par rapport à l'abonnement mensuel"
      ]
    },
    {
      title: "Abonnement Annuel",
      price: "179 €/An",
      status: "Abonnement Expiré",
      features: [
        "Abonnement gestion planning annuel",
        "Essai gratuit pendant 3 mois",
        "Économisez 25% par rapport à l'abonnement mensuel"
      ]
    }
  ]

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-normal mb-8">Abonnement actuel : Gestion planning mensuel</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
        {subscriptions.map((sub, index) => (
          <Card key={index} className={clsx(sub.status != "En cours" ? 'shadow-red-300' : '', "flex flex-col")}>
            <CardHeader>
              <CardTitle>{sub.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex justify-between items-start">
                <ul className="list-none pl-0 space-y-2">
                  {sub.features.map((feature, i) => (
                    <li key={i} className='text-sm'>{feature}</li>
                  ))}
                </ul>
                <div className="text-right">
                  <p><Badge className='mb-4 font-normal' variant={sub.status === "En cours" ? 'secondary' : 'destructive'}>{sub.status}</Badge></p>
                  <p className="text-xl font-bold">{sub.price.split('/')[0]}<br /><sup className='font-normal text-sm'>/{sub.price.split('/')[1]}</sup></p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between gap-4 items-center'>
              <Button variant={'secondary'}>Gerer l&apos;abonnement</Button>
              {sub.status === "En cours" ? '' : <Button>Renouveler</Button>}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}


function NotSubscribed() {
  const subscriptions = [
    {
      title: "Abonnement Mensuel",
      price: "19 €/Mois",
      description: "19 € facturés chaque mois",
      features: [
        "Abonnement gestion planning mensuel",
        "Essai gratuit pendant 1 mois",
        "Abonnement sans engagement, résiliable à tout moment et sans frais"
      ]
    },
    {
      title: "Abonnement Trimestriel",
      price: "49 €/Trimestre",
      description: "49 € facturés tous les 3 mois",
      features: [
        "Abonnement gestion planning trimestriel",
        "Essai gratuit pendant 2 mois",
        "Économisez 15% par rapport à l'abonnement mensuel"
      ]
    },
    {
      title: "Abonnement Annuel",
      price: "179 €/An",
      description: "179 € facturés une fois par an",
      features: [
        "Abonnement gestion planning annuel",
        "Essai gratuit pendant 3 mois",
        "Économisez 25% par rapport à l'abonnement mensuel"
      ]
    }
  ]

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-normal mb-8">Abonnement actuel : Aucun</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
        {subscriptions.map((sub, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{sub.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex justify-between items-start">
                <ul className="list-none pl-0 space-y-2">
                  {sub.features.map((feature, i) => (
                    <li key={i} className='text-sm'>{feature}</li>
                  ))}
                </ul>
                <div className="text-right">
                  <p className="text-xl font-bold">{sub.price.split('/')[0]}<br /><sup className='font-normal text-sm'>/{sub.price.split('/')[1]}</sup></p>
                  <p className="text-sm text-muted-foreground">{sub.description}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Je m'abonne</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}