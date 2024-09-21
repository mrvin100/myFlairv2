'use client';
import { TabsContent } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Cloudinary } from '@cloudinary/url-gen';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import DisplayCategory from './displayData/page';

interface Category {
    title: string;
    imageLogo: string;
    imageMinia: string;
    key: string;
}

export default function Category() {
    const [categories, setCategories] = useState<Category[]>([
        {
            title: '',
            imageLogo: '',
            imageMinia: '',
            key: '',
        },
    ]);

    const [logoImages, setLogoImages] = useState<File[]>([]);
    const [miniatureImages, setMiniatureImages] = useState<File[]>([]);
    const fileInputRefLogo = useRef<HTMLInputElement>(null);
    const fileInputRefMiniature = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        try {
            const categoryData = categories[0];
            const response = await axios.post('/api/category/create', categoryData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                toast.success('Nouvelle catégorie ajoutée avec succès');
            } else {
                toast.error('Erreur lors de l\'ajout de la catégorie');
                console.log('Error adding client:', response.data);
            }
        } catch (error) {
            toast.error('Erreur lors de l\'ajout de la catégorie');
            console.error('Error:', error);
        }
    };


    const handleCategoryChange = (index: number, key: keyof Category, value: any) => {
        const newCategories = [...categories];
        newCategories[index][key] = value;
        setCategories(newCategories);
    };

    const handleDeleteLogo = () => {
        setLogoImages([]);
        handleCategoryChange(0, 'imageLogo', '');
    };

    const handleDeleteMiniature = () => {
        setMiniatureImages([]);
        handleCategoryChange(0, 'imageMinia', '');
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
            console.error('Erreur lors du téléchargement de l\'image:', error);
            throw error;
        }
    };

    const handleFileInputChangeLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            try {
                const logoImageUrl = await uploadImage(files[0]);
                setLogoImages([files[0]]);
                handleCategoryChange(0, 'imageLogo', logoImageUrl);
            } catch (error) {
                console.error('Erreur lors du téléchargement de l\'image:', error);
            }
        }
    };

    const handleFileInputChangeMiniature = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            try {
                const miniatureImageUrl = await uploadImage(files[0]);
                setMiniatureImages([files[0]]);
                handleCategoryChange(0, 'imageMinia', miniatureImageUrl);
            } catch (error) {
                console.error('Erreur lors du téléchargement de l\'image:', error);
            }
        }
    };

    const handleDropLogo = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 1) {
            console.log("Vous ne pouvez sélectionner qu'une seule image.");
            return;
        }
        try {
            const logoImageUrl = await uploadImage(files[0]);
            setLogoImages(files);
            handleCategoryChange(0, 'imageLogo', logoImageUrl);
        } catch (error) {
            console.error("Erreur lors du téléchargement de l'image:", error);
        }
    };

    const handleDropMiniature = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 1) {
            console.log("Vous ne pouvez sélectionner qu'une seule image.");
            return;
        }
        try {
            const miniatureImageUrl = await uploadImage(files[0]);
            setMiniatureImages(files);
            handleCategoryChange(0, 'imageMinia', miniatureImageUrl);
        } catch (error) {
            console.error("Erreur lors du téléchargement de l'image:", error);
        }
    };

    const cld = new Cloudinary({ cloud: { cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME } });
    var myImageUrl = cld.image().toURL();

    return (
        <TabsContent value="category" className="space-y-4">
            <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Catégories</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Ajouter</Button>
                        </DialogTrigger>

                        <DialogContent className="max-h-screen overflow-y-scroll">
                            <DialogHeader>
                                <DialogTitle>Catégorie</DialogTitle>
                                <br />
                                <DialogDescription>
                                    {categories.map((category, index) => (
                                        <div key={index}>
                                            <div>
                                                <label>Titre de la Catégorie</label>
                                                <br />
                                                <br />
                                                <Input
                                                    className="rounded outline-none"
                                                    type="text"
                                                    value={category.title}
                                                    onChange={(e) => handleCategoryChange(index, 'title', e.target.value)}
                                                    placeholder="Exemple: Coiffure"
                                                    required
                                                />
                                            </div>
                                            <br />
                                            <div>
                                                <label>Logo de la Catégorie</label>
                                                <br />
                                                <br />
                                                <div
                                                    onClick={() => fileInputRefLogo.current?.click()}
                                                    onDrop={handleDropLogo}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    style={{
                                                        cursor: 'pointer',
                                                        width: '100%',
                                                        height: '100px',
                                                        border: '2px dashed #aaa',
                                                        borderRadius: '5px',
                                                        textAlign: 'center',
                                                        padding: '20px',
                                                        marginBottom: '20px',
                                                    }}
                                                >
                                                    <p className="flex items-center justify-center">
                                                        Cliquez ou glissez et déposez le logo ici
                                                    </p>
                                                </div>
                                                <input
                                                    ref={fileInputRefLogo}
                                                    type="file"
                                                    accept="image/jpeg, image/png, image/jpg, image/svg, image/webp"
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileInputChangeLogo}
                                                />

                                                {logoImages.length > 0 && (
                                                    <div>
                                                        {logoImages.map((file, index) => (
                                                            <div key={index} style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}>
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={file.name}
                                                                    style={{ width: '100px', height: 'auto', marginBottom: '5px' }}
                                                                    className="rounded-lg"
                                                                />

                                                                <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                                                                    <button className="rounded-full" style={{ padding: '5px', background: 'red' }} onClick={handleDeleteLogo}>
                                                                        <img src="/iconService/trashWhite.svg" alt="Delete" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <label>Miniature des Services</label>
                                            <br />
                                            <br />
                                            <div
                                                onClick={() => fileInputRefMiniature.current?.click()}
                                                onDrop={handleDropMiniature}
                                                onDragOver={(e) => e.preventDefault()}
                                                style={{
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    height: '100px',
                                                    border: '2px dashed #aaa',
                                                    borderRadius: '5px',
                                                    textAlign: 'center',
                                                    padding: '20px',
                                                    marginBottom: '20px',
                                                }}
                                            >
                                                <p className="flex items-center justify-center">
                                                    Cliquez ou glissez et déposez la miniature ici
                                                </p>
                                            </div>
                                            <input
                                                ref={fileInputRefMiniature}
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg, image/svg, image/webp"
                                                style={{ display: 'none' }}
                                                onChange={handleFileInputChangeMiniature}
                                            />

                                            {miniatureImages.length > 0 && (
                                                <div>
                                                    {miniatureImages.map((file, index) => (
                                                        <div key={index} style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}>
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={file.name}
                                                                style={{ width: '100px', height: 'auto', marginBottom: '5px' }}
                                                                className="rounded-lg"
                                                            />

                                                            <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                                                                <button className="rounded-full" style={{ padding: '5px', background: 'red' }} onClick={handleDeleteMiniature}>
                                                                    <img src="/iconService/trashWhite.svg" alt="Delete" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </DialogDescription>
                            </DialogHeader>
                            <Button className='flex items-end justify-end' type="submit" onClick={handleSubmit}>Ajouter</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
                <DisplayCategory />
            </div>
        </TabsContent>
    );
}

