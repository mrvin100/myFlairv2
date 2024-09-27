"use client";

import { useRef, useState, useEffect } from "react";
import { useUserContext } from "@/contexts/user";
import { TabsContent } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ReactQuill from "react-quill";
import { SubmitButton } from "@/components/button";
import axios from "axios";
import {
  PlusCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  LucideIcon,
  ChevronsUpDown,
  Bell,
  CircleMinus,
} from "lucide-react";

interface User {
  id: string;
  stripeCustomerId?: string | null;
  image: string;
  gallery: string[];
  role: UserRole;
  username: string;
  firstName: string;
  lastName: string;
  address: Record<string, any>;
  billingAddress?: Record<string, any> | null;
  enterprise?: string | null;
  homeServiceOnly: boolean;
  email: string;
  password: string;
  forgotPassword: string;
  phone: string;
  website?: string | null;
  nameOfSociety?: string | null;
  preferences?: Record<string, any> | null;
  preferencesProWeek?: Record<string, any> | null;
  mark?: number | null;
  numberOfRate?: number | null;
  socialMedia?: Record<string, any> | null;
  biography?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

interface UserRole {
  id: string;
  name: string;
}

export default function ProfileTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserContext();
  const [images, setImages] = useState<File[]>([]);
  const [userActual, setUserActual] = useState<User | null>(null);
  const [socials, setSocials] = useState<{ network: string; url: string }[]>([]);
  const [newSocial, setNewSocial] = useState({ network: "", url: "" });


  const handleDelete = () => {
    setImages([]);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary environment variables are not properly configured."
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/utilisateur/getActualUser/${user?.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserActual(data);

        const socialMediaLinks = response.map((item: { network: string; url: unknown }) => ({
          network: item.network,
          url: typeof item.url === 'string' ? item.url : '',
        }));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const imageUrl = await uploadImage(files[0]);
        setImages([files[0]]);
        if (userActual) {
          setUserActual({
            ...userActual,
            gallery: [...userActual.gallery, imageUrl],
          });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleAddSocial = () => {
    if (!newSocial.network || !newSocial.url) return;

    const updatedSocials = [...socials, newSocial];
    setSocials(updatedSocials);
    setNewSocial({ network: "", url: "" });

    if (userActual) {
      const updatedUser = {
        ...userActual,
        socialMedia: {
          ...userActual.socialMedia,
          [newSocial.network.toLowerCase()]: newSocial.url,
        },
      };
      setUserActual(updatedUser);
    }
  };

  const handleRemoveSocial = (index: number) => {
    const updatedSocials = socials.filter((_, i) => i !== index);
    setSocials(updatedSocials);

    if (userActual) {
      const updatedSocialMedia = { ...userActual.socialMedia };
      delete updatedSocialMedia[socials[index].network.toLowerCase()];

      setUserActual({ ...userActual, socialMedia: updatedSocialMedia });
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1) {
      console.log("Vous ne pouvez sélectionner qu'une seule image.");
      return;
    }
    try {
      const imageUrl = await uploadImage(files[0]);
      setImages(files);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteImage = (index: number) => {
    if (!userActual) return;
    const updatedGallery = [...userActual.gallery];
    updatedGallery.splice(index, 1);
    setUserActual({ ...userActual, gallery: updatedGallery });
  };


  return (
    <TabsContent title="Mon Profile" value="profile">
      <div className="max-w-5xl w-full">
        <h2 className="font-normal text-lg my-4">Image profil</h2>
        <div className="flex gap-3 justify-center items-center flex-col md:flex-row md:justify-start ">

          <Image
            src={userActual?.image || ""}
            height={120}
            width={120}
            alt="client profile"
            className="rounded-full object-cover h-24 w-24"
          />


          <div>
            <div className="flex gap-4 my-3 justify-center md:justify-start">
              <Button>Télécharger</Button>
              <Button variant={"outline"}>Supprimer</Button>
            </div>
            <p className="text-sm text-gray-500">
              *La taille de l'image doit être d'au moins 320px . Fichiers
              autorisés : .png ou .jpg.
            </p>
          </div>
        </div>

        <h2 className="font-normal text-lg my-8">Informations Public</h2>
        <div className="px-1">
          <label htmlFor="entreprise" className="mb-3 inline-block">
            Nom de votre entreprise
          </label>
          <Input
            type="text"
            onChange={(e) => "fallback function"}
            placeholder="Ex: Milana Beauty"
            required
            id="entreprise"
            value={userActual?.enterprise || ""}
          />
        </div>
        <br />
        <div className="px-1">
          <label htmlFor="profession" className="mb-3 inline-block">
            Profession
          </label>
          <div className="flex items-end">
            <Input
              type="text"
              onChange={() => "lorem"}
              required
              placeholder="Ex: Coiffeuse"
              id="profession"

            />
          </div>
        </div>
        <br />
        <div
          style={{ width: "100%", height: "1px", background: "#EAEAEA" }}
        ></div>
        <br />
        <div>
          <div>Description</div>
          <br />
          <ReactQuill
            value={""}
            onChange={() => "lorem onchange"}
            placeholder="Décrivez votre entreprise ici..."
            value={userActual?.biography || ""}
          />
        </div>
        <br />

        <h2 className="font-normal text-lg my-8">Informations Public</h2>
        <h3 className="text-sm mb-3">Réseaux sociaux</h3>
        <SocialsProfiles />
        <h2 className="font-normal text-lg my-8">Contact public</h2>

        <div className="flex gap-3 flex-col md:flex-row px-1">
          <div className="w-full">
            <label className="mb-3 inline-block">Email</label>
            <div className="flex items-end">
              <Input
                type="text"
                onChange={() => "lorem"}
                placeholder="Ex: myname@myFlair.fr"
                defaultValue={userActual?.email}
              />
            </div>
          </div>
          <div className="w-full">
            <label className="mb-3 inline-block">Numéros de téléphone</label>
            <div className="flex items-end">
              <Input
                type="text"
                onChange={() => "lorem"}
                required
                placeholder="Ex: Coiffeuse"
                defaultValue={userActual?.phone}
              />
            </div>
          </div>
        </div>
        <br />
        <div className="flex flex-col px-1">
          <div className="flex flex-col">
            <span style={{ fontSize: "70%" }}>
              Mes services sont uniquement à domicile
            </span>
            <div style={{ marginTop: "5px" }}>
              <Switch
                onCheckedChange={() => "nothing"}
                className="data-[state=checked]:bg-green-500"
                value={userActual?.homeServiceOnly || ""}
              />
            </div>
          </div>
        </div>
        <br />
        <div className="px-1">
          <label htmlFor="entreprise" className="mb-3 inline-block">
            Adresse
          </label>
          <Input
            type="text"
            onChange={(e) => "fallback function"}
            placeholder="Ex: 30 rue Molière"
            required
            id="entreprise"
            value={userActual?.address?.street || ""}
          />
        </div>
        <br />

        <div className="flex gap-3 flex-col md:flex-row px-1">
          <div className="w-full">
            <label className="mb-3 inline-block">Ville *</label>
            <div className="flex items-end">
              <Input
                type="text"
                onChange={() => "lorem"}
                placeholder="Ex: Marseille"
                value={userActual?.address?.city || ""}
              />
            </div>
          </div>
          <div className="w-full">
            <label className="mb-3 inline-block">Code postal *</label>
            <div className="flex items-end">
              <Input
                type="text"
                onChange={() => "lorem"}
                required
                placeholder="Ex: 12400"
                value={userActual?.address?.postalCode || ""}
              />
            </div>
          </div>
        </div>
        <br />
        <div className="w-full md:w-[calc(50%-.5rem)] px-1">
          <label className="mb-3 inline-block">Pays *</label>
          <div className="flex items-end">
            <Input
              type="text"
              onChange={() => "lorem"}
              placeholder="Ex: France"
              required
              value={userActual?.address?.country || ""}
            />
          </div>
        </div>
        <br />
        <div className="px-1">
          <label htmlFor="entreprise" className="mb-3 inline-block">
            Complément d&apos;adresse
          </label>
          <Input
            type="text"
            onChange={(e) => "fallback function"}
            placeholder="Ex: Plus d'infos complementaires sur votre addresse..."
            id="entreprise"
            value={userActual?.address?.complementAddress || ""}
          />
        </div>
        <br />

        <div>
          <h2 className="font-normal text-lg my-8">Galerie d&apos;image</h2>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{
              cursor: "pointer",
              width: "100%",
              height: "100px",
              border: "2px dashed #aaa",
              borderRadius: "5px",
              textAlign: "center",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <p className="flex items-center justify-center">
              Cliquez ou glissez et déposez des fichiers ici
            </p>
            <p className="text-sm">
              Formats pris en charge: JPEG, PNG, JPG et SVG
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/jpg, image/svg"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />

          {userActual?.gallery?.length > 0 && (
            <div>
              <h3 className="my-4">Sélectionner une image par défaut</h3>
              <div className="flex flex-wrap">
                {userActual.gallery.map((imageUrl, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginRight: "10px",
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "auto",
                        marginBottom: "5px",
                      }}
                      className="rounded-lg"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDeleteImage(index)}
                    >
                      <CircleMinus size={24} color="red" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


        </div>
        <div className="flex justify-end">
          <SubmitButton pending={false} onClick={() => "handleSubmit"}>
            Mettre a jour
          </SubmitButton>
        </div>
      </div>
    </TabsContent>
  );
}

import { Calendar, MoreHorizontal, Tags, User } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { userAgent } from "next/server";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar } from "@/components/ui/avatar";

type Social = {
  value: string;
  label: string;
  icon: LucideIcon;
};

const socials: Social[] = [
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "youtube", label: "Youtube", icon: Youtube },
  { value: "linkedin", label: "Linkedin", icon: Linkedin },
];

type SocialNetwork = {
  name: string;
  link: string;
  icon: LucideIcon;
};

function SocialsProfiles() {
  const [open, setOpen] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState<Social>(socials[0]);
  const [socialLink, setSocialLink] = useState<string>("");
  const [socialsNetworks, setSocialsNetworks] = useState<SocialNetwork[]>([]);
  const handleInputAddSocial = (
    social: string,
    value: string,
    icon: LucideIcon
  ) => {
    const updatedSocialsNetworks = [
      ...socialsNetworks,
      { name: social, link: value, icon: icon },
    ];
    setSocialsNetworks(updatedSocialsNetworks);
  };
  const removeSocialNetwork = (index: number) => {
    const updatedSocialsNetworks = socialsNetworks.filter(
      (_, i) => i !== index
    );
    setSocialsNetworks(updatedSocialsNetworks);
  };
  return (
    <div>
      <div className="flex w-full gap-4 flex-col items-start justify-between sm:flex-row sm:items-center px-1">
        <div className="w-full">
          <Input
            type="text-muted-foreground"
            onChange={(e) => setSocialLink(e.target.value)}
            placeholder="Ex: https://www.instagram.com/itsabiconnick/"
          />
        </div>
        <div className="flex justify-between md:justify-center gap-4">
          <div className="text-sm font-medium leading-none">
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <selectedSocial.icon className="h-4 w-4 text-black" />
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Filter label..."
                    autoFocus={true}
                  />
                  <CommandList>
                    <CommandEmpty>No label found.</CommandEmpty>
                    <CommandGroup>
                      {socials.map((social) => (
                        <CommandItem
                          key={social.label}
                          value={social.value}
                          onSelect={(value) => {
                            setSelectedSocial(() => {
                              const foundedSocial = socials.find(
                                (social) => social.value === value
                              );
                              if (foundedSocial) {
                                return foundedSocial;
                              }
                              return socials[0];
                            });
                            setOpen(false);
                          }}
                        >
                          {social.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              handleInputAddSocial(
                selectedSocial.value,
                socialLink,
                selectedSocial.icon
              )
            }
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <PlusCircle className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ajouter un réseau social</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </div>
      </div>
      <div>
        {socialsNetworks && socialsNetworks.length > 0 ? (
          socialsNetworks.map((socialNetwork, index) => (
            <div className="my-4 mx-1 flex gap-4 justify-between items-center">
              <Button variant="outline" size="sm">
                <socialNetwork.icon className="h-4 w-4 text-black" />
              </Button>
              <Input
                type="text-muted-foreground"
                placeholder="Ex: https://www.instagram.com/itsabiconnick/"
                value={socialNetwork.link}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => removeSocialNetwork(index)}
              >
                <CircleMinus className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))
        ) : (
          <div>
            <Alert className="text-center my-4">
              <Bell className="h-6 w-6 text-muted" />
              <AlertTitle className="ml-4 mb-2">Oups!</AlertTitle>
              <AlertDescription className="ml-4">
                Veuillez configurer vos réseaux soiaux.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
