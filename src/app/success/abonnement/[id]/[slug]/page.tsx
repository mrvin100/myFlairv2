'use client';
import { useEffect, useState } from 'react'; 
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Confetti from 'react-dom-confetti';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useUserContext } from '@/contexts/user';

const SuccessResponse = () => {
    const [active, setActive] = useState(false); 
    const router = useRouter();
    const { user } = useUserContext()
    const getLastUrlSegment = () => window.location.pathname.split('/').pop();

    useEffect(() => {
        setActive(true);

        const subscriptionId = getLastUrlSegment();

        const validateSubscription = async () => {
            if (!subscriptionId || !user?.id) return;

            try {
              const response = await fetch(`/api/stripe/validateSubscription/${user?.id}/${subscriptionId}`);
              const result = await response.json();
  
                if (result.error) {
                    console.error(result.error);
                } else {
                }
            } catch (error) {
                console.error("Error validating subscription:", error);
            }
        };
  
        validateSubscription();
    }, []);

    const config = {
        angle: 360,
        spread: 360,
        startVelocity: 40,
        elementCount: 200,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "10px",
        perspective: "500px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };

    return (
        <div className="w-max-[75%]">
            <div className="flex justify-center items-center h-screen w-min-[500px] w-max-[75%]">
                <Card className="pl-8 pr-8 pt-8">
                    <CardContent className="flex flex-col justify-center items-center">
                    <Confetti active={active} config={config} />
                        <CheckCircle className="text-green-500 w-32 h-32" />
                        <b className="text-[200%] mt-4">Félicitations</b>
                        <span className="mt-4">L'achat de votre abonnement a bien été réalisé</span>
                    </CardContent>
                    <Separator />
                    
                    <CardFooter className='flex items-end justify-end mt-4'>
                        <Link href={'/dashboard/professional'}>
                            <Button>Continuer</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SuccessResponse;
