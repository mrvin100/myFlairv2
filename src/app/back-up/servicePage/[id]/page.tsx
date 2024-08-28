'use client'
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, MapPin, MessageCircle, Phone, Scissors, Share2, Star, Youtube } from "lucide-react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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
    <>
    {/* <div className="h-full flex-1 flex-col space-y-8 pl-[10%] pr-[10%] pt-8 md:flex">
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
        </div>
      </div>
    </div> */}
    <div className="h-full flex-1 flex-col space-y-8 pl-8 pr-2 pt-8 pb-8 md:flex">

<Card className="w-full max-w-4xl mx-auto">
  <CardContent className="p-6">
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Avatar className="w-16 h-16 mr-4">
                <AvatarImage src="/placeholder.svg" alt="Melina Beauty" />
                <AvatarFallback>MB</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">Melina Beauty</h2>
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(255 avis)</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Scissors className="w-4 h-4 mr-1" />
                  <span>Coiffeuse</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>02 rue des alpes, Paris, France</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="flex space-x-2 mb-2">
                <Button variant="outline" size="icon">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Youtube className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
      </CardContent>
    </Card>
    </div>
          </>
  );
}

export default DateChoice;