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
import { format, addDays, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarBusinessBooster } from '@/components/calendarBusinessBooster';
import { TrashIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import DisplayFormations from './displayData';

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
  from: Date | null;
  to: Date | null;
}

const AddFormation = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  const [dates, setDates] = useState<Date[]>([]);

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
      throw new Error("Les variables d'environnement Cloudinary ne sont pas correctement configurées.");
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
      console.error("Erreur lors du téléchargement de l'image :", error);
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
        console.error("Erreur lors du téléchargement de l'image :", error);
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
  
      const generatedDates = dateRange.from && dateRange.to
        ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
        : [];

      const formattedDates = generatedDates.map((date) => ({
        date: format(date, 'yyyy-MM-dd'),
        quantity: formation.quantity
      }));

      const response = await axios.post('/api/formation/create', {
        ...formation,
        dates: formattedDates,
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
                      <br />
                      <label>Prix</label>
                      <br />
                      <br />
                      <Input
                        className="rounded outline-none"
                        type="number"
                        value={formation.price}
                        onChange={(e) => handleFormationChange('price', e.target.value)}
                        placeholder="Ex: 250"
                        required
                      />
                      <br />
                      <label>Acompte à verser</label>
                      <br />
                      <br />
                      <Input
                        className="rounded outline-none"
                        type="number"
                        value={formation.deposit}
                        onChange={(e) => handleFormationChange('deposit', e.target.value)}
                        placeholder="Ex: 50"
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
                        placeholder="Ex: 10"
                      />
                      <br />
                      <label>Description</label>
                      <br />
                      <br />
                      <ReactQuill
                        value={formation.description}
                        onChange={(value) => handleFormationChange('description', value)}
                        placeholder="Rédiger votre description..."
                      />
                      <br />
                      <label>Date</label>
                      <Popover>
                        <div className="grid gap-2 mt-6">
                          <CalendarBusinessBooster dateRange={dateRange} setDateRange={setDateRange} />
                        </div>
                      </Popover>
                      <p className="mt-6">Dates:</p>
                          {dates.length > 0 && (
                            <div className="flex items-center gap-2">
                          <p>
                             Du {format(dates[0], "dd LLL y", { locale: fr })} au {format(dates[dates.length - 1], "dd LLL y", { locale: fr })}
                          </p>
                            <Button size="icon" variant="destructive" onClick={() => setDates([])}>
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                            </div>
                            )}

                      <Button onClick={() => {
                        if (dateRange.from && dateRange.to) {
                          setDates(eachDayOfInterval({ start: dateRange.from, end: dateRange.to }));
                        }
                      }}>
                        Ajouter les dates
                      </Button>
                      <br />
                      <label>Image</label>
                      <br />
                      <br />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-dashed border-2 p-6 flex justify-center items-center rounded-md ${images.length > 0 ? 'border-green-500' : 'border-gray-300'}`}
                      >
                        {images.length > 0 ? (
                          <div className="flex flex-col justify-center items-center">
                            <img src={URL.createObjectURL(images[0])} alt="Image de la formation" className="h-20 mb-2 object-cover" />
                            <p>{images[0].name}</p>
                            <Button size="icon" variant="destructive" onClick={handleDelete}>
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <p className="text-center">Cliquez ici pour ajouter une image</p>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </div>
                      <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Ajout en cours...' : 'Ajouter la formation'}
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <DisplayFormations/>
        </div>
      </TabsContent>
    </div>
  );
};

export default AddFormation;
