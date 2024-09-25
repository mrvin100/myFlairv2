"use client"
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { PhoneInput } from '@/components/phone-input';
import { useSignUpFormContext } from '@/contexts/sign-up-form';
import { EyeClosedIcon, EyeOpenIcon, PersonIcon } from '@radix-ui/react-icons';
import { MailIcon, BuildingIcon, TrashIcon } from 'lucide-react';
import { UserRole } from '@prisma/client';
import fr from 'react-phone-number-input/locale/fr';

export default function Step2() {
  const form = useSignUpFormContext();
  const [hidden, setHidden] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Les variables d\'environnement Cloudinary ne sont pas correctement configurées.');
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
      console.error('Erreur lors du téléchargement de l\'image :', error);
      throw error;
    }
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const imageUrl = await uploadImage(files[0]);
        setImages([files[0]]);
        form.setValue('image', imageUrl);
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error);
      }
    }
  };

  const handleDelete = () => {
    setImages([]);
    form.setValue('image', '');
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
      form.setValue('image', imageUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image :', error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className="border-dashed border-2 border-gray-300 p-4"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
        {images.length > 0 ? (
          <div className="relative">
            <img
              src={URL.createObjectURL(images[0])}
              alt="Uploaded"
              className="max-w-full h-auto"
            />
            <TrashIcon
              className="absolute top-2 right-2 cursor-pointer"
              onClick={handleDelete}
            />
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500"
          >
            Cliquez pour télécharger une image
          </button>
        )}
      </div>

      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <>
                <div className="flex h-9 w-[200px] rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  <div className="flex items-center justify-center border-r px-3 py-1">
                    <PersonIcon className="h-4 w-4" />
                  </div>

                  <Input
                    {...field}
                    className="rounded-none rounded-br-md rounded-tr-md border-none px-3 py-1 pl-1.5"
                    placeholder="Nom d'utilisateur"
                    type="text"
                  />
                </div>
              </>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                className="w-[200px]"
                placeholder="Nom"
                type="text"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                className="w-[200px]"
                placeholder="Prénom"
                type="text"
              />
            </FormControl>
          </FormItem>
        )}
      />

      {form.getValues().role === UserRole.PROFESSIONAL && (
        <FormField
          control={form.control}
          name="enterprise"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex h-9 w-[200px] rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  <div className="flex items-center justify-center border-r px-3 py-1">
                    <BuildingIcon className="h-4 w-4" />
                  </div>

                  <Input
                    {...field}
                    className="rounded-none rounded-br-md rounded-tr-md border-none px-3 py-1 pl-1.5"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex h-9 w-[200px] rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        <div className="flex items-center justify-center border-r px-3 py-1">
                          <MailIcon className="h-4 w-4" />
                        </div>

                        <Input
                          {...field}
                          className="rounded-none rounded-br-md rounded-tr-md border-none px-3 py-1 pl-1.5"
                          placeholder="E-mail"
                          type="email"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>exemple@myflair.fr</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormMessage />
              </>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex h-9 w-[200px] rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        <div className="flex items-center justify-center border-r px-3 py-1">
                          {hidden ? (
                            <EyeClosedIcon
                              className="h-4 w-4"
                              onClick={() => setHidden(false)}
                            />
                          ) : (
                            <EyeOpenIcon
                              className="h-4 w-4"
                              onClick={() => setHidden(true)}
                            />
                          )}
                        </div>

                        <Input
                          {...field}
                          className="rounded-none rounded-br-md rounded-tr-md border-none px-3 py-1 pl-1.5"
                          placeholder="Mot de passe"
                          type={hidden ? 'password' : 'text'}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>&gt;= 8 caractères</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormMessage />
              </>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PhoneInput
                        {...field}
                        className="w-[200px]"
                        defaultCountry="FR"
                        labels={fr}
                        placeholder="Numéro de téléphone"
                      />
                    </TooltipTrigger>
                    <TooltipContent>01 23 45 67 89</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormMessage />
              </>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
