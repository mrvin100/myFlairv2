"use client";

import React, { useEffect, useRef, useState } from "react";
import * as z from "zod";
import ReactQuill from "react-quill";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { fr } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { businessBoosterSchema } from "@/schemas";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/calendar";
import { addDays, format, eachDayOfInterval } from "date-fns";

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
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { TabsContent } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TrashIcon } from "@radix-ui/react-icons";
import DisplayBusinessBoosters from "@/components/dashboard/admin/Shop/BusinessBoosters/displayData";
import { BusinessBooster } from "@/components/dashboard/admin/Shop/BusinessBoosters/types";

import "react-quill/dist/quill.snow.css";

type BusinessBoosterFormValues = z.infer<typeof businessBoosterSchema>;

export default function BusinessBoostersTab() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null); 
  const [businessBoosters, setBusinessBoosters] = useState<BusinessBooster[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const [image, setImage] = useState<File | null>(null); 
  const [availabilityDates, setAvailabilityDates] = useState<DateRange[]>([]);

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

  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary environment variables are not properly configured.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileInputChange({ target: { files } as any });
    }
  };
  
  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const imageUrl = await uploadImage(files[0]);
        setImage(files[0]);
        form.setValue("image", imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  
  const removeImage = () => {
    setImage(null);
    form.setValue("image", "");
  };

  const generateDatesWithAvailability = (from: Date, to: Date, quantity: number) => {
    const interval = eachDayOfInterval({ start: from, end: to });
    return interval.map((date) => ({
      date: format(date, "yyyy-MM-dd"),
      available: quantity,
    }));
  };

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
      
    } catch (error) {
      console.error("Error submitting data:", error);
     
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
        console.log("Business Boosters fetched:", data);
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
                        <br />
                        <div className="space-y-4">
                          <label>Titre</label>
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Titre"
                                  />
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
                                    {...form.register("quantity", {
                                      valueAsNumber: true,
                                    })}
                                    placeholder="Quantité"
                                    type="number"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <br />
                          <label>Prix</label>
                          <FormField
                            control={form.control}
                            name="price"
                            render={() => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...form.register("price", {
                                      valueAsNumber: true,
                                    })}
                                    placeholder="Prix"
                                    type="number"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <br />
                          <label>Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <div className="grid gap-2">
                                <Calendar
                                  dateRange={dateRange}
                                  setDateRange={setDateRange}
                                />
                              </div>
                            </PopoverTrigger>
                          </Popover>
                          {availabilityDates.length > 0 && <p>Dates ajoutées:</p>}
                          {availabilityDates.map((date, index) => (
                            <div
                              className="flex items-center gap-2"
                              key={index}
                            >
                              {date.to ? (
                                <>
                          
                                  {format(date.from, "dd LLL y", { locale: fr })}{" "}
                                  -{" "}
                                  {format(date.to, "dd LLL y", { locale: fr })}
                                </>
                              ) : (
                                format(date.from, "dd LLL y", { locale: fr })
                              )}
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => {
                                  const newDates = availabilityDates.filter(
                                    (_, i) => i !== index
                                  );
                                  setAvailabilityDates(newDates);
                                  form.setValue("dates", newDates);
                                }}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                              <br />
                            </div>
                          ))}

                          <Button
                            className="flex justify-start"
                            onClick={() => {
                              if (dateRange) {
                                const newDates = [...availabilityDates, dateRange];
                                setAvailabilityDates(newDates);
                                form.setValue("dates", newDates);
                              }
                            }}
                            type="button"
                          >
                            Ajouter la date
                          </Button>
                          <br />
                          <label>Description</label>
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <ReactQuill
                                    {...field}
                                    placeholder="Description"
                                    theme="snow"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
<br />
                          <label>Image</label>
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="cursor-pointer border-2 border-dashed border-gray-300 p-4 text-center"
                          >
                            <p className="text-sm">Cliquez ou glissez et déposez des fichiers ici</p>
                            <p className="text-xs">Formats: JPEG, PNG, JPG et SVG</p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg, image/png, image/jpg, image/svg+xml"
                            style={{ display: 'none' }}
                            onChange={handleFileInputChange}
                          />

                          {image && (
                            <div style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}>
                              <img
                                src={URL.createObjectURL(image)}
                                alt="Uploaded"
                                style={{ width: '100px', height: 'auto', marginBottom: '5px' }}
                                className="rounded-lg"
                              />
                              <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                                <button
                                  className="rounded-full p-1 bg-red-600"
                                  onClick={removeImage}
                                >
                                  <TrashIcon className="h-4 w-4 text-white" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="submit">Ajouter</Button>
                    </DialogFooter>
                  </form>
                </Form>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <DisplayBusinessBoosters
          businessBoosters={businessBoosters}
          setBusinessBoosters={setBusinessBoosters}
        />
      </div>
    </TabsContent>
  );
}