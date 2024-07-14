'use client'
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getBusinessBoosterById } from '@/data/business-booster';
import Home from '../../../../../components/shop/steps/reservation/Calendar';
import Cart from '@/components/shop/steps/reservation/cart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DateProvider } from '../../../../../../dateContext';

const ReservationStep = () => {
  
  const pathname = usePathname();
  const segments = pathname.split('/');
  const lastSegment = segments[segments.length - 1];


  useEffect(() => {
    if (lastSegment) {
      (async () => {
        const _businessBooster = await getBusinessBoosterById(lastSegment as string); // Appel à votre fonction pour récupérer les données
        if (!_businessBooster) {
          
        }
      })();
    }
  }, [lastSegment]);

  return (
    <DateProvider>
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
    </DateProvider>
  );
};

export default ReservationStep;
