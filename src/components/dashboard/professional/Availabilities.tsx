"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, CircleMinus, Plus, TriangleAlert } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialAvailabilities = {
  "Tous les jours": [
    { from: "09:00", to: "10:00" },
    { from: "14:00", to: "16:00" },
    { from: "20:00", to: "21:00" },
    { from: "22:00", to: "00:00" },
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
    timeFrom: "13:00",
    timeTo: "14:00",
  },
  {
    from: "30 mai 2024",
    to: "01 juin 2024",
    timeFrom: "15:00",
    timeTo: "17:00",
  },
  {
    from: "6 juin 2024",
    to: "10 juin 2024",
    timeFrom: "18:00",
    timeTo: "19:00",
  },
  {
    from: "4 juillet 2024",
    to: "5 juillet 2024",
    timeFrom: "20:00",
    timeTo: "21:00",
  },
];

export default function AvailabilitiesTab() {
  const [selectedDay, setSelectedDay] = useState("Tous les jours");
  const [availabilities, setAvailabilities] = useState(initialAvailabilities);
  const [availabilitiesPeriods, setAvailabilitiesPeriods] = useState(
    initialAvailabilitiesPeriods
  );
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
    const updatedAvailabilities = availabilities[selectedDay].map((time, i) =>
      i === index ? { ...time, [field]: value } : time
    );
    setAvailabilities({
      ...availabilities,
      [selectedDay]: updatedAvailabilities,
    });
  };
  const handleInputChangePeriod = (
    index: number,
    field: "from" | "to" | "timeFrom" | "timeTo",
    value: string
  ) => {
    const updatedAvailabilitiesPeriods = availabilitiesPeriods.map(
      (period, i) => (i === index ? { ...period, [field]: value } : period)
    );
    setAvailabilitiesPeriods(updatedAvailabilitiesPeriods);
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
            {availabilities[selectedDay] &&
            availabilities[selectedDay].length > 0 ? (
              availabilities[selectedDay].map((time, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
                >
                  <div>
                    <Label htmlFor={`from-${index}`}>De</Label>
                    <Input
                      id={`from-${index}`}
                      value={time.from}
                      onChange={(e) =>
                        handleInputChange(index, "from", e.target.value)
                      }
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
          <Button
            variant="link"
            className="mt-4"
            onClick={() => addAvailability()}
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter une autre horaire
          </Button>
        </section>
        <section>
          <h2 className="text-xl font-normal">Vacance et jours férié</h2>
          <Separator className="my-4" />
          <h3 className="text-lg font-normal mb-4">
            Configurer les dates d'indisponibilité
          </h3>
          <div className="space-y-4">
            {availabilitiesPeriods && availabilitiesPeriods.length > 0 ? (
              availabilitiesPeriods.map((period, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end"
                >
                  <div>
                    <Label htmlFor={`date-from-${index}`}>Du</Label>
                    <Input
                      id={`date-from-${index}`}
                      value={period?.from}
                      onChange={(e) =>
                        handleInputChangePeriod(index, "from", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`date-to-${index}`}>au</Label>
                    <Input
                      id={`date-to-${index}`}
                      value={period?.to}
                      onChange={(e) =>
                        handleInputChangePeriod(index, "to", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`time-from-${index}`}>De</Label>
                    <Input
                      id={`time-from-${index}`}
                      value={period?.timeFrom}
                      onChange={(e) =>
                        handleInputChangePeriod(
                          index,
                          "timeFrom",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`time-to-${index}`}>à</Label>
                    <Input
                      id={`time-to-${index}`}
                      value={period?.timeTo}
                      onChange={(e) =>
                        handleInputChangePeriod(index, "timeTo", e.target.value)
                      }
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
              ))
            ) : (
              <div>
                <Alert className="text-center">
                  <Bell className="h-6 w-6 text-muted" />
                  <AlertTitle className="ml-4 mb-2">Oups!</AlertTitle>
                  <AlertDescription className="ml-4">
                    Veuillez configurer vos périodes de disponibilités.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
          <Button
            variant="link"
            className="mt-4"
            onClick={() => addAvailabilityPeriod()}
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter une autre date
          </Button>
        </section>
        <Button className="mt-8">Mettre à jour</Button>
      </div>
    </TabsContent>
  );
}
