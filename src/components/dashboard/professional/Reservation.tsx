import { useState } from "react";
import { useUserContext } from "@/contexts/user";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { CircleDot } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReservationProps {
  id: string;
  status: string;
  typeClient: string;
  image?: string;
  date: string;
  time: string;
  address?: string;
  note?: string;
  service: string;
  price: number;
  email: string;
  dureeRDV: string;
  phone: string;
  firstName: string;
  lastName: string;
  reason?: string;
  onDelete?: (id: string) => void;
}

export default function Reservation({
  id,
  status,
  typeClient,
  image,
  date,
  time,
  address,
  note,
  service,
  price,
  email,
  dureeRDV,
  phone,
  firstName,
  lastName,
  reason, // Raison d'annulation
  onDelete,
}: ReservationProps) {
  const displayAddress =
    typeof address === "string" && address.trim() !== ""
      ? address
      : "Sur le lieu de travail";
  const { user } = useUserContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/dashboardPro/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la réservation");
      }
      alert("Réservation supprimée avec succès !");
      if (onDelete) {
        onDelete(id);
      }else{
        console.log("onDelete props is missing, it's not passed to Reservation component");
      }
    } catch (error) {
      console.error(error);
      alert(
        "Une erreur est survenue lors de la suppression de la réservation."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelReservation = async () => {
    try {
      const response = await fetch(`/api/dashboardPro/cancel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: cancelReason }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de l'annulation de la réservation");
      }

      const updatedReservation = await response.json();
      alert("Réservation annulée avec succès !");
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'annulation.");
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleOpenReasonDialog = async () => {
    setIsReasonDialogOpen(true);
    try {
      const response = await fetch(`/api/dashboardPro/getReason/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la raison.");
      }
      const data = await response.json();
      setCancelReason(data.reason || "Aucune raison fournie.");
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la récupération de la raison.");
    }
  };

  const handleHideReservation = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/dashboardPro/updateReservationHidden/${id}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la réservation");
      }
      const data = await response.json();
      alert(data.message || "Réservation mise à jour avec succès !");
    } catch (error) {
      console.error(error);
      alert(
        "Une erreur est survenue lors de la mise à jour de la réservation."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="bg-white flex md:justify-between justify-start md:flex-row flex-col gap-2 mb-4">
      <div className="shadow-md rounded-sm md:max-w-[16rem] w-full p-4 text-center border flex flex-col gap-3 justify-center items-center">
        <div
          className={`${
            status === "boutique"
              ? "text-[#4C40ED] bg-[#F7F7FF]"
              : "text-[#FFA500] bg-[#FFF4E5]"
          } py-2 px-3 rounded-md text-[.7rem]`}
        >
          Client {typeClient === "boutique" ? "en boutique" : "flair"}
        </div>
        <Image
          src={image ? image : "/nail-salon.webp"}
          height={120}
          width={120}
          alt="client profile"
          className="rounded-full object-cover h-24 w-24"
        />
        <h3>
          {firstName} {lastName}
        </h3>
        <ul className="my-2">
          <li>
            <span className="text-sm text-gray-500">
              Membre depuis dateCreation
            </span>
          </li>
          <li className="underline text-sm">{email}</li>
          <li className="underline text-sm">{phone}</li>
        </ul>
        <Button>Modifier</Button>
      </div>

      <div className="p-8 shadow-md w-full rounded-sm border">
        <div className="flex flex-col justify-end">
          <div>
            <div
              className={clsx(
                status === "en-cours"
                  ? "text-blue-600 bg-blue-100"
                  : status === "annule"
                    ? "text-red-600 bg-red-100"
                    : "text-green-600 bg-green-100",
                "rounded-sm text-[.7rem] py-2 px-3 text-center inline-block"
              )}
            >
              <CircleDot className="h-4 w-4 inline-block mr-2" />
              {status === "en-cours"
                ? "En cours"
                : status === "annule"
                  ? "Annulée"
                  : "Terminé"}
            </div>
            <ul className="text-sm text-gray-500 my-4">
              <li className="mt-2">
                <strong>Service réservé :</strong> {service}
              </li>
              <li className="mt-2">
                <strong>Date de réservation :</strong> {formattedDate} à partir
                de {formattedTime}
              </li>
              <li className="mt-2">
                <strong>Durée :</strong> {dureeRDV}
              </li>
              <li className="mt-2">
                <strong>Lieu :</strong> {displayAddress}
              </li>
              <li className="mt-2">
                <strong>Tarifs :</strong> {price} €
              </li>
              <li className="mt-2">
                <strong>Note client :</strong> {note}
              </li>
            </ul>
          </div>
          <div className="flex gap-4 items-end flex-wrap">
            {status === "en-cours" && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">Annuler la réservation</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <Label>Raison de l'annulation</Label>
                  </DialogHeader>
                  <Textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Expliquez la raison de l'annulation"
                  />
                  <DialogFooter>
                    <Button onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancelReservation}
                      disabled={!cancelReason}
                    >
                      Confirmer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {status === "annule" && (
              <>
                <Dialog
                  open={isReasonDialogOpen}
                  onOpenChange={setIsReasonDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      onClick={handleOpenReasonDialog}
                    >
                      Raison
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Raison de l'annulation</DialogTitle>
                    </DialogHeader>
                    <p>{cancelReason}</p>
                    <DialogFooter>
                      <Button onClick={() => setIsReasonDialogOpen(false)}>
                        Fermer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={handleHideReservation}
                  disabled={isDeleting}
                >
                  Supprimer
                </Button>
              </>
            )}
            {status === "termine" && (
              <Button
                variant="destructive"
                onClick={handleHideReservation}
                disabled={isDeleting}
              >
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
