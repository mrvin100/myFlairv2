'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';  
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUserContext } from '@/contexts/user'; 
import Image from 'next/image';
import { Star, MapPin, Scissors, Image as ImageIcon, Phone, MessageCircle, Facebook, Instagram, Linkedin, Youtube, Share2, HeartIcon, User2Icon, Mail, Globe } from 'lucide-react';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import locale from 'antd/es/date-picker/locale/en_US';
import { fr } from 'date-fns/locale';


interface User {
  id: string;
  stripeCustomerId: string | null;
  image: string;
  gallery: string[];
  services: Service[];
  role: string;
  username: string;
  firstName: string;
  lastName: string;
  address: {
    city: string;
    country: string;
    street: string;
  };
  enterprise: string;
  homeServiceOnly: boolean;
  email: string;
  biography: string;
  phone: string;
  website: string;
  numberOfRate: number;
  preferences: {
    dates: {
      to: string;
      from: string;
    };
    notifications: {
      email: boolean;
      inApp: boolean;
    };
  };
  subscription: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  domicile: boolean;
  dureeRDV: string;
  userId: string;
}

interface Review {
  id: string;
  userId: string;
  professionalId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  author: User;
  professional: User;
  responses: ReviewResponse[];
}
interface ReviewResponse {
  id: string;
  reviewId: string;
  response: string;
  createdAt: string;
  updatedAt: string;
}
const ProfilPage = ({ params }: { params: { id: string } }) => {
  const { user: currentUser } = useUserContext(); // Utilisez le contexte pour obtenir l'utilisateur actuel
  const [user, setUser] = useState<User | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [response, setResponse] = useState<Record<string, string>>({});
  const [responseContent, setResponseContent] = useState<string>('');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);


    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/ProfilPro/${params.id}`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              'Expires': '0',
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data: User = await response.json();
          setUser(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
    
      if (params.id) {
        fetchUserData();
      }
    }, [params.id]);
    
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`/api/review/get/${params.id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setReviews(data);
          localStorage.setItem(`reviews_${params.id}`, JSON.stringify(data));
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
    
      if (params.id) {
        fetchReviews();
      }
    }, [params.id]);

  const handleSubmit = async () => {
    if (!currentUser) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour soumettre un avis.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
       const response = await fetch('/api/review/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          professionalId: params.id,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const result = await response.json();
      toast({
        title: 'Avis soumis',
        description: 'Votre avis a été soumis avec succès.',
      });

      setRating(0);
      setComment('');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la soumission de votre avis.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(() => {
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: 'Lien copié',
          description: 'Lien copié dans le presse-papiers !',
        });
      }).catch(() => {
        toast({
          title: 'Erreur',
          description: 'Impossible de copier le lien.',
          variant: 'destructive',
        });
      });
    }
  };



  const handleNavigate = () => {
    if (user?.address) {
      const address = `${user.address.street}, ${user.address.city}, ${user.address.country}`;
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const handleSendMessage = () => {
    window.location.href = `mailto:${user?.email}?subject=Contact%20depuis%20votre%20profil`;
  };

  const handleCall = () => {
    window.location.href = `tel:${user?.phone}`;
  };

  const groupedServices = user?.services?.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>) || {};

  const loadingAnimation = (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
    </div>
  );

  if (!user) {
    return loadingAnimation;
  }

  const handleResponseSubmit = async (reviewId: string) => {
    if (!currentUser) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour répondre.',
        variant: 'destructive',
      });
      return;
    }
  
    try {
      const res = await fetch('/api/review/response/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          response: responseContent,
        }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to submit response');
      }
  
      const newResponse = await res.json();
  
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, responses: [...review.responses, newResponse] }
            : review
        )
      );
  
      setResponseContent('');
      setRespondingTo(null);
      toast({
        title: 'Réponse soumise',
        description: 'Votre réponse a été soumise avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la soumission de votre réponse.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="h-full flex-1 flex-col space-y-8 pl-8 pr-2 pt-8 pb-8 md:flex">
      <Card className="w-full mx-auto border-hidden bg-white shadow-none">
        <CardContent className="p-6">
          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative col-span-2 aspect-[3/2]">
              <Image
                src={user.image}
                alt="Main profile image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <Button
                variant="secondary"
                className="absolute bottom-4 left-4 bg-white bg-opacity-75"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Voir la galerie
              </Button>
            </div>
            <div className="grid grid-rows-2 gap-4">
              {user.gallery.slice(0, 2).map((src, index) => (
                <div key={index} className="relative aspect-[3/2]">
                  <Image
                    src={src} 
                    alt={`Profile image ${index + 2}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        {/* Other components */}
        <div className="h-full flex-1 flex-col space-y-8 pl-8 pr-2 pt-8 pb-8 md:flex">
          {/* Main profile card */}
          <Card className="w-full mx-auto border-hidden bg-white shadow-none">
            <CardContent className="p-6">
             
              

              {/* Profile Info */}
              <div className="flex flex-col">
                <div className="flex items-start mb-4 md:mb-0">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={user.image} alt="Profile" className="object-cover" />
                  </Avatar>
                  <div className="max-w-lg">
                    <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({user.numberOfRate} avis)</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Scissors className="w-4 h-4 mr-1" />
                      <span>Coiffeuse</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{user.address.street}, {user.address.city}, {user.address.country}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-between mt-4">
                  <div className="flex space-x-2 mb-2">
                    <Button variant="outline" size="icon">
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Instagram className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Youtube className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>

                    {user.phone && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            window.location.href = `sms:${user.phone}`;
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleCall}>
                          <Phone className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                </div>
                </CardContent>
                </Card>
                <div className="mt-6">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="flex items-end">
                        <HeartIcon className="w-4 h-4 mr-2 mb-0.5"/> Donner un avis
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        <h1>Déposer un avis</h1>
                        <span className="mt-6 text-sm">Partager votre expérience</span>
                        <div className="flex items-center mt-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              onClick={() => setRating(star)}
                            />
                          ))}
                        </div>
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Écrivez votre avis ici..."
                          className="mt-4"
                        />
                        <Button
                          className="mt-4"
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          {loading ? 'Envoi en cours...' : 'Envoyer'}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="w-full mx-auto mt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Première colonne (3/4 de la largeur sur lg, 1/1 sur md) */}
                    <div className="lg:col-span-3 col-span-1 space-y-8 max-w-[800px]">
                      {/* À propos */}
                      <section>
                        <h2 className="text-2xl font-bold mb-4">À propos de {user.firstName} {user.lastName}</h2>
                        <p className="text-muted-foreground">
                          {user.biography}
                        </p>
                      </section>

                      {/* Services */}
                      <section>
                        <h2 className="text-2xl font-bold mb-4">Services</h2>

                        {Object.entries(groupedServices).map(([category, services]) => (
                          <div key={category} className="mb-6">
                            <Badge variant="secondary" className="mb-4">Catégorie : {category}</Badge>
                            {services.map((service) => (
                              <Card key={service.id} className="mb-4">
                                <CardContent className="p-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Badge variant="secondary" className="mb-2">{category}</Badge>
                                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {service.description}
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                      {service.domicile && (
                                        <Badge variant="outline" className="bg-green-100 text-green-800">Service à domicile</Badge>
                                      )}
                                      <div className="text-right mt-4">
                                        <p className="text-2xl font-bold">{service.price} €</p>
                                        <p className="text-sm text-muted-foreground">Durée : {service.dureeRDV}</p>
                                      </div>
                                      <Link href={`/back-up/servicePage/${service.id}`}>
                                        <Button className="mt-4">Réserver</Button>
                                      </Link>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}

                            <Button variant="link" className="mt-2">+ Voir plus de : {category} ...</Button>
                          </div>
                        ))}
                      </section>

                      {/* Avis section */}
                      <section className="space-y-6">
  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-bold">Avis</h2>
    <div className="flex items-center space-x-4">
      <span className="font-semibold">Score : 4 sur 5</span>
      <span className="text-muted-foreground">{reviews.length} avis client</span>
    </div>
  </div>
  {reviews.length === 0 ? (
    <p>Aucun avis pour le moment.</p>
  ) : (
    reviews.map((review) => (
      <div key={review.id} className="border p-4 rounded-lg mb-4">
        <div className="flex items-center space-x-4 mb-2">
          <Avatar className="w-10 h-10">
            {review.author?.image ? (
              <AvatarImage src={review.author.image} />
            ) : (
              <AvatarFallback className="bg-gray-400">
                {review.author?.firstName.charAt(0)}
                {review.author?.lastName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-semibold">
              {review.author?.firstName} {review.author?.lastName}
            </p>
            <p className="text-gray-500 text-sm">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p>{review.comment}</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Réponses</h3>
          {review.responses?.map((response) => (
            <div key={response.id} className="border p-2 rounded-lg mb-2">
              <div className="flex items-center space-x-4 mb-2">
                <Avatar className="w-8 h-8">
                  {review.professional?.image ? (
                    <AvatarImage src={review.professional.image} />
                  ) : (
                    <AvatarFallback className="bg-gray-400">
                      {review.professional?.firstName.charAt(0)}
                      {review.professional?.lastName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {review.professional?.firstName} {review.professional?.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(response.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
              <p>{response.response}</p>
            </div>
          ))}
        </div>
        {currentUser?.id === review.author?.id ||
        currentUser?.id === review.professional?.id ? (
          <div className="mt-4">
            <Textarea
              placeholder="Répondez à cet avis..."
              value={respondingTo === review.id ? responseContent : ''}
              onChange={(e) => setResponseContent(e.target.value)}
              className="mb-2"
            />
            <Button
              onClick={() => handleResponseSubmit(review.id)}
              variant="primary"
              size="sm"
              disabled={!responseContent.trim()}
            >
              Répondre
            </Button>
          </div>
        ) : null}

        
      </div>
    ))
  )}
  <Button variant="link" className="mt-2">
          + Voir plus d'avis ...
        </Button>
</section>
                    </div>

                    {/* Deuxième colonne (1/4 de la largeur sur lg) */}
                    <div className="lg:col-span-1 col-span-1">
                      <section className="sticky top-0 space-y-6">
                        {/* Hours of Operation */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow">
                          <h2 className="text-xl font-bold mb-4">Horaires d'ouverture</h2>
                          <div className="flex flex-col space-y-2">
                            
                          </div>
                        </div>

                        {/* Location Map */}
                        {user.address && (
                          <div className="bg-gray-100 p-4 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4">Localisation</h2>
                            <iframe
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(user.address.street + ', ' + user.address.city)}&z=15&output=embed`}
                              width="100%"
                              height="200"
                              frameBorder="0"
                              style={{ border: 0 }}
                              allowFullScreen
                              
                              tabIndex={0}
                            ></iframe>
                            <Button className="mt-4 w-full" onClick={handleNavigate}>
                              Y aller
                            </Button>
                          </div>
                        )}
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
  );
}

export default ProfilPage;