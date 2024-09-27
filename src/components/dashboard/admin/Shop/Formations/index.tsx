import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReactQuill from 'react-quill';
import { Popover } from '@/components/ui/popover';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarBusinessBooster } from '@/components/calendarBusinessBooster';
import DisplayFormations from './displayData';
import { TrashIcon } from 'lucide-react';

interface Formation {
  image: string;
  alt?: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  deposit: number;
  startDate: string;
  endDate: string;
}
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const AddFormation = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formattedStartDate = from ? format(from, 'yyyy-MM-dd') : '';
  const formattedEndDate = to ? format(to, 'yyyy-MM-dd') : '';
  const [formation, setFormation] = useState<Formation>({
    image: '',
    alt: '',
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    deposit: 0,
    startDate: '',
    endDate: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  const handleFormationChange = (key: keyof Formation, value: any) => {
    setFormation((prevFormation) => ({
      ...prevFormation,
      [key]: value,
    }));
  };

  const handleDelete = () => {
    setImages([]);
    handleFormationChange('image', '');
  };

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
        handleFormationChange('image', imageUrl);
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error);
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { from, to } = dateRange;
      const formattedStartDate = from ? format(from, 'yyyy-MM-dd') : '';
      const formattedEndDate = to ? format(to, 'yyyy-MM-dd') : '';

      const response = await axios.post('/api/formation/create', {
        ...formation,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        toast.success('Formation ajoutée avec succès');
      } else {
        toast.error('Erreur lors de l\'ajout de la formation');
        console.log('Erreur lors de l\'ajout de la formation :', response.data);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la formation');
      console.error('Erreur :', error);
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
      handleFormationChange('image', imageUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image :', error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <TabsContent value="formations" className="space-y-4">
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Formations</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Ajouter</Button>
              </DialogTrigger>
              <DialogContent className="max-h-screen overflow-y-scroll">
                <DialogHeader>
                  <DialogTitle>Ajouter une formation</DialogTitle>
                  <DialogDescription>
                    <div>
                      <div>
                        <label>Titre de la formation</label>
                        <br />
                        <br />
                        <Input
                          className="rounded outline-none"
                          type="text"
                          value={formation.title}
                          onChange={(e) => handleFormationChange('title', e.target.value)}
                          placeholder="Exemple: Formation Canvas"
                          required
                        />
                      </div>
                      <br />
                      <label>Prix</label>
                      <br />
                      <br />
                      <Input
                        className='rounded outline-none'
                        type='number'
                        value={formation.price}
                        onChange={(e) => handleFormationChange('price', e.target.value)}
                        placeholder='Ex: 250'
                        required
                      />
                      <br />
                      <label>Acompte à verser</label>
                      <br />
                      <br />
                      <Input
                        className='rounded outline-none'
                        type='number'
                        value={formation.deposit}
                        onChange={(e) => handleFormationChange('deposit', e.target.value)}
                        placeholder='Ex: 50'
                        required
                      />
                      <br />
                      <label>Stocks</label>
                      <br />
                      <br />
                      <Input
                        type="number"
                        onChange={(e) => handleFormationChange('quantity', e.target.value)}
                        required
                        placeholder='Ex: 10'
                      />
                      <br />
                      <div>
                        <label>Description</label>
                        <br />
                        <br />
                        <ReactQuill
                          value={formation.description}
                          onChange={(value) => handleFormationChange('description', value)}
                          placeholder="Rédiger votre description..."
                        />
                      </div>
                      <br />
                      <label>Date</label>
                      <Popover>
                        <div className="grid gap-2 mt-6">
                          <CalendarBusinessBooster dateRange={dateRange} setDateRange={setDateRange} />
                        </div>
                      </Popover>
                      <p className='mt-6'>Date sélectionnée:</p>
                      {dateRange.from && dateRange.to && (
                        <div className="flex items-center gap-2">
                          {format(dateRange.from, 'dd LLL y', { locale: fr })} - {format(dateRange.to, 'dd LLL y', { locale: fr })}
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => setDateRange({ from: undefined, to: undefined })}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <Button
                        className="flex justify-start mt-6"
                        onClick={() => {
                          if (dateRange.from && dateRange.to) {
                            setFormation((prev) => ({
                              ...prev,
                              startDate: format(dateRange.from, 'yyyy-MM-dd'),
                              endDate: format(dateRange.to, 'yyyy-MM-dd'),
                            }));
                          }
                        }}
                        type="button"
                      >
                        Ajouter la date
                      </Button>
                      <br />
                      <div>
                        <label>Image</label>
                        <br />
                        <br />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          onDrop={handleDrop}
                          onDragOver={e => e.preventDefault()}
                          className={`border-dashed border-2 p-6 flex justify-center items-center rounded-md ${images.length > 0 ? 'border-green-500' : 'border-gray-300'}`}
                        >
                          {images.length > 0 ? (
                            <div className="flex flex-col justify-center items-center">
                              <img src={URL.createObjectURL(images[0])} alt="Image" className="w-32 h-32 object-cover" />
                              <Button onClick={handleDelete} variant="outline" className="mt-2">
                                Supprimer l'image
                              </Button>
                            </div>
                          ) : (
                            <p className="text-gray-500">Glissez et déposez votre image ou cliquez pour sélectionner un fichier.</p>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </div>
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="mt-4"
                      >
                        {isLoading ? 'Chargement...' : 'Ajouter la formation'}
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <DisplayFormations />
        </div>
      </TabsContent>
    </div>
  );
};

export default AddFormation;
