import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PublicationActions({ publication, onUpdate, onDelete }) {
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serviceData, setServiceData] = useState({
    title: publication.name,
    category: publication.category,
    price: publication.prix,
  });

  const handleServiceChange = (field, value) => {
    setServiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateService = async () => {
    await onUpdate(publication.id, serviceData);
    setShowServiceDialog(false);
  };

  const handleDeletePublication = async () => {
    await onDelete(publication.id);
    setShowDeleteDialog(false);
  };

  return (
    <div className="flex space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setShowServiceDialog(true)}>
            Modifier Service
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setShowProfileDialog(true)}>
            Modifier Profil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titre
              </Label>
              <Input
                id="title"
                value={serviceData.title}
                onChange={(e) => handleServiceChange("title", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Catégorie
              </Label>
              <Input
                id="category"
                value={serviceData.category}
                onChange={(e) => handleServiceChange("category", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Prix
              </Label>
              <Input
                id="price"
                type="number"
                value={serviceData.price}
                onChange={(e) => handleServiceChange("price", e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowServiceDialog(false)} variant="outline">Annuler</Button>
            <Button onClick={handleUpdateService}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier Profil</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Contenu du dialogue de modification du profil ici.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setShowProfileDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette publication ? Cette action est irréversible.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setShowDeleteDialog(false)} variant="outline">Annuler</Button>
            <Button onClick={handleDeletePublication} variant="destructive">Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}