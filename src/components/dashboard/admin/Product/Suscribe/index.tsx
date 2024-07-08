'use client';
import { TabsContent } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TrashIcon } from '@radix-ui/react-icons';
import { CalendarBusinessBooster } from '@/components/calendarBusinessBooster';
import { Popover } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

const Abonnement = [
    {
        id: 1,
        title: 'Tarifs gestion planning MENSUEL',
        price: 19,
        freePeriod: 1,
        type: 'day'
    },
    {
        id: 2,
        title: 'Tarifs gestion planning ANNUEL',
        price: 200,
        freePeriod: 1,
        type: 'year'
    }
];

interface Suscribe {
    clientId: string;
    type: string;
    [key: string]: string | boolean | number | undefined;
}

interface createSuscribe {
    title: string,
    price: number,
    nbrEssaisGratuit: number,
    period: string,
    [key: string]: string | boolean | number | undefined;
}

export default function SuscribeTab() {
    const [suscribe, setSuscribe] = useState<Suscribe>({
        clientId: '',
        type: '',
    });


    const [createSuscribe, setCreateSucribe] = useState<createSuscribe>({
        title: '',
        price: 0,
        nbrEssaisGratuit:0,
        period:'',
    });
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 30),
    });
    const [dates, setDates] = useState<DateRange[]>([]);

    const handleServiceChange = (key: keyof Suscribe, value: any) => {
        setSuscribe((prevSuscribe) => ({
            ...prevSuscribe,
            [key]: value,
        }));
    };

    const handleAbonnementChange = (key: keyof Suscribe, value: any) => {
        setCreateSucribe((prevCreateSuscribe) => ({
            ...prevCreateSuscribe,
            [key]: value
        }))
    }

    const handleTypeChange = (value: string) => {
        handleServiceChange('type', value);
    };
    const handleTimeChange = (value: string) => {
        handleAbonnementChange('period', value);
    };

    return (
        <TabsContent value='suscribe' className="space-y-4">
            <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Gestion des Abonnements</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Ajouter</Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-screen overflow-y-scroll">
                            <DialogHeader>
                                <DialogTitle>Ajouter un abonnement</DialogTitle>
                                <DialogDescription>
                                    <br />
                                    <label className='mt-4' htmlFor="">Titre</label>
                                    <br />
                                    <Input 
                                        type='text'
                                        placeholder='Ex: Gestion planning MENSUEL'
                                    />
                                    <br />
                                    <label htmlFor="">Prix</label>
                                    <br />
                                    <Input 
                                        type='number'
                                        placeholder='Ex: 19 €'
                                    />
                                    <br />
                                    <label htmlFor="">Essai gratuit</label>
                                    <br />
                                    <div className='flex'>
                                        <Input type='number' className='mr-6'/>
                                      
                                        <Select onValueChange={handleTimeChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Période" />
                                            </SelectTrigger>
                                            <SelectContent >
                                                <SelectGroup>
                                                    <SelectLabel>Période</SelectLabel>
                                                        <SelectItem value='day'>Jours</SelectItem>
                                                        <SelectItem value='week'>Semaines</SelectItem>
                                                        <SelectItem value='month'>Mois</SelectItem>
                                                        <SelectItem value='year'>Années</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        
                                    </div>
                                </DialogDescription>
                                <div>
                                    <Button></Button>
                                </div>

                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 min-w-[400px]">
                    {Abonnement.map((abonnement) => (
                        <Card key={abonnement.id} className=''>
                            <CardHeader>
                                <CardTitle className="flex justify-center" style={{ fontWeight: '700' }}>
                                    {abonnement.title}:
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span className="flex justify-center" style={{ fontWeight: 700, fontSize: '40px' }}>
                                    {abonnement.price}€
                                </span>
                                <br />
                                <span className="flex justify-center">Essai gratuit :</span>
                                <span className="flex justify-center" style={{ fontWeight: 700, fontSize: '40px' }}>
                                    {abonnement.freePeriod} {abonnement.type === "day" && abonnement.freePeriod === 1 ? (
                                        "Jour"
                                    ) : abonnement.type === 'day' && abonnement.freePeriod > 1 ? (
                                        "Jours"
                                    ) : abonnement.type === 'week' && abonnement.freePeriod === 1 ? (
                                        "Semaine"
                                    ) : abonnement.type === 'week' && abonnement.freePeriod > 1 ? (
                                        "Semaines"
                                    ) : abonnement.type === 'month' && abonnement.freePeriod === 1 ? (
                                        "Mois"
                                    ) : abonnement.type === 'month' && abonnement.freePeriod > 1 ? (
                                        "Mois"
                                    ) : abonnement.type === 'year' && abonnement.freePeriod === 1 ? (
                                        "Année"
                                    ) : abonnement.type === 'year' && abonnement.freePeriod > 1 ? (
                                        "Années"
                                    ) : null}
                                </span>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button variant="destructive">Supprimer</Button>
                                <Button className="ml-3">Modifier</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <Dialog>
                    <DialogTrigger><Button> Ajouter un Abonnement</Button></DialogTrigger>
                    <DialogContent className="max-h-screen overflow-y-scroll rounded-md ">
                        <DialogTitle>Ajouter un Abonnement à un Client</DialogTitle>
                        <DialogDescription className='p-2'>
                            <Command>
                                <CommandInput placeholder="Rechercher un Client" />
                                <CommandList>
                                    <CommandEmpty>Aucun Résultat</CommandEmpty>
                                    <CommandGroup heading="Suggestions">
                                        <CommandItem className="flex items-center">
                                            <img
                                                style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                                className='object-cover rounded-full'
                                                src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                                alt="photo de profil"
                                            />
                                            <span className="ml-3">Miss Kitty</span>
                                        </CommandItem>
                                        <CommandItem className="flex items-center">
                                            <img
                                                style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                                className='object-cover rounded-full'
                                                src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                                alt="photo de profil"
                                            />
                                            <span className="ml-3">Jane Doe</span>
                                        </CommandItem>
                                        <CommandItem className="flex items-center">
                                            <img
                                                style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                                className='object-cover rounded-full'
                                                src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                                alt="photo de profil"
                                            />
                                            <span className="ml-3">Alice Smith</span>
                                        </CommandItem>
                                        <CommandItem className="flex items-center">
                                            <img
                                                style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                                className='object-cover rounded-full'
                                                src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                                alt="photo de profil"
                                            />
                                            <span className="ml-3">Emily Johnson</span>
                                        </CommandItem>
                                        <CommandItem className="flex items-center">
                                            <img
                                                style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                                className='object-cover rounded-full'
                                                src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                                alt="photo de profil"
                                            />
                                            <span className="ml-3">Sarah Brown</span>
                                        </CommandItem>
                                        <CommandItem className="flex items-center">
                                            <img
                                                style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                                className='object-cover rounded-full'
                                                src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                                />
                                     <span className="ml-3">Olivia Davis</span>
                                </CommandItem>
                                <CommandItem className="flex items-center">
                                    <img
                                        style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                        className='object-cover rounded-full'
                                                src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                        alt="photo de profil"
                                    />
                                    <span className="ml-3">Sophia Martinez</span>
                                </CommandItem>
                                <CommandItem className="flex items-center">
                                    <img
                                        style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                        className='object-cover rounded-full'
                                        src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                        alt="photo de profil"
                                    />
                                    <span className="ml-3">Ava Wilson</span>
                                </CommandItem>
                                <CommandItem className="flex items-center">
                                    <img
                                        style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                        className='object-cover rounded-full'
                                        src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                        alt="photo de profil"
                                    />
                                    <span className="ml-3">Isabella Moore</span>
                                </CommandItem>
                                <CommandItem className="flex items-center">
                                    <img
                                        style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                        className='object-cover rounded-full'
                                        src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                        alt="photo de profil"
                                    />
                                    <span className="ml-3">Mia Taylor</span>
                                </CommandItem>
                                <CommandItem className="flex items-center">
                                    <img
                                        style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                        className='object-cover rounded-full'
                                        src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                        alt="photo de profil"
                                    />
                                    <span className="ml-3">Amelia Anderson</span>
                                </CommandItem>
                                <CommandItem className="flex items-center">
                                    <img
                                        style={{ width: '30px', height: '30px', border: 'solid 2px white' }}
                                        className='object-cover rounded-full'
                                        src="https://media.istockphoto.com/id/1320651997/fr/photo/portrait-datelier-isolé-dune-jeune-femme-en-gros-plan.jpg?s=612x612&w=0&k=20&c=VlvYhvY75qMYbay0FI2sy4dQEbvb7w6zTlCDnEDAWbI="
                                        alt="photo de profil"
                                    />
                                    <span className="ml-3">Harper Thomas</span>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                        <br />
                        <div>
                        <label htmlFor="">Type d'abonnement</label>
                        <br />
                        <br />
                        <div style={{padding:'1px'}}>
                            <Select onValueChange={handleTypeChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Type d'abonnement" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectGroup>
                                        <SelectLabel>Type d'abonnement</SelectLabel>
                                        <SelectItem value='month'>Gestion planning Mensuel</SelectItem>
                                        <SelectItem value='year'>Gestion planning Annuel</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <br />
                    <label htmlFor="">Date</label>
                    <br></br>
                        <Popover>
                          <div className="grid gap-2">
                            <CalendarBusinessBooster dateRange={dateRange} setDateRange={setDateRange} />
                          </div>
                        </Popover>
                        <br />
                        {dates.length > 0 && <p>Dates ajoutées:</p>}
                        {dates.map((date, index) => (
                          <div className="flex items-center gap-2" key={index}>
                            {date.to ? (
                              <>
                                {format(date.from!, 'dd LLL y', { locale: fr })} - {format(date.to!, 'dd LLL y', { locale: fr })}
                              </>
                            ) : (
                              format(date.from!, 'dd LLL y', { locale: fr })
                            )}
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => {
                                const newDates = dates.filter((_, i) => i !== index);
                                setDates(newDates);
                                
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                            <br />
                          </div>
                        ))}
<br />
                        <Button
                          className="flex justify-center"
                          onClick={() => {
                            if (dateRange) {
                              const newDates = [...dates, dateRange];
                              setDates(newDates);
                             
                            }
                          }}
                          type="button"
                        >
                            
                          Ajouter la date
                        </Button>
                        <br />
                        <div className='flex justify-end mt-5'>
                            <Button variant={'secondary'}>Annuler</Button>
                            <Button className='ml-4'>Enregistrer</Button>
                        </div>
                    </Command>
                    
                    
                </DialogDescription>
            </DialogContent>
        </Dialog>
        
    </div>
</TabsContent>
);
}