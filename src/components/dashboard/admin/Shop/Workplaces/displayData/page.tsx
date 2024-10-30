import { useEffect, useState, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReactQuill from "react-quill";
import axios from "axios";
import { CircleMinus, Edit, Trash, Trash2 } from "lucide-react";
import { EmptyContent } from "@/components/empty-content";
import { TableLoader } from "@/components/dashboard/table-loader";

interface Workplace {
  id: number;
  image: string;
  title: string;
  description: string;
  durationWeekStartHour: number;
  durationWeekStartMinute: number;
  durationWeekEndHour: number;
  durationWeekEndMinute: number;
  durationSaturdayStartHour: number;
  durationSaturdayStartMinute: number;
  durationSaturdayEndHour: number;
  durationSaturdayEndMinute: number;
  weekPrice: string;
  saturdayPrice: string;
  stock: number;
  valide?: boolean;
  alt?: string;
}

const DisplayWorkPlace = () => {
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace | null>(
    null
  );
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch(`${window.location.origin}/api/post/get`, { method: "GET" })
      .then((response) => response.json())
      .then((data: Workplace[]) => {
        setWorkplaces(data);
        setIsLoading(false)
      })
      .catch((error) => console.error("Error fetching workplace", error));
  }, []);

  const handleDeleteImage = () => {
    setImages([]);
    handlePostChange("image", "");
  };

  const updatePost = async (workPlaceId: number, postData: Workplace) => {
    const response = await fetch(`/api/post/edit/${workPlaceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour du poste");
    }

    const updatedPost = await response.json();
    return updatedPost;
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
        `
        https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/post/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du poste de travail");
      }

      const data = await response.json();
      console.log(data.message);
      setWorkplaces((prevState) => prevState.filter((item) => item.id !== id));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression du poste de travail:",
        error
      );
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
      handlePostChange("image", imageUrl);
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image:", error);
    }
  };

  const handlePostChange = (field: keyof Workplace, value: any) => {
    if (selectedWorkplace) {
      setSelectedWorkplace({ ...selectedWorkplace, [field]: value });
    }
  };

  const handleSaveChanges = async () => {
    if (selectedWorkplace) {
      try {
        await updatePost(selectedWorkplace.id, selectedWorkplace);
        setShowEditDialog(false);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du poste:", error);
      }
    }
  };

  const handleEditClick = (workplace: Workplace) => {
    setSelectedWorkplace(workplace);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (workplace: Workplace) => {
    setSelectedWorkplace(workplace);
    setShowDeleteDialog(true);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>n°</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Tarif</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading ? (
          <TableLoader cols={5} />
        ) : (
          <TableBody>
            {workplaces && workplaces.length > 0 ? (
              workplaces.map((workplace, index) => (
                <TableRow key={workplace.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{workplace.title}</TableCell>
                  <TableCell>
                    <img
                      src={workplace.image}
                      alt={workplace.alt || workplace.title}
                      style={{ width: "100px" }}
                    />
                  </TableCell>
                  <TableCell>{workplace.weekPrice} €</TableCell>
                  <TableCell>{workplace.stock}</TableCell>
                  <TableCell>
                    <div className="flex">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Edit onClick={() => handleEditClick(workplace)} />
                        </AlertDialogTrigger>
                        {showEditDialog && selectedWorkplace && (
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Modifier le poste de travail
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <div>
                              <label>Titre du poste</label>
                              <br />
                              <br />
                              <Input
                                type="text"
                                value={selectedWorkplace.title}
                                onChange={(e) =>
                                  handlePostChange("title", e.target.value)
                                }
                                required
                              />
                              <br />
                              <label>Prix durant la semaine</label>
                              <br />
                              <br />
                              <Input
                                type="number"
                                value={selectedWorkplace.weekPrice}
                                onChange={(e) =>
                                  handlePostChange("weekPrice", e.target.value)
                                }
                                required
                              />
                              <br />
                              <label>Prix le samedi</label>
                              <br />
                              <br />
                              <Input
                                type="number"
                                value={selectedWorkplace.saturdayPrice}
                                onChange={(e) =>
                                  handlePostChange(
                                    "saturdayPrice",
                                    e.target.value
                                  )
                                }
                                required
                              />
                              <br />
                              <div>
                                <label>Heures d'ouverture en semaine</label>
                                <br />
                                <div className="flex space-x-2 items-center">
                                  <Input
                                    className="text-lg rounded outline-none"
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={
                                      selectedWorkplace.durationWeekStartHour
                                    }
                                    onChange={(e) =>
                                      handlePostChange(
                                        "durationWeekStartHour",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    placeholder="HH"
                                    required
                                  />
                                  <span>h</span>
                                  <Input
                                    className="text-lg rounded outline-none"
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={
                                      selectedWorkplace.durationWeekStartMinute
                                    }
                                    onChange={(e) =>
                                      handlePostChange(
                                        "durationWeekStartMinute",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    placeholder="MM"
                                    required
                                  />
                                  <span>à</span>
                                  <Input
                                    className="text-lg rounded outline-none"
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={selectedWorkplace.durationWeekEndHour}
                                    onChange={(e) =>
                                      handlePostChange(
                                        "durationWeekEndHour",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    placeholder="HH"
                                    required
                                  />
                                  <span>h</span>
                                  <Input
                                    className="text-lg rounded outline-none"
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={
                                      selectedWorkplace.durationWeekEndMinute
                                    }
                                    onChange={(e) =>
                                      handlePostChange(
                                        "durationWeekEndMinute",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    placeholder="MM"
                                    required
                                  />
                                </div>
                              </div>
  
                              <br />
  
                              <div>
                                <label>Heures d'ouverture le samedi</label>
                                <br />
                                <div className="flex space-x-2 items-center">
                                  {/* Gestion des heures d'ouverture le samedi */}
                                  <Input
                                    className="text-lg rounded outline-none"
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={
                                      selectedWorkplace.durationSaturdayStartHour
                                    }
                                    onChange={(e) =>
                                      handlePostChange(
                                        "durationSaturdayStartHour",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    placeholder="HH"
                                    required
                                  />
                                  <span>h</span>
                                  <Input
                                    className="text-lg rounded outline-none"
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={
                                      selectedWorkplace.durationSaturdayStartMinute
                                    }
                                    onChange={(e) =>
                                      handlePostChange(
                                        "durationSaturdayStartMinute",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    placeholder="MM"
                                    required
                                  />
                                  <span>à</span>
                                  <Input
                                    className="text-lg rounded outline-none"
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={
                                      selectedWorkplace.durationSaturdayEndHour
                                    }
                                    onChange={(e) =>
                                      handlePostChange(
                                        "durationSaturdayEndHour",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    placeholder="HH"
                                    required
                                  />
                                  <span>h</span>
                                  <Input
                                    className="text-lg rounded outline-none"
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={
                                      selectedWorkplace.durationSaturdayEndMinute
                                    }
                                    onChange={(e) =>
                                      handlePostChange(
                                        "durationSaturdayEndMinute",
                                        parseInt(e.target.value)
                                      )
                                    }
                                    placeholder="MM"
                                    required
                                  />
                                </div>
                              </div>
  
                              <br />
                              {/* Gestion de la description */}
                              <label>Description</label>
                              <br></br>
                              <ReactQuill
                                value={selectedWorkplace.description}
                                onChange={(value) =>
                                  handlePostChange("description", value)
                                }
                              />
                              <br />
                              {/* Gestion des images */}
  
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
                              {selectedWorkplace?.image && (
                                <div
                                  style={{
                                    position: "relative",
                                    marginBottom: "20px",
                                    display: "inline-block",
                                  }}
                                >
                                  <img
                                    src={selectedWorkplace.image}
                                    alt={
                                      selectedWorkplace.alt ||
                                      selectedWorkplace.title
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
                                      onClick={() => handleDeleteImage()} // Utilisation de votre fonction pour supprimer l'image
                                    >
                                      <Trash2 style={{ color: "#fff" }} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setShowEditDialog(false)}
                              >
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={handleSaveChanges}>
                                Valider
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        )}
                      </AlertDialog>
  
                      <div style={{ marginLeft: "20px" }}>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Trash2
                              onClick={() => handleDeleteClick(workplace)}
                            />
                          </AlertDialogTrigger>
                          {showDeleteDialog &&
                            selectedWorkplace?.id === workplace.id && (
                              <AlertDialogContent key={workplace.id}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Voulez-vous vraiment supprimer ce Poste ?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irréversible, voulez-vous
                                    vraiment le supprimer ?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    onClick={() => setShowDeleteDialog(false)}
                                  >
                                    Annuler
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      handleDelete(workplace.id);
                                      setShowDeleteDialog(false);
                                    }}
                                  >
                                    Valider
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            )}
                        </AlertDialog>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="p-5 text-center">
                  <EmptyContent text={"Aucun poste présent"} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default DisplayWorkPlace;
