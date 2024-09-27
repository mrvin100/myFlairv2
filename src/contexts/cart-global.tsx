"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AdditionalService, BusinessBooster, Post, Reservation } from "@prisma/client";
import { deleteReservationById } from "@/data/reservation";

interface ReservationWithPost {
    reservation: Reservation;
    post: Post | null;
}

interface CartContextType {
    reservationsWithPosts: ReservationWithPost[];
    setReservationsWithPosts: React.Dispatch<React.SetStateAction<ReservationWithPost[]>>;
    selectedBoosters: BusinessBooster[];
    addBooster: (booster: BusinessBooster) => void;
    removeBooster: (boosterId: string) => void;
    handleDeleteReservation: (reservationId: string) => Promise<void>;
    totalReservationPrice: number;
    totalBoosterPrice: number;
    totalPrice: number;
    selectedAdditionalServices: AdditionalService[];
    addAdditionalService: (service: AdditionalService, quantity: number) => void;
    removeAdditionalService: (serviceId: string) => void;
    totalAdditionalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reservationsWithPosts, setReservationsWithPosts] = useState<ReservationWithPost[]>([]);
    const [selectedBoosters, setSelectedBoosters] = useState<BusinessBooster[]>([]);
    const [selectedAdditionalServices, setSelectedAdditionalServices] = useState<AdditionalService[] & { quantity: number }[]>([]);

    const addBooster = (booster: BusinessBooster) => {
        setSelectedBoosters(prev => [...prev, booster]);
    };

    const removeBooster = (boosterId: string) => {
        setSelectedBoosters(prev => prev.filter(booster => booster.id !== boosterId));
    };

    const addAdditionalService = (service: AdditionalService, quantity: number) => {
        setSelectedAdditionalServices(prev => [...prev, { ...service, quantity }]);
    };

    const removeAdditionalService = (serviceId: string) => {
        setSelectedAdditionalServices(prev => prev.filter(service => service.id !== serviceId));
    };

    const totalReservationPrice = reservationsWithPosts.reduce((total, reservation) =>
        total + reservation.reservation.price,
        0
    );

    const totalBoosterPrice = selectedBoosters.reduce((total, booster) =>
        total + booster.price,
        0
    );

    const totalAdditionalPrice = selectedAdditionalServices.reduce((total, service) =>
        total + service.price * service.quantity,
        0
    );

    const totalPrice = totalReservationPrice + totalBoosterPrice + totalAdditionalPrice;

    const handleDeleteReservation = async (reservationId: string) => {
        await deleteReservationById(reservationId);
        setReservationsWithPosts((prevReservations) =>
            prevReservations.filter((reservationPost) => reservationPost.reservation.id !== reservationId)
        );
    };

    return (
        <CartContext.Provider value={{
            reservationsWithPosts,
            setReservationsWithPosts,
            selectedBoosters,
            addBooster,
            removeBooster,
            handleDeleteReservation,
            totalReservationPrice,
            totalBoosterPrice,
            totalPrice,
            selectedAdditionalServices,
            addAdditionalService,
            removeAdditionalService,
            totalAdditionalPrice,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};