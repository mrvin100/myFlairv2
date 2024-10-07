'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TabsContent } from '@/components/ui/tabs';
import { ConfigProvider, Slider } from 'antd';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { StarFilled } from '@ant-design/icons';
import '../Publication/global.css';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { Edit, Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { InputLabel } from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import { Switch } from '@/components/ui/switch';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
export default function Publication() {
    const mark = {
        0: '0',
        50: '50',
        100: '100',
        150: '150',
        200: '200+'
    };

    interface Publication {
        id: string;
        name: string;
        imageProfil: string;
        ville: string;
        pays: string;
        prix: number;
        starRating: number;
        category: string;
        isAtHome: boolean;
        idUser: string;
    }

    const [publication, setPublication] = useState<Publication[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [sliderValue, setSliderValue] = useState([50, 150]);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedPublicationId, setSelectedPublicationId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
    const [publicationData, setPublicationData] = useState<any>(null);
    const [showServiceDialog, setShowServiceDialog] = useState(false);
    const [showProfileDialog, setShowProfileDialog] = useState(false);
    const [serviceData, setServiceData] = useState<any>({}); 

    const handleSliderChange = (value: number[]) => {
        setSliderValue(value);
    };

    const handleCategoryChange = (value: string) => {
        setCategoryFilter(value === "all" ? null : value);
    };

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const response = await fetch('/api/serviceProfessional/get', {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                });
                const data = await response.json();
                const mappedData = data.map((item: any) => ({
                    id: item.id,
                    idUser: item.userId,
                    name: item.title,
                    imageProfil: item.user.image,
                    ville: item.user.address.city,
                    pays: item.user.address.country,
                    prix: parseFloat(item.price),
                    starRating: item.rating || 0,
                    category: item.category,
                    isAtHome: item.domicile,
                }));
                setPublication(mappedData);
            } catch (error) {
                console.error('Error fetching publications:', error);
            }
        };

        fetchPublications();
    }, []);

    const fetchPublicationData = async (id: string) => {
        try {
            const response = await fetch(`/api/serviceProfessional/getById/${id}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();

            const mappedData = {
                id: data.id,
                idUser: data.userId,
                name: data.title,
                imageProfil: data.user?.image || '',
                ville: data.user?.address?.city || '',
                pays: data.user?.address?.country || '',
                prix: parseFloat(data.price),
                starRating: data.user?.mark || 0,
                category: data.category,
                isAtHome: data.domicile,
                dureeRDV: data.dureeRDV,
                valueDureeRDV: data.valueDureeRDV,
                description: data.description
            };
    
            setPublicationData(mappedData);
            console.log(publicationData, "hey")
        } catch (error) {
            console.error('Error fetching publication data:', error);
        }
    };

    const handleDeletePublication = async (id: string) => {
        try {
            const response = await fetch(`/api/serviceProfessional/delete/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPublication(prevPublications => prevPublications.filter(pub => pub.id !== id));
                alert('Publication supprimée avec succès');
            } else {
                const data = await response.json();
                alert(`Erreur : ${data.error}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la publication :', error);
            alert('Erreur lors de la suppression');
        }
    };

    const confirmDelete = (id: string) => {
        setSelectedPublicationId(id);
        setShowDialog(true);
    };

    useEffect(() => {
        const filtered = publication.filter(pub => {
            const withinPriceRange = pub.prix >= sliderValue[0] && pub.prix <= sliderValue[1];
            const matchesCategory = categoryFilter ? pub.category === categoryFilter : true;
            const matchesSearchTerm = pub.name.toLowerCase().includes(searchTerm.toLowerCase());
            return withinPriceRange && matchesCategory && matchesSearchTerm;
        });

        setFilteredPublications(filtered);
    }, [publication, categoryFilter, sliderValue, searchTerm]);


    const handleUpdateService = async () => {
        try {
            const response = await fetch(`/api/serviceProfessional/update/${publicationData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: serviceData.title || publicationData.name,
                    price: parseFloat(serviceData.price || publicationData.prix),
                    category: serviceData.category || publicationData.category,
                    domicile: serviceData.domicile || publicationData.isAtHome,
                    dureeRDV: serviceData.dureeRDV || publicationData.valueDureeRDV,
                    description: serviceData.description || publicationData.description,
                }),
            });
    
            if (response.ok) {
                alert('Service mis à jour avec succès');
                // Optionally close the dialog after the update
                setShowServiceDialog(false);
            } else {
                const data = await response.json();
                alert(`Erreur lors de la mise à jour : ${data.error}`);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du service :', error);
            alert('Erreur lors de la mise à jour');
        }
    };
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const openServiceDialog = async (id: string) => {
        await fetchPublicationData(id); 
        setShowServiceDialog(true); 
    };
    
    const openProfileDialog = (id: string) => {
        setShowProfileDialog(true);
    };

    const handleServiceChange = (field: string, value: any) => {
        setServiceData(prevData => ({
            ...prevData,
            [field]: value,
        }));
    };

    function ModelPublication({ publication }: { publication: Publication }) {
        return (
            <Card style={{ margin: 0 }} className='min-w-[330px] rounded-md'>
                <div className='relative'>
                    <Link href={`back-up/servicePage/${publication.id}`}>
                        <Image
                            src={'/nail-salon.webp'}
                            width={1000}
                            height={1000}
                            alt="Picture of the author"
                            className='rounded-md object-cover'
                        />
                    </Link>
                    <button style={{ padding: '9px', background: '#F8F8F8' }} className='absolute text-sm top-2 left-2 rounded-md text-black'>{publication.category}</button>
                    <Link href={`/back-up/Profil/${publication.idUser}`}>
                        <img style={{ width: '40px', height: '40px', border: 'solid 2px white' }} className='object-cover absolute bottom-2 right-2 rounded-full' src={publication.imageProfil} alt="" />
                    </Link>
                </div>
                <br />
                <CardContent>
                    <div>{publication.name}</div>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center' style={{ marginTop: '3%' }}>
                            <img src={'/iconService/map-pin-3.svg'} alt="map.icon" />
                            <span style={{ color: "#CECECE", marginLeft: '5px' }}>{publication.isAtHome ? (
                                <span style={{ color: "#CECECE" }}>À Domicile</span>
                            ) : (
                                <span style={{ color: "#CECECE" }}>{publication.ville}</span>
                            )},</span>
                            <span style={{ color: "#CECECE", marginLeft: '5px' }}>{publication.pays}</span>
                        </div>
                        <div className='flex items-center' style={{ color: '#CECECE', marginTop: '3%', marginRight: '2px' }}><StarFilled style={{ color: '#F7F74A', fontSize: '24px', marginRight: '5px' }} /> 3/5</div>
                    </div>
                    <br />
                    <div className='flex justify-between'>
                        <span style={{ fontWeight: '700', fontSize: '150%' }}>{publication.prix} €</span>
                        <div className='flex'>
                        <DropdownMenu>
                            <DropdownMenuTrigger><Button><Edit /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent className='flex w-[200px]'>
                                <DropdownMenuItem>
                                <AlertDialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
                                <AlertDialogTrigger asChild>
                                <Button 
                                    onClick={() => {
                                        fetchPublicationData(publication.id); 
                                        openServiceDialog(publication.id); 
                                    }} 
                                    variant={'secondary'}
                                >
                                    Service
                                </Button>

                                </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Modifier Service</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {publicationData && (
                                                    <div>
                                                        <div>
                                                            <label>Titre du service</label>
                                                            <Input
                                                                type="text"
                                                                value={serviceData.title || publicationData.name}
                                                                onChange={(e) => handleServiceChange('title', e.target.value)}
                                                                placeholder="Ex: Coloration cheveux"
                                                                required
                                                            />
                                                        </div>
                                                        <br />
                                                        <div className="flex">
                                                            <div className="flex flex-col">
                                                                <div>
                                                                    Catégorie
                                                                    <Input
                                                                        type="text"
                                                                        value={serviceData.category || publicationData.category}
                                                                        onChange={(e) => handleServiceChange('category', e.target.value)}
                                                                        required
                                                                        placeholder='Ex: Coloration + Shampoing + Brushing'
                                                                    />
                                                                </div>
                                                                <br />
                                                                <div className='mt-3'>
                                                                    Tarifs
                                                                    <Input
                                                                        type="text"
                                                                        value={serviceData.price || publicationData.prix}
                                                                        onChange={(e) => handleServiceChange('price', e.target.value)}
                                                                        required
                                                                        placeholder='Ex: 45'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleUpdateService}>Mettre à jour</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Button 
                                        onClick={(e) => openProfileDialog(publication.id)} 
                                        
                                    >
                                        Profil
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                            

                        <AlertDialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                            <AlertDialogTrigger asChild>
                                <Button style={{ display: 'none' }}></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Profile Dialog</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This is the dialog content for the Profile.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setShowProfileDialog(false)}>Fermer</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className='ml-2'
                                        variant={'destructive'}
                                        onClick={() => confirmDelete(publication.id)}
                                    >
                                        <Trash />
                                    </Button>
                                </AlertDialogTrigger>
                                {showDialog && selectedPublicationId === publication.id && (
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Voulez-vous vraiment supprimer cette publication ?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Cette action est irréversible, voulez-vous vraiment le supprimer ?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setShowDialog(false)}>Annuler</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => {
                                                handleDeletePublication(publication.id);
                                                setShowDialog(false);
                                            }}>
                                                Valider
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                )}
                            </AlertDialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }
    return (
        <TabsContent value='publication'>
            <div className="h-full flex-1 flex-col space-y-8 pl-8 pt-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Gestion des Publications</h2>
                </div>
                <div className='flex'>
                    <div className='col-span-3 min-w-64 max-w-64'>
                        <div className="bg-gray-100 rounded p-4">
                            <h1>Rechercher</h1>
                            <Input className="w-full bg-white text-gray-700 mt-2" placeholder='Que recherchez-vous ?' type="text" />
                        </div>
                        <div className="bg-gray-100 rounded p-4 mt-4">
                            <h1>Lieux</h1>
                            <Input className="w-full bg-white text-gray-700 mt-2" placeholder='Indiquer un lieu' type="text" />
                        </div>
                        <div className="bg-gray-100 rounded p-4 mt-4">
                            <h1>Catégories de Services</h1>
                            <Select onValueChange={handleCategoryChange}>
                                <SelectTrigger className='w-full bg-white mt-2'>
                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                </SelectTrigger>
                                <SelectContent className='w-full bg-white'>
                                    <SelectGroup>
                                        <SelectLabel>Catégories</SelectLabel>
                                        <SelectItem value="all">Toutes</SelectItem>
                                        <SelectItem value="coiffures">Coiffures</SelectItem>
                                        <SelectItem value="soins">Soins de la Peau</SelectItem>
                                        <SelectItem value="estheticienne">Esthéticienne</SelectItem>
                                        <SelectItem value="massages">Massages</SelectItem>
                                        <SelectItem value="bien-etre">Bien-être</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="bg-gray-100 rounded p-4 mt-4">
                            <h1>Prix</h1>
                            <ConfigProvider theme={{ token: { colorPrimaryBorderHover: '#000' }, components: { Slider: { dotActiveBorderColor: '#000', handleActiveColor: '#000', handleColor: '#000', trackBg: '#000', trackHoverBg: '#000' } } }}>
                                <Slider style={{ width: '95%' }} className="mt-4" marks={mark} step={5} max={200} range defaultValue={[50, 150]} onChange={handleSliderChange} />
                            </ConfigProvider>
                            <span className="block mt-2">Prix: {sliderValue[0]} € - {sliderValue[1]} €</span>
                        </div>
                        <button className="bg-black rounded text-white text-lg mt-4 w-full py-3">Rechercher</button>
                    </div>
                    <div style={{ marginLeft: '2%' }}>
                        <div className="grid grid-cols-custom gap-7">
                            {filteredPublications.map(pub => (
                                <ModelPublication key={pub.id} publication={pub} />
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </TabsContent>
    );
}

