'use client';

import type { Service, User } from '@prisma/client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProfessionalsByTown, getAllServices } from '@/data/back-up';

import { HeaderSection } from '@/components/shop/layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';

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
  idUser: string; 
}

const ProfessionalDiscoverCard = () => {
  const [publication, setPublication] = useState<Publication[]>([]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/serviceProfessional/getAlea', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        const data = await response.json();
        const mappedData = data.map((item) => ({
          id: item.id,
          name: item.title,
          imageProfil: item.user.image,
          ville: item.user.address.city,
          pays: item.user.address.country,
          prix: parseFloat(item.price),
          category: item.category,
          isAtHome: item.domicile,
          idUser: item.user.id, 
        }));
        setPublication(mappedData);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);
  function ModelPublication({ publication }: { publication: Publication }) {
    return (
      <Card style={{ margin: 0 }} className='min-w-[330px] rounded-md'>
        <div className='relative'>
          <Image
            src={'/nail-salon.webp'}
            width={1000}
            height={1000}
            alt="Picture of the author"
            className='rounded-md object-cover'
          />
          <button style={{ padding: '9px', background: '#F8F8F8' }} className='absolute text-sm top-2 left-2 rounded-md text-black'>{publication.category}</button>
          <img style={{ width: '40px', height: '40px', border: 'solid 2px white' }} className='object-cover absolute bottom-2 right-2 rounded-full' src={publication.imageProfil} alt="" />
        </div>
        <br />
        <CardContent>
          <div>{publication.name}</div>
          <div className='flex justify-between items-center'>
            <div className='flex items-center' style={{ marginTop: '3%' }}>
              <img src={'/iconService/map-pin-3.svg'} alt="map.icon" />
              <span style={{ color: "#CECECE", marginLeft: '5px' }}>{publication.isAtHome ? (
                <span style={{ color: "#CECECE" }}>À Domicile</span>
              ) : (
                <span style={{ color: "#CECECE" }}>{publication.ville}</span>
              )},</span>
              <span style={{ color: "#CECECE", marginLeft: '5px' }}>{publication.isAtHome ? (
                <span style={{ color: "#CECECE" }}>{publication.ville}</span>
              ) : (
                <span style={{ color: "#CECECE" }}>{publication.pays}</span>
              )}</span>
            </div>
            <div className='flex items-center' style={{ color: '#CECECE', marginTop: '3%', marginRight: '2px' }}><StarFilled style={{ color: '#F7F74A', fontSize: '24px', marginRight: '5px' }} /> {publication.starRating}/5</div>
          </div>
          <br />
          <div className='flex justify-between'>
            <span>A partir de <span style={{ fontWeight: '700', fontSize: '150%' }}>{publication.prix} €</span></span>
            <Button>Réserver</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {publication.map(pub => (
        <ModelPublication key={pub.id} publication={pub} />
      ))}
    </div>
  );
}

export default function BackUpPage() {
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
  }, [user]);

  const disabled = false;
  const handleSelect = (x: any) => setService(x);

  return (
    <main>
      <HeaderSection title="Trouvez le professionnel parfait">
        
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
              <Link
                href={`/back-up/explore?service=${service.id}`}
                key={service.id}
              >
                <Card className="flex flex-col items-center">
                  <CardHeader>
                    <Image
                      src={service.image || '/default-service-image.jpg'}
                      alt={service.title}
                      width={1000}
                      height={1000}
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
          <ProfessionalDiscoverCard />
          <br />
          <div className='flex justify-center'>
            <Link href={'/back-up/explore'}>
              <Button>Voir plus</Button>
            </Link>
          </div>
        </section>

        <Subscriptions />
      </div>
    </main>
  );
}
