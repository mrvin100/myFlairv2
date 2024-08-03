import Image from 'next/image';
import Link from 'next/link';

import { getAllBusinessBoosters } from '@/data/business-booster';

import { Button } from '@/components/ui/button';
import Cart from '@/components/shop/steps/reservation/cart';
import CartGlobal from '../../Cart';

export default async function BusinessBoostersPage() {
  const businessBoosters = (await getAllBusinessBoosters()) || [];
  const defaultImage = "/nail-salon.webp"; // Remplacez par l'URL de l'image par défaut

  return (
    <main>
      <div className="grid grid-cols-1 gap-8 px-6 py-16 lg:px-24">
        {businessBoosters?.map((businessBooster) => (
          <div
            className="flex w-full flex-col md:flex-row md:max-w-[50rem] md:mx-auto"
            key={businessBooster.id}
          >
            <Image
              className="w-1/2"
              src={businessBooster.image || defaultImage}
              alt={businessBooster.alt}
              width={1000}
              height={1000}
            />
            <div className="w-1/2 bg-gray-100 p-4">
              <h4 className="text-[20px] font-bold">{businessBooster.title}</h4>
              <h3 className="text-[24px]">
                {Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(businessBooster.price)}
              </h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: businessBooster.description,
                }}
              ></p>

              <div className="space-y-2">
                <div className="align-end flex w-full justify-end">
                  <Button className="w-[200px]">Choisir une date</Button>
                </div>
                <div className="flex w-full justify-end">
                  <Button className="w-[200px]">Réserver</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='p-4'>
        <h2 className='font-bold text-2xl'>Panier</h2>
        <br />
        <CartGlobal/>
        <div className="flex items-center justify-end">
            <Link href={'/shop/steps/reservation'}>
              <Button className='mr-4' variant='secondary'>Annuler</Button>
            </Link>
            <Link href={'/shop/steps/additional-services'}><Button>Continuer</Button></Link>
          </div>
      </div>
    </main>
  );
}
