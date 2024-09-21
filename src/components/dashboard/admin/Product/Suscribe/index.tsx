'use client';

import { useEffect, useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import {
    Card, CardContent, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { TrashIcon } from 'lucide-react';

interface createSuscribe {
    title: string;
    price: number;
    nbrEssaisGratuit: number;
    period: string;
    functions?: { name: string }[];
}

export default function SuscribeTab() {
    const [createSuscribe, setCreateSuscribe] = useState<createSuscribe>({
        title: '',
        price: 0,
        nbrEssaisGratuit: 0,
        period: '',
        functions: [],
    });

    const [abonnement, setAbonnement] = useState<any[]>([]);

    const handleAbonnementChange = (field: string, value: any) => {
        setCreateSuscribe((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleTimeChange = (value: string) => {
        setCreateSuscribe((prev) => ({
            ...prev,
            period: value,
        }));
    };

    const handleFunctionChange = (index: number, value: string) => {
        setCreateSuscribe((prev) => {
            const functions = [...(prev.functions || [])];
            functions[index] = { name: value };
            return { ...prev, functions };
        });
    };

    const handleRemoveFunction = (index: number) => {
        setCreateSuscribe((prev) => {
            const functions = (prev.functions || []).filter((_, i) => i !== index);
            return { ...prev, functions };
        });
    };

    const handleAddFunction = () => {
        setCreateSuscribe((prev) => ({
            ...prev,
            functions: [...(prev.functions || []), { name: '' }],
        }));
    };

    const handleCreateAbonnement = async () => {
        const abonnementData = {
            title: createSuscribe.title,
            price: createSuscribe.price,
            nbrEssaisGratuit: createSuscribe.nbrEssaisGratuit,
            period: createSuscribe.period,
            functions: createSuscribe.functions,
        };

        const response = await fetch('/api/abonnement/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(abonnementData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Abonnement créé avec succès:', data);
        } else {
            console.error('Erreur lors de la création de l\'abonnement');
        }
    };

    useEffect(() => {
        const fetchAbonnements = async () => {
            const response = await fetch('/api/abonnement/get');
            const abonnements = await response.json();
            setAbonnement(abonnements);
        };
        fetchAbonnements();
    }, []);

    const handleDeleteAbonnement = async (id: string) => {
        const response = await fetch(`/api/abonnement/delete/${id}`, { method: 'DELETE' });

        if (response.ok) {
            setAbonnement((prevAbonnement) => prevAbonnement.filter((abonnement) => abonnement.id !== id));
        } else {
            console.error('Erreur lors de la suppression de l\'abonnement');
        }
    };

    return (
        <TabsContent value="suscribe" className="space-y-4">
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
                                <br />
                                <DialogDescription>
                                    <label>Titre</label>
                                    <br /><br />
                                    <Input
                                        type="text"
                                        placeholder="Ex: Gestion planning MENSUEL"
                                        value={createSuscribe.title}
                                        onChange={(e) => handleAbonnementChange('title', e.target.value)}
                                    />
                                    <br />
                                    <label>Prix</label>
                                    <br /><br />
                                    <Input
                                        type="number"
                                        placeholder="Ex: 19 €"
                                        value={createSuscribe.price}
                                        onChange={(e) => handleAbonnementChange('price', e.target.value)}
                                    />
                                    <br />
                                    <label>Essai gratuit</label>
                                    <br /><br />
                                    <div className="flex">
                                        <Input
                                            type="number"
                                            className="mr-6"
                                            value={createSuscribe.nbrEssaisGratuit}
                                            onChange={(e) => handleAbonnementChange('nbrEssaisGratuit', e.target.value)}
                                        />
                                        <Select onValueChange={handleTimeChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Période" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Période</SelectLabel>
                                                    <SelectItem value="day">Jours</SelectItem>
                                                    <SelectItem value="week">Semaines</SelectItem>
                                                    <SelectItem value="month">Mois</SelectItem>
                                                    <SelectItem value="year">Années</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <br />
                                    <label>Fonctionnalités</label>
                                    <br /><br />
                                    {createSuscribe.functions?.map((func, index) => (
                                        <div key={index} className="flex items-center space-x-2 mt-2">
                                            <Input
                                                type="text"
                                                placeholder={`Fonction ${index + 1}`}
                                                value={func.name}
                                                onChange={(e) => handleFunctionChange(index, e.target.value)}
                                            />
                                            <Button variant="destructive" onClick={() => handleRemoveFunction(index)}>Supprimer</Button>
                                        </div>
                                    ))}
                                    <span onClick={handleAddFunction} className="mt-4 flex cursor-pointer"><u>Ajouter une nouvelle fonction+</u></span>
                                    <Button onClick={handleCreateAbonnement} className="mt-4">Enregistrer</Button>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 min-w-[400px]">
                {abonnement.map((abonnement) => (
                    <Card key={abonnement.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-center" style={{ fontWeight: '700' }}>
                            <span className="flex justify-center" style={{ fontWeight: 700 }}>
                        {abonnement.title}
                    </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                        
                    <span className="flex justify-center" style={{ fontSize: '40px' }}>
                        {abonnement.price}€
                    </span>
                    <span className="flex justify-center">Essai gratuit :</span>
                    <span className="flex justify-center" style={{ fontWeight: 700, fontSize: '40px' }}>
                    {abonnement.nbrEssaisGratuit !== null && abonnement.nbrEssaisGratuit !== '' && (
                        <>
                        {abonnement.nbrEssaisGratuit}{' '}
                        {(() => {
                        const { period, nbrEssaisGratuit } = abonnement;

                        if (period === 'day') {
                            return nbrEssaisGratuit === 1 ? 'Jour' : 'Jours';
                        }
                        if (period === 'week') {
                        return nbrEssaisGratuit === 1 ? 'Semaine' : 'Semaines';
                        }
                        if (period === 'month') {
                        return 'Mois';
                    }
                    if (period === 'year') {
                         return nbrEssaisGratuit === 1 ? 'Année' : 'Années';
                        }

                        return ''; // Cas par défaut si aucun match
                    })()}
                </>
            )}
            </span>

                    
                </CardContent>
                <CardFooter className="flex justify-center">
                <Button
                    variant="destructive"
                    onClick={() => handleDeleteAbonnement(abonnement.id)}
                >
                    <TrashIcon className="mr-2" /> Supprimer
                </Button>
            </CardFooter>
            </Card>
            ))}
        </div>

            </div>
        </TabsContent>
    );
}
