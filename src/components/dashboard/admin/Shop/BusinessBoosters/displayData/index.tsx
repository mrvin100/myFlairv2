"use client";
import { useEffect, useState, useRef } from "react";
import { format, parseISO } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { fr } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ReactQuill from "react-quill";
import { EmptyContent } from "@/components/empty-content";
import { TableLoader } from "@/components/dashboard/table-loader";

interface BusinessBooster {
  id: string;
  image: string;
  alt?: string;
  title: string;
  description: string;
  quantity: number;
  price: number;
  dates: { date: string; available: number }[];
  createdAt: string;
  updatedAt: string;
  idStripe?: string;
}

interface DisplayBusinessBoostersProps {
  businessBoosters: BusinessBooster[];
  setBusinessBoosters: React.Dispatch<React.SetStateAction<BusinessBooster[]>>;
}

const DisplayBusinessBoosters: React.FC<DisplayBusinessBoostersProps> = ({
  businessBoosters,
  setBusinessBoosters,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBoosterId, setSelectedBoosterId] = useState<string | null>(
    null
  );
  const [selectedBooster, setSelectedBooster] =
    useState<BusinessBooster | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteBusinessBoosterById(id);
      setBusinessBoosters((prevBusinessBoosters) =>
        prevBusinessBoosters.filter((booster) => booster.id !== id)
      );
      setShowDialog(false);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du Business Booster:",
        error
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/businessBoosters/get", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: BusinessBooster[]) => {
        setBusinessBoosters(data);
        setIsLoading(false);
      })
      .catch((error) =>
        console.error("Error fetching business boosters", error)
      );
  }, [setBusinessBoosters]);

  async function deleteBusinessBoosterById(id: string) {
    const response = await fetch(`/api/businessBoosters/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    return response.json();
  }

  const formatDates = (dates: { date: string; available: number }[]) => {
    if (!Array.isArray(dates) || dates.length === 0)
      return "Aucune date disponible";

    const sortedDates = dates
      .map(({ date }) => ({
        date: parseISO(date),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const startDate = format(sortedDates[0].date, "dd MMMM yyyy", {
      locale: fr,
    });
    const endDate = format(
      sortedDates[sortedDates.length - 1].date,
      "dd MMMM yyyy",
      { locale: fr }
    );

    return `Du ${startDate} au ${endDate}`;
  };

  const handleEditClick = (businessBooster: BusinessBooster) => {
    setSelectedBooster(businessBooster);
    setShowDialog(true);
  };

  const handleCancelEdit = () => {
    setSelectedBooster(null);
    setShowDialog(false);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Les variables d'environnement Cloudinary ne sont pas correctement configurées."
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
      console.error("Erreur lors du téléchargement de l'image:", error);
      throw error;
    }
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImages([files[0]]);
      try {
        const imageUrl = await uploadImage(files[0]);
        handlePostChange("image", imageUrl);
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image:", error);
      }
    }
  };

  const handlePostChange = (field: keyof BusinessBooster, value: any) => {
    if (selectedBooster) {
      setSelectedBooster({ ...selectedBooster, [field]: value });
    }
  };

  const handleSaveChanges = async () => {
    if (selectedBooster) {
      try {
        const response = await fetch(
          `/api/businessBoosters/edit/${selectedBooster.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedBooster),
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour du Business Booster");
        }

        const updatedBooster = await response.json();
        setBusinessBoosters((prev) =>
          prev.map((booster) =>
            booster.id === updatedBooster.id ? updatedBooster : booster
          )
        );
        setSelectedBooster(null); // Réinitialiser le booster sélectionné
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du Business Booster:",
          error
        );
      }
    }
  };

  const handleDeleteImage = () => {
    if (selectedBooster) {
      handlePostChange("image", "");
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>n°</TableHead>
            <TableHead>Business Booster</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Tarif</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableLoader cols={6} />
        ) : (
          <TableBody>
            {businessBoosters && businessBoosters.length > 0 ? (
              businessBoosters.map((booster, index) => (
                <TableRow key={booster.id}>
                  <TableCell>n° {index + 1}</TableCell>
                  <TableCell>{booster.title}</TableCell>

                  <TableCell>
                    <img
                      src={booster.image || "/default-image.jpg"}
                      alt={booster.alt || booster.title}
                      style={{
                        width: "100px",
                        height: "auto",
                        marginBottom: "5px",
                      }}
                      className="rounded-lg"
                    />
                  </TableCell>
                  <TableCell>{formatDates(booster.dates)}</TableCell>
                  <TableCell>{booster.price} €</TableCell>
                  <TableCell>{booster.quantity}</TableCell>
                  <TableCell>
                    <div className="flex">
                      <Dialog open={showDialog} onOpenChange={setShowDialog}>
                        <DialogTrigger asChild>
                          <Edit
                            className=" cursor-pointer"
                            onClick={() => handleEditClick(booster)}
                          />
                        </DialogTrigger>
                        <DialogContent className="">
                          <DialogTitle>
                            Modifier le Business Booster
                          </DialogTitle>
                          <DialogDescription>
                            <label htmlFor="">Titre</label>
                            <br />
                            <br />
                            <Input
                              type="text"
                              value={selectedBooster?.title || ""}
                              onChange={(e) =>
                                handlePostChange("title", e.target.value)
                              }
                              placeholder="Titre"
                            />
                            <br />
                            <label htmlFor="">Prix</label>
                            <br />
                            <br />
                            <Input
                              type="number"
                              value={selectedBooster?.price || 0}
                              onChange={(e) =>
                                handlePostChange(
                                  "price",
                                  Number(e.target.value)
                                )
                              }
                              placeholder="Prix"
                              className="input"
                            />
                            <br />
                            <label htmlFor="">Quantité</label>
                            <br />
                            <br />
                            <Input
                              type="number"
                              value={selectedBooster?.quantity || 0}
                              onChange={(e) =>
                                handlePostChange(
                                  "quantity",
                                  Number(e.target.value)
                                )
                              }
                              placeholder="Quantité"
                              className="input"
                            />
                            <br />
                            <label htmlFor="">Description</label>
                            <br />
                            <br />
                            <ReactQuill
                              value={selectedBooster?.description || ""}
                              onChange={(value) =>
                                handlePostChange("description", value)
                              }
                            />
                            <br />
                            <label>Image</label>
                            <br />
                            <br />
                            <div
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
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <p className="flex items-center justify-center">
                                Cliquez ou glissez et déposez des fichiers ici
                              </p>
                              <p className="text-sm">
                                Formats pris en charge: JPEG, PNG, JPG, SVG,
                                WebP
                              </p>
                            </div>

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg, image/png, image/jpg, image/svg, image/webp"
                              style={{ display: "none" }}
                              onChange={handleFileInputChange}
                            />

                            {selectedBooster?.image && (
                              <div
                                style={{
                                  position: "relative",
                                  marginBottom: "20px",
                                  display: "inline-block",
                                }}
                              >
                                <img
                                  src={selectedBooster.image}
                                  alt={
                                    selectedBooster.alt || selectedBooster.title
                                  }
                                  style={{
                                    width: "100px",
                                    height: "auto",
                                    borderRadius: "5px",
                                  }}
                                />
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                  }}
                                >
                                  <button
                                    className="rounded-full"
                                    style={{
                                      padding: "5px",
                                      background: "red",
                                    }}
                                    onClick={() => handleDeleteImage()}
                                  >
                                    <Trash2 style={{ color: "#fff" }} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </DialogDescription>
                          <DialogFooter>
                            <Button
                              variant={"outline"}
                              onClick={handleCancelEdit}
                            >
                              Annuler
                            </Button>
                            <Button onClick={handleSaveChanges}>Valider</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Trash2 className=" cursor-pointer ml-2" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Supprimer ce Business Booster ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer ce Business
                              Booster ?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(booster.id)}
                            >
                              Confirmer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center p-5">
                  <EmptyContent text={"Aucun business boosters présent"} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default DisplayBusinessBoosters;
