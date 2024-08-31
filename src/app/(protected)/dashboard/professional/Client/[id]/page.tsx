'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Facebook, Instagram, Linkedin, Youtube, Share2, MessageCircle, Phone, Star, MapPin, Scissors, Image as ImageIcon, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Service {
  title: string;
  category: string;
  price: string;
  description: string;
  dureeRDV: string;
  domicile: boolean;
  image: string;
  [key: string]: string | boolean;
}

const AjouterUneReservation = () => {
  const [services, setServices] = useState<Service[]>([
    {
      title: "",
      category: "",
      price: "",
      description: "",
      dureeRDV: "",
      domicile: false,
      image: ""
    }
  ]);

  return (
    <div style={{ paddingRight: "5%", paddingLeft: '5%', width: '100%' }}>
      <br />
        {/* Profile Info */}
      <div className="w-full max-w-3xl mx-auto mt-8  space-y-8">
          {/* À propos */}
          <section>
            <h2 className="text-lg font-normal mb-4">Creer une Reservation pour : </h2>
            <div className="flex items-center mb-4 md:mb-0">
            <Avatar className="w-16 h-16 mr-4">
              <AvatarImage src="https://randomuser.me/api/portraits/women/84.jpg" alt="Melina Beauty" />
              <AvatarFallback>MK</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <div className="text-[#4C40ED] bg-[#F7F7FF] py-2 px-3 rounded-md text-[.7rem]">Client hors Flair</div>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <User className="w-4 h-4 mr-1" />
                <span>Miss Kity</span>
              </div>
            </div>
          </div>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-lg font-normal mb-4">Selectionner une prestation : </h2>
            <form className="mr-auto flex-1 sm:flex-initial my-4">
              <div className="relative sm:w-[340px] md:w-[240px] lg:w-[340px]">
                <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pr-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </form>
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
      <br />
    </div>
  );
};

export default AjouterUneReservation;