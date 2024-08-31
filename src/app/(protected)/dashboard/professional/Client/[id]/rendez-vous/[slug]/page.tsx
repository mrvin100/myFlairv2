"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Share2,
  MessageCircle,
  Phone,
  Star,
  MapPin,
  Scissors,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const RendezVous = ({ params }: { params: { id: string, slug: string } }) => {
  return (
    <div>
      <div style={{ paddingRight: "5%", paddingLeft: "5%", width: "100%" }}>
        <br />
        <div className="w-full max-w-3xl mx-auto mt-8  space-y-8">
          <section>
            <h2 className="text-lg font-normal mb-4">
              Creer une Reservation pour : {params.slug} {params.id}
            </h2>
            <div className="flex items-center mb-4 md:mb-0">
              <Avatar className="w-16 h-16 mr-4">
                <AvatarImage
                  src="https://randomuser.me/api/portraits/women/84.jpg"
                  alt="Melina Beauty"
                />
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <div className="text-[#4C40ED] bg-[#F7F7FF] py-2 px-3 rounded-md text-[.7rem]">
                    Client hors Flair
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <User className="w-4 h-4 mr-1" />
                  <span>Miss Kity</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-normal mb-4">
              Sélectionnez la date et l'heure de la réservation :
            </h2>
            next content about calendar
          </section>
        </div>
        <br />
      </div>
    </div>
  );
};

export default RendezVous;
