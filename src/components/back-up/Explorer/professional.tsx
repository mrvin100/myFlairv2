'use client';

import type { Service, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProfessionalsByTown, getAllServices } from '@/data/back-up';
import { HeaderSection } from '@/components/shop/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StarFilled } from "@ant-design/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserContext } from '@/contexts/user';
import Subscriptions from '@/components/back-up/Subscriptions';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProfessionalDiscoverCard from '@/components/back-up/Explorer/professional';

interface Publication {
  id: string;
  name: string;
  imageProfil: string;
  ville: string;
  pays: string;
  prix: number;
  starRating: number;
  category: string;
  isAtHome: boolean;
}

const BackUpPage = () => {
  const { user } = useUserContext();

  const [service, setService] = useState('');
  const [options, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      setServices(await getAllServices());
      setProfessionals(
        await getProfessionalsByTown(user?.address?.town || 'Paris'),
      );
    })();
  }, []);

  const handleSelect = (service: string) => setService(service);

  return (
    <main>
      <HeaderSection title="Trouvez le professionnel parfait">
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Sélectionner un service" />
          </SelectTrigger>
          <SelectContent>
            {/* Contenu du Select */}
          </SelectContent>
        </Select>
        <Button
          onClick={() =>
            (window.location.href = `/back-up/explore?service=${service}`)
          }
        >
          Explorer
        </Button>
      </HeaderSection>

      <div className="py-8">
        <section className="px-6 py-8 text-center lg:px-24">
          <h2 className="text-3xl font-bold tracking-tight">
            Que recherchez-vous ?
          </h2>
          <p className="pb-16 pt-1 text-xs text-muted-foreground sm:text-sm">
            Trouvez les services professionnels à proximité
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {options.map((service) => (
              <Link href="/" key={service.id}>
                <Card className="flex flex-col items-center">
                  <CardHeader>
                    <Image
                      src={service.image} {/* Assurez-vous que 'image' est correctement défini */}
                      alt={service.title}
                      width={0}
                      height={0}
                      className="w-full"
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mt-2">{service.title}</CardTitle>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-6 py-8 text-center lg:px-24">
          <h2 className="text-3xl font-bold tracking-tight">
            Des professionnels à votre disposition
          </h2>
          <p className="pb-16 pt-1 text-xs sm:text-sm">
            Pour des solutions sur mesure
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publication.map(pub => (
              <ProfessionalDiscoverCard key={pub.id} publication={pub} />
            ))}
          </div>
        </section>

        <Subscriptions />
      </div>
    </main>
  );
};

export default BackUpPage;
