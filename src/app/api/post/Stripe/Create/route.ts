import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

 export async function POST(req: Request) {
    if (req.method === "POST") {
        const body = await req.json();
        const { title, description, weekPrice, saturdayPrice, image } = body;

        try {
            const weekProduct = await stripe.products.create({
                name: `${title} - Week`,
                description: description,
                images: [image]
            });

            const weekPriceObj = await stripe.prices.create({
                unit_amount: parseInt(weekPrice) * 100,
                currency: 'eur',
                product: weekProduct.id,
            });

            const weekendProduct = await stripe.products.create({
                name: `${title} - Weekend`,
                description: description,
                images: [image],
            });

            const weekendPriceObj = await stripe.prices.create({
                unit_amount: parseInt(saturdayPrice) * 100,
                currency: 'eur',
                product: weekendProduct.id,
            });
           console.log(weekProduct.id)
           console.log(weekendProduct.id)
          
            return NextResponse.json({ 
                weekProduct, 
                weekPrice: weekPriceObj, 
                weekendProduct, 
                weekendPrice: weekendPriceObj 
            });
            
        } catch (error) {
            return NextResponse.json({ error: '500' });
        }
    }
}
