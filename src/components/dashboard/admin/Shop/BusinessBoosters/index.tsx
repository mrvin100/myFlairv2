// src/components/dashboard/admin/Shop/BusinessBoosters/index.tsx
"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import ReactQuill from "react-quill";
import { useForm, SubmitHandler } from "react-hook-form";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { fr } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";

import { businessBoosterSchema } from "@/schemas";
import { useToast } from "@/components/ui/use-toast";
import { error, success, toastAction } from "@/components/toast";
import { ImageUploader } from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/calendar";
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
import { TabsContent } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TrashIcon } from "@radix-ui/react-icons";
import { CalendarBusinessBooster } from "@/components/calendarBusinessBooster";
import DisplayBusinessBoosters from "@/components/dashboard/admin/Shop/BusinessBoosters/displayData";
import { BusinessBooster } from "@/components/dashboard/admin/Shop/BusinessBoosters/types";

import "react-quill/dist/quill.snow.css";

type BusinessBoosterFormValues = z.infer<typeof businessBoosterSchema>;

export default function BusinessBoostersTab() {
  const router = useRouter();
  const { toast } = useToast();

  const [businessBoosters, setBusinessBoosters] = useState<BusinessBooster[]>(
    []
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const [dates, setDates] = useState<DateRange[]>([]);

  const form = useForm<BusinessBoosterFormValues>({
    resolver: zodResolver(businessBoosterSchema),
    defaultValues: {
      image: "",
      alt: "",
      title: "",
      description: "",
      quantity: 0,
      price: 0,
      dates,
    },
  });

  const onSubmit: SubmitHandler<BusinessBoosterFormValues> = async (data) => {
    console.log("Submitting data:", data);
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
      setBusinessBoosters((prev) => [...prev, result]); // Mise à jour de l'état local avec le nouveau business booster
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
                    onSubmit={(e) => {
                      console.log("Form submitted");
                      form.handleSubmit(onSubmit)(e);
                    }}
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
                                    className=""
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
                                    {...form.register("price", {
                                      valueAsNumber: true,
                                    })}
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
                            <div
                              className="flex items-center gap-2"
                              key={index}
                            >
                              {date.to ? (
                                <>
                                  {format(date.from!, "dd LLL y", {
                                    locale: fr,
                                  })}{" "}
                                  -{" "}
                                  {format(date.to!, "dd LLL y", { locale: fr })}
                                </>
                              ) : (
                                format(date.from!, "dd LLL y", { locale: fr })
                              )}
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => {
                                  const newDates = dates.filter(
                                    (_, i) => i !== index
                                  );
                                  setDates(newDates);
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
                                const newDates = [...dates, dateRange];
                                setDates(newDates);
                                form.setValue("dates", newDates);
                              }
                            }}
                            type="button"
                          >
                            Ajouter la date
                          </Button>
                          <br />
                          <label htmlFor="">Description</label>
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
                        </div>
                      </DialogDescription>
                      <br />
                    </DialogHeader>

                    <Button type="submit">Ajouter</Button>
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
