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
import DisplayFormations from './displayData';
import { DateRange } from 'react-day-picker';
import { TrashIcon } from 'lucide-react';

interface Formation {
  image: string;
  alt?: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  deposit: number;
  dates: string[];
}

const AddFormation = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formation, setFormation] = useState<Formation>({
    image: '',
    alt: '',
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    deposit: 0,
    dates: [],
  });
  const [images, setImages] = useState<File[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const [dates, setDates] = useState<DateRange[]>([]);

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

  const formatDates = (dates: DateRange[]): string[] => {
    return dates.flatMap(({ from, to }) => {
      if (!from || !to) return [];
      return eachDayOfInterval({ start: from, end: to }).map(date =>
        format(date, 'yyyy-MM-dd')
      );
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formattedDates = formatDates(dates);
      const response = await axios.post('/api/formation/create', { ...formation, dates: formattedDates }, {
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

                      {dates.length > 0 && <p className='mt-6'>Dates ajoutées:</p>}
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

                      <Button
                        className="flex justify-start mt-6"
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
                            <img src={formation.image} alt={formation.alt} className="h-32 w-32 object-cover" />
                          ) : (
                            <p>Déposez votre image ici ou cliquez pour en télécharger une</p>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileInputChange}
                          accept="image/*"
                          className="hidden"
                        />
                        {images.length > 0 && (
                          <Button variant="destructive" onClick={handleDelete}>
                            Supprimer l'image
                          </Button>
                        )}
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
