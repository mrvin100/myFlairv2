'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/cart-global";
import { AdditionalService } from "@prisma/client";
import { useState, useEffect } from "react";

const ButtonServiceAdd = ({ service }: { service: AdditionalService }) => {
    const { addAdditionalService } = useCart();
    const [quantity, setQuantity] = useState<number | string>("");
    
    useEffect(() => {
        setQuantity("0");
    }, []);

    const handleAddToCart = () => {
        const numQuantity = Number(quantity);
        if (!isNaN(numQuantity) && numQuantity > 0) {
            addAdditionalService(service, numQuantity);
        }
    };
    
    return ( 
        <div className="flex">
            <Input 
                placeholder="0" 
                onWheel={(e) => e.currentTarget.blur()} 
                className='bg-white mr-4 w-[70px]' 
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <Button onClick={handleAddToCart}>Ajouter au Panier</Button>
        </div>
    );
}

export default ButtonServiceAdd;