import { useEffect, useState } from "react";
import * as React from "react";
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
import { Edit, PlusCircle, Search, Trash, TrashIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TableLoader } from "@/components/dashboard/table-loader";
import { EmptyContent } from "@/components/empty-content";

interface CreateSuscribe {
  title: string;
  price: number;
  nbrEssaisGratuit: number;
  period: string;
  functions: string[];
}
interface Client {
  // Define your Client interface according to your data structure
  id: string;
  name: string; // or other relevant fields
}

interface Subscription {
  id: string;
  status: string;
  date_debut: string;
  date_expiration: string;
  prochain_prelement: string;
  client: Client; // Adjust this according to your Client type
  type: string; // Or an enum if you have predefined types
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
  const [isPending, setIspending] = useState(false);

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
    setIspending(true);
    const response = await fetch("/api/abonnement/get");
    const abonnements = await response.json();
    if (abonnement) {
      setAbonnement(abonnements); // Mettre à jour l'état avec les abonnements récupérés
      setIspending(false);
    }
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
                  <br />
                  <label>Période</label>
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
                  <br />

                  <label className="mt-4">Points forts</label>

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
                          <TrashIcon className="mr-2" />
                        </Button>
                      </div>
                    ))}
                  </div>
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
                  <Button onClick={handleCreateAbonnement} className="mt-4">
                    Ajouter
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Liste des abonnements */}
        {isPending ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-60 w-full rounded-sm" />
            <Skeleton className="h-60 w-full rounded-sm" />
            <Skeleton className="h-60 w-full rounded-sm" />
          </div>
        ) : abonnement && abonnement.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {abonnement.map((ab, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    {ab.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center ">
                  <b className="text-5xl">{ab.price}€</b>
                  <br />
                  <span>
                    {ab.nbrEssaisGratuit}{" "}
                    {ab.period === "day"
                      ? ab.nbrEssaisGratuit === 1
                        ? "Jour "
                        : "Jours "
                      : ab.period === "week"
                        ? ab.nbrEssaisGratuit === 1
                          ? "Semaine "
                          : "Semaines "
                        : ab.period === "month"
                          ? "Mois "
                          : ab.period === "year"
                            ? ab.nbrEssaisGratuit === 1
                              ? "Année "
                              : "Années "
                            : null}
                    de forfait offert
                  </span>
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
          <EmptyContent text={'Aucun abonnement présent.'} />
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
      <ListeAbonnements />
    </TabsContent>
  );
}

function ListeAbonnements() {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fonction pour supprimer un abonnement
  const handleDeleteSubscription = (id: string) => {
    const filteredDatas = subscriptions.filter(
      (subscription) => subscription.id !== id
    );
    setSubscriptions(filteredDatas);
  };

  // Récupération des abonnements
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/subscriptions");
        if (!response.ok) throw new Error("Erreur de réseau");
        const data = await response.json();
        setSubscriptions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Gestion de l'affichage lors du chargement ou d'une erreur
  // if (loading) return <div>Chargement des abonnements...</div>;
  // if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h3 className="text-lg font-semibold my-8 text-center">
        Abonnements Clients
      </h3>
      <div className="my-6 flex justify-between items-center gap-3">
        <Select onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous</SelectItem>
            <SelectItem value="annule">Annulé</SelectItem>
            <SelectItem value="expire">Expiré</SelectItem>
            <SelectItem value="en-cours">En cours</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Input
            type="search"
            placeholder="Rechercher..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        <Button className="ml-auto">
          <PlusCircle className="h-4 w-4" />
          &nbsp;Ajouter un abonnement
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-semibold">#</TableHead>
            <TableHead className="font-semibold">Client</TableHead>
            <TableHead className="font-semibold">
              Type d&apos;abonnement
            </TableHead>
            <TableHead className="font-semibold">Date de début</TableHead>
            <TableHead className="font-semibold">
              Date d&apos;expiration
            </TableHead>
            <TableHead className="font-semibold">
              Prochain prélèvement
            </TableHead>
            <TableHead className="font-semibold">Statut</TableHead>
            <TableHead className="font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        {loading ? (
          <TableLoader rows={4} cols={7} />
        ) : (
          <TableBody>
            {subscriptions && subscriptions.length > 0 ? (
              (selectedStatus === "tous" || selectedStatus === ""
                ? subscriptions
                : subscriptions.filter(
                    (subscription) => subscription.status === selectedStatus
                  )
              ).map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-semibold">
                    {subscription.id}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {subscription.client.name}
                  </TableCell>
                  <TableCell>{subscription.type}</TableCell>
                  <TableCell>{subscription.date_debut}</TableCell>
                  <TableCell>{subscription.date_expiration}</TableCell>
                  <TableCell className="text-center">
                    {subscription.prochain_prelement}
                  </TableCell>
                  <TableCell>
                    {subscription.status === "annule"
                      ? "Annulé"
                      : subscription.status === "expire"
                        ? "Expiré"
                        : "En cours"}
                  </TableCell>
                  <TableCell>
                    <Button variant={"ghost"} size={"icon"}>
                      <Edit />
                    </Button>
                    &nbsp;
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => handleDeleteSubscription(subscription.id)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="text-center border" colSpan={8}>
                  <EmptyContent text={"Aucun abonnement client présent."} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </div>
  );
}
