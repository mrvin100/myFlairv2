"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/contexts/user";

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  type: string; 
  date?: string; 
}

interface OrderDetails {
  cartItems: CartItem[];
  createdAt: string;
  sessionId: string;
}

const SuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();

  useEffect(() => {
    const url = window.location.pathname;
    const segments = url.split("/");
    const session_id = segments[segments.length - 1];

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/stripe/get/${session_id}`);
        console.log("Order details fetched successfully:", response.data);
        setOrderDetails(response.data);

        // Envoyer une requête pour mettre à jour les quantités après avoir récupéré les détails
        await updateProductQuantities(response.data.cartItems);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la commande", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  // Fonction pour mettre à jour les quantités des produits
  const updateProductQuantities = async (cartItems: CartItem[]) => {
    try {
      await axios.post("/api/commandes/decrementQuantity", { cartItems });
      console.log("Quantités mises à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des quantités", error);
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!orderDetails) {
    return <p>Aucune commande trouvée.</p>;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="mr-[20%] ml-[20%]">
      <div className="mt-10">
        <div className="flex justify-center">
          <img src={"/logos/myflair-black.png"} alt="Logo" />
        </div>
        <br />
        <div className="mt-10">
          <b className="text-[220%]">Validation de commande</b>
        </div>
        <br />
        <span>Merci pour votre commande</span>

        <div className="container mx-auto p-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
              <div>
                <p className="font-semibold">NUMÉRO de commande :</p>
                <p>{orderDetails.sessionId}</p>
              </div>
              <div>
                <p className="font-semibold">DATE :</p>
                <p>{formatDate(orderDetails.createdAt)}</p>
              </div>
              <div>
                <p className="font-semibold">Email :</p>
                <p>{user?.email}</p>
              </div>
              <div>
                <p className="font-semibold">TOTAL :</p>
                <p>
                  {orderDetails.cartItems.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  )}{" "}
                  €
                </p>
              </div>
              <div>
                <p className="font-semibold">Mode de paiement :</p>
                <p>carte bleue</p> {/* Replace with dynamic value */}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold bg-gray-100 p-2">Détails de la commande</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Produit</TableHead>
                    <TableHead className="font-semibold">Qtés</TableHead>
                    <TableHead className="font-semibold">Dates</TableHead> {/* Add Dates header */}
                    <TableHead className="font-semibold">TOTAL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails.cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold">{item.title}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {item.type === "formation" && item.date 
                          ? formatDate(item.date) 
                          : "-"}
                      </TableCell>
                      <TableCell>{item.price} €</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-lg font-semibold bg-gray-100 p-2">Adresse de facturation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <p><span className="font-semibold">Nom de la société : {user?.enterprise}</span></p>
                  <p><span className="font-semibold">Prénom et nom : {user?.firstName} {user?.lastName}</span></p>
                  <p><span className="font-semibold">Addresse : {user?.address.street} à {user?.address.city}</span></p>
                  <p><span className="font-semibold">Code postal : {user?.address.postalCode}</span></p>
                  <p><span className="font-semibold">Téléphone : {user?.phone}</span></p>
                  <p><span className="font-semibold">Email : {user?.email}</span></p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex space-x-4 justify-end">
              <Button>Continuer</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
