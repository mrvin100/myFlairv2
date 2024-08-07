'use client';
import { TabsContent } from '@/components/ui/tabs';
import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Link from 'next/link';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from '@/components/ui/use-toast';
import { error, success } from '@/components/toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useUserContext } from '@/contexts/user';
import { SubmitButton } from '@/components/button';

interface Service {
  id: string;
  title: string;
  category: string;
  price: string;
  description: string;
  dureeRDV: string;
  domicile: boolean;
  
}

const categoryOptions = ['Massage', 'Coiffure', 'Esthétique', 'Bien-être', 'Autre'];

export default function ServicesTab() {
  const { user } = useUserContext();
  const [services, setServices] = useState<Service[]>([]);
  const [sortOption, setSortOption] = useState<string>('');
  const { toast } = useToast();
  // State for new service form
  const initialServiceState: Service = {
    id: '',
    title: '',
    category: '',
    price: '',
    description: '',
    dureeRDV: '',
    domicile: false,
    
  };

  const [newService, setNewService] = useState<Service>(initialServiceState);
  const [showAddServiceDialog, setShowAddServiceDialog] = useState<boolean>(false);
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    handleServiceChange('category', value);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0
      ? `${hours} heure${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minutes` : ''}`
      : `${remainingMinutes} minutes`;
  };

  const handleTimeChange = (value: string) => {
    const formattedValue = formatDuration(parseInt(value));
    handleServiceChange('dureeRDV', formattedValue);
  };

  const handleDomicileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleServiceChange('domicile', event.target.checked);
  };

  useEffect(() => {
    fetch('/api/service', {
      method: 'GET'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Service[]) => {
        console.log('Services fetched:', data);
        setServices(data);
      })
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedOption = event.target.value as string;
    setSortOption(selectedOption);

    let sortedServices = [...services];

    switch (selectedOption) {
      case 'recent':
        break;
      case 'a-z':
        sortedServices.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
        break;
      case 'categorie':
        sortedServices.sort((a, b) => {
          return a.category.localeCompare(b.category);
        });
        break;
      case 'prix':
        sortedServices.sort((a, b) => {
          return parseFloat(a.price) - parseFloat(b.price);
        });
        break;
      default:
        break;
    }

    setServices(sortedServices);
  };
  const userId = user?.id;
  const handleServiceChange = (field: keyof Service, value: any) => {
    setNewService({
      ...newService,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    console.log('New Service:', newService);
    setNewService(initialServiceState);
    setShowAddServiceDialog(false);
    setLoading(true);
    try {
      const response = await axios.post('/api/serviceProfessional/create', {
        ...newService,
        userId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setLoading(false);
      if (response.status === 200) {
        success(toast, {
          description: 'Service Créée avec succès !',
        });
      } else {
        error(toast, {
          description: 'Erreur dans la création du Service !',
        });
      }
    } catch (error) {
      error(toast, {
        description: 'Erreur dans la création du Service !',
      });
    }
  };

  const [loading, setLoading] = useState(false);
  return (
    <TabsContent value="services" className="space-y-4">
      <div className="h-full flex-1 space-y-8 p-8 md:flex items-start justify-between">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Services</h2>
          <Dialog>
            <DialogTrigger asChild><Button onClick={() => setShowAddServiceDialog(true)}>Ajouter un Service</Button></DialogTrigger>
            <DialogContent className='rounded'>
              <DialogHeader>Ajouter un nouveau service</DialogHeader>
              <DialogDescription className=''>
                <div>
                  <label>Titre</label>
                  <Input
                    type="text"
                    value={newService.title}
                    onChange={(e) => handleServiceChange('title', e.target.value)}
                    placeholder="Ex: Massage Thai"
                    required
                  />
                </div>
                <br />
                <div className="flex">
                  <div className="flex flex-col">
                    <div>
                      Catégorie
                      <Select onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Choisir une catégorie">{newService.category || 'Sélectionner une catégorie'}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <br />
                    <div>
                      Tarifs
                      <div className='flex items-end'>
                        <Input
                          type="text"
                          value={newService.price}
                          onChange={(e) => handleServiceChange('price', e.target.value)}
                          required
                          placeholder="Ex: 50"
                         
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="flex flex-col" style={{ marginLeft: '10%' }}>
                    <div>Durée</div>
                    <Select onValueChange={handleTimeChange}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Choisir une durée">{newService.dureeRDV || 'Sélectionner une durée'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 heure</SelectItem>
                        <SelectItem value="75">1h 15 minutes</SelectItem>
                        <SelectItem value="90">1 heure 30 minutes</SelectItem>
                        <SelectItem value="105">1 heure 45 minutes</SelectItem>
                        <SelectItem value="120">2 heures</SelectItem>
                        <SelectItem value="135">2 heures 15 minutes</SelectItem>
                        <SelectItem value="150">2 heures 30 minutes</SelectItem>
                        <SelectItem value="165">2 heures 45 minutes</SelectItem>
                        <SelectItem value="180">3 heures</SelectItem>
                      </SelectContent>
                    </Select>

                    <br />
                    <br />
                    <div className="flex flex-col">
                      <label>Service à domicile ?</label>
                      <span style={{ fontSize: '70%' }}>
                        Ce service bénéficiera des services à domicile que vous fournissez
                      </span>
                      <div style={{ marginTop: "5px" }}>
                        <Switch checked={newService.domicile} onChange={handleDomicileChange} />
                      </div>
                    </div>
                  </div>
                  <br />
                </div>
                <br />
                <div style={{ width: "100%", height: "1px", background: "#EAEAEA" }}></div>
                <br />
                <div>
                  <div>Description</div>
  
                  <br />
                  <ReactQuill
                    value={newService.description}
                    onChange={(value) => handleServiceChange('description', value)}
                    placeholder="Décrivez votre service ici..."
                  />
                </div>
                <br />
                <div className="flex justify-end">
                <SubmitButton pending={loading} onClick={handleSubmit}>
                    Publier
                  </SubmitButton>
                </div>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
        <hr />
        <div>
          {services.length > 0 ? (
            <ul>
              {services.map((service: Service) => (
                <div key={service.id} style={{ border: 'solid 2px #ECECEC', padding: '25px', marginTop: '5%' }} className="flex justify-between items-start rounded">
                  <div className="flex flex-col justify-start items-start" style={{ width: '70%' }}>
                    <div className='flex'>
                      <button style={{ background: '#ECECEC' }} className="text-lg rounded py-2 px-4">{service.category}</button>
                      {service.domicile && (
                        <button style={{ color: '#2DB742', background: '#ABEAB5' }}>Service à domicile</button>
                      )}
                    </div>
                    <br />
                    <h1>{service.title}</h1>
                    <br />
                    <p>{service.description}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between p-4">
                    <h1 style={{ fontSize: '250%' }} className="font-bold">{service.price} €</h1>
                    <span style={{ color: '#EAEAEA' }}>Durée {service.dureeRDV}</span>
                    <Link href={'/dashboard_pro/services/modifierService'}>
                      <button style={{ width: '150px' }} className="cursor-pointer bg-black text-lg text-white rounded py-3 px-6 mt-4">Modifier</button>
                    </Link>
                    <br />
                    <Link href={'/dashboard_pro/services/modifierService'}>
                      <button style={{ background: '#EAEAEA', width: '150px' }} className="cursor-pointer text-lg text-black rounded py-3 px-6 mt-4">Supprimer</button>
                    </Link>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <p>Aucun service disponible.</p>
          )}
        </div>
      </div>
      <br />
      <br />
    </TabsContent>
  );
};