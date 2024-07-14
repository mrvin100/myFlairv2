import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId, quantity, idStripe, title, price } = body; 
    console.log("User ID:", userId);
    console.log("Product ID:", productId);

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId,
        },
      });
      console.log("Cart created for user:", userId);
    }

    console.log("Cart ID:", cart.id);

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: idStripe,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
      console.log("Product updated in cart");
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: idStripe,
          quantity: quantity,
          title: title,
          price: price,
        },
      });
      console.log("New product added to cart");
    }

    return NextResponse.json({ message: 'Product successfully added to cart' }, { status: 200 });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return NextResponse.json({ error: 'An error occurred while adding the product to the cart' }, { status: 500 });
  }
}
