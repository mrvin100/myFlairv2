"use client";

import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { PlusCircle, Phone, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react"; 
import axios from "axios";
import { useUserContext } from "@/contexts/user";
import ClientsList from "./Client";

// Définir l'interface Client
interface Client {
  proId: string;
  status: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  complement: string;
  remarque: string;
  image: string;
}

export default function ClientsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { user } = useUserContext();
  const [clientData, setClientData] = useState<Client>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    complement: "",
    remarque: "",
    proId: user?.id || "",
    status: "active",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id) {
      setClientData((prevData) => ({
        ...prevData,
        proId: user.id || "", 
      }));
    }
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDelete = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setClientData((prevData) => ({
      ...prevData,
      image: "", 
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Les variables d'environnement Cloudinary ne sont pas correctement configurées.");
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
      console.error("Erreur lors du téléchargement de l'image:", error);
      throw error;
    }
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImages([files[0]]);
      try {
        const imageUrl = await uploadImage(files[0]);
        setClientData((prevData) => ({
          ...prevData,
          image: imageUrl,
        }));
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image:", error);
      }
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setImages([files[0]]);
      try {
        const imageUrl = await uploadImage(files[0]);
        setClientData((prevData) => ({
          ...prevData,
          image: imageUrl,
        }));
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image:", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!clientData.proId) {
      console.error("proId non défini !");
      return;
    }

    setIsSubmitting(true);
  };

  useEffect(() => {
    if (isSubmitting) {
      const addClient = async () => {
        try {
          await axios.post("/api/client/create", clientData);
          setClientData({
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            adresse: "",
            ville: "",
            codePostal: "",
            complement: "",
            remarque: "",
            proId: user?.id || "",
            status: "active",
            image: "",
          });
          setImages([]);
        } catch (error) {
          console.error("Erreur lors de l'ajout du client:", error);
        } finally {
          setIsSubmitting(false);
        }
      };

      addClient();
    }
  }, [isSubmitting, clientData, user?.id]);

  return (
    <TabsContent value="clients" className="space-y-4">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-4 flex-col">
          <h2 className="text-2xl font-semibold tracking-tight my-4">Clients</h2>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filtrer</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "flair"}
                  onCheckedChange={() => setStatusFilter(statusFilter === "flair" ? "all" : "flair")}
                >
                  Flair
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "boutique"}
                  onCheckedChange={() => setStatusFilter(statusFilter === "boutique" ? "all" : "boutique")}
                >
                  Boutique
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ajouter un client</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-normal">Ajouter un client</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[28rem]">
                  <div className="p-4">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informations générales</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="nom">Nom</Label>
                            <Input
                              id="nom"
                              name="nom"
                              placeholder="Nom du client"
                              value={clientData.nom}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="prenom">Prénom</Label>
                            <Input
                              id="prenom"
                              name="prenom"
                              placeholder="Prénom du client"
                              value={clientData.prenom}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              placeholder="Email du client"
                              value={clientData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telephone">Téléphone</Label>
                            <Input
                              id="telephone"
                              name="telephone"
                              placeholder="Téléphone du client"
                              value={clientData.telephone}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="adresse">Adresse</Label>
                            <Textarea
                              id="adresse"
                              name="adresse"
                              placeholder="Adresse du client"
                              value={clientData.adresse}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ville">Ville</Label>
                            <Input
                              id="ville"
                              name="ville"
                              placeholder="Ville du client"
                              value={clientData.ville}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="codePostal">Code Postal</Label>
                            <Input
                              id="codePostal"
                              name="codePostal"
                              placeholder="Code postal"
                              value={clientData.codePostal}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="complement">Complément</Label>
                            <Input
                              id="complement"
                              name="complement"
                              placeholder="Complément d'adresse"
                              value={clientData.complement}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="remarque">Remarque</Label>
                          <Textarea
                            id="remarque"
                            name="remarque"
                            placeholder="Remarques"
                            value={clientData.remarque}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="image">Image du client</Label>
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileInputChange}
                          />
                          <div
                            className="border-dashed border-2 p-4 cursor-pointer"
                            onClick={handleClick}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                          >
                            {images.length === 0 ? (
                              <p>Glissez ou cliquez pour ajouter une image</p>
                            ) : (
                              <div className="relative">
                                <img src={URL.createObjectURL(images[0])} alt="Client Image" />
                                <button
                                  type="button"
                                  className="absolute top-0 right-0"
                                  onClick={() => handleDelete(0)}
                                >
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "En cours..." : "Ajouter le client"}
                      </Button>
                    </form>
                  </div>
                </ScrollArea>
                <DialogClose />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <ClientsList searchTerm={searchTerm} statusFilter={statusFilter} />
      </div>
    </TabsContent>
  );
}
