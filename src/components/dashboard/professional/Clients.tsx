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
import { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "@/contexts/user";
import ClientsList from "./Client";

// Define the Client interface
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
}

export default function ClientsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState("all");
  const { user } = useUserContext();
  const [clientData, setClientData] = useState<Client>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    complement: '',
    remarque: '',
    proId: "",
    status: "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Set the submission flag to true
  };

  useEffect(() => {
    if (isSubmitting) {
      const addClient = async () => {
        try {
          await axios.post('/api/clients', clientData);
          setClientData({
            nom: '',
            prenom: '',
            email: '',
            telephone: '',
            adresse: '',
            ville: '',
            codePostal: '',
            complement: '',
            remarque: '',
            proId: user?.id || "",
            status: "active",
          });
        } catch (error) {
          console.error("Erreur lors de l'ajout du client:", error);
        } finally {
          setIsSubmitting(false); // Reset the submission flag
        }
      };

      addClient();
    }
  }, [isSubmitting, clientData, user?.id]); // Depend on submission flag and clientData

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
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="email@example.com"
                            value={clientData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telephone">Numéro de téléphone</Label>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <Input
                              id="telephone"
                              name="telephone"
                              type="tel"
                              placeholder="+33 1 23 45 67 89"
                              value={clientData.telephone}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Adresse de facturation</h3>
                        <div className="space-y-2">
                          <Label htmlFor="adresse">Adresse</Label>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <Input
                              id="adresse"
                              name="adresse"
                              placeholder="123 rue de la Paix"
                              value={clientData.adresse}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="ville">Ville</Label>
                            <Input
                              id="ville"
                              name="ville"
                              placeholder="Paris"
                              value={clientData.ville}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="code-postal">Code postal</Label>
                            <Input
                              id="code-postal"
                              name="codePostal"
                              placeholder="75000"
                              value={clientData.codePostal}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="complement">Complément d'adresse</Label>
                          <Textarea
                            id="complement"
                            name="complement"
                            placeholder="Étage, numéro d'appartement, etc."
                            value={clientData.complement}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="remarque">Remarques</Label>
                        <Textarea
                          id="remarque"
                          name="remarque"
                          placeholder="Remarques sur le client..."
                          value={clientData.remarque}
                          onChange={handleInputChange}
                        />
                      </div>

                      <Button type="submit">Ajouter le client</Button>
                    </form>
                  </div>
                </ScrollArea>
                <DialogClose asChild>
                  <Button variant="outline" className="mt-4">Annuler</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

        <div className="border-y h-full flex-1 flex-col space-y-4 md:flex py-6 my-6 w-full">
          <ClientsList searchTerm={searchTerm} statusFilter={statusFilter} />
        </div>
        
    
    </TabsContent>
  );
}
