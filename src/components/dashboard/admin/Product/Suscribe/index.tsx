import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";

interface CreateSuscribe {
  title: string;
  price: number;
  nbrEssaisGratuit: number;
  period: string;
  functions: string[];
}

export default function SuscribeTab() {
  const [createSuscribe, setCreateSuscribe] = useState<CreateSuscribe>({
    title: "",
    price: 0,
    nbrEssaisGratuit: 0,
    period: "",
    functions: [],
  });

  const [abonnement, setAbonnement] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newFunction, setNewFunction] = useState<string>("");

  // Mise à jour de l'état lors du changement des champs
  const handleAbonnementChange = (field: string, value: any) => {
    setCreateSuscribe((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFunctionChange = (value: string) => {
    setNewFunction(value);
  };

  const addFunction = () => {
    if (newFunction.trim() !== "") {
      setCreateSuscribe((prev) => ({
        ...prev,
        functions: [...prev.functions, newFunction],
      }));
      setNewFunction("");
    }
  };

  const removeFunction = (index: number) => {
    setCreateSuscribe((prev) => ({
      ...prev,
      functions: prev.functions.filter((_, i) => i !== index),
    }));
  };

  // Fonction pour créer un abonnement
  const handleCreateAbonnement = async () => {
    const abonnementData = {
      title: createSuscribe.title,
      price: createSuscribe.price,
      nbrEssaisGratuit: createSuscribe.nbrEssaisGratuit,
      period: createSuscribe.period,
      functions: createSuscribe.functions,
    };

    const response = await fetch("/api/abonnement/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(abonnementData),
    });

    if (response.ok) {
      await fetchAbonnements(); // Recharger les abonnements après la création
      resetForm(); // Réinitialiser le formulaire
    } else {
      console.error("Erreur lors de la création de l'abonnement");
    }
  };

  // Fonction pour récupérer les abonnements existants
  const fetchAbonnements = async () => {
    const response = await fetch("/api/abonnement/get");
    const abonnements = await response.json();
    setAbonnement(abonnements); // Mettre à jour l'état avec les abonnements récupérés
  };

  useEffect(() => {
    fetchAbonnements(); // Charger les abonnements au démarrage du composant
  }, []);

  // Fonction pour gérer la modification d'un abonnement
  const handleEditAbonnement = async (abonnementToEdit: any) => {
    setCreateSuscribe({
      title: abonnementToEdit.title,
      price: abonnementToEdit.price,
      nbrEssaisGratuit: abonnementToEdit.nbrEssaisGratuit,
      period: abonnementToEdit.period,
      functions: abonnementToEdit.functions || [],
    });
    setEditId(abonnementToEdit.id);
    setIsEditing(true); // Ouvrir le dialog de modification
  };

  // Fonction pour mettre à jour un abonnement existant
  const handleUpdateAbonnement = async () => {
    const abonnementData = {
      title: createSuscribe.title,
      price: createSuscribe.price,
      nbrEssaisGratuit: createSuscribe.nbrEssaisGratuit,
      period: createSuscribe.period,
      functions: createSuscribe.functions,
    };

    const response = await fetch(`/api/abonnement/update/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(abonnementData),
    });

    if (response.ok) {
      await fetchAbonnements(); // Recharger les abonnements après la modification
      resetForm(); // Réinitialiser le formulaire après modification
    } else {
      console.error("Erreur lors de la mise à jour de l'abonnement");
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setCreateSuscribe({
      title: "",
      price: 0,
      nbrEssaisGratuit: 0,
      period: "",
      functions: [],
    });
    setEditId(null);
    setIsEditing(false); // Fermer le dialog de modification
  };

  // Fonction pour supprimer un abonnement
  const handleDeleteAbonnement = async (id: string) => {
    const response = await fetch(`/api/abonnement/delete/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setAbonnement((prevAbonnement) =>
        prevAbonnement.filter((abonnement) => abonnement.id !== id)
      ); // Retirer l'abonnement supprimé
    } else {
      console.error("Erreur lors de la suppression de l'abonnement");
    }
  };

  return (
    <TabsContent value="suscribe" className="space-y-4">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Gestion des Abonnements
          </h2>
          <Dialog onOpenChange={resetForm}>
            <DialogTrigger asChild>
              <Button>Ajouter</Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-scroll">
              <DialogHeader>
                <DialogTitle>Ajouter un abonnement</DialogTitle>
                <DialogDescription>
                  {/* Formulaire pour ajouter un abonnement */}
                  <label className="mt-4">Titre</label>
                  <Input
                    className="mt-4"
                    type="text"
                    placeholder="Ex: Gestion planning MENSUEL"
                    value={createSuscribe.title}
                    onChange={(e) =>
                      handleAbonnementChange("title", e.target.value)
                    }
                  />
                  <br />
                  <label className="mt-4">Prix</label>
                  <Input
                    className="mt-4"
                    type="number"
                    placeholder="Ex: 19 €"
                    value={createSuscribe.price}
                    onChange={(e) =>
                      handleAbonnementChange("price", e.target.value)
                    }
                  />
                  <br />
                  <label className="mt-4">Essai gratuit</label>
                  <Input
                    className="mt-4"
                    type="number"
                    value={createSuscribe.nbrEssaisGratuit}
                    onChange={(e) =>
                      handleAbonnementChange("nbrEssaisGratuit", e.target.value)
                    }
                  />
                  <Select
                    onValueChange={(value) =>
                      handleAbonnementChange("period", value)
                    }
                  >
                    <SelectTrigger className="mt-4">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Période</SelectLabel>
                        <SelectItem value="day">Jours</SelectItem>
                        <SelectItem value="week">Semaines</SelectItem>
                        <SelectItem value="month">Mois</SelectItem>
                        <SelectItem value="year">Années</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <label className="mt-4">Points forts</label>
                  <div className="flex mt-4">
                    <Input
                      className="flex-1"
                      type="text"
                      placeholder="Ajouter un point fort"
                      value={newFunction}
                      onChange={(e) => handleFunctionChange(e.target.value)}
                    />
                    <Button className="ml-2" onClick={addFunction}>
                      Ajouter
                    </Button>
                  </div>
                  <div className="mt-4">
                    {createSuscribe.functions.map((func, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between mb-2"
                      >
                        <span>{func}</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFunction(index)}
                        >
                          <TrashIcon className="mr-2" /> Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleCreateAbonnement} className="mt-4">
                    Ajouter
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Liste des abonnements */}
        {abonnement && abonnement.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {abonnement.map((ab, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{ab.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Prix: {ab.price} €</p>
                  <p>Essai gratuit: {ab.nbrEssaisGratuit} jours</p>
                  <p>Période: {ab.period}</p>
                  <p>Points forts :</p>
                  <ul>
                    {ab.functions.map((func: any, i: number) => (
                      <li key={i}>
                        - {typeof func === "object" ? func.name : func}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="mr-2"
                    onClick={() => handleEditAbonnement(ab)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteAbonnement(ab.id)}
                  >
                    <TrashIcon className="mr-2" /> Supprimer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center">Aucun abonnement présent.</div>
        )}

        {/* Dialog pour modifier un abonnement */}
        <Dialog open={isEditing} onOpenChange={resetForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier un abonnement</DialogTitle>
              <DialogDescription>
                <label className="mt-4">Titre</label>
                <Input
                  className="mt-4"
                  type="text"
                  placeholder="Ex: Gestion planning MENSUEL"
                  value={createSuscribe.title}
                  onChange={(e) =>
                    handleAbonnementChange("title", e.target.value)
                  }
                />
                <br />
                <label className="mt-4">Prix</label>
                <Input
                  className="mt-4"
                  type="number"
                  placeholder="Ex: 19 €"
                  value={createSuscribe.price}
                  onChange={(e) =>
                    handleAbonnementChange("price", e.target.value)
                  }
                />
                <br />
                <label className="mt-4">Essai gratuit</label>
                <Input
                  className="mt-4"
                  type="number"
                  value={createSuscribe.nbrEssaisGratuit}
                  onChange={(e) =>
                    handleAbonnementChange("nbrEssaisGratuit", e.target.value)
                  }
                />
                <Select
                  onValueChange={(value) =>
                    handleAbonnementChange("period", value)
                  }
                >
                  <SelectTrigger className="mt-4">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Période</SelectLabel>
                      <SelectItem value="day">Jours</SelectItem>
                      <SelectItem value="week">Semaines</SelectItem>
                      <SelectItem value="month">Mois</SelectItem>
                      <SelectItem value="year">Années</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <label className="mt-4">Points forts</label>
                <div className="flex mt-4">
                  <Input
                    className="flex-1"
                    type="text"
                    placeholder="Ajouter un point fort"
                    value={newFunction}
                    onChange={(e) => handleFunctionChange(e.target.value)}
                  />
                  <Button className="ml-2" onClick={addFunction}>
                    Ajouter
                  </Button>
                </div>

                <div className="mt-4">
                  {createSuscribe.functions.map((func: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between mb-2"
                    >
                      <span>{typeof func === "object" ? func.name : func}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFunction(index)}
                      >
                        <TrashIcon className="mr-2" /> Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
                <Button onClick={handleUpdateAbonnement} className="mt-4">
                  Modifier
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </TabsContent>
  );
}
