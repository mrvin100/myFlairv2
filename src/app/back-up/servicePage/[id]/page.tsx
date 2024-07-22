'use client'
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Service {
  id: number;
  title: string;
  description: string;
  imageProfil: string;
  ville: string;
  pays: string;
  price: string;
  category: string;
  domicile: boolean;
  dureeRDV: string;
  user: {
    id: string;
    image: string;
    address: {
      city: string;
      country: string;
    };
    firstName: string;
    lastName: string;
  };
}

const DateChoice = ({ params }: { params: { id: string } }) => {
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date())
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/serviceProfessional/getById/${params.id}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Service = await response.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };
    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  if (!service) {
    return <div className='flex flex-col justify-center items-center'>Chargement en cours...</div>;
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 pl-[10%] pr-[10%] pt-8 md:flex">
      <div className="">
        <div className="flex flex-row">
          <Image
          alt="image Of Professional"
          src={service.user.image}
          />
          <h1 className="flex flex-row items-center text-2xl">
            {service.user.firstName} {service.user.lastName}
          </h1>
        </div>
        <div className="flex flex-row items-center text-lg" style={{ marginTop: '20px' }}>
          <div className="flex flex-row items-center text-sm text-slategray">
            <img src="/iconService/map-pin-3.svg" alt="" className="flex items-center" />
            <div className="flex items-center" style={{ marginLeft: '10px' }}>
            <p className="text-[#E5E5E5]">{`${service.user.address.city}, ${service.user.address.country}`}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700' }} className="text-2xl">Prestation :</span>
        <div style={{ border: 'solid 2px #ECECEC', padding: '25px', marginTop: '5%' }} className="flex justify-between items-start rounded">
          <div className="flex flex-col justify-start items-start" style={{ width: '70%' }}>
            <div className='flex'>
              <button style={{ background: '#ECECEC' }} className="text-lg rounded py-2 px-4">{service.category}</button>
              {service.domicile && (
                <button style={{ color: '#2DB742', background: '#ABEAB5' }}>Service à domicile</button>
              )}
            </div>
            <br />
            <h1>{service.title}</h1>
            <br />
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum delectus fuga nemo nesciunt, laborum amet labore dolore, accusamus fugit repudiandae ipsum fugiat suscipit dignissimos consectetur, vero doloribus. Soluta, ratione exercitationem!</p>
          </div>
          <div className="flex flex-col items-end justify-between p-4">
            <h1 style={{ fontSize: '250%' }} className="font-bold">{service.price} €</h1>
            <span style={{ color: '#EAEAEA' }}>Durée {service.dureeRDV}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-9">

        
        <div className="col-span-2">
        <span>Choisissez la date du rendez-vous</span>
          <Calendar
          disabled={(date) =>
            date < new Date()}
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mt-4"
            initialFocus
           />
      
        </div>
        <div className="col-span-7">
          {/* Other content here */}
        </div>
      </div>
    </div>
  );
}

export default DateChoice;