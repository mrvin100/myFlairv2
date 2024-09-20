"use client";

import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ReactQuill from 'react-quill';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DisplayClients from './displayData';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { Switch } from '@/components/ui/switch';

interface NewClient {
  lastName: string;
  firstName: string;
  nameOfSociety: string;
  image: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  password: string;
  role: string;
  homeServiceOnly: boolean; 
  billingAddress?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  preferences: {};
}

const AddClient = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [newClient, setNewClient] = useState<NewClient>({
    lastName: '',
    firstName: '',
    nameOfSociety: '',
    image: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    },
    phone: '',
    email: '',
    password: '',
    role: '',
    homeServiceOnly: false, 
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    preferences: {}
  });
  const [images, setImages] = useState<File[]>([]);

  const handleClientChange = (key: keyof NewClient, value: any) => {
    if (key === 'billingAddress') {
      setNewClient((prevNewClient) => ({
        ...prevNewClient,
        billingAddress: {
          ...prevNewClient.billingAddress,
          [value.field]: value.value,
        },
      }));
    } else {
      setNewClient((prevNewClient) => ({
        ...prevNewClient,
        [key]: value,
      }));
    }
  };

  const handleDelete = () => {
    setImages([]);
    handleClientChange('image', '');
  };

  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        'Cloudinary environment variables are not properly configured.'
      );
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

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const imageUrl = await uploadImage(files[0]);
        setImages([files[0]]);
        handleClientChange('image', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/utilisateur/create', newClient, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        toast.success('Nouveau client ajouté avec succès');
        setTimeout(() => {
          router.push('/dashboard/clients');
        }, 2000);
      } else {
        toast.error("Erreur lors de l'ajout du client");
        console.log('Error adding client:', response.data);
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout du client");
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1) {
      console.log("Vous ne pouvez sélectionner qu'une seule image.");
      return;
    }
    try {
      const imageUrl = await uploadImage(files[0]);
      setImages(files);
      handleClientChange('image', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <TabsContent value="clientList" className="space-y-3">
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Ajouter un Client</Button>
              </DialogTrigger>
              <DialogContent className="max-h-screen overflow-y-scroll">
                <DialogHeader>
                  <DialogTitle>Ajouter un client</DialogTitle>
                  <br />
                  <DialogDescription>
                    <div>
                      <label>
                        Prénom du client <span className="text-red-500">*</span>
                      </label>
                      <br />
                      <br />
                      <Input
                        className="rounded outline-none"
                        type="text"
                        value={newClient.firstName}
                        onChange={(e) =>
                          handleClientChange('firstName', e.target.value)
                        }
                        placeholder="Prénom du client"
                        required
                      /> 
                      <br />
                      <label>
                        Nom du client <span className="text-red-500">*</span>
                      </label>
                      <br />
                      <br />
                      <Input
                        className="rounded outline-none"
                        type="text"
                        value={newClient.lastName}
                        onChange={(e) =>
                          handleClientChange('lastName', e.target.value)
                        }
                        placeholder="Nom du client"
                        required
                      />
                      <br />
                  

                      <label>
                        Adresse <span className="text-red-500">*</span>
                      </label>
                      <br />
                      <br />
                      <Input
                        type="text"
                        onChange={(e) =>
                          handleClientChange('address', {
                            field: 'street',
                            value: e.target.value,
                          })
                        }
                        value={newClient.address.street}
                        placeholder="Rue"
                        required
                      />
                      <br />
                      <Input
                        type="text"
                        onChange={(e) =>
                          handleClientChange('address', {
                            field: 'city',
                            value: e.target.value,
                          })
                        }
                        value={newClient.address.city}
                        placeholder="Ville"
                        required
                      />
                      <br />
                      <Input
                        type="text"
                        onChange={(e) =>
                          handleClientChange('address', {
                            field: 'postalCode',
                            value: e.target.value,
                          })
                        }
                        value={newClient.address.postalCode}
                        placeholder="Code postal"
                        required
                      />
                      <br />
                      <Input
                        type="text"
                        onChange={(e) =>
                          handleClientChange('address', {
                            field: 'country',
                            value: e.target.value,
                          })
                        }
                        value={newClient.address.country}
                        placeholder="Pays"
                        required
                      />
                      <br />
                      <br />
                      <label>
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <br />
                      <br />
                      <Input
                        type="tel"
                        onChange={(e) =>
                          handleClientChange('phone', e.target.value)
                        }
                        value={newClient.phone}
                        placeholder="Numéro de téléphone"
                        required
                      />
                      <br />
                      <label>
                          Email <span className="text-red-500">*</span>
                        </label>
                        <br />
                        <br />
                        <Input
                          type="email"
                          onChange={(e) =>
                            handleClientChange('email', e.target.value)
                          }
                          value={newClient.email}
                          placeholder="Adresse email"
                          required
                        />
                        <br />
                        <label>
                          Mot de passe <span className="text-red-500">*</span>
                        </label>
                        <br />
                        <br />
                        <div className="flex items-center border rounded-md">
                          <div className="flex items-center justify-center border-r px-3 py-1">
                            {hidden ? (
                              <EyeClosedIcon
                                className="h-4 w-4 cursor-pointer"
                                onClick={() => setHidden(false)}
                              />
                            ) : (
                              <EyeOpenIcon
                                className="h-4 w-4 cursor-pointer"
                                onClick={() => setHidden(true)}
                              />
                            )}
                          </div>
                          <Input
                            className="rounded-none rounded-br-md rounded-tr-md border-none px-3 py-1 pl-1.5"
                            type={hidden ? 'password' : 'text'}
                            value={newClient.password}
                            onChange={(e) =>
                              handleClientChange('password', e.target.value)
                            }
                            placeholder="Mot de passe"
                            required
                          />
                        </div>
                        <br />
                        <label>
                          Rôle <span className="text-red-500">*</span>
                        </label>
                        <br />
                        <br />
                        <Select
                          value={newClient.role}
                          onValueChange={(value) => handleClientChange('role', value)}
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionnez un rôle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Rôles</SelectLabel>
                              <SelectItem value="ADMINISTRATOR">Administrateur</SelectItem>
                              <SelectItem value="PROFESSIONAL">Professionel</SelectItem>
                              <SelectItem value="PERSONAL">Particulier</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <br />
                        {newClient.role === 'PROFESSIONAL' && (
                        <div>
                          <label htmlFor="">Nom de la société</label>
                          <br />
                          <br />
                          <Input
                            className="rounded outline-none"
                            type="text"
                            value={newClient.nameOfSociety}
                            onChange={(e) =>
                              handleClientChange('nameOfSociety', e.target.value)
                            }
                            placeholder="Nom de la société"
                          />
                          <br />
                          <label>Adresse de facturation</label>
                          <br /><br />
                          <Input
                            type="text"
                            onChange={(e) => handleClientChange('billingAddress', { field: 'street', value: e.target.value })}
                            value={newClient.billingAddress?.street || ''}
                            placeholder="Rue"
                          />
                          <br />
                          <Input
                            type="text"
                            onChange={(e) => handleClientChange('billingAddress', { field: 'city', value: e.target.value })}
                            value={newClient.billingAddress?.city || ''}
                            placeholder="Ville"
                          />
                          <br />
                          <Input
                            type="text"
                            onChange={(e) => handleClientChange('billingAddress', { field: 'lastName', value: e.target.value })}
                            value={newClient.billingAddress?.postalCode || ''}
                            placeholder="Code Postal"
                          />
                          <br />
                          <Input
                            type="text"
                            onChange={(e) => handleClientChange('billingAddress', { field: 'address', value: e.target.value })}
                            value={newClient.billingAddress?.country || ''}
                            placeholder="Pays"
                          />
                          <br />
                          <label>
                            Services à domicile uniquement
                          </label>
                          <br />
                      <br />
                      <Switch
                        checked={newClient.homeServiceOnly}
                        onCheckedChange={(checked) =>
                          handleClientChange('homeServiceOnly', checked)
                        }
                      />
                      <br />
                        </div>
                      )}
                        <Button
                          className="mt-4"
                          onClick={handleSubmit}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Enregistrement...' : 'Ajouter Client'}
                        </Button>
                        
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <DisplayClients />
          </div>
          </TabsContent>
        </div>
      
  
  );
};

export default AddClient;

