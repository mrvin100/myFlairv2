"use client";

import React, { useEffect, useState } from 'react';

interface OrderSummary {
    reservations: Array<{ title: string; price: number }>;
    boosters: Array<{ name: string; price: number }>;
    additionalServices: Array<{ title: string; quantity: number; price: number }>;
    totalReservationPrice: number;
    totalBoosterPrice: number;
    totalAdditionalPrice: number;
    totalPrice: number;
}

const SuccessPage: React.FC = () => {
    const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

    useEffect(() => {
        const storedOrderSummary = localStorage.getItem('orderSummary');
        if (storedOrderSummary) {
            setOrderSummary(JSON.parse(storedOrderSummary));
            localStorage.removeItem('orderSummary');
        }
    }, []);
    console.log(orderSummary);

    if (!orderSummary)  return <div>Chargement du résumé de la commande...</div>;

    return (
        <div className="container mx-auto mt-10 text-center">
            <h1 className="text-3xl font-bold mb-4">Paiement réussi !</h1>
            <p className="text-xl mb-6">Merci pour votre achat. Votre transaction a été traitée avec succès.</p>
            
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Récapitulatif de votre commande :</h2>
                
                {orderSummary.reservations.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Réservations :</h3>
                        <ul className="space-y-2">
                            {orderSummary.reservations.map((item, index) => (
                                <li key={index} className="text-lg">
                                    {item.title} - Prix : {item.price}€
                                </li>
                            ))}
                        </ul>
                        <p className="text-lg font-bold mt-2">Total des réservations : {orderSummary.totalReservationPrice}€</p>
                    </div>
                )}

                {orderSummary.boosters.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Boosters :</h3>
                        <ul className="space-y-2">
                            {orderSummary.boosters.map((booster, index) => (
                                <li key={index} className="text-lg">
                                    {booster.name} - Prix : {booster.price}€
                                </li>
                            ))}
                        </ul>
                        <p className="text-lg font-bold mt-2">Total des boosters : {orderSummary.totalBoosterPrice}€</p>
                    </div>
                )}

                {orderSummary.additionalServices.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Services additionnels :</h3>
                        <ul className="space-y-2">
                            {orderSummary.additionalServices.map((service, index) => (
                                <li key={index} className="text-lg">
                                    {service.title} - Quantité : {service.quantity} - Prix : {service.price * service.quantity}€
                                </li>
                            ))}
                        </ul>
                        <p className="text-lg font-bold mt-2">Total des services additionnels : {orderSummary.totalAdditionalPrice}€</p>
                    </div>
                )}

                <p className="text-2xl font-bold mt-4">
                    Total de la commande : {orderSummary.totalPrice}€
                </p>
            </div>
        </div>
    );
};

export default SuccessPage;