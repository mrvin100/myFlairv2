import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { CircleDot, MapPin, Phone, Upload } from "lucide-react";
import Image from "next/image";

export default function Client({ typeClient = "boutique" }) {
  return (
    <div className="bg-white w-full border rounded-sm p-4">
      <div>
        <Image
          src={"/nail-salon.webp"}
          height={120}
          width={120}
          alt="client profile"
          className="rounded-full object-cover h-24 w-24 inline-block mr-4"
        />
        <div
          className={clsx(
            typeClient == "boutique"
              ? "bg-blue-100 text-blue-600"
              : "text-black-500 bg-gray-300",
            "rounded-sm py-2 px-3 text-[.7rem] w-auto inline-block"
          )}
        >
          Client {typeClient == "boutique" ? "en boutique" : "flair"}
        </div>
      </div>
      <div className="flex flex-auto">
        <ul className="text-sm text-gray-500 my-4 mx-auto flex flex-col gap-3">
          <li>
            <strong>Nom :</strong> Miss
          </li>
          <li>
            <strong>Prenom :</strong> Kitty
          </li>
          <li>
            <strong>Email :</strong> missKity@gmail.com
          </li>
          <li>
            <strong>Telephone :</strong>0033(0)6 02 03 03 05
          </li>
          <li>
            <strong>Adresse :</strong> 06 rue des alpes, 75016 Paris France
          </li>
        </ul>
      </div>
      <div className="flex gap-4 items-center flex-wrap justify-end">
        <Button variant={"outline"}>Supprimer</Button>
        <Button variant={"outline"}>Créer une réservation</Button>
        <Button variant={"outline"}>Consulter ses réservations</Button>
        <Dialog>
                <DialogTrigger asChild>
                  <Button>
                      Modifier
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-normal">Modifier un client</DialogTitle>
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
                                  placeholder="+33(0) 6 02 69 69 56"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-normal">
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
                                placeholder="Lorem ipsum dolor ut vehicula turpis. Maecenas ut massa lectus."
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
  );
}
