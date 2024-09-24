"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BusinessBooster } from "@prisma/client";

interface ClientBusinessBoosterProps {
    businessBooster: BusinessBooster;
}

export default function ClientBusinessBooster({ businessBooster }: ClientBusinessBoosterProps) {
    const [isReserved, setIsReserved] = useState(false);
    const handleReserve = () => setIsReserved(true);

    return (
        <div className="space-y-2">
            <div className="align-end flex w-full justify-end">
                <Button className="w-[200px]">Choisir une date</Button>
            </div>
            <div className="flex w-full justify-end">
                <Button
                    className="w-[200px]"
                    onClick={handleReserve}
                    disabled={isReserved}
                >
                    {isReserved ? "Réservé" : "Réserver"}
                </Button>
            </div>
        </div>
    );
}