import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Rate } from "antd";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

// Définir les types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  image: string | undefined;
  mark: number | null;
  address: {
    street: string;
    city: string;
  };
}

interface Review {
  id: string;
  professional: User;
  author: User;
  service: Service;
  rating: number;
  comment: string;
  status: "await" | "approved";
  createdAt: Date;
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  domicile: boolean;
  dureeRDV: string;
  userId: string;
}

export default function Comments() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
  const [isAlertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/review/getAll");
        if (!res.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Expected an array of reviews, but got:", data);
          setReviews([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des avis", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  const sortedReviews = reviews.sort((a, b) => {
    if (a.status === "await" && b.status === "approved") {
      return -1;
    }
    if (a.status === "approved" && b.status === "await") {
      return 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleDeleteConfirm = async (reviewId: string) => {
    const res = await fetch(`/api/review/delete/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewId }),
    });

    if (res.ok) {
      const deletedReview = await res.json();
      setReviews((prev) => prev.filter((r) => r.id !== deletedReview.id));
    } else {
      console.error("Erreur lors de la suppression de l'avis");
    }
    setAlertOpen(false); // Close the alert dialog
  };

  return (
    <TabsContent value="comment">
      <div className="h-full flex-1 flex-col space-y-8 pl-8 pt-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Gestion des Avis
          </h2>
        </div>
        {sortedReviews.map((review) => (
          <ModelComment
            key={review.id}
            review={review}
            setReviews={setReviews}
            setAlertOpen={setAlertOpen}
            setDeleteReviewId={setDeleteReviewId}
          />
        ))}
      </div>
      {/* Alert Dialog for deletion confirmation */}
      <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cet avis ?
          </AlertDialogDescription>
          <div className="flex justify-end">
            <AlertDialogCancel onClick={() => setAlertOpen(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteReviewId) {
                  handleDeleteConfirm(deleteReviewId);
                }
              }}
            >
              Confirmer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  );
}

function ModelComment({
  review,
  setReviews,
  setAlertOpen,
  setDeleteReviewId,
}: {
  review: Review;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteReviewId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  async function handleApprove(reviewId: string) {
    const res = await fetch(`/api/review/updateStatus/${review.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewId }),
    });

    if (res.ok) {
      const updatedReview = await res.json();
      setReviews((prev) =>
        prev.map((review) => (review.id === reviewId ? updatedReview : review))
      );
    } else {
      console.error("Erreur lors de l'approbation de l'avis");
    }
  }

  async function handleArchive(reviewId: string) {
    const res = await fetch(`/api/review/archive/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewId }),
    });

    if (res.ok) {
      const updatedReview = await res.json();
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? updatedReview : r))
      );
    } else {
      console.error("Erreur lors de l'archivage de l'avis");
    }
  }

  const openDeleteDialog = (reviewId: string) => {
    setDeleteReviewId(reviewId);
    setAlertOpen(true);
  };

  return (
    <Card className="p-5">
      {/* Render the professional and client details */}
      <ModelSkeletonPro review={review} />
      <ModelSkeletonClient review={review} />
      <div className="mt-4">
        <Rate allowHalf disabled value={review.rating} />
      </div>
      <br />
      <div className="flex justify-between items-center">
        <div>
          <Button
            onClick={() => openDeleteDialog(review?.id)}
            variant={"destructive"}
          >
            Supprimer
          </Button>
        </div>
        <div className="flex justify-end">
          {review?.status === "await" ? (
            <>
              <Button
                onClick={() => openDeleteDialog(review?.id)}
                variant={"destructive"}
              >
                Supprimer
              </Button>
              <Link href={`/back-up/Profil/${review?.professional.id}`}>
                <Button variant="secondary">Voir</Button>
              </Link>
              <Button
                className="ml-3"
                onClick={() => handleApprove(review?.id)}
              >
                Approuver
              </Button>
            </>
          ) : (
            <>
              <div>
                <Button
                  variant="secondary"
                  onClick={() => handleArchive(review?.id)}
                >
                  Archiver
                </Button>

                <Link href={`/back-up/Profil/${review?.professional?.id}`}>
                  <Button className="ml-4">Voir</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function ModelSkeletonPro({ review }: { review: Review }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {review?.professional ? (
            <>
              <img
                style={{
                  height: "50px",
                  width: "50px",
                  border: "solid 1px white",
                }}
                className="rounded-full object-cover"
                src={review?.professional?.image || "/nail-salon.webp"}
                alt={"Image Of The Professional"}
              />
              <span style={{ fontSize: "130%" }} className="m-3">
                {review?.professional?.firstName || "Inconnu"}
              </span>
              <span style={{ fontSize: "130%" }}>
                {review?.professional?.lastName || "Inconnu"}
              </span>
            </>
          ) : (
            <span>Informations du professionnel non disponibles</span>
          )}
        </div>
        {review?.status === "await" && (
          <button
            className="flex items-center text-base rounded py-1 px-3"
            style={{ background: "#FEE9E9", color: "#FF0000", height: "30px" }}
          >
            <div
              className="rounded-full h-2 w-2 mr-2"
              style={{ background: "#FF0000" }}
            ></div>
            En cours d'approbation
          </button>
        )}
        {review?.status === "approved" && (
          <button
            className="flex items-center text-base rounded py-1 px-3"
            style={{ background: "#EAF7EC", color: "#2DB742", height: "30px" }}
          >
            <div
              className="rounded-full h-2 w-2 mr-2"
              style={{ background: "#2DB742" }}
            ></div>
            Approuvé
          </button>
        )}
      </div>
      <br />
      <div className="flex items-center">
        <img className="ml-4" src="/iconService/map-pin-3.svg" alt="Pin icon" />
        <span className="ml-2" style={{ color: "#74788D" }}>
          {review?.professional?.address
            ? `${review?.professional?.address?.street} ${review?.professional?.address?.city}`
            : "Adresse non disponible"}
        </span>
      </div>
      <br />
      <hr />
      <br />
    </div>
  );
}

function ModelSkeletonClient({ review }: { review: Review }) {
  return (
    <div className="flex flex-col mt-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {review?.author ? (
            <>
              <img
                style={{
                  height: "30px",
                  width: "30px",
                  border: "solid 1px white",
                }}
                className="rounded-full object-cover"
                src={review?.author?.image || "/nail-salon.webp"}
                alt={`Image Of The Client`}
              />
              <span style={{ fontSize: "90%" }} className="m-1">
                {review?.author?.firstName || "Inconnu"}
              </span>
              <span style={{ fontSize: "90%" }}>
                {review?.author?.lastName || "Inconnu"}
              </span>
            </>
          ) : (
            <span>Informations de l'auteur non disponibles</span>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {review?.createdAt &&
            formatDistanceToNow(new Date(review.createdAt), {
              locale: fr,
            })}{" "}
        </span>
      </div>
      <div className="mt-3">
        <p className="text-gray-700">{review?.comment}</p>
      </div>
    </div>
  );
}
