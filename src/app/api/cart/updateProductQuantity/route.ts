// pages/api/updateProductQuantity.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }


    const product = await prisma.product.findUnique({
      where: { stripeId: productId }, 
      include: {
        additionalService: true, 
        formation: true,        
        businessBooster: true   
      }
    });

    
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    
    if (product.additionalService) {
      await prisma.additionalService.update({
        where: { idStripe: product.stripeId },
        data: { quantity: { decrement: 1 } }, 
      });
    }

    if (product.formation) {
      await prisma.formation.update({
        where: { idStripe: product.stripeId },
        data: { quantity: { decrement: 1 } },
      });
    }

    if (product.businessBooster) {
      await prisma.businessBooster.update({
        where: { idStripe: product.stripeId },
        data: { quantity: { decrement: 1 } }, 
      });
    }


    return NextResponse.json({ message: "Quantities updated successfully" });
  } catch (error: any) {
    console.error('Error updating product quantity:', error);
    return NextResponse.json({ error: 'Error updating product quantity' }, { status: 500 });
  }
}
