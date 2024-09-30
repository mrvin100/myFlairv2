"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useUserContext } from "@/contexts/user";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AdditionalService {
  id: string;
  image: string;
  alt: string;
  title: string;
  description: string;
  price: number;
  type: string;
  sales: number | null;
  quantity: number;
  idStripe: string;
  [key: string]: string | boolean | number | undefined | null | Date;
}

export default function AdditionalServices() {
  const [additionalServices, setAdditionalServices] = useState<
    AdditionalService[]
  >([]);
  const [quantity, setQuantity] = useState<{ [id: string]: number }>({});
  const [buttonInvalid, setButtonInvalid] = useState<{ [id: string]: boolean }>(
    {}
  );
  const { user } = useUserContext();

  const serviceTypeTranslation = {
    day: "Jour",
    piece: "Pièce",
    page: "Page"
  }
  useEffect(() => {
    fetch("/api/serviceAdditionnel/get", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: AdditionalService[]) => {
        console.log("Services fetched:", data);
        setAdditionalServices(data);
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  const handleServiceChange = (id: string, value: number) => {
    setQuantity((prevQuantities) => ({
      ...prevQuantities,
      [id]: value,
    }));
  };

  const handleAddToCart = async (serviceId: string) => {
    try {
      const service = additionalServices.find(
        (service) => service.id === serviceId
      );
      if (!service) {
        throw new Error(`Service with id ${serviceId} not found.`);
      }

      const response = await fetch("/api/cart/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          productId: serviceId,
          quantity: quantity[serviceId] || 1,
          title: service.title,
          price: service.price,
          idStripe: service.idStripe,
          orderId: null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Le produit a été ajouté au panier.");
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      toast.error("Erreur lors de l'ajout au panier.");
    }
  };

  useEffect(() => {
    const updatedButtonInvalid: { [id: string]: boolean } = {};
    additionalServices.forEach((service) => {
      updatedButtonInvalid[service.id] =
        quantity[service.id] > service.quantity ||
        quantity[service.id] < 0 ||
        quantity[service.id] === 0;
    });
    setButtonInvalid(updatedButtonInvalid);
  }, [quantity, additionalServices]);

  return (
    <div>
      {additionalServices && additionalServices.length > 0 ? (
        <div className="max-w-7xl mx-auto grid xl:grid-cols-3 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 p-10">
          {additionalServices?.map((additionalService) => (
            <Dialog key={additionalService.id}>
              <Card className="flex flex-col rounded-lg m-2 w-full">
                <CardHeader className="h-52 bg-none rounded-lg p-0 mb-4">
                  <Image
                    className="w-full rounded-md h-full object-cover"
                    src={additionalService.image}
                    alt={additionalService.alt}
                    width={1000}
                    height={1000}

                  />
                </CardHeader>

                <CardContent>
                  <CardTitle>{additionalService.title}</CardTitle>
                  <CardDescription className="flex justify-between items-center flex-wrap gap-3">
                    À partir de{" "}
                    {Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(additionalService.price)}
                    /{additionalService.type}
                    <div className="flex items-center gap-x-2 pt-2">
                      Quantité:
                      <Input
                        className="w-[100px]"
                        max={additionalService.quantity}
                        onChange={(e) =>
                          handleServiceChange(
                            additionalService.id,
                            Number(e.target.value)
                          )
                        }
                        defaultValue={1}
                        type="number"
                      />
                      {quantity[additionalService.id] ===
                        additionalService.quantity && (
                        <span style={{ color: "orange" }}>
                          Limite disponible atteinte
                        </span>
                      )}
                      {quantity[additionalService.id] >
                        additionalService.quantity && (
                        <span style={{ color: "#d50000" }}>
                          Demande supérieure aux stocks
                        </span>
                      )}
                    </div>
                  </CardDescription>
                </CardContent>

                <CardFooter className="flex justify-between pt-0 gap-3">
                  <DialogTrigger className="w-full  md:w-auto">
                    <Button variant="outline" className="w-full">
                      Détails
                    </Button>
                  </DialogTrigger>
                  <Button
                    onClick={() => handleAddToCart(additionalService.id)}
                    disabled={buttonInvalid[additionalService.id]}
                    className="w-full  md:w-auto"
                  >
                    Ajouter au Panier
                  </Button>
                </CardFooter>
              </Card>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{additionalService.title}</DialogTitle>
                </DialogHeader>
                <div
                  dangerouslySetInnerHTML={{
                    __html: additionalService.description,
                  }}
                ></div>
              </DialogContent>
            </Dialog>
          ))}
          <ToastContainer />
        </div>
      ) : (
        <div className="text-center">Aucun services additionels présent.</div>
      )}
    </div>
  );
}
