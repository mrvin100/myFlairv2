"use client";
import React, { useEffect, useRef, useState } from "react";
import * as z from "zod";
import ReactQuill from "react-quill";
import { useForm, SubmitHandler } from "react-hook-form";
import { addDays, format, eachDayOfInterval } from "date-fns";
import { useRouter } from "next/navigation";
import { fr } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { businessBoosterSchema } from "@/schemas";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CalendarBusinessBooster } from "@/components/calendarBusinessBooster";
import DisplayBusinessBoosters from "@/components/dashboard/admin/Shop/BusinessBoosters/displayData";
import { BusinessBooster } from "@/components/dashboard/admin/Shop/BusinessBoosters/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormItem, FormControl, FormField } from "@/components/ui/form";
import { Popover } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrashIcon } from "@radix-ui/react-icons";
import "react-quill/dist/quill.snow.css";
import { TabsContent } from "@/components/ui/tabs";

type BusinessBoosterFormValues = z.infer<typeof businessBoosterSchema>;

export default function BusinessBoostersTab() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [businessBoosters, setBusinessBoosters] = useState<BusinessBooster[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const [dates, setDates] = useState<any[]>([]);

  const form = useForm<BusinessBoosterFormValues>({
    resolver: zodResolver(businessBoosterSchema),
    defaultValues: {
      image: "",
      alt: "",
      title: "",
      description: "",
      quantity: 0,
      price: 0,
      dates: [],
    },
  });

  const handleDelete = () => {
    setImages([]);
    form.setValue("image", "");
  };

  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Les variables d'environnement Cloudinary ne sont pas correctement configurées.");
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
      console.error("Erreur lors du téléchargement de l'image :", error);
      throw error;
    }
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const imageUrl = await uploadImage(files[0]);
        setImages([files[0]]);
        form.setValue("image", imageUrl);
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image :", error);
      }
    }
  };

  function generateDatesWithAvailability(from: Date, to: Date, quantity: number) {
    const days = eachDayOfInterval({ start: from, end: to });
    return days.map((day) => ({
      date: format(day, "yyyy-MM-dd"),
      available: quantity,
    }));
  }

  const onSubmit: SubmitHandler<BusinessBoosterFormValues> = async (data) => {
    if (dateRange) {
      const generatedDates = generateDatesWithAvailability(
        dateRange.from!,
        dateRange.to!,
        data.quantity
      );
      data.dates = generatedDates;
    }

    try {
      const response = await fetch("/api/businessBoosters/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from API:", errorText);
        throw new Error("Erreur lors de la création du business booster");
      }

      const result: BusinessBooster = await response.json();
      setBusinessBoosters((prev) => [...prev, result]);
      toast({
        title: "Succès",
        description: "Business booster créé avec succès",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      toast({
        title: "Erreur",
        description: (error as Error).message,
      });
    }
  };

  useEffect(() => {
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
      })
      .catch((error) =>
        console.error("Error fetching business boosters", error)
      );
  }, []);

  return (
    <TabsContent value="business-boosters" className="space-y-4">
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Business boosters
          </h2>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Ajouter</Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-scroll">
              <ScrollArea>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    style={{ marginLeft: "1%", marginRight: "1%" }}
                  >
                    <DialogHeader>
                      <DialogTitle>Business booster</DialogTitle>
                      <DialogDescription>
                        Ajoutez un business booster.
                        <br />
                        <div className="space-y-4">
                          <label>Titre</label>
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} className="" placeholder="Titre" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <br />
                          <label>Stock</label>
                          <FormField
                            control={form.control}
                            name="quantity"
                            render={() => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...form.register("quantity", { valueAsNumber: true })}
                                    className=""
                                    placeholder="Quantité"
                                    type="number"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <br />
                          <label htmlFor="">Prix</label>
                          <FormField
                            control={form.control}
                            name="price"
                            render={() => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...form.register("price", { valueAsNumber: true })}
                                    className=""
                                    placeholder="Prix"
                                    type="number"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <br />
                          <label htmlFor="">Date</label>
                          <Popover>
                            <div className="grid gap-2">
                              <CalendarBusinessBooster
                                dateRange={dateRange}
                                setDateRange={setDateRange}
                              />
                            </div>
                          </Popover>
                          {dates.length > 0 && <p>Dates ajoutées:</p>}
                          {dates.map((date, index) => (
                            <div className="flex items-center gap-2" key={index}>
                              {date.to ? (
                                <>
                                  {format(date.from!, "dd LLL y", { locale: fr })} -{" "}
                                  {format(date.to!, "dd LLL y", { locale: fr })}
                                </>
                              ) : (
                                format(date.from!, "dd LLL y", { locale: fr })
                              )}
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => {
                                  const newDates = dates.filter((_, i) => i !== index);
                                  setDates(newDates);
                                  form.setValue("dates", newDates);
                                }}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                              <br />
                            </div>
                          ))}
                    <label htmlFor="image">Image de la formation</label>
                        <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-dashed border-2 p-6 flex justify-center cursor-pointer"
                        >
                        <span className="text-sm">Cliquez pour ajouter une image</span>
                        </div>

                        {/* Display the uploaded image below the drag-and-drop box */}
                        {images.length > 0 && (
                        <div className="relative w-40 h-40 mt-4"> {/* Set relative container for positioning */}
                            <img
                            src={URL.createObjectURL(images[0])}
                            alt="Uploaded"
                            className="w-full h-full object-cover rounded-lg" // Ensure the image is fully covered and rounded
                            />
                            {/* Trash button positioned inside the image */}
                            <Button
                            variant="destructive"
                            size="icon"
                            onClick={handleDelete}
                            className="absolute top-0 right-0 m-1 bg-red-600 rounded-full p-1" // Positioned inside the image
                            >
                            <TrashIcon className="w-4 h-4 text-white" />
                            </Button>
                        </div>
                        )}

                        {/* Hidden file input */}
                        <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        className="hidden"
                        />

                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <DisplayBusinessBoosters businessBoosters={businessBoosters} />
      </div>
    </TabsContent>
  );
}
