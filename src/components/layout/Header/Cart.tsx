'use client'
import { useEffect, useState } from 'react';
import { ShoppingBagIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Prisma } from '@prisma/client';
import { useUserContext } from '@/contexts/user';
import { Button } from '@/components/ui/button';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";




const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);



type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        additionalService: {
          select: {
            title: true;
            price: true;
          };
        };
        formation: {
          select: {
            title: true;
            price: true;
          };
        };
        businessBooster: {
          select: {
            title: true;
            price: true;
          };
        };
      };
    };
  };
}>;



export default function Cart() {
  const { user } = useUserContext();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [clientSecret, setClientSecret] = useState("");


  useEffect(() => {
    fetchCartItems();
  }, [user]); 

  useEffect(() => {
    // Fetch the client secret from the server
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }), // sent ammount or sample 
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret)); // Set the received client secret in the state
  }, []);


  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  async function fetchCartItems() {
    if (user?.id) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/cart/get/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        const cartItems = await response.json();
        setItems(cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Error fetching cart items');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button style={{ padding: '10px' }} className='rounded-md hover:bg-gray-100'>
          <ShoppingBagIcon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[300px]" align="end">
        <DropdownMenuLabel className="font-semibold">Panier</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {error && <DropdownMenuItem>{error}</DropdownMenuItem>}
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <DropdownMenuItem key={index}>
                <div className="flex items-center justify-between">
  <div className="flex flex-col items-start justify-start">
    <span style={{ fontWeight: '700' }}>{item.product.additionalService?.title || item.product.formation?.title || item.product.businessBooster?.title || 'Produit sans titre'}</span>
    <div className="flex">
      <span>{item.product.additionalService?.price || item.product.formation?.price || item.product.businessBooster?.price || '0'} € x</span>
      {item.quantity}
    </div>
  </div>
  <div className="flex items-center justify-end">
    <img  src="/cart/trash-2-3.svg" alt="" className="flex justify-end" />
  </div>
</div>

              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem>Panier vide</DropdownMenuItem>
          )}
           <div className='flex justify-end mt-4'>
           {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
        
        </Elements>
      )}
</div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
