
'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ButtonServiceAdd = () => {
    return ( 
        <div className="flex">
            <Input placeholder="0" onWheel={(e) => e.currentTarget.blur()} className='bg-white mr-4 w-[70px]' type="number"/>
            <Button>Ajouter au Panier</Button>
        </div>
    );
}
 
export default ButtonServiceAdd;