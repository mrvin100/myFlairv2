"use client"
import React, { useRef, useState, useEffect } from "react";
import { useUserContext } from "@/contexts/user";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ReactQuill from "react-quill";
import axios from "axios";
import {
  PlusCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  ChevronsUpDown,
  Bell,
  CircleMinus,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomToast, toast } from "@/components/ui/custom-toast";

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
  socialMedia: Record<string, string>;
  biography?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

interface UserRole {
  id: string;
  name: string;
}

interface Social {
  value: string;
  label: string;
  icon: React.ElementType;
}

const socialsList: Social[] = [
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "youtube", label: "Youtube", icon: Youtube },
  { value: "linkedin", label: "Linkedin", icon: Linkedin },
];

export default function ProfileTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserContext();
  const [userActual, setUserActual] = useState<User | null>(null);
  const [localUserData, setLocalUserData] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [localSocials, setLocalSocials] = useState<
    { network: string; url: string }[]
  >([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoadingProfileImage, setIsLoadingProfileImage] = useState(true);

  useEffect(() => {
    if (userActual) {
      setLocalUserData(userActual);
      const initialSocials = Object.entries(userActual.socialMedia).map(
        ([network, url]) => ({
          network,
          url: url as string,
        })
      );
      setLocalSocials(initialSocials);
    }
  }, [userActual]);

  const handleSocialsChange = (newSocials: { network: string; url: string }[]) => {
    setLocalSocials(newSocials);
    setHasChanges(true);  
  };

  const handleDelete = () => {
    setImages([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!localUserData) return;

    const updateData = {
      gallery: userActual.gallery,
      enterprise: userActual.enterprise,
      biography: userActual.biography,
      address: {
        ...userActual.address,
        street: userActual.address.street,
        city: userActual.address.city,
        postalCode: userActual.address.postalCode,
        country: userActual.address.country,
        complementAddress: userActual.address.complementAddress,
      },
      email: userActual.email,
      phone: userActual.phone,
      homeServiceOnly: userActual.homeServiceOnly,
      socialMedia: localSocials.reduce(
        (acc, social) => {
          acc[social.network.toLowerCase()] = social.url;
          return acc;
        },
        {} as Record<string, string>
      ),
    };

    try {
      const response = await axios.put(
        `/api/utilisateur/updateProfilePro/${user?.id}`,
        updateData
      );
      if (response.status === 200) {
        alert("Profile updated successfully!");
        setHasChanges(false);
        setUserActual(response.data);
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          title="Erreur"
          description="Échec de la mise à jour du profil. Veuillez réessayer."
          variant="error"
        />
      ));
    }
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
        const response = await fetch(
          `/api/utilisateur/getActualUser/${user?.id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserActual(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const imageUrl = await uploadImage(files[0]);
        if (localUserData) {
          setLocalUserData({
            ...localUserData,
            gallery: [...localUserData.gallery, imageUrl],
          });
          setHasChanges(true);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
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
      if (localUserData) {
        setLocalUserData({
          ...localUserData,
          gallery: [...localUserData.gallery, imageUrl],
        });
        setHasChanges(true);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteImage = (index: number) => {
    if (!localUserData) return;
    const updatedGallery = [...localUserData.gallery];
    updatedGallery.splice(index, 1);
    setLocalUserData({ ...localUserData, gallery: updatedGallery });
    setHasChanges(true);
  };

  const handleProfileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoadingProfileImage(true); // Commence le chargement
      try {
        const imageUrl = await uploadImage(file);
        if (userActual) {
          setUserActual({ ...userActual, image: imageUrl });
        }
        setProfileImage(file);
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image:", error);
        setIsLoadingProfileImage(false); // Termine le chargement même en cas d'erreur
      }
    }
  };
  const handleDeleteProfileImage = () => {
    if (userActual) {
      setUserActual({ ...userActual, image: "" });
      setProfileImage(null);
      setHasChanges(true);
    }
  };

  useEffect(() => {
    if (localUserData?.image) {
      setIsLoadingProfileImage(false);
    }
  }, [userActual?.image]);

  const handleProfileImageLoaded = () => {
    setIsLoadingProfileImage(false);
  };

  const handleProfileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (
    field: string,
    value: string | boolean,
    nestedField?: string
  ) => {
    if (localUserData) {
      if (nestedField) {
        setLocalUserData({
          ...localUserData,
          [field]: { ...localUserData[field], [nestedField]: value },
        });
      } else {
        setLocalUserData({ ...localUserData, [field]: value });
      }
      setHasChanges(true);
    }
  };

  return (
    <TabsContent value="profile">
      <div className="max-w-5xl w-full">
        <h2 className="text-xl font-normal mb-8">Mon Profile</h2>
        <form onSubmit={handleSubmit}>
          <h2 className="font-normal text-lg my-4">Image profil</h2>
          <div className="flex gap-3 justify-center items-center flex-col md:flex-row md:justify-start">
            {isLoadingProfileImage ? (
              <Skeleton className="w-24 h-24 rounded-full" />
            ) : (
              <Image
                src={userActual?.image || "/nail-salon.webp"}
                height={120}
                width={120}
                alt="client profile"
                className="rounded-full object-cover h-24 w-24"
                onLoadingComplete={() => setIsLoadingProfileImage(false)} // Assurez-vous de mettre à jour l'état de chargement
              />
            )}
            <div>
              <div className="flex gap-4 my-3 justify-center md:justify-start">
                <input
                  type="file"
                  onChange={handleProfileInputChange}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <Button type="button" onClick={handleProfileInputClick}>Télécharger</Button>
                <Button type="button" onClick={handleDeleteProfileImage} variant="outline">
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
          <h2 className="font-normal text-lg my-8">Informations Public</h2>
          <div className="px-1">
            <label htmlFor="entreprise" className="mb-3 inline-block">
              Nom de votre entreprise
            </label>
            <Input
              type="text"
              onChange={(e) => handleInputChange("enterprise", e.target.value)}
              placeholder="Ex: Milana Beauty"
              required
              id="entreprise"
              value={localUserData?.enterprise || ""}
            />
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
              value={localUserData?.biography || ""}
              onChange={(content) => handleInputChange("biography", content)}
              placeholder="Décrivez votre entreprise ici..."
            />
          </div>
          <br />
          <form onSubmit={handleSubmit}>
            <h2 className="font-normal text-lg my-8">Informations Public</h2>
            <h3 className="text-sm mb-3">Réseaux sociaux</h3>
            <SocialsProfiles
              initialSocials={localSocials}
              onSocialsChange={handleSocialsChange}
            />
            <div className="flex justify-end mt-8">
              <Button type="submit" disabled={!hasChanges}>
                Appliquer les changements
              </Button>
            </div>
          </form>
          <h2 className="font-normal text-lg my-8">Contact public</h2>

          <div className="flex gap-3 flex-col md:flex-row px-1">
            <div className="w-full">
              <label className="mb-3 inline-block">Email</label>
              <div className="flex items-end">
                <Input
                  type="text"
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ex: myname@myFlair.fr"
                  value={localUserData?.email || ""}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="mb-3 inline-block">Numéros de téléphone</label>
              <div className="flex items-end">
                <Input
                  type="text"
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  placeholder="Ex: 0123456789"
                  value={localUserData?.phone || ""}
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
                  checked={localUserData?.homeServiceOnly || false}
                  onCheckedChange={(checked) =>
                    handleInputChange("homeServiceOnly", checked)
                  }
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
          </div>
          <br />
          <div className="px-1">
            <label htmlFor="address" className="mb-3 inline-block">
              Adresse
            </label>
            <Input
              type="text"
              onChange={(e) =>
                handleInputChange("address", e.target.value, "street")
              }
              placeholder="Ex: 30 rue Molière"
              required
              id="address"
              value={localUserData?.address?.street || ""}
            />
          </div>
          <br />

          <div className="flex gap-3 flex-col md:flex-row px-1">
            <div className="w-full">
              <label className="mb-3 inline-block">Ville *</label>
              <div className="flex items-end">
                <Input
                  type="text"
                  onChange={(e) =>
                    handleInputChange("address", e.target.value, "city")
                  }
                  placeholder="Ex: Marseille"
                  value={localUserData?.address?.city || ""}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="mb-3 inline-block">Code postal *</label>
              <div className="flex items-end">
                <Input
                  type="text"
                  onChange={(e) =>
                    handleInputChange("address", e.target.value, "postalCode")
                  }
                  required
                  placeholder="Ex: 12400"
                  value={localUserData?.address?.postalCode || ""}
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
                onChange={(e) =>
                  handleInputChange("address", e.target.value, "country")
                }
                placeholder="Ex: France"
                required
                value={localUserData?.address?.country || ""}
              />
            </div>
          </div>
          <br />
          <div className="px-1">
            <label htmlFor="complementAddress" className="mb-3 inline-block">
              Complément d&apos;adresse
            </label>
            <Input
              type="text"
              onChange={(e) =>
                handleInputChange(
                  "address",
                  e.target.value,
                  "complementAddress"
                )
              }
              placeholder="Ex: Plus d'infos complementaires sur votre addresse..."
              id="complementAddress"
              value={localUserData?.address?.complementAddress || ""}
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

            {localUserData?.gallery && localUserData.gallery.length > 0 && (
              <div>
                <h3 className="my-4">Sélectionner une image par défaut</h3>
                <div className="flex flex-wrap">
                  {localUserData.gallery.map((imageUrl, index) => (
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
          <div className="flex justify-end mt-8">
            <Button type="submit" disabled={!hasChanges}>
              Appliquer les changements
            </Button>
          </div>
        </form>
      </div>
    </TabsContent>
  );
}

interface SocialsProfilesProps {
  initialSocials: { network: string; url: string }[];
  onSocialsChange: (socials: { network: string; url: string }[]) => void;
}

export function SocialsProfiles({
  initialSocials,
  onSocialsChange,
}: SocialsProfilesProps) {
  const [socials, setSocials] = useState<{ network: string; url: string }[]>(initialSocials);
  const [selectedSocial, setSelectedSocial] = useState<Social>(socialsList[0]);
  const [socialLink, setSocialLink] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSocials(initialSocials);
  }, [initialSocials]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddSocial = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!selectedSocial.value) {
      setError("Veuillez sélectionner un réseau social.");
      return;
    }
    if (!socialLink) {
      setError("Veuillez entrer un lien pour le réseau social.");
      return;
    }
    if (!isValidUrl(socialLink)) {
      setError("Veuillez entrer une URL valide.");
      return;
    }
    console.log('g')
    const existingSocialIndex = socials.findIndex(
      (s) => s.network === selectedSocial.value
    );
    if (existingSocialIndex !== -1) {
      const updatedSocials = [...socials];
      updatedSocials[existingSocialIndex].url = socialLink;
      setSocials(updatedSocials);
      onSocialsChange(updatedSocials);
    } else {
      const newSocials = [
        ...socials,
        { network: selectedSocial.value, url: socialLink },
      ];
      setSocials(newSocials);
      onSocialsChange(newSocials);
    }

    setSocialLink("");
    setSelectedSocial(socialsList[0]);
    setError(null);
  };

  const removeSocialNetwork = (network: string) => {
    const updatedSocials = socials.filter((s) => s.network !== network);
    setSocials(updatedSocials);
    onSocialsChange(updatedSocials);
  };

  const handleSocialLinkChange = (network: string, newUrl: string) => {
    const updatedSocials = socials.map((s) =>
      s.network === network ? { ...s, url: newUrl } : s
    );
    setSocials(updatedSocials);
    onSocialsChange(updatedSocials);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              {React.createElement(selectedSocial.icon, {
                className: "mr-2 h-4 w-4",
              })}
              {selectedSocial.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {socialsList.map((social) => (
              <DropdownMenuItem
                key={social.value}
                onClick={() => setSelectedSocial(social)}
              >
                {React.createElement(social.icon, {
                  className: "mr-2 h-4 w-4",
                })}
                {social.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex-grow">
          <Input
            type="text"
            value={socialLink}
            onChange={(e) => setSocialLink(e.target.value)}
            placeholder={`Ex: https://www.${selectedSocial.value}.com/username`}
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleAddSocial}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ajouter un réseau social</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {socials.length > 0 ? (
        <div className="space-y-2">
          {socials.map((socialNetwork) => {
            const social = socialsList.find(
              (s) => s.value === socialNetwork.network
            );
            return (
              <div
                key={socialNetwork.network}
                className="flex items-center gap-2"
              >
                <Button variant="outline" className="w-10 p-0">
                  {social &&
                    React.createElement(social.icon, { className: "h-4 w-4" })}
                </Button>
                <Input
                  type="text"
                  value={socialNetwork.url}
                  onChange={(e) =>
                    handleSocialLinkChange(
                      socialNetwork.network,
                      e.target.value
                    )
                  }
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeSocialNetwork(socialNetwork.network)}
                  className="px-1"
                >
                  <CircleMinus className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertTitle>Aucun réseau social</AlertTitle>
          <AlertDescription>
            Veuillez ajouter vos réseaux sociaux.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}