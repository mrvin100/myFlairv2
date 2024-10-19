"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useUserContext } from "@/contexts/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Bell, CircleMinus, Plus, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, CustomToast } from "@/components/ui/custom-toast"

const daysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const initialAvailabilities = {
  "Tous les jours": [
  ],
  Lundi: [],
  Mardi: [],
  Mercredi: [],
  Jeudi: [],
  Vendredi: [],
  Samedi: [],
  Dimanche: [],
};

const initialAvailabilitiesPeriods = [
  {
    from: "",
    to: "",
    timeFrom: "",
    timeTo: "",
  },
];

const formatTime = (input: string) => {
  const cleanedInput = input.replace(/\D/g, "");
  if (cleanedInput.length <= 2) {
    return cleanedInput;
  } else {
    const hours = cleanedInput.slice(0, 2);
    const minutes = cleanedInput.slice(2, 4);
    return `${hours}:${minutes}`;
  }
};

export default function AvailabilitiesTab() {
  const [selectedDay, setSelectedDay] = useState("Tous les jours");
  const [availabilities, setAvailabilities] = useState(initialAvailabilities);
  const [availabilitiesPeriods, setAvailabilitiesPeriods] = useState(initialAvailabilitiesPeriods);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        const response = await axios.get(`/api/availability/get/${user?.id}`);
        const { availabilities, availabilitiesPeriods } = response.data || {};
        if (availabilities) {
          setAvailabilities(availabilities);
        }
        if (availabilitiesPeriods) {
          setAvailabilitiesPeriods(availabilitiesPeriods);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des disponibilités", error);
        toast.custom((t) => (
          <CustomToast
            description="Impossible de charger vos disponibilités. Veuillez réessayer."
            variant="error"
          />
        ));
      }
    };

    if (user?.id) {
      fetchAvailabilityData();
    }
  }, [user]);

  const isDayUnavailable = useCallback((day: string) => {
    return availabilities[day].length === 1 && availabilities[day][0].from === "indisponible";
  }, [availabilities]);

  const addAvailability = useCallback(() => {
    setAvailabilities((prev) => ({
      ...prev,
      [selectedDay]: isDayUnavailable(selectedDay) ? [{ from: "", to: "" }] : [...prev[selectedDay], { from: "", to: "" }],
    }));
    toast.custom((t) => (
      <CustomToast
        title="Plage horaire ajoutée"
        // description="Une nouvelle plage horaire a été ajoutée."
        variant="info"
      />
    ))
  }, [selectedDay, isDayUnavailable]);

  const removeAvailability = useCallback((index: number) => {
    setAvailabilities((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((_, i) => i !== index),
    }));
    toast.custom((t) => (
      <CustomToast
        title="Plage horaire supprimée"
        // description="La plage horaire a été supprimée."
        variant="delete"
      />
    ))
  }, [selectedDay]);

  const handleInputChange = useCallback((
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    const formattedValue = formatTime(value);
    setAvailabilities((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((time, i) =>
        i === index ? { ...time, [field]: formattedValue } : time
      ),
    }));
  }, [selectedDay]);

  const markDayAsUnavailable = useCallback(() => {
    const allDays = selectedDay === "Tous les jours" ? daysOfWeek : [selectedDay];

    allDays.forEach((day) => {
      setAvailabilities((prev) => ({
        ...prev,
        [day]: [{ from: "indisponible", to: "indisponible" }],
      }));
    });

    setIsDialogOpen(false);
toast.custom((t) => (
      <CustomToast
        // title="Jour(s) marqué(s) comme indisponible(s)"
        description={`${selectedDay === "Tous les jours" ? "Tous les jours ont" : selectedDay + " a"} été marqué(s) comme indisponible(s).`}
        variant="info"
      />
    ))
  }, [selectedDay]);

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`/api/availability/update/${user?.id}`, {
        availabilities,
        availabilitiesPeriods,
      });
      if (response.status === 200) {
        toast.custom((t) => (
          <CustomToast
            title="Disponibilités mises à jour"
            // description="Vos disponibilités ont été mises à jour avec succès."
            variant="success"
          />
        ))
      }
      }catch (error) {
      console.error("Erreur lors de la mise à jour des disponibilités", error);
      toast.custom((t) => (
        <CustomToast
          // title="Erreur"
          description="Impossible de mettre à jour vos disponibilités. Veuillez réessayer."
          variant="error"
        />
      ))
    }
  };

  const addAvailabilityPeriod = useCallback(() => {
    setAvailabilitiesPeriods((prev) => [
      ...prev,
      { from: "", to: "", timeFrom: "", timeTo: "" },
    ]);
  }, []);

  const removeAvailabilityPeriod = useCallback((index: number) => {
    setAvailabilitiesPeriods((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleInputChangePeriod = useCallback((
    index: number,
    field: "from" | "to" | "timeFrom" | "timeTo",
    value: string
  ) => {
    const formattedValue = field === "timeFrom" || field === "timeTo" ? formatTime(value) : value;
    setAvailabilitiesPeriods((prev) =>
      prev.map((period, i) =>
        i === index ? { ...period, [field]: formattedValue } : period
      )
    );
  }, []);

  return (
    <TabsContent value="availabilities" className="space-y-4">
      <div className="mx-auto p-4 px-8 space-y-8">
        <h2 className="text-2xl font-normal tracking-tight">Disponibilité</h2>
        <section>
          <h3 className="text-xl font-normal">Horaire d'ouverture</h3>
          <Separator className="my-4" />
          <h3 className="text-lg font-normal mb-4">
            Configurer les plages horaires
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={() => setSelectedDay("Tous les jours")}
              variant={selectedDay === "Tous les jours" ? "default" : "secondary"}
            >
              Tous les jours
            </Button>
            {daysOfWeek.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "secondary"}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </Button>
            ))}
          </div>
          <h4 className="text-lg font-normal mb-4">{selectedDay}</h4>
          <div className="space-y-4">
            {isDayUnavailable(selectedDay) ? (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-500">
                    <AlertTriangle className="mr-2" />
                    Journée indisponible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Cette journée a été marquée comme indisponible.</p>
                </CardContent>
              </Card>
            ) : availabilities[selectedDay].length > 0 ? (
              availabilities[selectedDay].map((time, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
                >
                  <div>
                    <Label htmlFor={`from-${index}`}>De</Label>
                    <Input
                      id={`from-${index}`}
                      value={time.from}
                      onChange={(e) =>
                        handleInputChange(index, "from", e.target.value)
                      }
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`to-${index}`}>à</Label>
                    <Input
                      id={`to-${index}`}
                      value={time.to}
                      onChange={(e) =>
                        handleInputChange(index, "to", e.target.value)
                      }
                      maxLength={5}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    className="p-2 h-10 w-10"
                    onClick={() => removeAvailability(index)}
                  >
                    <CircleMinus className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            ) : (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2" />
                    Aucune plage horaire configurée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Veuillez configurer vos plages horaires pour cette journée.</p>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={addAvailability}>
              Ajouter une plage horaire
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" disabled={isDayUnavailable(selectedDay)}>
                  Rendre Indisponible
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmation</DialogTitle>
                  <DialogDescription>
                    Êtes-vous sûr de vouloir rendre {selectedDay === "Tous les jours" ? "tous les jours" : "ce jour"} indisponible(s) ?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button variant="default" onClick={markDayAsUnavailable}>
                    Confirmer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>
        <section>
          <h3 className="text-xl font-normal">Périodes d'indisponibilité</h3>
          <Separator className="my-4" />
          {availabilitiesPeriods.map((period, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-4"
            >
              <div>
                <Label htmlFor={`period-from-${index}`}>De</Label>
                <Input
                  id={`period-from-${index}`}
                  value={period.from}
                  onChange={(e) =>
                    handleInputChangePeriod(index, "from", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={`period-to-${index}`}>à</Label>
                <Input
                  id={`period-to-${index}`}
                  value={period.to}
                  onChange={(e) =>
                    handleInputChangePeriod(index, "to", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={`timeFrom-${index}`}>De l'heure</Label>
                <Input
                  id={`timeFrom-${index}`}
                  value={period.timeFrom}
                  onChange={(e) =>
                    handleInputChangePeriod(index, "timeFrom", e.target.value)
                  }
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor={`timeTo-${index}`}>À l'heure</Label>
                <Input
                  id={`timeTo-${index}`}
                  value={period.timeTo}
                  onChange={(e) =>
                    handleInputChangePeriod(index, "timeTo", e.target.value)
                  }
                  maxLength={5}
                />
              </div>
              <Button
                variant="ghost"
                className="p-2 h-10 w-10"
                onClick={() => removeAvailabilityPeriod(index)}
              >
                <CircleMinus className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            variant="link"
            className="mt-4"
            onClick={addAvailabilityPeriod}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une période de disponibilité
          </Button>
        </section>
        <Button variant="default" className="mt-4" onClick={handleSubmit}>
          Sauvegarder
        </Button>
      </div>
    </TabsContent>
  );
}