import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CircleMinus, Plus } from "lucide-react"
import { TabsContent } from '@/components/ui/tabs';

export default function AvailabilitiesTab() {
  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
  return (
    <TabsContent value="availabilities" className="space-y-4">
   
          <div className="container mx-auto p-4 space-y-8">
          <h2 className="text-2xl font-normal tracking-tight">Disponibilité</h2>
      {/* Block 1: Horaire d'ouverture */}
      <section>
        <h3 className="text-xl font-normal">Horaire d'ouverture</h3>
        <Separator className="my-4" />
        <h3 className="text-lg font-normal mb-4">Configurer les plages horaires</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button>Tous les jours</Button>
          {daysOfWeek.map((day) => (
            <Button key={day} variant="secondary">{day}</Button>
          ))}
        </div>
        <h4 className="text-lg font-normal mb-4">Tous les jours</h4>
        <div className="space-y-4">
          {[
            { from: "09:00", to: "10:00" },
            { from: "14:00", to: "16:00" },
            { from: "20:00", to: "21:00" },
            { from: "22:00", to: "00:00" }
          ].map((time, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor={`from-${index}`}>De</Label>
                <Input id={`from-${index}`} defaultValue={time.from} />
              </div>
              <div>
                <Label htmlFor={`to-${index}`}>à</Label>
                <Input id={`to-${index}`} defaultValue={time.to} />
              </div>
              <Button variant="ghost" className="p-2 h-10 w-10">
                <CircleMinus className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="link" className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une autre horaire
        </Button>
      </section>

      {/* Block 2: Vacance et jours férié */}
      <section>
        <h2 className="text-xl font-normal">Vacance et jours férié</h2>
        <Separator className="my-4" />
        <h3 className="text-lg font-normal mb-4">Configurer les dates d'indisponibilité</h3>
        <div className="space-y-4">
          {[
            { from: "16 janvier 2024", to: "10 fevrier 2024", timeFrom: "13:00", timeTo: "14:00" },
            { from: "30 mai 2024", to: "01 juin 2024", timeFrom: "15:00", timeTo: "17:00" },
            { from: "6 juin 2024", to: "10 juin 2024", timeFrom: "18:00", timeTo: "19:00" },
            { from: "4 juillet 2024", to: "5 juillet 2024", timeFrom: "20:00", timeTo: "21:00" }
          ].map((period, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div>
                <Label htmlFor={`date-from-${index}`}>Du</Label>
                <Input id={`date-from-${index}`} defaultValue={period.from} />
              </div>
              <div>
                <Label htmlFor={`date-to-${index}`}>au</Label>
                <Input id={`date-to-${index}`} defaultValue={period.to} />
              </div>
              <div>
                <Label htmlFor={`time-from-${index}`}>De</Label>
                <Input id={`time-from-${index}`} defaultValue={period.timeFrom} />
              </div>
              <div>
                <Label htmlFor={`time-to-${index}`}>à</Label>
                <Input id={`time-to-${index}`} defaultValue={period.timeTo} />
              </div>
              <Button variant="ghost" className="p-2 h-10 w-10">
                <CircleMinus className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="link" className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une autre date
        </Button>
      </section>

      {/* Update Button */}
      <Button className="mt-8">Mettre à jour</Button>
    </div>
        {/* </div>
      </div> */}
    </TabsContent>
  );
}
