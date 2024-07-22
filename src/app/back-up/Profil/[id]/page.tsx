'use client';
import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
  id: string;
  stripeCustomerId: string | null;
  image: string;
  gallery: string[];
  service: string | null;
  role: string;
  username: string;
  firstName: string;
  lastName: string;
  address: {
    city: string;
    country: string;
  };
  enterprise: string;
  homeServiceOnly: boolean;
  email: string;
  phone: string;
  website: string;
  preferences: {
    dates: {
      to: string;
      from: string;
    };
    notifications: {
      email: boolean;
      inApp: boolean;
    };
  };
  subscription: string | null;
  createdAt: string;
  updatedAt: string;
}

const ProfilPage = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/ProfilPro/${params.id}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: User = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  if (!user) {
    return <div className='flex flex-col justify-center items-center'>Chargement en cours...</div>;
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 pl-8 pr-2 pt-8 md:flex">
      <div>
        <div className="grid grid-cols-10">
          {user.gallery.length > 0 ? (
            <Image
              alt="imageBanneer"
              src={user.gallery[0]} // Utilisez la première image de la galerie pour l'exemple
              width={500} // Remplacez par la largeur appropriée
              height={300} // Remplacez par la hauteur appropriée
            />
          ) : (
            <p>Aucune image disponible</p>
          )}
        </div>
        <div></div>
        <div>
          <span style={{ fontWeight: '700' }} className="text-2xl">A propos de {user.firstName} {user.lastName}</span>
          <p className="mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo laborum tempora asperiores vitae vel cupiditate doloribus excepturi earum, non quis rerum eligendi nam maxime minus! Est magnam iusto impedit esse.</p>
        </div>
        <div>
          <span style={{ fontWeight: '700' }} className="text-2xl">Services</span>
        </div>
        <div>
          <span style={{ fontWeight: '700' }} className="text-2xl">Avis</span>
        </div>
      </div>
      <div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default ProfilPage;