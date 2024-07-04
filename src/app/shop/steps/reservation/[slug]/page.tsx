'use client';

import { useEffect } from 'react';

import { getBusinessBoosterById } from '@/data/business-booster';
import Home from '../../../../../components/shop/steps/reservation/Calendar';
import Cart from '@/components/shop/steps/reservation/cart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default function ReservationStep({
  params: { slug },
}: Readonly<{ params: { slug: string } }>) {
  useEffect(() => {
    (async () => {
      const _businessBooster = await getBusinessBoosterById(slug);

      if (_businessBooster) {
        window.location.href = '/';
      } else {
      }
    })();
  });

  return (
    <main className="flex flex-col items-center justify-center p-4">
  <img src="/logos/Rectangle_21.svg" alt="" />
  <h1 className='font-bold text-2xl flex items-center mb-4'>Réserver votre Poste de Travail Flair</h1>
  <div className='flex flex-col lg:flex-row w-full justify-center items-center lg:items-start'>
    <div className='w-full lg:w-1/2 p-4'>
      <Home />
    </div>
    <div className='w-full lg:w-1/2 p-4'>
      <Cart />
      <div className="flex items-center justify-end mt-4">
        <Button className='mr-4' variant='secondary'>Annuler</Button>
        <Link href={'/shop/steps/business-boosters'}>
          <Button>Continuer</Button>
        </Link>
      </div>
    </div>
  </div>
</main>

  );
}
