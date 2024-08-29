import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import {
  Info,
  ListFilter,
  PlusCircle,
  Search,
  Upload,
  Phone,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Client from "./Client";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
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

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ClientsTab() {
  return (
    <TabsContent value="clients" className="space-y-4">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2 flex-col">
          <h2 className="text-2xl font-bold tracking-tight my-4">Clients</h2>

          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-between">
            <form className="mr-auto flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pr-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </form>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Trier
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Trier par</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Flair
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Boutique</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Autres</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Ajouter un client
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle  className="font-normal">Ajouter un client</DialogTitle>
                  </DialogHeader>
                    <ScrollArea className="h-[28rem]">
                      <div className="p-4">
                        <form className="space-y-8">
                          <div className="space-y-2">
                            <Label htmlFor="profile-image">
                              Image de profil
                            </Label>
                            <div className="flex items-center space-x-2">
                              {/* <Input id="profile-image" type="file" className="sr-only" /> */}
                              <Label
                                htmlFor="profile-image"
                                className="flex items-center justify-center w-20 h-20 border-2 border-dashed rounded-full cursor-pointer hover:border-primary"
                              >
                                <Upload className="w-8 h-8 text-muted-foreground" />
                              </Label>
                              <span className="text-sm text-muted-foreground">
                                Cliquez pour charger une image
                              </span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-normal">
                              Informations générales
                            </h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="nom">Nom</Label>
                                <Input id="nom" placeholder="Nom du client" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="prenom">Prénom</Label>
                                <Input
                                  id="prenom"
                                  placeholder="Prénom du client"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="telephone">
                                Numéro de téléphone
                              </Label>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <Input
                                  id="telephone"
                                  type="tel"
                                  placeholder="+33 1 23 45 67 89"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3  className="font-normal">
                              Adresse de facturation
                            </h3>
                            <div className="space-y-2">
                              <Label htmlFor="adresse">Adresse</Label>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <Input
                                  id="adresse"
                                  placeholder="123 rue de la Paix"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="ville">Ville</Label>
                                <Input id="ville" placeholder="Paris" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="code-postal">Code postal</Label>
                                <Input id="code-postal" placeholder="75000" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="complement">
                                Complément d'adresse
                              </Label>
                              <Input
                                id="complement"
                                placeholder="Appartement, étage, etc."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="remarque">Remarque</Label>
                              <Textarea
                                id="remarque"
                                placeholder="Informations supplémentaires..."
                                rows={4}
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </ScrollArea>
                    <div className="flex justify-end space-x-4 mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                      </DialogClose>
                      <Button>Ajouter</Button>
                    </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="border-y p-4 w-full">
            <Client />
          </div>
          {/* pagination */}
          <div className="my-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
