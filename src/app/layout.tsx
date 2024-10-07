import type { ReactNode } from "react";
import type { Metadata } from "next";

import { Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";

import { UserContextProvider } from "@/components/providers";

import { Toaster } from "@/components/ui/custom-toast";

import "@/app/globals.css";
import { DateProvider } from "@/contexts/dateContext";
import { CartProvider } from "@/contexts/cart-global";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MyFlair",
    template: "%s - MyFlair",
  },
  description: "Le réseau des coiffeurs",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <UserContextProvider session={session}>
        <DateProvider>
          <CartProvider>
            <html lang="fr">
              <body className={poppins.className}>
                {children}
                <Toaster />
              </body>
            </html>
          </CartProvider>
        </DateProvider>
      </UserContextProvider>
    </SessionProvider>
  );
}
