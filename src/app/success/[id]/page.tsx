"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  cartItems: CartItem[];
}

const SuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer l'URL actuelle et extraire le dernier segment
    const url = window.location.pathname;
    const segments = url.split('/');
    const session_id = segments[segments.length - 1]; // Le dernier élément de l'URL

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/stripe/get/${session_id}`);
        console.log('Order details fetched successfully:', response.data);
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la commande', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrderDetails(); 
  }, []);

  return (
    <div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        orderDetails ? (
          <div>
            <h1>Commande réussie</h1>
            {orderDetails.cartItems.map(item => (
              <div key={item.id}>
                <p>{item.title}</p>
                <p>{item.quantity}</p>
                <p>{item.price} €</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune commande trouvée.</p>
        )
      )}
    </div>
  );
}

export default SuccessPage;
