'use client';
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
import axios from "axios";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

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

    fetchCartItems();
  }, [user?.id]);

  const deleteCartItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/delete/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const createCheckOutSession = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    if (!stripe) {
      console.error('Stripe.js failed to load.');
      setLoading(false);
      return;
    }
    try {
      const checkoutSession = await axios.post("/api/stripe", {
        item: items,
        userId: user?.id
      });
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.id,
      });
      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

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
          {items.length > 0 ? (
            items.map((item, index) => (
              <DropdownMenuItem key={index}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span style={{ fontWeight: '700' }}>
                      {item.product.additionalService?.title || item.product.formation?.[0]?.title || item.product.businessBooster?.title || 'Produit sans titre'}
                    </span>
                    <div className="flex">
                      <span>
                        {item.product.additionalService?.price || item.product.formation?.[0]?.price || item.product.businessBooster?.price || '0'} € x
                      </span>
                      {item.quantity}
                    </div>
                  </div>
                  <div className="">
                    <img
                      src="/cart/trash-2-3.svg"
                      alt="Supprimer"
                      className="flex justify-end cursor-pointer"
                      onClick={() => deleteCartItem(item.id)}
                    />
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem>Panier vide</DropdownMenuItem>
          )}
          <div className='flex justify-end mt-4'>
            {clientSecret && (
              <Elements stripe={stripePromise}></Elements>
            )}
            <Button
              onClick={createCheckOutSession}
              className=" block w-full py-2 rounded mt-2"
            >
              {loading ? "En cours" : "Acheter"}
            </Button>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
