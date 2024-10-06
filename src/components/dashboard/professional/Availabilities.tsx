"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, CircleMinus, Plus } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";
import { useUserContext } from "@/contexts/user";

const initialAvailabilities = {
  "Tous les jours": [
    { from: "09:00", to: "10:00" },
    { from: "14:00", to: "16:00" },
    { from: "20:00", to: "21:00" },
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
    from: "16 janvier 2024",
    to: "10 fevrier 2024",
    timeFrom: "00:00",
    timeTo: "00:00",
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
      }
    };

    if (user?.id) {
      fetchAvailabilityData();
    }
  }, [user]);

  const daysOfWeek = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  const addAvailability = () => {
    const newAvailability = { from: "", to: "" };
    setAvailabilities({
      ...availabilities,
      [selectedDay]: [...availabilities[selectedDay], newAvailability],
    });
  };

  const addAvailabilityPeriod = () => {
    const newAvailabilityPeriods = [
      ...availabilitiesPeriods,
      { from: "", to: "", timeFrom: "", timeTo: "" },
    ];
    setAvailabilitiesPeriods(newAvailabilityPeriods);
  };

  const removeAvailability = (index: number) => {
    const updatedAvailabilities = availabilities[selectedDay].filter(
      (_, i) => i !== index
    );
    setAvailabilities({
      ...availabilities,
      [selectedDay]: updatedAvailabilities,
    });
  };

  const removeAvailabilityPeriod = (index: number) => {
    const updatedAvailabilitiesPeriods = availabilitiesPeriods.filter(
      (_, i) => i !== index
    );
    setAvailabilitiesPeriods(updatedAvailabilitiesPeriods);
  };

  const handleInputChange = (
    index: number,
    field: "from" | "to",
    value: string
  ) => {
    const formattedValue = formatTime(value);
    const updatedAvailabilities = availabilities[selectedDay].map((time, i) =>
      i === index ? { ...time, [field]: formattedValue } : time
    );
    setAvailabilities({
      ...availabilities,
      [selectedDay]: updatedAvailabilities,
    });
  };

  const markDayAsUnavailable = () => {
    const updatedAvailability = { from: "indisponible", to: "indisponible" };
    const allDays = selectedDay === "Tous les jours" ? daysOfWeek : [selectedDay];

    allDays.forEach(day => {
      // Supprime toutes les plages horaires de la journée et marque comme indisponible
      setAvailabilities(prev => ({
        ...prev,
        [day]: [updatedAvailability],
      }));
    });
  };

  const handleInputChangePeriod = (
    index: number,
    field: "from" | "to" | "timeFrom" | "timeTo",
    value: string
  ) => {
    const formattedValue =
      field === "timeFrom" || field === "timeTo" ? formatTime(value) : value;
    const updatedAvailabilitiesPeriods = availabilitiesPeriods.map(
      (period, i) =>
        i === index ? { ...period, [field]: formattedValue } : period
    );
    setAvailabilitiesPeriods(updatedAvailabilitiesPeriods);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`/api/availability/update/${user?.id}`, {
        availabilities,
        availabilitiesPeriods,
      });
      if (response.status === 200) {
        alert("Disponibilités mises à jour avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des disponibilités", error);
    }
  };

  return (
    <TabsContent value="availabilities" className="space-y-4">
      <div className="container mx-auto p-4 space-y-8">
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
              variant={
                selectedDay === "Tous les jours" ? "default" : "secondary"
              }
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
            {availabilities[selectedDay].length > 0 ? (
              availabilities[selectedDay].map((time, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
                >
                  {time.from === "indisponible" ? (
                    <div className="text-red-500 font-bold">Journée indisponible</div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              ))
            ) : (
              <div>
                <Alert className="text-center">
                  <Bell className="h-6 w-6 text-muted" />
                  <AlertTitle className="ml-4 mb-2">Oups!</AlertTitle>
                  <AlertDescription className="ml-4">
                    Veuillez Configurer vos plages horaires.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={addAvailability}>
              Ajouter une plage horaire
            </Button>
            <Button variant="destructive" onClick={markDayAsUnavailable}>
              Rendre Indisponible
            </Button>
          </div>
        </section>
        <section>
          <h3 className="text-xl font-normal">Périodes de disponibilité</h3>
          <Separator className="my-4" />
          {availabilitiesPeriods.map((period, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
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
          <Button variant="link" className="mt-4" onClick={addAvailabilityPeriod}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une période de d'indisponibilité
          </Button>
        </section>
        <Button variant="primary" className="mt-4" onClick={handleSubmit}>
          Sauvegarder
        </Button>
      </div>
    </TabsContent>
  );
}
