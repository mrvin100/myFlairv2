// Types pour les entités principales

export interface User {
    id: string;
    name: string;
    email: string;
    // Ajoutez d'autres propriétés selon vos besoins
}

export interface Post {
    id: string;
    title: string;
    description: string;
    price: number;
    // Ajoutez d'autres propriétés selon vos besoins
}

export interface Reservation {
    id: string;
    postId: string;
    userId: string;
    price: number;
    date: Date;
    // Ajoutez d'autres propriétés selon vos besoins
}

export interface Booster {
    id: string;
    title: string;
    description: string;
    price: number;
    // Ajoutez d'autres propriétés selon vos besoins
}

export interface AdditionalService {
    id: string;
    title: string;
    description: string;
    price: number;
}


export interface ReservationWithPost {
    reservation: Reservation;
    post: Post | null;
}

export interface AdditionalServiceWithQuantity extends AdditionalService {
    quantity: number;
}

// Type pour le contexte du panier

export interface CartContextType {
    reservationsWithPosts: ReservationWithPost[];
    selectedBoosters: Booster[];
    selectedAdditionalServices: AdditionalServiceWithQuantity[];
    handleDeleteReservation: (id: string) => void;
    removeBooster: (id: string) => void;
    addBooster: (booster: Booster) => void;
    addAdditionalService: (service: AdditionalService) => void;
    removeAdditionalService: (id: string) => void;
    totalReservationPrice: number;
    totalBoosterPrice: number;
    totalAdditionalPrice: number;
    totalPrice: number;
}