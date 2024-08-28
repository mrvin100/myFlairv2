'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Instagram, Linkedin, Youtube, Share2, MessageCircle, Phone, Star, MapPin, Scissors, Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
    <div className="h-full flex-1 flex-col space-y-8 pl-8 pr-2 pt-8 pb-8 md:flex">

    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative col-span-2 aspect-[3/2]">
            <Image
              src="/nail-salon.webp?height=400&width=600"
              alt="Main profile image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <Button
              variant="secondary"
              className="absolute bottom-4 left-4 bg-white bg-opacity-75"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Voir la galerie
            </Button>
          </div>
          <div className="grid grid-rows-2 gap-4">
            <Image
              src="/nail-salon.webp?height=200&width=300"
              alt="Profile image 2"
              width={300}
              height={200}
              className="rounded-lg object-cover w-full h-full"
            />
            <Image
              src="/nail-salon.webp?height=200&width=300"
              alt="Profile image 3"
              width={300}
              height={200}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </div>

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
        <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Première colonne (3/4 de la largeur) */}
        <div className="col-span-1 md:col-span-3 space-y-8">
          {/* À propos */}
          <section>
            <h2 className="text-2xl font-bold mb-4">À propos de Melina Beauty</h2>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Services</h2>
            
            {/* Catégorie : Coupe femme */}
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4">Catégorie : Coupe femme</Badge>
              
              {/* Services blocks */}
              {[1, 2, 3, 4].map((index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">Coupe femme</Badge>
                        <h3 className="text-xl font-semibold mb-2">Lissage brésilien</h3>
                        <p className="text-sm text-muted-foreground">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Badge variant="outline" className="bg-green-100 text-green-800">Service à domicile</Badge>
                        <div className="text-right mt-4">
                          <p className="text-2xl font-bold">25 €</p>
                          <p className="text-sm text-muted-foreground">Durée : 30 min</p>
                        </div>
                        <Button className="mt-4">Réserver</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="link" className="mt-2">+ Voir plus de : Coupe femme ...</Button>
            </div>

            {/* Catégorie : Coupe Homme */}
            <div>
              <Badge variant="secondary" className="mb-4">Catégorie : Coupe Homme</Badge>
              
              {/* Services blocks */}
              {[1, 2].map((index) => (
                <Card key={index} className="mb-4">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">Coupe homme</Badge>
                        <h3 className="text-xl font-semibold mb-2">Coupe classique</h3>
                        <p className="text-sm text-muted-foreground">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Badge variant="outline" className="bg-green-100 text-green-800">Service à domicile</Badge>
                        <div className="text-right mt-4">
                          <p className="text-2xl font-bold">20 €</p>
                          <p className="text-sm text-muted-foreground">Durée : 25 min</p>
                        </div>
                        <Button className="mt-4">Réserver</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="link" className="mt-2">+ Voir plus de : Coupe homme ...</Button>
            </div>
          </section>
        </div>

        {/* Deuxième colonne (1/4 de la largeur) */}
        <div className="col-span-1 space-y-8">
          {/* Horaires d'ouverture */}
          <Card>
            <CardHeader>
              <CardTitle>Horaires d'ouverture</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <tbody>
                  {[
                    { day: "Lundi", hours: "9:30 - 17:00" },
                    { day: "Mardi", hours: "9:30 - 17:00" },
                    { day: "Mercredi", hours: "9:30 - 17:00" },
                    { day: "Jeudi", hours: "9:30 - 17:00" },
                    { day: "Vendredi", hours: "9:30 - 17:00" },
                    { day: "Samedi", hours: "9:30 - 17:00" },
                    { day: "Dimanche", hours: "Fermé" },
                  ].map((item, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-2">{item.day}</td>
                      <td className="py-2 text-right">{item.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Lieu */}
          <Card>
            <CardHeader>
              <CardTitle>Lieu</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src="/nail-salon.webp?height=200&width=300"
                alt="Carte"
                width={300}
                height={200}
                className="w-full h-auto rounded-lg mb-4"
              />
              <Button className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Itinéraires
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      </CardContent>
    </Card>
    </div>
  );
}

export default ProfilPage;



