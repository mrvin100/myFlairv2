import { prisma } from '@/lib/prisma';
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    if (req.method === "POST") {
        const body = await req.json();
        const { 
            title, 
            description, 
            weekPrice, 
            saturdayPrice, 
            stock, 
            image, 
            durationWeekStartHour, 
            durationWeekStartMinute, 
            durationWeekEndHour, 
            durationWeekEndMinute, 
            durationSaturdayStartHour, 
            durationSaturdayStartMinute, 
            durationSaturdayEndHour, 
            durationSaturdayEndMinute, 
            valide 
        } = body;

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

            const createdProduct = await prisma.product.create({
                data: {
                    stripeId: weekProduct.id,
                    prodType: 'POST'
                },
            });

            // Création du post dans la base de données
            const createdPost = await prisma.post.create({
                data: {
                    title,
                    weekPrice,
                    saturdayPrice,
                    stock,
                    valide,
                    description,
                    durationWeekStartHour,
                    durationWeekStartMinute,
                    durationWeekEndHour,
                    durationWeekEndMinute,
                    durationSaturdayStartHour,
                    durationSaturdayStartMinute,
                    durationSaturdayEndHour,
                    durationSaturdayEndMinute,
                    image,
                    product: { connect: { stripeId: weekProduct.id } } 
                },
            });
            const createdRoom = await prisma.room.create({
                data: {
                    name: title,
                    stock,
                    post: { connect: { id: createdPost.id } }
                },
            });

            return NextResponse.json({ 
                weekProduct, 
                weekPrice: weekPriceObj, 
                weekendProduct, 
                weekendPrice: weekendPriceObj,
                message: 'Post et salle créés avec succès',
                postData: createdPost 
            }, { status: 201 });
            
        } catch (error) {
            console.error('Erreur lors de la création du post et de la salle:', error);
            return NextResponse.json({ error: 'Erreur lors de la création du post et de la salle' }, { status: 500 });
        }
    }
}
